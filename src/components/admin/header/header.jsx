import React, { useState, useRef, useEffect } from 'react';
import './header.css';
import logo from '../../../assets/logo_vaccine.png'; // Adjust the path as necessary
import profileImage from '../../../assets/cat.jpg'; // Ensure this path is correct
import { IoMenuOutline } from "react-icons/io5"; // Import icon

const Header = ({ toggleSidebar }) => { // Nhận toggleSidebar như một prop
    const [showModal, setShowModal] = useState(false);
    const modalRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                setShowModal(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="admin-header">
            <div className="admin-header-title">
                <button className="admin-sidebar-toggle-btn" onClick={toggleSidebar}>
                    <IoMenuOutline />
                </button>
                <img src={logo} alt="Logo" className="admin-header-logo" />
                <span className="admin-header-admin-text">Admin</span>
            </div>
            <div className="admin-header-search-container">
                <input 
                    type="text" 
                    placeholder="Search..." 
                    className="admin-header-search-input" 
                    aria-label="Search"
                />
                <div className="admin-icons">
                    <div className="admin-profile-picture" onClick={() => setShowModal(true)}>
                        <img src={profileImage} alt="Profile" />
                    </div>
                </div>
            </div>

            {showModal && (
                <div className="admin-profile-modal-overlay">
                    <div className="admin-profile-modal" ref={modalRef}>
                        <div className="admin-profile-modal-header">
                            <img src={profileImage} alt="Profile" className="admin-modal-profile-img" />
                            <h2>Account Information</h2>
                        </div>
                        <div className="admin-profile-modal-content">
                            <div className="admin-info-item">
                                <strong>Full Name:</strong>
                                <span>John Doe</span>
                            </div>
                            <div className="admin-info-item">
                                <strong>Email:</strong>
                                <span>john.doe@example.com</span>
                            </div>
                            <div className="admin-info-item">
                                <strong>Phone Number:</strong>
                                <span>0123456789</span>
                            </div>
                            <div className="admin-info-item">
                                <strong>Address:</strong>
                                <span>123 ABC Street, District 1, Ho Chi Minh City</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Header;