from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from dotenv import load_dotenv
from sqlalchemy.orm import Session

from models.trip import Trip
from models.user import User
from database import SessionLocal, init_db
from services.kb_service import retrieve_and_generate

load_dotenv()

from services.trip_service import (
    calculate_daily_budget,
    get_trip_category,
    get_recommended_transport,
)
from services.bedrock_service import get_ai_recommendation
from services.auth_service import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user,
    get_db,
)


# =========================
# Request / Response Models
# =========================
class TripRequest(BaseModel):
    destination: str
    days: int
    budget: float
    travel_style: str

class AskRequest(BaseModel):
    question: str

class AskResponse(BaseModel):
    question: str
    answer: str
    documents: list[str]

class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


# =========================
# App
# =========================
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

init_db()


# =========================
# Health
# =========================
@app.get("/")
def home():
    return {"message": "Welcome to KelanaAI"}


@app.get("/health")
def health():
    return {"status": "OK"}


# =========================
# Auth
# =========================
@app.post("/api/v1/auth/register", status_code=status.HTTP_201_CREATED)
def register(request: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == request.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email sudah terdaftar",
        )

    user = User(
        name=request.name,
        email=request.email,
        password_hash=hash_password(request.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token(user.id)
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {"id": user.id, "name": user.name, "email": user.email},
    }


@app.post("/api/v1/auth/login")
def login(request: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email).first()
    if not user or not verify_password(request.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email atau password salah",
        )

    token = create_access_token(user.id)
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {"id": user.id, "name": user.name, "email": user.email},
    }


@app.get("/api/v1/auth/me")
def me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
    }


# =========================
# Trips — all protected
# =========================
@app.get("/api/v1/trips")
def list_trips(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Return only trips belonging to the authenticated user."""
    return db.query(Trip).filter(Trip.user_id == current_user.id).all()


@app.get("/api/v1/trips/{trip_id}")
def get_trip(
    trip_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if trip is None:
        raise HTTPException(status_code=404, detail=f"Trip {trip_id} not found")
    if trip.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Forbidden")
    return trip


@app.post("/api/v1/trips", status_code=status.HTTP_201_CREATED)
def create_trip(
    request: TripRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    daily_budget = calculate_daily_budget(request.budget, request.days)
    category     = get_trip_category(request.budget)

    get_recommended_transport(request.travel_style)   # side-effect / logging only

    ai_recommendation = get_ai_recommendation(
        destination=request.destination,
        days=request.days,
        budget=request.budget,
        travel_style=request.travel_style,
    )

    trip = Trip(
        user_id           = current_user.id,
        destination       = request.destination,
        days              = request.days,
        budget            = request.budget,
        category          = category,
        daily_budget      = daily_budget,
        travel_style      = request.travel_style,
        ai_recommendation = ai_recommendation,
    )
    db.add(trip)
    db.commit()
    db.refresh(trip)
    return trip


@app.put("/api/v1/trips/{trip_id}")
def update_trip(
    trip_id: int,
    request: TripRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if trip is None:
        raise HTTPException(status_code=404, detail=f"Trip {trip_id} not found")
    if trip.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Forbidden")

    trip.destination  = request.destination
    trip.days         = request.days
    trip.budget       = request.budget
    trip.category     = get_trip_category(request.budget)
    trip.daily_budget = calculate_daily_budget(request.budget, request.days)
    trip.travel_style = request.travel_style

    db.commit()
    db.refresh(trip)
    return trip


@app.delete("/api/v1/trips/{trip_id}")
def delete_trip(
    trip_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if trip is None:
        raise HTTPException(status_code=404, detail=f"Trip {trip_id} not found")
    if trip.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Forbidden")

    db.delete(trip)
    db.commit()
    return {"message": f"Trip {trip_id} deleted"}

# =========================
# Knowleage Base (Ask)
# =========================
@app.post("/api/v1/ask", response_model=AskResponse)
def ask_knowledge_base(request: AskRequest):
    try:
        result = retrieve_and_generate(request.question)
        return AskResponse(
            question=request.question,
            answer=result["answer"],
            documents=result["documents"],
        )
    except ClientError as exc:
        error = exc.response.get("Error", {})
        metadata = exc.response.get("ResponseMetadata", {})
        error_code = error.get("Code", "KnowledgeBaseError")
        error_message = error.get("Message", "No error message returned")
        request_id = metadata.get("RequestId", "unknown")
        http_status = metadata.get("HTTPStatusCode", "unknown")

        logger.exception(
            "Knowledge Base request failed: code=%s message=%s request_id=%s http_status=%s",
            error_code,
            error_message,
            request_id,
            http_status,
        )

        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Knowledge Base request failed: {error_code} - {error_message}",
        ) from exc

# =========================
# Misc (unchanged)
# =========================
@app.get("/api/v1/trip-categories")
def categories():
    return {"categories": ["Backpacker", "Standard", "Luxury"]}


@app.get("/api/v1/recommendations")
def recommendations():
    return {"recommendations": ["Tokyo Tower", "Mount Fuji", "Shibuya"]}


@app.get("/api/v1/transportations")
def transportations():
    return {"transportations": ["Bus", "Train", "Flight"]}
