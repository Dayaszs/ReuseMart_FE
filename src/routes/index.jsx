import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Register from '/src/Home/Register.jsx';
import Home from '/src/Home/Home.jsx';
import Login from '/src/Home/Login.jsx';
import ProductHome from '/src/Products/ProductHome.jsx';
import ProtectedRoute from './ProtectedRoutes.jsx';
import RedirectIfLoggedIn from './RedirectIfLoggedIn.jsx';

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
                path: "/products",
                element: (
                    <ProtectedRoute allowedRoles={["owner", "admin", "gudang"]}>
                        <ProductHome />
                    </ProtectedRoute>
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
