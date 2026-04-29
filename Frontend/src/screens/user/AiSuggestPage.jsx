import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarAlt,
  faSlidersH,
  faSun,
  faWandMagicSparkles,
  faEllipsisH,
  faWallet,
  faUserFriends,
  faHeart,
  faLandmark,
  faCloudSun,
  faCloud,
  faCloudRain,
  faCloudShowersHeavy,
  faBolt,
  faSmog,
} from "@fortawesome/free-solid-svg-icons";

// AOS Animation
import AOS from "aos";
import "aos/dist/aos.css";

import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";

// ==========================================
// MOCK DATA: LỊCH TRÌNH AI TẠO RA
// ==========================================

const BUDGET_OPTIONS = ["Tiết kiệm", "Vừa phải", "Cao cấp"];
const COMPANION_OPTIONS = ["Một mình", "Cặp đôi", "Gia đình", "Bạn bè"];
const INTEREST_OPTIONS = [
  // 6 Tag phổ biến (Sẽ hiện mặc định)
  "#HảiSản",
  "#CafeSốngẢo",
  "#TắmBiển",
  "#ChợĐêm",
  "#LịchSử",
  "#ChữaLành",
  // Tag Ẩm thực sâu hơn
  "#MìQuảng",
  "#ĂnVặt",
  "#NhậuBìnhDân",
  // Tag Văn hóa & Tâm linh
  "#ChùaChiền",
  "#BảoTàng",
  "#DiSảnChăm",
  "#KiếnTrúc",
  // Tag Thiên nhiên & Vận động
  "#PhượtĐèo",
  "#CắmTrại",
  "#SuốiKhoáng",
  "#LeoNúi",
  // Tag Giải trí
  "#BarClub",
  "#MuaSắm",
  "#NghệThuật",
];

