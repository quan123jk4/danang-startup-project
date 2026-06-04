import math
import numpy as np
from datetime import datetime, timedelta
from typing import List, Dict
from dataclasses import dataclass
from sklearn.metrics.pairwise import cosine_similarity

# ==================== DATA MODELS ====================
@dataclass
class Place:
    id: str
    name: str
    category: str
    coordinates: List[float]
    rating: float
    minPrice: float 
    maxPrice: float
    address: str
    tags: List[str]
    image: str
    embedding: List[float] = None


@dataclass
class ItineraryRequest:
    destination: str
    start_date: datetime
    end_date: datetime
    budget: float
    interests: List[str]
    travel_style: str = "cultural"
    user_id: str = "guest"
    min_rating: float = 3.5
    travel_pace: str = 'moderate'


# ==================== USER PREFERENCE ANALYZER ====================
class UserPreferenceAnalyzer:
    def __init__(self):
        self.style_weights = {
            'luxury': {'price': 0.25, 'rating': 0.4, 'amenities': 0.35},
            'budget': {'price': 0.5, 'rating': 0.25, 'amenities': 0.25},
            'adventure': {'price': 0.2, 'rating': 0.3, 'amenities': 0.5},
            'cultural': {'price': 0.25, 'rating': 0.35, 'amenities': 0.4},
            'foodie': {'price': 0.2, 'rating': 0.25, 'amenities': 0.55},
            'relax': {'price': 0.35, 'rating': 0.35, 'amenities': 0.3},
            'một mình': {'price': 0.3, 'rating': 0.35, 'amenities': 0.35},
        }

    def analyze(self, req: ItineraryRequest) -> Dict:
        style = req.travel_style.lower() if req.travel_style else "cultural"
        weights = self.style_weights.get(style, self.style_weights['cultural'])
        return {
            'interests': req.interests,
            'travel_style': style,
            'weights': weights,
            'min_rating': req.min_rating,
            'pace': req.travel_pace
        }


# ==================== UTILITY FUNCTIONS ====================
def haversine_distance(coord1: List[float], coord2: List[float]) -> float:
    lng1, lat1 = coord1
    lng2, lat2 = coord2
    R = 6371
    lat1_rad, lat2_rad = math.radians(lat1), math.radians(lat2)
    delta_lat = math.radians(lat2 - lat1)
    delta_lng = math.radians(lng2 - lng1)
    a = math.sin(delta_lat/2)**2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(delta_lng/2)**2
    return R * (2 * math.asin(math.sqrt(a)))


def estimate_travel_time(distance_km: float) -> int:
    return max(10, int((distance_km / 30) * 60))


