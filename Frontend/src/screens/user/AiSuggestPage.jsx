import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarAlt,
  faSlidersH,
  faSun,
  faWandMagicSparkles,
  faEllipsisH,
} from "@fortawesome/free-solid-svg-icons";

// AOS Animation
import AOS from "aos";
import "aos/dist/aos.css";

import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";

// ==========================================
// MOCK DATA: LỊCH TRÌNH AI TẠO RA
// ==========================================
const ITINERARY_DATA = [
  {
    id: 1,
    dayNumber: "01",
    dayLabel: "Ngày 1",
    time: "08:30 AM",
    title: "Cà phê sáng ven sông Hàn",
    description:
      "Bắt đầu ngày mới với một tách cà phê muối đặc sản ven sông Hàn thơ mộng, tận hưởng không khí trong lành của thành phố.",
    tags: ["#Relax", "#LocalExperience"],
    image:
      "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=500", // Ảnh ly cafe
  },
  {
    id: 2,
    dayNumber: "02",
    dayLabel: "Ngày 2",
    time: "09:30 AM",
    title: "Đỉnh Bà Nà Hills",
    description:
      "Đi cáp treo đạt kỷ lục thế giới và check-in tại Cầu Vàng huyền thoại trong sương sớm. Thưởng thức không khí châu Âu trên đỉnh núi.",
    tags: ["#Adventure", "#Photography"],
    image:
      "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?q=80&w=500", // Ảnh Cầu Vàng/Bà Nà
  },
  {
    id: 3,
    dayNumber: "03",
    dayLabel: "Ngày 3",
    time: "07:30 PM",
    title: "Tiệc chia tay bên Cầu Rồng",
    description:
      "Thưởng thức hải sản tươi sống và xem Rồng phun lửa - màn trình diễn biểu tượng của thành phố đáng sống.",
    tags: ["#Foodie", "#NightLife"],
    image:
      "https://images.unsplash.com/photo-1555921015-5532091f6026?q=80&w=500", // Ảnh Cầu Rồng đêm
  },
];

const BUDGET_OPTIONS = ["Tiết kiệm", "Vừa phải", "Cao cấp"];
const INTEREST_OPTIONS = [
  "#Biển",
  "#ẨmThực",
  "#LịchSử",
  "#NhiếpẢnh",
  "#ChữaLành",
];

