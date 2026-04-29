import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-regular-svg-icons";
import {
  faUserEdit,
  faSuitcaseRolling,
  faTicketAlt,
  faSignInAlt,
  faCog,
  faSignOutAlt,
  faBars,
  faXmark,
  faUserShield,
} from "@fortawesome/free-solid-svg-icons";

// IMPORT BỘ NÃO AUTH
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  // LẤY DỮ LIỆU VÀ HÀM LOGOUT TỪ CONTEXT
  const { user, logoutContext } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target))
        setIsMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logoutContext(); // Gọi hàm đăng xuất từ bộ não
    setIsMenuOpen(false);
    setIsMobileMenuOpen(false);
    navigate("/");
  };

  const getLinkClass = (path) => {
    return location.pathname === path
      ? "text-[#002045] border-b-2 border-[#002045] pb-1 font-bold"
      : "text-slate-500 hover:text-[#002045] transition-colors pb-1 font-semibold";
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  // Kiểm tra quyền Admin (Đồng bộ với ProtectedRoute)
  const isAdmin =
    user &&
    user.role &&
    (user.role.toLowerCase() === "admin" ||
      user.role.toLowerCase() === "superadmin");

  return (
    <nav className="sticky top-0 z-50 w-full h-[72px] px-6 md:px-8 flex items-center justify-between text-[#002045] border-b border-slate-200 bg-[#F5FAFF]/70 backdrop-blur-md">
      {/* 1. LOGO */}
      <Link to="/" className="flex items-center">
        <img
          src="/assets/logo.png"
          alt="Danasoul Logo"
          className="w-8 h-8 object-contain"
        />
      </Link>

      {/* 2. MENU DESKTOP */}
      <div className="hidden md:flex items-center gap-10 text-sm">
        <Link to="/" className={getLinkClass("/")}>
          Trang chủ
        </Link>
        <Link to="/check-in" className={getLinkClass("/check-in")}>
          Check-in
        </Link>
        <Link to="/ai-suggest" className={getLinkClass("/ai-suggest")}>
          AI Gợi ý
        </Link>
        <Link to="/voucher" className={getLinkClass("/voucher")}>
          Voucher
        </Link>
      </div>

      {/* 3. KHU VỰC BÊN PHẢI */}
      <div className="flex items-center gap-5">
        <div className="relative hidden md:block" ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="cursor-pointer transition-all duration-300 flex items-center justify-center rounded-full hover:scale-110"
          >
            {user && user.avatar ? (
              <img
                src={user.avatar}
                alt="Avatar"
                className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm"
              />
            ) : (
              <FontAwesomeIcon
                icon={faUserCircle}
                className={`text-[24px] ${isMenuOpen ? "text-blue-600" : "text-[#002045]"}`}
              />
            )}
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 mt-4 w-[240px] bg-white rounded-2xl shadow-xl border border-slate-100 py-2 origin-top-right z-50">
              <div className="px-5 py-4 mb-2 bg-[#F8FAFC] mx-2 rounded-xl text-center md:text-left">
                <p className="text-[15px] font-bold text-[#002045]">
                  {user ? `Xin chào, ${user.fullName}!` : "Xin chào, Khách!"}
                </p>
                <p className="text-xs text-slate-500 mt-1 truncate">
                  {user ? user.email : "Vui lòng đăng nhập"}
                </p>
              </div>

              <div className="flex flex-col">
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-3 px-5 py-3 text-[13px] font-bold text-[#C4391D] hover:bg-red-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FontAwesomeIcon icon={faUserShield} className="w-4" />{" "}
                    Trang Quản Trị
                  </Link>
                )}
                <Link
                  to="/profile"
                  className="flex items-center gap-3 px-5 py-3 text-[13px] font-medium text-slate-600 hover:bg-slate-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FontAwesomeIcon icon={faUserEdit} className="w-4" /> Cập nhật
                  thông tin
                </Link>
                <Link
                  to="/my-trips"
                  className="flex items-center gap-3 px-5 py-3 text-[13px] font-medium text-slate-600 hover:bg-slate-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FontAwesomeIcon icon={faSuitcaseRolling} className="w-4" />{" "}
                  Chuyến đi của tôi
                </Link>
                <Link
                  to="/my-vouchers"
                  className="flex items-center gap-3 px-5 py-3 text-[13px] font-medium text-slate-600 hover:bg-slate-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FontAwesomeIcon icon={faTicketAlt} className="w-4" /> Kho
                  Voucher
                </Link>
                <Link
                  to="/settings"
                  className="flex items-center gap-3 px-5 py-3 text-[13px] font-medium text-slate-600 hover:bg-slate-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FontAwesomeIcon icon={faCog} className="w-4" /> Cài đặt
                </Link>
              </div>

              <div className="border-t border-slate-100 mt-2 pt-2 px-2 pb-1">
                {user ? (
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-red-50 text-red-600 px-4 py-2.5 rounded-xl text-[13px] font-bold"
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} /> Đăng Xuất
                  </button>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full flex items-center justify-center gap-2 bg-[#002045] text-white px-4 py-2.5 rounded-xl text-[13px] font-bold"
                  >
                    <FontAwesomeIcon icon={faSignInAlt} /> Đăng Nhập
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>

        <button
          className="md:hidden text-[#002045] text-2xl p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <FontAwesomeIcon icon={isMobileMenuOpen ? faXmark : faBars} />
        </button>
      </div>

      {/* ========================================== */}
      {/* 4. MENU TRƯỢT MOBILE (ĐÃ FIX ĐẦY ĐỦ LINK)  */}
      {/* ========================================== */}
      <div
        className={`md:hidden absolute top-[72px] left-0 w-full bg-white shadow-2xl transition-all duration-300 origin-top z-40 overflow-y-auto max-h-[calc(100vh-72px)] ${isMobileMenuOpen ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0 h-0 overflow-hidden"}`}
      >
        <div className="flex flex-col px-6 py-4">
          {/* User Info Section */}
          <div className="flex items-center gap-4 border-b border-slate-100 pb-5 mb-5">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt="Avatar"
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <FontAwesomeIcon
                icon={faUserCircle}
                className="text-[40px] text-slate-300"
              />
            )}
            <div className="overflow-hidden">
              <p className="text-[#002045] font-bold truncate">
                {user ? user.fullName : "Khách"}
              </p>
              <p className="text-slate-400 text-xs truncate">
                {user ? user.email : "Vui lòng đăng nhập"}
              </p>
            </div>
          </div>

          {/* 4 TRANG ĐIỀU HƯỚNG CHÍNH */}
          <div className="flex flex-col space-y-4 mb-6">
            <Link
              to="/"
              onClick={closeMobileMenu}
              className="text-base text-[#002045] font-medium"
            >
              Trang chủ
            </Link>
            <Link
              to="/check-in"
              onClick={closeMobileMenu}
              className="text-base text-[#002045] font-medium"
            >
              Check-in
            </Link>
            <Link
              to="/ai-suggest"
              onClick={closeMobileMenu}
              className="text-base text-[#002045] font-medium"
            >
              AI Gợi ý
            </Link>
            <Link
              to="/voucher"
              onClick={closeMobileMenu}
              className="text-base text-[#002045] font-medium"
            >
              Voucher
            </Link>
          </div>

          {/* CÁC CHỨC NĂNG CÁ NHÂN / QUẢN TRỊ */}
          {user && (
            <div className="flex flex-col space-y-4 border-t border-slate-100 pt-5 mb-6">
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 text-base font-bold text-[#C4391D]"
                >
                  <FontAwesomeIcon icon={faUserShield} className="w-5" /> Trang
                  Quản Trị
                </Link>
              )}
              <Link
                to="/profile"
                onClick={closeMobileMenu}
                className="flex items-center gap-3 text-sm text-slate-600 font-medium"
              >
                <FontAwesomeIcon
                  icon={faUserEdit}
                  className="w-5 text-slate-400"
                />{" "}
                Cập nhật thông tin
              </Link>
              <Link
                to="/my-trips"
                onClick={closeMobileMenu}
                className="flex items-center gap-3 text-sm text-slate-600 font-medium"
              >
                <FontAwesomeIcon
                  icon={faSuitcaseRolling}
                  className="w-5 text-slate-400"
                />{" "}
                Chuyến đi của tôi
              </Link>
              <Link
                to="/my-vouchers"
                onClick={closeMobileMenu}
                className="flex items-center gap-3 text-sm text-slate-600 font-medium"
              >
                <FontAwesomeIcon
                  icon={faTicketAlt}
                  className="w-5 text-slate-400"
                />{" "}
                Kho Voucher
              </Link>
              <Link
                to="/settings"
                onClick={closeMobileMenu}
                className="flex items-center gap-3 text-sm text-slate-600 font-medium"
              >
                <FontAwesomeIcon icon={faCog} className="w-5 text-slate-400" />{" "}
                Cài đặt
              </Link>
            </div>
          )}

          {/* NÚT ĐĂNG XUẤT / ĐĂNG NHẬP */}
          {user ? (
            <button
              onClick={handleLogout}
              className="w-full bg-red-50 text-red-600 font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 mb-4"
            >
              <FontAwesomeIcon icon={faSignOutAlt} /> Đăng xuất
            </button>
          ) : (
            <Link
              to="/login"
              onClick={closeMobileMenu}
              className="w-full bg-[#002045] text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-md mb-4"
            >
              <FontAwesomeIcon icon={faSignInAlt} /> Đăng Nhập / Đăng Ký
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
