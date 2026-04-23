import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faPhone,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebookF,
  faInstagram,
  faTiktok,
} from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
  return (
    <footer className="w-full bg-[#002045] text-white pt-16 pb-8 px-6 md:px-12 mt-auto">
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 border-b border-white/10 pb-12">
        {/* Cột 1: Giới thiệu */}
        <div className="md:col-span-1">
          <div className="flex items-center gap-2 mb-6">
            <img
              src="/assets/logo.png"
              alt="Danasoul Logo"
              className="w-10 h-10 object-contain bg-white rounded-full p-1"
            />
            <h2 className="text-2xl font-extrabold tracking-tight">Danasoul</h2>
          </div>
          <p className="text-white/70 text-sm leading-relaxed mb-6">
            Không gian lưu giữ vẻ đẹp Đà Thành, nơi mỗi trải nghiệm là một câu
            chuyện văn hóa được kể bằng ngôn ngữ hiện đại.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#C4391D] hover:scale-110 transition-all"
            >
              <FontAwesomeIcon icon={faFacebookF} className="text-sm" />
            </a>
            <a
              href="#"
              className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#C4391D] hover:scale-110 transition-all"
            >
              <FontAwesomeIcon icon={faInstagram} className="text-sm" />
            </a>
            <a
              href="#"
              className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#C4391D] hover:scale-110 transition-all"
            >
              <FontAwesomeIcon icon={faTiktok} className="text-sm" />
            </a>
          </div>
        </div>

        {/* Cột 2: Liên kết nhanh */}
        <div>
          <h3 className="text-lg font-bold mb-6">Khám Phá</h3>
          <ul className="space-y-4">
            <li>
              <Link
                to="/"
                className="text-white/70 hover:text-white text-sm transition-colors"
              >
                Trang chủ
              </Link>
            </li>
            <li>
              <Link
                to="/check-in"
                className="text-white/70 hover:text-white text-sm transition-colors"
              >
                Tọa độ Check-in
              </Link>
            </li>
            <li>
              <Link
                to="/ai-suggest"
                className="text-white/70 hover:text-white text-sm transition-colors"
              >
                Lịch trình AI
              </Link>
            </li>
            <li>
              <Link
                to="/voucher"
                className="text-white/70 hover:text-white text-sm transition-colors"
              >
                Đổi Voucher
              </Link>
            </li>
          </ul>
        </div>

        {/* Cột 3: Hỗ trợ */}
        <div>
          <h3 className="text-lg font-bold mb-6">Hỗ Trợ</h3>
          <ul className="space-y-4">
            <li>
              <Link
                to="/faq"
                className="text-white/70 hover:text-white text-sm transition-colors"
              >
                Câu hỏi thường gặp
              </Link>
            </li>
            <li>
              <Link
                to="/terms"
                className="text-white/70 hover:text-white text-sm transition-colors"
              >
                Điều khoản dịch vụ
              </Link>
            </li>
            <li>
              <Link
                to="/privacy"
                className="text-white/70 hover:text-white text-sm transition-colors"
              >
                Chính sách bảo mật
              </Link>
            </li>
          </ul>
        </div>

        {/* Cột 4: Liên hệ */}
        <div>
          <h3 className="text-lg font-bold mb-6">Liên Hệ</h3>
          <ul className="space-y-4">
            <li className="flex items-start gap-3 text-white/70 text-sm">
              <FontAwesomeIcon
                icon={faMapMarkerAlt}
                className="mt-1 shrink-0 text-[#C4391D]"
              />
              <span>
                Khu Đô thị Đại học Đà Nẵng, Quận Ngũ Hành Sơn, TP. Đà Nẵng
              </span>
            </li>
            <li className="flex items-center gap-3 text-white/70 text-sm">
              <FontAwesomeIcon
                icon={faPhone}
                className="shrink-0 text-[#C4391D]"
              />
              <span>+84 123 456 789</span>
            </li>
            <li className="flex items-center gap-3 text-white/70 text-sm">
              <FontAwesomeIcon
                icon={faEnvelope}
                className="shrink-0 text-[#C4391D]"
              />
              <span>contact@danasoul.vn</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-[1280px] mx-auto mt-8 text-center flex flex-col md:flex-row items-center justify-between">
        <p className="text-white/50 text-xs">
          &copy; {new Date().getFullYear()} Danasoul Azure. All rights reserved.
        </p>
        <p className="text-white/50 text-xs mt-2 md:mt-0">
          Thiết kế với <span className="text-[#C4391D]">❤</span> tại Đà Nẵng
        </p>
      </div>
    </footer>
  );
};

export default Footer;
