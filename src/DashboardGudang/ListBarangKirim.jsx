import React, { useEffect, useState, lazy, Suspense } from 'react';
import { IoIosSearch } from "react-icons/io";
import { PulseLoader } from 'react-spinners';
import { Button, Pagination, Card, Tabs, TabItem, Alert } from "flowbite-react";
import axios from 'axios';
import api from '../routes/api';
import GudangKirimBarangModal from '../Components/modals/GudangKirimBarangModal';

// Lazy load the components
const ListBarangPenitip = lazy(() => import('./ListBarangPenitip'));
const ListBarangPembeli = lazy(() => import('./ListBarangKonfirmasi'));

const ListBarangKirim = () => {
    const [pemesanan, setPemesanan] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [pemesananId, setPemesananId] = useState(null);
    const [isKirim, setIsKirim] = useState(false);
    const [activeTab, setActiveTab] = useState(0);

    const onPageChange = (page) => setCurrentPage(page);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const fetchRincianPenitipan = async () => {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        const response = await axios.get(
            `${api}/gudang/pemesanan?page=${currentPage}&search=${searchTerm}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
       
        setPemesanan(response.data.pemesanan);
        setLastPage(response.data.pemesanan.last_page);
        setIsLoading(false);
    };

    const handleOpenModal = (id, isKirimAction) => {
        setPemesananId(id);
        setIsKirim(isKirimAction);
        setShowModal(true);
    };

    useEffect(() => {
        fetchRincianPenitipan();
    }, [currentPage, searchTerm]);

    if (error)
        return <p className='text-center text-red-600'>{error}</p>;

    return (
        <Card className="w-full bg-white/90 backdrop-blur-md p-6">
            <Tabs 
                aria-label="Tabs with underline" 
                variant="underline"
                onActiveTabChange={(tab) => setActiveTab(tab)}
            >
                <TabItem active title="List Barang Kirim">
                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                        {/* Search Bar */}
                        <div className="flex flex-col md:flex-row items-center justify-start flex-wrap gap-4 py-4 ps-6 bg-white">
                            <label htmlFor="table-search-users" className="sr-only">Search</label>
                            <p className='font-bold'>List Barang Kirim</p>
                            <div className="relative">
                                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                    <IoIosSearch />
                                </div>
                                <input
                                    type="text"
                                    id="table-search-users"
                                    className="block w-80 ps-10 pt-2 pb-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:outline-green-500"
                                    placeholder="Cari..."
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                />
                            </div>
                        </div>

                        {/* Table */}
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3">
                                        ID Pemesanan
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Tanggal Pemesanan
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Alamat Penerima
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Metode Pengambilan
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Biaya Total
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={6}>
                                            <div className="flex justify-center items-center py-8">
                                                <PulseLoader size={8} color="#057A55" />
                                            </div>
                                        </td>
                                    </tr>
                                ) : pemesanan?.data?.length > 0 ? (
                                    <>
                                        {pemesanan.data.map((item) => (
                                            <tr key={item.id_pemesanan} className="bg-white border-b dark:bg-gray-800 border-gray-200 hover:bg-gray-50">
                                                <td className="px-6 py-4">
                                                    {item.id_pemesanan}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {formatDate(item.tanggal_pemesanan)}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {item.alamat_penerima}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`font-semibold ${item.metode_pengambilan === 'Dikirim' ? 'text-blue-600' : item.metode_pengambilan === 'Diambil' ? 'text-red-600' : ''}`}>
                                                        {item.metode_pengambilan}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    Rp. {parseInt(item.biaya_total).toLocaleString('id-ID')}
                                                </td>             
                                                <td className="px-6 py-4">
                                                    {item.metode_pengambilan === 'Diambil' ? (
                                                        <button
                                                            className='bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition-colors w-50 text-center'
                                                            type="button"
                                                            onClick={() => handleOpenModal(item.id_pemesanan, false)}
                                                        >
                                                            Atur Pengambilan
                                                        </button>
                                                    ) : item.metode_pengambilan === 'Dikirim' ? (
                                                        <button
                                                            className='bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition-colors w-50 text-center'
                                                            type="button"
                                                            onClick={() => handleOpenModal(item.id_pemesanan, true)}
                                                        >
                                                            Atur Pengiriman
                                                        </button>
                                                    ) : null}
                                                </td>
                                            </tr>
                                        ))}
                                    </>
                                ) : (
                                    <tr>
                                        <td colSpan={6}>
                                            <div className="flex justify-center items-center py-8 text-gray-500">
                                                Tidak ada pemesanan
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        <div className="flex justify-center mt-6">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={lastPage}
                                onPageChange={onPageChange}
                            />
                        </div>
                    </div>
                </TabItem>
                <TabItem title="Proses & Konfirmasi Barang">
                    <Suspense fallback={
                        <div className="flex justify-center items-center py-8">
                            <PulseLoader size={8} color="#057A55" />
                        </div>
                    }>
                        {activeTab === 1 && <ListBarangPembeli />}
                    </Suspense>
                </TabItem>
                <TabItem title="Pengambilan Penitip">
                    <Suspense fallback={
                        <div className="flex justify-center items-center py-8">
                            <PulseLoader size={8} color="#057A55" />
                        </div>
                    }>
                        {activeTab === 2 && <ListBarangPenitip />}
                    </Suspense>
                </TabItem>
            </Tabs> 
            <GudangKirimBarangModal 
                show={showModal} 
                onClose={() => setShowModal(false)} 
                pemesananId={pemesananId} 
                kirim={isKirim}
                onSuccess={fetchRincianPenitipan}
            />
        </Card>
    );
}

export default ListBarangKirim; 