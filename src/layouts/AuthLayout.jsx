import { Outlet } from "react-router-dom";
import Footer from "../Components/FooterBar";

const AuthLayout = () => {
    return (
        <div>
            <Outlet />
            <Footer />
        </div>
    );
};

export default AuthLayout;
