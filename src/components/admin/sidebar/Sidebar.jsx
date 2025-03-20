import { FaHistory } from "react-icons/fa";
import { NavLink, useLocation } from "react-router-dom";
import { PATH_NAME } from "../../../constant/pathname";

const Sidebar = ({ isCollapsed }) => {
  const location = useLocation();

  return (
    <aside className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar_main">
        <ul className="sidebar_menu_container">
          <li className={location.pathname === PATH_NAME.PAYMENT_HISTORY ? "active" : ""}>
            <NavLink to={PATH_NAME.PAYMENT_HISTORY}>
              <FaHistory className="icon" /> {!isCollapsed && "Lịch sử thanh toán"}
            </NavLink>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;