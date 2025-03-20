import { Fragment, useState } from "react";
import { Outlet } from "react-router-dom";
import "./Layout.css";
import Navbar from "../../components/staff/navbar/Navbar";
import Sidebar from "../../components/staff/sidebar/Sidebar";

const Layout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  }
  return (
    <Fragment>
      <Navbar toggleSidebar={toggleSidebar} className="layout_manage_navbar" />
      <div className={`layout_container ${isCollapsed ? "collapsed" : ""}`}>
        <div className="sidebar_container">
          <Sidebar isCollapsed={isCollapsed}/>
        </div>
        <div className="content_outlet">
          <Outlet />
        </div>
      </div>
    </Fragment>
  );
};

export default Layout;
