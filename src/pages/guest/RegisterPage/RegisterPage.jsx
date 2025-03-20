import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api"; // Import API dùng chung
import "./RegisterPage.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Phone from "../../../assets/Login/Tabpanel.png";

function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Hàm đăng ký người dùng nằm trực tiếp trong trang RegisterPage.js
  const registerUser = async (userData) => {
    try {
      const response = await api.post("/User/registration", userData);
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message || "Đăng ký thất bại, thử lại!");
      } else {
        throw new Error("Lỗi kết nối, vui lòng thử lại!");
      }
    }
  };

  const handleRegister = async () => {
    setError(null);
    try {
      await registerUser(formData);
      navigate("/successregis");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="HomePage-Allcontainer">
      <div className="HomePage-main-container">
        <div className="flex-column-eb"></div>
        <div className="container mt-5">
          <div className="row mt-152">
            <div className="col-6">
              <div className="Regis-from">
                <div className="Regis-title">Đăng ký ở đây:</div>
                <div className="Regis-input">
                  <div className="Regis-info">Tên:</div>
                  <input
                    type="text"
                    name="username"
                    className="Regis-single-input"
                    placeholder="Nhập tên"
                    value={formData.username}
                    onChange={handleChange}
                  />
                </div>
                <div className="Regis-input">
                  <div className="Regis-info">Email:</div>
                  <input
                    type="email"
                    name="email"
                    className="Regis-single-input"
                    placeholder="Nhập email của bạn"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="Regis-input">
                  <div className="Regis-info">Nhập mật khẩu:</div>
                  <input
                    type="password"
                    name="password"
                    className="Regis-single-input"
                    placeholder="Nhập mật khẩu"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
                <div className="Regis-input">
                  <div className="Regis-info">Nhập lại mật khẩu:</div>
                  <input
                    type="password"
                    name="confirmPassword"
                    className="Regis-single-input"
                    placeholder="Nhập lại mật khẩu"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
                <div className="Regis-input">
                  <button className="Regis-button mt-4" onClick={handleRegister}>
                    Gửi
                  </button>
                </div>
                {error && <p className="Regis-error text-danger">{error}</p>}
              </div>
            </div>

            <div className="col-6 Regis-kkk">
              <div className="Regis-introContainer">
                <img src={Phone} className="Regis-icon" alt="intro" />
                <div className="Regis-intro">
                  "Chào mừng bạn đến với hệ thống tiêm chủng! Hãy đăng nhập để
                  theo dõi lịch tiêm chủng và bảo vệ sức khỏe của con yêu."
                </div>
                <div className="Regis-intro-khangdoan">-Khang Đoàn-</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
