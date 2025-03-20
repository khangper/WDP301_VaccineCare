// export default VaccinationScheduleStatus;
import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import api from "../../../services/api";
import "bootstrap/dist/css/bootstrap.min.css";

function VaccinationScheduleStatus() {
  const { token } = useContext(AuthContext);
  const [singleAppointments, setSingleAppointments] = useState([]);
  const [packageAppointments, setPackageAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState("single");
  
  useEffect(() => {
    if (token) {
      api
        .get("/Appointment/customer-appointments", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          const data = response.data;
          console.log("data tra ve:", data)
          const singleAppointments = data.singleVaccineAppointments.$values.map((appt) => ({
            id: appt.id,
            customer: appt.childFullName,
            phone: appt.contactPhoneNumber,
            type: "Mũi lẻ",
            vaccine: appt.vaccineName,
            date: appt.dateInjection.split("T")[0],
            status: appt.status,
            createdAt: new Date(appt.dateInjection).getTime(),
          }));

          // const packageAppointments = data.packageVaccineAppointments.$values.map((pkg) => ({
          //   id: pkg.vaccinePackageId,
          //   customer: pkg.childFullName,
          //   phone: pkg.contactPhoneNumber,
          //   type: "Trọn gói",
          //   package: pkg.vaccinePackageName,
          //   createdAt: new Date(pkg.vaccineItems.$values[0].dateInjection).getTime(),
          //   injections: pkg.vaccineItems.$values.map((dose) => ({
          //     vaccine: `Mũi ${dose.doseSequence} - ${dose.vaccineName}`,
          //     date: dose.dateInjection.split("T")[0],
          //     status: dose.status,
          //   })),
          // }));
          const packageAppointments = data.packageVaccineAppointments.$values.map((pkg) => ({
            id: pkg.vaccinePackageId, 
            customer: pkg.childFullName,
            phone: pkg.contactPhoneNumber,
            type: "Trọn gói",
            package: pkg.vaccinePackageName,
            createdAt: pkg.vaccineItems.length > 0 
              ? new Date(pkg.vaccineItems[0].dateInjection).getTime() 
              : new Date().getTime(),
            injections: pkg.vaccineItems.map((dose) => ({
              vaccine: `Mũi ${dose.doseSequence} - ${dose.vaccineName}`,
              date: dose.dateInjection ? dose.dateInjection.split("T")[0] : "Không xác định",
              status: dose.status,
            })),
          }));
          
          setSingleAppointments([...singleAppointments].sort((a, b) => b.createdAt - a.createdAt));
          setPackageAppointments([...packageAppointments].sort((a, b) => b.createdAt - a.createdAt));
          if(singleAppointments){
            console.log("co single")
          }
          if(packageAppointments){
            console.log("co package")
          }
        })
        .catch((error) => console.error("Lỗi khi tải lịch tiêm:", error));
    }
  }, [token]);

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
        {activeTab === "single" && (
          <div>
            {singleAppointments.length > 0 ? (
              singleAppointments.map((schedule) => (
                <div className="card mb-4 shadow" key={schedule.id}>
                  <div className="card-body">
                    <h5 className="card-title">{schedule.customer}</h5>
                    <p><strong>SĐT:</strong> {schedule.phone}</p>
                    <p><strong>Vắc xin:</strong> {schedule.vaccine}</p>
                    <p><strong>Ngày tiêm:</strong> {schedule.date}</p>
                    <p><strong>Trạng thái:</strong> {getStatusBadge(schedule.status)}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center">Không có lịch tiêm mũi lẻ nào.</p>
            )}
          </div>
        )}

        {activeTab === "package" && (
          <div>
            {packageAppointments.length > 0 ? (
              packageAppointments.map((schedule) => (
                <div className="card mb-4 shadow" key={schedule.id}>
                  <div className="card-body">
                    <h5 className="card-title">{schedule.customer}</h5>
                    <p><strong>SĐT:</strong> {schedule.phone}</p>
                    <p><strong>Gói tiêm:</strong> {schedule.package}</p>
                    <table className="table table-bordered mt-3">
                      <thead className="table-dark">
                        <tr>
                          <th>Mũi tiêm</th>
                          <th>Ngày tiêm</th>
                          <th>Trạng thái</th>
                        </tr>
                      </thead>
                      <tbody>
                        {schedule.injections.map((inj, idx) => (
                          <tr key={idx}>
                            <td>{inj.vaccine}</td>
                            <td>{inj.date}</td>
                            <td>{getStatusBadge(inj.status)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center">Không có lịch tiêm trọn gói nào.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default VaccinationScheduleStatus;
