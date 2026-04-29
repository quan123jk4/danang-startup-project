import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

import Sidebar from "../../components/admin/Sidebar";
import Header from "../../components/admin/Header";

export default function AdminUserPage() {
  const { user } = useAuth();

  // === 1. CÁC STATE CƠ BẢN ===
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // === 2. STATE CHO TÌM KIẾM & BỘ LỌC ===
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL"); // 'ALL', 'TOURIST', 'BUSINESS', 'ADMIN'

  // === 3. STATE CHO PHÂN TRANG (PAGINATION) ===
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 6; // Số lượng user hiển thị trên 1 trang (để 6 cho dễ test)

  // === 4. STATE CHO MODAL ===
  const [modal, setModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "danger",
    isAlertOnly: false,
    onConfirm: null,
  });

  const API_BASE_URL = "http://localhost:5000/api/v1/users";

  // Fetch Danh sách User
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(API_BASE_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) {
          setUsers(res.data.data);
        }
      } catch (err) {
        console.error("Lỗi lấy danh sách user:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Đặt lại trang 1 mỗi khi người dùng Gõ tìm kiếm hoặc Đổi bộ lọc
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, roleFilter]);

  // ==========================================
  // XỬ LÝ LOGIC (ĐỔI QUYỀN & KHÓA TÀI KHOẢN)
  // ==========================================

  // A. ĐỔI QUYỀN
  const handleRoleChangeClick = (userId, newRole) => {
    if (userId === user.id || userId === user._id) {
      return setModal({
        isOpen: true,
        title: "Thao tác từ chối",
        message: "Bạn không thể tự thay đổi quyền của chính mình!",
        type: "warning",
        isAlertOnly: true,
      });
    }
    setModal({
      isOpen: true,
      title: "Xác nhận cấp quyền",
      message: `Cấp quyền [${newRole}] cho tài khoản này?`,
      type: "info",
      isAlertOnly: false,
      onConfirm: () => executeRoleChange(userId, newRole),
    });
  };

  const executeRoleChange = async (userId, newRole) => {
    setModal({ ...modal, isOpen: false });
    try {
      const token = localStorage.getItem("token");
      const res = await axios.patch(
        `${API_BASE_URL}/${userId}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (res.data.success)
        setUsers(
          users.map((u) => (u._id === userId ? { ...u, role: newRole } : u)),
        );
    } catch (err) {
      setModal({
        isOpen: true,
        title: "Lỗi hệ thống",
        message: err.response?.data?.message || "Lỗi khi đổi quyền!",
        type: "danger",
        isAlertOnly: true,
      });
    }
  };

  // B. KHÓA / MỞ KHÓA TÀI KHOẢN (Thay thế cho Xóa)
  const handleToggleLockClick = (userId, isLocked) => {
    if (userId === user.id || userId === user._id) {
      return setModal({
        isOpen: true,
        title: "Thao tác từ chối",
        message: "Bạn không thể tự khóa tài khoản của chính mình!",
        type: "warning",
        isAlertOnly: true,
      });
    }

    setModal({
      isOpen: true,
      title: isLocked ? "Mở khóa tài khoản" : "Khóa tài khoản",
      message: isLocked
        ? "Tài khoản này sẽ được phép đăng nhập lại bình thường. Bạn có chắc chắn?"
        : "Tài khoản này sẽ BỊ CẤM đăng nhập vào hệ thống Danasoul. Dữ liệu review vẫn được giữ nguyên. Tiếp tục?",
      type: isLocked ? "info" : "danger",
      isAlertOnly: false,
      onConfirm: () => executeToggleLock(userId, isLocked),
    });
  };

  const executeToggleLock = async (userId, isLocked) => {
    setModal({ ...modal, isOpen: false });
    try {
      const token = localStorage.getItem("token");
      // Gọi API Khóa (Hãy đảm bảo Backend của ông đã có Route này)
      const res = await axios.patch(
        `${API_BASE_URL}/${userId}/lock`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (res.data.success) {
        setUsers(
          users.map((u) =>
            u._id === userId ? { ...u, isLocked: !isLocked } : u,
          ),
        );
      }
    } catch (err) {
      setModal({
        isOpen: true,
        title: "Lỗi hệ thống",
        message:
          err.response?.data?.message ||
          "API Khóa tài khoản chưa sẵn sàng hoặc lỗi mạng!",
        type: "danger",
        isAlertOnly: true,
      });
    }
  };

  // ==========================================
  // LOGIC LỌC & PHÂN TRANG (PAGINATION)
  // ==========================================

  // 1. Lọc dữ liệu theo Tìm kiếm & Dropdown Role
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole =
      roleFilter === "ALL" || u.role?.toUpperCase() === roleFilter;
    return matchesSearch && matchesRole;
  });

  // 2. Tính toán Phân trang trên mảng đã lọc
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser); // Cắt mảng để hiển thị

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // 3. Các hàm chuyển trang
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <div className="min-h-screen bg-[#fcfdfe] font-sans text-slate-900">
      <Sidebar />

      <main className="ml-64 flex flex-col min-h-screen relative">
        <Header
          title="Quản Lý Người Dùng"
          subtitle="Theo dõi, phân quyền và quản lý cộng đồng Danasoul"
        />

        <div className="p-10 flex-1 space-y-8 max-w-7xl mx-auto w-full">
          {/* ================= THANH CÔNG CỤ ================= */}
          <div className="flex flex-col xl:flex-row justify-between items-center bg-white p-5 rounded-[20px] shadow-sm border border-slate-100 gap-4">
            <div className="flex flex-col md:flex-row w-full xl:w-auto gap-4">
              {/* TÌM KIẾM */}
              <div className="relative w-full md:w-[350px]">
                <input
                  type="text"
                  placeholder="Tìm kiếm bằng tên hoặc email..."
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

              {/* BỘ LỌC ROLE */}
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="bg-[#f8fafc] border border-slate-200 text-sm rounded-xl px-4 py-3.5 focus:outline-none focus:border-[#002045] font-bold text-slate-700 cursor-pointer shadow-sm w-full md:w-[180px]"
              >
                <option value="ALL">Tất cả vai trò</option>
                <option value="TOURIST">Chỉ Tourist</option>
                <option value="BUSINESS">Chỉ Business</option>
                <option value="ADMIN">Chỉ Admin</option>
              </select>
            </div>

            {/* THỐNG KÊ */}
            <div className="flex items-center justify-center w-full xl:w-auto gap-3 bg-slate-50 px-5 py-3 rounded-xl border border-slate-100">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-sm font-bold text-slate-500">
                Tìm thấy:{" "}
                <span className="text-[#002045] text-lg font-black ml-1">
                  {filteredUsers.length}
                </span>
              </span>
            </div>
          </div>

          {/* ================= BẢNG DỮ LIỆU USER ================= */}
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
                      <th className="px-8 py-5">Thông tin Người dùng</th>
                      <th className="px-8 py-5 text-center">Trạng thái</th>
                      <th className="px-8 py-5">Vai trò (Role)</th>
                      <th className="px-8 py-5 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {currentUsers.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="px-8 py-20 text-center">
                          <svg
                            className="w-16 h-16 mx-auto text-slate-200 mb-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                            />
                          </svg>
                          <p className="text-slate-500 font-medium text-base">
                            Không tìm thấy người dùng nào phù hợp.
                          </p>
                        </td>
                      </tr>
                    ) : (
                      currentUsers.map((u) => (
                        <tr
                          key={u._id}
                          className={`hover:bg-[#fcfdfe] transition-colors group ${u.isLocked ? "opacity-60 grayscale-[50%]" : ""}`}
                        >
                          {/* CỘT 1: THÔNG TIN (Giữ nguyên) */}
                          <td className="px-8 py-4">
                            <div className="flex items-center gap-4">
                              {u.avatar ? (
                                <img
                                  src={u.avatar}
                                  alt="avatar"
                                  className="w-12 h-12 rounded-[14px] object-cover shadow-sm border border-slate-100"
                                />
                              ) : (
                                <div className="w-12 h-12 rounded-[14px] bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center font-black text-slate-400 shadow-sm border border-slate-100 text-lg">
                                  {u.fullName
                                    ? u.fullName.charAt(0).toUpperCase()
                                    : "?"}
                                </div>
                              )}
                              <div className="flex flex-col">
                                <span
                                  className={`font-extrabold text-[15px] ${u.isLocked ? "text-slate-500 line-through" : "text-slate-800"}`}
                                >
                                  {u.fullName || "Khách Ẩn Danh"}
                                </span>
                                <span className="text-xs font-medium text-slate-400 mt-0.5">
                                  {u.email}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* CỘT 2: TRẠNG THÁI (Mới thêm) */}
                          <td className="px-8 py-4 text-center">
                            {u.isLocked ? (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 font-bold text-xs border border-red-100">
                                <svg
                                  className="w-3.5 h-3.5"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                  />
                                </svg>
                                BỊ KHÓA
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 font-bold text-xs border border-emerald-100">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                Hoạt động
                              </span>
                            )}
                          </td>

                          {/* CỘT 3: ĐỔI ROLE */}
                          <td className="px-8 py-4">
                            <select
                              value={u.role?.toUpperCase() || "TOURIST"}
                              onChange={(e) =>
                                handleRoleChangeClick(u._id, e.target.value)
                              }
                              disabled={u.isLocked} // Khóa thì không cho đổi role
                              className={`text-[11px] font-black tracking-widest uppercase rounded-[10px] px-4 py-2 outline-none cursor-pointer transition-all shadow-sm ${
                                u.isLocked
                                  ? "bg-slate-100 text-slate-400 cursor-not-allowed opacity-50"
                                  : u.role?.toUpperCase() === "ADMIN"
                                    ? "bg-[#002045] text-white border-none hover:bg-blue-900"
                                    : u.role?.toUpperCase() === "BUSINESS"
                                      ? "bg-purple-100 text-purple-700 border-none hover:bg-purple-200"
                                      : "bg-slate-100 text-slate-600 border-none hover:bg-slate-200"
                              }`}
                            >
                              <option
                                value="TOURIST"
                                className="bg-white text-slate-800"
                              >
                                TOURIST
                              </option>
                              <option
                                value="BUSINESS"
                                className="bg-white text-slate-800"
                              >
                                BUSINESS
                              </option>
                              <option
                                value="ADMIN"
                                className="bg-white text-slate-800"
                              >
                                ADMIN
                              </option>
                            </select>
                          </td>

                          {/* CỘT 4: NÚT KHÓA / MỞ KHÓA (Thay thế Delete) */}
                          <td className="px-8 py-4 text-right">
                            <button
                              onClick={() =>
                                handleToggleLockClick(u._id, u.isLocked)
                              }
                              className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-bold text-[11px] transition-all shadow-sm border ${
                                u.isLocked
                                  ? "bg-slate-800 text-white hover:bg-slate-700 border-slate-700"
                                  : "bg-white text-red-500 hover:bg-red-50 border-slate-200 hover:border-red-200"
                              }`}
                              title={
                                u.isLocked
                                  ? "Mở Khóa Tài Khoản"
                                  : "Khóa Tài Khoản"
                              }
                            >
                              {u.isLocked ? (
                                <>
                                  Mở Khóa{" "}
                                  <svg
                                    className="w-3.5 h-3.5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                                    />
                                  </svg>
                                </>
                              ) : (
                                <>
                                  Khóa TK{" "}
                                  <svg
                                    className="w-3.5 h-3.5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                    />
                                  </svg>
                                </>
                              )}
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>

            {/* ================= PHÂN TRANG (PAGINATION UI) ================= */}
            {!isLoading && totalPages > 1 && (
              <div className="bg-slate-50 border-t border-slate-100 px-8 py-4 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">
                  Hiển thị{" "}
                  <span className="text-[#002045]">{indexOfFirstUser + 1}</span>{" "}
                  đến{" "}
                  <span className="text-[#002045]">
                    {Math.min(indexOfLastUser, filteredUsers.length)}
                  </span>{" "}
                  trong số {filteredUsers.length}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={prevPage}
                    disabled={currentPage === 1}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all"
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
                        strokeWidth={2.5}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (num) => (
                      <button
                        key={num}
                        onClick={() => paginate(num)}
                        className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all shadow-sm ${
                          currentPage === num
                            ? "bg-[#C4391D] text-white border-transparent"
                            : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {num}
                      </button>
                    ),
                  )}

                  <button
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all"
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
                        strokeWidth={2.5}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ================= MODAL ================= */}
        {modal.isOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-[24px] shadow-2xl w-[90%] max-w-[400px] overflow-hidden flex flex-col transform transition-all">
              <div className="p-8 flex flex-col items-center text-center">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center mb-5 ${modal.type === "danger" ? "bg-red-50 text-red-500" : modal.type === "warning" ? "bg-amber-50 text-amber-500" : "bg-blue-50 text-[#002045]"}`}
                >
                  {modal.type === "danger" ? (
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
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
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
                        d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                      />
                    </svg>
                  )}
                </div>
                <h3 className="text-[19px] font-black text-slate-800 mb-2.5">
                  {modal.title}
                </h3>
                <p className="text-slate-500 font-medium text-[13px] leading-relaxed">
                  {modal.message}
                </p>
              </div>

              <div className="bg-slate-50 px-6 py-5 flex items-center justify-center gap-3 border-t border-slate-100">
                {modal.isAlertOnly ? (
                  <button
                    onClick={() => setModal({ ...modal, isOpen: false })}
                    className="w-full py-3 rounded-xl font-bold text-[13px] bg-slate-200 text-slate-700 hover:bg-slate-300 transition-colors"
                  >
                    Đã hiểu
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => setModal({ ...modal, isOpen: false })}
                      className="flex-1 py-3 rounded-xl font-bold text-[13px] bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors shadow-sm"
                    >
                      Hủy bỏ
                    </button>
                    {modal.type === "danger" && (
                      <button
                        onClick={modal.onConfirm}
                        className="flex-1 py-3 rounded-xl font-bold text-[13px] text-white bg-red-600 hover:bg-red-700 shadow-md transition-colors"
                      >
                        Xác nhận
                      </button>
                    )}
                    {modal.type === "warning" && (
                      <button
                        onClick={modal.onConfirm}
                        className="flex-1 py-3 rounded-xl font-bold text-[13px] text-white bg-amber-500 hover:bg-amber-600 shadow-md transition-colors"
                      >
                        Xác nhận
                      </button>
                    )}
                    {modal.type === "info" && (
                      <button
                        onClick={modal.onConfirm}
                        className="flex-1 py-3 rounded-xl font-bold text-[13px] text-white bg-[#002045] hover:bg-blue-900 shadow-md transition-colors"
                      >
                        Xác nhận
                      </button>
                    )}
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
