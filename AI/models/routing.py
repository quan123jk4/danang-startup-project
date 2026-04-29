import math
import numpy as np
from sklearn.cluster import KMeans
from ortools.constraint_solver import routing_enums_pb2
from ortools.constraint_solver import pywrapcp

def haversine_distance(coord1, coord2):
    R = 6371000
    lat1, lon1 = math.radians(coord1[0]), math.radians(coord1[1])
    lat2, lon2 = math.radians(coord2[0]), math.radians(coord2[1])
    dlat, dlon = lat2 - lat1, lon2 - lon1
    a = math.sin(dlat / 2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return int(R * c)

def get_optimal_route(places, days=1):
    if not places: return []

    # 1. K-Means Load Balancing
    if days > 1 and len(places) >= days:
        coords = np.array([[p['lat'], p['lng']] for p in places])
        kmeans = KMeans(n_clusters=days, random_state=42, n_init=10)
        kmeans.fit(coords)
        centroids = kmeans.cluster_centers_
        
        dist_matrix = np.zeros((len(coords), len(centroids)))
        for i in range(len(coords)):
            for j in range(len(centroids)):
                dist_matrix[i][j] = np.linalg.norm(coords[i] - centroids[j])
        
        max_per_day = math.ceil(len(places) / days)
        day_counts = {d: 0 for d in range(days)}
        
        for i in range(len(places)):
            sorted_centroids = np.argsort(dist_matrix[i])
            for c in sorted_centroids:
                if day_counts[c] < max_per_day:
                    places[i]['day'] = int(c) + 1
                    day_counts[c] += 1
                    break
    else:
        for p in places:
            p['day'] = 1

    daily_itineraries = []
    
    # 2. OR-Tools TSP
    for d in range(1, days + 1):
        day_places = [p for p in places if p.get('day') == d]
        if not day_places: continue

        depot = {'id': 0, 'name': 'Khách sạn', 'lat': 16.0605, 'lng': 108.2208, 'time_order': 0, 'duration_mins': 0}
        all_locations = [depot] + day_places
        
        matrix = []
        for i in range(len(all_locations)):
            row = []
            for j in range(len(all_locations)):
                dist = haversine_distance(
                    (all_locations[i]['lat'], all_locations[i]['lng']), 
                    (all_locations[j]['lat'], all_locations[j]['lng'])
                )
                # Phạt thời gian nếu đi ngược Sáng/Chiều
                t_from = all_locations[i].get('time_order', 0)
                t_to = all_locations[j].get('time_order', 0)
                if j != 0 and t_to < t_from:
                    dist += 500000 
                row.append(dist)
            matrix.append(row)

        manager = pywrapcp.RoutingIndexManager(len(matrix), 1, 0)
        routing = pywrapcp.RoutingModel(manager)

        def distance_callback(from_index, to_index):
            return matrix[manager.IndexToNode(from_index)][manager.IndexToNode(to_index)]

        transit_callback_index = routing.RegisterTransitCallback(distance_callback)
        routing.SetArcCostEvaluatorOfAllVehicles(transit_callback_index)
        search_parameters = pywrapcp.DefaultRoutingSearchParameters()
        search_parameters.first_solution_strategy = routing_enums_pb2.FirstSolutionStrategy.PATH_CHEAPEST_ARC
        solution = routing.SolveWithParameters(search_parameters)

        if solution:
            index = routing.Start(0)
            route = []
            while not routing.IsEnd(index):
                node_index = manager.IndexToNode(index)
                route.append(all_locations[node_index])
                index = solution.Value(routing.NextVar(index))
            
            last_node = manager.IndexToNode(index)
            route.append(all_locations[last_node])
            
            daily_itineraries.append({
                "day": d,
                "route": route
            })

    return daily_itineraries