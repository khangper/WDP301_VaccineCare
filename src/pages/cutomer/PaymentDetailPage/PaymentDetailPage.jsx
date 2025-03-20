import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import api from '../../../services/api';
import './PaymentDetailPage.css';

function PaymentDetailPage() {
  const { paymentId } = useParams();
  const { token } = useContext(AuthContext);
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaymentDetail = async () => {
      try {
        const response = await api.get(`/Payment/get-payments-for-current-user`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const paymentDetail = response.data.$values.find(
          p => p.paymentId === parseInt(paymentId)
        );
        
        setPayment(paymentDetail);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching payment details:', error);
        setLoading(false);
      }
    };

    if (token && paymentId) {
      fetchPaymentDetail();
    }
  }, [paymentId, token]);

  const handleVNPayPayment = async () => {
    try {
      const response = await api.get(`/VNPay/CreatePaymentUrl?PaymentId=${paymentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data) {
        window.location.href = response.data;
      }
    } catch (error) {
      console.error('Lỗi khi tạo URL thanh toán:', error);
      alert('Không thể tạo đường dẫn thanh toán. Vui lòng thử lại sau!');
    }
  };

  if (loading) return <div className="admin-loading">Đang tải...</div>;
  if (!payment) return <div className="admin-loading">Không tìm thấy thông tin thanh toán</div>;

  return (
    <div className='HomePage-Allcontainer'>
      <div className="HomePage-main-container">
        <div className='container'>
          <div className='row'>
            <div className='col-12 mt-152'>
              <div className="admin-page-heading">
                Chi tiết hóa đơn
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='container py-4'>
        <div className='admin-payment-detail-container'>
          <div className="payment-header">
            <div className="payment-main-info">
              <h2>#{payment.paymentId}</h2>
              <span className={`status-tag ${payment.paymentStatus === 'Paid' ? 'paid' : 'unpaid'}`}>
                {payment.paymentStatus === 'Paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
              </span>
            </div>
            <div className="payment-total">
              <span className="label">Tổng tiền:</span>
              <span className="amount">{payment.totalPrice.toLocaleString('vi-VN')} VND</span>
            </div>
          </div>

          <div className="payment-content">
            <div className="vaccine-grid">
              {payment.items.$values.map((item, index) => (
                <div key={index} className="vaccine-card">
                  <h3>{item.vaccineName}</h3>
                  <div className="vaccine-info">
                    <div className="info-item">
                      <span className="label">Số mũi:</span>
                      <span className="value">{item.doseNumber}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Còn lại:</span>
                      <span className="value">{item.doseRemaining}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Giá/mũi:</span>
                      <span className="value price">
                        {item.pricePerDose.toLocaleString('vi-VN')} VND
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {payment.paymentStatus !== 'Paid' && (
              <div className="payment-actions">
                <button 
                  className="vnpay-button"
                  onClick={handleVNPayPayment}
                >
                  Thanh toán qua VNPay
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentDetailPage; 