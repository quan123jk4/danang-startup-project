import React, { useState } from "react";

const NAV_LINKS = [
  "HOME",
  "HERITAGE",
  "FESTIVALS",
  "CUISINE",
  "CRAFT VILLAGES",
];

const HERITAGE_CARDS = [
  {
    tag: "KIẾN TRÚC CỔ CHAM",
    title: "Thánh địa Di sản",
    desc: "Quần thể kiến trúc Chăm Pa độc đáo, minh chứng cho một nền văn minh rực rỡ.",
    img: "https://ninhthuantravels.com/wp-content/uploads/2023/03/thap-cham-poklong-garai.jpg",
  },
  {
    tag: "NGHỆ THUẬT DÂN GIAN",
    title: "Nghề hóa Bài Chòi",
    desc: "Di sản văn hóa phi vật thể được UNESCO công nhận, mang đậm bản sắc dân gian miền Trung.",
    img: "https://toquoc.mediacdn.vn/280518851207290880/2023/8/25/bc3-16929643777121028141570.jpg",
  },
  {
    tag: "LÀNG NGHỀ TRUYỀN THỐNG",
    title: "Làng đá Non Nước",
    desc: "Dưới bàn tay nghệ nhân Ngũ Hành Sơn, những phiến đá vô tri trở thành tác phẩm nghệ thuật.",
    img: "https://static.vinwonders.com/2022/04/EYOyuRdc-lang-da-my-nghe-non-nuoc-2.jpg",
  },
];

const HERITAGE_SITES = [
  {
    num: "01",
    title: "Bảo tàng Điêu khắc Chăm",
    desc: "Nơi lưu giữ bộ sưu tập hiện vật Chăm Pa lớn và giá trị nhất thế giới ngay giữa lòng thành phố.",
  },
  {
    num: "02",
    title: "Chùa Linh Ứng Bãi Bụt Sơn Trà",
    desc: "Quần thể tôn giáo với tượng Phật Bà Quan Thế Âm cao 67 mét, biểu tượng của vùng đất linh thiêng.",
  },
  {
    num: "03",
    title: "Đình cổ Cẩm Lệ",
    desc: "Ngôi đình tồn tại hơn 300 năm lịch sử, biểu tượng cho các bậc tiền nhân của làng quê Việt.",
  },
];

const GoldDivider = () => (
  <div className="flex items-center justify-center gap-3 my-6">
    <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#C9973A]" />
    <div className="w-2 h-2 bg-[#C9973A] rotate-45" />
    <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#C9973A]" />
  </div>
);

function Navbar() {
  return (
    <nav className="w-full flex items-center justify-between px-6 md:px-12 h-16 bg-black/80 backdrop-blur-md border-b border-[#C9973A]/20 z-50 fixed top-0">
      <span className="font-['Cinzel'] text-[#F5E6C0] text-xl tracking-[4px] font-bold">
        DANASOUL
      </span>
      <div className="flex items-center gap-8">
        {NAV_LINKS.map((link) => (
          <a
            key={link}
            href="#"
            className={`font-['Cinzel'] text-xs tracking-[2px] transition-colors ${link === "HOME" ? "text-[#C9973A] border-b-2 border-[#C9973A] pb-1" : "text-[#F5E6C0]/70 hover:text-[#F5E6C0]"}`}
          >
            {link}
          </a>
        ))}
      </div>
    </nav>
  );
}

function DragonBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
      {/* Rồng trang trí tinh tế */}
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-[url('https://www.svgrepo.com/show/512028/dragon.svg')] bg-contain bg-no-repeat opacity-30 rotate-12" />
      <div className="absolute -bottom-32 -right-20 w-96 h-96 bg-[url('https://www.svgrepo.com/show/512028/dragon.svg')] bg-contain bg-no-repeat opacity-20 -rotate-12 scale-x-[-1]" />
      <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-[url('https://www.svgrepo.com/show/512028/dragon.svg')] bg-contain bg-no-repeat opacity-10 rotate-45" />
    </div>
  );
}

