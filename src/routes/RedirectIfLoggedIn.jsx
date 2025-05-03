import { Navigate } from 'react-router-dom';

const RedirectIfLoggedIn = ({ children }) => {
    const token = localStorage.getItem("token");

    if (token) {
        window.alert("You are already logged in!");
        return <Navigate to="/" replace />;
    }

    return children;
};

export default RedirectIfLoggedIn;
