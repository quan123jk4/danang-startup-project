import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCube, faLightbulb } from "@fortawesome/free-solid-svg-icons";

const IntroSection = () => {
  return (
    <section className="w-full bg-[#F5FAFF] py-24 px-8 md:px-16 border-b border-slate-200 overflow-hidden">
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        {/* Cột Trái: Xếp 2 ảnh song song so le (trái thấp, phải cao) y như ảnh mẫu */}
        <div
          className="flex items-center gap-4 md:gap-6 w-full px-4"
          data-aos="fade-up"
        >
          <img
            src="/assets/cầu vàng.jpg"
            alt="Di sản"
            className="w-1/2 aspect-[4/5] object-cover rounded-2xl shadow-lg translate-y-6"
          />
          <img
            src="/assets/biển đà nẵng.jpeg"
            alt="Thiên nhiên"
            className="w-1/2 aspect-[4/5] object-cover rounded-2xl shadow-lg -translate-y-6"
          />
        </div>

        {/* Cột Phải: Giữ nguyên không đụng tới */}
        <div className="pr-4" data-aos="fade-left" data-aos-delay="200">
          <h2 className="text-4xl font-bold text-[#1E293B] leading-tight mb-6 tracking-tight">
            Vẻ đẹp giao thoa giữa <br /> Hiện đại & Truyền thống
          </h2>

          <p className="text-[#64748B] text-sm leading-relaxed mb-10">
            Đà Nẵng không chỉ là những bãi biển xanh ngắt hay những cây cầu hiện
            đại. Đó là nơi những di sản văn hóa nghìn năm của người Chăm vẫn còn
            hơi thở...
          </p>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-slate-200 flex items-center justify-center rounded-none text-slate-600 mt-1 shrink-0">
                <FontAwesomeIcon icon={faCube} />
              </div>
              <div>
                <h4 className="text-[#1E293B] font-bold text-sm mb-1">
                  Cốt cách di sản
                </h4>
                <p className="text-[#64748B] text-[13px] leading-relaxed">
                  Gìn giữ và tôn vinh những giá trị văn hóa lâu đời thông qua
                  các trải nghiệm thực tế.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-slate-200 flex items-center justify-center rounded-none text-slate-600 mt-1 shrink-0">
                <FontAwesomeIcon icon={faLightbulb} />
              </div>
              <div>
                <h4 className="text-[#1E293B] font-bold text-sm mb-1">
                  Cảm hứng hiện đại
                </h4>
                <p className="text-[#64748B] text-[13px] leading-relaxed">
                  Ứng dụng công nghệ để làm mới cách tiếp cận du lịch bền vững
                  và cá nhân hóa.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntroSection;
