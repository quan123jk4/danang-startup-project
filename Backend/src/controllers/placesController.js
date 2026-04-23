const {
  Place,
  Hotel,
  Restaurant,
  Attraction,
  Entertainment,
} = require("../Models/Place");
const Review = require("../Models/Review"); // Chú ý: Đảm bảo ông có Model Review
const User = require("../Models/User");
const { escapeRegex, removeVietnameseTones } = require("../utils/searchHelper");

// 1. [POST] Tạo địa điểm mới (Đã update theo Discriminator)
exports.createPlace = async (req, res) => {
  try {
    const data = req.body;

    // LỚP BẢO VỆ 1: Kiểm tra chuẩn GeoJSON cho location
    if (
      !data.location ||
      data.location.type !== "Point" ||
      !data.location.coordinates ||
      !Array.isArray(data.location.coordinates) ||
      data.location.coordinates.length !== 2
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Lỗi tạo địa điểm: Bắt buộc phải cung cấp location theo chuẩn GeoJSON với coordinates là mảng [Kinh độ, Vĩ độ]!",
      });
    }

    const [lng, lat] = data.location.coordinates;
    if (typeof lng !== "number" || typeof lat !== "number") {
      return res.status(400).json({
        success: false,
        message: "Lỗi dữ liệu: Kinh độ và Vĩ độ phải là định dạng số!",
      });
    }

    // LỚP BẢO VỆ 2: Phải có category để biết tạo bằng Model con nào
    if (!data.category) {
      return res.status(400).json({
        success: false,
        message:
          "Lỗi dữ liệu: Bắt buộc phải cung cấp trường 'category' (hotel, restaurant, attraction, entertainment)",
      });
    }

    let newPlace;
    // RẼ NHÁNH TẠO DỮ LIỆU THEO MODEL CON
    switch (data.category.toLowerCase()) {
      case "hotel":
        newPlace = await Hotel.create(data);
        break;
      case "restaurant":
      case "cafe":
        newPlace = await Restaurant.create(data);
        break;
      case "attraction":
        newPlace = await Attraction.create(data);
        break;
      case "entertainment":
        newPlace = await Entertainment.create(data);
        break;
      default:
        // Trả về lỗi nếu gửi lên category lạ (vd: abc)
        return res.status(400).json({
          success: false,
          message: `Lỗi dữ liệu: Danh mục '${data.category}' không hợp lệ.`,
        });
    }

    res.status(201).json({
      success: true,
      message: "Tạo địa điểm thành công!",
      data: newPlace,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// 2. [GET] Lấy danh sách địa điểm (Tìm quanh đây = GPS)
exports.getAllPlaces = async (req, res) => {
  try {
    const { keyword, category, lat, lng } = req.query;
    let query = {};

    if (keyword) {
      query.name = { $regex: keyword, $options: "i" };
    }
    if (category) {
      query.category = category.toLowerCase();
    }

    let userLat = parseFloat(lat);
    let userLng = parseFloat(lng);
    let isDefaultLocation = false;

    // Alternative Flow: Mất định vị -> Lấy tọa độ Cầu Rồng (Đà Nẵng) làm tâm
    if (!userLat || !userLng || isNaN(userLat) || isNaN(userLng)) {
      userLat = 16.0614;
      userLng = 108.2272;
      isDefaultLocation = true;
    }

    query.location = {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [userLng, userLat],
        },
        $maxDistance: 20000, // 20km
      },
    };

    let places = await Place.find(query)
      .sort({ rating: -1 }) // Sort theo rating cao nhất
      .limit(20);

    if (places.length === 0) {
      const suggestions = await Place.find({ rating: { $gte: 4 } })
        .sort({ rating: -1 })
        .limit(5);

      return res.status(200).json({
        success: true,
        message: "Không tìm thấy kết quả phù hợp. Gợi ý các địa điểm nổi bật:",
        isDefaultLocation,
        data: suggestions,
      });
    }

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

// 3. [GET] Xem chi tiết địa điểm
exports.getPlaceDetail = async (req, res) => {
  try {
    // Truy vấn bằng bảng cha Place, nó sẽ tự động join trả về cả trường của bảng con
    const place = await Place.findById(req.params.id);

    if (!place) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy thông tin địa điểm",
      });
    }

    // Khởi tạo Object chứa dữ liệu cơ bản từ Bảng Cha
    let responseData = {
      _id: place._id,
      name: place.name,
      rating: place.rating,
      numReview: place.numReview,
      description: place.description,
      location: place.location.coordinates,
      address: place.address,
      category: place.category,
      phone: place.phone,
      minPrice: place.minPrice,
      maxPrice: place.maxPrice,
    };

    // Rẽ nhánh lấy thêm data TÙY THUỘC VÀO MODEL CON (Discriminator)
    if (place.category === "attraction") {
      responseData.ticketPrice = place.ticketPrice;
      responseData.activities = place.activities;
      responseData.historicalInfo = place.historicalInfo;
      responseData.rules = place.rules;
    } else if (place.category === "hotel") {
      responseData.amenities = place.amenities;
    } else if (place.category === "restaurant" || place.category === "cafe") {
      responseData.cuisineType = place.cuisineType;
      responseData.serviceType = place.serviceType;
    } else if (place.category === "entertainment") {
      responseData.activityType = place.activityType;
      responseData.eventSchedule = place.eventSchedule;
    }

    // Kéo thêm 5 Review mới nhất
    try {
      const reviews = await Review.find({ place: place._id })
        .limit(5)
        .populate("user", "fullName avatar")
        .sort("-createdAt");
      responseData.recentReviews = reviews;
    } catch (reviewErr) {
      responseData.recentReviews = []; // Nếu chưa có bảng Review thì gán rỗng để tránh văng app
    }

    res.status(200).json({
      success: true,
      data: responseData,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4. [GET] Tìm kiếm địa điểm (Không yêu cầu đăng nhập)
exports.searchPlaces = async (req, res) => {
  try {
    const { keyword, category } = req.query;
    let query = {};

    if (keyword) {
      const safeKeyword = escapeRegex(keyword);
      const noAccentKeyword = removeVietnameseTones(safeKeyword);
      query.$or = [
        { name: { $regex: safeKeyword, $options: "i" } },
        { description: { $regex: safeKeyword, $options: "i" } },
        // LƯU Ý: Phải tạo field searchString trong schema hoặc hook pre('save') nếu muốn dùng dòng dưới
        // { searchString: { $regex: noAccentKeyword, $options: "i" } },
      ];
    }

    if (category) query.category = category.toLowerCase();

    // Tối ưu tốc độ tải: select các trường cơ bản chung của Bảng Cha
    let places = await Place.find(query)
      .select("name category minPrice maxPrice rating address numReview")
      .sort({ rating: -1, numReview: -1 }) // Ưu tiên rating cao, review nhiều lên đầu
      .limit(20);

    if (places.length === 0) {
      const suggestions = await Place.find({ rating: { $gte: 4 } })
        .select("name category minPrice maxPrice rating address")
        .sort({ rating: -1 })
        .limit(5);

      return res.status(200).json({
        success: true,
        message:
          "Không tìm thấy kết quả phù hợp. Dưới đây là các địa điểm nổi bật gợi ý cho bạn:",
        isAlternative: true,
        data: suggestions,
      });
    }

    res.status(200).json({
      success: true,
      count: places.length,
      isAlternative: false,
      data: places,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Lỗi hệ thống", error: error.message });
  }
};

// 5. [GET] Gợi ý ngân sách cá nhân (Insights)
exports.getPlaceInsights = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user ? req.user.id : null;

    const place = await Place.findById(id);
    if (!place) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy địa điểm" });
    }

    let priceTier = "Chưa xác định";
    // Dùng average price nếu có min/max, nếu không lấy ticketPrice, nếu không bằng 0
    const price = place.minPrice
      ? (place.minPrice + place.maxPrice) / 2
      : place.ticketPrice || 0;

    if (price > 0) {
      if (price < 100000) priceTier = "Rẻ";
      else if (price <= 300000) priceTier = "Trung bình";
      else priceTier = "Cao cấp";
    }

    let budgetAdvice = `Mức chi tiêu trung bình tham khảo: ${price.toLocaleString("vi-VN")} VNĐ. Đây là mức giá ${priceTier}.`;

    // So sánh với ngân sách của user
    if (userId) {
      const user = await User.findById(userId);
      if (
        user &&
        user.targetBudget !== null &&
        user.targetBudget !== undefined
      ) {
        const gap = price - user.targetBudget;

        if (gap > 0) {
          // Lấy context user tên Quân từ file của ông
          budgetAdvice = `Ê Quân, khoan! Chỗ này chi phí khoảng ${price.toLocaleString("vi-VN")}đ lận, cao hơn ngân sách ${user.targetBudget.toLocaleString("vi-VN")}đ cậu đặt ra ${gap.toLocaleString("vi-VN")}đ đấy. Suy nghĩ kỹ nhé!`;
        } else {
          budgetAdvice = `Tuyệt vời! Mức giá này hoàn toàn nằm trong ngân sách ${user.targetBudget.toLocaleString("vi-VN")}đ của bạn. Triển thôi!`;
        }
      }
    }

    res.status(200).json({
      success: true,
      data: {
        price,
        priceTier,
        budgetAdvice,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
