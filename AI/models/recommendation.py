import numpy as np
import pandas as pd
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

print("Đang tải mô hình Mạng nơ-ron (BERT)...")
model = SentenceTransformer('paraphrase-multilingual-MiniLM-L12-v2')
print("Tải BERT thành công!")

# Mock Database
data = {
    'id': list(range(1, 21)),
    'name': [
        'Bảo tàng Điêu khắc Chăm', 'Chùa Linh Ứng Sơn Trà', 'Biển Mỹ Khê', 'Cầu Rồng', 
        'Chợ Cồn', 'Hải sản Năm Đảnh', 'Cà phê Cộng - Bạch Đằng', 'Ngũ Hành Sơn', 
        'Đèo Hải Vân', 'Nhà thờ Con Gà', 'Công viên Châu Á', 'Chợ đêm Helio', 
        'Suối khoáng nóng Núi Thần Tài', 'Mì Quảng Bà Mua', 'Bánh xèo Bà Dưỡng', 'Bún chả cá 109', 
        'Trình Cà Phê', 'Sơn Trà Marina', 'Đỉnh Bàn Cờ', 'Cầu Tình Yêu'
    ],
    'category': [
        'tham_quan', 'tham_quan', 'vui_choi', 'tham_quan', 
        'am_thuc', 'am_thuc', 'ca_phe', 'tham_quan', 
        'tham_quan', 'tham_quan', 'vui_choi', 'vui_choi', 
        'vui_choi', 'am_thuc', 'am_thuc', 'am_thuc', 
        'ca_phe', 'ca_phe', 'tham_quan', 'vui_choi'
    ],
    'time_order': [1, 1, 2, 3, 2, 3, 3, 1, 1, 1, 3, 3, 1, 1, 2, 1, 2, 2, 1, 3],
    'price_level': [1, 0, 0, 0, 1, 2, 2, 1, 0, 0, 3, 2, 3, 1, 1, 1, 2, 3, 0, 0],
    'tags': [
        'văn hóa lịch sử kiến trúc di sản yên tĩnh khám phá', 'tâm linh phong cảnh thiên nhiên kiến trúc thanh tịnh',
        'thiên nhiên biển tắm biển check-in sôi động giải khuây', 'kiến trúc check-in biểu tượng thành phố ban đêm dạo mát',
        'văn hóa ẩm thực truyền thống mua sắm sầm uất', 'ẩm thực hải sản bình dân nhộn nhịp bia rượu',
        'cà phê check-in yên bình ngắm cảnh tâm sự buồn hoài cổ', 'tâm linh hang động núi non thiên nhiên lịch sử khám phá',
        'phong cảnh phượt thiên nhiên mạo hiểm núi đèo ngắm cảnh hùng vĩ', 'kiến trúc check-in tôn giáo trung tâm lịch sử yên tĩnh',
        'vui chơi giải trí mạo hiểm gia đình check-in ban đêm vòng quay', 'chợ đêm ăn vặt âm nhạc mua sắm nhộn nhịp ban đêm',
        'nghỉ dưỡng suối khoáng nóng thiên nhiên gia đình thư giãn', 'ẩm thực đặc sản truyền thống gia đình mỳ quảng nóng hổi',
        'ẩm thực đặc sản bình dân đông đúc bánh xèo nem lụi', 'ẩm thực truyền thống bình dân ăn sáng bún chả cá nóng hổi',
        'cà phê hoài cổ yên tĩnh chill tâm sự check-in retro', 'cà phê ngắm biển sang trọng check-in sống ảo hoàng hôn',
        'thiên nhiên hoang sơ ngắm cảnh phượt núi rừng mây', 'lãng mạn check-in ban đêm dạo mát cặp đôi tình yêu'
    ],
    'lat': [16.0601, 16.1001, 16.0609, 16.0610, 16.0695, 16.1015, 16.0650, 15.9995, 16.1912, 16.0664, 16.0396, 16.0375, 15.9734, 16.0614, 16.0565, 16.0660, 16.0592, 16.1130, 16.1265, 16.0621],
    'lng': [108.2234, 108.2773, 108.2471, 108.2272, 108.2140, 108.2450, 108.2245, 108.2605, 108.1342, 108.2232, 108.2274, 108.2265, 108.0163, 108.2045, 108.2163, 108.2120, 108.2183, 108.2616, 108.2785, 108.2270]
}
df_places = pd.DataFrame(data)
place_vectors = model.encode(df_places['tags'].tolist())

def get_recommendations(user_preference: str, top_n: int = 4, budget: str = "Vừa phải", companions: str = "Cặp đôi", cultural_focus: bool = False):
    # 1. Đo độ tương đồng ngữ nghĩa bằng BERT
    user_vector = model.encode([user_preference])
    similarity_scores = cosine_similarity(user_vector, place_vectors).flatten()
    
    df_result = df_places.copy()
    df_result['match_score'] = similarity_scores
    
    # 2. Áp dụng Luật (Rules)
    if budget == 'Tiết kiệm':
        df_result['match_score'] = np.where(df_result['price_level'] <= 1, df_result['match_score'] + 0.3, df_result['match_score'] - 0.2)
    elif budget == 'Cao cấp':
        df_result['match_score'] = np.where(df_result['price_level'] >= 2, df_result['match_score'] + 0.3, df_result['match_score'] - 0.2)
        
    if companions == 'Gia đình':
        df_result['match_score'] = np.where(df_result['tags'].str.contains('mạo hiểm|bia rượu|bar'), df_result['match_score'] - 0.4, df_result['match_score'])
        df_result['match_score'] = np.where(df_result['tags'].str.contains('gia đình|thư giãn|nghỉ dưỡng'), df_result['match_score'] + 0.3, df_result['match_score'])
    elif companions == 'Cặp đôi':
        df_result['match_score'] = np.where(df_result['tags'].str.contains('lãng mạn|cặp đôi|hoàng hôn'), df_result['match_score'] + 0.3, df_result['match_score'])

    if cultural_focus:
        df_result['match_score'] = np.where(df_result['tags'].str.contains('văn hóa|lịch sử|di sản|kiến trúc'), df_result['match_score'] + 0.5, df_result['match_score'])

    # 3. Trả về top N địa điểm có điểm cao nhất
    df_sorted = df_result.sort_values(by='match_score', ascending=False)
    return df_sorted.head(top_n).to_dict(orient='records')