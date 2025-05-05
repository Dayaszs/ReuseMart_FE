import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, Building2, LogOut } from 'lucide-react';

export default function DashboardLayout() {
    const location = useLocation();

    const menuItems = [
        { to: "/dashboard", label: "Beranda", icon: <Home size={18} /> },
        { to: "/dashboard/organisasi", label: "Organisasi", icon: <Building2 size={18} /> },
        { to: "/logout", label: "Keluar", icon: <LogOut size={18} /> },
    ];

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <aside className="w-64 bg-green-600 text-white flex flex-col fixed h-full">
                <div className="flex items-center gap-3 p-4 border-b border-green-500">
                    <div className="w-10 h-10">
                        <img
                            className="w-full h-full object-contain"
                            src="./logo.png" alt="Logo"
                        />
                    </div>
                    <div className="text-[27px] font-semibold">
                        Reusemart
                    </div>
                </div>
                <nav className="flex-1 px-4 py-6 space-y-2">
                    {menuItems.map((item, idx) => (
                        <Link
                            key={idx}
                            to={item.to}
                            className={`flex items-center gap-2 p-2 rounded-md transition ${location.pathname === item.to
                                ? "bg-green-700"
                                : "hover:bg-green-500"
                                }`}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>
            </aside>

            {/* Main area */}
            <div className="flex-1 ml-64 flex flex-col">
                {/* Topbar */}
                <nav className="h-18 bg-white shadow flex items-center justify-end px-6 border-b">
                    <div className="text-gray-700 font-medium">Admin</div>
                </nav>

                {/* Page Content */}
                <main className="flex-1 p-6 bg-gray-50 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
