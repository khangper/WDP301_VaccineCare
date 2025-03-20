import { Input } from "antd";
import { useEffect, useState } from "react";
import api from "../../../services/api";
import "./Vaccine.css";

const Vaccine = () => {
  const [vaccines, setVaccines] = useState([]);
  const [searchedVaccines, setSearchedVaccines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { Search } = Input;
  const [showModal, setShowModal] = useState(false);
  const [selectedVaccine, setSelectedVaccine] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const fetchVaccines = async () => {
    try {
      const response = await api.get(`/Vaccine/get-all`);
      const vaccineArray = response.data.$values
        ? response.data.$values
        : response.data;
      console.log("Tất cả vaccine:", vaccineArray);
      setVaccines(vaccineArray);
      setSearchedVaccines(vaccineArray);
      setLoading(false);
    } catch (err) {
      console.error("Lỗi khi lấy dữ liệu vaccine:", err);
      setError("Lỗi khi lấy dữ liệu vaccine.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVaccines();
  }, []);

  const handleSearch = (event) => {
    if (event.key === "Enter") {
      const trimmedSearch = searchTerm.trim().toLowerCase();

      if (trimmedSearch === "") {
        setSearchedVaccines(vaccines);
      } else {
        const filtered = vaccines.filter((vaccine) => {
          let vaccineName = vaccine.name
            .toLowerCase()
            .replace(/^vắc xin\s*/i, ""); // Bỏ "Vắc xin"
          return vaccineName.includes(trimmedSearch);
        });

        setSearchedVaccines(filtered);
      }
    }
  };

  const fetchVaccineDetail = async (id) => {
    setLoadingDetail(true);
    try {
      const response = await api.get(`/Vaccine/get-by-id/${id}`);
      console.log("Chi tiết vaccine:", response.data);
      setSelectedVaccine(response.data);
    } catch (err) {
      console.error("Lỗi khi lấy chi tiết vaccine:", err);
    }
    setLoadingDetail(false);
  };

  const handleOpenModal = (id) => {
    setShowModal(true);
    fetchVaccineDetail(id);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedVaccine(null);
  };

  if (loading) return <div className="loader"></div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="vaccine">
      <div className="search-bar" style={{ marginBottom: "20px" }}>
        <Search
          placeholder="input search text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleSearch}
          enterButton="Search"
          size="large"
          loading
        />
      </div>
      <div className="row">
        {searchedVaccines.map((vaccine) => (
          <div className="col-lg-4 col-md-6 col-12 mb-4" key={vaccine.id}>
            <div className="HomePage-card card">
              <div className="HomePage-card-actions">
                <div className="HomePage-card-image">
                  <img
                    src={vaccine.imageUrl}
                    className="card-img-top"
                    alt={vaccine.name}
                  />
                </div>
              </div>
              <div className="HomePage-card-body card-body">
                <h3 className="HomePage-card-title">{vaccine.name}</h3>
                <button
                  className="vaccine-btn-detail"
                  onClick={() => handleOpenModal(vaccine.id)}
                >
                  Xem chi tiết
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {showModal && (
        <div className="custom-modal">
          <div className="custom-modal-content">
            <button className="close-btn" onClick={handleCloseModal}>
              X
            </button>
            {loadingDetail ? (
              <div className="loader"></div>
            ) : selectedVaccine ? (
              <div className="modal-container">
                <img
                  src={selectedVaccine.imageUrl}
                  alt={selectedVaccine.name}
                  className="modal-image"
                />

                <div className="modal-vaccine-content">
                  <h2>{selectedVaccine.name}</h2>
                  <p>
                    <strong>Nhà sản xuất:</strong> {selectedVaccine.manufacture}
                  </p>
                  <p>
                    <strong>Mô tả:</strong> {selectedVaccine.description}
                  </p>
                  <p>
                    <strong>Số lượng tồn kho:</strong>{" "}
                    {selectedVaccine.inStockNumber}
                  </p>
                  <p>
                    <strong>Ghi chú:</strong> {selectedVaccine.notes}
                  </p>
                  <p>
                    <strong>Giá:</strong> {selectedVaccine.price}
                  </p>
                  <p
                    className={`status ${
                      selectedVaccine.inStockNumber <= 0
                        ? "out-of-stock"
                        : "in-stock"
                    }`}
                  >
                    {selectedVaccine.inStockNumber <= 0
                      ? "Hết hàng"
                      : "Còn hàng"}
                  </p>
                </div>
              </div>
            ) : (
              <p>Lỗi khi tải dữ liệu.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Vaccine;
