from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timedelta
from pymongo import MongoClient
import os

# IMPORT ĐÚNG TỪ FILE CỦA CLAUDE
from advanced_ai import MainAIEngine, ItineraryRequest

app = FastAPI(title="Travel AI Engine - Mongoose Synced")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Kết nối MongoDB (Chỉnh sửa tên DB cho khớp với máy của ông)
MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017/")
DB_NAME = "Danasoul" # <--- TÊN DB CỦA ÔNG Ở ĐÂY
client = MongoClient(MONGODB_URI)
db = client[DB_NAME]

# Khởi tạo Engine
ai_engine = MainAIEngine(db)

class GenerateRequest(BaseModel):
    days: int
    destination: Optional[str] = "Da Nang"
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    budget: float
    interests: List[str]
    travel_style: Optional[str] = 'comfort'
    user_id: Optional[str] = 'guest'
    min_rating: Optional[float] = 3.0
    travel_pace: Optional[str] = 'moderate'

@app.post("/api/python/generate-itinerary")
def generate_itinerary(data: GenerateRequest):
    try:
        # Xử lý ngày tháng an toàn
        start = datetime.fromisoformat(data.start_date.replace("Z", "+00:00")) if data.start_date else datetime.now()
        end = datetime.fromisoformat(data.end_date.replace("Z", "+00:00")) if data.end_date else start + timedelta(days=data.days)

        req = ItineraryRequest(
            destination=data.destination,
            start_date=start,
            end_date=end,
            budget=data.budget,
            interests=data.interests,
            travel_style=data.travel_style,
            user_id=data.user_id,
            min_rating=data.min_rating,
            travel_pace=data.travel_pace
        )
        
        result = ai_engine.run_itinerary_generation(req)
        
        if not result:
            return {"success": False, "message": f"Không tìm thấy địa điểm phù hợp."}
            
        return {"success": True, "data": result['days']} 
        
    except Exception as e:
        print(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))