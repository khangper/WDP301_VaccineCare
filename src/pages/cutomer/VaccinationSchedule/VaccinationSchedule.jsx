import React, { useState, useEffect,useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./VaccinationSchedule.css";
import api from "../../../services/api";
const VaccinationSchedule = () => {
  const { id } = useParams();
  const [diseases, setDiseases] = useState([]);
  const [vaccinationRecords, setVaccinationRecords] = useState([]);
  const [vaccinationProfileId, setVaccinationProfileId] = useState(null);
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedVaccine, setSelectedVaccine] = useState("");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [vaccineList, setVaccineList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [selectedVaccineId, setSelectedVaccineId] = useState(null);

  const navigate = useNavigate();

  const [childData, setChildData] = useState(null);
  const [gender, setGender] = useState("");
  const [updateMessage, setUpdateMessage] = useState("");
  
  const headers = [" ", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];


  const [pendingAppointments, setPendingAppointments] = useState([]);


    
useEffect(() => {
  if (vaccinationProfileId) {
    api.get('/Appointment/get-all')
      .then(response => {
        const allAppointments = response.data.$values || response.data;
        const filtered = allAppointments.filter(
          (item) => item.childrenId === vaccinationProfileId && item.status === "Pending"
        );
        setPendingAppointments(filtered);
      })
      .catch(error => console.error("API fetch appointments error:", error));
  }
}, [vaccinationProfileId]);


// Lấy vaccinationProfileId theo childrenId
useEffect(() => {
  api.get(`/VaccinationProfile/get-all?FilterOn=childrenId&FilterQuery=${id}`)
    .then(response => {
      const profiles = response.data.$values || [];
      if (profiles.length > 0) {
        setVaccinationProfileId(profiles[0].id);
      }
    })
    .catch(error => console.error("Error fetching vaccination profile:", error));
}, [id]);

// Khi có vaccinationProfileId, lấy danh sách VaccinationDetail
useEffect(() => {
  if (vaccinationProfileId) {
    api.get(`/VaccinationDetail/get-all?FilterOn=vaccinationProfileId&FilterQuery=${vaccinationProfileId}&PageSize=100`)
      .then(response => {
        const records = response.data.$values || [];
        setVaccinationRecords(records);
      })
      .catch(error => console.error("Error fetching vaccination data:", error));
  }
}, [vaccinationProfileId]);

const handleBooking = () => {
  if (!selectedDisease || !selectedMonth) {
    setNotification({ message: "Vui lòng chọn một bệnh và tháng!", type: "error" });
    return;
  }

  let expectedDate = "";
  const vaccineInfo = highlightedVaccines[selectedMonth]?.find(v => v.diseaseId === selectedDisease.id);

  if (vaccineInfo?.expectedInjectionDate) {
    try {
      const dateObj = new Date(vaccineInfo.expectedInjectionDate);
      const year = dateObj.getFullYear();
      const month = dateObj.getMonth() + 1; // Tháng bắt đầu từ 0, nên +1
      const day = dateObj.getDate(); // Lấy ngày bình thường, không cần padStart
      
      expectedDate = `${year}-${month}-${day}`; // Format YYYY-M-D
    } catch (error) {
      console.error("Lỗi chuyển đổi ngày dự kiến:", error);
    }
  } else {
    console.warn("Không tìm thấy ngày dự kiến trong VaccineTemplate!");
  }

  console.log("Ngày dự kiến gửi qua BookingPage:", expectedDate);

  navigate(`/booking`, { 
    state: {
      childId: id, 
      diseaseId: selectedDisease.id,
      diseaseName: selectedDisease.name,
      expectedInjectionDate: expectedDate || "",
    },
  });
};




  useEffect(() => {
    api.get("/Disease/get-all?PageSize=30")
      .then(response => setDiseases(response.data.$values || response.data))
      .catch(error => console.error("API fetch error: ", error));
  }, []);

  useEffect(() => {
    api.get("/Vaccine/get-all")
      .then(response => setVaccineList(response.data.$values || response.data))
      .catch(error => console.error("API fetch error: ", error));
  }, []);
  
  useEffect(() => {
    if (selectedDisease?.name) {
      api.get(`/Vaccine/get-vaccines-by-diasease-name/${selectedDisease.name}`)
        .then(response => setVaccineList(response.data.$values || response.data))
        .catch(error => console.error("API fetch error: ", error));
    }
  }, [selectedDisease]);

  const handleCellClick = (disease, month) => {
    setSelectedDisease(disease);
    setSelectedMonth(month);
    
    const existingRecord = vaccinationRecords.find(
      record => record.diseaseId === disease.id && record.month === month
    );
  
    setSelectedRecord(existingRecord || null);
    setSelectedVaccineId(existingRecord ? existingRecord.vaccineId : null);  // <-- Đổi ở đây
    setShowModal(true);
  };
  
  const handleCreate = async () => {
    if (!selectedVaccineId || !selectedDisease || !selectedMonth || !vaccinationProfileId) return;
  
    const newRecord = {
      childrenId: id,
      diseaseId: selectedDisease.id,
      vaccineId: selectedVaccineId,
      month: selectedMonth,
    };
  
    console.log("🔹 Dữ liệu gửi đi (Tạo mới):", JSON.stringify(newRecord, null, 2));
  
    try {
      const response = await api.post(`/VaccinationDetail/create`, newRecord);
  
      if (response.status === 201) {
        console.log("✅ Phản hồi từ server (Tạo mới):", response.data);
        setNotification({ message: "Tạo mới thành công!", type: "success" });
      } else {
        console.warn("⚠️ Phản hồi không mong muốn từ server (Tạo mới):", response);
        setNotification({ message: "Tạo mới thất bại!", type: "error" });
      }
    } catch (error) {
      console.error("❌ Lỗi khi tạo bản ghi tiêm chủng:", error);
      setNotification({ message: "Có lỗi xảy ra khi tạo mới!", type: "error" });
    } finally {
      setTimeout(() => window.location.reload(), 500);
    }
  };
  
  const handleSave = async () => {
    if (!selectedVaccineId || !selectedDisease || !selectedMonth || !vaccinationProfileId) return;
  
    const existingRecord = vaccinationRecords.find(
      record => record.diseaseId === selectedDisease.id && record.month === selectedMonth
    );
  
    const vaccineTemplate = highlightedVaccines[selectedMonth]?.find(
      v => v.diseaseId === selectedDisease.id
    );
  
    if (existingRecord && vaccineTemplate && vaccineTemplate.notes && vaccineTemplate.expectedInjectionDate) {
      const updateRecord = {
        vaccineId: selectedVaccineId,
        month: selectedMonth,
      };
  
      console.log("🔹 Dữ liệu gửi đi (Cập nhật):", JSON.stringify(updateRecord, null, 2));
  
      try {
        const response = await api.put(`/VaccinationDetail/update/${existingRecord.id}`, updateRecord);
  
        if (response.status === 200 || response.status === 204) {
          console.log("✅ Phản hồi từ server (Cập nhật):", response.data);
          setNotification({ message: "Cập nhật thành công!", type: "success" });
          setVaccinationRecords(prev =>
            prev.map(record =>
              record.id === existingRecord.id ? { ...record, vaccineId: selectedVaccineId, month: selectedMonth } : record
            )
          );
        } else {
          console.warn("⚠️ Phản hồi không mong muốn từ server (Cập nhật):", response);
          setNotification({ message: "Cập nhật thất bại!", type: "error" });
        }
      } catch (error) {
        console.error("❌ Lỗi khi cập nhật tiêm chủng:", error);
        setNotification({ message: "Có lỗi xảy ra khi cập nhật!", type: "error" });
      } finally {
        setTimeout(() => window.location.reload(), 500);
      }
    } else {
      console.log("🆕 Không tìm thấy dữ liệu từ VaccineTemplate hoặc bản ghi không tồn tại => Tạo mới!");
      handleCreate();
    }
  };
  const handleDelete = async (recordId) => {
    try {
      const response = await api.delete(`/VaccinationDetail/delete/${recordId}`);
  
      if (response.status === 200 || response.status === 204) {
        setNotification({ message: "Xóa thành công!", type: "success" });
        window.location.reload(); // Reload lại trang sau khi xóa thành công
      } else {
        setNotification({ message: "Xóa thất bại!", type: "error" });
      }
    } catch (error) {
      console.error("Error deleting vaccination record:", error);
      setNotification({ message: "Có lỗi xảy ra!", type: "error" });
    }
  };
  const Notification = ({ notification }) => {
    if (!notification.message) return null;
  
    const notificationStyle = notification.type === "success"
      ? { backgroundColor: "green", color: "white" }
      : { backgroundColor: "red", color: "white" };
  
    return (
      <div style={{ position: "fixed", top: "20px", left: "50%", transform: "translateX(-50%)", padding: "10px 20px", borderRadius: "5px", ...notificationStyle }}>
        {notification.message}
      </div>
    );
  };
    
  // Vaccinetemplate
  
  
  
  const [highlightedVaccines, setHighlightedVaccines] = useState({});
  

  // useEffect(() => {
  //   if (vaccinationProfileId) {
  //     api.get(`/VaccineTemplate/get-by-profileid/${vaccinationProfileId}`)
  //       .then(response => {
  //         const vaccineData = response.data.$values || response.data;
  //         const highlightMap = {};
  //         vaccineData.forEach(vaccine => {
  //           if (!highlightMap[vaccine.month]) {
  //             highlightMap[vaccine.month] = [];
  //           }
  //           highlightMap[vaccine.month].push({
  //             diseaseId: vaccine.diseaseId,
  //             notes: vaccine.notes,
  //             expectedInjectionDate: vaccine.expectedInjectionDate 
  //           });
  //         });
  
  //         setHighlightedVaccines(highlightMap);
  //       })
  //       .catch(error => console.error("API fetch error: ", error));
  //   }
  // }, [vaccinationProfileId]);
  
  const [vaccineToDiseaseMap, setVaccineToDiseaseMap] = useState({});

  
  useEffect(() => {
    if (vaccinationProfileId) {
      api.get(`/VaccineTemplate/get-by-profileid/${vaccinationProfileId}`)
        .then(response => {
          const vaccineData = response.data.$values || response.data;
  
          const highlightMap = {};
          const vaccineMap = {};
  
          vaccineData.forEach(vaccine => {
            // Highlight map (month → vaccine info)
            if (!highlightMap[vaccine.month]) {
              highlightMap[vaccine.month] = [];
            }
            highlightMap[vaccine.month].push({
              diseaseId: vaccine.diseaseId,
              notes: vaccine.notes,
              expectedInjectionDate: vaccine.expectedInjectionDate 
            });
  
            // Vaccine-to-disease map (vaccineId → diseaseIds)
            if (!vaccineMap[vaccine.vaccineId]) {
              vaccineMap[vaccine.vaccineId] = [];
            }
            if (!vaccineMap[vaccine.vaccineId].includes(vaccine.diseaseId)) {
              vaccineMap[vaccine.vaccineId].push(vaccine.diseaseId);
            }
          });
  
          setHighlightedVaccines(highlightMap);
          setVaccineToDiseaseMap(vaccineMap); // <--- NEW
        })
        .catch(error => console.error("API fetch error: ", error));
    }
  }, [vaccinationProfileId]);
  

  useEffect(() => {
    api.get("/Disease/get-all?PageSize=100")
      .then(response => {
        setDiseases(response.data.$values || response.data);
      })
      .catch(error => console.error("API fetch error: ", error));
  }, []);

  const months = Array.from({ length: 36 }, (_, i) => i + 1);
  
  // const pendingAppointmentCountByDisease = useMemo(() => {
  //   const map = {};
  
  //   pendingAppointments.forEach(appt => {
  //     let relatedDiseases = [];
  
  //     // Trường hợp có diseaseName
  //     if (appt.diseaseName && appt.diseaseName !== "N/A") {
  //       const disease = diseases.find(d => d.name === appt.diseaseName);
  //       if (disease) relatedDiseases.push(disease);
  //     }
  
  //     // Nếu không có diseaseName → dùng vaccineId để tìm diseaseId
  //     if (relatedDiseases.length === 0 && vaccineToDiseaseMap[appt.vaccineId]) {
  //       relatedDiseases = vaccineToDiseaseMap[appt.vaccineId]
  //         .map(id => diseases.find(d => d.id === id))
  //         .filter(Boolean);
  //     }
  
  //     relatedDiseases.forEach(disease => {
  //       map[disease.id] = (map[disease.id] || 0) + 1;
  //     });
  //   });
  
  //   return map;
  // }, [pendingAppointments, diseases, vaccineToDiseaseMap]);
  
  
  
  
  // Hồ sơ trẻ emem
 
  const pendingAppointmentCountByDisease = useMemo(() => {
    const map = {};
  
    pendingAppointments.forEach(appt => {
      let relatedDiseases = [];
  
      // ✅ Parse nhiều bệnh từ diseaseName (nếu có)
      if (appt.diseaseName && appt.diseaseName !== "N/A") {
        const diseaseNames = appt.diseaseName.split('-').map(name => name.trim());
      
        diseaseNames.forEach(name => {
          const disease = diseases.find(d =>
            d.name.trim().toLowerCase() === name.trim().toLowerCase()
          );
          if (disease) relatedDiseases.push(disease);
        });
      }
      
  
      // Fallback: dùng vaccineId → vaccineToDiseaseMap
      if (relatedDiseases.length === 0 && vaccineToDiseaseMap[appt.vaccineId]) {
        relatedDiseases = vaccineToDiseaseMap[appt.vaccineId]
          .map(id => diseases.find(d => d.id === id))
          .filter(Boolean);
      }
  
      // ✅ Cộng từng bệnh vào map
      relatedDiseases.forEach(disease => {
        map[disease.id] = (map[disease.id] || 0) + 1;
      });
    });
  
    return map;
  }, [pendingAppointments, diseases, vaccineToDiseaseMap]);


  useEffect(() => {
    console.log("📊 pendingAppointmentCountByDisease", pendingAppointmentCountByDisease);
  }, [pendingAppointmentCountByDisease]);
  

  useEffect(() => {
    console.log("✅ Số lượng lịch tiêm theo từng bệnh:", pendingAppointmentCountByDisease);
  }, [pendingAppointmentCountByDisease]);
  

  useEffect(() => {
    const fetchChildDetail = async () => {
      try {
        const response = await api.get(`/Child/get-by-id/${id}`);
        setChildData(response.data);
        setGender(response.data.gender);
      } catch (err) {
        console.error("Error fetching child detail:", err);
      }
    };
    fetchChildDetail();
  }, [id]);

  const handleUpdate = async () => {
    try {
      const payload = {
        childrenFullname: childData.childrenFullname,
        dob: new Date(childData.dob).toISOString(),
        gender: childData.gender,
        fatherFullName: childData.fatherFullName,
        motherFullName: childData.motherFullName,
        fatherPhoneNumber: childData.fatherPhoneNumber,
        motherPhoneNumber: childData.motherPhoneNumber,
        address: childData.address,
      };
      await api.put(`/Child/update/${id}`, payload);
      setUpdateMessage("Cập nhật thành công!");
    } catch (err) {
      console.error("Error updating child detail:", err);
      setUpdateMessage("Cập nhật thất bại.");
    }
  };

  if (!childData) return <div className="loader"></div>;

  return (
    <div className="HomePage-Allcontainer">
       <Notification notification={notification} />
      <div className="VaccinationPage container">
        <h3 className="text-center VaccinPage-Intro text-white p-2">LỊCH TIÊM CHỦNG CHO TRẺ TỪ 0-12 tháng</h3>
        <div className="table-responsive">


        <table className="table table-bordered text-center">
      <thead className="table-primary">
        <tr>
          <th rowSpan={2} className="align-middle VaccinPage-Title">Vắc xin</th>
          {headers.map((month, index) => (
            <th key={index} className="align-middle VaccinPage-Title">{month}</th>
          ))}
        </tr>
      </thead>
      <tbody>
  {diseases.map((disease, index) => {
    // 🔸 Lấy danh sách các mũi vaccine trong template cho bệnh này
    const templateVaccinesForDisease = Object.entries(highlightedVaccines)
      .flatMap(([m, list]) =>
        list.filter(v => v.diseaseId === disease.id).map(v => ({ ...v, month: Number(m) }))
      )
      .sort((a, b) => a.month - b.month);

    // 🔸 Đếm số lịch hẹn pending
    const totalHighlight = pendingAppointmentCountByDisease[disease.id] || 0;

    return (
      <tr key={index}>
        <td className="align-middle VaccinPage-Name">{disease.name}</td>
        {headers.map((monthLabel, idx) => {
          if (idx === 0) return <td key={idx}></td>; // Skip "Sơ sinh"
          const month = idx;

          // ✅ Tìm template (nếu có) tại tháng đó
          const templateInfo = highlightedVaccines[month]?.find(v => v.diseaseId === disease.id);
          const hasTemplateVaccine = !!templateInfo;
          const note = templateInfo?.notes || "";
          const expectedDate = templateInfo?.expectedInjectionDate
            ? new Date(templateInfo.expectedInjectionDate).toLocaleDateString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })
            : "Chưa có dữ liệu";

          // ✅ Check nếu đã tiêm
          const vaccination = vaccinationRecords.find(
            record => record.diseaseId === disease.id && record.month === month
          );

          // ✅ Kiểm tra ô hiện tại có nằm trong danh sách highlight (vàng) không
          const isYellow = templateVaccinesForDisease
            .slice(0, totalHighlight)
            .some(v => v.month === month);

          return (
            <td
              key={idx}
              className="align-middle position-relative"
              onClick={() => handleCellClick(disease, month)}
              style={{
                cursor: "pointer",
                backgroundColor: vaccination?.vaccineId
                  ? "#c8e6c9" // ✅ đã tiêm
                  : isYellow
                    ? "#fff9c4" // ✅ có lịch hẹn pending
                    : hasTemplateVaccine
                      ? "var(--primary-colorVaccine)" // ✅ có trong template
                      : "", // không có gì
              }}
            >
              {vaccination?.vaccineId && vaccination?.month === month ? "✔️" : ""}

              {/* Tooltip hover */}
              {hasTemplateVaccine && (
                <div className="tooltip-box">
                  <div><strong>Ghi chú:</strong> {note}</div>
                  <div><strong>Ngày dự kiến:</strong> {expectedDate}</div>
                  {isYellow && <div><strong>Trạng thái:</strong> ⏳ Đang chờ tiêm</div>}
                </div>
              )}
            </td>
          );
        })}
      </tr>
    );
  })}
</tbody>



    </table>



        </div>
      </div>
      
               {/* Vaccinee Information Form */}
               <div className="container">
               <div className="row">
           <div className="col-12">
             <div className="mt-4">
               <div className="BookingPage-tuade">THÔNG TIN NGƯỜI TIÊM:</div>
             </div>
             <div className="VaccinPage-TTlIENHE">
               <div className="CreatechildPage-content-kk">
                 <div className="CreatechildPage-address">
                   <div className="VaccinationPage-Name">*Họ tên người tiêm:</div>
                  <input
                    className="VaccinationPage-input"
                    placeholder="Họ tên"
                    value={childData.childrenFullname}
                    onChange={(e) =>
                      setChildData({ ...childData, childrenFullname: e.target.value })
                    }
                  />
                </div>
                <div className="CreatechildPage-address">
                  <div className="VaccinationPage-Name">*Ngày sinh của bé:</div>
                  <input
                    className="VaccinationPage-input"
                    placeholder="dd/mm/yyyy"
                    value={childData.dob ? childData.dob.substring(0, 10) : ""}
                    onChange={(e) =>
                      setChildData({ ...childData, dob: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="CreatechildPage-content-kk">
                <div className="CreatechildPage-address">
                  <div className="VaccinationPage-Name">*Giới tính:</div>
                  <div className="VaccinationPage-custom-select">
                    <span
                      className={`CreatechildPage-custom-option ${gender === "Nam" ? "selected" : ""}`}
                      onClick={() => {
                        setGender("Nam");
                        setChildData({ ...childData, gender: "Nam" });
                      }}
                    >
                      Nam
                    </span>
                    <span
                      className={`CreatechildPage-custom-option ${gender === "Nữ" ? "selected" : ""}`}
                      onClick={() => {
                        setGender("Nữ");
                        setChildData({ ...childData, gender: "Nữ" });
                      }}
                    >
                      Nữ
                    </span>
                  </div>
                </div>
                <div className="CreatechildPage-address">
                  <div className="VaccinationPage-Name">*Họ tên cha:</div>
                  <input
                    className="VaccinationPage-input"
                    placeholder="Họ tên cha"
                    value={childData.fatherFullName}
                    onChange={(e) =>
                      setChildData({ ...childData, fatherFullName: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="CreatechildPage-content-kk">
                <div className="CreatechildPage-address">
                  <div className="VaccinationPage-Name">*Địa chỉ:</div>
                  <input
                    className="VaccinationPage-input"
                    placeholder="Địa chỉ"
                    value={childData.address}
                    onChange={(e) =>
                      setChildData({ ...childData, address: e.target.value })
                    }
                  />
                </div>
                <div className="CreatechildPage-address">
                  <div className="VaccinationPage-Name">*Họ tên mẹ:</div>
                  <input
                    className="VaccinationPage-input"
                    placeholder="Họ tên mẹ"
                    value={childData.motherFullName}
                    onChange={(e) =>
                      setChildData({ ...childData, motherFullName: e.target.value })
                    }
                  />
                </div>
                <div className="CreatechildPage-address">
                  <div className="VaccinationPage-Name">*Số điện thoại mẹ:</div>
                  <input
                    className="VaccinationPage-input"
                    placeholder="Số điện thoại mẹ"
                    value={childData.motherPhoneNumber}
                    onChange={(e) =>
                      setChildData({ ...childData, motherPhoneNumber: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="CreatechildPage-content-kk">
                <div className="CreatechildPage-address">
                  <div className="VaccinationPage-Name">*Số điện thoại ba:</div>
                  <input
                    className="VaccinationPage-inputPhone"
                    placeholder="Số điện thoại cha"
                    value={childData.fatherPhoneNumber}
                    onChange={(e) =>
                      setChildData({ ...childData, fatherPhoneNumber: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="VaccinPage-flex">
                <div className="BookingPage-button" onClick={handleUpdate}>
                  CẬP NHẬT THÔNG TIN
                </div>
              </div>
              <div className="VaccinPage-flex">
                {updateMessage && <p>{updateMessage}</p>}
              </div>
            </div>
          </div>
        </div>
               </div>


               {showModal && (
  <div className="modal-overlay">
    <div className="modal-content">
      <h4>Cập nhật vaccine cho bệnh: {selectedDisease?.name} tại tháng {selectedMonth}</h4>

      {/* Ngày tiêm thực tế nếu có */}
      {selectedRecord?.actualInjectionDate && (
        <div>
          <p><strong>Ngày tiêm thực tế:</strong> {new Date(selectedRecord.actualInjectionDate).toLocaleDateString()}</p>
        </div>
      )}

      {/* Dropdown chọn vaccine */}
      <div className="form-group">
        <label><strong>Chọn Vaccine:</strong></label>
        <select
  className="form-control"
  value={selectedVaccineId || ""}
  onChange={(e) => setSelectedVaccineId(e.target.value)}
>
  <option value="">Chọn vaccine</option>
  {vaccineList.map((vaccine) => (
    <option key={vaccine.id} value={vaccine.id}>
      {vaccine.name}
    </option>
  ))}
</select>

      </div>

      {/* Nút Xóa mũi tiêm (chỉ hiện nếu chưa tiêm thực tế) */}
      {selectedRecord && !selectedRecord.actualInjectionDate && (
        <button className="btn btn-danger mt-2" onClick={() => handleDelete(selectedRecord.id)}>
          Xóa mũi tiêm
        </button>
      )}

      {/* Button actions */}
      <div className="VaccinPage-flex1 modal-buttons">
        {/* Đóng modal */}
        <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Đóng</button>

        {/* Nút Lưu chỉ hiển thị nếu: 
            - Chưa tiêm thực tế
            - Và chưa có vaccineId (tức là chưa lưu gì hết) */}
        {!selectedRecord?.actualInjectionDate && !selectedRecord?.vaccineId && (
          <button className="btn btn-success" onClick={handleSave}>Lưu</button>
        )}

        {/* Đặt lịch tiêm (chỉ hiện nếu chưa tiêm thực tế) */}
        {!selectedRecord?.actualInjectionDate && (
          <button className="btn btn-primary" onClick={handleBooking}>
            Đặt lịch tiêm
          </button>
        )}
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default VaccinationSchedule;