# ==================== SMART ITINERARY BUILDER ====================
class SmartItineraryBuilder:
    def __init__(self):
        self.MORNING_START = 9
        self.analyzer = UserPreferenceAnalyzer()
        
        self.ACTIVITY_DURATION = {
            'attraction': timedelta(minutes=120),
            'restaurant': timedelta(minutes=90),
            'hotel': timedelta(minutes=30),
            'entertainment': timedelta(minutes=150),
            'cafe': timedelta(minutes=60)
        }

    def calculate_place_score(self, place: Place, daily_budget: float, user_profile: Dict, user_embedding=None) -> float:
        score = 0.0
        weights = user_profile['weights']

        # Rating
        score += (place.rating / 5.0) * 30 * weights.get('rating', 0.3)

        # Interests + Embedding
        interest_score = 0.0
        if user_profile['interests'] and place.tags:
            matches = len(set(user_profile['interests']) & set(place.tags))
            interest_score += matches / max(len(user_profile['interests']), 1) * 0.65

        if user_embedding is not None and place.embedding:
            try:
                sim = cosine_similarity(user_embedding, np.array(place.embedding).reshape(1, -1))[0][0]
                interest_score += sim * 0.35
            except:
                pass

        score += min(interest_score, 1.0) * 40

        # Price
        avg_price = (place.minPrice + place.maxPrice) / 2 if place.maxPrice else place.minPrice
        if avg_price > 0 and daily_budget > 0:
            allowed = daily_budget * 0.35
            diff = abs(avg_price - allowed) / allowed
            price_score = max(0, 30 * (1 - min(diff, 1.5))) * weights.get('price', 0.3)
            score += price_score
        else:
            score += 20

        return min(score, 100)

    def optimize_route(self, day_places: List[Place]) -> List[Place]:
        if not day_places:
            return []
        if len(day_places) == 1:
            return day_places

        unvisited = list(day_places)
        route = []
        hotel = next((p for p in unvisited if p.category == 'hotel'), None)
        if hotel:
            unvisited.remove(hotel)
            route.append(hotel)
        else:
            route.append(unvisited.pop(0))

        current = route[-1]
        while unvisited:
            nearest = min(unvisited, key=lambda p: haversine_distance(current.coordinates, p.coordinates))
            route.append(nearest)
            unvisited.remove(nearest)
            current = nearest
        return route

    def build(self, req: ItineraryRequest, places: List[Place]) -> Dict:
        user_profile = self.analyzer.analyze(req)
        num_days = (req.end_date - req.start_date).days + 1
        daily_budget = req.budget / max(num_days, 1)

        # User embedding
        user_embedding = None
        if places and places[0].embedding:
            try:
                embs = [np.array(p.embedding) for p in places if p.embedding]
                if embs:
                    user_embedding = np.mean(embs[:10], axis=0).reshape(1, -1)
            except:
                pass

        # Scoring
        scored_places = [(place, self.calculate_place_score(place, daily_budget, user_profile, user_embedding)) 
                        for place in places]
        
        valid_places = sorted([p for p in scored_places if p[1] > 12], key=lambda x: x[1], reverse=True)  # Giảm ngưỡng

        places_per_day = {'slow': 3, 'moderate': 4, 'fast': 6}.get(req.travel_pace, 4)

        hotels = [p[0] for p in valid_places if p[0].category == 'hotel']
        activities = [p[0] for p in valid_places if p[0].category != 'hotel']

        itinerary_days = []
        activity_idx = 0

        for day_num in range(1, num_days + 1):
            day_places = []
            day_cost = 0.0

            if day_num == 1 and hotels:
                day_places.append(hotels[0])

            places_added = 0
            while places_added < places_per_day and activity_idx < len(activities):
                place = activities[activity_idx]
                price = place.minPrice or 150000

                if day_cost + price <= daily_budget * 1.6:   # Tăng giới hạn
                    day_places.append(place)
                    day_cost += price
                    places_added += 1
                activity_idx += 1

            optimized_route = self.optimize_route(day_places)

            # Build timeline
            day_items = []
            current_time = datetime(
                year=req.start_date.year, month=req.start_date.month, day=req.start_date.day,
                hour=self.MORNING_START, minute=0
            ) + timedelta(days=day_num - 1)

            for idx, place in enumerate(optimized_route):
                if idx > 0:
                    dist = haversine_distance(optimized_route[idx-1].coordinates, place.coordinates)
                    travel_mins = estimate_travel_time(dist)
                    current_time += timedelta(minutes=travel_mins)

                start_str = current_time.strftime("%H:%M")
                duration = self.ACTIVITY_DURATION.get(place.category, timedelta(minutes=90))
                current_time += duration
                end_str = current_time.strftime("%H:%M")

                day_items.append({
                    'place_id': place.id,
                    'title': place.name,
                    'category': place.category,
                    'time': f"{start_str} - {end_str}",
                    'description': f"Trải nghiệm {place.name} theo sở thích của bạn.",
                    'tags': [f"#{t}" for t in place.tags[:3]] if place.tags else ["#Danasoul"],
                    'image': place.image,
                    'estimated_cost': (place.minPrice + place.maxPrice) / 2,
                    'rating': place.rating,
                    'address': place.address,
                })

            itinerary_days.append({
                'dayNumber': f"0{day_num}" if day_num < 10 else str(day_num),
                'dayLabel': f"Ngày {day_num}",
                'items': day_items,
                'total_cost': round(day_cost, 2),
                'total_distance_km': 0
            })

        return {
            'title': f"{req.destination} - {num_days} Ngày",
            'destination': req.destination,
            'days': itinerary_days,
            'total_estimated_cost': round(sum(d['total_cost'] for d in itinerary_days), 2),
            'user_profile_summary': user_profile['travel_style']
        }


# ==================== MAIN ENGINE ====================
class MainAIEngine:
    def __init__(self, db):
        self.places_collection = db['places']
        self.builder = SmartItineraryBuilder()

    def fetch_places(self, destination: str, interests: List[str], min_rating: float) -> List[Place]:
        query = {'category': {'$in': ['hotel', 'restaurant', 'attraction', 'entertainment', 'cafe']}}
        
        docs = list(self.places_collection.find(query).limit(150))

        places = []
        for doc in docs:
            loc = doc.get('location', {})
            metrics = doc.get('metrics', {})
            
            image = "https://via.placeholder.com/500"
            if doc.get('images'):
                img_obj = doc['images'][0]
                image = img_obj.get('url') if isinstance(img_obj, dict) else img_obj

            places.append(Place(
                id=str(doc['_id']),
                name=doc.get('name', 'Unknown'),
                category=doc.get('category', 'attraction'),
                coordinates=loc.get('coordinates', [108.2022, 16.0544]),
                rating=max(metrics.get('rating', 4.0), 4.0),
                minPrice=metrics.get('price', 150000),
                maxPrice=metrics.get('price', 150000) * 1.6,
                address=loc.get('address', ''),
                tags=doc.get('tags', []),
                image=image,
                embedding=doc.get('embedding')
            ))

        print(f"🔍 Đã tải {len(places)} địa điểm từ MongoDB")
        return places

    def run_itinerary_generation(self, req: ItineraryRequest) -> Dict:
        places = self.fetch_places(req.destination, req.interests, req.min_rating)
        if not places:
            return {"error": "Không tìm thấy địa điểm"}
        return self.builder.build(req, places)