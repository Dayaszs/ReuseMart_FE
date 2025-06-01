import React, { useEffect, useState } from 'react';
import { Card, Button, Pagination } from 'flowbite-react';
import axios from 'axios';
import api from '../routes/api';
import { PulseLoader } from 'react-spinners';
import EditPenitipModal from '@/Components/modals/EditPenitipModal';
import HapusPenitipModal from '@/Components/modals/HapusPenitipModal';
import TambahPenitipModal from '@/Components/modals/TambahPenitipModal';

const CSDash = () => {
    const [penitip, setPenitip] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingPenitip, setLoadingPenitip] = useState(true);

    const [selectedPenitip, setSelectedPenitip] = useState(null);
    const [showModalEdit, setShowModalEdit] = useState(false);

    const [showModalHapus, setShowModalHapus] = useState(false);

    const [showModalTambah, setShowModalTambah] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(null);
    const [search, setSearch] = useState("");

    const onPageChange = (page) => setCurrentPage(page);

    useEffect(() => {
        const fetchPenitip = async () => {
            setLoadingPenitip(true);
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${api}/getpenitip?page=${currentPage}&search=${search}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setPenitip(response.data.penitip.data);
                setLastPage(response.data.penitip.last_page);
            } catch (error) {
                console.error('Error fetching penitip:', error);
            } finally {
                setLoading(false);
                setLoadingPenitip(false);
            }
        };

        fetchPenitip();
    }, [search, currentPage]);

    if (loading) {
        return (
            <Card className="w-full min-h-screen bg-white/90 backdrop-blur-md p-6 items-center flex justify-center">
                <PulseLoader size={15} color="#61d52c" />
            </Card>
        );
    }


    return (
        <Card className="w-full bg-white/90 backdrop-blur-md p-6">
            <div className="flex flex-col w-full h-full p-4">
                <h1 className="text-2xl font-bold">Customer Service Dashboard</h1>
                <p className="text-gray-600">Selamat Datang di Customer Service Dashboard</p>


                <div className="flex flex-wrap items-center justify-between mt-4 mb-4">
                    <h1 className="text-2xl font-bold">List Penitip</h1>
                    <input
                        type="text"
                        placeholder="Cari Penitip..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-1 w-64 focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                </div>

                <div className='mb-4'>
                    <Button
                        onClick={() => setShowModalTambah(true)}
                        className='bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded transition-colors'>
                        Tambah Penitip
                    </Button>
                </div>

                {loadingPenitip ?
                    <Card className="w-full h-full bg-white/90 backdrop-blur-md p-6 items-center flex justify-center">
                        <PulseLoader size={15} color="#61d52c" />
                    </Card>
                    :

                    (

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {penitip?.map((item, index) => (
                                <Card
                                    key={index}
                                    className="p-2 shadow-md min-h-[100px] mb-2 relative"
                                >
                                    <div className="flex flex-wrap items-center justify-between mt-4 mb-4">
                                        <div>
                                            <h3 className="text-lg font-semibold">
                                                {item.id_penitip} - {item.nama_penitip} - Poin {item.poin}
                                            </h3>
                                            <div className="grid grid-cols-[auto_1fr] gap-x-2 text-md">
                                                <span>Email</span>
                                                <span>: {item.email}</span>
                                                <span>No. KTP</span>
                                                <span>: {item.no_ktp}</span>
                                                <span>Alamat</span>
                                                <span>: {item.alamat}</span>
                                                <span>No. Telepon</span>
                                                <span>: {item.no_telp}</span>
                                                <span>Avg Rating</span>
                                                <span>: {item.avg_rating}</span>
                                                <span>Saldo</span>
                                                <span>: Rp {parseInt(item.saldo).toLocaleString('id-ID')}</span>
                                            </div>
                                        </div>

                                        <div className='flex flex-row gap-2'>
                                            <Button
                                                className='bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded transition-colors'
                                                onClick={() => {
                                                    setSelectedPenitip(item);
                                                    setShowModalEdit(true);
                                                }}
                                            >
                                                Edit
                                            </Button>

                                            <Button
                                                className='bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition-colors'
                                                onClick={() => {
                                                    setSelectedPenitip(item);
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
                    )}
                <div className="flex justify-center mt-6">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={lastPage}
                        onPageChange={onPageChange}
                    />
                </div>
            </div>
            <EditPenitipModal
                show={showModalEdit}
                onClose={() => setShowModalEdit(false)}
                penitipData={selectedPenitip}
            />
            <HapusPenitipModal
                show={showModalHapus}
                onClose={() => setShowModalHapus(false)}
                penitipData={selectedPenitip}
            />
            <TambahPenitipModal
                show={showModalTambah}
                onClose={() => setShowModalTambah(false)}
            />
        </Card>


    );
}

export default CSDash;
