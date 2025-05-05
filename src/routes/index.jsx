import { createBrowserRouter, RouterProvider } from "react-router-dom";

import AuthLayout from "../layouts/AuthLayout.jsx";
import StoreLayout from "../layouts/StoreLayout.jsx";

import Login from '/src/Home/Login.jsx';
import Register from '/src/Home/Register.jsx';
import ForgotPassword from "@/Home/ForgotPassword.jsx";
import ResetPassword from "@/Home/ResetPassword.jsx";

import Profile from '/src/Profile/Profile.jsx';
import DetailPemesanan from '/src/Profile/DetailPemesanan.jsx';

import Home from '/src/Home/Home.jsx';
import ProductHome from '/src/Products/ProductHome.jsx';
import DetailProduct from '/src/Products/DetailProduct.jsx';
import ProtectedRoute from './ProtectedRoutes.jsx';
import RedirectIfLoggedIn from './RedirectIfLoggedIn.jsx';
import DashboardLayout from "@/Dashboard/DashboardLayout.jsx";
import OrganisasiList from "@/Dashboard/OrganisasiList.jsx";

const router = createBrowserRouter([
    {
        path: "*",
        element: <div>Routes Not Found!</div>
    },
    {
        element: <DashboardLayout />,
        children: [
            {
                path: "/dashboard/organisasi",
                element: <OrganisasiList />,
            },
        ],
    },
    {
        // Auth Layout -> Tidak ada navbar
        element: <AuthLayout />,
        children: [
            {
                path: "/login",
                element: (
                    <RedirectIfLoggedIn>
                        <Login />
                    </RedirectIfLoggedIn>
                ),
            },
            {
                path: "/register",
                element: <Register />,
            },
            {
                path: "/forgot-password",
                element: <ForgotPassword />,
            },
            {
                path: "/reset-password",
                element: <ResetPassword />,
            },
        ],
    },
    {
        element: <StoreLayout />,
        children: [
            {
                path: "/",
                element: <Home />,
            },

            {
                path: "/products",
                element: (
                    // <ProtectedRoute allowedRoles={["owner", "admin", "gudang"]}>
                    <ProductHome />
                    // </ProtectedRoute>
                ),
            },
            {
                path: "/profile",
                element: (
                    // <ProtectedRoute allowedRoles={["owner", "admin", "gudang"]}>
                    <Profile />
                    // </ProtectedRoute>
                ),
            },
            {
                path: "/profile/pemesanan/:id",
                element: (
                    // <ProtectedRoute allowedRoles={["Pembeli"]}>
                    <DetailPemesanan />
                    // </ProtectedRoute>
                )
            },
            {
                path: "/products/detail/:id",
                element: (
                    // <ProtectedRoute allowedRoles={["owner", "admin", "gudang"]}>
                    <DetailProduct />
                    // </ProtectedRoute>
                ),
            },
        ],
    },
]);

const AppRouter = () => {
    return (
        <>
            <RouterProvider router={router} />
        </>
    );
};

export default AppRouter;
