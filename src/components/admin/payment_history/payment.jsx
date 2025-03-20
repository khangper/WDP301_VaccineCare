import React, { useState, useEffect } from 'react';
import { Table, Tag, Spin, message } from 'antd';
import axios from 'axios';
import './payment.css';

// Base API URL constant
const API_BASE_URL = 'https://vaccinecare.azurewebsites.net/api';

const PaymentHistory = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/Payment/get-all`);
        
        if (response.data && response.data.$values) {
          // Transform the API data to match our table structure
          const transformedData = response.data.$values.map(payment => {
            // Get the first vaccine name for display (or combine multiple if needed)
            const vaccineNames = payment.items.$values.map(item => item.vaccineName).join(', ');
            
            return {
              key: payment.paymentId.toString(),
              id: payment.paymentId,
              // We don't have date in the API response, so using a placeholder
              date: 'N/A', 
              // We don't have customer/child name in the API response
              customerName: 'N/A',
              childName: 'N/A',
              amount: payment.totalPrice,
              paymentMethod: payment.paymentMethod === 'Cash' ? 'Tiền mặt' : 
                            payment.paymentMethod === 'VNPay' ? 'VNPay' : 
                            'Phương thức khác',
              status: payment.paymentStatus === 'Paid' ? 'Đã thanh toán' : 'Chưa thanh toán',
              type: payment.type || 'N/A',
              packageStatus: payment.packageProcessStatus,
              vaccines: vaccineNames
            };
          });
          
          setData(transformedData);
        }
      } catch (error) {
        console.error('Error fetching payment data:', error);
        message.error('Không thể tải dữ liệu thanh toán');
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const columns = [
    {
      title: 'Mã hóa đơn',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      render: (type) => {
        let displayText = 'Không xác định';
        let color = 'default';
        
        if (type === 'Single') {
          displayText = 'Đơn lẻ';
          color = 'blue';
        } else if (type === 'Package') {
          displayText = 'Gói';
          color = 'purple';
        }
        
        return <Tag color={color}>{displayText}</Tag>;
      }
    },
    {
      title: 'Vắc xin',
      dataIndex: 'vaccines',
      key: 'vaccines',
      ellipsis: true,
    },
    {
      title: 'Số tiền',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => `${parseInt(amount).toLocaleString('vi-VN')} VNĐ`,
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: 'Phương thức',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      filters: [
        { text: 'Tiền mặt', value: 'Tiền mặt' },
        { text: 'VNPay', value: 'VNPay' },
        { text: 'Phương thức khác', value: 'Phương thức khác' },
      ],
      onFilter: (value, record) => record.paymentMethod === value,
    },
    {
      title: 'Trạng thái thanh toán',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'Đã thanh toán' ? 'green' : 'red'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Trạng thái gói',
      dataIndex: 'packageStatus',
      key: 'packageStatus',
      render: (status) => {
        let color = 'orange';
        let text = 'Chưa hoàn thành';
        
        if (status === 'Completed') {
          color = 'green';
          text = 'Đã hoàn thành';
        }
        
        return <Tag color={color}>{text}</Tag>;
      },
      filters: [
        { text: 'Đã hoàn thành', value: 'Completed' },
        { text: 'Chưa hoàn thành', value: 'NotComplete' },
      ],
      onFilter: (value, record) => record.packageStatus === value,
    },
  ];

  return (
    <div className="admin">
      <div className="payment-history">
        <h2 className="payment-history-title">Lịch sử thanh toán</h2>
        {loading ? (
          <div className="loading-container">
            <Spin size="large" />
          </div>
        ) : (
          <Table 
            columns={columns} 
            dataSource={data} 
            rowKey="key"
            pagination={{ pageSize: 10 }}
          />
        )}
      </div>
    </div>
  );
};

export default PaymentHistory;
