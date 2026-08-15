from fastapi import FastAPI
from pydantic import BaseModel

from services.trip_service import (
    calculate_daily_budget,
    get_trip_category,
    get_recommended_transport
)


# =========================
# Request Model
# =========================
class TripRequest(BaseModel):
    destination: str
    days: int
    budget: float
    travel_style: str


# =========================
# FastAPI App
# =========================
app = FastAPI()


# =========================
# Root Endpoint
# =========================
@app.get("/")
def home():
    return {
        "message": "Welcome to KelanaAI"
    }


# =========================
# Health Check
# =========================
@app.get("/health")
def health():
    return {
        "status": "OK"
    }
@app.get("/api/v1/trip-categories")
def categories():
    return{
        
         "categories": [
            "Backpacker",
            "Standard",
            "Luxury"
        ]   
    }
@app.get("/api/v1/recommendations")
def recommendations():
    return{
        
         "recommendations": [
            "Tokyo Tower",
            "Mount Fuji",
            "Shibuya"
        ]   
    }
@app.get("/api/v1/transportations")
def transportations():
    return{
        
         "transportations": [
            "Bus",
            "Train",
            "Flight"
        ]   
    }


# =========================
# Create Trip
# =========================
@app.post("/api/v1/trips")
def create_trip(request: TripRequest):

    daily_budget = calculate_daily_budget(
        request.budget,
        request.days
    )

    category = get_trip_category(
        request.budget
    )

    recommendation_transport = get_recommended_transport(
        request.travel_style
    )

    return {
        "destination": request.destination,
        "budget": request.budget,
        "daily_budget": daily_budget,
        "category": category,
        "recommendation_transport": recommendation_transport
    }