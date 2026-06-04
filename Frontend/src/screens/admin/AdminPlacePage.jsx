import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

// IMPORT COMPONENT DÙNG CHUNG
import Sidebar from "../../components/admin/Sidebar";
import Header from "../../components/admin/Header";

// === CẤU HÌNH HIỂN THỊ DANH MỤC ===
const CATEGORY_CONFIG = {
  hotel: {
    label: "Khách sạn",
    color: "bg-blue-50 text-blue-600 border-blue-200",
  },
  restaurant: {
    label: "Nhà hàng",
    color: "bg-orange-50 text-orange-600 border-orange-200",
  },
  attraction: {
    label: "Di tích & Thắng cảnh",
    color: "bg-emerald-50 text-emerald-600 border-emerald-200",
  },
  entertainment: {
    label: "Khu Giải trí",
    color: "bg-purple-50 text-purple-600 border-purple-200",
  },
  cafe: {
    label: "Quán Cafe",
    color: "bg-amber-50 text-amber-700 border-amber-300",
  },
  default: {
    label: "Địa điểm khác",
    color: "bg-slate-50 text-slate-600 border-slate-200",
  },
};

// === CÁC TAG ĐƯỢC CHUẨN HÓA CHO AI TÌM KIẾM LỘ TRÌNH ===
const PREDEFINED_TAGS = [
  "Biển",
  "Thiên nhiên",
  "Lãng mạn",
  "Gia đình",
  "Check-in",
  "Lịch sử",
  "Kiến trúc",
  "Sôi động",
  "Thư giãn",
  "Văn hóa",
  "Ẩm thực địa phương",
  "Hải sản",
  "Tâm linh",
  "Khám phá",
  "Chợ đêm",
];

