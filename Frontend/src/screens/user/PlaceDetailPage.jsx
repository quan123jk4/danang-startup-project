import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

// IMPORT COMPONENT DÙNG CHUNG CỦA ÔNG
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";

export default function PlaceDetailPage() {
  const { id } = useParams(); // Lấy ID động từ URL
  const navigate = useNavigate();
  const [place, setPlace] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPlaceDetail = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:5000/api/v1/places/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        if (res.data.success) {
          setPlace(res.data.data);
        }
      } catch (err) {
        console.error("Lỗi lấy chi tiết địa điểm:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlaceDetail();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#E5EDF4] flex flex-col items-center justify-center gap-3">
        <div className="animate-spin w-8 h-8 border-4 border-[#C4391D] border-t-transparent rounded-full"></div>
        <p className="text-xs font-bold text-slate-400">
          Đang tải thông tin chi tiết...
        </p>
      </div>
    );
  }

  if (!place) {
    return (
      <div className="min-h-screen bg-[#E5EDF4] flex flex-col items-center justify-center gap-4">
        <p className="text-slate-500 font-bold text-sm">
          Không tìm thấy dữ liệu địa điểm này!
        </p>
        <button
          onClick={() => navigate("/explore")}
          className="bg-[#002045] text-white px-5 py-2 rounded-xl text-xs font-bold cursor-pointer"
        >
          Quay lại
        </button>
      </div>
    );
  }

  // LOGIC CHECK GIÁ: NẾU KHÔNG CÓ GIÁ HOẶC BẰNG 0 THÌ HIỂN THỊ MIỄN PHÍ
  const isFree =
    (!place.minPrice && !place.maxPrice) ||
    (place.minPrice === 0 && place.maxPrice === 0);

  return (
    <div className="bg-[#E5EDF4] min-h-screen w-full flex flex-col items-center relative pb-0 overflow-hidden">
      <div className="w-full max-w-[1280px] bg-white shadow-2xl rounded-none flex flex-col min-h-screen">
        {/* NAVBAR */}
        <Navbar />

        {/* NÚT BACK VÀ TIÊU ĐỀ NẰM TRÊN ẢNH (ĐÃ TINH CHỈNH THOÁNG ĐÃNG) */}
        <div className="w-full px-6 md:px-12 pt-8 space-y-5">
          <button
            type="button"
            onClick={() => navigate("/explore")}
            className="cursor-pointer text-[11px] font-black text-slate-400 hover:text-[#C4391D] transition-colors flex items-center gap-2 tracking-widest uppercase"
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
            Quay lại trang khám phá
          </button>

          <div className="space-y-3 pt-1">
            <div className="flex flex-wrap gap-2">
              {place.tags?.map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-slate-100 text-slate-600 text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-wider border border-slate-200/40"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <h1 className="text-3xl font-black text-[#002045] tracking-tight leading-none">
              {place.name}
            </h1>

            <p className="text-xs font-bold text-slate-400 flex items-center gap-1.5 pt-1">
              <svg
                className="w-3.5 h-3.5 text-[#C4391D] shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {place.address}
            </p>
          </div>
        </div>

        {/* CẤU TRÚC LAYOUT PHẦN TRÊN (ẢNH & THÔNG TIN DỊCH VỤ) */}
        <div className="w-full px-6 md:px-12 py-6 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start border-b border-slate-100 pb-10">
          {/* CỘT TRÁI + GIỮA: KHUNG ẢNH h-[320px] */}
          <div className="lg:col-span-2">
            <div className="w-full h-[320px] rounded-[24px] overflow-hidden shadow-sm bg-slate-100">
              <img
                src={
                  place.images && place.images.length > 0
                    ? place.images[0]
                    : "https://images.unsplash.com/photo-1555939594-58d7cb561ad1"
                }
                alt={place.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* CỘT PHẢI: THÔNG TIN PHỤ, DISCRIMINATOR DATA & GIỚI THIỆU */}
          <div className="space-y-4">
            {/* Box 1: Khoảng giá (Đã fix logic Miễn phí) */}
            <div className="bg-white rounded-[24px] border border-slate-100 p-5 shadow-sm flex justify-between items-center">
              <span className="text-xs font-black text-slate-400 uppercase tracking-wider">
                Khoảng giá:
              </span>
              <span
                className={`font-extrabold text-sm ${isFree ? "text-green-600 bg-green-50 px-3 py-1 rounded-lg border border-green-100 uppercase text-[11px] tracking-wider" : "text-[#C4391D]"}`}
              >
                {isFree
                  ? "Miễn phí"
                  : `${place.minPrice?.toLocaleString()}đ - ${place.maxPrice?.toLocaleString()}đ`}
              </span>
            </div>

            {/* Box 2: Dữ liệu cấu trúc đặc thù */}
            <div className="bg-slate-50/80 border border-slate-200/60 rounded-[24px] p-5 shadow-inner space-y-3">
              <h3 className="text-xs font-black text-[#002045] uppercase tracking-widest border-b border-slate-200 pb-2">
                Thông tin dịch vụ ({place.category?.toUpperCase()})
              </h3>
              {place.category === "attraction" && (
                <div className="space-y-2.5 text-xs font-medium text-slate-600">
                  <p>
                    🔹 <b className="text-slate-800">Giá vé cổng:</b>{" "}
                    {place.ticketPrice
                      ? `${place.ticketPrice.toLocaleString()}đ`
                      : "Miễn phí"}
                  </p>
                  <p>
                    🔹 <b className="text-slate-800">Thời gian tham quan:</b>{" "}
                    {place.tourDuration || 90} phút
                  </p>
                  {place.rules && (
                    <p>
                      🔹 <b className="text-slate-800">Nội quy:</b>{" "}
                      {place.rules}
                    </p>
                  )}
                </div>
              )}
              {place.category === "restaurant" && (
                <div className="space-y-2.5 text-xs font-medium text-slate-600">
                  <p>
                    🍽️ <b className="text-slate-800">Loại hình ẩm thực:</b>{" "}
                    {place.cuisineType || "Đặc sản địa phương"}
                  </p>
                  <p>
                    ⚡ <b className="text-slate-800">Hình thức phục vụ:</b>{" "}
                    {place.serviceType || "Gọi món (Alacarte)"}
                  </p>
                </div>
              )}
              {place.category === "hotel" && (
                <div className="space-y-2.5 text-xs font-medium text-slate-600">
                  <p>
                    🏨 <b className="text-slate-800">Tiện nghi:</b>{" "}
                    {place.amenities?.join(", ") || "Wifi free, Điều hòa"}
                  </p>
                </div>
              )}
              {place.category === "entertainment" && (
                <div className="space-y-2.5 text-xs font-medium text-slate-600">
                  <p>
                    🎉 <b className="text-slate-800">Loại hình:</b>{" "}
                    {place.activityType || "Giải trí tổng hợp"}
                  </p>
                </div>
              )}
            </div>

            {/* Box 3: Giới thiệu địa danh */}
            <div className="bg-white rounded-[24px] border border-slate-100 p-5 shadow-sm space-y-2">
              <h3 className="text-xs font-black text-[#002045] uppercase tracking-widest">
                Giới thiệu địa danh
              </h3>
              <p className="text-slate-600 text-xs leading-relaxed line-clamp-4">
                {place.description || "Chưa có nội dung mô tả chi tiết."}
              </p>
            </div>
          </div>
        </div>

        {/* ==========================================
            KHÔNG GIAN DƯỚI: ĐÁNH GIÁ TỪ CỘNG ĐỒNG (FULL WIDTH & PAGINATION)
           ========================================== */}
        <div className="w-full px-6 md:px-12 py-10 bg-slate-50/50 flex-1">
          <div className="w-full max-w-4xl mx-auto space-y-6">
            <h2 className="text-xl font-black text-[#002045] uppercase tracking-tight flex items-center gap-2">
              💬 Đánh giá từ cộng đồng{" "}
              <span className="text-xs font-bold text-slate-400 bg-white border px-2 py-0.5 rounded-md">
                2
              </span>
            </h2>

            <div className="space-y-4">
              {/* REVIEW 1 */}
              <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border border-slate-100">
                      <img
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100"
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-[#002045]">
                        Minh Anh
                      </h4>
                      <div className="text-amber-500 text-xs mt-0.5">
                        ⭐⭐⭐⭐⭐
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-slate-400">
                    15/10/2026
                  </span>
                </div>
                <p className="text-slate-600 text-xs leading-relaxed pl-1">
                  Không gian vô cùng tôn nghiêm và thanh tịnh. Khung cảnh nhìn
                  từ trên chùa hướng ra biển Mỹ Khê tuyệt đẹp, rất đáng để ghé
                  thăm khi đến Sơn Trà.
                </p>
              </div>

              {/* REVIEW 2 */}
              <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border border-slate-100">
                      <img
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100"
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-[#002045]">
                        Hoang Nguyen
                      </h4>
                      <div className="text-amber-500 text-xs mt-0.5">
                        ⭐⭐⭐⭐☆
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-slate-400">
                    10/10/2026
                  </span>
                </div>
                <p className="text-slate-600 text-xs leading-relaxed pl-1">
                  Chùa rất đẹp nhưng cuối tuần hơi đông đúc một chút. Mọi người
                  nên đi sớm tầm đầu giờ sáng để tránh nắng và chụp ảnh được
                  vắng người hơn.
                </p>
              </div>
            </div>

            {/* PAGINATION */}
            <div className="pt-4 flex items-center justify-center gap-2">
              <button
                type="button"
                className="w-8 h-8 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 hover:bg-slate-50 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              <button
                type="button"
                className="w-8 h-8 flex items-center justify-center rounded-xl text-xs font-black bg-[#002045] text-white shadow-sm"
              >
                1
              </button>
              <button
                type="button"
                className="w-8 h-8 flex items-center justify-center rounded-xl text-xs font-bold bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                2
              </button>
              <button
                type="button"
                className="w-8 h-8 flex items-center justify-center rounded-xl text-xs font-bold bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                3
              </button>

              <button
                type="button"
                className="w-8 h-8 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 hover:bg-slate-50 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <Footer />
      </div>
    </div>
  );
}
