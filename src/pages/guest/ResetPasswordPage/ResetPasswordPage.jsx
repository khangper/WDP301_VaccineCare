import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../../services/api"; // Shared API instance
import "./ResetPasswordPage.css"; // Create and style this file
import "bootstrap/dist/css/bootstrap.min.css";

function ResetPasswordPage() {
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (newPassword !== confirmPassword) {
      setError("Mật khẩu không khớp, vui lòng kiểm tra lại.");
      return;
    }

    try {
      console.log("Reset password request with token:", token);
      const response = await api.post(
        `/User/reset-password?token=${encodeURIComponent(token)}&newPassword=${encodeURIComponent(newPassword)}&confirmPassword=${encodeURIComponent(confirmPassword)}`
      );
      console.log("Response from API:", response.data);
      setMessage("Đổi mật khẩu thành công. Vui lòng đăng nhập với mật khẩu mới.");
      // Redirect to login page after a short delay
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error("Error in reset password:", err);
      setError(err.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại sau.");
    }
  };

  return (
    <div className="ResetPassword-container d-flex align-items-center justify-content-center">
      <div className="ResetPassword-form p-4 border rounded">
        <h2 className="mb-4">Đặt lại mật khẩu</h2>
        <form onSubmit={handleResetPassword}>
          <div className="form-group">
            <label htmlFor="token">Token:</label>
            <input
              type="text"
              name="token"
              id="token"
              className="form-control"
              placeholder="Nhập token từ email"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
            />
          </div>
          <div className="form-group mt-3">
            <label htmlFor="newPassword">Mật khẩu mới:</label>
            <input
              type="password"
              name="newPassword"
              id="newPassword"
              className="form-control"
              placeholder="Nhập mật khẩu mới"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group mt-3">
            <label htmlFor="confirmPassword">Xác nhận mật khẩu:</label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              className="form-control"
              placeholder="Xác nhận mật khẩu"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn refogotpassPage-bnt mt-4">
            Đặt lại mật khẩu
          </button>
        </form>
        {message && <p className="text-success mt-3">{message}</p>}
        {error && <p className="text-danger mt-3">{error}</p>}
        <p className="mt-3">
          <Link to="/login">Quay lại đăng nhập</Link>
        </p>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
