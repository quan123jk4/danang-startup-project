import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// IMPORT COMPONENT DÙNG CHUNG CỦA ÔNG
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";

// === CẤU HÌNH ICON DANH MỤC CHO CARD ===
const CATEGORY_ICONS = {
  attraction: (
    <svg
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
      />
    </svg>
  ),
  restaurant: (
    <svg
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
      />
    </svg>
  ),
  hotel: (
    <svg
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
      />
    </svg>
  ),
  entertainment: (
    <svg
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
};

const POPULAR_TAGS = [
  "#đồán",
  "#giárẻ",
  "#địađiểmvui chơi",
  "#đà_nẵng",
  "#biển",
];

export default function ExplorePage() {
  const navigate = useNavigate();
  const [places, setPlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchText, setSearchText] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    fetchPlaces();
  }, []);

  const fetchPlaces = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/v1/places?limit=all",
      );
      if (res.data.success) {
        setPlaces(res.data.data);
      }
    } catch (err) {
      console.error("Lỗi lấy danh sách địa điểm:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPlaces = places.filter((p) => {
    const matchesSearch =
      p.name?.toLowerCase().includes(searchText.toLowerCase()) ||
      p.address?.toLowerCase().includes(searchText.toLowerCase());
    const matchesTag = selectedTag
      ? p.tags?.some((t) => `#${t.toLowerCase()}` === selectedTag.toLowerCase())
      : true;
    return matchesSearch && matchesTag;
  });

  return (
    <div className="bg-[#E5EDF4] min-h-screen w-full flex flex-col items-center relative pb-0 overflow-hidden">
      <div className="w-full max-w-[1280px] bg-white shadow-2xl rounded-none flex flex-col min-h-screen">
        {/* 1. GẮN NAVBAR DÙNG CHUNG CỦA ÔNG VÀO ĐÂY */}
        <Navbar />

        {/* KHỐI NỘI DUNG CHÍNH CHẠY GIỮA LAYER */}
        <div className="w-full flex-1 flex px-6 md:px-12 py-10 gap-10 items-start">
          {/* CỘT TRÁI: SIDEBAR BỘ LỌC */}
          <aside className="w-64 space-y-6 sticky top-28 shrink-0">
            {/* Ô tìm kiếm */}
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full bg-[#f8fafc] border border-slate-200 text-xs rounded-xl pl-10 pr-4 py-3 outline-none focus:border-[#C4391D] transition-colors font-medium text-slate-700"
              />
              <svg
                className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 transform -translate-y-1/2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {/* Khối Tags phổ biến */}
            <div className="flex flex-wrap gap-1.5 border-b border-slate-100 pb-5">
              {POPULAR_TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(selectedTag === tag ? "" : tag)}
                  className={`text-[11px] font-bold px-2.5 py-1.5 rounded-md transition-all border cursor-pointer ${
                    selectedTag === tag
                      ? "bg-[#C4391D] text-white border-[#C4391D]"
                      : "bg-blue-50/50 text-blue-600 border-blue-100 hover:bg-blue-100/50"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Khối Menu chức năng */}
            <div className="flex flex-col gap-1">
              <button
                onClick={() => {
                  setActiveTab("favorite");
                  setSelectedTag("");
                }}
                className={`cursor-pointer flex items-center gap-3 w-full text-left px-4 py-3.5 rounded-xl text-xs font-bold transition-all ${activeTab === "favorite" ? "bg-blue-50 text-blue-700 shadow-sm" : "text-slate-600 hover:bg-slate-50"}`}
              >
                <svg
                  className="w-4 h-4 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                List yêu thích
              </button>

              <button
                onClick={() => {
                  setActiveTab("watchlater");
                }}
                className={`cursor-pointer flex items-center gap-3 w-full text-left px-4 py-3.5 rounded-xl text-xs font-bold transition-all ${activeTab === "watchlater" ? "bg-blue-50 text-blue-700 shadow-sm" : "text-slate-600 hover:bg-slate-50"}`}
              >
                <svg
                  className="w-4 h-4 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Xem sau
              </button>

              <button
                onClick={() => {
                  setActiveTab("checkin");
                }}
                className={`cursor-pointer flex items-center gap-3 w-full text-left px-4 py-3.5 rounded-xl text-xs font-bold transition-all ${activeTab === "checkin" ? "bg-blue-50 text-blue-700 shadow-sm" : "text-slate-600 hover:bg-slate-50"}`}
              >
                <svg
                  className="w-4 h-4 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                </svg>
                Đã checkin
              </button>

              <button
                onClick={() =>
                  alert("Chức năng gợi ý lộ trình đang được AI xử lý!")
                }
                className="cursor-pointer flex items-center gap-3 w-full text-left px-4 py-3.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all"
              >
                <svg
                  className="w-4 h-4 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
                Gợi ý từ AI
              </button>
            </div>
          </aside>

          {/* CỘT PHẢI: GRID CARD ĐỊA ĐIỂM */}
          <main className="flex-1">
            <div className="pb-4 mb-8">
              <h2 className="text-[28px] font-extrabold text-[#002045] uppercase tracking-tight">
                TRENDING NOW
              </h2>
              <p className="text-slate-500 text-xs mt-1">
                Những điểm đến đang thu hút sự chú ý của cộng đồng Danasoul
                Azure tuần này.
              </p>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <div className="animate-spin w-8 h-8 border-4 border-[#C4391D] border-t-transparent rounded-full"></div>
                <p className="text-xs font-bold text-slate-400">
                  Đang đồng bộ dữ liệu địa điểm...
                </p>
              </div>
            ) : filteredPlaces.length === 0 ? (
              <div className="text-center py-20 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                <p className="text-sm font-medium text-slate-400 italic">
                  Không tìm thấy địa điểm nào khớp với bộ lọc hiện tại.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPlaces.map((place) => (
                  <div
                    key={place._id}
                    onClick={() => navigate(`/explore/${place._id}`)}
                    className="bg-white rounded-[16px] shadow-[0_8px_24px_rgba(0,0,0,0.02)] border border-slate-100 overflow-hidden flex flex-col group hover:shadow-[0_12px_30px_rgba(0,0,0,0.06)] transition-all duration-300"
                  >
                    <div className="h-48 overflow-hidden relative bg-slate-100">
                      {place.images && place.images.length > 0 ? (
                        <img
                          src={place.images[0]}
                          alt={place.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300 text-xs font-bold">
                          No Image
                        </div>
                      )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          alert(`Đã lưu ${place.name}!`);
                        }}
                        className="cursor-pointer absolute top-3 right-3 w-8 h-8 rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center text-slate-700 shadow-sm hover:bg-white hover:scale-105 transition-all"
                      >
                        <svg
                          className="w-4 h-4 stroke-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                          />
                        </svg>
                      </button>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <h3 className="font-extrabold text-[15px] text-[#002045] line-clamp-1 group-hover:text-[#C4391D] transition-colors">
                          {place.name}
                        </h3>
                        <p className="text-[11px] font-medium text-slate-400 mt-1 line-clamp-2">
                          {place.description ||
                            "Chưa cập nhật dòng mô tả ngắn gọn cho địa danh này."}
                        </p>
                      </div>

                      <div className="flex justify-between items-center pt-2 border-t border-slate-50">
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-50/80 px-2.5 py-1 rounded-md border border-slate-100 uppercase tracking-wider">
                          {place.category === "attraction"
                            ? "Thắng cảnh"
                            : place.category === "restaurant"
                              ? "Nhà hàng"
                              : place.category === "hotel"
                                ? "Lưu trú"
                                : "Giải trí"}
                        </span>
                        <div className="text-slate-300 group-hover:text-[#002045] transition-colors">
                          {CATEGORY_ICONS[place.category] ||
                            CATEGORY_ICONS.attraction}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>

        {/* 2. GẮN FOOTER DÙNG CHUNG CỦA ÔNG VÀO CUỐI CONTAINER */}
        <Footer />
      </div>
    </div>
  );
}
