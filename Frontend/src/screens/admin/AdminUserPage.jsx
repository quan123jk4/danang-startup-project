import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

// IMPORT 2 COMPONENT DÙNG CHUNG
import Sidebar from "../../components/admin/Sidebar";
import Header from "../../components/admin/Header";

export default function AdminUserPage() {
  const { user } = useAuth();

  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // === STATE CHO CUSTOM MODAL CHUYÊN NGHIỆP ===
  const [modal, setModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "danger", // 'danger' | 'info' | 'warning'
    isAlertOnly: false, // Nếu true thì chỉ hiện 1 nút "Đã hiểu" (dùng thay alert)
    onConfirm: null,
  });

  // --- API BASE URL ---
  const API_BASE_URL = "http://localhost:5000/api/v1/users";

  // 1. Fetch Danh sách User
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

  // 2. Kích hoạt Modal Thay đổi Quyền
  const handleRoleChangeClick = (userId, newRole, currentRole) => {
    if (userId === user.id || userId === user._id) {
      setModal({
        isOpen: true,
        title: "Thao tác không hợp lệ",
        message: "Bạn không thể tự thay đổi quyền của chính mình!",
        type: "warning",
        isAlertOnly: true,
      });
      return;
    }

    setModal({
      isOpen: true,
      title: "Xác nhận cấp quyền",
      message: `Bạn có chắc chắn muốn cấp quyền [${newRole}] cho tài khoản này không? Hệ thống sẽ cập nhật ngay lập tức.`,
      type: "info",
      isAlertOnly: false,
      onConfirm: () => executeRoleChange(userId, newRole),
    });
  };

  // 2.1 Thực thi Đổi quyền (Sau khi bấm OK ở Modal)
  const executeRoleChange = async (userId, newRole) => {
    setModal({ ...modal, isOpen: false }); // Đóng modal
    try {
      const token = localStorage.getItem("token");
      const res = await axios.patch(
        `${API_BASE_URL}/${userId}/role`,
        { role: newRole },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (res.data.success) {
        setUsers(
          users.map((u) => (u._id === userId ? { ...u, role: newRole } : u)),
        );
      }
    } catch (err) {
      setModal({
        isOpen: true,
        title: "Lỗi hệ thống",
        message: err.response?.data?.message || "Đã xảy ra lỗi khi đổi quyền!",
        type: "danger",
        isAlertOnly: true,
      });
    }
  };

  // 3. Kích hoạt Modal Xóa Tài Khoản
  const handleDeleteUserClick = (userId) => {
    if (userId === user.id || userId === user._id) {
      setModal({
        isOpen: true,
        title: "Thao tác không hợp lệ",
        message: "Bạn không thể tự xóa tài khoản của chính mình!",
        type: "warning",
        isAlertOnly: true,
      });
      return;
    }

    setModal({
      isOpen: true,
      title: "Xóa tài khoản vĩnh viễn",
      message:
        "Hành động này không thể hoàn tác! Toàn bộ dữ liệu Check-in và Review liên quan đến tài khoản này có thể bị ảnh hưởng. Bạn vẫn muốn tiếp tục?",
      type: "danger",
      isAlertOnly: false,
      onConfirm: () => executeDeleteUser(userId),
    });
  };

  // 3.1 Thực thi Xóa User (Sau khi bấm Xóa ở Modal)
  const executeDeleteUser = async (userId) => {
    setModal({ ...modal, isOpen: false }); // Đóng modal
    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(`${API_BASE_URL}/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setUsers(users.filter((u) => u._id !== userId));
      }
    } catch (err) {
      setModal({
        isOpen: true,
        title: "Lỗi hệ thống",
        message:
          err.response?.data?.message || "Đã xảy ra lỗi khi xóa tài khoản!",
        type: "danger",
        isAlertOnly: true,
      });
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-[#fcfdfe] font-sans text-slate-900">
      <Sidebar />

      <main className="ml-64 flex flex-col min-h-screen relative">
        <Header
          title="Quản Lý Người Dùng"
          subtitle="Theo dõi, phân quyền và quản lý cộng đồng Danasoul"
        />

        <div className="p-10 flex-1 space-y-8 max-w-7xl mx-auto w-full">
          <div className="flex flex-col md:flex-row justify-between items-center bg-white p-5 rounded-[20px] shadow-sm border border-slate-100 gap-4">
            <div className="relative w-full md:w-[400px]">
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

            <div className="flex items-center gap-3 bg-slate-50 px-5 py-3 rounded-xl border border-slate-100">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-sm font-bold text-slate-500">
                Tổng số:{" "}
                <span className="text-[#002045] text-lg font-black ml-1">
                  {filteredUsers.length}
                </span>
              </span>
            </div>
          </div>

          {/* BẢNG DỮ LIỆU USER */}
          <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto min-h-[400px]">
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
                      <th className="px-8 py-5">Thành tích</th>
                      <th className="px-8 py-5">Vai trò (Role)</th>
                      <th className="px-8 py-5 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredUsers.length === 0 ? (
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
                            Không tìm thấy người dùng nào.
                          </p>
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((u) => (
                        <tr
                          key={u._id}
                          className="hover:bg-[#fcfdfe] transition-colors group"
                        >
                          {/* CỘT 1: AVATAR + TÊN + EMAIL */}
                          <td className="px-8 py-5">
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
                                <span className="font-extrabold text-slate-800 text-[15px]">
                                  {u.fullName || "Khách Ẩn Danh"}
                                </span>
                                <span className="text-xs font-medium text-slate-400 mt-0.5">
                                  {u.email}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* CỘT 2: ĐIỂM SỐ */}
                          <td className="px-8 py-5">
                            <div className="inline-flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100/50">
                              <svg
                                className="w-4 h-4 text-amber-500"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <span className="font-bold text-amber-600 text-xs">
                                {u.points || 0} Điểm
                              </span>
                            </div>
                          </td>

                          {/* CỘT 3: SELECT ĐỔI ROLE (Bây giờ nó gọi Modal thay vì đổi liền) */}
                          <td className="px-8 py-5">
                            <select
                              value={u.role?.toUpperCase() || "TOURIST"}
                              onChange={(e) =>
                                handleRoleChangeClick(
                                  u._id,
                                  e.target.value,
                                  u.role,
                                )
                              }
                              className={`text-[11px] font-black tracking-widest uppercase rounded-[10px] px-4 py-2 outline-none cursor-pointer transition-all shadow-sm ${
                                u.role?.toUpperCase() === "ADMIN"
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

                          {/* CỘT 4: NÚT XÓA */}
                          <td className="px-8 py-5 text-right">
                            <button
                              onClick={() => handleDeleteUserClick(u._id)}
                              className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-400 hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all shadow-sm"
                              title="Xóa tài khoản"
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
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
        {modal.isOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            {/* ĐÃ ÉP CỨNG CHIỀU RỘNG Ở ĐÂY: w-[90%] max-w-[400px] */}
            <div className="bg-white rounded-[24px] shadow-2xl w-[90%] max-w-[400px] overflow-hidden flex flex-col transform transition-all">
              <div className="p-8 flex flex-col items-center text-center">
                {/* Icon theo trạng thái */}
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center mb-5 
                  ${
                    modal.type === "danger"
                      ? "bg-red-50 text-red-500"
                      : modal.type === "warning"
                        ? "bg-amber-50 text-amber-500"
                        : "bg-blue-50 text-[#002045]"
                  }`}
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

              {/* Nút hành động */}
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
                      className="flex-1 py-3 rounded-xl font-bold text-[13px] bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors shadow-sm"
                    >
                      Hủy bỏ
                    </button>
                    <button
                      onClick={modal.onConfirm}
                      className={
                        "flex-1 py-3 rounded-xl font-bold text-[13px] text-white shadow-md transition-colors " +
                        (modal.type === "danger"
                          ? "bg-red-600 hover:bg-red-700"
                          : modal.type === "warning"
                            ? "bg-amber-500 hover:bg-amber-600"
                            : "bg-blue-900 hover:bg-blue-950")
                      }
                      style={
                        modal.type === "info"
                          ? { backgroundColor: "#002045" }
                          : {}
                      }
                    >
                      Xác nhận
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