const formatCurrency = (value) => {
  if (!value) return "";
  const numericValue = value.toString().replace(/\D/g, "");
  return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

export default function AdminPlacePage() {
  const { user } = useAuth();

  // === 1. STATE HIỂN THỊ & BẢNG ===
  const [places, setPlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const placesPerPage = 5;

  // === 2. STATE MODAL THÊM MỚI ===
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    category: "attraction",
    address: "",
    phone: "",
    minPrice: "",
    maxPrice: "",
    description: "",
    lat: "",
    lng: "",
    tags: [],
    image: "",
    ticketPrice: "",
    tourDuration: "",
    activities: "",
    historicalInfo: "",
    rules: "",
    cuisineType: "",
    serviceType: "",
    amenities: "",
    activityType: "",
    eventSchedule: "",
  });

  // === 3. STATE MODAL THÔNG BÁO / XÁC NHẬN ===
  const [modal, setModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "danger",
    isAlertOnly: false,
    onConfirm: null,
  });

  const API_BASE_URL = "https://danasoul-project.onrender.com/api/v1/places";

  // ==========================================
  // FETCH DATA
  // ==========================================
  useEffect(() => {
    fetchPlaces();
  }, []);

  const fetchPlaces = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE_URL}?limit=all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) setPlaces(res.data.data);
    } catch (err) {
      console.error("Lỗi lấy danh sách địa điểm:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryFilter]);

  // ==========================================
  // HÀM TIỆN ÍCH TẠO FORM
  // ==========================================
  const handleToggleTag = (tag) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const handleAutoFetchCoordinates = async () => {
    const addressToSearch = formData.address || formData.name;

    if (!addressToSearch) {
      setModal({
        isOpen: true,
        title: "Thiếu thông tin",
        message:
          "Vui lòng nhập Tên địa điểm hoặc Địa chỉ trước để hệ thống tìm kiếm!",
        type: "warning",
        isAlertOnly: true,
      });
      return;
    }

    setIsFetchingLocation(true);
    try {
      const query = encodeURIComponent(`${addressToSearch}, Đà Nẵng, Việt Nam`);
      const res = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`,
      );

      if (res.data && res.data.length > 0) {
        const { lat, lon } = res.data[0];
        setFormData((prev) => ({
          ...prev,
          lat: parseFloat(lat).toFixed(5),
          lng: parseFloat(lon).toFixed(5),
        }));
      } else {
        setModal({
          isOpen: true,
          title: "Không tìm thấy",
          message:
            "Không tìm thấy tọa độ tự động! Hãy thử ghi địa chỉ rõ ràng hơn (VD: 02 Bạch Đằng) hoặc nhập tay.",
          type: "warning",
          isAlertOnly: true,
        });
      }
    } catch (error) {
      console.error("Lỗi API Geocoding:", error);
      setModal({
        isOpen: true,
        title: "Lỗi kết nối",
        message: "Đã xảy ra lỗi khi lấy tọa độ từ máy chủ bản đồ.",
        type: "danger",
        isAlertOnly: true,
      });
    } finally {
      setIsFetchingLocation(false);
    }
  };

  // ==========================================
  // XỬ LÝ THÊM MỚI (POST)
  // ==========================================
  const handleAddPlace = async (e) => {
    e.preventDefault();
    try {
      const minP = Number(formData.minPrice) || 0;
      const maxP = Number(formData.maxPrice) || 0;

      if (minP > 0 && maxP > 0 && minP > maxP) {
        setModal({
          isOpen: true,
          title: "Lỗi dữ liệu",
          message: "Giá Min không được lớn hơn Giá Max!",
          type: "danger",
          isAlertOnly: true,
        });
        return;
      }

      const token = localStorage.getItem("token");

      // Cập nhật Payload để tương thích với cả DB Schema mới và API cũ
      const payload = {
        name: formData.name,
        category: formData.category,
        description: formData.description,
        tags: formData.tags,
        location: {
          type: "Point",
          coordinates: [
            parseFloat(formData.lng) || 0,
            parseFloat(formData.lat) || 0,
          ],
          address: formData.address,
          phone: formData.phone,
        },
        images: formData.image ? [{ url: formData.image, isMain: true }] : [],

        // Backup các trường cũ để Backend không bị thiếu data nếu chưa kịp update
        address: formData.address,
        phone: formData.phone,
        image: formData.image,
        minPrice: minP,
        maxPrice: maxP,
      };

      if (formData.category === "hotel") {
        payload.amenities = formData.amenities
          .split(",")
          .map((i) => i.trim())
          .filter(Boolean);
      } else if (formData.category === "restaurant") {
        payload.cuisineType = formData.cuisineType;
        payload.serviceType = formData.serviceType;
      } else if (formData.category === "attraction") {
        payload.ticketPrice = Number(formData.ticketPrice) || 0;
        const durationRaw = formData.tourDuration
          .toString()
          .replace(/[^0-9]/g, "");
        payload.tourDuration = parseInt(durationRaw, 10) || 60;
        payload.historicalInfo = formData.historicalInfo;
        payload.rules = formData.rules;
        payload.activities = formData.activities
          .split(",")
          .map((i) => i.trim())
          .filter(Boolean);
      } else if (formData.category === "entertainment") {
        payload.activityType = formData.activityType;
        payload.eventSchedule = formData.eventSchedule;
      }

      const res = await axios.post(API_BASE_URL, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setIsAddModalOpen(false);
        setIsTagDropdownOpen(false);
        fetchPlaces();

        setModal({
          isOpen: true,
          title: "Thành công",
          message: "Đã thêm địa điểm mới vào hệ thống Danasoul!",
          type: "success",
          isAlertOnly: true,
        });

        // Reset form
        setFormData({
          name: "",
          category: "attraction",
          address: "",
          phone: "",
          minPrice: "",
          maxPrice: "",
          description: "",
          lat: "",
          lng: "",
          tags: [],
          image: "",
          ticketPrice: "",
          tourDuration: "",
          activities: "",
          historicalInfo: "",
          rules: "",
          cuisineType: "",
          serviceType: "",
          amenities: "",
          activityType: "",
          eventSchedule: "",
        });
      }
    } catch (err) {
      setModal({
        isOpen: true,
        title: "Thất bại",
        message:
          err.response?.data?.message ||
          "Không thể lưu. Vui lòng kiểm tra lại dữ liệu.",
        type: "danger",
        isAlertOnly: true,
      });
    }
  };

  // ==========================================
  // XỬ LÝ IMPORT EXCEL
  // ==========================================
  const handleExcelUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.name.match(/\.(xlsx|xls|csv)$/)) {
      setModal({
        isOpen: true,
        title: "Sai định dạng",
        message: "Chỉ chấp nhận file định dạng Excel (.xlsx, .xls, .csv)",
        type: "warning",
        isAlertOnly: true,
      });
      return;
    }

    const formDataFile = new FormData();
    formDataFile.append("excelFile", file);

    setIsUploading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_BASE_URL}/import-excel`,
        formDataFile,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        setModal({
          isOpen: true,
          title: "Nạp dữ liệu thành công!",
          message: response.data.message,
          type: "success",
          isAlertOnly: true,
        });
        fetchPlaces();
      }
    } catch (error) {
      console.error("Lỗi upload:", error);
      setModal({
        isOpen: true,
        title: "Lỗi nạp Excel",
        message:
          error.response?.data?.message || "Đã xảy ra lỗi khi nạp file Excel!",
        type: "danger",
        isAlertOnly: true,
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // ==========================================
  // XỬ LÝ XÓA (DELETE)
  // ==========================================
  const handleDeletePlaceClick = (placeId, placeName) => {
    setModal({
      isOpen: true,
      title: "Xóa địa điểm",
      message: `Bạn có chắc chắn muốn xóa "${placeName || "Địa điểm này"}" khỏi hệ thống Danasoul? Toàn bộ dữ liệu Menu, Review liên quan có thể bị ảnh hưởng!`,
      type: "danger",
      isAlertOnly: false,
      onConfirm: () => executeDeletePlace(placeId),
    });
  };

  const executeDeletePlace = async (placeId) => {
    setModal({ ...modal, isOpen: false });
    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(`${API_BASE_URL}/${placeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setPlaces(places.filter((p) => p._id !== placeId));
        setModal({
          isOpen: true,
          title: "Xóa thành công",
          message:
            res.data.message ||
            "Địa điểm đã được gỡ bỏ hoàn toàn khỏi hệ thống Danasoul!",
          type: "success",
          isAlertOnly: true,
          onConfirm: null,
        });
      }
    } catch (err) {
      setModal({
        isOpen: true,
        title: "Lỗi hệ thống",
        message: err.response?.data?.message || "Lỗi khi xóa địa điểm!",
        type: "danger",
        isAlertOnly: true,
      });
    }
  };

  // ==========================================
  // LOGIC LỌC VÀ PHÂN TRANG
  // ==========================================
  const filteredPlaces = places.filter((p) => {
    // Tương thích với cả schema cũ (p.address) và mới (p.location.address)
    const locString =
      typeof p.location?.address === "string"
        ? p.location.address
        : typeof p.address === "string"
          ? p.address
          : "";
    const nameString =
      typeof p.name === "string"
        ? p.name
        : typeof p.title === "string"
          ? p.title
          : "";

    const matchesSearch =
      nameString.toLowerCase().includes(searchTerm.toLowerCase()) ||
      locString.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === "ALL" || p.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const indexOfLastPlace = currentPage * placesPerPage;
  const indexOfFirstPlace = indexOfLastPlace - placesPerPage;
  const currentPlaces = filteredPlaces.slice(
    indexOfFirstPlace,
    indexOfLastPlace,
  );
  const totalPages = Math.ceil(filteredPlaces.length / placesPerPage);

  const getPaginationRange = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i);
      }
    }

    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l > 2) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    }
    return rangeWithDots;
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <div className="min-h-screen bg-[#fcfdfe] font-sans text-slate-900">
      <Sidebar />

      <main className="ml-64 flex flex-col min-h-screen relative">
        <Header
          title="Quản Lý Địa Điểm"
          subtitle="Hệ sinh thái Di sản, Lưu trú và Ẩm thực Danasoul"
        />

        <div className="p-10 flex-1 space-y-8 max-w-7xl mx-auto w-full">
          {/* TOOLBAR */}
          <div className="flex flex-col xl:flex-row justify-between items-center bg-white p-5 rounded-[20px] shadow-sm border border-slate-100 gap-4">
            <div className="flex flex-col md:flex-row w-full xl:w-auto gap-4">
              <div className="relative w-full md:w-[350px]">
                <input
                  type="text"
                  placeholder="Tìm kiếm Tên hoặc Địa chỉ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#f8fafc] border border-slate-200 text-sm rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:border-[#C4391D] focus:ring-4 focus:ring-red-50 transition-all font-medium text-slate-700"
                />
                <svg
                  className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-[#f8fafc] border border-slate-200 text-sm rounded-xl px-4 py-3.5 focus:outline-none focus:border-[#002045] font-bold text-slate-700 cursor-pointer shadow-sm w-full md:w-[220px]"
              >
                <option value="ALL">Tất cả danh mục</option>
                <option value="attraction">Di tích & Thắng cảnh</option>
                <option value="hotel">Khách sạn & Lưu trú</option>
                <option value="restaurant">Nhà hàng & Ẩm thực</option>
                <option value="entertainment">Khu vui chơi giải trí</option>
              </select>
            </div>

            <div className="flex items-center justify-between w-full xl:w-auto gap-4">
              <span className="text-sm font-bold text-slate-500 bg-slate-50 px-5 py-3.5 rounded-xl border border-slate-100 hidden md:inline-block">
                Tổng:{" "}
                <span className="text-[#002045] text-lg font-black ml-1">
                  {filteredPlaces.length}
                </span>
              </span>

              {/* KHỐI BUTTON IMPORT EXCEL & THÊM ĐỊA ĐIỂM TAY */}
              <div className="flex gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleExcelUpload}
                  accept=".xlsx, .xls, .csv"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current.click()}
                  disabled={isUploading}
                  className="cursor-pointer flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white px-5 py-3.5 rounded-xl font-bold text-sm transition-all shadow-md shadow-emerald-500/20"
                >
                  {isUploading ? (
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                      />
                    </svg>
                  )}
                  Nhập Excel
                </button>

                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="cursor-pointer flex items-center justify-center gap-2 bg-[#C4391D] hover:bg-[#a02e16] text-white px-5 py-3.5 rounded-xl font-bold text-sm transition-all shadow-md shadow-red-500/20"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Thêm Tay
                </button>
              </div>
            </div>
          </div>

          {/* TABLE DỮ LIỆU */}
          <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden flex flex-col">
            <div className="overflow-x-auto min-h-[460px]">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-64 gap-4">
                  <div className="animate-spin w-10 h-10 border-4 border-[#C4391D] border-t-transparent rounded-full"></div>
                  <p className="text-sm font-bold text-slate-400">
                    Đang tải dữ liệu...
                  </p>
                </div>
              ) : (
                <table className="w-full text-left text-sm text-slate-600 border-collapse">
                  <thead className="bg-[#f8fafc] text-slate-400 uppercase text-[11px] font-black tracking-widest border-b border-slate-100">
                    <tr>
                      <th className="px-8 py-5">Địa điểm</th>
                      <th className="px-8 py-5">Danh mục (Category)</th>
                      <th className="px-8 py-5">AI Tags</th>
                      <th className="px-8 py-5 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {currentPlaces.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="px-8 py-20 text-center">
                          <p className="text-slate-500 font-medium text-base">
                            Không tìm thấy địa điểm nào phù hợp.
                          </p>
                        </td>
                      </tr>
                    ) : (
                      currentPlaces.map((p) => {
                        const catConfig =
                          CATEGORY_CONFIG[p.category] ||
                          CATEGORY_CONFIG.default;

                        // Xử lý tương thích hiển thị hình ảnh (Schema cũ và mới)
                        let displayImage = null;
                        if (p.images && p.images.length > 0) {
                          displayImage = p.images[0].url || p.images[0];
                        } else if (p.image) {
                          displayImage = p.image;
                        }

                        // Xử lý hiển thị địa chỉ
                        const displayAddress = p.location?.address || p.address;

                        return (
                          <tr
                            key={p._id}
                            className="hover:bg-[#fcfdfe] transition-colors group"
                          >
                            {/* CỘT 1: THÔNG TIN */}
                            <td className="px-8 py-4">
                              <div className="flex items-center gap-5">
                                {displayImage ? (
                                  <img
                                    src={displayImage}
                                    alt={p.name || p.title}
                                    className="w-16 h-16 rounded-[14px] object-cover shadow-sm border border-slate-100 group-hover:scale-105 transition-transform"
                                  />
                                ) : (
                                  <div className="w-16 h-16 rounded-[14px] bg-slate-100 flex items-center justify-center text-slate-300 shadow-sm border border-slate-100">
                                    <svg
                                      className="w-6 h-6"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2-2v12a2 2 0 002 2z"
                                      />
                                    </svg>
                                  </div>
                                )}
                                <div className="flex flex-col">
                                  <span
                                    className="font-extrabold text-[15px] text-slate-800 mb-1 line-clamp-1"
                                    title={p.name || p.title}
                                  >
                                    {p.name || p.title || "Chưa có tên"}
                                  </span>
                                  <span
                                    className="text-xs font-medium text-slate-500 flex items-center gap-1.5 line-clamp-1"
                                    title={displayAddress}
                                  >
                                    <svg
                                      className="w-3.5 h-3.5 text-slate-400 shrink-0"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                      />
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                      />
                                    </svg>
                                    {displayAddress
                                      ? displayAddress
                                      : p.location?.coordinates
                                        ? `[${p.location.coordinates[1].toFixed(4)}, ${p.location.coordinates[0].toFixed(4)}]`
                                        : "Chưa cập nhật tọa độ"}
                                  </span>
                                </div>
                              </div>
                            </td>

                            {/* CỘT 2: DANH MỤC */}
                            <td className="px-8 py-4">
                              <span
                                className={`inline-flex items-center px-3 py-1.5 rounded-[10px] font-bold text-[11px] border uppercase tracking-wider ${catConfig.color}`}
                              >
                                {catConfig.label}
                              </span>
                            </td>

                            {/* CỘT 3: AI TAGS */}
                            <td className="px-8 py-4">
                              <div className="flex flex-wrap gap-1 max-w-[200px]">
                                {p.tags && p.tags.length > 0 ? (
                                  p.tags.slice(0, 3).map((tag, idx) => (
                                    <span
                                      key={idx}
                                      className="bg-slate-100 text-slate-600 text-[10px] px-2 py-1 rounded-md font-bold border border-slate-200"
                                    >
                                      #{tag}
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-xs text-slate-400 italic">
                                    Chưa phân loại
                                  </span>
                                )}
                                {p.tags && p.tags.length > 3 && (
                                  <span className="text-[10px] text-slate-400 font-bold ml-1">
                                    +{p.tags.length - 3}
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* CỘT 4: ACTIONS */}
                            <td className="px-8 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-400 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100 transition-all shadow-sm"
                                  title="Chỉnh sửa"
                                >
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                    />
                                  </svg>
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeletePlaceClick(
                                      p._id,
                                      p.name || p.title,
                                    )
                                  }
                                  className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-400 hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all shadow-sm"
                                  title="Xóa địa điểm"
                                >
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                  </svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              )}
            </div>

            {/* PAGINATION */}
            {!isLoading && totalPages > 1 && (
              <div className="bg-slate-50 border-t border-slate-100 px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs font-bold text-slate-400 tracking-wide text-center sm:text-left">
                  Hiển thị{" "}
                  <span className="text-[#002045] font-black">
                    {indexOfFirstPlace + 1}
                  </span>{" "}
                  đến{" "}
                  <span className="text-[#002045] font-black">
                    {Math.min(indexOfLastPlace, filteredPlaces.length)}
                  </span>{" "}
                  trong số{" "}
                  <span className="text-[#002045] font-black">
                    {filteredPlaces.length}
                  </span>{" "}
                  địa điểm
                </span>

                <div className="flex items-center gap-1.5 flex-wrap justify-center">
                  <button
                    type="button"
                    onClick={prevPage}
                    disabled={currentPage === 1}
                    className="w-8 h-8 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white transition-all cursor-pointer disabled:cursor-not-allowed"
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>

                  {getPaginationRange().map((num, idx) => {
                    if (num === "...") {
                      return (
                        <span
                          key={`dots-${idx}`}
                          className="w-8 h-8 flex items-center justify-center text-xs font-bold text-slate-400 select-none"
                        >
                          ...
                        </span>
                      );
                    }
                    return (
                      <button
                        key={`page-${num}`}
                        type="button"
                        onClick={() => paginate(num)}
                        className={`w-8 h-8 flex items-center justify-center rounded-xl text-xs font-black transition-all shadow-sm cursor-pointer ${
                          currentPage === num
                            ? "bg-[#C4391D] text-white scale-105"
                            : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {num}
                      </button>
                    );
                  })}

                  <button
                    type="button"
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                    className="w-8 h-8 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white transition-all cursor-pointer disabled:cursor-not-allowed"
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ========================================== */}
        {/* MODAL THÊM ĐỊA ĐIỂM DYNAMIC THEO SCHEMA */}
        {/* ========================================== */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-[30px] shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <form onSubmit={handleAddPlace}>
                <div className="p-8 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
                  <div>
                    <h2 className="text-2xl font-black text-slate-800">
                      Thêm Địa Điểm Mới
                    </h2>
                    <p className="text-sm text-slate-400 font-medium">
                      Nhập dữ liệu chuẩn xác để hệ thống Re:Verse Danasoul hiển
                      thị tốt nhất
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="text-slate-400 hover:text-slate-600 text-2xl font-black"
                  >
                    ×
                  </button>
                </div>

                <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* CỘT TRÁI: DỮ LIỆU CHUNG (BASE SCHEMA) */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-black text-[#C4391D] uppercase tracking-widest border-b border-red-100 pb-2 mb-4">
                      Thông tin cơ bản
                    </h3>

                    {/* Tên & Danh mục */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-2">
                        <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">
                          Tên địa điểm (*)
                        </label>
                        <input
                          required
                          type="text"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 mt-1 outline-none focus:border-[#002045] transition-colors"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                        />
                      </div>
                      <div className="col-span-1">
                        <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">
                          Danh mục (*)
                        </label>
                        <select
                          className="w-full bg-blue-50 text-blue-800 font-bold border border-blue-200 rounded-xl px-4 py-3 mt-1 outline-none"
                          value={formData.category}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              category: e.target.value,
                            })
                          }
                        >
                          <option value="attraction">
                            Di tích / Thắng cảnh
                          </option>
                          <option value="hotel">Khách sạn</option>
                          <option value="restaurant">Nhà hàng</option>
                          <option value="entertainment">Khu giải trí</option>
                        </select>
                      </div>
                    </div>

                    {/* Bộ từ khóa AI */}
                    <div className="col-span-2 relative">
                      <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">
                        Bộ từ khóa AI (Gợi ý lộ trình)
                      </label>
                      <div
                        onClick={() => setIsTagDropdownOpen(!isTagDropdownOpen)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 mt-1 cursor-pointer flex justify-between items-center hover:border-[#002045] transition-colors"
                      >
                        <div className="flex flex-wrap gap-1 overflow-hidden">
                          {formData.tags.length === 0 ? (
                            <span className="text-slate-400 text-sm font-medium">
                              Nhấp để chọn từ khóa phù hợp...
                            </span>
                          ) : (
                            <span className="text-sm font-bold text-[#C4391D] truncate max-w-[300px]">
                              {formData.tags.map((t) => `#${t}`).join(", ")}
                            </span>
                          )}
                        </div>
                        <svg
                          className={`w-4 h-4 text-slate-400 transition-transform ${isTagDropdownOpen ? "rotate-180" : ""}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>

                      {/* Dropdown Box */}
                      {isTagDropdownOpen && (
                        <div className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] max-h-56 overflow-y-auto">
                          <div className="p-2 flex flex-col">
                            <div className="px-3 py-2 border-b border-slate-100 mb-1">
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                Danh sách Tags
                              </span>
                            </div>
                            {PREDEFINED_TAGS.map((tag) => {
                              const isSelected = formData.tags.includes(tag);
                              return (
                                <label
                                  key={tag}
                                  className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors"
                                >
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => handleToggleTag(tag)}
                                    className="w-4 h-4 text-[#C4391D] rounded border-slate-300 focus:ring-[#C4391D] cursor-pointer"
                                  />
                                  <span
                                    className={`text-sm ${isSelected ? "font-bold text-[#C4391D]" : "font-medium text-slate-600"}`}
                                  >
                                    {tag}
                                  </span>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* URL Hình ảnh */}
                    <div className="col-span-2">
                      <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">
                        Đường dẫn ảnh (URL Image)
                      </label>
                      <input
                        type="text"
                        placeholder="VD: https://images.unsplash.com/..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 mt-1 outline-none focus:border-[#002045]"
                        value={formData.image}
                        onChange={(e) =>
                          setFormData({ ...formData, image: e.target.value })
                        }
                      />
                    </div>

                    {/* Địa chỉ & Geocoding Button */}
                    <div className="col-span-2">
                      <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">
                        Địa chỉ (Nhập để tự lấy tọa độ GPS)
                      </label>
                      <div className="flex gap-2 mt-1">
                        <input
                          type="text"
                          placeholder="VD: 02 Bạch Đằng, Hải Châu..."
                          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-[#002045] transition-colors"
                          value={formData.address}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              address: e.target.value,
                            })
                          }
                        />
                        <button
                          type="button"
                          onClick={handleAutoFetchCoordinates}
                          disabled={isFetchingLocation}
                          className="bg-[#002045] hover:bg-black disabled:bg-slate-300 text-white px-5 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm whitespace-nowrap min-w-[130px]"
                        >
                          {isFetchingLocation ? (
                            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                          ) : (
                            <>
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2.5}
                                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2.5}
                                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                              </svg>
                              Tìm Tọa Độ
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Tọa độ */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">
                          Kinh độ - Lng (*)
                        </label>
                        <input
                          required
                          type="number"
                          step="any"
                          placeholder="108.2022"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 mt-1 outline-none focus:border-[#002045] transition-colors"
                          value={formData.lng}
                          onChange={(e) =>
                            setFormData({ ...formData, lng: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">
                          Vĩ độ - Lat (*)
                        </label>
                        <input
                          required
                          type="number"
                          step="any"
                          placeholder="16.0544"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 mt-1 outline-none focus:border-[#002045] transition-colors"
                          value={formData.lat}
                          onChange={(e) =>
                            setFormData({ ...formData, lat: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    {/* Min/Max Price */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">
                          Giá Min (VNĐ)
                        </label>
                        <input
                          type="text"
                          placeholder="VD: 50.000"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 mt-1 outline-none focus:border-[#002045]"
                          value={formatCurrency(formData.minPrice)}
                          onChange={(e) => {
                            const rawValue = e.target.value.replace(/\./g, "");
                            setFormData({ ...formData, minPrice: rawValue });
                          }}
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">
                          Giá Max (VNĐ)
                        </label>
                        <input
                          type="text"
                          placeholder="VD: 2.755.000"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 mt-1 outline-none focus:border-[#002045]"
                          value={formatCurrency(formData.maxPrice)}
                          onChange={(e) => {
                            const rawValue = e.target.value.replace(/\./g, "");
                            setFormData({ ...formData, maxPrice: rawValue });
                          }}
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">
                        Mô tả chung
                      </label>
                      <textarea
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 mt-1 h-20 outline-none focus:border-[#002045] transition-colors"
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                      ></textarea>
                    </div>
                  </div>

                  {/* CỘT PHẢI: DỮ LIỆU THEO DISCRIMINATOR */}
                  <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                    <h3 className="text-sm font-black text-[#002045] uppercase tracking-widest border-b border-blue-100 pb-2 mb-4">
                      Dữ liệu đặc thù ({formData.category.toUpperCase()})
                    </h3>

                    {/* DÀNH CHO ATTRACTION */}
                    {formData.category === "attraction" && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-bold text-slate-600">
                              Giá vé (Nếu có)
                            </label>
                            <input
                              type="number"
                              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 mt-1 outline-none focus:border-[#002045]"
                              value={formData.ticketPrice}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  ticketPrice: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-slate-600">
                              Thời gian tour
                            </label>
                            <input
                              type="text"
                              placeholder="VD: 120 phút"
                              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 mt-1 outline-none focus:border-[#002045]"
                              value={formData.tourDuration}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  tourDuration: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-600">
                            Hoạt động (Cách nhau dấu phẩy)
                          </label>
                          <input
                            type="text"
                            placeholder="VD: Ngắm cảnh, Chụp ảnh, Leo núi..."
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 mt-1 outline-none focus:border-[#002045]"
                            value={formData.activities}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                activities: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-600">
                            Nội quy (Rules)
                          </label>
                          <input
                            type="text"
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 mt-1 outline-none focus:border-[#002045]"
                            value={formData.rules}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                rules: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-600">
                            Thông tin Lịch sử (AI Data)
                          </label>
                          <textarea
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 mt-1 h-36 outline-none focus:border-[#002045]"
                            value={formData.historicalInfo}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                historicalInfo: e.target.value,
                              })
                            }
                          ></textarea>
                        </div>
                      </div>
                    )}

                    {/* DÀNH CHO RESTAURANT */}
                    {formData.category === "restaurant" && (
                      <div className="space-y-4">
                        <div>
                          <label className="text-xs font-bold text-slate-600">
                            Loại hình ẩm thực
                          </label>
                          <input
                            type="text"
                            placeholder="VD: Hải sản, Món Việt..."
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 mt-1 outline-none focus:border-[#002045]"
                            value={formData.cuisineType}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                cuisineType: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-600">
                            Loại hình phục vụ
                          </label>
                          <input
                            type="text"
                            placeholder="VD: Buffet, Gọi món, Mang đi..."
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 mt-1 outline-none focus:border-[#002045]"
                            value={formData.serviceType}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                serviceType: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    )}

                    {/* DÀNH CHO HOTEL */}
                    {formData.category === "hotel" && (
                      <div className="space-y-4">
                        <div>
                          <label className="text-xs font-bold text-slate-600">
                            Tiện nghi (Cách nhau dấu phẩy)
                          </label>
                          <textarea
                            placeholder="VD: Hồ bơi vô cực, Spa, Ăn sáng miễn phí..."
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 mt-1 h-32 outline-none focus:border-[#002045]"
                            value={formData.amenities}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                amenities: e.target.value,
                              })
                            }
                          ></textarea>
                        </div>
                      </div>
                    )}

                    {/* DÀNH CHO ENTERTAINMENT */}
                    {formData.category === "entertainment" && (
                      <div className="space-y-4">
                        <div>
                          <label className="text-xs font-bold text-slate-600">
                            Loại hình hoạt động
                          </label>
                          <input
                            type="text"
                            placeholder="VD: Lướt ván, Bar bãi biển..."
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 mt-1 outline-none focus:border-[#002045]"
                            value={formData.activityType}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                activityType: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-600">
                            Lịch trình sự kiện
                          </label>
                          <input
                            type="text"
                            placeholder="VD: 19:00 - Nhạc sống..."
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 mt-1 outline-none focus:border-[#002045]"
                            value={formData.eventSchedule}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                eventSchedule: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Modal */}
                <div className="p-6 bg-slate-50 flex justify-end gap-3 rounded-b-[30px] border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddModalOpen(false);
                      setIsTagDropdownOpen(false);
                    }}
                    className="px-8 py-3.5 rounded-xl font-bold text-slate-600 hover:bg-slate-200 transition-colors"
                  >
                    Hủy thao tác
                  </button>
                  <button
                    type="submit"
                    className="px-10 py-3.5 rounded-xl font-bold bg-[#002045] text-white hover:bg-black transition-all shadow-lg flex items-center gap-2"
                  >
                    Lưu Địa Điểm
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ================= MODAL THÔNG BÁO CHUNG ================= */}
        {modal.isOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-[24px] shadow-2xl w-[90%] max-w-[400px] overflow-hidden flex flex-col transform transition-all scale-100 animate-in fade-in zoom-in duration-200">
              <div className="p-8 flex flex-col items-center text-center">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center mb-5 ${
                    modal.type === "success"
                      ? "bg-emerald-50 text-emerald-500"
                      : modal.type === "warning"
                        ? "bg-amber-50 text-amber-500"
                        : "bg-red-50 text-red-500"
                  }`}
                >
                  {modal.type === "success" ? (
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : modal.type === "warning" ? (
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  )}
                </div>

                <h3 className="text-[19px] font-black text-slate-800 mb-2.5">
                  {modal.title}
                </h3>
                <p className="text-slate-500 font-medium text-[14px] leading-relaxed">
                  {modal.message}
                </p>
              </div>

              <div className="bg-slate-50 px-6 py-5 flex items-center justify-center gap-3 border-t border-slate-100">
                {modal.isAlertOnly ? (
                  <button
                    onClick={() => setModal({ ...modal, isOpen: false })}
                    className={`w-full py-3 rounded-xl font-bold text-[13px] text-white shadow-md transition-colors ${
                      modal.type === "success"
                        ? "bg-emerald-500 hover:bg-emerald-600"
                        : modal.type === "warning"
                          ? "bg-amber-500 hover:bg-amber-600"
                          : "bg-red-500 hover:bg-red-600"
                    }`}
                  >
                    Đóng
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => setModal({ ...modal, isOpen: false })}
                      className="flex-1 py-3 rounded-xl font-bold text-[13px] bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 shadow-sm transition-colors"
                    >
                      Hủy bỏ
                    </button>
                    <button
                      onClick={modal.onConfirm}
                      className="flex-1 py-3 rounded-xl font-bold text-[13px] text-white bg-red-600 hover:bg-red-700 shadow-md transition-colors"
                    >
                      Xác nhận Xóa
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