function Hero() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 relative bg-[#0C0202] overflow-hidden">
      <DragonBackground />

      <div className="relative z-10 max-w-5xl mx-auto pt-20">
        <p className="font-['Cinzel'] text-[#C9973A] text-sm tracking-[6px] mb-6">
          ✦ TINH HOA VĂN HÓA ĐÀ NẴNG ✦
        </p>

        <h1 className="font-['Playfair_Display'] text-[clamp(3.2rem,8vw,6rem)] leading-[1.05] italic font-bold text-[#F5E6C0] mb-8 tracking-tight">
          Khám phá Bản sắc
          <br />
          Văn hóa Đà Nẵng
        </h1>

        <GoldDivider />

        <p className="font-['EB_Garamond'] text-[#F5E6C0]/80 text-xl max-w-2xl mx-auto mb-12">
          Hành trình khám phá những giá trị văn hóa vô giá, lịch sử hào hùng và
          tinh thần bất diệt của vùng đất Đà Nẵng qua kiến trúc Chăm, lễ hội
          truyền thống và nghệ thuật dân gian.
        </p>

        <button className="font-['Cinzel'] text-sm tracking-[3px] bg-[#C9973A] hover:bg-[#E8C97A] text-black px-16 py-5 rounded-xl transition-all duration-300 shadow-xl shadow-[#C9973A]/30">
          BẮT ĐẦU KHÁM PHÁ
        </button>
      </div>

      {/* Decorative bottom element */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[#C9973A]/30 text-6xl">
        🐉
      </div>
    </section>
  );
}

function HeritageSection() {
  return (
    <section className="py-24 px-6 max-w-6xl mx-auto relative">
      <div className="text-center mb-16">
        <p className="font-['Cinzel'] text-[#C9973A] tracking-[4px] text-sm">
          DI SẢN VĂN HÓA
        </p>
        <h2 className="font-['Playfair_Display'] text-5xl italic font-bold mt-4">
          Tinh Hoa Di Sản Đà Nẵng
        </h2>
        <GoldDivider />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {HERITAGE_CARDS.map((card, i) => (
          <div
            key={i}
            className="group bg-[#1A0202] border border-[#C9973A]/20 rounded-3xl overflow-hidden hover:border-[#C9973A]/50 transition-all hover:-translate-y-3"
          >
            <div className="h-72 overflow-hidden">
              <img
                src={card.img}
                alt={card.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
            </div>
            <div className="p-8">
              <p className="uppercase font-['Cinzel'] text-[#C9973A] text-xs tracking-widest mb-3">
                {card.tag}
              </p>
              <h3 className="font-['Playfair_Display'] text-2xl italic font-bold mb-4">
                {card.title}
              </h3>
              <p className="text-[#F5E6C0]/75 leading-relaxed">{card.desc}</p>
              <a
                href="#"
                className="mt-6 inline-block text-[#C9973A] hover:text-white font-['Cinzel'] text-sm tracking-widest"
              >
                CHI TIẾT →
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function HeritageMap() {
  const [active, setActive] = useState(0);

  return (
    <section className="py-24 px-6 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
      <div>
        <p className="font-['Cinzel'] text-[#C9973A] tracking-[4px]">
          HÀNH TRÌNH VĂN HÓA
        </p>
        <h2 className="font-['Playfair_Display'] text-5xl italic font-bold mt-3 mb-10">
          Bản Đồ Di Sản
        </h2>

        <div className="space-y-6">
          {HERITAGE_SITES.map((site, i) => (
            <div
              key={i}
              onClick={() => setActive(i)}
              className={`flex gap-6 p-7 rounded-2xl cursor-pointer border-l-4 transition-all ${active === i ? "bg-[#C9973A]/10 border-[#C9973A]" : "border-transparent hover:bg-white/5"}`}
            >
              <span
                className={`font-['Cinzel'] text-5xl font-bold transition-colors ${active === i ? "text-[#C9973A]" : "text-[#F5E6C0]/20"}`}
              >
                {site.num}
              </span>
              <div>
                <h3 className="text-xl font-semibold">{site.title}</h3>
                {active === i && (
                  <p className="mt-3 text-[#F5E6C0]/70">{site.desc}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#140202] border border-[#C9973A]/20 aspect-square rounded-3xl flex items-center justify-center relative overflow-hidden">
        <DragonBackground />
        <div className="text-center z-10">
          <div className="text-7xl mb-6">🐉</div>
          <p className="font-['Cinzel'] text-4xl tracking-widest text-[#C9973A]">
            ĐÀ NẴNG
          </p>
          <p className="text-[#F5E6C0]/40 text-sm mt-2">HERITAGE MAP • 2026</p>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-20 border-t border-[#C9973A]/10 text-center bg-black/40">
      <p className="font-['Playfair_Display'] text-4xl italic text-[#F5E6C0] mb-6">
        Danasoul
      </p>
      <div className="flex justify-center gap-10 mb-8">
        {["Facebook", "Instagram", "Youtube"].map((s) => (
          <a
            key={s}
            href="#"
            className="hover:text-[#C9973A] transition-colors"
          >
            {s}
          </a>
        ))}
      </div>
      <p className="text-xs text-[#F5E6C0]/40">
        © 2026 Danasoul — Vinh danh bản sắc văn hóa Đà Nẵng
      </p>
    </footer>
  );
}

export default function HeritagePage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Playfair+Display:ital,wght@700&family=EB+Garamond:wght@400;500&display=swap');
        body { margin: 0; background: #0A0000; }
      `}</style>

      <div className="min-h-screen bg-[#0C0202] text-[#F5E6C0] overflow-x-hidden">
        <Navbar />
        <Hero />
        <HeritageSection />
        <HeritageMap />
        <Footer />
      </div>
    </>
  );
}
