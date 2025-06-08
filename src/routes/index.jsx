import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "flowbite-react";
import flowbiteTheme from "@/lib/theme/flowbiteTheme.js";

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
import PenitipProfile from "@/ProfilePenitip/PenitipProfile.jsx";

import CSDash from '@/DashboardCS/CSDash.jsx';
import VerifikasiPembayaran from '@/DashboardCS/VerifikasiPembayaran.jsx';

import ListRequestDonasi from '@/DashboardOwner/ListRequestDonasi.jsx';
import HistoriBarangDonasi from '@/DashboardOwner/HistoriBarangDonasi.jsx';
import MasterPegawai from "@/DashboardAdmin/MasterPegawai.jsx";
import RincianPenitipan from "@/DashboardGudang/RincianPenitipan.jsx";

import Home from '/src/Home/Home.jsx';
import ProductHome from '/src/Products/ProductHome.jsx';
import DetailProduct from '/src/Products/DetailProduct.jsx';
import ProtectedRoute from './ProtectedRoutes.jsx';
import RedirectIfLoggedIn from './RedirectIfLoggedIn.jsx';
import OrganisasiList from "@/DashboardAdmin/OrganisasiList.jsx";

import ListBarangKirim from "@/DashboardGudang/ListBarangKirim.jsx";
import ListPenitipan from "@/DashboardGudang/ListPenitipan.jsx";

import ResetPasswordPegawai from "@/DashboardAdmin/ResetPasswordPegawai.jsx";
import UnauthorizedPage from "@/pages/Unauthorized.jsx";
import CartPage from "@/Transaction/CartPage.jsx";
import CheckOutPage from "@/Transaction/CheckOutPage.jsx";
import PembayaranPage from "@/Transaction/PembayaranPage.jsx";

import ListKlaimMerchandise from "@/DashboardCS/ListKlaimMerchandise.jsx"
import ListPenitip from "@/DashboardOwner/ListPenitip.jsx";

import DaftarLaporan from "@/DashboardOwner/DaftarLaporan.jsx";
import LaporanBarangHabisMasaTitip from "@/DashboardOwner/LaporanBarangHabisMasaTitip.jsx";
import LaporanPerKategori from "@/DashboardOwner/LaporanPerKategori.jsx";
import LaporanStokGudang from "@/DashboardOwner/LaporanStokGudang.jsx";
import LaporanKomisiBulanan from "@/DashboardOwner/LaporanKomisiBulanan.jsx";

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
                path: "/unauthorized",
                element: <UnauthorizedPage />,
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
                path: "/pembeli/cart",
                element: (
                    <ProtectedRoute allowedRoles={["Pembeli"]}>
                        <CartPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/pembeli/checkout",
                element: (
                    <ProtectedRoute allowedRoles={["Pembeli"]}>
                        <CheckOutPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/pembeli/checkout/pembayaran/:id",
                element: (
                    <ProtectedRoute allowedRoles={["Pembeli"]}>
                        <PembayaranPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/penitip/profile",
                element: (
                    <ProtectedRoute allowedRoles={["Penitip"]}>
                        <PenitipProfile />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/products/detail/:id",
                element: (
                    // <ProtectedRoute allowedRoles={["Pembeli"]}>
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
                path: "/cs/verifikasi-pembayaran",
                element: (
                    <ProtectedRoute allowedRoles={["Customer Service"]}>
                        <VerifikasiPembayaran />
                    </ProtectedRoute>
                )
            },
            {
                path: "/cs/list-klaim",
                element: (
                    <ProtectedRoute allowedRoles={["Customer Service"]}>
                        <ListKlaimMerchandise />
                    </ProtectedRoute>
                )
            },
            {
                path: "/gudang/dashboard/rincian-penitipan",
                element: (
                    <ProtectedRoute allowedRoles={["Gudang"]}>
                        <RincianPenitipan/>
                    </ProtectedRoute>
                )
            },
            {
                path: "/gudang/dashboard/penitipan",
                element: (
                    <ProtectedRoute allowedRoles={["Gudang"]}>
                        <ListPenitipan/>
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
                path: "admin/dashboard/pegawai",
                element: (
                    <ProtectedRoute allowedRoles={["Admin"]}>
                        <MasterPegawai />
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
            },
            {
                path: "admin/dashboard/pegawai",
                element: (
                    <ProtectedRoute allowedRoles={["Admin"]}>
                        <MasterPegawai />
                    </ProtectedRoute>
                )
            },
            {
                path: "owner/request",
                element: (
                    <ProtectedRoute allowedRoles={["Owner"]}>
                        <ListRequestDonasi />
                    </ProtectedRoute>
                )
            },
            {
                path: "owner/request/histori",
                element: (
                    <ProtectedRoute allowedRoles={["Owner"]}>
                        <HistoriBarangDonasi />
                    </ProtectedRoute>
                )
            },
            {
                path: "owner/list-penitip",
                element: (
                    <ProtectedRoute allowedRoles={["Owner"]}>
                        <ListPenitip />
                    </ProtectedRoute>
                )
            },
            {
                path: "gudang/dashboard/pemesanan",
                element: (
                    <ProtectedRoute allowedRoles={["Gudang"]}>
                        <ListBarangKirim />
                    </ProtectedRoute>
                )
            },
            {
                path: "owner/daftar-laporan",
                element: (
                        <DaftarLaporan></DaftarLaporan>
                )
            },
            {
                path: "/laporan-stok-gudang",
                element: (
                        <LaporanStokGudang/>
                )
            },
            {
                path: "/laporan-komisi-bulanan",
                element: (
                        <LaporanKomisiBulanan/>
                )
            },
            {
                path: "/laporan-barang-habis-masa-titip",
                element: (
                    <LaporanBarangHabisMasaTitip/>
                )
            },
            {
                path: "/laporan-per-kategori",
                element: (
                    <LaporanPerKategori/>
                )
            }
        ],
    }
]);

const AppRouter = () => {
    return (
        <>
            <ThemeProvider theme={flowbiteTheme}>
                <RouterProvider router={router} />
            </ThemeProvider>
        </>
    );
};

export default AppRouter;
