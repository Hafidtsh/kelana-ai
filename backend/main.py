from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from dotenv import load_dotenv
from sqlalchemy.orm import Session
import os

from models.trip import Trip
from models.user import User
from models.conversation import Conversation, Message
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
from services.conversation_service import (
    create_conversation,
    get_conversation,
    list_conversations,
    delete_conversation,
    add_message,
    get_messages,
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


# Conversation schemas
class ConversationCreate(BaseModel):
    title: str | None = None

class ConversationAskRequest(BaseModel):
    question: str

class MessageOut(BaseModel):
    id: int
    role: str
    content: str
    created_at: str          # ISO string

    class Config:
        from_attributes = True

class ConversationOut(BaseModel):
    id: int
    title: str | None
    created_at: str          # ISO string

    class Config:
        from_attributes = True

class ConversationDetailOut(BaseModel):
    id: int
    title: str | None
    created_at: str
    messages: list[MessageOut]

    class Config:
        from_attributes = True


# =========================
# App
# =========================
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        # Production frontend — set FRONTEND_URL in your deployment env vars
        *([os.getenv("FRONTEND_URL")] if os.getenv("FRONTEND_URL") else []),
    ],
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
# Conversations
# =========================

def _serialize_message(msg: Message) -> dict:
    return {
        "id": msg.id,
        "role": msg.role,
        "content": msg.content,
        "created_at": msg.created_at.isoformat(),
    }

def _serialize_conversation(convo: Conversation) -> dict:
    return {
        "id": convo.id,
        "title": convo.title,
        "created_at": convo.created_at.isoformat(),
    }


@app.get("/api/v1/conversations")
def list_convos(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List all conversations for the authenticated user (newest first)."""
    convos = list_conversations(db, current_user.id)
    return [_serialize_conversation(c) for c in convos]


@app.post("/api/v1/conversations", status_code=status.HTTP_201_CREATED)
def create_convo(
    body: ConversationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create a new empty conversation."""
    convo = create_conversation(db, user_id=current_user.id, title=body.title)
    return _serialize_conversation(convo)


@app.get("/api/v1/conversations/{conversation_id}")
def get_convo(
    conversation_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Return a conversation and all its messages."""
    convo = get_conversation(db, conversation_id, current_user.id)
    if convo is None:
        raise HTTPException(status_code=404, detail="Conversation not found")

    msgs = get_messages(db, conversation_id)
    return {
        **_serialize_conversation(convo),
        "messages": [_serialize_message(m) for m in msgs],
    }


@app.delete("/api/v1/conversations/{conversation_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_convo(
    conversation_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Delete a conversation and all its messages."""
    deleted = delete_conversation(db, conversation_id, current_user.id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Conversation not found")


@app.post("/api/v1/conversations/{conversation_id}/ask")
def ask_in_conversation(
    conversation_id: int,
    body: ConversationAskRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Send a question inside a conversation.
    Persists both the user message and the AI answer, then returns the answer.
    """
    convo = get_conversation(db, conversation_id, current_user.id)
    if convo is None:
        raise HTTPException(status_code=404, detail="Conversation not found")

    trimmed = body.question.strip()
    if not trimmed:
        raise HTTPException(status_code=422, detail="Question cannot be empty")

    # Persist user message
    add_message(db, conversation_id=conversation_id, role="user", content=trimmed)

    # Call Knowledge Base
    try:
        result = retrieve_and_generate(trimmed)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Knowledge Base error: {exc}",
        ) from exc

    # Persist assistant message
    ai_msg = add_message(
        db,
        conversation_id=conversation_id,
        role="assistant",
        content=result["answer"],
    )

    # Auto-set title from first question if still None
    if convo.title is None:
        short_title = trimmed[:60] + ("…" if len(trimmed) > 60 else "")
        convo.title = short_title
        db.commit()

    return {
        "question": trimmed,
        "answer": result["answer"],
        "documents": result["documents"],
        "message_id": ai_msg.id,
        "conversation_id": conversation_id,
    }


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