const AiSuggestPage = () => {
  // State quản lý bộ lọc
  const [activeBudget, setActiveBudget] = useState("Vừa phải");
  const [activeInterests, setActiveInterests] = useState([
    "#ẨmThực",
    "#NhiếpẢnh",
  ]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true, easing: "ease-out-cubic" });
  }, []);

  // Hàm xử lý chọn sở thích (chọn nhiều)
  const toggleInterest = (interest) => {
    if (activeInterests.includes(interest)) {
      setActiveInterests(activeInterests.filter((i) => i !== interest));
    } else {
      setActiveInterests([...activeInterests, interest]);
    }
  };

  // Hàm giả lập cập nhật lịch trình
  const handleUpdate = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Gọi API AI tạo lịch trình mới ở đây
    }, 1500);
  };

  return (
    <div className="bg-[#E5EDF4] min-h-screen w-full flex flex-col items-center relative">
      <div className="w-full max-w-[1280px] bg-white shadow-2xl rounded-none flex flex-col min-h-screen">
        <Navbar />

        {/* NỀN XÁM NHẠT CHỨA NỘI DUNG CHÍNH */}
        <div className="flex-1 w-full bg-[#F8FAFC] px-6 md:px-12 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* ========================================== */}
            {/* CỘT TRÁI: SIDEBAR BỘ LỌC AI */}
            {/* ========================================== */}
            <div className="lg:col-span-3 flex flex-col gap-6 sticky top-24">
              {/* Form Tùy chỉnh */}
              <div
                className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100"
                data-aos="fade-right"
              >
                <div className="flex items-center gap-3 text-[#002045] font-bold text-lg mb-8 pb-4 border-b border-slate-100">
                  <FontAwesomeIcon icon={faSlidersH} /> Tùy chỉnh AI
                </div>

                {/* Ngày khởi hành */}
                <div className="mb-6">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Ngày khởi hành
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="15/10 - 17/10"
                      defaultValue="15/10 - 17/10"
                      className="w-full bg-slate-50 border border-slate-200 text-[#002045] text-sm rounded-xl px-4 py-3 focus:outline-none font-medium"
                    />
                    <FontAwesomeIcon
                      icon={faCalendarAlt}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400"
                    />
                  </div>
                </div>

                {/* Ngân sách */}
                <div className="mb-6">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Ngân sách dự kiến
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {BUDGET_OPTIONS.map((budget) => (
                      <button
                        key={budget}
                        onClick={() => setActiveBudget(budget)}
                        className={`px-4 py-2 text-xs font-bold rounded-full transition-colors ${
                          activeBudget === budget
                            ? "bg-[#002045] text-white"
                            : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                        }`}
                      >
                        {budget}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sở thích */}
                <div className="mb-8">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Sở thích cá nhân
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {INTEREST_OPTIONS.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => toggleInterest(tag)}
                        className={`px-3 py-1.5 text-[11px] font-bold rounded-full transition-colors ${
                          activeInterests.includes(tag)
                            ? "bg-[#002045] text-white"
                            : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Nút Cập nhật */}
                <button
                  onClick={handleUpdate}
                  disabled={isLoading}
                  className="w-full bg-[#002045] text-white font-bold text-sm py-3.5 rounded-xl shadow-md hover:bg-blue-900 transition-colors flex items-center justify-center gap-2"
                >
                  <FontAwesomeIcon
                    icon={faWandMagicSparkles}
                    className={isLoading ? "animate-spin" : ""}
                  />
                  {isLoading ? "Đang tạo..." : "Cập nhật Lịch trình"}
                </button>
              </div>

              {/* Widget Thời tiết */}
              <div
                className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center gap-5"
                data-aos="fade-right"
                data-aos-delay="100"
              >
                <FontAwesomeIcon
                  icon={faSun}
                  className="text-amber-500 text-4xl animate-pulse"
                />
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Dự báo thời tiết
                  </p>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold text-[#002045] leading-none">
                      28°C
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Nắng nhẹ, trời trong
                  </p>
                </div>
              </div>
            </div>

            {/* ========================================== */}
            {/* CỘT PHẢI: KẾT QUẢ AI CURATION */}
            {/* ========================================== */}
            <div className="lg:col-span-9">
              {/* Header của Lịch trình */}
              <div className="mb-12" data-aos="fade-down">
                <div className="flex items-center gap-2 text-[#C4391D] font-bold text-xs uppercase tracking-wider mb-4">
                  <FontAwesomeIcon icon={faWandMagicSparkles} /> Ai Curation
                </div>
                <h1 className="text-4xl md:text-[44px] font-extrabold text-[#002045] leading-tight mb-4 tracking-tight">
                  Đà Nẵng:
                  <br />
                  Ký ức Di sản & Biển khơi
                </h1>
                <p className="text-slate-500 text-sm md:text-base leading-relaxed max-w-3xl">
                  Dựa trên sở thích của bạn, Danasoul AI đã thiết kế hành trình
                  3 ngày kết hợp giữa sự tĩnh lặng của các ngôi chùa cổ và sự
                  sôi động của ẩm thực đường phố.
                </p>
              </div>

              {/* Danh sách Timeline */}
              <div className="relative">
                {/* Đường kẻ dọc chạy xuyên suốt */}
                <div className="absolute left-[39px] top-0 bottom-0 w-px bg-slate-200 hidden md:block z-0"></div>

                <div className="flex flex-col gap-12">
                  {ITINERARY_DATA.map((item, index) => (
                    <div
                      key={item.id}
                      className="relative flex flex-col md:flex-row gap-6 md:gap-12 z-10"
                      data-aos="fade-up"
                      data-aos-delay={index * 150}
                    >
                      {/* Vòng tròn hiển thị Ngày */}
                      <div className="flex flex-col items-center shrink-0 w-20">
                        <div className="w-20 h-20 bg-[#002045] rounded-full flex flex-col items-center justify-center text-white shadow-lg border-4 border-[#F8FAFC]">
                          <span className="text-lg font-extrabold leading-none">
                            {item.dayNumber}
                          </span>
                        </div>
                        <span className="text-slate-400 text-xs font-bold mt-2 uppercase">
                          {item.dayLabel}
                        </span>
                      </div>

                      {/* Card nội dung địa điểm */}
                      <div className="flex-1 bg-white rounded-3xl p-3 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow group">
                        {/* Ảnh bên trái */}
                        <div className="w-full md:w-[240px] h-[200px] shrink-0 rounded-2xl overflow-hidden relative">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        </div>

                        {/* Text bên phải */}
                        <div className="flex-1 py-4 pr-4 relative">
                          <button className="absolute top-4 right-4 text-slate-300 hover:text-slate-500">
                            <FontAwesomeIcon icon={faEllipsisH} />
                          </button>

                          <div className="inline-block bg-slate-100 text-slate-500 text-[10px] font-bold px-3 py-1 rounded-full mb-4">
                            {item.time}
                          </div>

                          <h3 className="text-xl font-bold text-[#002045] mb-2">
                            {item.title}
                          </h3>

                          <p className="text-sm text-slate-500 leading-relaxed mb-6">
                            {item.description}
                          </p>

                          <div className="flex flex-wrap gap-3">
                            {item.tags.map((tag) => (
                              <span
                                key={tag}
                                className="text-[#C4391D] text-xs font-bold"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default AiSuggestPage;
