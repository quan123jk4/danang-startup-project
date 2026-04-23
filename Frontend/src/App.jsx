import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// IMPORT CÁC TRANG CỦA ÔNG VÀO ĐÂY
// (Đảm bảo đường dẫn này đúng với cấu trúc thư mục của ông)
import Home from "./screens/user/Home";
import Login from "./screens/auth/Login";
import Register from "./screens/auth/Register";
import ProfilePage from "./screens/user/ProfilePage";
import CheckinPage from "./screens/user/CheckinPage";
import AiSuggestPage from "./screens/user/AiSuggestPage";
import VoucherPage from "./screens/user/VoucherPage";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/check-in" element={<CheckinPage />} />
        <Route path="/ai-suggest" element={<AiSuggestPage />} />
        <Route path="/voucher" element={<VoucherPage />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/home" element={<Navigate to="/" replace />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
