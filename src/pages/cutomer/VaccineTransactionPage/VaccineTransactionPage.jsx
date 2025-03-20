import React from 'react';
import './VaccineTransactionPage.css';

const VaccineTransactionPage = () => {
  // Dữ liệu giả cho giao dịch
  const transaction = {
    id: "INV20250217",
    childName: "Đoàn Anh Khang",
    vaccineName: "Vaccine BCG",
    appointmentDate: "2025-03-01",
    amount: 500000 ,
    status: "Paid", // Hoặc "Paid"
  };

  return (
    <div className='TransactionPage'>
              <div className="HomePage-main-container">
             <div className='container'>
              <div className='row'>
                <div className='col-12 mt-152 BookingPage-titletitle'>
                <div className="BookingPage-heading-protected-together">
          Lịch sử giao dịch
        </div>
                </div>
              </div>
             </div>
    </div>

    {/* Transaction */}
    <div className="container transaction-page mt-4">
      <div className="card shadow transaction-card">
        <div className="TransactionPage-title">
          <h3 className="mb-0">Chi tiết giao dịch</h3>
        </div>
        <div className="card-body">
          <div className="row mb-3">
            <div className="col-md-6">
              <p><strong>Mã giao dịch:</strong> {transaction.id}</p>
              <p><strong>Tên trẻ em:</strong> {transaction.childName}</p>
              <p><strong>Loại vaccine:</strong> {transaction.vaccineName}</p>
            </div>
            <div className="col-md-6">
              <p><strong>Ngày hẹn:</strong> {transaction.appointmentDate}</p>
              <p>
                <strong>Số tiền:</strong> {transaction.amount.toLocaleString()} VND
              </p>
              <p><strong>Trạng thái:</strong> {transaction.status}</p>
            </div>
          </div>
          <div className="text-center">
            {transaction.status === "Pending" ? (
              <button className="btn btn-success btn-lg">
                Thanh toán ngay
              </button>
            ) : (
              <button className="btn btn-secondary btn-lg" disabled>
                Đã thanh toán
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
    </div>

  );
};

export default VaccineTransactionPage;
