import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./DetailPage.css";
import api from "../../../services/api";

const DetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vaccine, setVaccine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVaccine = async () => {
      try {
        // Dùng API get-by-id để lấy dữ liệu vaccine theo id
        const response = await api.get(`/Vaccine/get-by-id/${id}`);
        const vaccineData = response.data;
        if (!vaccineData) {
          setError("Không tìm thấy thông tin vắc xin");
        } else {
          setVaccine(vaccineData);
        }
      } catch (err) {
        console.error("❌ Lỗi khi lấy dữ liệu vaccine:", err);
        setError("Lỗi khi lấy dữ liệu vaccine.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchVaccine();
  }, [id]);

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <h2 className="DetailPage-notfound text-center text-danger mt-4">{error}</h2>;

  return (
    <div className="DetailPage-container container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="DetailPage-card card shadow-lg">
            <div className="row g-0">
              <div className="col-md-6 d-flex align-items-center">
                <img
                  src={vaccine.imageUrl}
                  alt={vaccine.name}
                  className="DetailPage-image img-fluid rounded-start"
                />
              </div>
              <div className="col-md-6">
                <div className="DetailPage-body card-body">
                  <h2 className="DetailPage-title text-primary">{vaccine.name}</h2>
                  <p className="DetailPage-description">{vaccine.description}</p>
                  <h4 className="DetailPage-price text-danger">Giá: {vaccine.price}</h4>
                  <p className="DetailPage-manufacture">
                    <strong>Nhà sản xuất:</strong> {vaccine.manufacture}
                  </p>
                  <p className="DetailPage-object">
                    <strong>Đối tượng sử dụng:</strong> Từ {vaccine.recAgeStart} đến {vaccine.recAgeEnd} tuổi.
                  </p>
                  <p className="DetailPage-stock">
                    <strong>Số lượng trong kho:</strong> {vaccine.inStockNumber}
                  </p>
                  <p className="DetailPage-notes">
                    <strong>Ghi chú:</strong> {vaccine.notes}
                  </p>
                  <p className="DetailPage-created">
                    <strong>Ngày tạo:</strong> {new Date(vaccine.createdAt).toLocaleString()}
                  </p>
                  <p className="DetailPage-updated">
                    <strong>Ngày cập nhật:</strong> {new Date(vaccine.updatedAt).toLocaleString()}
                  </p>
                  <button
                    className="DetailPage-back btn btn-secondary mt-3"
                    onClick={() => navigate(-1)}
                  >
                    Quay lại
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Display video if available */}
          {vaccine.video && (
            <div className="DetailPage-video mt-4">
              <h3 className="text-center">Video giới thiệu về {vaccine.name}</h3>
              <div className="ratio ratio-16x9">
                <iframe
                  width="100%"
                  height="400px"
                  src={vaccine.video}
                  title={`Video về ${vaccine.name}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailPage;
