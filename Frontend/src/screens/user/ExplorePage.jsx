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

  // ==========================================
  // 🌟 ĐỊNH CẤU HÌNH PHÂN TRANG: 9 Ô / TRANG
  // ==========================================
  const [currentPage, setCurrentPage] = useState(1);
  const placesPerPage = 9;

  useEffect(() => {
    fetchPlaces();
  }, []);

  // Đưa về trang 1 nếu người dùng thực hiện lọc/tìm kiếm dữ liệu mới
  useEffect(() => {
    setCurrentPage(1);
  }, [searchText, selectedTag, activeTab]);

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

  // ==========================================
  // THUẬT TOÁN CHIA KHỐI TRANG ĐỘNG
  // ==========================================
  const indexOfLastPlace = currentPage * placesPerPage;
  const indexOfFirstPlace = indexOfLastPlace - placesPerPage;
  const currentPlaces = filteredPlaces.slice(
    indexOfFirstPlace,
    indexOfLastPlace,
  );
  const totalPages = Math.ceil(filteredPlaces.length / placesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  // Rút gọn dãy số phân trang quá dài thành dấu ...
  const getPaginationRange = () => {
    const delta = 1;
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i);
      }
    }
    for (let i of range) {
      if (l) {
        if (i - l === 2) rangeWithDots.push(l + 1);
        else if (i - l > 2) rangeWithDots.push("...");
      }
      rangeWithDots.push(i);
      l = i;
    }
    return rangeWithDots;
  };

  return (
    <div className="bg-[#E5EDF4] min-h-screen w-full flex flex-col items-center relative pb-0 overflow-hidden">
      <div className="w-full max-w-[1280px] bg-white shadow-2xl rounded-none flex flex-col min-h-screen">
        {/* NAVBAR */}
        <Navbar />

        {/* KHỐI NỘI DUNG CHÍNH */}
        <div className="w-full flex-1 flex flex-col lg:flex-row px-6 md:px-12 py-10 gap-10 items-start">
          {/* ==========================================
              CỘT TRÁI: SIDEBAR BỘ LỌC CHỈNH LẠI CỰC ĐẸP
             ========================================== */}
          <aside className="w-full lg:w-64 space-y-5 sticky top-28 shrink-0">
            {/* Hộp Tìm kiếm độc lập */}
            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block pl-1">
                Tìm kiếm nhanh
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Nhập tên, địa danh..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="w-full bg-[#f8fafc] border border-slate-200 text-xs rounded-xl pl-10 pr-4 py-3 outline-none focus:border-[#C4391D] focus:bg-white transition-all font-semibold text-slate-700 shadow-inner"
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
            </div>

            {/* Hộp chứa Bộ lọc chức năng & Tags hệ thống */}
            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] space-y-4">
              {/* Cụm Tags */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block pl-1">
                  Từ khóa nổi bật
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_TAGS.map((tag) => {
                    const isSelected = selectedTag === tag;
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => setSelectedTag(isSelected ? "" : tag)}
                        className={`text-[10px] font-extrabold px-3 py-1.5 rounded-lg transition-all border cursor-pointer uppercase tracking-wider ${
                          isSelected
                            ? "bg-[#C4391D] text-white border-[#C4391D] shadow-sm shadow-red-500/20 scale-[1.02]"
                            : "bg-slate-50 text-slate-500 border-slate-200/60 hover:bg-slate-100 hover:text-slate-700"
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              <hr className="border-slate-100/80" />

              {/* Nhóm Menu chức năng thiết kế dạng list cực mượt */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block pl-1 mb-1">
                  Thư mục cá nhân
                </label>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("all");
                    setSelectedTag("");
                  }}
                  className={`cursor-pointer flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all border ${activeTab === "all" && !selectedTag ? "bg-red-50/60 text-[#C4391D] border-red-100/50 shadow-sm" : "text-slate-600 border-transparent hover:bg-slate-50 hover:text-slate-900"}`}
                >
                  🌐 Tất cả địa điểm
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("favorite");
                    setSelectedTag("");
                  }}
                  className={`cursor-pointer flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all border ${activeTab === "favorite" ? "bg-blue-50/60 text-blue-700 border-blue-100/40 shadow-sm" : "text-slate-600 border-transparent hover:bg-slate-50 hover:text-slate-900"}`}
                >
                  ❤️ List yêu thích
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("watchlater")}
                  className={`cursor-pointer flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all border ${activeTab === "watchlater" ? "bg-amber-50/60 text-amber-700 border-amber-100/40 shadow-sm" : "text-slate-600 border-transparent hover:bg-slate-50 hover:text-slate-900"}`}
                >
                  🕒 Xem sau
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("checkin")}
                  className={`cursor-pointer flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all border ${activeTab === "checkin" ? "bg-emerald-50/60 text-emerald-700 border-emerald-100/40 shadow-sm" : "text-slate-600 border-transparent hover:bg-slate-50 hover:text-slate-900"}`}
                >
                  📍 Đã checkin
                </button>

                <button
                  type="button"
                  onClick={() =>
                    alert("Chức năng gợi ý lộ trình đang được AI xử lý!")
                  }
                  className="cursor-pointer flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl text-xs font-bold text-slate-600 border border-transparent hover:bg-indigo-50/40 hover:text-indigo-600 transition-all"
                >
                  💡 Gợi ý từ AI
                </button>
              </div>
            </div>
          </aside>

          {/* ==========================================
              CỘT PHẢI: GRID CARD 9 Ô ĐỊA ĐIỂM & PHÂN TRANG
             ========================================== */}
          <main className="flex-1 w-full">
            <div className="pb-4 mb-6">
              <h2 className="text-[26px] font-black text-[#002045] uppercase tracking-tight">
                TRENDING NOW
              </h2>
              <p className="text-slate-400 text-xs font-medium mt-0.5">
                Những điểm đến đang thu hút sự chú ý của cộng đồng Danasoul
                Azure tuần này.
              </p>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-24 gap-3 bg-white border border-slate-100 rounded-3xl">
                <div className="animate-spin w-7 h-7 border-4 border-[#C4391D] border-t-transparent rounded-full"></div>
                <p className="text-xs font-bold text-slate-400 tracking-wider">
                  Đang đồng bộ luồng dữ liệu...
                </p>
              </div>
            ) : currentPlaces.length === 0 ? (
              <div className="text-center py-20 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                <p className="text-xs font-bold text-slate-400 italic">
                  Không tìm thấy địa điểm nào khớp với bộ lọc hiện tại.
                </p>
              </div>
            ) : (
              <div className="space-y-10">
                {/* GRID 3 CỘT X 3 HÀNG = CÂN ĐỐI 9 Ô TRANG */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentPlaces.map((place) => (
                    <div
                      key={place._id}
                      onClick={() => navigate(`/explore/${place._id}`)}
                      className="bg-white rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.01)] border border-slate-100 overflow-hidden flex flex-col justify-between group hover:shadow-[0_12px_30px_rgba(0,0,0,0.05)] hover:border-slate-200/60 transition-all duration-300 relative cursor-pointer"
                    >
                      <div className="h-48 overflow-hidden relative bg-slate-50">
                        <img
                          src={
                            // LẤY ẢNH ĐÚNG FORMAT: MẢNG OBJECT CỦA MONGODB
                            Array.isArray(place.images) &&
                            place.images.length > 0
                              ? typeof place.images[0] === "string"
                                ? place.images[0]
                                : place.images[0].url // Xử lý trường hợp là Object {url: "..."}
                              : "https://images.unsplash.com/photo-1555939594-58d7cb561ad1"
                          }
                          alt={place.name}
                          // THÊM CÁI NÀY ĐỂ TRÁNH ẢNH LỖI (FALLBACK)
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://images.unsplash.com/photo-1555939594-58d7cb561ad1";
                          }}
                          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                        />
                        {/* Nút bookmark */}
                        <button
                          type="button"
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

                      {/* Nội dung thông tin Card */}
                      <div className="p-5 flex-grow flex flex-col justify-between gap-4">
                        <div className="space-y-1.5">
                          <h3 className="font-extrabold text-[15px] text-[#002045] line-clamp-1 group-hover:text-[#C4391D] transition-colors tracking-tight">
                            {place.name}
                          </h3>
                          <p className="text-[11px] font-semibold text-slate-400 line-clamp-2 leading-relaxed">
                            {place.description ||
                              "Chưa cập nhật dòng mô tả ngắn gọn cho địa danh này."}
                          </p>
                        </div>

                        <div className="flex justify-between items-center pt-2.5 border-t border-slate-50">
                          <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200/50 uppercase tracking-widest">
                            {place.category === "attraction"
                              ? "Thắng cảnh"
                              : place.category === "restaurant"
                                ? "Nhà hàng"
                                : place.category === "hotel"
                                  ? "Lưu trú"
                                  : "Giải trí"}
                          </span>
                          <div className="text-slate-300 group-hover:text-[#002045] transition-colors scale-95 group-hover:scale-100 duration-300">
                            {CATEGORY_ICONS[place.category] ||
                              CATEGORY_ICONS.attraction}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* ==========================================
                    CỤM NÚT PHÂN TRANG (PAGINATION) CHUẨN ĐẸP
                   ========================================== */}
                {totalPages > 1 && (
                  <div className="pt-6 flex items-center justify-center gap-1.5 border-t border-slate-100">
                    {/* Nút lùi trang */}
                    <button
                      type="button"
                      onClick={prevPage}
                      disabled={currentPage === 1}
                      className="w-8 h-8 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white transition-all cursor-pointer disabled:cursor-not-allowed"
                    >
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>

                    {/* Dãy số trang thông minh với dấu ... */}
                    {getPaginationRange().map((num, idx) => {
                      if (num === "...") {
                        return (
                          <span
                            key={`dots-${idx}`}
                            className="w-8 h-8 flex items-center justify-center text-xs font-bold text-slate-300 select-none"
                          >
                            ...
                          </span>
                        );
                      }
                      return (
                        <button
                          key={`page-${num}`}
                          type="button"
                          onClick={() => paginate(num)}
                          className={`w-8 h-8 flex items-center justify-center rounded-xl text-xs font-black transition-all border cursor-pointer ${
                            currentPage === num
                              ? "bg-[#002045] text-white border-[#002045] shadow-sm scale-105"
                              : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50 hover:text-slate-800"
                          }`}
                        >
                          {num}
                        </button>
                      );
                    })}

                    {/* Nút tiến trang */}
                    <button
                      type="button"
                      onClick={nextPage}
                      disabled={currentPage === totalPages}
                      className="w-8 h-8 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white transition-all cursor-pointer disabled:cursor-not-allowed"
                    >
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
        <Footer />
      </div>
    </div>
  );
}
