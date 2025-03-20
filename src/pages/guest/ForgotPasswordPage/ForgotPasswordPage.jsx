import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../../services/api"; // Shared API instance
import "./ForgotPasswordPage.css"; // Style it up your way
import "bootstrap/dist/css/bootstrap.min.css";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError("");

    try {
      console.log("Sending forgot password request for email:", email);
      const response = await api.post(
        `/User/forgot-password?email=${encodeURIComponent(email)}`
      );
      console.log("Response from API:", response.data);
      // After successfully sending the request, navigate to repassword page.
      navigate("/repassword");
    } catch (err) {
      console.error("Error in forgot password:", err);
      setError(err.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại sau.");
    }
  };

  return (
    <div className="ForgotPassword-container d-flex align-items-center justify-content-center">
      <div className="ForgotPassword-form p-4 border rounded">
        <h2 className="mb-4">Quên mật khẩu</h2>
        <form onSubmit={handleForgotPassword}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              name="email"
              id="email"
              className="form-control"
              placeholder="Nhập email của bạn"
              value={email}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn fogotpassPage-bnt mt-3">
            Gửi yêu cầu
          </button>
        </form>
        {error && <p className="text-danger mt-3">{error}</p>}
        <p className="mt-3">
          <Link to="/login">Quay lại đăng nhập</Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
