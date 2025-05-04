import {
  Navbar,
  NavbarBrand,
  NavbarToggle,
  NavbarCollapse
} from "flowbite-react";
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import api from '../routes/api';
import { PulseLoader } from 'react-spinners';

function NavigationBar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
      try {
        await axios.post(`${api}/logout`, {}, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
      } catch (error) {
        console.error("Logout failed", error);
      } finally {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        navigate("/");
      }
    }
  };

  return (
    <div className="relative">
      <Navbar
        fixed="top"
        expand="lg"
        className="bg-green-600/80 shadow-md"
      >
        <NavbarBrand as={Link} to="/" className="flex items-center cursor-pointer">
          <img
            src='./logo.png'
            alt="Reusemart Logo"
            className="w-12 h-12 mr-2.5"
          />
          <h1 className="text-white text-4xl font-bold flex items-center m-0">
            <span className="text-green-300">Re</span>
            <span>use</span>
            <span className="text-yellow-300">mart</span>
          </h1>
        </NavbarBrand>
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

              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition-colors"
              >
                Logout
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
    </div>
  );
}

export default NavigationBar;
