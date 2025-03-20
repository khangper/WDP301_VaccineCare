import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTimesCircle } from 'react-icons/fa';
import './PaymentFailed.css';

function PaymentFailed() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/bill');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="admin payment-result-container">
      <div className="admin payment-result-card">
        <FaTimesCircle className="admin result-icon failed" />
        <h1 className="admin failed-title">Thanh toán thất bại!</h1>
        <p className="admin failed-message">Đã xảy ra lỗi trong quá trình thanh toán.</p>
        <p className="admin redirect-message">
          Bạn sẽ được chuyển về trang hóa đơn sau {countdown} giây...
        </p>
        <div className="admin button-group">
          <button 
            className="admin retry-button"
            onClick={() => navigate('/bill')}
          >
            Thử lại
          </button>
          <button 
            className="admin home-button"
            onClick={() => navigate('/')}
          >
            Về trang chủ
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentFailed; 