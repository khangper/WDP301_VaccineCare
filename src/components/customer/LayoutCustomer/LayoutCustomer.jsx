import { Outlet } from "react-router-dom";
import HeaderGuest from "../../guest/HeaderGuest/HeaderGuest";
import FooterGuest from "../../guest/FooterGuest/FooterGuest";



const LayoutCustomer = () => {
  return (
    <div>
      <HeaderGuest /> {/* Navigation bar */}
      <main style={{ paddingTop: "150px" }}>
        <Outlet /> {/* Đây là nơi sẽ hiển thị các trang con */}
      </main>
      <FooterGuest />
    </div>
  );
};

export default LayoutCustomer;