import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import api from '../routes/api';
import { Card, Pagination, Button } from "flowbite-react";
import { PulseLoader } from 'react-spinners';
import TambahRequestDonasiModal from '@/Components/modals/TambahRequestDonasiModal';
import HapusRequestDonasiModal from '@/Components/modals/HapusRequestDonasiModal';
import EditRequestDonasiModal from '@/Components/modals/EditRequestDonasiModal';

const OrganisasiProfile = () => {
    const [user, setUser] = useState(null);
    const [requestDonasi, setRequestDonasi] = useState(null);
    const [loading, setLoading] = useState(true);
    const [lastPage, setLastPage] = useState(null);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedRequest, setSelectedRequest] = useState(null);

    const [showModalEdit, setShowModalEdit] = useState(false);

    const [showModalHapus, setShowModalHapus] = useState(false);

    const [showModalTambah, setShowModalTambah] = useState(false);

    const onPageChange = (page) => setCurrentPage(page);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${api}/getprofile?page=${currentPage}&search=${search}`, {
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
    }, [currentPage, search]);

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
                    <div className='flex flex-wrap items-center justify-between mt-4 mb-4'>
                        <h2 className="text-lg font-semibold mb-4">Daftar Request Donasi:</h2>
                        <input
                        type="text"
                        placeholder="Cari request donasi..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-1 w-64 focus:outline-none focus:ring-2 focus:ring-green-400"
                        />
                    </div>

                    <div className='mb-4'>
                        <Button 
                            onClick={() => setShowModalTambah(true)}
                            className='bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded transition-colors'>
                            Tambah Request Donasi
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {requestDonasi?.data.map((item,index) => (
                            <Card key={index} className="p-2 shadow-md cursor-pointer min-h-[100px]">
                                
                                <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-lg font-semibold">ID Request: {item.id_request_donasi}</h3>
                                        <span
                                            className={`text-m font-semibold px-2 py-1 rounded 
                                            ${
                                                item.status === 'Selesai'
                                                    ? 'bg-green-100 text-green-700'
                                            
                                                    : item.status === 'Pending'
                                                    ? 'bg-orange-100 text-red-700'
                    
                                                    : 'bg-gray-100 text-gray-700'
                                            }`}
                                        >
                                            {item.status}
                                        </span>
                                </div>
                                
                                <div className="flex flex-wrap items-center justify-between mt-4 mb-4">
                                    <p><span className="font-medium">Deskripsi Request:</span> {item.deskripsi}</p>
                                    <div className='flex flex-row gap-2'>
                                        {item.status !== 'Selesai' && (
                                            <Button 
                                                className='bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded transition-colors'
                                                onClick={() => {
                                                    setSelectedRequest(item); 
                                                    setShowModalEdit(true);
                                                }}
                                            >
                                                Edit
                                            </Button>
                                        )}
                                        
                                        <Button 
                                            className='bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition-colors'
                                            onClick={() => {
                                                setSelectedRequest(item);
                                                setShowModalHapus(true);      
                                            }}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>

                    <div className="flex justify-center mt-6">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={lastPage}
                            onPageChange={onPageChange}
                        />
                    </div>
                </div>

                <TambahRequestDonasiModal
                    show={showModalTambah}
                    organisasiID={user.id_organisasi}
                    onClose={() => setShowModalTambah(false)}
                />
                <HapusRequestDonasiModal
                    show={showModalHapus}
                    onClose={() => setShowModalHapus(false)}
                    requestDonasi={selectedRequest}
                />
                <EditRequestDonasiModal
                    show={showModalEdit}
                    onClose={() => setShowModalEdit(false)}
                    requestDonasi={selectedRequest}
                />

            </Card>
        );
 
};

export default OrganisasiProfile;
