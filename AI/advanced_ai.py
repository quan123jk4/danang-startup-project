import os
import math
import numpy as np
from datetime import datetime, timedelta
from typing import List, Dict, Tuple
from dataclasses import dataclass
from sklearn.metrics.pairwise import cosine_similarity

# ==================== DATA MODELS ====================
@dataclass
class Place:
    id: str
    name: str
    category: str
    coordinates: List[float]  # Khớp với Mongoose: [lng, lat]
    rating: float
    minPrice: float           # Khớp với Mongoose: minPrice
    maxPrice: float           # Khớp với Mongoose: maxPrice
    address: str
    tags: List[str]           # Khớp với Mongoose: tags
    image: str                # Lấy từ mảng images[0] của Mongoose để render UI
    amenities: List[str] = None
    ticketPrice: float = None
    activities: List[str] = None
    tourDuration: str = None

@dataclass
class ItineraryRequest:
    destination: str
    start_date: datetime
    end_date: datetime
    budget: float
    interests: List[str]
    travel_style: str
    user_id: str
    min_rating: float = 3.5
    travel_pace: str = 'moderate'

# ==================== UTILITY FUNCTIONS ====================
def haversine_distance(coord1: List[float], coord2: List[float]) -> float:
    """Tính khoảng cách (km) giữa 2 điểm [lng, lat]"""
    lng1, lat1 = coord1
    lng2, lat2 = coord2
    R = 6371
    lat1_rad, lat2_rad = math.radians(lat1), math.radians(lat2)
    delta_lat, delta_lng = math.radians(lat2 - lat1), math.radians(lng2 - lng1)
    a = math.sin(delta_lat/2)**2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(delta_lng/2)**2
    return R * (2 * math.asin(math.sqrt(a)))

def estimate_travel_time(distance_km: float) -> int:
    return max(15, int((distance_km / 30) * 60))

# ==================== AI ENGINES (Logic của Claude) ====================
class CollaborativeFilteringEngine:
    def __init__(self, user_prefs_collection):
        self.user_prefs_collection = user_prefs_collection
    
    def _preference_to_vector(self, pref: Dict) -> np.ndarray:
        vector = []
        cat_prefs = pref.get('preferred_categories', {})
        for cat in ['hotel', 'restaurant', 'attraction', 'entertainment']:
            vector.append(cat_prefs.get(cat, 0.5))
        vector.append(min(pref.get('average_budget_per_day', 3000000) / 10000000, 1.0))
        vector.append({'slow': 0, 'moderate': 0.5, 'fast': 1}.get(pref.get('travel_pace', 'moderate'), 0.5))
        vector.append(len(pref.get('favorite_cuisines', [])) / 10)
        return np.array(vector)

