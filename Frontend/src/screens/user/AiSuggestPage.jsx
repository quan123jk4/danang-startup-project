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
  faSave,
  faHistory,
} from "@fortawesome/free-solid-svg-icons";

// AOS Animation
import AOS from "aos";
import "aos/dist/aos.css";

import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";

const COMPANION_OPTIONS = ["Một mình", "Cặp đôi", "Gia đình", "Bạn bè"];
const INTEREST_OPTIONS = [
  "Check-in",
  "Thiên nhiên",
  "Ẩm thực địa phương",
  "Hải sản",
  "Thư giãn",
  "Sôi động",
  "Văn hóa",
  "Lịch sử",
  "Tâm linh",
  "Khám phá",
  "Kiến trúc",
  "Biển",
  "Lãng mạn",
  "Gia đình",
  "Bạn bè",
  "Giới trẻ",
  "Bình dân",
  "Sang trọng",
  "Ăn nhậu",
  "Chợ đêm",
  "Mua sắm",
  "Nghỉ dưỡng",
  "View biển",
  "Hồ bơi",
  "Gần trung tâm",
];

const AiSuggestPage = () => {
  // State quản lý bộ lọc
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [budgetAmount, setBudgetAmount] = useState(0);
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

  // ==================== STATE CHO LƯU LỊCH TRÌNH ====================
  const [savedItineraries, setSavedItineraries] = useState([]);
  const [showSavedModal, setShowSavedModal] = useState(false);
  const [itineraryName, setItineraryName] = useState("");

  // Weather fetch
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=16.0678&longitude=108.2208&current_weather=true",
        );
        const data = await response.json();

        if (data && data.current_weather) {
          const currentTemp = Math.round(data.current_weather.temperature);
          const weatherCode = data.current_weather.weathercode;

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

    // Load saved itineraries
    const saved = JSON.parse(localStorage.getItem("savedItineraries") || "[]");
    setSavedItineraries(saved);
  }, []);

  const toggleInterest = (interest) => {
    if (activeInterests.includes(interest)) {
      setActiveInterests(activeInterests.filter((i) => i !== interest));
    } else {
      setActiveInterests([...activeInterests, interest]);
    }
  };

  const handleUpdate = async () => {
    let days = 3;
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (end < start) {
        alert("Ngày kết thúc phải sau ngày bắt đầu!");
        return;
      }
      days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    }

    const currentBudget = Number(budgetAmount) || 5000000;

    const payload = {
      days: days,
      destination: "Đà Nẵng",
      start_date: startDate ? new Date(startDate).toISOString() : null,
      budget: currentBudget,
      interests: activeInterests.map((tag) => tag.replace("#", "").trim()),
      travel_style: activeCompanions,
      travel_pace: "moderate",
      user_id: "guest",
    };

    console.log("📤 Payload gửi đi:", payload);
    setIsLoading(true);
    setItineraryData([]);

    try {
      const response = await fetch(
        "http://localhost:8000/api/python/generate-itinerary",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      const result = await response.json();
      console.log("📥 Response từ AI:", result);

      if (result.success && result.data?.days?.length > 0) {
        const flattenedItinerary = [];

        result.data.days.forEach((dayObj, dayIndex) => {
          if (dayObj.items && Array.isArray(dayObj.items)) {
            dayObj.items.forEach((placeItem) => {
              flattenedItinerary.push({
                id: placeItem.place_id || `item-${dayIndex}`,
                dayNumber: dayObj.dayNumber || `0${dayIndex + 1}`,
                dayLabel: dayObj.dayLabel || `Ngày ${dayIndex + 1}`,
                title: placeItem.title,
                category: placeItem.category,
                time: placeItem.time,
                description:
                  placeItem.description ||
                  "Trải nghiệm tuyệt vời theo gợi ý AI.",
                tags: placeItem.tags || [],
                image: placeItem.image,
                estimated_cost: placeItem.estimated_cost,
                rating: placeItem.rating,
                address: placeItem.address,
              });
            });
          }
        });

        setItineraryData(flattenedItinerary);
        setItineraryName(`Đà Nẵng ${days} ngày`);
      } else {
        alert(
          result.message ||
            "AI không trả về lịch trình. Hãy thử thay đổi sở thích.",
        );
      }
    } catch (error) {
      console.error("❌ Lỗi kết nối:", error);
      alert("Không kết nối được với server AI.");
    } finally {
      setIsLoading(false);
    }
  };

  // ==================== LƯU LỊCH TRÌNH ====================
  const handleSaveItinerary = () => {
    if (itineraryData.length === 0) {
      alert("Chưa có lịch trình để lưu!");
      return;
    }

    const newSaved = {
      id: Date.now(),
      name:
        itineraryName ||
        `Lịch trình Đà Nẵng ${new Date().toLocaleDateString("vi-VN")}`,
      date: new Date().toISOString(),
      data: itineraryData,
      totalDays: Math.max(
        ...itineraryData.map((i) => parseInt(i.dayNumber) || 1),
      ),
      budget: budgetAmount,
    };

    const updatedSaved = [newSaved, ...savedItineraries];
    localStorage.setItem("savedItineraries", JSON.stringify(updatedSaved));
    setSavedItineraries(updatedSaved);
    alert("✅ Đã lưu lịch trình thành công!");
  };

  const loadItinerary = (saved) => {
    setItineraryData(saved.data);
    setItineraryName(saved.name);
    setShowSavedModal(false);
    alert(`Đã tải lịch trình: ${saved.name}`);
  };

  const deleteItinerary = (id) => {
    const updated = savedItineraries.filter((item) => item.id !== id);
    localStorage.setItem("savedItineraries", JSON.stringify(updated));
    setSavedItineraries(updated);
  };

  return (
    <div className="bg-[#E5EDF4] min-h-screen w-full flex flex-col items-center relative">
      <div className="w-full max-w-[1280px] bg-white shadow-2xl rounded-none flex flex-col min-h-screen">
        <Navbar />

        <div className="flex-1 w-full bg-[#F8FAFC] px-6 md:px-12 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* SIDEBAR - CỘT TRÁI */}
            <div className="lg:col-span-3 flex flex-col gap-6 sticky top-24">
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
                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${activeCompanions === comp ? "bg-[#002045] text-white shadow-md" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}
                      >
                        {comp}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Ngân sách */}
                <div className="flex flex-col gap-3">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                    <FontAwesomeIcon icon={faWallet} /> Ngân sách chuyến đi
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={
                        budgetAmount === ""
                          ? ""
                          : new Intl.NumberFormat("vi-VN").format(budgetAmount)
                      }
                      onChange={(e) =>
                        setBudgetAmount(e.target.value.replace(/\D/g, ""))
                      }
                      placeholder="Nhập ngân sách của bạn..."
                      className="w-full bg-slate-50 border border-slate-200 text-[#002045] text-sm rounded-xl px-4 py-3 pr-12 focus:outline-none focus:border-[#002045] font-bold"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">
                      VNĐ
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {[2000000, 5000000, 10000000].map((b) => (
                      <button
                        key={b}
                        onClick={() => setBudgetAmount(b)}
                        className="text-[10px] bg-slate-100 text-slate-500 font-bold px-3 py-1.5 rounded-md hover:bg-slate-200"
                      >
                        {b / 1000000} Triệu
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. Sở thích */}
                <div className="flex flex-col gap-3">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faHeart} /> Sở thích
                    </div>
                    <span className="text-[10px] text-slate-400 font-normal">
                      Có thể chọn nhiều
                    </span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {INTEREST_OPTIONS.slice(
                      0,
                      showAllTags ? INTEREST_OPTIONS.length : 6,
                    ).map((tag) => (
                      <button
                        key={tag}
                        onClick={() => toggleInterest(tag)}
                        className={`px-3 py-1.5 text-[11px] font-bold rounded-full transition-colors ${activeInterests.includes(tag) ? "bg-[#002045] text-white shadow-md" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}
                      >
                        {tag}
                      </button>
                    ))}
                    <button
                      onClick={() => setShowAllTags(!showAllTags)}
                      className="px-3 py-1.5 text-[11px] font-bold rounded-full text-[#C4391D] bg-red-50 hover:bg-red-100"
                    >
                      {showAllTags
                        ? "Thu gọn bớt"
                        : `+ ${INTEREST_OPTIONS.length - 6} tùy chọn khác`}
                    </button>
                  </div>
                </div>

                {/* 5. Văn hóa toggle */}
                <div
                  className="bg-[#E5EDF4]/50 p-4 rounded-2xl flex items-center justify-between cursor-pointer"
                  onClick={() => setIsCultureFocus(!isCultureFocus)}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${isCultureFocus ? "bg-[#C4391D] text-white" : "bg-white text-slate-400"}`}
                    >
                      <FontAwesomeIcon icon={faLandmark} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#002045]">
                        Văn hóa
                      </p>
                      <p className="text-[10px] text-slate-500">
                        Ưu tiên di sản
                      </p>
                    </div>
                  </div>
                  <div
                    className={`w-11 h-6 rounded-full flex items-center p-1 ${isCultureFocus ? "bg-[#C4391D]" : "bg-slate-300"}`}
                  >
                    <div
                      className={`w-4 h-4 bg-white rounded-full shadow-sm transform ${isCultureFocus ? "translate-x-5" : "translate-x-0"}`}
                    />
                  </div>
                </div>

                {/* Nút hành động */}
                <button
                  onClick={handleUpdate}
                  disabled={isLoading}
                  className="w-full bg-[#002045] text-white font-bold text-sm py-4 rounded-xl shadow-md hover:bg-blue-900 flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  <FontAwesomeIcon
                    icon={faWandMagicSparkles}
                    className={isLoading ? "animate-spin" : ""}
                  />
                  {isLoading ? "Đang tạo..." : "Cập nhật Lịch trình"}
                </button>

                {itineraryData.length > 0 && (
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <button
                      onClick={handleSaveItinerary}
                      className="bg-emerald-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2"
                    >
                      <FontAwesomeIcon icon={faSave} /> Lưu
                    </button>
                    <button
                      onClick={() => setShowSavedModal(true)}
                      className="bg-white border border-slate-300 text-slate-700 font-bold py-4 rounded-xl flex items-center justify-center gap-2"
                    >
                      <FontAwesomeIcon icon={faHistory} /> Đã lưu
                    </button>
                  </div>
                )}
              </div>

              {/* Widget Thời tiết */}
              <div
                className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center gap-5"
                data-aos="fade-right"
                data-aos-delay="100"
              >
                <FontAwesomeIcon
                  icon={weather.icon}
                  className={`${weather.color} text-4xl`}
                />
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Thời tiết Đà Nẵng
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-[#002045]">
                      {weather.temp}°C
                    </span>
                    <div className="flex flex-col">
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

            {/* CỘT PHẢI: KẾT QUẢ */}
            <div className="lg:col-span-9">
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
                  cho bạn.
                </p>
              </div>

              <div className="relative">
                <div className="absolute left-[39px] top-0 bottom-0 w-px bg-slate-200 hidden md:block z-0"></div>
                <div className="flex flex-col gap-12">
                  {itineraryData.map((item, index) => (
                    <div
                      key={item.id}
                      className="relative flex flex-col md:flex-row gap-6 md:gap-12 z-10"
                      data-aos="fade-up"
                      data-aos-delay={index * 150}
                    >
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

                      <div className="flex-1 bg-white rounded-3xl p-3 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow group">
                        <div className="w-full md:w-[240px] h-[200px] shrink-0 rounded-2xl overflow-hidden relative">
                          <img
                            src={
                              item.image ||
                              "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800"
                            }
                            alt={item.title}
                            onError={(e) => {
                              e.target.src =
                                "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800";
                            }}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        </div>

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
                            {item.tags.map((tag, i) => (
                              <span
                                key={i}
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

      {/* MODAL LỊCH TRÌNH ĐÃ LƯU */}
      {showSavedModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 w-full max-w-lg max-h-[85vh] overflow-auto">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <FontAwesomeIcon icon={faHistory} /> Lịch trình đã lưu
            </h2>
            {savedItineraries.length === 0 ? (
              <p className="text-center py-8 text-slate-500">
                Chưa có lịch trình nào được lưu.
              </p>
            ) : (
              <div className="space-y-4">
                {savedItineraries.map((saved) => (
                  <div
                    key={saved.id}
                    className="border rounded-2xl p-5 hover:bg-slate-50"
                  >
                    <h4 className="font-bold">{saved.name}</h4>
                    <p className="text-sm text-slate-500">
                      {saved.totalDays} ngày •{" "}
                      {new Date(saved.date).toLocaleDateString("vi-VN")}
                    </p>
                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={() => loadItinerary(saved)}
                        className="flex-1 bg-[#002045] text-white py-3 rounded-xl text-sm font-bold"
                      >
                        Tải lại
                      </button>
                      <button
                        onClick={() => deleteItinerary(saved.id)}
                        className="flex-1 border border-red-300 text-red-600 py-3 rounded-xl text-sm font-bold"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={() => setShowSavedModal(false)}
              className="mt-6 w-full py-4 border border-slate-300 rounded-2xl font-bold"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiSuggestPage;