const AiSuggestPage = () => {
  // State quản lý bộ lọc
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [activeBudget, setActiveBudget] = useState("Vừa phải");
  const [activeCompanions, setActiveCompanions] = useState("Cặp đôi");
  const [activeInterests, setActiveInterests] = useState([
    "#ẨmThực",
    "#NhiếpẢnh",
  ]);
  const [isCultureFocus, setIsCultureFocus] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showAllTags, setShowAllTags] = useState(false);
  const [weather, setWeather] = useState({
    temp: "--",
    desc: "Đang cập nhật...",
    icon: faSun,
    color: "text-amber-500",
  });
  const [itineraryData, setItineraryData] = useState([]);
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Tọa độ chuẩn của Đà Nẵng: vĩ độ 16.0678, kinh độ 108.2208
        const response = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=16.0678&longitude=108.2208&current_weather=true",
        );
        const data = await response.json();

        if (data && data.current_weather) {
          const currentTemp = Math.round(data.current_weather.temperature);
          const weatherCode = data.current_weather.weathercode;

          // Dịch mã thời tiết (WMO code) sang Tiếng Việt và Icon tương ứng
          let desc = "Nắng đẹp, trời trong";
          let icon = faSun;
          let color = "text-amber-500";

          if (weatherCode === 1 || weatherCode === 2) {
            desc = "Nắng nhẹ, có mây";
            icon = faCloudSun;
            color = "text-orange-400";
          } else if (weatherCode === 3) {
            desc = "Nhiều mây, âm u";
            icon = faCloud;
            color = "text-slate-400";
          } else if (weatherCode >= 45 && weatherCode <= 48) {
            desc = "Có sương mù";
            icon = faSmog;
            color = "text-slate-300";
          } else if (weatherCode >= 51 && weatherCode <= 67) {
            desc = "Trời có mưa";
            icon = faCloudRain;
            color = "text-blue-400";
          } else if (weatherCode >= 80 && weatherCode <= 82) {
            desc = "Mưa rào";
            icon = faCloudShowersHeavy;
            color = "text-blue-500";
          } else if (weatherCode >= 95) {
            desc = "Mưa dông, sấm chớp";
            icon = faBolt;
            color = "text-purple-500";
          }

          setWeather({ temp: currentTemp, desc, icon, color });
        }
      } catch (error) {
        console.error("Lỗi lấy dữ liệu thời tiết:", error);
        setWeather({
          temp: "--",
          desc: "Không thể kết nối",
          icon: faCloud,
          color: "text-slate-300",
        });
      }
    };

    fetchWeather();
  }, []);

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
  const handleUpdate = async () => {
    // 1. Tính toán số ngày dựa trên state startDate và endDate
    let days = 1;
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = end - start;
      if (diffTime < 0) {
        alert("Ngày kết thúc không được nhỏ hơn ngày bắt đầu!");
        return;
      }
      days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    }

    // 2. ĐỊNH NGHĨA BIẾN PAYLOAD (Chỗ này là chỗ ông đang thiếu nè!)
    const payload = {
      days: days,
      dates: { start: startDate, end: endDate },
      budget: activeBudget,
      companions: activeCompanions,
      interests: activeInterests,
      culturalFocus: isCultureFocus,
    };

    console.log("Đã xác định payload:", payload); // Log ra để chắc chắn nó tồn tại

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/v1/ai-suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // Kiểm tra nếu Server trả về lỗi (400, 404, 500...)
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Lỗi từ Server Node.js:", errorText);
        alert(`Server báo lỗi: ${response.status}`);
        return;
      }

      const result = await response.json();
      console.log("Dữ liệu AI nhận được:", result);

      if (result.success && result.data) {
        setItineraryData(result.data);
      } else {
        alert("AI không trả về dữ liệu thành công!");
      }
    } catch (error) {
      console.error("Lỗi kết nối:", error);
      alert("Không thể kết nối đến Backend Node.js!");
    } finally {
      setIsLoading(false);
    }
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
                className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col gap-6"
                data-aos="fade-right"
              >
                <div className="flex items-center gap-3 text-[#002045] font-bold text-lg pb-4 border-b border-slate-100">
                  <FontAwesomeIcon icon={faSlidersH} /> Tùy chỉnh AI
                </div>

                {/* 1. Ngày khởi hành */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                    <FontAwesomeIcon icon={faCalendarAlt} /> Thời gian chuyến đi
                  </label>
                  <div className="flex flex-col gap-2">
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-[#002045] text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#002045] font-medium"
                    />
                    <div className="text-center text-slate-400 text-xs">
                      đến ngày
                    </div>
                    <input
                      type="date"
                      min={startDate}
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-[#002045] text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-[#002045] font-medium"
                    />
                  </div>
                  {startDate && endDate && (
                    <p className="text-[11px] text-[#C4391D] font-bold mt-1 text-center">
                      * Chuyến đi{" "}
                      {Math.ceil(
                        (new Date(endDate) - new Date(startDate)) /
                          (1000 * 60 * 60 * 24),
                      ) + 1}{" "}
                      ngày
                    </p>
                  )}
                </div>

                {/* 2. Bạn đi cùng ai? */}
                <div className="flex flex-col gap-3">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                    <FontAwesomeIcon icon={faUserFriends} /> Bạn đi cùng ai?
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {COMPANION_OPTIONS.map((comp) => (
                      <button
                        key={comp}
                        onClick={() => setActiveCompanions(comp)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                          activeCompanions === comp
                            ? "bg-[#002045] text-white shadow-md"
                            : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                        }`}
                      >
                        {comp}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Ngân sách dự kiến */}
                <div className="flex flex-col gap-3">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                    <FontAwesomeIcon icon={faWallet} /> Ngân sách
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {BUDGET_OPTIONS.map((budget) => (
                      <button
                        key={budget}
                        onClick={() => setActiveBudget(budget)}
                        className={`px-3 py-1.5 text-xs font-bold rounded-full transition-colors ${
                          activeBudget === budget
                            ? "bg-[#002045] text-white shadow-md"
                            : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                        }`}
                      >
                        {budget}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. Sở thích cá nhân */}
                <div className="flex flex-col gap-3">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faHeart} /> Sở thích
                    </div>
                    <span className="text-[10px] text-slate-400 font-normal normal-case">
                      Có thể chọn nhiều
                    </span>
                  </label>

                  <div className="flex flex-wrap gap-2">
                    {/* Dùng slice để cắt mảng: Nếu showAllTags là false thì lấy 6 cái đầu, nếu true thì lấy hết */}
                    {INTEREST_OPTIONS.slice(
                      0,
                      showAllTags ? INTEREST_OPTIONS.length : 6,
                    ).map((tag) => (
                      <button
                        key={tag}
                        onClick={() => toggleInterest(tag)}
                        className={`px-3 py-1.5 text-[11px] font-bold rounded-full transition-colors ${
                          activeInterests.includes(tag)
                            ? "bg-[#002045] text-white shadow-md"
                            : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                        }`}
                      >
                        {tag}
                      </button>
                    ))}

                    {/* Nút Thu gọn / Mở rộng */}
                    <button
                      onClick={() => setShowAllTags(!showAllTags)}
                      className="px-3 py-1.5 text-[11px] font-bold rounded-full text-[#C4391D] bg-red-50 hover:bg-red-100 transition-colors"
                    >
                      {showAllTags
                        ? "Thu gọn bớt"
                        : `+ ${INTEREST_OPTIONS.length - 6} tùy chọn khác`}
                    </button>
                  </div>
                </div>

                {/* 5. Nút gạt: Công trình Văn hóa */}
                <div
                  className="bg-[#E5EDF4]/50 p-4 rounded-2xl flex items-center justify-between cursor-pointer border border-transparent hover:border-[#002045]/20 transition-colors"
                  onClick={() => setIsCultureFocus(!isCultureFocus)}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-colors ${
                        isCultureFocus
                          ? "bg-[#C4391D] text-white"
                          : "bg-white text-slate-400"
                      }`}
                    >
                      <FontAwesomeIcon icon={faLandmark} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#002045]">
                        Văn hóa
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        Ưu tiên di sản
                      </p>
                    </div>
                  </div>

                  <div
                    className={`w-11 h-6 rounded-full flex items-center p-1 transition-colors duration-300 ${
                      isCultureFocus ? "bg-[#C4391D]" : "bg-slate-300"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${
                        isCultureFocus ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </div>
                </div>

                {/* Nút Cập nhật */}
                <button
                  onClick={handleUpdate}
                  disabled={isLoading}
                  className="w-full bg-[#002045] text-white font-bold text-sm py-4 rounded-xl shadow-md hover:bg-blue-900 transition-colors flex items-center justify-center gap-2 mt-2 disabled:opacity-70"
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
                className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center gap-5 transition-all hover:shadow-md"
                data-aos="fade-right"
                data-aos-delay="100"
              >
                <FontAwesomeIcon
                  icon={weather.icon}
                  className={`${weather.color} text-4xl ${weather.temp === "--" ? "animate-pulse" : ""}`}
                />
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Thời tiết Đà Nẵng
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-[#002045] leading-none">
                      {weather.temp}°C
                    </span>
                    <div className="w-px h-8 bg-slate-200"></div>{" "}
                    {/* Vạch ngăn cách cho đẹp */}
                    <div className="flex flex-col">
                      {/* Dòng ngày tháng thực tế */}
                      <span className="text-[13px] font-bold text-[#002045]">
                        {new Date().toLocaleDateString("vi-VN", {
                          weekday: "long",
                        })}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {new Date().toLocaleDateString("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 italic">
                    {weather.desc}
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
                  {itineraryData.map((item, index) => (
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
