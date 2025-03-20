import { IoMenuOutline } from "react-icons/io5";
import { CiSearch } from "react-icons/ci";
import "./Navbar.css";
import logo from "../../../assets/logo_vaccine.png";
import jwtDecode from "jwt-decode";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import api from "../../../services/api";

const Navbar = ({ toggleSidebar }) => {
  const { token } = useContext(AuthContext);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!token) return;

      try {
        const decoded = jwtDecode(token);
        const userId = decoded.Id;
        const res = await api.get(`/User/get/${userId}`);
        setUserInfo(res.data);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin user:", error);
      }
    };

    fetchUserInfo();
  }, [token]);

  return (
    <div className="navbar_top_bar">
      <div className="navbar_container">
        <nav className="navbar_top_bar_custom">
          <ul className="navbar_top_bar_item_list">
            <li className="navbar_li">
              <div className="navbar_img_staff">
                <img src={logo} alt="" className="navbar_logo_staff" />
              </div>
            </li>
            <li className="navbar_li">
              <button className="navbar_menu_btn" onClick={toggleSidebar}>
                <IoMenuOutline />
              </button>
            </li>
            <li className="navbar_welcome navbar_li">
              <h3 className="navbar_text">
                Hello, {userInfo ? userInfo.username : ""}
              </h3>
            </li>
          </ul>
          <ul className="navbar_top_bar_item_list">
            <li className="navbar_search">
              <form
                role="search"
                action="#"
                method="get"
                className="navbar_form"
              >
                <input
                  type="search"
                  className="navbar_form_search"
                  name="search"
                  placeholder="Tìm kiếm..."
                />
                <button className="navbar_search_btn" type="submit">
                  <CiSearch className="icon_search" />
                </button>
              </form>
            </li>
            <li className="navbar_dropdown_avatar">
              <img
                src="https://mannatthemes.com/rizz/default/assets/images/users/avatar-1.jpg"
                alt=""
                className="navbar_img"
              />
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
