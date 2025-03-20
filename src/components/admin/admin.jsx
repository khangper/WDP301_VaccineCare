import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './header/header';
import SidebarAdmin from './sidebar_admin/SidebarAdmin';
import './admin.css';

const AdminDashboard = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <div className="admin-container">
            <Header toggleSidebar={toggleSidebar} />
            <div className="content-wrapper">
                <SidebarAdmin isCollapsed={isCollapsed} />
                <div className="main-content">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
