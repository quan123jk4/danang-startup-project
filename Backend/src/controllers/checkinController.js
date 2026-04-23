// File: controllers/checkinController.js
const CheckIn = require("../Models/Checkin");
const { Place } = require("../Models/Place");
const User = require("../Models/User");

const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

exports.createCheckIn = async (req, res) => {
  try {
    const { placeId, userLat, userLng, caption, media, rating } = req.body;
    const userId = req.user.id;

    // 1. Tìm địa điểm để lấy tọa độ gốc
    const place = await Place.findById(placeId);
    if (!place) {
      // BẮT BUỘC PHẢI CÓ CHỮ "return" ĐỂ DỪNG CODE
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy địa điểm" });
    }

    if (
      !place.location ||
      !place.location.coordinates ||
      place.location.coordinates.length !== 2
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Lỗi hệ thống: Địa điểm này chưa được cài đặt tọa độ gốc (GPS) trong Database!",
      });
    }

    // 2. Tính toán khoảng cách
    const placeLng = place.location.coordinates[0];
    const placeLat = place.location.coordinates[1];
    const distance = getDistance(userLat, userLng, placeLat, placeLng);

    if (isNaN(distance) || distance > 150) {
      return res.status(400).json({
        success: false,
        message: `Bạn chưa đến đúng địa điểm! Khoảng cách hiện tại là ${Math.round(distance || 0)}m. Vui lòng di chuyển lại gần hơn (dưới 150m).`,
        currentDistance: Math.round(distance || 0),
      });
    }

    // 3. Kiểm tra giới hạn thời gian (Rules: 1 lần/tuần/1 địa điểm)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const existingCheckIn = await CheckIn.findOne({
      user: userId,
      place: placeId,
      createdAt: { $gte: sevenDaysAgo },
    });

    if (existingCheckIn) {
      return res.status(400).json({
        success: false,
        message:
          "Bạn đã check-in tại địa điểm này trong tuần qua rồi! Hãy quay lại vào tuần sau nhé.",
      });
    }

    // 4. LOGIC TÍNH ĐIỂM BONUS MỚI (Có tính rating)
    let points = 10; // Điểm cơ bản
    if (caption && media && media.length > 0 && rating) {
      points += 40; // Bonus max ping 40 điểm -> Tổng 50
    } else if (caption || (media && media.length > 0) || rating) {
      points += 10; // Bonus nhẹ 10 điểm -> Tổng 20
    }

    // 5. Lưu vào Database
    const newCheckIn = await CheckIn.create({
      user: userId,
      place: placeId,
      userLocation: { lat: userLat, lng: userLng },
      caption,
      media,
      rating: rating || 5,
      pointsEarned: points,
    });

    // Cập nhật điểm cho User
    await User.findByIdAndUpdate(userId, {
      $inc: { points: points },
    });

    // TRẢ VỀ KẾT QUẢ THÀNH CÔNG VÀ KẾT THÚC
    return res.status(201).json({
      success: true,
      message: `Check-in thành công! Bạn nhận được ${points} điểm thưởng.`,
      data: newCheckIn,
    });
  } catch (error) {
    console.error("🚨 CHI TIẾT LỖI CHECK-IN:", error);

    // LÁ CHẮN CHỐNG CRASH: Chỉ gửi lỗi 500 nếu như trước đó chưa gửi response nào
    if (!res.headersSent) {
      return res
        .status(500)
        .json({
          success: false,
          message: "Lỗi hệ thống",
          error: error.message,
        });
    }
  }
};
