import { Outlet } from "react-router-dom";
import Footer from "../Components/FooterBar";
import Header from "../Components/NavigationBar";

const StoreLayout = () => {
  return (
    <div>
      <Header />
          <Outlet />
      <Footer />
    </div>
  );
};



export default StoreLayout;
