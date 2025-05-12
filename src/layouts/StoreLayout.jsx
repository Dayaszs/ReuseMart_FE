import { Outlet } from "react-router-dom";
import Footer from "../Components/FooterBar";
import Header from "../Components/NavigationBar";

const StoreLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default StoreLayout;
