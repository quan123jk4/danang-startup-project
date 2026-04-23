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
} from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const location = useLocation();

  const [user, setUser] = useState(null);

  // =========================================================
  // FIX LỖI Ở ĐÂY: Thêm location.pathname vào dependency array
  // =========================================================
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          const response = await fetch(
            "http://localhost:5000/api/v1/users/profile",
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            },
          );
          const result = await response.json();
          if (result.success) {
            setUser(result.data);
          } else {
            localStorage.removeItem("token");
            setUser(null);
          }
        } catch (error) {
          console.error("Lỗi khi fetch dữ liệu user:", error);
        }
      } else {
        // NẾU KHÔNG CÓ TOKEN THÌ ÉP VỀ NULL (tránh lỗi kẹt state)
        setUser(null);
      }
    };

    fetchProfile();
  }, [location.pathname]); // <--- CHÌA KHÓA NẰM Ở ĐÂY: Load lại mỗi khi đổi trang

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsMenuOpen(false);
    navigate("/");
  };

  const getLinkClass = (path) => {
    return location.pathname === path
      ? "text-[#002045] border-b-2 border-[#002045] pb-1 font-bold"
      : "text-slate-500 hover:text-[#002045] transition-colors pb-1 font-semibold";
  };

  return (
    <nav className="sticky top-0 z-50 w-full h-[72px] px-8 flex items-center justify-between text-[#002045] border-b border-slate-200 bg-[#F5FAFF]/70 backdrop-blur-md">
      {/* Logo */}
      <Link to="/" className="flex items-center">
        <img
          src="/assets/logo.png"
          alt="Danasoul Logo"
          className="w-8 h-8 object-contain"
        />
      </Link>

      {/* Menu Links */}
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

      {/* Box chứa Icon User và Menu Dropdown */}
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`cursor-pointer transition-all duration-300 flex items-center justify-center rounded-full ${isMenuOpen ? "scale-110 shadow-md" : "hover:scale-110"}`}
        >
          {user && user.avatar ? (
            <img
              src={user.avatar}
              alt="User Avatar"
              className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm"
            />
          ) : (
            <FontAwesomeIcon
              icon={faUserCircle}
              className={`text-[24px] ${isMenuOpen ? "text-blue-600" : "text-[#002045] hover:text-blue-600"}`}
            />
          )}
        </button>

        {isMenuOpen && (
          <div className="absolute right-0 mt-4 w-[240px] bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-slate-100 py-2 origin-top-right animate-in fade-in zoom-in duration-200 z-50">
            <div className="px-5 py-4 mb-2 bg-[#F8FAFC] mx-2 rounded-xl">
              {user ? (
                <>
                  <p className="text-[15px] font-bold text-[#002045]">
                    Xin chào, {user.fullName}!
                  </p>
                  <p className="text-xs text-slate-500 mt-1 truncate">
                    {user.email}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-[15px] font-bold text-[#002045]">
                    Xin chào, Khách!
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Vui lòng đăng nhập
                  </p>
                </>
              )}
            </div>

            <div className="flex flex-col">
              <Link
                to="/profile"
                className="flex items-center gap-3 px-5 py-3 text-[13px] font-medium text-slate-600 hover:bg-slate-50 hover:text-[#002045] transition-colors"
              >
                <FontAwesomeIcon
                  icon={faUserEdit}
                  className="w-4 text-slate-400"
                />
                Cập nhật thông tin
              </Link>
              <Link
                to="/my-trips"
                className="flex items-center gap-3 px-5 py-3 text-[13px] font-medium text-slate-600 hover:bg-slate-50 hover:text-[#002045] transition-colors"
              >
                <FontAwesomeIcon
                  icon={faSuitcaseRolling}
                  className="w-4 text-slate-400"
                />
                Chuyến đi của tôi
              </Link>
              <Link
                to="/my-vouchers"
                className="flex items-center gap-3 px-5 py-3 text-[13px] font-medium text-slate-600 hover:bg-slate-50 hover:text-[#002045] transition-colors"
              >
                <FontAwesomeIcon
                  icon={faTicketAlt}
                  className="w-4 text-slate-400"
                />
                Kho Voucher
              </Link>
              <Link
                to="/settings"
                className="flex items-center gap-3 px-5 py-3 text-[13px] font-medium text-slate-600 hover:bg-slate-50 hover:text-[#002045] transition-colors"
              >
                <FontAwesomeIcon icon={faCog} className="w-4 text-slate-400" />
                Cài đặt
              </Link>
            </div>

            <div className="border-t border-slate-100 mt-2 pt-2 px-2 pb-1">
              {user ? (
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-red-50 text-red-600 px-4 py-2.5 rounded-xl text-[13px] font-bold transition-all cursor-pointer"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} />
                  Đăng Xuất
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 bg-[#002045] hover:bg-blue-800 text-white px-4 py-2.5 rounded-xl text-[13px] font-bold transition-all shadow-md hover:shadow-lg cursor-pointer"
                >
                  <FontAwesomeIcon icon={faSignInAlt} />
                  Đăng Nhập / Đăng Ký
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
