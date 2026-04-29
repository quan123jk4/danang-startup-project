// File: controllers/adminController.js
const User = require("../Models/User");
const Voucher = require("../Models/Voucher");
const Review = require("../Models/Review");
const { Place } = require("../Models/Place");

exports.getDashboardStats = async (req, res) => {
  try {
    // ==========================================
    // 1. THỐNG KÊ TỔNG QUAN (Như cũ)
    // ==========================================
    const totalUsers = await User.countDocuments();
    const totalPlaces = await Place.countDocuments();
    const activeVouchers = await Voucher.countDocuments();
    const pendingFeedbacks = await Review.countDocuments();

    const recentFeedbacks = await Review.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "fullName avatar")
      .populate("place", "name");

    const topPlaces = await Place.find().sort({ rating: -1 }).limit(3);

    // ==========================================
    // 2. TẠO DỮ LIỆU BIỂU ĐỒ 7 NGÀY QUA
    // ==========================================
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6); // Lấy 7 ngày bao gồm hôm nay
    sevenDaysAgo.setHours(0, 0, 0, 0);

    // Lọc User mới theo ngày
    const userStats = await User.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
              timezone: "+07:00",
            },
          },
          count: { $sum: 1 },
        },
      },
    ]);

    // Lọc Review (Xem như lượt tương tác/check-in) theo ngày
    const reviewStats = await Review.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
              timezone: "+07:00",
            },
          },
          count: { $sum: 1 },
        },
      },
    ]);

    // Tạo mảng 7 ngày liên tiếp để Frontend vẽ biểu đồ không bị đứt đoạn
    const chartData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0]; // Format: YYYY-MM-DD

      // Lấy tên thứ (T2, T3...)
      const dayName = d.toLocaleDateString("vi-VN", { weekday: "short" });

      const uCount = userStats.find((s) => s._id === dateStr)?.count || 0;
      const rCount = reviewStats.find((s) => s._id === dateStr)?.count || 0;

      chartData.push({
        name: dayName,
        newUsers: uCount,
        checkin: rCount,
      });
    }

    // ==========================================
    // 3. TẠO DỮ LIỆU HOẠT ĐỘNG & CẢNH BÁO
    // ==========================================
    let systemAlerts = [];

    // Lấy 2 user mới nhất
    const newestUsers = await User.find().sort({ createdAt: -1 }).limit(2);
    newestUsers.forEach((u) => {
      systemAlerts.push({
        id: `u-${u._id}`,
        type: "info",
        title: "Người dùng mới",
        msg: `${u.fullName || u.email} vừa gia nhập hệ thống.`,
        createdAt: u.createdAt,
      });
    });

    // Lấy 2 review mới nhất
    const newestReviews = await Review.find()
      .sort({ createdAt: -1 })
      .limit(2)
      .populate("user", "fullName");
    newestReviews.forEach((r) => {
      systemAlerts.push({
        id: `r-${r._id}`,
        type: r.rating >= 4 ? "success" : "warning", // Đánh giá cao thì xanh, thấp thì vàng
        title: "Đánh giá mới",
        msg: `${r.user?.fullName || "Khách"} vừa đánh giá ${r.rating} sao.`,
        createdAt: r.createdAt,
      });
    });

    // Sắp xếp lại danh sách hoạt động theo thời gian mới nhất giảm dần
    systemAlerts.sort((a, b) => b.createdAt - a.createdAt);

    // ==========================================
    // 4. TRẢ KẾT QUẢ VỀ
    // ==========================================
    res.status(200).json({
      success: true,
      data: {
        stats: { totalUsers, totalPlaces, activeVouchers, pendingFeedbacks },
        recentFeedbacks,
        topPlaces,
        chartData, // <-- Dữ liệu thật cho biểu đồ
        systemAlerts, // <-- Dữ liệu thật cho cảnh báo
      },
    });
  } catch (error) {
    console.error("Lỗi Dashboard API:", error);
    res
      .status(500)
      .json({ success: false, message: "Lỗi server", error: error.message });
  }
};
