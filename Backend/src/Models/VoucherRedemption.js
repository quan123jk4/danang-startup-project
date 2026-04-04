const mongoose = require("mongoose");

const redemptionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    voucher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Voucher",
      required: true,
    },
    code: { type: String, required: true, unique: true }, // Mã code sinh ra để đưa cho thu ngân
    status: {
      type: String,
      enum: ["Unused", "Used"], // Trạng thái: Chưa sử dụng hoặc Đã sử dụng
      default: "Unused",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("VoucherRedemption", redemptionSchema);
