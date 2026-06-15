import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

export default function HeritageDetailPage() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // ==========================================
    // MOCK DATA ĐÃ ĐƯỢC FIX LỖI FONT VÀ LINK ẢNH
    // ==========================================
    const mockDatabase = {
      "cau-rong": {
        name: "Cầu Rồng",
        categoryName: "Văn hóa",
        tag: "Di sản đặc sắc",
        shortDescription: "Biểu tượng đương đại của khát vọng vươn xa.",
        description:
          "Cầu Rồng không chỉ là một công trình giao thông trọng điểm mà còn là biểu tượng nghệ thuật độc bản, kết nối quá khứ hào hùng với tương lai rạng rỡ của thành phố Đà Nẵng.\nVới thiết kế mô phỏng hình dáng con rồng thời Lý bay ra biển Đông, cây cầu thể hiện tinh thần phóng khoáng, khát vọng hòa bình và sự thịnh vượng của dân tộc Việt Nam trong kỷ nguyên mới.",
        images: [
          {
            url: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?q=80&w=1200&auto=format&fit=crop",
          }, // Ảnh chính
          {
            url: "https://images.unsplash.com/photo-1583417657209-d3dd445beafa?q=80&w=500&auto=format&fit=crop",
          }, // Ảnh nhỏ 1
          {
            url: "https://images.unsplash.com/photo-1557335200-a6db4cb30e18?q=80&w=500&auto=format&fit=crop",
          }, // Ảnh nhỏ 2
          {
            url: "https://images.unsplash.com/photo-1678184518712-421b4a0350d7?q=80&w=500&auto=format&fit=crop",
          }, // Ảnh nhỏ 3
        ],
        stats: [
          { label: "Kiến trúc", value: "Hình tượng Rồng thời Lý" },
          { label: "Chiều dài", value: "666 Mét" },
        ],
        timeline: [
          {
            year: "2009",
            title: "Khởi công",
            description: "Ngày 19/7/2009, công trình chính thức khởi công.",
          },
          {
            year: "2013",
            title: "Khánh thành",
            description: "Chính thức thông xe vào ngày 29/3/2013.",
          },
          {
            year: "2014",
            title: "Giải thưởng",
            description: "Nhận giải thưởng lớn từ ACEC (Hoa Kỳ).",
          },
          {
            year: "Nay",
            title: "Biểu tượng",
            description: "Trở thành điểm đến biểu tượng với màn phun lửa.",
          },
        ],
      },
    };

    const resultData = mockDatabase[slug] || mockDatabase["cau-rong"];
    setData(resultData);
    setIsLoading(false);
  }, [slug]);

  if (isLoading || !data)
    return <div className="min-h-screen bg-[#330713]"></div>;

  return (
    <div className="min-h-screen bg-[#330713] text-[#F3E5D8] font-sans selection:bg-[#D4AF37]/30 relative overflow-x-hidden">
      {/* Background Texture Vàng Đỏ Sang Trọng */}
      <div
        className="absolute top-0 left-0 w-full h-[800px] opacity-30 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 20%, #701127 0%, transparent 70%)",
        }}
      ></div>

      {/* TOP NAVIGATION CHUẨN */}
      <nav className="fixed top-0 w-full z-50 bg-[#1A0309]/95 backdrop-blur-md border-b border-[#D4AF37]/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="font-serif text-2xl text-[#D4AF37] italic font-bold tracking-widest">
            DI SẢN VIỆT
          </div>
          <div className="hidden md:flex gap-10 items-center text-[12px] tracking-[0.25em] font-semibold">
            <Link
              className="text-[#F3E5D8]/60 hover:text-[#D4AF37] transition-all"
              to="/"
            >
              TRANG CHỦ
            </Link>
            <Link
              className="text-[#F3E5D8]/60 hover:text-[#D4AF37] transition-all"
              to="/di-tich"
            >
              DI TÍCH
            </Link>
            <Link
              className="text-[#F3E5D8]/60 hover:text-[#D4AF37] transition-all"
              to="/lich-su"
            >
              LỊCH SỬ
            </Link>
            <Link
              className="text-[#D4AF37] border-b-2 border-[#D4AF37] pb-1"
              to="/van-hoa"
            >
              VĂN HÓA
            </Link>
            <Link
              className="text-[#F3E5D8]/60 hover:text-[#D4AF37] transition-all"
              to="/lien-he"
            >
              LIÊN HỆ
            </Link>
          </div>
          <div className="flex items-center gap-6">
            <button className="text-[#D4AF37] hover:opacity-70 transition-opacity">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </button>
            <button className="bg-transparent text-[#D4AF37] px-6 py-2 text-[12px] tracking-[0.2em] font-bold rounded border border-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#330713] transition-all duration-300">
              KHÁM PHÁ
            </button>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="pt-36 pb-20 max-w-7xl mx-auto px-6 relative z-10">
        {/* HEADER SECTION */}
        <div className="mb-14">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-[1px] w-12 bg-[#D4AF37]"></div>
            <span className="text-[#D4AF37] text-[12px] tracking-[0.3em] uppercase font-bold">
              {data.tag}
            </span>
          </div>
          <h1 className="font-serif text-6xl md:text-7xl text-[#D4AF37] font-bold mb-4 drop-shadow-lg tracking-wide">
            {data.categoryName}
          </h1>
          <p className="text-xl italic text-[#F3E5D8]/80 font-serif max-w-2xl">
            {data.name} — {data.shortDescription}
          </p>
        </div>

        {/* GALLERY & INFO SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-32">
          {/* Left Column: Images (7 columns) */}
          <div className="lg:col-span-7 flex flex-col gap-5 relative">
            {/* Hiệu ứng Glow mờ đằng sau ảnh */}
            <div className="absolute inset-0 bg-[#D4AF37]/10 blur-3xl rounded-full"></div>

            <div className="relative aspect-[16/9] rounded-xl overflow-hidden border border-[#D4AF37]/30 shadow-[0_20px_50px_rgba(0,0,0,0.5)] group">
              <img
                src={data.images[0].url}
                alt={data.name}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              {/* Overlay tối dần xuống đáy */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A0309]/80 via-transparent to-transparent pointer-events-none"></div>
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-3 gap-5 relative z-10">
              {data.images.slice(1, 4).map((img, idx) => (
                <div
                  key={idx}
                  className="aspect-[4/3] rounded-lg overflow-hidden border border-[#D4AF37]/20 hover:border-[#D4AF37] cursor-pointer transition-all duration-300 shadow-lg hover:-translate-y-1"
                >
                  <img
                    src={img.url}
                    alt={`Detail ${idx}`}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Information (5 columns) */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="pl-8 border-l-2 border-[#D4AF37]/40 relative">
              {/* Điểm nhấn thiết kế góc trên */}
              <div className="absolute top-0 left-[-6px] w-2.5 h-2.5 bg-[#D4AF37] rounded-full"></div>

              <h2 className="font-serif text-3xl text-[#D4AF37] font-bold mb-8">
                Thông tin chung
              </h2>

              <div className="text-[15px] leading-loose text-[#F3E5D8]/80 space-y-6 text-justify">
                {data.description.split("\n").map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>

              {/* Stats Box - Khung nổi cho thông số */}
              <div className="mt-12 bg-[#21040D] border border-[#D4AF37]/20 p-6 rounded-xl shadow-inner">
                <div className="grid grid-cols-2 gap-8">
                  {data.stats.map((stat, idx) => (
                    <div key={idx}>
                      <div className="text-[#D4AF37] text-[10px] tracking-[0.2em] font-bold uppercase mb-2 opacity-80">
                        {stat.label}
                      </div>
                      <div className="font-serif text-[#F3E5D8] text-lg">
                        {stat.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* DIVIDER VĂN HÓA CỔ */}
        <div className="flex items-center justify-center gap-8 mb-24 opacity-60">
          <div className="h-[1px] w-32 bg-gradient-to-r from-transparent to-[#D4AF37]"></div>
          {/* Icon Trống Đồng / Văn Hóa */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-8 h-8 text-[#D4AF37]"
          >
            <path d="M12 2.25a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5a.75.75 0 01.75-.75zM7.5 4.5a.75.75 0 011.06 0l1.06 1.06a.75.75 0 01-1.06 1.06L7.5 5.56A.75.75 0 017.5 4.5zM16.5 4.5a.75.75 0 010 1.06l-1.06 1.06a.75.75 0 11-1.06-1.06l1.06-1.06a.75.75 0 011.06 0zM3.75 9a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5A.75.75 0 013.75 9zM18 9a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5A.75.75 0 0118 9zM7.5 19.5a.75.75 0 010-1.06l1.06-1.06a.75.75 0 011.06 1.06l-1.06 1.06a.75.75 0 01-1.06 0zM16.5 19.5a.75.75 0 01-1.06 0l-1.06-1.06a.75.75 0 011.06-1.06l1.06 1.06a.75.75 0 010 1.06zM12 20.25a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5a.75.75 0 01.75-.75z" />
            <path
              fillRule="evenodd"
              d="M12 6a6 6 0 100 12 6 6 0 000-12zm-3.5 6a3.5 3.5 0 117 0 3.5 3.5 0 01-7 0z"
              clipRule="evenodd"
            />
          </svg>
          <div className="h-[1px] w-32 bg-gradient-to-l from-transparent to-[#D4AF37]"></div>
        </div>

        {/* TIMELINE SECTION VỚI POPUP */}
        <section className="mb-20">
          <h2 className="font-serif text-3xl text-[#D4AF37] font-bold text-center mb-24 drop-shadow-md">
            Lịch sử hình thành
          </h2>

          <div className="relative max-w-4xl mx-auto px-4 h-32 hidden md:block">
            {/* Main Axis Line */}
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-[#D4AF37]/30 -translate-y-1/2 shadow-[0_0_10px_rgba(212,175,55,0.3)]"></div>

            {/* Timeline Nodes */}
            <div className="flex justify-between items-center relative w-full h-full">
              {data.timeline.map((event, index) => {
                // Chẵn nằm trên trục, Lẻ nằm dưới trục
                const isTop = index % 2 === 0;
                const positionClasses = isTop
                  ? "top-0 justify-end pb-6"
                  : "bottom-0 justify-start pt-6";
                const markerPosition = isTop ? "-bottom-2.5" : "-top-2.5";
                const popupPosition = isTop
                  ? "bottom-full mb-4 translate-y-2 group-hover:translate-y-0"
                  : "top-full mt-4 -translate-y-2 group-hover:translate-y-0";

                return (
                  <div
                    key={index}
                    className={`flex flex-col items-center absolute h-1/2 -translate-x-1/2 group cursor-pointer ${positionClasses}`}
                    style={{
                      left: `${(index / (data.timeline.length - 1)) * 100}%`,
                    }}
                  >
                    {/* Text Năm */}
                    <span
                      className={`text-[#D4AF37] font-serif text-sm opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all ${isTop ? "mb-2" : "mt-2 order-last"}`}
                    >
                      {event.year}
                    </span>

                    {/* Chấm Marker */}
                    <div
                      className={`w-5 h-5 rounded-full border-2 border-[#D4AF37] bg-[#330713] absolute ${markerPosition} shadow-[0_0_10px_rgba(212,175,55,0.4)] group-hover:bg-[#D4AF37] group-hover:shadow-[0_0_20px_rgba(212,175,55,0.8)] transition-all z-10`}
                    ></div>

                    {/* Popup Lịch sử */}
                    <div
                      className={`absolute left-1/2 -translate-x-1/2 w-64 p-5 bg-[#4A0A1A] rounded-xl border border-[#D4AF37]/40 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none shadow-2xl z-30 ${popupPosition}`}
                    >
                      <h4 className="font-serif text-[#D4AF37] font-bold text-[15px] uppercase border-b border-[#D4AF37]/20 pb-2 mb-2">
                        {event.title}
                      </h4>
                      <p className="text-[13px] text-[#F3E5D8]/90 leading-relaxed font-sans">
                        {event.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="text-center text-[#D4AF37]/50 italic text-[13px] mt-24 font-serif">
              Rê chuột vào các mốc thời gian để xem nội dung chi tiết
            </p>
          </div>
        </section>
      </main>

      {/* FOOTER CHUẨN MỰC */}
      <footer className="bg-[#1A0309] border-t border-[#D4AF37]/20 py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <div className="font-serif text-xl text-[#D4AF37] font-bold tracking-widest mb-3">
              DI SẢN VIỆT
            </div>
            <p className="text-[#F3E5D8]/50 text-[11px] uppercase tracking-wider leading-relaxed">
              © 2024 Viện Bảo Tàng Văn Hóa.
              <br />
              Bảo tồn giá trị vượt thời gian bằng tâm hồn và khát vọng.
            </p>
          </div>
          <div className="flex gap-8 text-[11px] uppercase tracking-widest text-[#F3E5D8]/60 font-semibold">
            <a href="#" className="hover:text-[#D4AF37] transition-colors">
              Bảo mật
            </a>
            <a href="#" className="hover:text-[#D4AF37] transition-colors">
              Điều khoản
            </a>
            <a href="#" className="hover:text-[#D4AF37] transition-colors">
              Hợp tác
            </a>
          </div>
          <div className="flex gap-5">
            <a
              href="#"
              className="w-10 h-10 rounded-full border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]/70 hover:bg-[#D4AF37] hover:text-[#1A0309] transition-all"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
                />
              </svg>
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]/70 hover:bg-[#D4AF37] hover:text-[#1A0309] transition-all"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
