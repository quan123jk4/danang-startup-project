import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faUtensils,
  faBed,
  faPlane,
  faTicketAlt,
  faSpa,
  faHistory,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";

// AOS Animation
import AOS from "aos";
import "aos/dist/aos.css";

import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";

// ==========================================
// MOCK DATA (Dữ liệu giả lập giao diện)
// ==========================================
const CATEGORIES = ["Tất cả", "Ẩm thực", "Khách sạn", "Giải trí", "Di chuyển"];

const VOUCHERS = [
  {
    id: 1,
    category: "ẨM THỰC",
    icon: faUtensils,
    title: "Giảm 20% Buffet Hải Sản Heritage",
    points: "500",
    image:
      "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?q=80&w=500",
  },
  {
    id: 2,
    category: "KHÁCH SẠN",
    icon: faBed,
    title: "Nghỉ dưỡng 2N1Đ tại InterContinental",
    points: "5,000",
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=500",
  },
  {
    id: 3,
    category: "DI CHUYỂN",
    icon: faPlane,
    title: "Voucher 500k Vé Máy Bay Vietnam Airlines",
    points: "1,200",
    image:
      "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=500",
  },
];

const MY_REWARDS = [
  {
    id: 1,
    title: "Vé cáp treo Bà Nà Hills",
    date: "12 Th04, 2024",
    status: "SẴN SÀNG DÙNG",
    icon: faTicketAlt,
    isActive: true,
  },
  {
    id: 2,
    title: "Liệu trình Spa 60 phút",
    date: "05 Th04, 2024",
    status: "ĐÃ SỬ DỤNG",
    icon: faSpa,
    isActive: false,
  },
];

const VoucherPage = () => {
  const [activeCategory, setActiveCategory] = useState("Tất cả");
  const [userPoints, setUserPoints] = useState("12,450"); // Mock điểm hiện tại

  useEffect(() => {
    AOS.init({ duration: 1000, once: true, easing: "ease-out-cubic" });
  }, []);

  return (
    <div className="bg-[#E5EDF4] min-h-screen w-full flex flex-col items-center relative">
      <div className="w-full max-w-[1280px] bg-white shadow-2xl rounded-none flex flex-col min-h-screen">
        <Navbar />

        {/* NỘI DUNG TRANG VOUCHER */}
        <div className="flex-1 w-full px-6 md:px-12 py-12 bg-white">
          {/* 1. HERO BANNER */}
          <div
            className="w-full bg-[#002045] rounded-[2rem] p-8 md:p-12 text-white relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-8 shadow-lg mb-12"
            data-aos="fade-up"
          >
            {/* Background elements trang trí */}
            <div className="absolute top-[-50%] left-[-10%] w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-[-50%] right-[-10%] w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="relative z-10 text-center md:text-left">
              <h1 className="text-3xl md:text-[40px] font-extrabold mb-3 tracking-tight">
                Đổi điểm nhận Voucher
              </h1>
              <p className="text-white/70 text-sm md:text-base">
                Khám phá kho ưu đãi đặc quyền dành riêng cho bạn
              </p>
            </div>

            {/* Thẻ hiển thị điểm (Glassmorphism) */}
            <div className="relative z-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 min-w-[240px] text-center shadow-2xl">
              <p className="text-white/80 text-xs font-bold uppercase tracking-widest mb-2">
                Điểm hiện có
              </p>
              <div className="flex items-center justify-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white text-sm shadow-inner">
                  <FontAwesomeIcon icon={faStar} />
                </div>
                <span className="text-4xl font-extrabold tracking-tight">
                  {userPoints}
                </span>
              </div>
            </div>
          </div>

          {/* 2. CATEGORY FILTER */}
          <div
            className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
            data-aos="fade-up"
          >
            <h2 className="text-2xl font-bold text-[#002045]">
              Danh mục Voucher
            </h2>
            <button className="text-sm font-bold text-slate-500 hover:text-[#002045] transition-colors flex items-center gap-2">
              Xem tất cả <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </div>

          <div
            className="flex flex-wrap gap-3 mb-10"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2.5 text-sm font-bold rounded-full transition-all duration-300 ${
                  activeCategory === category
                    ? "bg-[#002045] text-white shadow-md"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* 3. VOUCHER GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {VOUCHERS.map((voucher, index) => (
              <div
                key={voucher.id}
                className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group cursor-pointer"
                data-aos="fade-up"
                data-aos-delay={index * 150}
              >
                {/* Ảnh cover */}
                <div className="w-full h-[200px] relative overflow-hidden">
                  <img
                    src={voucher.image}
                    alt={voucher.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Tag danh mục */}
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-[#C4391D] text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-sm">
                    <FontAwesomeIcon icon={voucher.icon} />
                    {voucher.category}
                  </div>
                </div>

                {/* Nội dung card */}
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold text-[#002045] leading-snug mb-6 line-clamp-2">
                    {voucher.title}
                  </h3>

                  <div className="mt-auto flex items-end justify-between border-t border-slate-100 pt-5">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        ĐIỂM YÊU CẦU
                      </p>
                      <p className="text-lg font-bold text-[#C4391D]">
                        {voucher.points} Points
                      </p>
                    </div>
                    <button className="bg-[#002045] hover:bg-blue-900 text-white text-sm font-bold px-6 py-2.5 rounded-xl transition-colors shadow-sm">
                      Đổi ngay
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 4. PHẦN THƯỞNG CỦA TÔI (MY REWARDS) */}
          <div
            className="bg-[#F8FAFC] rounded-[2rem] p-8 md:p-10 border border-slate-100"
            data-aos="fade-up"
          >
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-2xl font-bold text-[#002045]">
                  Phần thưởng của tôi
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Lịch sử đổi quà và voucher đang sở hữu
                </p>
              </div>
              <FontAwesomeIcon
                icon={faHistory}
                className="text-slate-300 text-2xl"
              />
            </div>

            <div className="flex flex-col gap-4">
              {MY_REWARDS.map((reward) => (
                <div
                  key={reward.id}
                  className="bg-white rounded-2xl p-4 md:p-5 flex items-center justify-between border border-slate-100 shadow-sm hover:border-blue-100 transition-colors"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-[#C4391D] text-lg shrink-0">
                      <FontAwesomeIcon icon={reward.icon} />
                    </div>
                    <div>
                      <h4 className="text-[#002045] font-bold text-sm md:text-base">
                        {reward.title}
                      </h4>
                      <p className="text-slate-400 text-xs mt-1">
                        Đã đổi: {reward.date}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`px-4 py-1.5 rounded-full text-[10px] font-bold tracking-wider shrink-0 ${
                      reward.isActive
                        ? "bg-green-50 text-green-600 border border-green-100"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {reward.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default VoucherPage;
