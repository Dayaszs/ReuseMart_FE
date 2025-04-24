
import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import MainLayout from "../layouts/MainLayout";
import Register from '/src/Home/Register.jsx';
import Home from '/src/Home/Home.jsx';
import Login from '/src/Home/Login.jsx';
import ProductHome from '/src/Products/ProductHome.jsx';

const router = createBrowserRouter([
    {
        path: "*",
        element: <div>Routes Not Found!</div>
    },
    {
        children: [
            {
                path: "/",
                element: <Home />,
            },
            {
                path: "/login",
                element: <Login />,
            },
            {
                path: "/register",
                element: <Register />,
            },
            {
                path: "/products",
                element: <ProductHome />,
            },
        ],
    },
]);

const AppRouter = () => {
    return (
        <>
            {/* <Toaster position="top-center" /> */}
            {/* <Toaster position="top-center" richColors /> */}
            <RouterProvider router={router} />
        </>
    );
};

export default AppRouter;