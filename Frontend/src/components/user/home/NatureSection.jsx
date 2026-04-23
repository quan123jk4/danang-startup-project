import React from "react";

const NatureSection = () => {
  return (
    // Nền màu đỏ nâu (#70322E - bóc từ ảnh gốc)
    <section className="w-full bg-[#70322E] py-24 px-8 md:px-16 overflow-hidden">
      <div className="w-full max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        {/* ============================================================ */}
        {/* CỘT TRÁI: NỘI DUNG VĂN BẢN & SỐ LIỆU */}
        {/* ============================================================ */}
        <div data-aos="fade-right">
          <p className="text-[#F6D385] text-[11px] font-bold tracking-[0.15em] uppercase mb-4">
            GÓC DI SẢN
          </p>
          <h2 className="text-4xl md:text-[44px] font-bold text-white leading-tight mb-8 tracking-tight">
            Thiên nhiên kỳ ảo
          </h2>

          <p className="text-white/90 text-[15px] italic leading-relaxed mb-12 pr-4 md:pr-10">
            "Lắng nghe tiếng chuông chùa Linh Ứng hòa quyện trong tiếng sóng vỗ.
            Đà Nẵng không chỉ để nhìn, mà là để cảm nhận bằng cả tâm hồn."
          </p>

          {/* Khối Số liệu (2 cột có đường gạch dọc ở giữa) */}
          <div className="grid grid-cols-2 gap-8 mb-12">
            {/* Số liệu 1 */}
            <div className="pr-4">
              <h3 className="text-[32px] font-bold text-[#F6D385] mb-2">
                500+
              </h3>
              <p className="text-white/70 text-[13px] leading-relaxed">
                Điểm di tích văn hóa được số hóa và giới thiệu
              </p>
            </div>

            {/* Số liệu 2 (Có viền trái mờ) */}
            <div className="pl-8 border-l border-white/20">
              <h3 className="text-[32px] font-bold text-[#F6D385] mb-2">20+</h3>
              <p className="text-white/70 text-[13px] leading-relaxed">
                Nghệ nhân làng nghề kết nối trực tiếp với du khách
              </p>
            </div>
          </div>

          {/* Nút bấm (Bo tròn viên thuốc - rounded-full) */}
          <button className="px-8 py-3.5 rounded-full border border-[#F6D385] text-white font-bold text-sm hover:bg-[#F6D385] hover:text-[#70322E] transition-all duration-300">
            Khám phá kho di sản
          </button>
        </div>

        <div
          className="relative mt-8 lg:mt-0"
          data-aos="fade-left"
          data-aos-delay="200"
        >
          <img
            src="/assets/ngũ hành sơn.webp" 
            alt="Thiên nhiên kỳ ảo"
            className="w-full h-[450px] md:h-[550px] object-cover rounded-[2rem] shadow-2xl"
          />

          <div
            className="absolute -bottom-8 -left-4 md:-bottom-10 md:-left-12 bg-[#FDE08B] p-8 rounded-2xl shadow-xl max-w-[280px] md:max-w-[320px] z-10"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            <p className="text-[#70322E] text-[10px] font-bold tracking-[0.1em] uppercase mb-2">
              ĐỊA ĐIỂM GỢI Ý
            </p>
            <h4 className="text-[#1E293B] text-xl font-bold mb-3">
              Ngũ Hành Sơn
            </h4>
            <p className="text-[#1E293B]/80 text-[13px] leading-relaxed">
              Nơi hội tụ vẻ đẹp tâm linh và thiên nhiên kỳ thú của miền Trung.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NatureSection;
