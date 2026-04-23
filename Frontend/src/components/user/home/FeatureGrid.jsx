import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMicrochip,
  faMap,
  faTicketAlt,
  faArrowUpRightFromSquare,
} from "@fortawesome/free-solid-svg-icons";

const FeatureGrid = () => {
  return (
    <section className="w-full bg-[#F4F7F9] py-24 px-8 md:px-16 overflow-hidden">
      <div className="w-full max-w-[1280px] mx-auto">
        {/* Tiêu đề */}
        <div className="text-center mb-16" data-aos="fade-up">
          <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-slate-500 mb-3">
            TIỆN ÍCH THÔNG MINH
          </p>
          <h2 className="text-[40px] md:text-[44px] font-bold text-[#002045] leading-tight tracking-tight">
            Trải nghiệm du lịch không giới hạn
          </h2>
        </div>

        {/* Lưới Bento Box */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* ======================================= */}
          {/* HÀNG 1 - CỘT 1: Lịch trình AI */}
          {/* ======================================= */}
          <div
            className="md:col-span-2 bg-white rounded-3xl p-10 md:p-12 relative overflow-hidden shadow-sm cursor-pointer hover:-translate-y-2 hover:shadow-xl transition-all duration-300 group"
            data-aos="fade-up"
            data-aos-delay="100"
            onClick={() => console.log("Chuyển đến trang Lịch trình AI")}
          >
            <div className="max-w-[400px] relative z-10">
              <span className="inline-flex items-center gap-2 bg-[#F1F5F9] text-[#002045] px-4 py-1.5 rounded-full text-[11px] font-bold mb-6">
                <FontAwesomeIcon icon={faMicrochip} /> CÔNG NGHỆ AI
              </span>
              <h3 className="text-3xl md:text-[34px] font-bold text-[#002045] mb-4 tracking-tight leading-snug group-hover:text-blue-600 transition-colors">
                Lịch trình AI Cá nhân hóa
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-8">
                Chỉ cần chia sẻ sở thích, AI của chúng tôi sẽ thiết kế một hành
                trình duy nhất dành riêng cho bạn trong 30 giây.
              </p>
            </div>

            <img
              src="/assets/gg map.jpg"
              alt="AI App"
              className="absolute bottom-0 right-10 md:right-16 w-48 md:w-56 translate-y-4 object-cover rounded-t-2xl md:rounded-2xl shadow-md group-hover:translate-y-0 transition-transform duration-500"
            />
          </div>

          <div
            className="md:col-span-1 bg-[#A1C0E6] rounded-3xl p-10 md:p-12 text-white flex flex-col justify-between shadow-sm cursor-pointer hover:-translate-y-2 hover:shadow-xl hover:shadow-[#A1C0E6]/30 transition-all duration-300 group"
            data-aos="fade-up"
            data-aos-delay="200"
            onClick={() => console.log("Chuyển đến trang Check-in")}
          >
            <div>
              <h3 className="text-2xl font-bold mb-3 tracking-tight">
                Tọa độ Check-in
              </h3>
              <p className="text-white/80 text-[13px] leading-relaxed mb-8">
                Khám phá những góc máy ẩn mình đẹp nhất Đà Thành được giới trẻ
                săn đón.
              </p>
            </div>

            <div>
              <div className="flex -space-x-3 mb-6">
                <div className="w-10 h-10 rounded-full border-2 border-[#A1C0E6] bg-slate-200"></div>
                <div className="w-10 h-10 rounded-full border-2 border-[#A1C0E6] bg-slate-300"></div>
                <div className="w-10 h-10 rounded-full border-2 border-[#A1C0E6] bg-slate-400"></div>
                <div className="w-10 h-10 rounded-full border-2 border-[#A1C0E6] bg-[#002045] text-[10px] font-bold flex items-center justify-center">
                  +10k
                </div>
              </div>

              <button className="flex items-center gap-2 text-sm font-bold group-hover:gap-3 transition-all">
                Xem bản đồ <FontAwesomeIcon icon={faMap} />
              </button>
            </div>
          </div>

          <div
            className="md:col-span-1 bg-[#E8EDF2] rounded-3xl p-10 md:p-12 flex flex-col justify-between shadow-sm cursor-pointer hover:-translate-y-2 hover:shadow-xl transition-all duration-300 group"
            data-aos="fade-up"
            data-aos-delay="300"
            onClick={() => console.log("Chuyển đến trang Voucher")}
          >
            <div>
              <div className="w-12 h-12 bg-[#F3E5E5] text-[#D86A6A] rounded-xl flex items-center justify-center text-xl mb-6 group-hover:scale-110 transition-transform">
                <FontAwesomeIcon icon={faTicketAlt} />
              </div>
              <h3 className="text-2xl font-bold text-[#002045] mb-3 tracking-tight">
                Đổi Voucher
              </h3>
              <p className="text-slate-500 text-[13px] leading-relaxed mb-8">
                Tích điểm khi tham quan và đổi lấy những ưu đãi đặc biệt tại các
                làng nghề truyền thống.
              </p>
            </div>

            <button className="flex items-center gap-2 text-[#002045] text-sm font-bold group-hover:gap-3 transition-all">
              Khám phá ưu đãi{" "}
              <FontAwesomeIcon
                icon={faArrowUpRightFromSquare}
                className="text-xs"
              />
            </button>
          </div>

          <div
            className="md:col-span-2 bg-[#7D3B36] rounded-3xl p-10 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-10 shadow-sm cursor-pointer hover:-translate-y-2 hover:shadow-xl hover:shadow-[#7D3B36]/30 transition-all duration-300 group"
            data-aos="fade-up"
            data-aos-delay="400"
            onClick={() => console.log("Chuyển đến trang Văn hóa")}
          >
            <div className="flex-1">
              <h3 className="text-3xl font-bold mb-4 tracking-tight">
                Văn hóa & Ẩm thực
              </h3>
              <p className="text-white/80 text-[13px] leading-relaxed mb-8 max-w-[350px]">
                Từ Mì Quảng chính gốc đến những lễ hội cầu ngư, hãy cùng chúng
                tôi thưởng thức hương vị thật nhất của Đà Nẵng.
              </p>

              <div className="flex flex-wrap gap-2">
                <span className="bg-white text-[#7D3B36] px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wide">
                  ẨM THỰC
                </span>
                <span className="bg-white text-[#7D3B36] px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wide">
                  LỄ HỘI
                </span>
                <span className="bg-white text-[#7D3B36] px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wide">
                  LÀNG NGHỀ
                </span>
              </div>
            </div>

            <div className="w-full md:w-[220px] shrink-0">
              <img
                src="/assets/mỳ quảng.jpg"
                alt="Mì Quảng"
                className="w-full h-48 md:h-[220px] object-cover rounded-2xl shadow-lg group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureGrid;
