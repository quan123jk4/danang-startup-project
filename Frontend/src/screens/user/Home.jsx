import React, { useEffect } from "react";
import Navbar from "../../components/common/Navbar";
import HeroSection from "../../components/user/home/HeroSection";
import IntroSection from "../../components/user/home/IntroSection";
import FeatureGrid from "../../components/user/home/FeatureGrid";
import NatureSection from "../../components/user/home/NatureSection";
import Footer from "../../components/common/Footer";
import AOS from "aos";
import "aos/dist/aos.css";
const Home = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000, // Thời gian hiệu ứng chạy (1000ms = 1 giây)
      once: true, // Hiệu ứng chỉ chạy 1 lần khi cuộn xuống, cuộn lên không bị giật lại
      easing: "ease-out-cubic", // Gia tốc mượt mà
      offset: 50, // Cuộn cách phần tử 50px là bắt đầu hiện
    });
  }, []);
  return (
    <div className="bg-[#E5EDF4] min-h-screen font-sans w-full flex flex-col items-center py-0 ">
      <div className="w-full max-w-[1280px] bg-white shadow-2xl rounded-none flex flex-col">
        <Navbar />
        <HeroSection />
        <IntroSection />
        <FeatureGrid />
        <NatureSection />
        <Footer />
      </div>
    </div>
  );
};

export default Home;
