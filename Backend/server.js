const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const cron = require("node-cron");
require("dotenv").config();

// Import Services & Models
const { Place } = require("./src/Models/Place");
// Đảm bảo file dataPipeline.js (hoặc crawler.js) có export hàm này
const { syncPlacesData } = require("./src/services/crawler");

// Import Routes
const authRoutes = require("./src/routes/authRoutes");
const userRoutes = require("./src/routes/userRoutes");
const reviewRoutes = require("./src/routes/reviewRoutes");
const placeRoutes = require("./src/routes/placeRoutes");
const checkinRoutes = require("./src/routes/checkinRoutes");
const voucherRoutes = require("./src/routes/voucherRoutes");
const aiRoutes = require("./src/routes/aiRoutes");
const adminRoutes = require("./src/routes/adminRoutes");

const app = express();

// --- MIDDLEWARES ---
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(mongoSanitize());

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Bạn đã vượt quá số lần truy cập cho phép!",
});
app.use("/api/", apiLimiter);

// --- DATABASE CONNECTION & CRON JOB ---
mongoose
  .connect(process.env.DATABASE_URL)
  .then(async () => {
    console.log("✅ Kết nối Database thành công!");
    await Place.syncIndexes();
    console.log("🚀 [System] Hệ thống đã sẵn sàng.");
    cron.schedule("0 3 * * *", async () => {
      console.log("⏰ [Cron] Đang kích hoạt tiến trình cào dữ liệu tự động...");
      try {
        await syncPlacesData();
        console.log("✅ [Cron] Tiến trình cào dữ liệu hoàn tất!");
      } catch (error) {
        console.error("❌ [Cron] Lỗi khi chạy cào dữ liệu:", error);
      }
    });
    console.log(
      "⏱️  [Cron] Đã thiết lập lịch cào dữ liệu tự động lúc 3:00 sáng.",
    );
  })
  .catch((err) => {
    console.error("❌ LỖI KẾT NỐI MONGODB:", err);
    process.exit(1);
  });

// --- ROUTES ---
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/places", placeRoutes);
app.use("/api/v1/checkin", checkinRoutes);
app.use("/api/v1/vouchers", voucherRoutes);
app.use("/api/v1/ai", aiRoutes);
app.use("/api/v1/admin", adminRoutes);
app.get("/api/test-crawl", (req, res) => {
  console.log("🛠️ [API Test] Bắt đầu kích hoạt cào dữ liệu thủ công...");

  // Gọi hàm cào dữ liệu chạy ngầm (không dùng await để phản hồi API ngay lập tức cho Postman)
  syncPlacesData()
    .then(() => console.log("✅ [API Test] Cào dữ liệu thủ công xong!"))
    .catch((err) => console.error("❌ [API Test] Lỗi:", err));

  res.json({
    status: "success",
    message:
      "Tiến trình cào dữ liệu đang được chạy ngầm. Hãy kiểm tra console/terminal để xem tiến độ!",
  });
});

app.get("/", (req, res) => {
  res.json({ status: "success", message: "Danasoul Backend is running!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
