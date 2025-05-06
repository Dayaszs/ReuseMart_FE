import { Outlet } from "react-router-dom";
import Header from "../Components/NavigationBar";

const DashboardLayout = () => {
    return (
        <div>
            <Header />
            <Outlet />
        </div>
    );
};



export default DashboardLayout;
