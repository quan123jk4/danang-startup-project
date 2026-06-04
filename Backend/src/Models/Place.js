const mongoose = require("mongoose");

const placeSchema = new mongoose.Schema(
  {
    // ==========================================
    // 1. NHÓM DỮ LIỆU TĨNH (STATIC DATA)
    // Bot chỉ Insert lần đầu, tuyệt đối KHÔNG ghi đè
    // ==========================================
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, lowercase: true },
    category: {
      type: String,
      enum: [
        "hotel",
        "restaurant",
        "attraction",
        "entertainment",
        "cafe",
        "shopping",
        "other",
      ],
      required: true,
    },
    description: { type: String },

    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number] }, // Định dạng chuẩn: [Kinh độ (Lng), Vĩ độ (Lat)]
      address: { type: String, trim: true },
      phone: { type: String, trim: true },
    },

    images: [{ url: String, isMain: Boolean }],
    tags: [{ type: String, trim: true }],

    // ==========================================
    // 2. NHÓM CHỈ SỐ KẾT HỢP (USER + BOT)
    // ==========================================
    metrics: {
      // ---> Thuộc về USER: Cộng đồng tự đánh giá (Bot KHÔNG ĐƯỢC CHẠM VÀO)
      rating: { type: Number, default: 0, min: 0, max: 5 },
      numReview: { type: Number, default: 0 },

      // ---> Thuộc về BOT: Cào và cập nhật ghi đè HÀNG NGÀY
      price: { type: Number, min: 0 }, // Giá tiền chính xác (Ví dụ: 50000 VNĐ)
      priceLevel: { type: Number, min: 0, max: 4 }, // Mức độ (0: Free, 1: Rẻ, ..., 4: Rất đắt)
    },

    // ==========================================
    // 3. QUẢN LÝ ĐỒNG BỘ (DÀNH RIÊNG CHO BOT)
    // Cập nhật ghi đè hàng ngày để theo dõi
    // ==========================================
    syncMeta: {
      source: {
        type: String,
        enum: ["manual", "crawler", "ai", "partner"],
        default: "manual",
      },
      sourceId: { type: String }, // <-- Bỏ hết sparse và index ở đây cho sạch sẽ
      status: {
        type: String,
        enum: ["pending", "success", "failed", "closed"],
        default: "pending",
      },
      lastSyncedAt: { type: Date },
    },
    // ==========================================
    // 4. DỮ LIỆU AI VECTOR
    // Chỉ cập nhật lại khi name/category/description đổi
    // ==========================================
    embedding: [{ type: Number }],
  },
  {
    timestamps: true,
    collection: "places",
    strict: true,
  },
);

// --- TỐI ƯU HÓA INDEX CHUẨN XÁC ---

// 1. Phục vụ load trang chi tiết nhanh qua URL
placeSchema.index({ slug: 1 }, { unique: true });

// 2. Phục vụ tìm kiếm địa điểm trên bản đồ (Near me / Bán kính)
placeSchema.index({ "location.coordinates": "2dsphere" });

// 3. Phục vụ lọc thông minh: "Quán cafe được user đánh giá cao nhất"
placeSchema.index({ category: 1, "metrics.rating": -1 });

// 4. Phục vụ Bot cào Upsert siêu tốc (Tìm ID xem có tồn tại chưa)
placeSchema.index({ "syncMeta.sourceId": 1 }, { sparse: true });

// 5. Phục vụ lọc theo giá tiền cho AI phân tích ngân sách
placeSchema.index({ "metrics.price": 1 });

placeSchema.virtual("mainImage").get(function () {
  if (!this.images || this.images.length === 0) return null;
  return this.images.find((img) => img.isMain) || this.images[0];
});

// Singleton pattern chống lỗi OverwriteModel khi dùng nodemon / Next.js
const Place = mongoose.models.Place || mongoose.model("Place", placeSchema);
module.exports = { Place };
