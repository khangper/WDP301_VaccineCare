import "./Booking.css";
import { useEffect, useState } from "react";
import { Table } from "antd";
import api from "../../../services/api";

const Booking = ({ details, record }) => {
  const [data, setData] = useState([]);
  const [childId, setChildId] = useState(null);
  const [vaccinationProfileId, setVaccinationProfileId] = useState(null);
  const [vaccinationRecords, setVaccinationRecords] = useState([]);
  const [diseases, setDiseases] = useState([]);
  const [vaccineList, setVaccineList] = useState([]);
  const headers = [
    " ",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
  ];
  useEffect(() => {
    if (details) {
      const date = new Date(details.dateInjection);
      setData([
        {
          id: details.id,
          fullname: details.childFullName,
          date: date.toLocaleDateString("vi-VN"),
          vaccine: details.vaccineName,
          phone: details.parentPhoneNumber,
          vaccinePackage: details.vaccinePackageName,
          type_vaccine: details.vaccineType === "Single" ? "Lẻ" : "Gói",
        },
      ]);
    }
  }, [details]);
  const hasVaccinePackage = data.some((item) => item.type_vaccine === "Gói");

  // Lấy childId từ API Child
  useEffect(() => {
    // Gọi API để lấy danh sách trẻ em
    const fetchChildren = async () => {
      try {
        const response = await api.get("/Child/get-all?PageSize=100");
        const result = await response.data;

        if (result?.$values) {
          const matchedChild = result.$values.find(
            (child) => child.childrenFullname === record.fullname
          );
          if (matchedChild) {
            setChildId(matchedChild.id);
          }
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu trẻ em:", error);
      }
    };

    fetchChildren();
  }, [record]);

  useEffect(() => {
    // Khi đã có childId, gọi API để lấy thông tin tiêm chủng
    const fetchVaccinationProfile = async () => {
      if (!childId) return;

      try {
        const url = `/VaccinationProfile/get-all?FilterOn=childrenId&FilterQuery=${childId}&PageSize=100`;
        const response = await api.get(url);
        const result = await response.data;

        if (result?.$values?.length > 0) {
          setVaccinationProfileId(result.$values[0].id); // Lấy ID tiêm chủng đầu tiên
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu tiêm chủng:", error);
      }
    };

    fetchVaccinationProfile();
  }, [childId]);

  useEffect(() => {
    if (vaccinationProfileId) {
      api
        .get(
          `/VaccinationDetail/get-all?FilterOn=vaccinationProfileId&FilterQuery=${vaccinationProfileId}&PageSize=100`
        )
        .then((response) => {
          const records = response.data.$values || [];
          setVaccinationRecords(records);
        })
        .catch((error) =>
          console.error("Error fetching vaccination data:", error)
        );
    }
  }, [vaccinationProfileId]);

  useEffect(() => {
    api
      .get("/Disease/get-all?PageSize=30")
      .then((response) => setDiseases(response.data.$values || response.data))
      .catch((error) => console.error("API fetch error: ", error));
  }, []);

  useEffect(() => {
    api
      .get("/Vaccine/get-all")
      .then((response) =>
        setVaccineList(response.data.$values || response.data)
      )
      .catch((error) => console.error("API fetch error: ", error));
  }, []);

  const [highlightedVaccines, setHighlightedVaccines] = useState({});

  useEffect(() => {
    if (vaccinationProfileId) {
      api
        .get(`/VaccineTemplate/get-by-profileid/${vaccinationProfileId}`)
        .then((response) => {
          const vaccineData = response.data.$values || response.data;
          const highlightMap = {};

          vaccineData.forEach((vaccine) => {
            if (!highlightMap[vaccine.month]) {
              highlightMap[vaccine.month] = [];
            }
            highlightMap[vaccine.month].push({
              diseaseId: vaccine.diseaseId,
              notes: vaccine.notes,
              expectedInjectionDate: vaccine.expectedInjectionDate, // Thêm ngày dự kiến
            });
          });

          setHighlightedVaccines(highlightMap);
        })
        .catch((error) => console.error("API fetch error: ", error));
    }
  }, [vaccinationProfileId]);

  useEffect(() => {
    api
      .get("/Disease/get-all?PageSize=100")
      .then((response) => {
        setDiseases(response.data.$values || response.data);
      })
      .catch((error) => console.error("API fetch error: ", error));
  }, []);

  const months = Array.from({ length: 36 }, (_, i) => i + 1);

  const columns = [
    {
      title: "Mã số",
      dataIndex: "id",
      render: (id) => id || "N/A",
      width: "10%",
    },
    {
      title: "Tên bé",
      dataIndex: "fullname",
      width: "20%",
      render: (fullname) => fullname || "N/A",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      width: "15%",
    },
    {
      title: "Ngày tiêm",
      dataIndex: "date",
      width: "15%",
      render: (date) => date || "N/A",
    },
    {
      title: "Vắc xin",
      dataIndex: "vaccine",
      width: "20%",
      render: (vaccine) => vaccine || "N/A",
    },

    hasVaccinePackage && {
      title: "Gói",
      width: "20%",
      dataIndex: "vaccinePackage",
      render: (vaccinePackage) => vaccinePackage || "N/A",
    },
  ].filter(Boolean);

  return (
    <div className="booking">
      <h3> Đặt Lịch Tiêm</h3>
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        rowKey="id"
      />

      <h3> Sổ tiêm chủng</h3>

      <div className="table-responsive">
        <table className="table table-bordered text-center">
          <thead className="table-primary">
            {/* Dòng 1: Nhóm tiêu đề Tháng và Tuổi */}
            <tr>
              <th rowSpan={2} className="align-middle VaccinPage-Title">
                Vắc xin
              </th>
              {headers.map((month, index) => (
                <th key={index} className="align-middle VaccinPage-Title">
                  {month}
                </th>
              ))}
            </tr>
            {/* Dòng 2: Các tháng và tuổi cụ thể */}
          </thead>
          <tbody>
            {diseases.map((disease, index) => (
              <tr key={index}>
                <td className="align-middle VaccinPage-Name">{disease.name}</td>
                {headers.map((monthLabel, idx) => {
                  if (idx === 0) return <td key={idx}></td>; // Bỏ qua "Sơ sinh"

                  const month = idx;

                  // Kiểm tra dữ liệu từ VaccineTemplate
                  const templateInfo = highlightedVaccines[month]?.find(
                    (v) => v.diseaseId === disease.id
                  );
                  const hasTemplateVaccine = !!templateInfo;
                  const note = templateInfo?.notes || "";
                  const expectedDate = templateInfo?.expectedInjectionDate
                    ? new Date(
                        templateInfo.expectedInjectionDate
                      ).toLocaleDateString()
                    : "Chưa có dữ liệu";

                  // Kiểm tra lịch tiêm thực tế (chỉ khi `month` đúng với dữ liệu)
                  const vaccination = vaccinationRecords.find(
                    (record) =>
                      record.diseaseId === disease.id && record.month === month
                  );

                  // Lấy tên vaccine đã tiêm (nếu có)
                  const injectedVaccine = vaccineList.find(
                    (v) => v.id === vaccination?.vaccineId
                  )?.name;

                  return (
                    <td
                      key={idx}
                      className="align-middle position-relative"
                      style={{
                        cursor: "pointer",
                        backgroundColor: vaccination?.vaccineId
                          ? "#c8e6c9" // Nếu đã tiêm thì tô màu xanh nhạt
                          : hasTemplateVaccine
                          ? "var(--primary-colorVaccine)" // Nếu có kế hoạch tiêm thì tô màu chủ đạo
                          : "",
                      }}
                    >
                      {/* Hiển thị tên vaccine đã tiêm phía trên dấu tick */}
                      {vaccination?.vaccineId && (
                        <div
                          style={{
                            fontSize: "12px",
                            fontWeight: "bold",
                            color: "#000",
                          }}
                        >
                          {injectedVaccine}
                        </div>
                      )}
                      {/* Chỉ hiển thị dấu tích nếu đã có vaccineId và đúng month */}
                      {vaccination?.vaccineId && vaccination?.month === month
                        ? "✔️"
                        : ""}

                      {/* Chỉ hiển thị tooltip nếu chưa tiêm nhưng có lịch tiêm */}
                      {!vaccination?.vaccineId && hasTemplateVaccine && (
                        <div className="tooltip-box">
                          <div>
                            <strong>Ghi chú:</strong> {note}
                          </div>
                          <div>
                            <strong>Ngày dự kiến:</strong> {expectedDate}
                          </div>
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Booking;
