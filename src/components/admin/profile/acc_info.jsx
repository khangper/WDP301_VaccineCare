import React from 'react';
import './acc_info.css'; // Ensure you have created this CSS file
import profileImage from '../../../assets/cat.jpg';

const AccInfo = () => {
    return (
        <div className="acc-info-container">
            <div className="profile-picture">
                <img src={profileImage} alt="Profile" />
            </div>
            <div className="info">
                <h2>Account Information</h2>
                <p><strong>Full Name:</strong> John Doe</p>
                <p><strong>Email:</strong> john.doe@example.com</p>
                <p><strong>Phone Number:</strong> 0123456789</p>
                <p><strong>Address:</strong> 123 ABC Street, District 1, Ho Chi Minh City</p>
            </div>
        </div>
    );
};

export default AccInfo;
