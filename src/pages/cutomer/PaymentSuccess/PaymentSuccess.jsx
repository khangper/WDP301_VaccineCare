import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import './PaymentSuccess.css';

function PaymentSuccess() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/');
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
        <FaCheckCircle className="admin result-icon success" />
        <h1 className="admin success-title">Thanh toán thành công!</h1>
        <p className="admin success-message">Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.</p>
        <p className="admin redirect-message">
          Bạn sẽ được chuyển về trang chủ sau {countdown} giây...
        </p>
        <button 
          className="admin home-button"
          onClick={() => navigate('/')}
        >
          Về trang chủ ngay
        </button>
      </div>
    </div>
  );
}

export default PaymentSuccess; 