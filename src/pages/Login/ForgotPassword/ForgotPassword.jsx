// src/pages/ForgotPassword/ForgotPassword.jsx
import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../../firebase/config";
// import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css"
export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

 const handleReset = async (e) => {
  e.preventDefault();
  if (!email) return alert("Nhập email nha!");

  try {
    setLoading(true);
    await sendPasswordResetEmail(auth, email);
    alert("✉️ Đã gửi email đặt lại mật khẩu! Hãy kiểm tra hộp thư (cả Spam).");
    // ❌ KHÔNG navigate luôn
    // ✅ Chỉ thông báo thôi, user phải vào mail bấm link
  } catch (err) {
    let msg = "Gửi email thất bại 😿";
    if (err.code === "auth/user-not-found") msg = "Email chưa có tài khoản.";
    if (err.code === "auth/invalid-email") msg = "Email không hợp lệ.";
    alert(msg);
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="forgotps">
    <form onSubmit={handleReset} className="forgot__form">
      <h2>ĐẶT LẠI MẬT KHẨU</h2>
      <input
        type="email"
        placeholder="Nhập email đã đăng ký"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? "Đang gửi..." : "Gửi email đặt lại"}
      </button>
      <p><a href="/login">Quay lại đăng nhập</a></p>
    </form>
    </div>
  );
}