class SmartItineraryBuilder:
    def __init__(self):
        self.MORNING_START = 9
        # Thời gian chơi mặc định cho từng category (nếu Mongoose không có tourDuration)
        self.ACTIVITY_DURATION = {'attraction': 120, 'restaurant': 60, 'hotel': 0, 'entertainment': 90}
    
    def calculate_place_score(self, place: Place, user_prefs: Dict, interests: List[str]) -> float:
        score = (place.rating / 5) * 30
        tag_matches = len(set(place.tags) & set(interests))
        score += min(tag_matches / max(len(interests), 1), 1) * 30
        avg_price = (place.minPrice + place.maxPrice) / 2
        if avg_price > 0:
            score += max(0, 25 - (abs(avg_price - user_prefs.get('daily_budget', 1000)) / 1000) * 25)
        return min(score + 15, 100)
    
    def schedule_time_for_activity(self, category: str, current_hour: int) -> Tuple[str, str]:
        duration = self.ACTIVITY_DURATION.get(category, 60)
        end_hour = current_hour + (duration // 60)
        end_minute = duration % 60
        return f"{current_hour:02d}:00", f"{end_hour:02d}:{end_minute:02d}"
    
    def optimize_route(self, day_places: List[Place]) -> List[Place]:
        if len(day_places) <= 1: return day_places
        remaining = list(day_places)
        optimized = []
        current = next((p for p in remaining if p.category == 'hotel'), None)
        if current:
            remaining.remove(current)
            optimized.append(current)
        else:
            current = remaining.pop(0)
            optimized.append(current)
            
        while remaining:
            nearest = min(remaining, key=lambda p: haversine_distance(current.coordinates, p.coordinates))
            optimized.append(nearest)
            remaining.remove(nearest)
            current = nearest
        return optimized

    def build(self, req: ItineraryRequest, places: List[Place], user_prefs_collection) -> Dict:
        num_days = (req.end_date - req.start_date).days + 1
        daily_budget = req.budget / num_days
        
        user_prefs = user_prefs_collection.find_one({'user_id': req.user_id}) or {}
        user_prefs['daily_budget'] = daily_budget
        
        scored_places = [(place, self.calculate_place_score(place, user_prefs, req.interests)) for place in places]
        scored_places.sort(key=lambda x: x[1], reverse=True)
        
        places_per_day = len(places) // num_days + 1
        itinerary_days = []
        place_idx = 0
        
        hotels = [p for p in scored_places if p[0].category == 'hotel']
        activities = [p for p in scored_places if p[0].category != 'hotel']

        for day_num in range(1, num_days + 1):
            current_date = req.start_date + timedelta(days=day_num - 1)
            day_places = []
            day_cost = 0
            
            # 1. FIX HOTEL: Chỉ check-in khách sạn vào Ngày 1 (và KHÔNG tính tiền ks vào ngân sách ăn chơi hằng ngày để AI không bị nghèo)
            if day_num == 1 and hotels:
                top_hotel = hotels[0][0]
                day_places.append(top_hotel)
                # Tạm thời không cộng day_cost += top_hotel.minPrice ở đây để nhường budget cho chỗ đi chơi
            
            # 2. CHỌN CHỖ ĐI CHƠI
            for _ in range(min(places_per_day, len(activities))):
                if place_idx < len(activities):
                    place = activities[place_idx][0]
                    # Nới lỏng budget ra một chút (x1.5) để dễ hiển thị demo
                    if day_cost + place.minPrice <= daily_budget * 1.5:
                        day_places.append(place)
                        day_cost += place.minPrice
                        place_idx += 1
            
            optimized_places = self.optimize_route(day_places)
            day_items, current_hour, total_distance = [], self.MORNING_START, 0
            
            for idx, place in enumerate(optimized_places):
                travel_time = 0
                if idx > 0:
                    distance = haversine_distance(optimized_places[idx - 1].coordinates, place.coordinates)
                    travel_time = estimate_travel_time(distance)
                    total_distance += distance
                    current_hour += travel_time // 60
                
                start_time, end_time = self.schedule_time_for_activity(place.category, current_hour)
                
                # Format Tags đẹp cho UI
                display_tags = [f"#{t.strip().title().replace(' ', '')}" for t in place.tags[:3]] if place.tags else ["#Danasoul"]

                # Sửa câu mô tả cho đỡ ngô nghê
                desc = f"Nhận phòng và nghỉ ngơi tại {place.name}." if place.category == 'hotel' else f"Khám phá và trải nghiệm tại {place.name}."

                day_items.append({
                    'place_id': place.id, 
                    'title': place.name, 
                    'category': place.category,
                    'time': start_time, 
                    'description': desc,
                    'tags': display_tags,
                    'image': place.image,
                    'estimated_cost': (place.minPrice + place.maxPrice) / 2,
                    'rating': place.rating, 
                    'address': place.address,
                })
                current_hour = int(end_time.split(':')[0]) + 1
            
            itinerary_days.append({
                'dayNumber': f"0{day_num}" if day_num < 10 else str(day_num), 
                'dayLabel': f"Ngày {day_num}", 
                'items': day_items,
                'total_cost': day_cost, 
                'total_distance_km': round(total_distance, 2)
            })
            
        return {
            'title': f"{req.destination} - {num_days} ngày", 
            'destination': req.destination,
            'days': itinerary_days, 
            'total_estimated_cost': sum(d['total_cost'] for d in itinerary_days)
        }

class MainAIEngine:
    """ĐỒNG BỘ 100% VỚI MONGOOSE SCHEMA"""
    def __init__(self, db):
        self.places_collection = db['places']
        self.user_prefs_collection = db['user_preferences']
        self.builder = SmartItineraryBuilder()

    def fetch_places(self, destination: str, interests: List[str], min_rating: float) -> List[Place]:
        query = {
            'rating': {'$gte': min_rating},
            # Lấy địa điểm theo sở thích (tags) hoặc thuộc 4 category trong Mongoose của ông
            '$or': [
                {'tags': {'$in': interests}},
                {'category': {'$in': ['hotel', 'restaurant', 'attraction', 'entertainment']}}
            ]
        }
        docs = list(self.places_collection.find(query).limit(100))
        places = []
        for doc in docs:
            # Bắt đúng trường location.coordinates của Mongoose
            loc = doc.get('location', {})
            coords = loc.get('coordinates', [108.2234, 16.0601]) # Mặc định Đà Nẵng nếu thiếu
            
            # Bắt đúng mảng images của Mongoose
            images = doc.get('images', [])
            first_image = images[0] if images else "https://via.placeholder.com/500"

            places.append(Place(
                id=str(doc['_id']), 
                name=doc.get('name', 'Chưa rõ'), 
                category=doc.get('category', 'attraction'),
                coordinates=coords, 
                rating=doc.get('rating', 5.0),
                minPrice=doc.get('minPrice', 0), 
                maxPrice=doc.get('maxPrice', 0),
                address=doc.get('address', ''), 
                tags=doc.get('tags', []),
                image=first_image, # Truyền ảnh vào đây
                amenities=doc.get('amenities'), 
                ticketPrice=doc.get('ticketPrice'),
                activities=doc.get('activities'), 
                tourDuration=doc.get('tourDuration')
            ))
        return places

    def run_itinerary_generation(self, req: ItineraryRequest) -> Dict:
        places = self.fetch_places(req.destination, req.interests, req.min_rating)
        if not places: return None
        return self.builder.build(req, places, self.user_prefs_collection)