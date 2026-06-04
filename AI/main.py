from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timedelta
from pymongo import MongoClient
import os

from advanced_ai import MainAIEngine, ItineraryRequest   # ← Đảm bảo tên file đúng

app = FastAPI(title="Danasoul AI Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

client = MongoClient(os.getenv("MONGODB_URI", "mongodb://localhost:27017/"))
db = client["Danasoul"]

ai_engine = MainAIEngine(db)

class GenerateRequest(BaseModel):
    days: int
    destination: Optional[str] = "Đà Nẵng"
    start_date: Optional[str] = None
    budget: float
    interests: List[str]
    travel_style: Optional[str] = None
    travel_pace: Optional[str] = "moderate"
    user_id: Optional[str] = "guest"


@app.post("/api/python/generate-itinerary")
async def generate_itinerary(data: GenerateRequest):
    try:
        start_date = datetime.fromisoformat(data.start_date.replace("Z", "")) if data.start_date else datetime.now()
        end_date = start_date + timedelta(days=data.days - 1)

        travel_style = data.travel_style or "cultural"
        if "một mình" in travel_style.lower():
            travel_style = "relax"
        elif "cặp đôi" in travel_style.lower():
            travel_style = "relax"
        elif "gia đình" in travel_style.lower():
            travel_style = "cultural"

        req = ItineraryRequest(
            destination=data.destination,
            start_date=start_date,
            end_date=end_date,
            budget=data.budget,
            interests=data.interests,
            travel_style=travel_style,
            travel_pace=data.travel_pace,
            user_id=data.user_id
        )

        result = ai_engine.run_itinerary_generation(req)

        return {
            "success": True,
            "data": result,
            "message": f"Đã tạo lịch trình {data.days} ngày thành công"
        }

    except Exception as e:
        print(f"❌ Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)