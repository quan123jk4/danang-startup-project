const Voucher = require("../Models/Voucher");
const VoucherRedemption = require("../Models/VoucherRedemption");
const User = require("../Models/User");

// [POST] User đổi điểm lấy mã Voucher
exports.redeemVoucher = async (req, res) => {
  try {
    const { voucherId } = req.body;
    const userId = req.user.id;
    const voucher = await Voucher.findById(voucherId);
    if (!voucher || !voucher.isActive) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Voucher không tồn tại hoặc đã hết hạn!",
        });
    }

    const user = await User.findById(userId);
    if (user.points < voucher.pointsRequired) {
      return res.status(400).json({
        success: false,
        message: `Bạn không đủ điểm! Cần ${voucher.pointsRequired} điểm nhưng bạn chỉ có ${user.points} điểm.`,
      });
    }

    user.points -= voucher.pointsRequired;
    await user.save();
    const generateCode = () => {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let code = "DN-";
      for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return code;
    };
    const uniqueCode = generateCode();
    const newRedemption = await VoucherRedemption.create({
      user: userId,
      voucher: voucherId,
      code: uniqueCode,
    });
    res.status(200).json({
      success: true,
      message: "Đổi Voucher thành công! Vui lòng đưa mã này cho thu ngân.",
      data: {
        title: voucher.title,
        partner: voucher.partnerName,
        code: newRedemption.code,
        pointsRemaining: user.points,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Lỗi hệ thống", error: error.message });
  }
};

exports.createVoucher = async (req, res) => {
  try {
    const newVoucher = await Voucher.create(req.body);
    res.status(201).json({ success: true, data: newVoucher });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
