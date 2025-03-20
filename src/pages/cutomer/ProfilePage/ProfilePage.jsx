import React, { useEffect, useState, useContext } from "react";
import api from "../../../services/api";
import { AuthContext } from "../../../context/AuthContext";
import jwtDecode from "jwt-decode";

function ProfilePage() {
  const { token } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [errorDetails, setErrorDetails] = useState(null);

  useEffect(() => {
    if (!token) {
      setError("Bạn chưa đăng nhập!");
      return;
    }

    let userId;
    try {
      const decoded = jwtDecode(token);
      userId = decoded.Id; 
      console.log("User ID from token:", userId);
    } catch (err) {
      console.error("❌ Lỗi giải mã token:", err);
      setError("Token không hợp lệ!");
      setErrorDetails(err.message);
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await api.get(`/User/get/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("✅ Dữ liệu người dùng:", response.data);
        setUser(response.data);
      } catch (err) {
        console.error("❌ Lỗi lấy thông tin người dùng:", err);
        setError("Không thể lấy thông tin cá nhân!");
        setErrorDetails(err.response ? err.response.data : err.message);
      }
    };

    fetchUser();
  }, [token]);

  if (error) {
    return (
      <div className="alert alert-danger">
        <p>{error}</p>
        {errorDetails && <pre>{JSON.stringify(errorDetails, null, 2)}</pre>}
      </div>
    );
  }

  if (!user) {
    return <div>Đang tải dữ liệu...</div>;
  }

  return (
    <div className="container mt-5">
      <h2>Thông tin cá nhân</h2>
      <p><strong>ID:</strong> {user.id}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Role:</strong> {user.role}</p>
      <p><strong>Created At:</strong> {new Date(user.createdAt).toLocaleString()}</p>
      <p><strong>Updated At:</strong> {new Date(user.updatedAt).toLocaleString()}</p>
    </div>
  );
}

export default ProfilePage;
