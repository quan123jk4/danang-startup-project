const Place = require("../Models/Place");
const Review = require("../Models/Review");

// 1. [POST] Tạo địa điểm mới (Dành cho Admin nạp dữ liệu)
exports.createPlace = async (req, res) => {
  try {
    const newPlace = await Place.create(req.body);
    res.status(201).json({
      success: true,
      data: newPlace,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// 2. [GET] Lấy danh sách địa điểm (Xử lý Search, Filter, Vị trí & Alternative Flow)
exports.getAllPlaces = async (req, res) => {
  try {
    const { keyword, category, lat, lng } = req.query;
    let query = {};

    // Bước 1: User nhập từ khóa hoặc chọn Danh mục
    if (keyword) {
      query.name = { $regex: keyword, $options: "i" };
    }
    if (category) {
      query.category = category;
    }

    // Bước 2: Xử lý vị trí (Ưu tiên gần nhất)
    let userLat = parseFloat(lat);
    let userLng = parseFloat(lng);
    let isDefaultLocation = false;

    // Alternative Flow: Mất định vị -> Lấy tọa độ Cầu Rồng (Đà Nẵng) làm tâm
    if (!userLat || !userLng || isNaN(userLat) || isNaN(userLng)) {
      userLat = 16.0614;
      userLng = 108.2272;
      isDefaultLocation = true;
    }

    // Truy vấn tìm kiếm quanh đây (bán kính 20km)
    query.location = {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [userLng, userLat], // MongoDB dùng chuẩn [Kinh độ, Vĩ độ]
        },
        $maxDistance: 20000,
      },
    };

    // Thực thi truy vấn và áp dụng Business Rules (Ưu tiên sự kiện, Rating cao)
    let places = await Place.find(query)
      .sort({ hasSpecialEvent: -1, rating: -1 })
      .limit(20);

    // Alternative Flow: Không tìm thấy kết quả -> Gợi ý
    if (places.length === 0) {
      const suggestions = await Place.find({ rating: { $gte: 4 } })
        .sort({ rating: -1 })
        .limit(5);

      return res.status(200).json({
        success: true,
        message: "Không tìm thấy kết quả phù hợp. Gợi ý các địa điểm nổi bật:",
        isDefaultLocation, // FE dùng biến này để nhắc User bật GPS
        data: suggestions,
      });
    }

    // Trả về danh sách thành công
    res.status(200).json({
      success: true,
      count: places.length,
      isDefaultLocation,
      data: places,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. [GET] Xem chi tiết địa điểm (Post-condition: Rẽ nhánh Free / Có phí)
exports.getPlaceDetail = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);

    if (!place) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy thông tin địa điểm",
      });
    }

    // Khởi tạo Object chứa dữ liệu cơ bản
    let responseData = {
      _id: place._id,
      name: place.name,
      images: place.images,
      rating: place.rating,
      description: place.description,
      location: place.location.coordinates,
      address: place.address,
      category: place.category,
      hasSpecialEvent: place.hasSpecialEvent,
    };

    // Post-condition: Rẽ nhánh theo Business Rule
    if (place.priceRange === "Free") {
      // Đối với địa điểm Miễn phí (Văn hóa, Di tích)
      responseData.historyInfo =
        place.historyInfo || "Đang cập nhật lịch sử hình thành...";
    } else {
      // Đối với Dịch vụ (Quán ăn, Khách sạn)
      responseData.price = place.price;
      responseData.priceRange = place.priceRange;
      responseData.highlights = place.highlights || [];

      // Kéo thêm 5 Review mới nhất để chứng minh chất lượng dịch vụ
      const reviews = await Review.find({ place: place._id })
        .limit(5)
        .populate("user", "fullName avatar")
        .sort("-createdAt");

      responseData.recentReviews = reviews;
    }

    res.status(200).json({
      success: true,
      data: responseData,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
