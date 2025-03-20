import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import api from "../../../services/api"; 
import "bootstrap/dist/css/bootstrap.min.css";

function DetailAppointment() {
    const { id } = useParams();
    const { token } = useContext(AuthContext);
    const [appointment, setAppointment] = useState(null);
  
    useEffect(() => {
      if (token) {
        api
          .get(`/Appointment/get-by-id/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((response) => setAppointment(response.data))
          .catch((error) => console.error("Lỗi khi tải chi tiết lịch tiêm:", error));
      }
    }, [id, token]);
  
    if (!appointment) {
      return <div className="text-center mt-5">⏳ Đang tải dữ liệu...</div>;
    }
  
    // Hàm xử lý màu sắc trạng thái
    const getStatusBadge = (status) => {
      switch (status) {
        case "Confirmed":
          return <span className="badge bg-success">✅ Đã tiêm</span>;
        case "Pending":
          return <span className="badge bg-primary">🔵 Chờ xữ lí</span>;
        case "Booked":
          return <span className="badge bg-warning text-dark">🟡 Đặt lịch</span>;
        default:
          return <span className="badge bg-secondary">{status}</span>;
      }
    };
  
    return (
      <div className="container mt-5">
        <div className="card shadow p-4">
          <h2 className="mb-4 text-center">📄 Chi Tiết Lịch Tiêm</h2>
          <p><strong>Họ và tên bé:</strong> {appointment.childFullName}</p>
          <p><strong>Số điện thoại phụ huynh:</strong> {appointment.parentPhoneNumber}</p>
          <p><strong>Loại vaccine:</strong> {appointment.vaccineType === "Single" ? "Mũi lẻ" : "Trọn gói"}</p>
          <p><strong>Vắc xin:</strong> {appointment.vaccineName}</p>
          <p><strong>Ngày tiêm:</strong> {appointment.dateInjection.split("T")[0]}</p>
          <p><strong>Trạng thái:</strong> {getStatusBadge(appointment.status)}</p>
          <p><strong>Bác sĩ phụ trách:</strong> {appointment.doctorId ? appointment.doctorId : "Chưa có thông tin"}</p>
          <p><strong>Phòng tiêm:</strong> {appointment.roomId ? appointment.roomId : "Chưa có thông tin"}</p>
        </div>
      </div>
    );
  }
  
  export default DetailAppointment;
