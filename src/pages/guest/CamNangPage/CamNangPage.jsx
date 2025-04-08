import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./CamNangPage.css"; // File CSS tùy chỉnh (nếu cần)

const CamNangPage = () => {
  const vaccineSchedule = [
    { name: "Lao", schedule: ["Mũi 1", "", "", "", "", "", "", "", "", "", "", "", "", "", ""] },
    { name: "Viêm gan B", schedule: ["Mũi sơ sinh (24h)", "", "Mũi 1", "Mũi 2", "Mũi 3", "", "", "", "", "", "", "Mũi 4", "", ""] },
    { name: "Bạch hầu, ho gà, uốn ván", schedule: ["", "", "Mũi 1", "Mũi 2", "Mũi 3", "", "", "", "", "", "Mũi 4", "", "Mũi 5", ""] },
    { name: "Bại liệt", schedule: ["", "", "Mũi 1", "Mũi 2", "Mũi 3", "", "", "", "", "", "Mũi 4", "", "Mũi 5", ""] },
    { name: "Viêm não Nhật Bản", schedule: ["", "", "", "", "", "", "", "", "", "", "Mũi 1", "", "", "Mũi 2", ""] },
    { name: "Thủy đậu", schedule: ["", "", "", "", "", "", "", "", "", "", "Mũi 1", "", "", "Mũi 2", ""] },
    { name: "Viêm gan A", schedule: ["", "", "", "", "", "", "", "", "", "", "Mũi 1", "", "Mũi 2", "", ""] },
    { name: "Thương hàn", schedule: ["", "", "", "", "", "", "", "", "", "", "", "", "", "1 Mũi, tiêm nhắc mỗi 3 năm", ""] },
    { name: "Sốt xuất huyết", schedule: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "2 Mũi cách nhau 3 tháng"] },
    { name: "Dại", schedule: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "Tiêm dự phòng trước phơi nhiễm 3 mũi và các mũi nhắc. Tiêm bắt buộc khi phơi nhiễm (3 – 5 mũi tùy tình trạng động vật cắn)."] },
  ];

  return (
    <div>
         
          
       <div className="CamNangPage-container container">
      <h2 className="text-center  VaccineTitle">Lịch Tiêm Chủng Cho Trẻ</h2>
      <div className="CamNangPage-table-container table-responsive">
        <table className="CamNangPage-table table table-bordered table-striped">
          <thead className="text-center">
            <tr>
              <th rowSpan="2">Vắc xin phòng bệnh</th>
              <th colSpan="13">Tháng</th>
              <th colSpan="2">Tuổi</th>
            </tr>
            <tr>
              {["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "12", "15", "18", "2 – 3", "4 – 8"].map((month, index) => (
                <th key={index}>{month}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {vaccineSchedule.map((row, rowIndex) => {
              let mergedCells = [];
              let spanCount = 0;

              row.schedule.forEach((cell, cellIndex) => {
                if (cell === "") {
                  spanCount++;
                } else {
                  if (spanCount > 0) {
                    mergedCells.push(<td key={cellIndex - spanCount} colSpan={spanCount}></td>);
                    spanCount = 0;
                  }
                  mergedCells.push(
                    <td key={cellIndex} className="table-success">
                      {cell}
                    </td>
                  );
                }
              });

              // Nếu còn ô trống ở cuối, gộp chúng lại
              if (spanCount > 0) {
                mergedCells.push(<td key={row.schedule.length - spanCount} colSpan={spanCount}></td>);
              }

              return (
                <tr key={rowIndex}>
                  <td>{row.name}</td>
                  {mergedCells}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
       </div>

       {/* Thông tin */}
      <div className="container">
        <div className="row">
            <div className="col-12">
            <div className="VaccinePrice-note"> 
      <p className="VaccinePrice-noteText">
        <em>** Thông tin trên là những mũi tiêm được sắp đặt bởi hệ thống tiêm chủng Vaccine Care **</em>
      </p>
      <p className="VaccinePrice-noteText">
        <b>1. Bảng tiêm trên áp dụng với toàn hệ thống tiêm chủng Vaccine Care từ ngày 18/10/2024</b>
      </p>
      <p className="VaccinePrice-noteText">
        <b>2. Mọi thông tin cập nhật mũi tiêm cho trẻ khi tiêm ở cơ sở khác phải được xử lý trực tiếp tại phòng khám Vaccine Care</b>
      </p>
      </div>
            </div>
        </div>
      </div>
     
    </div>

  );
};

export default CamNangPage;
