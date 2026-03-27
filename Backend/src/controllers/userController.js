const User = require("../Models/User");

// [GET] Lấy thông tin cá nhân
exports.getProfile = async (req, res) => {
  try {
    // req.user đã được gài sẵn từ file authMiddleware
    const user = req.user;
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// [PUT] Cập nhật thông tin cá nhân (Tên, SĐT, Avatar)
exports.updateProfile = async (req, res) => {
  try {
    const { fullName, phoneNumber, avatar } = req.body;

    // Tìm và cập nhật user đang đăng nhập
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { fullName, phoneNumber, avatar },
      { new: true, runValidators: true }, // new: true để trả về data mới nhất sau khi sửa
    ).select("-password");

    res.status(200).json({
      message: "Cập nhật hồ sơ thành công!",
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
