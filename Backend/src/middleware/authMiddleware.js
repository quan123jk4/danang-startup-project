const jwt = require("jsonwebtoken");
const User = require("../Models/User");

exports.protect = async (req, res, next) => {
  let token;

  // 1. Kiểm tra xem người dùng có gửi Token lên không (thường nằm ở Header)
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1]; // Lấy phần mã Token phía sau chữ "Bearer "
  }

  if (!token) {
    return res
      .status(401)
      .json({ message: "Bạn chưa đăng nhập. Vui lòng đăng nhập để truy cập!" });
  }

  try {
    // 2. Dịch ngược Token để lấy ID của user
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Tìm user trong Database và gắn vào req để các hàm sau sử dụng (loại bỏ password cho an toàn)
    req.user = await User.findById(decoded.id).select("-password");
    next(); // Cho phép đi tiếp vào Controller
  } catch (error) {
    res.status(401).json({ message: "Token không hợp lệ hoặc đã hết hạn!" });
  }
};
exports.authorize = (...roles) => {
  return (req, res, next) => {
    const allowedRoles = roles.map((r) => r.toLowerCase());
    const userRole = req.user.role.toLowerCase().trim();
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: `Lỗi phân quyền: Quyền [${userRole}] không được phép thực hiện hành động này!`,
      });
    }
    next();
  };
};
