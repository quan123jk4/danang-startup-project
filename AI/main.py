from fastapi import FastAPI
from pydantic import BaseModel
from typing import List

# Import logic từ các thư mục con
from models.recommendation import get_recommendations
from models.routing import get_optimal_route

app = FastAPI(title="Danasoul AI API")

# --- 1. Cấu trúc Payload ---
class DatesReq(BaseModel):
    start: str
    end: str

class ItineraryRequest(BaseModel):
    days: int
    dates: DatesReq
    budget: str
    companions: str
    interests: List[str]
    culturalFocus: bool

# --- 2. Endpoint ---
@app.get("/")
def read_root():
    return {"status": "success", "message": "Hệ thống AI Danasoul đã sẵn sàng!"}

@app.post("/api/python/generate-itinerary")
def generate_itinerary(request: ItineraryRequest):
    days = request.days if request.days > 0 else 1
    top_places_needed = days * 3 
    
    # Nối mảng interests thành chuỗi cho BERT
    preferences_str = " ".join([tag.replace('#', '') for tag in request.interests])
    if not preferences_str:
        preferences_str = "khám phá ngắm cảnh"

    # GỌI MODULE 1: Khuyến nghị
    recommended_places = get_recommendations(
        user_preference=preferences_str, 
        top_n=top_places_needed,
        budget=request.budget,
        companions=request.companions,
        cultural_focus=request.culturalFocus
    )
    
    # GỌI MODULE 2: Xếp đường
    optimized_result = get_optimal_route(recommended_places, days=days)
    
    if not optimized_result:
        return {"success": False, "message": "Lỗi: Không thể chia đường đi."}
        
    # --- FORMAT KẾT QUẢ CHO REACT ---
    formatted_itinerary = []
    time_slots = ["08:30 AM", "02:00 PM", "07:30 PM", "09:00 PM"]
    item_id = 1
    images = [
        "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?q=80&w=500",
        "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=500",
        "https://images.unsplash.com/photo-1555921015-5532091f6026?q=80&w=500"
    ]

    for daily in optimized_result:
        day_num = daily.get('day', 1)
        route = daily.get('route', [])
        
        # Bỏ qua khách sạn (id = 0)
        actual_places = [p for p in route if p.get('id', -1) != 0]
        
        for idx, place in enumerate(actual_places):
            tags_str = place.get('tags', '')
            tag_list = tags_str.split() if tags_str else []
            display_tags = [f"#{t.capitalize()}" for t in tag_list[:2]]
            if not display_tags:
                display_tags = ["#Danasoul"]
                
            formatted_itinerary.append({
                "id": item_id,
                "dayNumber": f"0{day_num}" if day_num < 10 else str(day_num),
                "dayLabel": f"Ngày {day_num}",
                "time": time_slots[idx % len(time_slots)],
                "title": place.get('name', 'Địa điểm chưa rõ'),
                "description": f"Khoảng cách đã được tối ưu. Trải nghiệm {place.get('name', '')} cực kỳ phù hợp với sở thích của bạn.",
                "tags": display_tags,
                "image": images[item_id % len(images)] 
            })
            item_id += 1
            
    return {
        "success": True,
        "data": formatted_itinerary
    }