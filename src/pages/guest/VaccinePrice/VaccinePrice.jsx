import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./VaccinePrice.css";

function VaccinePrice() {
  const vaccineData = [
    { id: 1, disease: "Uốn ván", name: "Vắc xin uốn ván hấp phụ (TT)", origin: "Việt Nam", price: 149000, discount: "", status: "Có" },
    { id: 2, disease: "Lao", name: "BCG (lọ 1ml)", origin: "Việt Nam", price: 155000, discount: "", status: "Có" },
    { id: 3, disease: "Tả", name: "Morcvax", origin: "Việt Nam", price: 165000, discount: "", status: "Có" },
    { id: 4, disease: "Uốn ván", name: "Huyết thanh uốn ván (SAT)", origin: "Việt Nam", price: 175000, discount: "", status: "Có" },
    { id: 5, disease: "Viêm não Nhật Bản", name: "Jevax 1ml", origin: "Việt Nam", price: 198000, discount: "", status: "Có *" },
    { id: 6, disease: "Viêm gan B trẻ em", name: "Gene Hbvax 0.5ml", origin: "Việt Nam", price: 199000, discount: "", status: "Có" },
    { id: 7, disease: "Bạch hầu – Uốn ván", name: "Uốn ván, bạch hầu hấp phụ (Td) - Liều", origin: "Việt Nam", price: 205000, discount: "", status: "Có" },
    { id: 8, disease: "Viêm gan B người lớn", name: "Gene Hbvax 1ml", origin: "Việt Nam", price: 220000, discount: "", status: "Có" },
    { id: 9, disease: "Viêm não Nhật Bản", name: "Imojev", origin: "Pháp", price: 250000, discount: "", status: "Có" },
    { id: 10, disease: "Viêm phổi", name: "Synflorix", origin: "Bỉ", price: 270000, discount: "", status: "Có" },
    { id: 11, disease: "Viêm gan A", name: "Havax 0.5ml", origin: "Việt Nam", price: 255000, discount: "", status: "Có" },
    { id: 12, disease: "Sởi", name: "MVVac (Liều 0.5ml)", origin: "Việt Nam", price: 265000, discount: "", status: "Có" },
    { id: 13, disease: "Thương hàn", name: "Typhoid VI", origin: "Việt Nam", price: 265000, discount: "", status: "Có" },
    { id: 14, disease: "Viêm gan B trẻ em", name: "Heberbiovac 0.5ml", origin: "Cu Ba", price: 265000, discount: "", status: "Có" },
    { id: 15, disease: "Cúm", name: "Ivacflu-S 0.5ml", origin: "Việt Nam", price: 285000, discount: "", status: "Có" },
    { id: 16, disease: "Các bệnh do Hib", name: "Quimi-Hib", origin: "Cu Ba", price: 315000, discount: "", status: "Có" },
    { id: 17, disease: "Dại", name: "Abhayrab 0.5ml (TTD)", origin: "Ấn Độ", price: 345000, discount: "", status: "Có" },
    { id: 18, disease: "Cúm", name: "Influvac Tetra 0.5ml", origin: "Hà Lan", price: 356000, discount: "", status: "Có" },
    { id: 19, disease: "Viêm màng não do não mô cầu nhóm B,C", name: "VA-Mengoc-BC", origin: "Cu Ba", price: 385000, discount: "", status: "Có" },
    { id: 20, disease: "Viêm não Nhật Bản", name: "Jeev 3mcg/0.5ml", origin: "Ấn Độ", price: 399000, discount: "", status: "Có" },
    { id: 21, disease: "Dại", name: "Abhayrab 0.5ml (TB)", origin: "Ấn Độ	", price: 415000, discount: "", status: "Có" },

  ];

  // State cho bộ lọc
  const [filterType, setFilterType] = useState("");

  // Xử lý thay đổi bộ lọc
  const handleFilterChange = (event) => {
    setFilterType(event.target.value);
  };

  // Lọc và sắp xếp danh sách dựa trên bộ lọc
  const filteredData = [...vaccineData].sort((a, b) => {
    if (filterType === "price-asc") {
      return a.price - b.price;
    }
    if (filterType === "price-desc") {
      return b.price - a.price;
    }
    if (filterType === "origin") {
      return a.origin.localeCompare(b.origin);
    }
    return 0;
  });

  return (
    <div>
      {/* bảng giá  */}
      <div className="container mt-4">
        <h2 className="text-center VaccineTitle">Danh Sách Vắc Xin</h2>

        {/* Dropdown chọn bộ lọc */}
        <div className="d-flex justify-content-end mb-3">
          <select className="form-select w-auto" value={filterType} onChange={handleFilterChange}>
            <option value="">Sắp xếp theo</option>
            <option value="price-asc">Giá thấp đến cao</option>
            <option value="price-desc">Giá cao đến thấp</option>
            <option value="origin">Theo quốc gia sản xuất</option>
          </select>
        </div>

        {/* Bảng danh sách vắc xin */}
        <table className="table table-bordered table-striped vaccine-table">
          <thead>
            <tr>
              <th className="vaccine-tableTitle">STT</th>
              <th className="vaccine-tableTitle">Phòng bệnh</th>
              <th className="vaccine-tableTitle">Tên vắc xin</th>
              <th className="vaccine-tableTitle">Nước sản xuất</th>
              <th className="vaccine-tableTitle">Giá bán lẻ/liều (VNĐ)</th>
              <th className="vaccine-tableTitle">Giá ưu đãi/liều (VNĐ)</th>
              <th className="vaccine-tableTitle">Tình trạng</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((vaccine, index) => (
              <tr key={vaccine.id}>
                <td>{index + 1}</td>
                <td>{vaccine.disease}</td>
                <td>{vaccine.name}</td>
                <td>{vaccine.origin}</td>
                <td>{vaccine.price.toLocaleString("vi-VN")} VNĐ</td>
                <td>{vaccine.discount ? vaccine.discount.toLocaleString("vi-VN") : "-"}</td>
                <td>{vaccine.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Thông tin */}
      <div className="container">
        <div className="row">
            <div className="col-12">
            <div className="VaccinePrice-note"> 
      <p className="VaccinePrice-noteText">
        <em>(*) Để kiểm tra tình trạng vắc xin, xin vui lòng liên hệ Hotline 028.7102.6595.</em>
      </p>
      <p className="VaccinePrice-noteText">
        <b>1. Bảng giá áp dụng trên toàn hệ thống tiêm chủng VNVC từ ngày 18/10/2024</b>
      </p>
      <p className="VaccinePrice-noteText">
        <strong>2. Giá vắc xin tại VNVC đã bao gồm</strong>: miễn phí khám với đội ngũ bác sĩ chuyên môn cao, miễn phí các dịch vụ chăm sóc khách hàng cao cấp…
      </p>
      <p className="VaccinePrice-noteText">
        <b>3. VNVC miễn phí đặt giữ theo yêu cầu tất cả các loại vắc xin</b>, tiêm bằng giá lẻ nếu Quý Khách hoàn tất lịch tiêm trong vòng 5 tuần...
      </p>
      <p className="VaccinePrice-noteText">
        <b>4. VNVC miễn phí bảo quản vắc xin trong hệ thống kho lạnh GSP theo tiêu chuẩn quốc tế</b>, đảm bảo vắc xin an toàn, chất lượng cao…
      </p>
      </div>
            </div>
        </div>
      </div>

    </div>
  );
}

export default VaccinePrice;
