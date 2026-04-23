const mongoose = require("mongoose");

const voucherSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, 
    partnerName: { type: String, required: true }, 
    pointsRequired: { type: Number, required: true }, 
    discountValue: { type: String, required: true }, 
    isActive: { type: Boolean, default: true }, 
  },
  { timestamps: true },
);

module.exports = mongoose.model("Voucher", voucherSchema);
