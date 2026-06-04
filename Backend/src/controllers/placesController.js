const {
  Place,
  Hotel,
  Restaurant,
  Attraction,
  Entertainment,
} = require("../Models/Place");
const Review = require("../Models/Review");
const User = require("../Models/User");
const { escapeRegex, removeVietnameseTones } = require("../utils/searchHelper");
const xlsx = require("xlsx");
const fs = require("fs");

// 1. [POST] Tạo địa điểm mới
exports.createPlace = async (req, res) => {
  try {
    const data = req.body;

    // Chuyển link ảnh đơn (từ Frontend) thành mảng images để lưu trữ chuẩn
    if (data.image && typeof data.image === "string") {
      data.images = [data.image];
    }

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
          "Lỗi: Bắt buộc phải cung cấp location theo chuẩn GeoJSON với coordinates là mảng [Kinh độ, Vĩ độ]!",
      });
    }

    const [lng, lat] = data.location.coordinates;
    if (typeof lng !== "number" || typeof lat !== "number") {
      return res.status(400).json({
        success: false,
        message: "Lỗi dữ liệu: Kinh độ và Vĩ độ phải là định dạng số!",
      });
    }

    if (!data.category) {
      return res.status(400).json({
        success: false,
        message: "Lỗi dữ liệu: Bắt buộc phải cung cấp trường 'category'",
      });
    }

    let newPlace;
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
    const { keyword, category, lat, lng, limit } = req.query;
    let query = {};

    if (keyword) query.name = { $regex: keyword, $options: "i" };
    if (category) query.category = category.toLowerCase();

    let userLat = parseFloat(lat);
    let userLng = parseFloat(lng);
    let isDefaultLocation = false;
    if (limit === "all") {
      let places = await Place.find(query).sort({ createdAt: -1 });
      return res.status(200).json({
        success: true,
        count: places.length,
        isDefaultLocation: false,
        data: places,
      });
    }

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

    let places = await Place.find(query).sort({ rating: -1 }).limit(20);

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
    const place = await Place.findById(req.params.id);

    if (!place) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy thông tin địa điểm",
      });
    }

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
      images: place.images, // Kéo mảng ảnh ra
      tags: place.tags, // Kéo tags ra
    };

    if (place.category === "attraction") {
      responseData.ticketPrice = place.ticketPrice;
      responseData.tourDuration = place.tourDuration; // Thêm trường này
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

    try {
      const reviews = await Review.find({ place: place._id })
        .limit(5)
        .populate("user", "fullName avatar")
        .sort("-createdAt");
      responseData.recentReviews = reviews;
    } catch (reviewErr) {
      responseData.recentReviews = [];
    }

    res.status(200).json({
      success: true,
      data: responseData,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4. [GET] Tìm kiếm địa điểm
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
      ];
    }

    if (category) query.category = category.toLowerCase();

    // THÊM: select("... images tags") để UI có ảnh và tags render ra bảng
    let places = await Place.find(query)
      .select(
        "name category minPrice maxPrice rating address numReview images tags location",
      )
      .sort({ rating: -1, numReview: -1 })
      .limit(20);

    if (places.length === 0) {
      const suggestions = await Place.find({ rating: { $gte: 4 } })
        .select(
          "name category minPrice maxPrice rating address images tags location",
        )
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

// 5. [GET] Gợi ý ngân sách
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
    const price = place.minPrice
      ? (place.minPrice + place.maxPrice) / 2
      : place.ticketPrice || 0;

    if (price > 0) {
      if (price < 100000) priceTier = "Rẻ";
      else if (price <= 300000) priceTier = "Trung bình";
      else priceTier = "Cao cấp";
    }

    let budgetAdvice = `Mức chi tiêu trung bình tham khảo: ${price.toLocaleString("vi-VN")} VNĐ. Đây là mức giá ${priceTier}.`;

    if (userId) {
      const user = await User.findById(userId);
      if (
        user &&
        user.targetBudget !== null &&
        user.targetBudget !== undefined
      ) {
        const gap = price - user.targetBudget;
        if (gap > 0) {
          budgetAdvice = `Ê Quân, khoan! Chỗ này chi phí khoảng ${price.toLocaleString("vi-VN")}đ lận, cao hơn ngân sách ${user.targetBudget.toLocaleString("vi-VN")}đ cậu đặt ra ${gap.toLocaleString("vi-VN")}đ đấy. Suy nghĩ kỹ nhé!`;
        } else {
          budgetAdvice = `Tuyệt vời! Mức giá này hoàn toàn nằm trong ngân sách ${user.targetBudget.toLocaleString("vi-VN")}đ của bạn. Triển thôi!`;
        }
      }
    }

    res.status(200).json({
      success: true,
      data: { price, priceTier, budgetAdvice },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
exports.importPlacesFromExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Vui lòng upload file Excel!" });
    }

    const workbook = xlsx.readFile(req.file.path);
    let allFormattedPlaces = [];

    // Duyệt qua toàn bộ các Sheet có trong file Excel mới
    workbook.SheetNames.forEach((sheetName) => {
      const worksheet = workbook.Sheets[sheetName];
      // Sử dụng { header: 1 } để xuất dữ liệu dưới dạng mảng của các hàng
      const rows = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

      if (rows.length < 2) return; // Bỏ qua nếu sheet không có dữ liệu

      // Hàng 0 chứa danh sách tiêu đề cột: ['Mã Cốt Lõi (ID)', 'Tên Địa Danh (name)', ...]
      const headers = rows[0];

      // 1. TỰ ĐỘNG PHÂN LOẠI CATEGORY DỰA TRÊN TÊN SHEET FILE MỚI
      let currentCategory = "attraction";
      if (
        sheetName.toLowerCase().includes("attraction") ||
        sheetName.includes("Di tích")
      ) {
        currentCategory = "attraction";
      } else if (
        sheetName.toLowerCase().includes("restaurant") ||
        sheetName.includes("Ẩm thực")
      ) {
        currentCategory = "restaurant";
      } else if (
        sheetName.toLowerCase().includes("hotel") ||
        sheetName.includes("Lưu trú")
      ) {
        currentCategory = "hotel";
      } else if (
        sheetName.toLowerCase().includes("entertainment") ||
        sheetName.includes("Giải trí")
      ) {
        currentCategory = "entertainment";
      }

      // Duyệt qua các hàng dữ liệu từ hàng thứ 2 (Index 1) trở đi
      for (let i = 1; i < rows.length; i++) {
        const rowData = rows[i];
        if (!rowData || rowData.length === 0) continue;

        // Hàm helper tìm kiếm giá trị của ô dựa theo từ khóa nằm trong tiêu đề cột
        const getValueByHeaderKeyword = (keyword) => {
          const colIndex = headers.findIndex(
            (h) =>
              h && h.toString().toLowerCase().includes(keyword.toLowerCase()),
          );
          return colIndex !== -1 ? rowData[colIndex] : undefined;
        };

        // 2. BÓC TÁCH DỮ LIỆU CỦA BASE SCHEMA (DÙNG CHUNG)
        const name =
          getValueByHeaderKeyword("name") || getValueByHeaderKeyword("Tên");
        if (!name) continue; // Bỏ qua hàng lỗi nếu không bóc tách được tên địa danh

        // Trích xuất tọa độ địa lý (Xử lý an toàn: [Kinh độ - Lng, Vĩ độ - Lat])
        const rawLng =
          getValueByHeaderKeyword("longitude") ||
          getValueByHeaderKeyword("Kinh độ") ||
          getValueByHeaderKeyword("lng");
        const rawLat =
          getValueByHeaderKeyword("latitude") ||
          getValueByHeaderKeyword("Vĩ độ") ||
          getValueByHeaderKeyword("lat");
        const lng = Number(rawLng) || 108.2272; // Tọa độ dự phòng: Trung tâm Đà Nẵng
        const lat = Number(rawLat) || 16.0614;

        // Trích xuất mảng từ khóa AI Tags từ cột 'Tags'
        const rawTags =
          getValueByHeaderKeyword("tags") ||
          getValueByHeaderKeyword("Tags") ||
          "";
        const tagsArray = rawTags
          ? rawTags
              .toString()
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : ["Văn hóa", "Khám phá"];

        // 🌟 FIX CHỖ NÀY: TRÍCH XUẤT ẢNH TỪ EXCEL, KHÔNG CÓ MỚI LẤY MẶC ĐỊNH
        const rawImage =
          getValueByHeaderKeyword("imageUrl") ||
          getValueByHeaderKeyword("image") ||
          getValueByHeaderKeyword("ảnh") ||
          getValueByHeaderKeyword("Hình ảnh");

        const imagesArray =
          rawImage && rawImage.toString().trim()
            ? rawImage
                .toString()
                .split(",")
                .map((img) => img.trim())
                .filter(Boolean)
            : ["https://images.unsplash.com/photo-1555939594-58d7cb561ad1"]; // Ảnh mặc định hệ thống

        // Đóng gói cấu trúc Object dữ liệu nền tảng
        let placeData = {
          name: name.toString().trim(),
          category: currentCategory,
          address: (
            getValueByHeaderKeyword("address") ||
            getValueByHeaderKeyword("Địa chỉ") ||
            "Đà Nẵng, Việt Nam"
          )
            .toString()
            .trim(),
          minPrice:
            Number(
              getValueByHeaderKeyword("minPrice") ||
                getValueByHeaderKeyword("Giá Min"),
            ) || 0,
          maxPrice:
            Number(
              getValueByHeaderKeyword("maxPrice") ||
                getValueByHeaderKeyword("Giá Max"),
            ) || 0,
          rating:
            Number(
              getValueByHeaderKeyword("rating") ||
                getValueByHeaderKeyword("Đánh giá"),
            ) || 5,
          description: (
            getValueByHeaderKeyword("description") ||
            getValueByHeaderKeyword("Mô tả") ||
            "Điểm đến văn hóa đặc sắc nằm trong hệ sinh thái di sản Danasoul."
          )
            .toString()
            .trim(),
          tags: tagsArray,
          images: imagesArray, // 🌟 Gán mảng ảnh vừa bóc tách ở trên vào đây
          location: {
            type: "Point",
            coordinates: [lng, lat], // GeoJSON chuẩn: [Kinh độ, Vĩ độ]
          },
        };

        // 3. BÓC TÁCH DỮ LIỆU ĐẶC THÙ (DỰA VÀO DISCRIMINATOR CATEGORY)
        if (currentCategory === "attraction") {
          placeData.ticketPrice =
            Number(
              getValueByHeaderKeyword("ticketPrice") ||
                getValueByHeaderKeyword("Giá Vé"),
            ) || 0;
          placeData.tourDuration =
            Number(
              getValueByHeaderKeyword("tourDuration") ||
                getValueByHeaderKeyword("Thời Lượng"),
            ) || 90;
          placeData.historicalInfo = (
            getValueByHeaderKeyword("historicalInfo") ||
            getValueByHeaderKeyword("Thuyết Minh") ||
            ""
          )
            .toString()
            .trim();
          placeData.rules = (
            getValueByHeaderKeyword("rules") ||
            getValueByHeaderKeyword("Nội Quy") ||
            "Tuân thủ nội quy điểm tham quan."
          )
            .toString()
            .trim();

          const actRaw =
            getValueByHeaderKeyword("activities") ||
            getValueByHeaderKeyword("Hoạt Động") ||
            "";
          placeData.activities = actRaw
            ? actRaw
                .toString()
                .split(",")
                .map((a) => a.trim())
                .filter(Boolean)
            : [];
        } else if (currentCategory === "restaurant") {
          placeData.cuisineType = (
            getValueByHeaderKeyword("cuisineType") ||
            getValueByHeaderKeyword("Phân Loại") ||
            "Đặc sản địa phương"
          )
            .toString()
            .trim();
          placeData.serviceType = (
            getValueByHeaderKeyword("serviceType") ||
            getValueByHeaderKeyword("Hình Thức") ||
            "Gọi món"
          )
            .toString()
            .trim();
        } else if (currentCategory === "hotel") {
          const amRaw =
            getValueByHeaderKeyword("amenities") ||
            getValueByHeaderKeyword("Tiện Nghi") ||
            "";
          placeData.amenities = amRaw
            ? amRaw
                .toString()
                .split(",")
                .map((a) => a.trim())
                .filter(Boolean)
            : ["Wifi miễn phí", "Điều hòa nhiệt độ"];
        } else if (currentCategory === "entertainment") {
          placeData.activityType = (
            getValueByHeaderKeyword("activityType") ||
            getValueByHeaderKeyword("Loại Hình") ||
            "Vui chơi tổng hợp"
          )
            .toString()
            .trim();
          placeData.eventSchedule = (
            getValueByHeaderKeyword("eventSchedule") ||
            getValueByHeaderKeyword("Khung Giờ") ||
            "Tự do"
          )
            .toString()
            .trim();
        }

        allFormattedPlaces.push(placeData);
      }
    });

    if (allFormattedPlaces.length === 0) {
      if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      return res.status(400).json({
        success: false,
        message:
          "Không tìm thấy cấu trúc dữ liệu hợp lệ nào trong file Excel để nạp!",
      });
    }

    // 4. TIẾN HÀNH BULK INSERT VÀO MONGO DATABASE
    const result = await Place.insertMany(allFormattedPlaces);

    // Giải phóng file Excel tạm ra khỏi bộ nhớ máy chủ (thư mục uploads)
    if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);

    return res.status(200).json({
      success: true,
      message: `Hệ sinh thái Danasoul đã nạp dữ liệu thành công ${result.length} địa điểm từ file Excel!`,
    });
  } catch (error) {
    console.error("Lỗi đồng bộ dữ liệu Excel:", error);
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(500).json({
      success: false,
      message: "Gặp lỗi hệ thống khi bóc tách mảng cấu trúc Excel.",
      error: error.message,
    });
  }
};
exports.deletePlace = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Tìm và xóa địa điểm theo ID
    const deletedPlace = await Place.findByIdAndDelete(id);

    // Nếu không tìm thấy địa điểm trong DB
    if (!deletedPlace) {
      return res.status(404).json({
        success: false,
        message:
          "Không tìm thấy địa điểm này hoặc địa điểm đã bị xóa trước đó!",
      });
    }
    try {
      await Review.deleteMany({ place: id });
    } catch (reviewErr) {
      console.error("Lỗi khi dọn dẹp các review liên quan:", reviewErr.message);
    }
    return res.status(200).json({
      success: true,
      message: `Đã xóa thành công địa điểm "${deletedPlace.name}" và các dữ liệu liên quan khỏi hệ thống!`,
    });
  } catch (error) {
    console.error("Lỗi hệ thống khi xóa địa điểm:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi hệ thống máy chủ khi thực hiện thao tác xóa.",
      error: error.message,
    });
  }
};
