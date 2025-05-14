import {
  Navbar,
  NavbarBrand,
  NavbarToggle,
  NavbarCollapse,
  Toast,
} from "flowbite-react";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import api from '../routes/api';
import { PulseLoader } from 'react-spinners';
import { Home, Menu, Building2, Check, User2 } from 'lucide-react';
import { MdPassword } from "react-icons/md";


function NavigationBar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [nama, setNama] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [showToast, setShowToast] = useState(false);

  const [loadingLogout, setLoadingLogout] = useState(false);


  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      setIsLoggedIn(true);
      const fetchUserRole = async () => {
        try {
          const response = await axios.get(`${api}/cekrole`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUserRole(response.data.role);

          if (response.data.nama != null) {
            setNama(response.data.nama);
          }

        } catch (error) {
          console.error("Failed to fetch user role", error);
        } finally {
          setLoading(false);
        }
      };
      fetchUserRole();
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogout = async () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      setLoadingLogout(true);
      try {
        await axios.post(`${api}/logout`, {}, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });

 
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
          navigate("/login");
        }, 2000);

      } catch (error) {
        console.error("Logout failed", error);
      } finally {

       
        setLoadingLogout(false);
        localStorage.removeItem("token");
        setIsLoggedIn(false);

      }
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="relative">
      {!['Pembeli', 'Organisasi', 'Penitip'].includes(userRole) && (
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-green-600 text-white transform transition-transform duration-300 ease-in-out z-40 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex items-center gap-3 p-4 border-b border-green-500">
          <div className="w-10 h-10">
            <img
              className="w-full h-full object-contain"
              src="/logo.png"
              alt="Logo"
            />
          </div>
          <h1 className="text-white text-2xl font-bold flex items-center m-0">
            <span className="text-green-300">Re</span>
            <span>use</span>
            <span className="text-yellow-300">mart</span>
          </h1>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <Link
            to="/"
            className={`flex items-center gap-2 py-2 px-4 rounded ${isActive("/") ? "bg-green-700 text-gray-300" : "hover:bg-green-700"
              }`}
          >
            <Home size={18} />
            <span>Home</span>
          </Link>

        {userRole === 'Pembeli' && (
          <>
            <Link
              to="/pembeli/profile"
              className={`flex items-center gap-2 py-2 px-4 rounded ${isActive("/pembeli/profile") ? "bg-green-700 text-gray-300" : "hover:bg-green-700"
                }`}
            >
              Profile
            </Link>
            <Link
              to="/products"
              className={`flex items-center gap-2 py-2 px-4 rounded ${
                isActive("/products") ? "bg-green-700 text-gray-300" : "hover:bg-green-700"
              }`}
            >
              Barang
            </Link>
          </>
          )}

          {userRole === 'Customer Service' && (
            <Link
              to="/cs/dashboard"
              className={`flex items-center gap-2 py-2 px-4 rounded ${isActive("/cs/dashboard") ? "bg-green-700 text-gray-300" : "hover:bg-green-700"
                }`}
            >
              Dashboard & List Penitip
            </Link>
          )}

          {userRole === 'Organisasi' && (
            <Link
              to="/organisasi/profile"
              className={`flex items-center gap-2 py-2 px-4 rounded ${isActive("/organisasi/profile") ? "bg-green-700 text-gray-300" : "hover:bg-green-700"
                }`}
            >
              Profile
            </Link>
          )}

          {userRole === 'Admin' && (
            <>
              <Link
                to="/admin/dashboard/organisasi"
                className={`flex items-center gap-2 py-2 px-4 rounded ${isActive("/admin/dashboard/organisasi") ? "bg-green-700 text-gray-300" : "hover:bg-green-700"
                  }`}
              >
                <Building2 size={18} />
                <span>List Organisasi</span>
              </Link>

              <Link
                to="/admin/dashboard/pegawai"
                className={`flex items-center gap-2 py-2 px-4 rounded ${isActive("/admin/dashboard/pegawai") ? "bg-green-700 text-gray-300" : "hover:bg-green-700"
                  }`}
              >
                <User2 size={18} />
                <span>List Pegawai</span>
              </Link>

              <Link
                to="/admin/dashboard/reset-pass"
                className={`flex items-center gap-2 py-2 px-4 rounded ${isActive("/admin/dashboard/reset-pass") ? "bg-green-700 text-gray-300" : "hover:bg-green-700"
                  }`}
              >
                <MdPassword size={18} />
                <span>Reset Password</span>
              </Link>

            </>
          )}

          {isLoggedIn && userRole && (
            <div className="px-4 py-3 border-t border-green-500 bg-green-700 text-sm text-gray-200">
              Logged in as: <span className="font-semibold">
                {nama} {userRole !== 'Pembeli' ? `(${userRole})` : ''}
              </span>
            </div>
          )}

        </nav>
      </div>
      )}


      {sidebarOpen && !['Pembeli', 'Organisasi', 'Penitip'].includes(userRole) && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/30 z-30"
        ></div>
      )}


      <Navbar
        fixed="top"
        expand="lg"
        className="bg-green-600/80 shadow-md z-50"
      >
        <div className="flex items-center gap-3">

        {!['Pembeli', 'Organisasi', 'Penitip'].includes(userRole) && (
          <button
            className="text-white mr-3 focus:outline-none"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu size={28} />
          </button>
        )}

          <NavbarBrand as={Link} to="/" className="flex items-center cursor-pointer">
            <img
              src='/logo.png'
              alt="Reusemart Logo"
              className="w-12 h-12 mr-2.5"
            />
            <h1 className="text-white text-4xl font-bold flex items-center m-0">
              <span className="text-green-300">Re</span>
              <span>use</span>
              <span className="text-yellow-300">mart</span>
            </h1>
          </NavbarBrand>
        </div>
        <NavbarToggle />
        <NavbarCollapse className="justify-end">
          {loading ? (
            <PulseLoader size={8} color="#ffffff" />
          ) : isLoggedIn ? (
            <>
              {userRole === 'Pembeli' && (
                <Link to="/pembeli/profile" className="mr-2">
                  <button className="bg-transparent hover:bg-white/10 text-white font-semibold hover:text-white py-2 px-4 border border-white rounded transition-colors">
                    Profile
                  </button>
                </Link>
              )}
              {userRole === 'Penitip' && (
                <Link to="/penitip/profile" className="mr-2">
                  <button className="bg-transparent hover:bg-white/10 text-white font-semibold hover:text-white py-2 px-4 border border-white rounded transition-colors">
                    Profile
                  </button>
                </Link>
              )}
              {userRole === 'Customer Service' && (
                <Link to="/cs/dashboard" className="mr-2">
                  <button className="bg-transparent hover:bg-white/10 text-white font-semibold hover:text-white py-2 px-4 border border-white rounded transition-colors">
                    Dashboard & List Penitip
                  </button>
                </Link>
              )}
              {userRole === 'Organisasi' && (
                <Link to="/organisasi/profile" className="mr-2">
                  <button className="bg-transparent hover:bg-white/10 text-white font-semibold hover:text-white py-2 px-4 border border-white rounded transition-colors">
                    Profile
                  </button>
                </Link>
              )}
              {userRole === 'Admin' && (
                <Link to="admin/dashboard/organisasi" className="mr-2">
                  <button className="bg-transparent hover:bg-white/10 text-white font-semibold hover:text-white py-2 px-4 border border-white rounded transition-colors">
                    Dashboard
                  </button>
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition-colors"
              >
                {loadingLogout ? <PulseLoader size={8} color="#ffffff" /> : 'Logout'}
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="mr-2">
                <button className="bg-transparent hover:bg-white/10 text-white font-semibold hover:text-white py-2 px-4 border border-white rounded transition-colors">
                  Login
                </button>
              </Link>
              <Link to="/register">
                <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow transition-colors">
                  Register
                </button>
              </Link>
            </>
          )}
        </NavbarCollapse>
      </Navbar>

      {showToast && (
        <div className="fixed top-5 right-5 z-100">
            <Toast className="bg-green-500 text-white">
                <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500">
                    <Check color="#00b315" />
                </div>
                <div className="ml-3 text-sm font-normal">Logout Berhasil!</div>
            </Toast>
        </div>
      )}
    </div>   
  );
}

export default NavigationBar;
