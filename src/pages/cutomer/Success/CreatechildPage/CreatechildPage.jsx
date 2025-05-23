import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import "./CreatechildPage.css";
import api from '../../../../services/api';
import { AuthContext } from '../../../../context/AuthContext';
import jwtDecode from "jwt-decode";
import { Button, notification } from 'antd';

function CreatechildPage() {
  // States for child and family info
  const [childrenFullName, setChildrenFullName] = useState("");
  const [dob, setDob] = useState("");
  const [motherFullName, setMotherFullName] = useState("");
  const [fatherFullName, setFatherFullName] = useState("");
  const [phonemom, setPhonemom] = useState("");
  const [phonedad, setPhonedad] = useState("");
  const [gender, setGender] = useState("Nam");
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [street, setStreet] = useState("");
  const [dobError, setDobError] = useState("");

  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  // Decode token to extract userId
  let userId = 0;
  if (token) {
    try {
      const decoded = jwtDecode(token);
      userId = decoded.Id; // Ensure this matches your JWT payload property name.
      console.log("User ID from token:", userId);
    } catch (err) {
      console.error("❌ Lỗi giải mã token:", err);
    }
  }
  const handleCreateChild = async () => {
  
    if (!childrenFullName || !dob || !motherFullName || !fatherFullName || !phonemom || !phonedad || !province || !district || !ward || !street) {
      notification.warning({
        message: "Thiếu thông tin",
        description: "Vui lòng điền đầy đủ thông tin.",
      });
      return;
    }
  
    // ✅ Validate ngày sinh trong khoảng 0-12 tháng
    const today = new Date();
    const dobDate = new Date(dob);
    const twelveMonthsAgo = new Date(today);
    twelveMonthsAgo.setFullYear(today.getFullYear() - 1);
  
    if (dobDate < twelveMonthsAgo || dobDate > today) {
      notification.warning({
        message: "Ngày sinh không hợp lệ",
        description: "Ngày sinh phải trong khoảng 0 đến 12 tháng tuổi.",
      });
      return;
    }
  
    const address = `${province}, ${district}, ${ward}, ${street}`;
  
    const payload = {
      userId: userId || 0,
      childrenFullname: childrenFullName,
      dob: dobDate.toISOString(),
      gender: gender,
      fatherFullName: fatherFullName,
      motherFullName: motherFullName,
      fatherPhoneNumber: phonedad,
      motherPhoneNumber: phonemom,
      address: address,
      vaccinationDetails: [
        {
          id: 0,
          diseaseId: null,
          vaccineId: null,
          expectedInjectionDate: new Date().toISOString(),
          actualInjectionDate: new Date().toISOString()
        }
      ]
    };
  
    try {
      console.log("Sending child profile data:", JSON.stringify(payload, null, 2));
      const response = await api.post("/Child/create", payload, {
        headers: {
          "accept": "*/*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });
      console.log("API response:", response.data);
      navigate("/successbaby");
    } catch (err) {
      console.error("Error creating child profile:", err);
      const apiMessage = err.response?.data?.message;

      if (err.response?.status === 400) {
        notification.warning({
          message: "Trẻ đã tồn tại",
          description: "⚠️ Trẻ đã tồn tại trong hệ thống với tên và ngày sinh này. Vui lòng kiểm tra lại.",
        });      
      } else {
          notification.error({
            message: "Lỗi khi tạo hồ sơ",
            description: apiMessage || "Đã xảy ra lỗi khi tạo hồ sơ trẻ.",
          });      }
    }
  };
  
  // const handleCreateChild = async () => {
  //   setErrorMessage(""); // Reset error message

  //   if (!childrenFullName || !dob || !motherFullName || !fatherFullName || !phonemom || !phonedad || !province || !district || !ward || !street) {
  //     setErrorMessage("Vui lòng điền đầy đủ thông tin.");
  //     return;
  //   }
  
  //   const address = `${province}, ${district}, ${ward}, ${street}`;
  
  //   const payload = {
  //     userId: userId || 0,
  //     childrenFullname: childrenFullName,
  //     dob: new Date(dob).toISOString(),
  //     gender: gender,
  //     fatherFullName: fatherFullName,
  //     motherFullName: motherFullName,
  //     fatherPhoneNumber: phonedad,
  //     motherPhoneNumber: phonemom,
  //     address: address,
  //     vaccinationDetails: [
  //       {
  //         id: 0,
  //         diseaseId: null, 
  //         vaccineId: null, 
  //         expectedInjectionDate: new Date().toISOString(),
  //         actualInjectionDate: new Date().toISOString()
  //       }
  //     ]
  //   };
  
  //   try {
  //     console.log("Sending child profile data:", JSON.stringify(payload, null, 2));
  //     const response = await api.post("/Child/create", payload, {
  //       headers: {
  //         "accept": "*/*",
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`
  //       }
  //     });
  //     console.log("API response:", response.data);
  //     navigate("/successbaby");
  //   } catch (err) {
  //     console.error("Error creating child profile:", err);
  //     setErrorMessage(err.response?.data?.message || "Đã xảy ra lỗi khi tạo hồ sơ trẻ.");
  //   }
  // };
  return (
    <div className='CreatechildPage-container'>
      <div className='CreatechildPage-From'>
        <div className='SuccessRegis-title'>Tạo hồ sơ trẻ em</div>
        <div className='CreatechildPage-content-kk'>
          <div className='CreatechildPage-content'>
            <div className='CreatechildPage-Name'>Tên của bé:</div>
            <input
              className='CreatechildPage-input'
              placeholder='Name of child'
              value={childrenFullName}
              onChange={(e) => setChildrenFullName(e.target.value)}
            />
          </div>
          <div className='CreatechildPage-content'>
            <div className='CreatechildPage-Name'>Ngày tháng năm sinh:</div>
            {/* <input
              type="date"
              className='CreatechildPage-input'
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            /> */}
            {/* <input
  type="date"
  className='CreatechildPage-input'
  value={dob}
  max={new Date().toISOString().split("T")[0]} 
  onChange={(e) => setDob(e.target.value)}
/> */}
<input
  type="date"
  className='CreatechildPage-input'
  value={dob}
  min={new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString().split("T")[0]}
  max={new Date().toISOString().split("T")[0]}
  onChange={(e) => {
    const value = e.target.value;
    setDob(value);

    const selectedDate = new Date(value);
    const today = new Date();
    const twelveMonthsAgo = new Date(today);
    twelveMonthsAgo.setFullYear(today.getFullYear() - 1);

    if (selectedDate < twelveMonthsAgo || selectedDate > today) {
      setDobError("Ngày sinh phải trong khoảng 0 đến 12 tháng tuổi.");
    } else {
      setDobError("");
    }
  }}
/>
{dobError && <div className="CreatechildPage-error">{dobError}</div>}


          </div>
        </div>
        <div className='CreatechildPage-content-kk'>
          <div className='CreatechildPage-content'>
            <div className='CreatechildPage-Name'>Họ tên mẹ:</div>
            <input
              className='CreatechildPage-input'
              placeholder='Name of mother'
              value={motherFullName}
              onChange={(e) => setMotherFullName(e.target.value)}
            />
          </div>
          <div className='CreatechildPage-content'>
            <div className='CreatechildPage-Name'>Họ tên cha:</div>
            <input
              className='CreatechildPage-input'
              placeholder='Name of dad'
              value={fatherFullName}
              onChange={(e) => setFatherFullName(e.target.value)}
            />
          </div>
        </div>
        <div className='CreatechildPage-content-kk'>
        <div className='CreatechildPage-content'>
          <div className='CreatechildPage-Name'>Số điện thoại mẹ:</div>
          <input
            className='CreatechildPage-input'
            placeholder='Phone number'
            value={phonemom}
            onChange={(e) => setPhonemom(e.target.value)}
          />
        </div>
        <div className='CreatechildPage-content'>
          <div className='CreatechildPage-Name'>Số điện thoại ba:</div>
          <input
            className='CreatechildPage-input'
            placeholder='Phone number'
            value={phonedad}
            onChange={(e) => setPhonedad(e.target.value)}
          />
        </div>

        </div>

        <div className='CreatechildPage-content'>
          <div className='CreatechildPage-Name'>Giới tính:</div>
          <div className="CreatechildPage-custom-select">
            <span
              className={`CreatechildPage-custom-option ${gender === "Nam" ? "selected" : ""}`}
              onClick={() => setGender("Nam")}
            >
              Nam
            </span>
            <span
              className={`CreatechildPage-custom-option ${gender === "Nữ" ? "selected" : ""}`}
              onClick={() => setGender("Nữ")}
            >
              Nữ
            </span>
          </div>
        </div>
        <div className='CreatechildPage-content-kk'>
          <div className='CreatechildPage-address'>
            <div className='CreatechildPage-Name'>Tỉnh thành:</div>
            <input
              className='CreatechildPage-input'
              placeholder='Input address'
              value={province}
              onChange={(e) => setProvince(e.target.value)}
            />
          </div>
          <div className='CreatechildPage-address'>
            <div className='CreatechildPage-Name'>Quận huyện:</div>
            <input
              className='CreatechildPage-input'
              placeholder='Input address'
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
            />
          </div>
        </div>
        <div className='CreatechildPage-content-kk'>
          <div className='CreatechildPage-address'>
            <div className='CreatechildPage-Name'>Phường xã:</div>
            <input
              className='CreatechildPage-input'
              placeholder='Input address'
              value={ward}
              onChange={(e) => setWard(e.target.value)}
            />
          </div>
          <div className='CreatechildPage-address'>
            <div className='CreatechildPage-Name'>Số nhà, tên đường:</div>
            <input
              className='CreatechildPage-input'
              placeholder='Street, House number'
              value={street}
              onChange={(e) => setStreet(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className='CreatechildPage-title'>
        <div className='SuccessRegis-title'>Chăm sóc từng mũi tiêm trọn vẹn</div>
        <div className='CreatechildPage-button' onClick={handleCreateChild}>
          Tạo
        </div>
      </div>
    </div>
  );
}

export default CreatechildPage;
