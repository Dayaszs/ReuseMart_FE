import { createBrowserRouter, RouterProvider } from "react-router-dom";

import AuthLayout from "../layouts/AuthLayout.jsx";
import StoreLayout from "../layouts/StoreLayout.jsx";
import DashboardLayout from "../layouts/MainLayout.jsx";

import Login from '/src/Home/Login.jsx';
import Register from '/src/Home/Register.jsx';
import ForgotPassword from "@/Home/ForgotPassword.jsx";
import ResetPassword from "@/Home/ResetPassword.jsx";

import PembeliProfile from '/src/ProfilePembeli/PembeliProfile.jsx';
import DetailPemesanan from '/src/ProfilePembeli/DetailPemesanan.jsx';

import OrganisasiProfile from '/src/ProfileOrganisasi/OrganisasiProfile.jsx';

import CSDash from '@/DashboardCS/CSDash.jsx';

import Home from '/src/Home/Home.jsx';
import ProductHome from '/src/Products/ProductHome.jsx';
import DetailProduct from '/src/Products/DetailProduct.jsx';
import ProtectedRoute from './ProtectedRoutes.jsx';
import RedirectIfLoggedIn from './RedirectIfLoggedIn.jsx';
import OrganisasiList from "@/DashboardAdmin/OrganisasiList.jsx";
import ResetPasswordPegawai from "@/DashboardAdmin/ResetPasswordPegawai.jsx";


const router = createBrowserRouter([
    {
        path: "*",
        element: <div>Routes Not Found!</div>
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
                path: "/pembeli/profile",
                element: (
                    <ProtectedRoute allowedRoles={["Pembeli"]}>
                        <PembeliProfile />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/pembeli/profile/pemesanan/:id",
                element: (
                    <ProtectedRoute allowedRoles={["Pembeli"]}>
                        <DetailPemesanan />
                    </ProtectedRoute>
                )
            },
            {
                path: "/organisasi/profile",
                element: (
                    <ProtectedRoute allowedRoles={["Organisasi"]}>
                        <OrganisasiProfile />
                    </ProtectedRoute>
                ),
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
    {
        element: <DashboardLayout />,
        children: [
            {
                path: "/cs/dashboard",
                element: (
                    <ProtectedRoute allowedRoles={["Customer Service"]}>
                        <CSDash />
                    </ProtectedRoute>
                )
            },
            {
                path: "admin/dashboard/organisasi",
                element: (
                    <ProtectedRoute allowedRoles={["Admin"]}>
                        <OrganisasiList />
                    </ProtectedRoute>
                )
            },
            {
                path: "admin/dashboard/reset-pass",
                element: (
                    <ProtectedRoute allowedRoles={["Admin"]}>
                        <ResetPasswordPegawai />
                    </ProtectedRoute>
                )
            }
        ],
    }
]);

const AppRouter = () => {
    return (
        <>
            <RouterProvider router={router} />
        </>
    );
};

export default AppRouter;
