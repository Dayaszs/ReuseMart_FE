import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import api from '../routes/api';
import { Card, Pagination } from "flowbite-react";
import { PulseLoader } from 'react-spinners';

const PembeliProfile = () => {
    const [user, setUser] = useState(null);
    const [requestDonasi, setRequestDonasi] = useState(null);
    const [loading, setLoading] = useState(true);
    const [lastPage, setLastPage] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    const onPageChange = (page) => setCurrentPage(page);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${api}/getprofile?page=${currentPage}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setUser(response.data.user);
                setLastPage(response.data.request_donasi.last_page);
                setRequestDonasi(response.data.request_donasi);
            } catch (error) {
                console.error('Error fetching user profile:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [currentPage]);

    if (loading) {
        return (
            <Card className="w-full h-full bg-white/90 backdrop-blur-md p-6 items-center flex justify-center">
                <PulseLoader size={15} color="#61d52c" />
            </Card>
        );
    }

        return (
            <Card className="w-full bg-white/90 backdrop-blur-md p-6">
                <div className="flex flex-col items-center space-y-4">
                    <h1 className="text-xl font-bold">Profil Organisasi</h1>
                    <div className="flex justify-between items-center mb-2 gap-6">
                        <img
                            src={user?.url_gambar}
                            alt="Profile"
                            className="w-32 h-32 rounded-full object-cover"
                        />
                    </div>

                    <div className="text-center">
                        <p>Nama: {user?.nama}</p>
                        <p>Email: {user?.email}</p>
                        <p>No Telepon: {user?.no_telp}</p>
                    </div>
                </div>

                <div className="mt-6">
                    <h2 className="text-lg font-semibold mb-4">Daftar Request Donasi:</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        
                    </div>

                    <div className="flex justify-center mt-6">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={lastPage}
                            onPageChange={onPageChange}
                        />
                    </div>
                </div>
            </Card>
        );
 
};

export default PembeliProfile;
