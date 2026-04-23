import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faUser,
  faLock,
  faShieldAlt,
  faKey,
  faCheckCircle,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { faGoogle, faFacebookF } from "@fortawesome/free-brands-svg-icons";

const Register = () => {
  const bgImage =
    "https://w-vietnam.com/wp-content/uploads/2021/04/Ngu-Hanh-Son-marble-mountain.jpg";
  const navigate = useNavigate();

  // === 1. QUẢN LÝ TRẠNG THÁI (STATE) ===
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });

  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1: Form | 2: Nhập OTP | 3: Thành công
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // === 2. GỬI YÊU CẦU ĐĂNG KÝ (BƯỚC 1) ===
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (
      !formData.fullName ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      return setError("Vui lòng điền đầy đủ thông tin!");
    }
    if (formData.password !== formData.confirmPassword) {
      return setError("Mật khẩu xác nhận không khớp!");
    }
    if (!formData.agreeTerms) {
      return setError("Bạn phải đồng ý với Điều khoản dịch vụ!");
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/auth/register",
        {
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          role: "TOURIST",
        },
      );

      setSuccessMsg(response.data.message);
      setStep(2);
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message);
      } else {
        setError("Không thể kết nối đến máy chủ!");
      }
    } finally {
      setLoading(false);
    }
  };

  // === 3. GỬI MÃ OTP ĐỂ XÁC THỰC (BƯỚC 2) ===
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!otp) return setError("Vui lòng nhập mã OTP!");

    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/v1/auth/verify-email", {
        email: formData.email,
        otp: otp,
      });

      // BỎ ALERT ĐI - Chuyển sang Màn hình thành công (Bước 3)
      setStep(3);

      // Tự động chuyển hướng sau 3 giây
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message);
      } else {
        setError("Lỗi xác thực OTP!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-[#fcfdfe] font-sans overflow-hidden">
      {/* 1. BÊN TRÁI (Giữ nguyên) */}
      <div className="relative hidden w-1/2 lg:block bg-[#0A192F]">
        <img
          src={bgImage}
          alt="Background"
          className="h-full w-full object-cover opacity-40 mix-blend-overlay"
        />
        <div className="absolute inset-0 flex flex-col justify-center px-20 text-white bg-gradient-to-t from-[#0A192F] via-[#0A192F]/50 to-transparent">
          <div className="mb-8 w-12 h-12 bg-white"></div>
          <h2 className="text-[54px] font-bold leading-[1.1] mb-6 tracking-tight">
            Khám phá di sản <br />
            trong từng <br />
            <span className="text-[#FBBF24]">chuyển động.</span>
          </h2>
          <p className="max-w-[420px] text-[#CBD5E1] text-[15px] font-light leading-relaxed mb-12">
            Chào mừng bạn đến với Danasoul — không gian lưu giữ vẻ đẹp Đà Thành,
            nơi mỗi trải nghiệm là một câu chuyện văn hóa được kể bằng ngôn ngữ
            hiện đại.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-[11px] text-[#94A3B8] font-medium tracking-wide">
              Tham gia cùng 10,000+ người yêu văn hóa Đà Nẵng
            </span>
          </div>
        </div>
      </div>

      {/* 2. BÊN PHẢI (Logic Form) */}
      <div className="flex w-full flex-col justify-center px-8 md:px-24 lg:w-1/2 relative">
        <div className="mx-auto w-full max-w-[420px]">
          {/* Ẩn Header nếu đang ở Bước 3 (Thành công) */}
          {step !== 3 && (
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-[#1E293B] mb-2 tracking-tight">
                {step === 1 ? "Bắt đầu hành trình" : "Xác thực Email"}
              </h1>
              <p className="text-[#64748B] text-sm leading-relaxed">
                {step === 1 ? (
                  "Kiến tạo trải nghiệm di sản của riêng bạn."
                ) : (
                  <>
                    Mã xác nhận (OTP) đã được gửi đến{" "}
                    <span className="font-bold text-[#1E293B]">
                      {formData.email}
                    </span>
                    . Mã hết hạn sau 10 phút.
                  </>
                )}
              </p>
            </div>
          )}

          {error && step !== 3 && (
            <div className="mb-4 p-3 text-sm font-semibold text-red-600 bg-red-50 rounded-xl border border-red-200">
              {error}
            </div>
          )}
          {successMsg && step === 1 && (
            <div className="mb-4 p-3 text-sm font-semibold text-green-700 bg-green-50 rounded-xl border border-green-200">
              {successMsg}
            </div>
          )}
          {step === 1 && (
            <form className="space-y-4" onSubmit={handleRegister}>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
                  HỌ TÊN
                </label>
                <div className="relative group">
                  <FontAwesomeIcon
                    icon={faUser}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8] text-sm"
                  />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Nguyễn Văn A"
                    className="w-full rounded-xl border-none bg-[#E2E8F0]/60 py-3.5 pl-11 pr-4 outline-none focus:bg-[#E2E8F0] transition-all text-sm font-medium text-[#1E293B]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
                  EMAIL
                </label>
                <div className="relative group">
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8] text-sm"
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="example@danasoul.vn"
                    className="w-full rounded-xl border-none bg-[#E2E8F0]/60 py-3.5 pl-11 pr-4 outline-none focus:bg-[#E2E8F0] transition-all text-sm font-medium text-[#1E293B]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
                  MẬT KHẨU
                </label>
                <div className="relative group">
                  <FontAwesomeIcon
                    icon={faLock}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8] text-sm"
                  />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••••••"
                    className="w-full rounded-xl border-none bg-[#E2E8F0]/60 py-3.5 pl-11 pr-4 outline-none focus:bg-[#E2E8F0] transition-all text-sm font-medium text-[#1E293B]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
                  XÁC NHẬN MẬT KHẨU
                </label>
                <div className="relative group">
                  <FontAwesomeIcon
                    icon={faShieldAlt}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8] text-sm"
                  />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••••••"
                    className="w-full rounded-xl border-none bg-[#E2E8F0]/60 py-3.5 pl-11 pr-4 outline-none focus:bg-[#E2E8F0] transition-all text-sm font-medium text-[#1E293B]"
                  />
                </div>
              </div>

              <div className="flex items-start gap-3 pt-2">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  id="terms"
                  className="mt-0.5 h-4 w-4 rounded border-[#CBD5E1] accent-[#172554] cursor-pointer"
                />
                <label
                  htmlFor="terms"
                  className="text-xs text-[#64748B] leading-relaxed cursor-pointer"
                >
                  Tôi đồng ý với{" "}
                  <span className="text-[#1E293B] font-bold hover:underline">
                    Điều khoản dịch vụ
                  </span>{" "}
                  và{" "}
                  <span className="text-[#1E293B] font-bold hover:underline">
                    Chính sách bảo mật
                  </span>{" "}
                  của Danasoul.
                </label>
              </div>

              <button
                disabled={loading}
                className={`w-full rounded-xl py-3.5 font-bold text-white transition-all mt-2 text-sm flex justify-center items-center gap-2 ${
                  loading
                    ? "bg-slate-400 cursor-not-allowed"
                    : "bg-[#172554] hover:bg-[#0A192F]"
                }`}
              >
                {loading ? "ĐANG XỬ LÝ..." : "ĐĂNG KÝ →"}
              </button>
            </form>
          )}
          {step === 2 && (
            <form className="space-y-4" onSubmit={handleVerifyOtp}>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
                  MÃ XÁC NHẬN (OTP)
                </label>
                <div className="relative group">
                  <FontAwesomeIcon
                    icon={faKey}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8] text-sm"
                  />
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Nhập mã 6 số"
                    maxLength={6}
                    className="w-full rounded-xl border-none bg-[#E2E8F0]/60 py-4 pl-11 pr-4 outline-none focus:bg-[#E2E8F0] transition-all text-center text-lg font-bold text-[#1E293B] tracking-[0.5em]"
                  />
                </div>
              </div>

              <button
                disabled={loading}
                className={`w-full rounded-xl py-3.5 font-bold text-white transition-all mt-2 text-sm flex justify-center items-center gap-2 shadow-lg ${
                  loading
                    ? "bg-slate-400 cursor-not-allowed"
                    : "bg-[#10B981] hover:bg-[#059669]"
                }`}
              >
                {loading ? "ĐANG XÁC THỰC..." : "XÁC NHẬN OTP"}
              </button>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full py-2 text-xs font-semibold text-[#64748B] underline underline-offset-2 hover:text-[#1E293B]"
              >
                Quay lại sửa thông tin
              </button>
            </form>
          )}
          {step === 3 && (
            <div className="flex flex-col items-center justify-center py-10 text-center animate-fade-in-up">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  className="text-[#10B981] text-5xl"
                />
              </div>
              <h2 className="text-3xl font-bold text-[#1E293B] mb-3">
                Xác thực thành công!
              </h2>
              <p className="text-[#64748B] text-sm mb-8 leading-relaxed">
                Tài khoản của bạn đã được kích hoạt.
                <br /> Hệ thống đang chuyển hướng...
              </p>
              <div className="flex items-center gap-2 text-[#94A3B8] text-sm font-medium">
                <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                <span>Đang tải trang đăng nhập</span>
              </div>
            </div>
          )}

          {/* Dưới cùng: Nút Google/Facebook và Đăng nhập (Chỉ hiện ở Bước 1) */}
          {step === 1 && (
            <>
              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#E2E8F0]"></div>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest">
                  <span className="bg-[#fcfdfe] px-4 text-[#94A3B8]">
                    Hoặc tiếp tục với
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] bg-white py-2.5 text-xs font-bold text-[#475569] hover:bg-gray-50 transition-all shadow-sm">
                  <FontAwesomeIcon
                    icon={faGoogle}
                    className="text-[#EA4335] text-sm"
                  />{" "}
                  Google
                </button>
                <button className="flex items-center justify-center gap-2 rounded-xl border border-[#E2E8F0] bg-white py-2.5 text-xs font-bold text-[#475569] hover:bg-gray-50 transition-all shadow-sm">
                  <FontAwesomeIcon
                    icon={faFacebookF}
                    className="text-[#1877F2] text-sm"
                  />{" "}
                  Facebook
                </button>
              </div>

              <p className="mt-8 text-center text-[13px] font-medium text-[#64748B]">
                Đã có tài khoản?{" "}
                <Link
                  to="/login"
                  className="font-bold text-[#DC2626] hover:underline"
                >
                  Đăng nhập ngay
                </Link>
              </p>
            </>
          )}
        </div>

        <div className="absolute bottom-6 w-full text-center left-0">
          <p className="text-[10px] text-[#94A3B8] tracking-wide">
            © 2026 Danasoul. Di sản trong từng chuyển động.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
