import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth(); // Hỏi Bộ não

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-[#C9973A] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Nếu không ai đăng nhập -> Đuổi ra Login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Kiểm tra quyền hạn (Bao chuẩn chữ hoa/thường)
  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = String(user.role).toLowerCase().trim();
    const rolesAllowed = allowedRoles.map((r) =>
      String(r).toLowerCase().trim(),
    );

    if (!rolesAllowed.includes(userRole)) {
      return <Navigate to="/" replace />; // Sai quyền -> Về trang chủ
    }
  }

  return <Outlet />; // Hợp lệ -> Mở cửa
};

export default ProtectedRoute;
