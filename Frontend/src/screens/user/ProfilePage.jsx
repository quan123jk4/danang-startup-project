import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faPhone,
  faWallet,
  faCamera,
  faEnvelope,
  faSuitcaseRolling,
  faTicketAlt,
  faShieldAlt,
} from "@fortawesome/free-solid-svg-icons";
import Navbar from "../../components/common/Navbar";

const ProfilePage = () => {
  const navigate = useNavigate();

  // Tạo tham chiếu đến thẻ input file ẩn
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    targetBudget: "",
    avatar: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:5000/api/v1/users/profile",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const result = await response.json();

        if (result.success) {
          const user = result.data;
          setFormData({
            fullName: user.fullName || "",
            email: user.email || "",
            phoneNumber: user.phoneNumber || "",
            targetBudget: user.targetBudget || "",
            avatar:
              user.avatar ||
              "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
          });
        }
      } catch (error) {
        console.error("Lỗi fetch profile:", error);
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setStatus({ type: "", message: "" });
  };

  // ====================================================================
  // HÀM XỬ LÝ KHI NGƯỜI DÙNG CHỌN ẢNH TỪ MÁY
  // ====================================================================
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Kiểm tra xem có đúng là file ảnh không
      if (!file.type.startsWith("image/")) {
        setStatus({
          type: "error",
          message: "Vui lòng chỉ chọn file hình ảnh!",
        });
        return;
      }

      // Giới hạn dung lượng ảnh (ví dụ: < 2MB để tránh nặng database)
      if (file.size > 2 * 1024 * 1024) {
        setStatus({
          type: "error",
          message: "Kích thước ảnh phải nhỏ hơn 2MB!",
        });
        return;
      }

      // Đọc file thành chuỗi Base64 để hiển thị ngay lập tức và gửi lên DB
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatar: reader.result }); // reader.result chính là chuỗi Base64
        setStatus({ type: "", message: "" });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ type: "", message: "" });
    window.location.reload();

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/api/v1/users/profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            fullName: formData.fullName,
            phoneNumber: formData.phoneNumber,
            avatar: formData.avatar, // Đẩy thẳng chuỗi Base64 hoặc link cũ lên DB
            targetBudget: formData.targetBudget
              ? Number(formData.targetBudget)
              : null,
          }),
        },
      );

      const result = await response.json();

      if (response.ok && result.success) {
        setStatus({ type: "success", message: "Cập nhật hồ sơ thành công!" });
      } else {
        setStatus({
          type: "error",
          message: result.message || "Cập nhật thất bại!",
        });
      }
    } catch (err) {
      setStatus({ type: "error", message: "Không thể kết nối đến máy chủ." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#E5EDF4] min-h-screen w-full flex flex-col items-center">
      <div className="w-full max-w-[1280px] bg-white shadow-2xl rounded-none flex flex-col min-h-screen">
        <Navbar />

        <div className="flex-1 w-full bg-[#F8FAFC] py-12 px-6 md:px-12 flex flex-col md:flex-row gap-8">
          {/* CỘT TRÁI: SIDEBAR */}
          <div className="w-full md:w-[280px] shrink-0 bg-white p-6 rounded-3xl shadow-sm border border-slate-100 h-fit">
            <div className="flex flex-col items-center mb-8 pb-8 border-b border-slate-100">
              {/* Ảnh ở sidebar tự động cập nhật ngay khi chọn file */}
              <img
                src={formData.avatar}
                alt="Avatar"
                className="w-24 h-24 rounded-full object-cover border-4 border-[#F5FAFF] shadow-md mb-4"
              />
              <h3 className="text-[#002045] font-bold text-lg">
                {formData.fullName || "Khách"}
              </h3>
              <p className="text-slate-500 text-xs">{formData.email}</p>
            </div>

            <nav className="flex flex-col gap-2">
              <button className="flex items-center gap-4 px-4 py-3 bg-[#F5FAFF] text-[#002045] rounded-xl font-bold text-sm transition-colors">
                <FontAwesomeIcon icon={faUser} className="w-4" /> Thông tin cá
                nhân
              </button>
              <button className="flex items-center gap-4 px-4 py-3 text-slate-500 hover:bg-slate-50 hover:text-[#002045] rounded-xl font-medium text-sm transition-colors">
                <FontAwesomeIcon icon={faShieldAlt} className="w-4" /> Bảo mật &
                Mật khẩu
              </button>
              <button className="flex items-center gap-4 px-4 py-3 text-slate-500 hover:bg-slate-50 hover:text-[#002045] rounded-xl font-medium text-sm transition-colors">
                <FontAwesomeIcon icon={faSuitcaseRolling} className="w-4" />{" "}
                Chuyến đi của tôi
              </button>
              <button className="flex items-center gap-4 px-4 py-3 text-slate-500 hover:bg-slate-50 hover:text-[#002045] rounded-xl font-medium text-sm transition-colors">
                <FontAwesomeIcon icon={faTicketAlt} className="w-4" /> Kho
                Voucher
              </button>
            </nav>
          </div>

          {/* CỘT PHẢI: FORM */}
          <div className="flex-1 bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-100">
            <h2 className="text-3xl font-bold text-[#002045] mb-2">
              Thông tin cá nhân
            </h2>
            <p className="text-sm text-slate-500 mb-8">
              Quản lý thông tin cá nhân và tùy chọn hiển thị của bạn trên
              Danasoul.
            </p>

            {status.message && (
              <div
                className={`mb-8 p-4 text-sm font-bold rounded-xl border ${
                  status.type === "success"
                    ? "bg-green-50 text-green-700 border-green-200"
                    : "bg-red-50 text-red-600 border-red-200"
                }`}
              >
                {status.message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
              {/* KHU VỰC CHỌN ẢNH TỪ MÁY */}
              <div className="pb-4">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">
                  Ảnh đại diện
                </label>
                <div className="flex items-center gap-5">
                  <img
                    src={formData.avatar}
                    alt="Preview"
                    className="w-16 h-16 rounded-full object-cover border-2 border-slate-200 shadow-sm"
                  />

                  {/* Thẻ input ẩn đi */}
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    className="hidden"
                  />

                  {/* Nút bấm để gọi thẻ input ẩn */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-[#002045] font-bold text-sm rounded-xl transition-colors flex items-center gap-2"
                  >
                    <FontAwesomeIcon icon={faCamera} />
                    Chọn ảnh từ thiết bị
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 mt-2">
                  Định dạng JPG, PNG. Dung lượng tối đa 2MB.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
                    Họ và Tên
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                      <FontAwesomeIcon icon={faUser} />
                    </div>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-[#002045] font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
                    Email (Không thể sửa)
                  </label>
                  <div className="relative opacity-60 cursor-not-allowed">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                      <FontAwesomeIcon icon={faEnvelope} />
                    </div>
                    <input
                      type="email"
                      value={formData.email}
                      disabled
                      className="w-full pl-11 pr-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-sm outline-none text-slate-500 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
                    Số điện thoại
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                      <FontAwesomeIcon icon={faPhone} />
                    </div>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      required
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-[#002045] font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
                    Ngân sách dự kiến (VND)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                      <FontAwesomeIcon icon={faWallet} />
                    </div>
                    <input
                      type="number"
                      name="targetBudget"
                      value={formData.targetBudget}
                      onChange={handleChange}
                      min="0"
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-[#002045] font-medium"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 mt-8">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-8 bg-[#002045] hover:bg-blue-800 text-white font-bold py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-70"
                >
                  {isLoading ? "Đang lưu thay đổi..." : "Lưu thay đổi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
