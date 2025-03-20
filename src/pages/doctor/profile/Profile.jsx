import { useContext, useEffect, useState } from "react";
import "./Profile.css";
import { AuthContext } from "../../../context/AuthContext";
import jwtDecode from "jwt-decode";
import api from "../../../services/api";
import { notification } from "antd";

const Profile = () => {
  const { token } = useContext(AuthContext);
  const [userInfo, setUserInfo] = useState(null);
  const [fullname, setFullname] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!token) return;

      try {
        // 🔹 Giải mã token để lấy userId
        const decoded = jwtDecode(token);
        const userId = decoded.Id;

        // 🔹 Gọi API lấy thông tin user
        const res = await api.get(`/User/get/${userId}`);
        setUserInfo(res.data);
        setFullname(res.data.fullname || "");
      } catch (error) {
        console.error("Lỗi khi lấy thông tin user:", error);
      }
    };

    fetchUserInfo();
  }, [token]);

  const handleUpdateFullname = async () => {
    if (!userInfo) return;

    try {
      const formData = new FormData();
      formData.append("Fullname", fullname);
      await api.put(`/User/update/${userInfo.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setUserInfo((prev) => ({ ...prev, fullname })); // Cập nhật UI ngay lập tức
      setIsEditing(false);
      notification.success({ message: "Cập nhật thành công" });
    } catch (error) {
      console.error("Lỗi khi cập nhật fullname:", error);
      notification.error({ message: "Cập nhật thất bại" });
    }
  };

  if (!userInfo) return <div className="loader"></div>;

  return (
    <div className="staff-profile-container">
      <div className="profile-card">
        <img
          src="https://mannatthemes.com/rizz/default/assets/images/users/avatar-1.jpg"
          alt="Avatar"
          className="profile-avatar"
        />
        <h2>{userInfo.username}</h2>
        <p>
          <strong>Email:</strong> {userInfo.email}
        </p>
        <p>
          <strong>Full Name:</strong>{" "}
          {isEditing ? (
            <input
              type="text"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              className="input-edit"
            />
          ) : (
            <span> {userInfo.fullname || "N/A"}</span>
          )}
        </p>
        <p>
          <strong>Role:</strong> {userInfo.role}
        </p>
        <p>
          <strong>Created At:</strong>{" "}
          {new Date(userInfo.createdAt).toLocaleDateString()}
        </p>

        {isEditing ? (
          <button onClick={handleUpdateFullname} className="btn-save">
            Lưu
          </button>
        ) : (
          <button onClick={() => setIsEditing(true)} className="btn-edit">
            Chỉnh sửa
          </button>
        )}
      </div>
    </div>
  );
};

export default Profile;
