import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { confirmPasswordReset } from "firebase/auth";
import { auth } from "../../../firebase/config";
import "./ResetPassword.css";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  // ✅ Lấy oobCode từ URL bằng searchParams
  const oobCode = searchParams.get("oobCode");

  const handleReset = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("❌ Mật khẩu không khớp!");
      return;
    }
    try {
      await confirmPasswordReset(auth, oobCode, password);
      setMessage(
        "✅ Đặt lại mật khẩu thành công! Đang chuyển về trang đăng nhập..."
      );
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setMessage("⚠️ Lỗi: " + error.message);
    }
  };

  return (
    <div className="resetps">
      <div className="reset-container">
        <h2>Đặt lại mật khẩu</h2>
        <form onSubmit={handleReset}>
          <div>
            <label>Mật khẩu mới</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Xác nhận mật khẩu</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Đặt lại</button>
        </form>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default ResetPassword;
