import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import api from "../../../services/api";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function VaccinationScheduleStatus() {
  const { token } = useContext(AuthContext);
  const [singleAppointments, setSingleAppointments] = useState([]);
  const [packageAppointments, setPackageAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState("single");
  const [showModal, setShowModal] = useState(false);
  const [selectedInjection, setSelectedInjection] = useState(null);
  
const [editDate, setEditDate] = useState(null);
const [editingAppointmentId, setEditingAppointmentId] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, [token]);

  const fetchAppointments = async () => {
    try {
      const res = await api.get("/Appointment/customer-appointments", {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      const data = res.data;
      const formatDate = (date) =>
        new Date(date).toLocaleDateString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
  
      // Xử lý danh sách mũi lẻ
      const singles = data.singleVaccineAppointments.$values.map((appt) => ({
        id: appt.id,
        customer: appt.contactPhoneNumber, // Thay bằng tên nếu có
        phone: appt.contactPhoneNumber,
        vaccine: appt.vaccineName,
        date: formatDate(appt.dateInjection),
        status: appt.status,
        dateInjection: new Date(appt.dateInjection).getTime(),
      }));
  
      // Giữ nguyên danh sách gói tiêm (không gộp)
      const packages = data.packageVaccineAppointments.$values.map((pkg) => ({
        id: pkg.vaccinePackageName,
        customer: pkg.contactPhoneNumber,
        phone: pkg.contactPhoneNumber,
        injections: pkg.vaccineItems.map((dose) => ({
          id: dose.id,
          vaccine: `Mũi ${dose.doseSequence} - ${dose.vaccineName}`,
          date: formatDate(dose.dateInjection),
          status: dose.status,
          dateInjection: new Date(dose.dateInjection).getTime(),
        })),
      }));
  
      setSingleAppointments(singles.sort((a, b) => a.dateInjection - b.dateInjection));
      setPackageAppointments(packages);
    } catch (err) {
      console.error("Lỗi khi tải lịch:", err);
    }
  };
  

  const handleCancel = (ids, label) => {
    console.log("📤 Gửi yêu cầu hủy lịch:", {
      ids,
      label,
      endpoint: `/Appointment/cancel-appointment/${ids}`,
      method: "PUT",
    });

    setSelectedInjection({
      ids,
      label,
    });

    setShowModal(true);
  };

  const confirmCancel = async () => {
    try {
      for (const id of selectedInjection.ids) {
        await api.put(`/Appointment/cancel-appointment/${id}`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      console.log("✅ Kết quả hủy:", selectedInjection.ids);
      setShowModal(false);
      fetchAppointments();
    } catch (err) {
      console.error("❌ Lỗi khi hủy lịch:", err.response?.data || err.message);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Completed":
        return <span className="badge bg-success">✅ Hoàn tất</span>;
      case "Pending":
        return <span className="badge bg-primary">🔵 Chờ xử lý</span>;
      case "Processing":
        return <span className="badge bg-warning text-dark">🟡 Đang xử lý</span>;
      case "Canceled":
        return <span className="badge bg-danger">❌ Đã hủy</span>;
      default:
        return <span className="badge bg-secondary">{status}</span>;
    }
  };
  const handleReschedule = async () => {
    if (!editingAppointmentId) {
      alert("Không có lịch hẹn nào được chọn.");
      return;
    }
  
    if (!editDate) {
      alert("Vui lòng chọn ngày mới để cập nhật.");
      return;
    }
  
    try {
      const response = await api.put(
        "/Appointment/reschedule-package",
        {
          appointmentId: editingAppointmentId,
          newDate: new Date(editDate).toISOString(),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      if (response.status === 200) {
        fetchAppointments(); // reload data
        setEditDate(null); // reset lại
        setEditingAppointmentId(null);
      }
    } catch (err) {
      console.error("❌ Lỗi cập nhật lịch:", err);
      alert("Lỗi cập nhật lịch. Vui lòng thử lại!");
    }
  };
  
  
  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">📅 Lịch Tiêm Vaccine</h2>

      <ul className="nav nav-tabs">
        <li className="nav-item">
          <button className={`nav-link ${activeTab === "single" ? "active" : ""}`} onClick={() => setActiveTab("single")}>
            Mũi Lẻ
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === "package" ? "active" : ""}`} onClick={() => setActiveTab("package")}>
            Trọn Gói
          </button>
        </li>
      </ul>

      <div className="tab-content mt-3">
        {/* MŨI LẺ */}
        {activeTab === "single" && (
          <div>
            {singleAppointments.map((s) => (
              <div className="card mb-4 shadow" key={s.id}>
                <div className="card-body">
                  <h5 className="card-title">{s.customer}</h5>
                  <p><strong>Vắc xin:</strong> {s.vaccine}</p>
                  <p><strong>Ngày tiêm:</strong> {s.date}</p>
                  <p><strong>Trạng thái:</strong> {getStatusBadge(s.status)}</p>
                  {s.status !== "Canceled" && s.status !== "Completed" && (
                    <button className="btn btn-danger" onClick={() => handleCancel([s.id], s.vaccine)}>
                      ❌ Hủy
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TRỌN GÓI */}
        {activeTab === "package" && (
  <div>
    {packageAppointments.map((pkg, index) => (
      <div className="card mb-4 shadow" key={index}>
        <div className="card-body">
          <h5 className="card-title">📦 {pkg.packageName }</h5>
          <p><strong>SĐT:</strong> {pkg.phone}</p>
          <p><strong>Gói tiêm:</strong> {pkg.id}</p>
          <table className="table table-bordered mt-3">
            <thead className="table-dark">
              <tr>
                <th>Mũi tiêm</th>
                <th>Ngày tiêm</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
  {pkg.injections.map((inj, i) => (
    <tr key={inj.id}>
      <td>{inj.vaccine}</td>

      <td>
        {editingAppointmentId === inj.id ? (
          <DatePicker
          selected={editDate}
          onChange={(date) => setEditDate(date)}
          className="form-control"
          dateFormat="dd/MM/yyyy"
          minDate={new Date()} // optional: không cho chọn ngày quá khứ
          placeholderText="Chọn ngày mới"
        />
        
        ) : (
          inj.date
        )}
      </td>

      <td>{getStatusBadge(inj.status)}</td>

      <td>
        {/* Đổi lịch nếu mũi 1 đã Completed, và không phải mũi 1 */}
        {pkg.injections[0].status === "Completed" &&
          i !== 0 &&
          inj.status !== "Completed" &&
          inj.status !== "Canceled" && (
            editingAppointmentId === inj.id ? (
              <button className="btn btn-sm btn-success me-2" onClick={handleReschedule}>
                ✅ Xác nhận
              </button>
            ) : (
              <button
                className="btn btn-sm btn-primary me-2"
                onClick={() => {
                  setEditingAppointmentId(inj.id);
                  setEditDate(null);
                }}
              >
                ✏️ Đổi lịch
              </button>
            )
          )}

        {/* Nút Hủy */}
        {inj.status !== "Canceled" && inj.status !== "Completed" && (
          <button
            className="btn btn-danger btn-sm"
            onClick={() => handleCancel([inj.id], `Mũi ${inj.vaccine} trong ${pkg.id}`)}
          >
            ❌ Hủy mũi này
          </button>
        )}
      </td>
    </tr>
  ))}
</tbody>

          </table>
          <button className="btn btn-danger mt-2"
            onClick={() => handleCancel(pkg.injections.map((i) => i.id), `Gói tiêm ${pkg.id}`)}>
            ❌ Hủy toàn bộ gói
          </button>
        </div>
      </div>
    ))}
  </div>
)}

      </div>

      {/* MODAL XÁC NHẬN HỦY */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận hủy lịch</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Bạn có chắc chắn muốn hủy <strong>{selectedInjection?.label}</strong> không?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Đóng</Button>
          <Button variant="danger" onClick={confirmCancel}>Xác nhận hủy</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default VaccinationScheduleStatus;
