const User = require("../Models/User");

exports.getProfile = async (req, res) => {
  try {
    const user = req.user;
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { fullName, phoneNumber, avatar, targetBudget } = req.body;
    if (
      targetBudget !== undefined &&
      (typeof targetBudget !== "number" || targetBudget < 0)
    ) {
      return res.status(400).json({
        success: false,
        message: "Ngân sách mục tiêu phải là một số lớn hơn hoặc bằng 0.",
      });
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { fullName, phoneNumber, avatar, targetBudget },
      { new: true, runValidators: true },
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Cập nhật hồ sơ thành công!",
      data: updatedUser,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Lỗi server", error: error.message });
  }
};
//Delete
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy người dùng!" });
    }
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: "Bạn không thể tự xóa tài khoản của chính mình!",
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Đã xóa người dùng thành công!",
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Lỗi hệ thống", error: error.message });
  }
};
//thay đổi role
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const upperRole = role.toUpperCase().trim();
    const allowedRoles = ["TOURIST", "BUSINESS", "ADMIN"];

    if (!allowedRoles.includes(upperRole)) {
      return res.status(400).json({
        success: false,
        message: `Role không hợp lệ! Vui lòng chọn 1 trong 3: ${allowedRoles.join(", ")}`,
      });
    }
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: upperRole },
      { new: true, runValidators: true },
    ).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy người dùng!" });
    }
    res.status(200).json({
      success: true,
      message: `Đã cấp quyền [${user.role}] cho người dùng thành công!`,
      data: user,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Lỗi hệ thống", error: error.message });
  }
};
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách người dùng",
      error: error.message,
    });
  }
};
exports.toggleLockUser = async (req, res) => {
  try {
    // 1. Tìm user cần khóa trong Database
    const user = await User.findById(req.params.id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy người dùng!" });
    }

    // 2. Chống tự hủy: Không cho phép Admin tự khóa chính mình hoặc Admin khác
    if (user.role === "ADMIN" || user.role === "SUPERADMIN") {
      return res.status(403).json({
        success: false,
        message: "Bạn không thể khóa tài khoản của Quản trị viên!",
      });
    }

    // 3. Đảo ngược trạng thái: Đang false thành true (Khóa), đang true thành false (Mở)
    user.isLocked = !user.isLocked;
    if (!user.isLocked) {
      user.failedLoginAttempts = 0;
    }
    await user.save();

    // 4. Trả kết quả về cho Frontend
    res.status(200).json({
      success: true,
      message: user.isLocked
        ? "Đã KHÓA tài khoản thành công!"
        : "Đã MỞ KHÓA tài khoản thành công!",
      isLocked: user.isLocked,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống",
      error: error.message,
    });
  }
};
