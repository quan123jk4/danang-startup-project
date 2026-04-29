import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faUtensils,
  faBed,
  faPlane,
  faTicketAlt,
  faSpa,
  faHistory,
  faArrowRight,
  faSpinner,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";

import AOS from "aos";
import "aos/dist/aos.css";

import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";

const CATEGORIES = ["Tất cả", "Ẩm thực", "Khách sạn", "Giải trí", "Di chuyển"];

const VoucherPage = () => {
  const [activeCategory, setActiveCategory] = useState("Tất cả");
  const [vouchers, setVouchers] = useState([]);
  const [myRewards, setMyRewards] = useState([]);
  const [userPoints, setUserPoints] = useState(0);

  const [loading, setLoading] = useState(true);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingVoucher, setPendingVoucher] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true, easing: "ease-out-cubic" });
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    const token = localStorage.getItem("token");
    try {
      setLoading(true);
      const resVouchers = await fetch(
        "http://localhost:5000/api/v1/voucher/list",
      );
      const dataVouchers = await resVouchers.json();

      if (token) {
        const resUser = await fetch(
          "http://localhost:5000/api/v1/users/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const dataUser = await resUser.json();
        if (dataUser.success) setUserPoints(dataUser.data.points);

        const resMyRewards = await fetch(
          "http://localhost:5000/api/v1/voucher/my-redemptions",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const dataRewards = await resMyRewards.json();
        if (dataRewards.success) setMyRewards(dataRewards.data);
      }

      if (dataVouchers.success) setVouchers(dataVouchers.data);
    } catch (err) {
      console.error("Lỗi fetch data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Mở Modal xác nhận
  const handleOpenConfirm = (voucher) => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Vui lòng đăng nhập để đổi quà!");
    if (userPoints < voucher.pointsRequired)
      return alert("Bạn không đủ điểm tích lũy!");

    setPendingVoucher(voucher);
    setShowConfirm(true);
  };

  // Thực hiện đổi điểm (Gọi khi nhấn Xác nhận trên Modal)
  const confirmRedeem = async () => {
    if (!pendingVoucher) return;
    const token = localStorage.getItem("token");

    setIsRedeeming(true);
    setShowConfirm(false); // Đóng modal xác nhận để hiện loading hoặc modal thành công

    try {
      const response = await fetch(
        "http://localhost:5000/api/v1/vouchers/redeem",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ voucherId: pendingVoucher._id }),
        },
      );

      const result = await response.json();

      if (result.success) {
        setSuccessData(result.data);
        setUserPoints(result.data.pointsRemaining);
        setShowModal(true);
        fetchInitialData(); // Reload lịch sử và trạng thái nút
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert("Lỗi kết nối máy chủ!");
    } finally {
      setIsRedeeming(false);
      setPendingVoucher(null);
    }
  };

  const filteredVouchers =
    activeCategory === "Tất cả"
      ? vouchers
      : vouchers.filter((v) => v.category === activeCategory.toUpperCase());

  return (
    <div className="bg-[#E5EDF4] min-h-screen w-full flex flex-col items-center relative">
      <div className="w-full max-w-[1280px] bg-white shadow-2xl rounded-none flex flex-col min-h-screen">
        <Navbar />

        <div className="flex-1 w-full px-6 md:px-12 py-12 bg-white">
          {/* HERO BANNER */}
          <div
            className="w-full bg-[#002045] rounded-[2rem] p-8 md:p-12 text-white relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-8 shadow-lg mb-12"
            data-aos="fade-up"
          >
            <div className="relative z-10 text-center md:text-left">
              <h1 className="text-3xl md:text-[40px] font-extrabold mb-3 tracking-tight">
                Đổi điểm nhận Voucher
              </h1>
              <p className="text-white/70 text-sm md:text-base">
                Chào bạn, hôm nay bạn muốn đổi ưu đãi gì nào?
              </p>
            </div>
            <div className="relative z-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 min-w-[240px] text-center shadow-2xl">
              <p className="text-white/80 text-xs font-bold uppercase tracking-widest mb-2">
                Điểm hiện có
              </p>
              <div className="flex items-center justify-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white text-sm shadow-inner animate-pulse">
                  <FontAwesomeIcon icon={faStar} />
                </div>
                <span className="text-4xl font-extrabold tracking-tight">
                  {userPoints.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* CATEGORY FILTER */}
          <div className="flex flex-wrap gap-3 mb-10" data-aos="fade-up">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2.5 text-sm font-bold rounded-full transition-all duration-300 ${activeCategory === category ? "bg-[#002045] text-white shadow-md scale-105" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* VOUCHER GRID */}
          {loading ? (
            <div className="w-full py-20 text-center text-slate-400">
              <FontAwesomeIcon
                icon={faSpinner}
                spin
                className="text-4xl mb-4"
              />
              <p>Đang tải kho ưu đãi...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {filteredVouchers.map((voucher, index) => {
                // Kiểm tra xem user đã đổi voucher này mà chưa dùng không
                const isOwned = myRewards.some(
                  (reward) =>
                    reward.voucher?._id === voucher._id &&
                    reward.status === "Unused",
                );

                return (
                  <div
                    key={voucher._id}
                    className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group"
                    data-aos="fade-up"
                    data-aos-delay={index * 100}
                  >
                    <div className="w-full h-[200px] relative overflow-hidden">
                      <img
                        src={
                          voucher.image ||
                          "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?q=80&w=500"
                        }
                        alt={voucher.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-[#C4391D] text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-sm">
                        {voucher.category}
                      </div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-lg font-bold text-[#002045] leading-snug mb-6 line-clamp-2">
                        {voucher.title}
                      </h3>
                      <div className="mt-auto flex items-end justify-between border-t border-slate-100 pt-5">
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                            ĐIỂM YÊU CẦU
                          </p>
                          <p className="text-lg font-bold text-[#C4391D]">
                            {voucher.pointsRequired.toLocaleString()} Pts
                          </p>
                        </div>
                        <button
                          onClick={() => handleOpenConfirm(voucher)}
                          disabled={isRedeeming || isOwned}
                          className={`text-sm font-bold px-6 py-2.5 rounded-xl transition-all shadow-md active:scale-95 ${isOwned ? "bg-slate-200 text-slate-500 cursor-not-allowed" : "bg-[#002045] hover:bg-[#C4391D] text-white"}`}
                        >
                          {isOwned ? "Đã sở hữu" : "Đổi ngay"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* MY REWARDS */}
          <div
            className="bg-[#F8FAFC] rounded-[2rem] p-8 md:p-10 border border-slate-100"
            data-aos="fade-up"
          >
            <h2 className="text-2xl font-bold text-[#002045] mb-8">
              Phần thưởng của tôi
            </h2>
            <div className="flex flex-col gap-4">
              {myRewards.length === 0 ? (
                <p className="text-slate-400 text-center py-4">
                  Bạn chưa đổi voucher nào.
                </p>
              ) : (
                myRewards.map((reward) => (
                  <div
                    key={reward._id}
                    className="bg-white rounded-2xl p-5 flex items-center justify-between border border-slate-100 shadow-sm"
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-[#C4391D]">
                        <FontAwesomeIcon icon={faTicketAlt} />
                      </div>
                      <div>
                        <h4 className="text-[#002045] font-bold">
                          {reward.voucher?.title}
                        </h4>
                        <p className="text-slate-400 text-xs">
                          Mã:{" "}
                          <span className="font-mono font-bold text-[#002045]">
                            {reward.code}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div
                      className={`px-4 py-1.5 rounded-full text-[10px] font-bold ${reward.status === "Used" ? "bg-slate-100 text-slate-400" : "bg-green-50 text-green-600 border border-green-100"}`}
                    >
                      {reward.status === "Used" ? "ĐÃ SỬ DỤNG" : "SẴN SÀNG"}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <Footer />
      </div>

      {/* MODAL XÁC NHẬN ĐỔI ĐIỂM */}
      {showConfirm && pendingVoucher && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-[#002045]/40 backdrop-blur-md p-4">
          <div className="bg-white w-full max-w-sm rounded-[3rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-10 text-center">
              <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <FontAwesomeIcon
                  icon={faStar}
                  className="text-3xl text-amber-500 animate-bounce"
                />
              </div>
              <h3 className="text-2xl font-black text-[#002045] mb-4">
                Xác nhận đổi điểm?
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-8">
                Bạn sẽ dùng{" "}
                <span className="font-bold text-[#C4391D]">
                  {pendingVoucher.pointsRequired.toLocaleString()} điểm
                </span>{" "}
                để đổi lấy <br />
                <span className="font-bold text-[#002045]">
                  "{pendingVoucher.title}"
                </span>
                .
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 py-4 rounded-2xl font-bold text-slate-400 hover:bg-slate-50 transition-all"
                >
                  Hủy
                </button>
                <button
                  onClick={confirmRedeem}
                  className="flex-1 py-4 rounded-2xl font-bold text-white bg-[#002045] shadow-lg hover:bg-black transition-all active:scale-95"
                >
                  Xác nhận
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL THÀNH CÔNG */}
      {showModal && successData && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
          <div className="bg-white w-full max-w-sm rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in duration-300">
            <div className="bg-[#002045] p-10 text-center text-white relative">
              <FontAwesomeIcon
                icon={faCheckCircle}
                className="text-5xl text-green-400 mb-4"
              />
              <h3 className="text-2xl font-bold">Thành công!</h3>
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-6 right-8 text-white/40 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="p-8 flex flex-col items-center">
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-4 text-center">
                Cung cấp mã cho thu ngân
              </p>
              <div className="bg-slate-50 border-2 border-dashed border-slate-200 w-full rounded-2xl p-6 text-center mb-6">
                <div className="text-3xl font-black text-[#002045] tracking-[0.2em] mb-2">
                  {successData.code}
                </div>
                <p className="text-[11px] font-bold text-[#C4391D]">
                  {successData.title}
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-full bg-[#002045] text-white font-bold py-4 rounded-2xl hover:bg-black transition-all"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoucherPage;
