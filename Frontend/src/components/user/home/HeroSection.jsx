import React from "react";

const HeroSection = () => {
  return (
    <section className="relative w-full h-[600px] overflow-hidden">
      {/* Background Ảnh */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/cầu rồng 2.jpg"
          alt="Cầu Rồng Đà Nẵng"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A192F]/90 via-[#0A192F]/50 to-transparent"></div>
      </div>

      {/* Nội dung */}
      <div className="relative z-10 w-full h-full px-8 md:px-16 flex flex-col justify-center text-white">
        <div className="max-w-[600px]">
          <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-gray-300 mb-4">
            KHÁM PHÁ ĐÀ NẴNG
          </p>

          <h1 className="text-[56px] md:text-[64px] font-bold leading-[1.1] mb-6 tracking-tight">
            Chạm Vào <br />
            <span className="text-[#FFD1C1]">Linh Hồn</span> Di Sản
          </h1>

          <p className="text-sm text-gray-200 leading-relaxed mb-8 font-medium pr-10">
            Danasoul đưa bạn đi xa hơn những điểm đến thông thường, khám phá
            nhịp đập thực sự của thành phố biển miền Trung qua lăng kính văn hóa
            sâu sắc.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <button className="px-8 py-3.5 bg-[#1C3A5E] text-white text-sm font-bold rounded-none hover:bg-[#11233A] transition-colors border border-[#1C3A5E]">
              Bắt đầu hành trình
            </button>

            <button className="px-8 py-3.5 bg-white/10 backdrop-blur-md text-white border border-white/30 text-sm font-bold rounded-none hover:bg-white/20 transition-colors">
              Tìm hiểu thêm
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
