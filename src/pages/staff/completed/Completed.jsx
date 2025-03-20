import { Card, Input, notification } from "antd";
import "./Completed.css";
import { useState, useEffect, useContext } from "react";
import { FaRegCircleCheck } from "react-icons/fa6";
import jwtDecode from "jwt-decode";
import { AuthContext } from "../../../context/AuthContext";
import api from "../../../services/api";

const Completed = ({ record }) => {
  const [showTick, setShowTick] = useState(false);
  const { token } = useContext(AuthContext);
  const [userRole, setUserRole] = useState(null);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);

        const user =
          decoded[
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
          ];
        setUserRole(user); // Lấy role từ token
      } catch (error) {
        console.error("Lỗi khi giải mã token:", error);
      }
    }
  }, [token]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTick(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleSaveNote = async () => {
    if (!record?.id) {
      notification.error({
        message: "Lỗi",
        description: "Không tìm thấy ID cuộc hẹn!",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await api.put(
        `/Appointment/update-injection-note?appointmentId=${record.id}`,
        { injectionNote: note },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        notification.success({
          message: "Thành công",
          description: "Ghi chú đã được cập nhật!",
        });
      } else {
        notification.error({
          message: "Lỗi",
          description: "Cập nhật ghi chú thất bại!",
        });
      }
    } catch (error) {
      console.error("Lỗi API:", error);
      notification.error({
        message: "Lỗi",
        description: "Lỗi khi gọi API!",
      });
    }
    setLoading(false);
  };

  return (
    <div className="completed">
      <Card className="completed_card">
        <div className={`completed_icon_container ${showTick ? "show" : ""}`}>
          <FaRegCircleCheck className="completed_icon" />
        </div>
        <h2>Hoàn thành!</h2>
        <p>Quy trình đã được xử lý thành công.</p>

        {/* Chỉ hiển thị ghi chú nếu role là doctor */}
        {userRole === "doctor" && (
          <div className="note_section">
            <h3>Ghi chú:</h3>
            <Input.TextArea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Nhập ghi chú tại đây..."
              rows={4}
            />
            <button className="note-btn" type="submit" onClick={handleSaveNote}>
              Lưu ghi chú
            </button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Completed;
