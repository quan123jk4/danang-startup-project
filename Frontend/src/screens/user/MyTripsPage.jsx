import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSuitcaseRolling,
  faCalendarAlt,
  faTrash,
  faEye,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";

const MyTripsPage = () => {
  const [savedItineraries, setSavedItineraries] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("savedItineraries") || "[]");
    setSavedItineraries(saved);
  }, []);

  const deleteTrip = (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa chuyến đi này?")) return;

    const updated = savedItineraries.filter((item) => item.id !== id);
    localStorage.setItem("savedItineraries", JSON.stringify(updated));
    setSavedItineraries(updated);
    if (selectedTrip && selectedTrip.id === id) setSelectedTrip(null);
  };

  const viewTrip = (trip) => {
    setSelectedTrip(trip);
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-20">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-black text-[#002045] flex items-center gap-3 tracking-tight">
              <span className="bg-[#002045] text-white p-3 rounded-2xl">
                <FontAwesomeIcon icon={faSuitcaseRolling} />
              </span>
              Lịch trình của tôi
            </h1>
            <p className="text-slate-500 mt-2 font-medium">
              Quản lý những hành trình khám phá Đà Nẵng của bạn.
            </p>
          </div>
          {savedItineraries.length > 0 && (
            <button
              onClick={() => navigate("/ai-suggest")}
              className="bg-[#C4391D] text-white px-6 py-3 rounded-2xl font-bold hover:bg-red-700 transition shadow-lg shadow-red-200"
            >
              + Tạo thêm lịch trình
            </button>
          )}
        </div>

        {savedItineraries.length === 0 ? (
          <div className="bg-white rounded-[32px] p-20 text-center border border-slate-100 shadow-sm">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300 text-4xl">
              <FontAwesomeIcon icon={faSuitcaseRolling} />
            </div>
            <h3 className="text-2xl font-bold text-[#002045]">
              Chưa có chuyến đi nào
            </h3>
            <p className="text-slate-500 mt-2 max-w-sm mx-auto">
              Bạn chưa lưu lịch trình nào. Hãy để AI giúp bạn lập kế hoạch ngay
              bây giờ!
            </p>
            <button
              onClick={() => navigate("/ai-suggest")}
              className="mt-8 bg-[#002045] text-white px-10 py-4 rounded-2xl font-bold hover:bg-blue-900 transition"
            >
              Khám phá ngay
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: List */}
            <div className="lg:col-span-4 space-y-4">
              {savedItineraries.map((trip) => (
                <div
                  key={trip.id}
                  onClick={() => viewTrip(trip)}
                  className={`group relative p-6 rounded-3xl border cursor-pointer transition-all ${
                    selectedTrip?.id === trip.id
                      ? "bg-white border-[#002045] shadow-xl"
                      : "bg-white border-slate-100 hover:border-blue-200 shadow-sm hover:shadow-md"
                  }`}
                >
                  {/* Active Indicator */}
                  {selectedTrip?.id === trip.id && (
                    <div className="absolute left-0 top-6 bottom-6 w-1 bg-[#002045] rounded-r-full" />
                  )}

                  <h3 className="font-bold text-[#002045] text-lg mb-1">
                    {trip.name}
                  </h3>
                  <div className="flex gap-4 text-xs font-bold text-slate-400">
                    <span>{trip.totalDays} ngày</span>
                    <span>•</span>
                    <span>
                      {new Date(trip.date).toLocaleDateString("vi-VN")}
                    </span>
                  </div>

                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-emerald-600 font-black text-sm">
                      {new Intl.NumberFormat("vi-VN").format(
                        trip.totalCost || 0,
                      )}
                      đ
                    </span>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteTrip(trip.id);
                        }}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-xl"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right: Detailed View */}
            <div className="lg:col-span-8">
              {selectedTrip ? (
                <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 min-h-[500px]">
                  <div className="flex justify-between items-start mb-8 pb-6 border-b border-slate-50">
                    <h2 className="text-3xl font-black text-[#002045]">
                      {selectedTrip.name}
                    </h2>
                    <span className="text-xs font-black bg-slate-100 text-slate-500 px-4 py-2 rounded-full">
                      ID: {selectedTrip.id}
                    </span>
                  </div>

                  <div className="space-y-6">
                    {selectedTrip.data.map((item, index) => (
                      <div
                        key={index}
                        className="flex gap-6 p-4 rounded-3xl hover:bg-slate-50 transition-colors"
                      >
                        <div className="w-16 h-16 bg-[#002045] text-white rounded-2xl flex-shrink-0 flex items-center justify-center font-black text-xl shadow-lg">
                          {item.dayNumber}
                        </div>
                        <div className="flex-1">
                          <span className="text-[10px] font-black text-[#C4391D] uppercase bg-red-50 px-2 py-1 rounded-md">
                            {item.time}
                          </span>
                          <h4 className="text-lg font-bold text-[#002045] mt-1">
                            {item.title}
                          </h4>
                          <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                            {item.description}
                          </p>
                        </div>
                        <img
                          src={item.image}
                          className="w-24 h-20 rounded-2xl object-cover shadow-sm"
                          alt=""
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center bg-white rounded-[32px] border border-slate-100 text-slate-400 font-bold">
                  Chọn một chuyến đi để xem chi tiết lộ trình
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default MyTripsPage;
