import { useState } from "react";

const bgImage = "/assets/background_clean.png";

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
    desc: "Quần thể kiến trúc diễn Chăm Pa độc đáo, minh chứng cho một nền văn minh rực rỡ.",
    img: "https://images.unsplash.com/photo-1598887142487-3c854d51eabb?w=400&q=80",
  },
  {
    tag: "NGHỆ THUẬT DÂN GIAN",
    title: "Nghề hóa Bài Chòi",
    desc: "Di sản văn hóa phi vật thể được UNESCO công nhận, mang đậm bản sắc dân gian miền Trung.",
    img: "https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?w=400&q=80",
  },
  {
    tag: "LÀNG NGHỀ TRUYỀN THỐNG",
    title: "Làng đá Non Nước",
    desc: "Dưới bàn tay nghệ nhân Ngũ Hành Sơn, những phiến đá vô tri trở thành tác phẩm nghệ thuật.",
    img: "https://images.unsplash.com/photo-1565967511849-76a60a516170?w=400&q=80",
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
  <div className="flex items-center justify-center gap-2.5 my-[10px] mb-[18px]">
    <div className="h-px w-[60px] bg-gradient-to-r from-transparent to-[#C9973A]" />
    <div className="w-[5px] h-[5px] bg-[#C9973A] rotate-45 flex-shrink-0" />
    <div className="h-px w-[60px] bg-gradient-to-l from-transparent to-[#C9973A]" />
  </div>
);

function Navbar() {
  return (
    <nav className="flex items-center justify-between px-10 h-[46px] bg-[#0F0101]/70 backdrop-blur-md border-b border-[#C9973A]/15 flex-shrink-0">
      <span className="font-['Cinzel'] text-[#F5E6C0] text-[13px] tracking-[4px] font-bold">
        DANASOUL
      </span>

      <div className="flex gap-7 items-center">
        {NAV_LINKS.map((link) => (
          <a
            key={link}
            href="#"
            className={`font-['Cinzel'] text-[9.5px] tracking-[2px] transition-colors duration-200 ${
              link === "HOME"
                ? "text-[#F5E6C0] border-b-[1.5px] border-[#F5E6C0] pb-0.5"
                : "text-[#F5E6C0]/47 hover:text-[#F5E6C0]"
            }`}
          >
            {link}
          </a>
        ))}

        <svg
          width="15"
          height="15"
          fill="none"
          stroke="#F5E6C0AA"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
          className="cursor-pointer"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>

        <svg
          width="15"
          height="15"
          fill="none"
          stroke="#F5E6C0AA"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
          className="cursor-pointer"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="min-h-[88vh] flex flex-col items-center justify-center text-center px-14 pb-16 pt-20">
      <p className="font-['Cinzel'] text-[#E8C97A] text-[9.5px] tracking-[5px] mb-6 opacity-90">
        ✦ &nbsp;KHÁM PHÁ VĂN HÓA&nbsp; ✦
      </p>

      <h1 className="font-['Playfair_Display'] text-[clamp(2.2rem,3.5vw,3.2rem)] text-[#F5E6C0] italic font-bold leading-[1.25] max-w-[540px] tracking-wide mb-5 drop-shadow-2xl">
        Khám phá Bản sắc Văn
        <br />
        hóa Đà Nẵng
      </h1>

      <GoldDivider />

      <p className="font-['EB_Garamond'] text-[#F5E6C0]/73 text-[0.95rem] max-w-[400px] leading-relaxed mb-10">
        Nhm trình kiết lớngriêma hội toát hướng nhịp những hộp cphưong chức vãn
        tư vất hán lớn hóa Vêtràna han.
      </p>

      <a
        href="#"
        className="font-['Cinzel'] text-[10.5px] tracking-[3px] text-[#F5E6C0] border border-[#C9973A]/60 px-9 py-3 bg-[#5A0606]/80 hover:bg-[#C9973A] hover:text-[#3E0404] hover:border-[#C9973A] transition-all duration-300 inline-block"
      >
        KHÁM PHÁ NGAY
      </a>
    </section>
  );
}

