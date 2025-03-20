import { useEffect, useState } from "react";
import "./Inject.css";
import { Card } from "antd";
import { FaRegCircleCheck } from "react-icons/fa6";
import api from "../../../services/api";

const Inject = ({ record }) => {
  const [status, setStatus] = useState("waiting");
  const [details, setDetails] = useState(null);
  const [doctorName, setDoctorName] = useState("Chưa cập nhật");
  const [roomNumber, setRoomNumber] = useState("Chưa có thông tin");

  useEffect(() => {
    if (!record?.id) return; // Kiểm tra nếu record chưa có id thì không fetch

    const fetchAppointmentDetails = async () => {
      try {
        const response = await api.get(`/Appointment/get-by-id/${record.id}`);
        const appointmentData = response.data;
        setDetails(appointmentData);

        // Cập nhật trạng thái dựa trên processStep
        if (appointmentData.processStep === "Waiting Inject") {
          setStatus("waiting");
        } else if (appointmentData.processStep === "Injected") {
          setStatus("done");
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin tiêm chủng:", error);
      }
    };

    fetchAppointmentDetails();
  }, [record]);

  // Fetch danh sách User để lấy tên bác sĩ
  useEffect(() => {
    if (!details?.doctorId) return;

    const fetchDoctorName = async () => {
      try {
        const response = await api.get(`/User/get-all?PageSize=50`);
        // Kiểm tra xem response.data có phải là mảng không
        const users = response.data?.$values;
        const doctor = users.find(
          (user) =>
            String(user.id) === String(details?.doctorId) &&
            user.role === "doctor"
        );

        if (doctor) setDoctorName(doctor.fullname);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách bác sĩ:", error);
      }
    };

    fetchDoctorName();
  }, [details?.doctorId]);

  useEffect(() => {
    if (!details?.roomId) return;

    const fetchRoomNumber = async () => {
      try {
        const response = await api.get(`/Room/get-all`);

        // Lấy danh sách phòng từ response
        const rooms = response.data?.$values;
        if (!Array.isArray(rooms)) {
          console.error("Dữ liệu phòng không hợp lệ:", response.data);
          return;
        }

        // Tìm phòng theo roomId
        const room = rooms.find((r) => r.id === details.roomId);
        setRoomNumber(room ? room.roomNumber : "Không tìm thấy phòng");
      } catch (error) {
        console.error("Lỗi khi lấy danh sách phòng:", error);
      }
    };

    fetchRoomNumber();
  }, [details?.roomId]);

  return (
    <div className="inject-wait-container">
      <Card className="inject-wait-card">
        <h2>Trạng thái Tiêm Chủng</h2>
        <ul>
          <li>
            <strong>Tên bé:</strong> {details?.childFullName}
          </li>
          <li>
            <strong>Bác sĩ:</strong> {doctorName}
          </li>
          <li>
            <strong>Phòng:</strong> {roomNumber}
          </li>
          {/* <li>
            <strong>Thời gian dự kiến:</strong> {details?.dateInjection
              ? new Date(details.dateInjection).toLocaleTimeString()
              : "Đang tải..."}
          </li> */}
          <li>
            <strong>Thời gian theo dõi:</strong> 30 phút sau tiêm
          </li>
          <li>
            <strong>Ghi chú:</strong> {details?.injectionNote || "N/A"}
          </li>
        </ul>

        <div className="inject-status">
          {status === "waiting" && (
            <div className="wait-status">
              <div className="custom-loader blue"></div>
              <p>Chờ tiêm...</p>
            </div>
          )}

          {status === "done" && (
            <div className="completed-status">
              <FaRegCircleCheck className="completed-icon" />
              <p>Tiêm xong!</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Inject;
