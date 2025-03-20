import "../../staff/sidebar/Sidebar.css"
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { PATH_NAME } from '../../../constant/pathname';
import { IoPersonOutline, IoSettingsOutline } from "react-icons/io5";
import { MdOutlineVaccines } from "react-icons/md";
import { FaPowerOff } from 'react-icons/fa6';
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import api from "../../../services/api";

const Sidebar = ({ isCollapsed }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const handleLogout = async () => {
    try {
      console.log(" Đang gửi yêu cầu đăng xuất...");

      // Lấy token từ localStorage hoặc context
      const token = localStorage.getItem("access_token");
      if (!token) {
        console.warn("⚠️ Không tìm thấy token, tiến hành đăng xuất cục bộ.");
        logout();
        navigate("/");
        return;
      }

      // Gọi API logout
      // await api.post(
      //   "/User/logout",
      //   {},
      //   {
      //     headers: { Authorization: `Bearer ${token}` },
      //   }
      // );

      console.log("Đăng xuất thành công từ API.");

      // Xoá token khỏi localStorage & cập nhật trạng thái đăng nhập
      logout();
      navigate("/");
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);

      if (error.response) {
        console.error("🔹 Response Data:", error.response.data);
        console.error("🔹 Status Code:", error.response.status);
      }

      // Dù API lỗi vẫn tiến hành logout cục bộ
      logout();
      navigate("/");
    }
  }
  
  return (
    <aside className={`sidebar_staff ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar_main_staff">
        <ul className="sidebar_menu_container_staff">
          <li className={location.pathname === PATH_NAME.INJECTION_INFORMATION ? "active" : ""}>
            <NavLink
              to={PATH_NAME.INJECTION_INFORMATION}
              
            >
              <IoPersonOutline className="icon" /> {!isCollapsed && "Thông tin tiêm"}
            </NavLink>
          </li>
          <li className={location.pathname === PATH_NAME.VACCINE_DOCTOR ? "active" : ""}>
            <NavLink
              to={PATH_NAME.VACCINE_DOCTOR}
              
            >
              <MdOutlineVaccines className="icon" /> {!isCollapsed && "Vắc xin"}
            </NavLink>
          </li>
        </ul>
        <ul className="sidebar_menu_container_1">
          <li className={location.pathname === PATH_NAME.PROFILE_DOCTOR ? "active" : ""}>
            <NavLink
              to={PATH_NAME.PROFILE_DOCTOR}
              
            >
              <IoSettingsOutline className="icon" /> {!isCollapsed && "Hồ sơ"}
            </NavLink>
          </li>
          <li>
            <button className="sidebar-logout-btn" onClick={handleLogout}
            >
              <FaPowerOff className="icon" /> {!isCollapsed && "Đăng xuất"}
            </button>
          </li>
        </ul>
      </div>
    </aside>
  );
}

export default Sidebar