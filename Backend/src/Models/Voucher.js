const mongoose = require("mongoose");

const voucherSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // VD: "Giảm 20% Hóa Đơn Đặc Sản"
    partnerName: { type: String, required: true }, // VD: "Siêu thị Đặc sản Hương Đà"
    pointsRequired: { type: Number, required: true }, // Số điểm cần để đổi (VD: 50)
    discountValue: { type: String, required: true }, // VD: "50,000 VND" hoặc "20%"
    isActive: { type: Boolean, default: true }, // Nút bật/tắt voucher
  },
  { timestamps: true },
);

module.exports = mongoose.model("Voucher", voucherSchema);