function Heritage() {
  return (
    <section className="py-20 px-12 text-center">
      <p className="font-['Cinzel'] text-[#C9973A] text-[10px] tracking-[4px] mb-1.5">
        GIỮ GÌN DI SẢN
      </p>
      <h2 className="font-['Playfair_Display'] text-[#F5E6C0] text-3xl italic font-bold mb-1">
        Tinh hoa Di sản
      </h2>
      <GoldDivider />

      <div className="grid grid-cols-3 gap-5 mt-9">
        {HERITAGE_CARDS.map((card, i) => (
          <div
            key={i}
            className="bg-[#280303]/82 border border-[#C9973A]/20 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-[#C9973A]/55 group"
          >
            <div className="h-[185px] overflow-hidden">
              <img
                src={card.img}
                alt={card.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-5 text-left">
              <p className="font-['Cinzel'] text-[#C9973A] text-[8.5px] tracking-[2.5px] mb-2">
                {card.tag}
              </p>
              <h3 className="font-['Playfair_Display'] text-[#F5E6C0] text-base italic mb-3">
                {card.title}
              </h3>
              <p className="font-['EB_Garamond'] text-[#F5E6C0]/55 text-[0.85rem] leading-relaxed mb-5">
                {card.desc}
              </p>
              <a
                href="#"
                className="font-['Cinzel'] text-[9px] tracking-[2px] text-[#C9973A] hover:text-[#E8C97A] transition-colors"
              >
                CHI TIẾT ›
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function FestivalsBanner() {
  return (
    <section className="text-center py-14 px-12 border-t border-[#C9973A]/10 border-b border-[#C9973A]/10">
      <p className="font-['Cinzel'] text-[#C9973A] text-[10px] tracking-[4px] mb-1.5">
        NHỊP CHÂN LỄ HỘI
      </p>
      <h2 className="font-['Playfair_Display'] text-[#F5E6C0] text-3xl italic font-bold">
        Dòng chảy Văn hóa
      </h2>
      <GoldDivider />
    </section>
  );
}

function HeritageMap() {
  const [active, setActive] = useState(0);

  return (
    <section className="py-20 px-12 grid grid-cols-2 gap-12 items-start">
      <div>
        <p className="font-['Cinzel'] text-[#C9973A] text-[10px] tracking-[4px] mb-1.5">
          HÀNH TRÌNH VĂN HÓA
        </p>
        <h2 className="font-['Playfair_Display'] text-[#F5E6C0] text-[1.8rem] italic font-bold mb-9">
          Bản đồ Di sản
        </h2>

        {HERITAGE_SITES.map((site, i) => (
          <div
            key={i}
            onClick={() => setActive(i)}
            className={`flex gap-5 py-4 border-b border-[#C9973A]/10 cursor-pointer transition-all duration-300 pl-0 ${
              active === i ? "pl-3 bg-[#C9973A]/5" : ""
            }`}
          >
            <span
              className={`font-['Cinzel'] text-2xl font-bold min-w-[36px] transition-colors ${
                active === i ? "text-[#C9973A]" : "text-[#F5E6C0]/20"
              }`}
            >
              {site.num}
            </span>
            <div>
              <h3
                className={`font-['Cinzel'] text-[0.88rem] font-semibold transition-colors mb-1.5 ${
                  active === i ? "text-[#F5E6C0]" : "text-[#F5E6C0]/47"
                }`}
              >
                {site.title}
              </h3>
              {active === i && (
                <p className="font-['EB_Garamond'] text-[#F5E6C0]/55 text-[0.85rem] leading-relaxed">
                  {site.desc}
                </p>
              )}
            </div>
          </div>
        ))}

        <a
          href="#"
          className="inline-block mt-7 font-['Cinzel'] text-[10px] tracking-[2px] text-[#F5E6C0] border border-[#C9973A]/35 px-7 py-[11px] hover:border-[#C9973A] hover:text-[#C9973A] transition-all duration-300"
        >
          XEM BẢN ĐỒ CHI TIẾT
        </a>
      </div>

      <div className="bg-[#1E0202]/75 border border-[#C9973A]/20 aspect-[4/3] relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,#C9973A0D_0,transparent_1px,transparent_32px),repeating-linear-gradient(90deg,#C9973A0D_0,transparent_1px,transparent_32px)]" />

        <div className="text-center z-10">
          <svg
            width="56"
            height="56"
            viewBox="0 0 60 60"
            fill="none"
            className="mb-3"
          >
            <circle
              cx="30"
              cy="30"
              r="27"
              stroke="#C9973A"
              strokeWidth="1"
              strokeDasharray="3 4"
            />
            <circle cx="30" cy="30" r="16" stroke="#C9973A" strokeWidth="0.5" />
            <circle cx="30" cy="30" r="3" fill="#C9973A" />
            <line
              x1="30"
              y1="3"
              x2="30"
              y2="57"
              stroke="#C9973A"
              strokeWidth="0.5"
              opacity="0.35"
            />
            <line
              x1="3"
              y1="30"
              x2="57"
              y2="30"
              stroke="#C9973A"
              strokeWidth="0.5"
              opacity="0.35"
            />
          </svg>
          <p className="font-['Cinzel'] text-[#C9973A] text-[13px] tracking-[3px]">
            ĐÀ NẴNG
          </p>
          <p className="font-['EB_Garamond'] text-[#F5E6C0]/35 text-[9px] tracking-[2px] mt-1">
            HERITAGE MAP
          </p>
        </div>

        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`absolute w-[18px] h-[18px] border-[#C9973A]/55 ${
              i < 2 ? "top-2.5 border-t" : "bottom-2.5 border-b"
            } ${i % 2 === 0 ? "left-2.5 border-l" : "right-2.5 border-r"}`}
          />
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="text-center py-9 px-12 border-t border-[#C9973A]/10">
      <p className="font-['Playfair_Display'] text-[#F5E6C0] text-[17px] italic mb-4">
        Danasoul
      </p>

      <div className="flex gap-7 justify-center mb-5">
        {["Facebook", "Instagram", "Youtube"].map((s) => (
          <a
            key={s}
            href="#"
            className="font-['Cinzel'] text-[10px] tracking-[2px] text-[#F5E6C0]/47 hover:text-[#C9973A] transition-colors"
          >
            {s}
          </a>
        ))}
      </div>

      <p className="font-['EB_Garamond'] text-[#F5E6C0]/20 text-[11px]">
        © 2024 Danasoul. Nơi chuyển tải nét mộc chuyện hệ.
      </p>
    </footer>
  );
}
export default function HeritagePage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Playfair+Display:ital,wght@0,700;1,400;1,700&family=EB+Garamond:ital,wght@0,400;0,500;1,400&display=swap');
        
        body {
          background: #d8d3cc;
          min-height: 100vh;
          padding: 28px 48px;        /* Giữ padding ngoài để card nằm giữa */
          display: flex;
          justify-content: center;
          align-items: flex-start;
        }
      `}</style>

      <div id="danasoul-root" className="w-full max-w-[1180px] mx-auto">
        {/* Card chính - Điểm quan trọng: loại bỏ khoảng trắng */}
        <div
          className="w-full rounded-lg overflow-hidden shadow-[0_10px_60px_rgba(0,0,0,0.3),0_2px_10px_rgba(0,0,0,0.15)] bg-cover bg-top bg-no-repeat text-[#F5E6C0] flex flex-col relative"
          style={{ backgroundImage: `url(${bgImage})` }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 pointer-events-none z-0 bg-gradient-to-b from-[#140101]/25 via-[#280303]/8 to-[#140101]/35" />

          {/* Nội dung chính - Sát mép */}
          <div className="relative z-10 flex flex-col">
            <Navbar />

            <main className="flex-1">
              <Hero />
              <Heritage />
              <FestivalsBanner />
              <HeritageMap />
            </main>

            <Footer />
          </div>
        </div>
      </div>
    </>
  );
}
