import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import api from '../routes/api';
import { Card, Pagination } from "flowbite-react";
import { PulseLoader } from 'react-spinners';

const PembeliProfile = () => {
    const [user, setUser] = useState(null);
    const [pemesanan, setPemesanan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [lastPage, setLastPage] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("");
    const [loadingPemesanan, setLoadingPemesanan] = useState(true);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const onPageChange = (page) => setCurrentPage(page);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoadingPemesanan(true);
                const token = localStorage.getItem('token');
                const response = await axios.get(`${api}/getprofile?page=${currentPage}&search=${search}&filter=${filter}&start_date=${startDate}&end_date=${endDate}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });


                setPemesanan(response.data.pemesanan);
                setLastPage(response.data.pemesanan.last_page);
                setUser(response.data.user);
            } catch (error) {
                console.error('Error fetching user profile:', error);
            } finally {
                setLoading(false);
                setLoadingPemesanan(false);
            }
        };

        fetchProfile();
    }, [currentPage,search,filter,startDate,endDate]);

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
                    <h1 className="text-xl font-bold">Profil Pembeli</h1>
                    <div className="flex justify-between items-center mb-2 gap-6">
                        <img
                            src={user?.url_gambar}
                            alt="Profile"
                            className="w-32 h-32 rounded-full object-cover"
                        />
                    </div>

                    <div className="text-center">
                        <h1 className="text-green-400 font-semibold">{user?.poin} Poin</h1>
                        <p>Nama: {user?.nama_pembeli}</p>
                        <p>Email: {user?.email}</p>
                        <p>No Telepon: {user?.no_telp}</p>
                    </div>
                </div>

                <div className="mt-6">
                    <div className='flex flex-wrap items-center justify-between mt-4 mb-4'>
                        <h2 className="text-lg font-semibold mb-4">Daftar Pemesanan:</h2>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
                        <div className="flex flex-col">
                                <label htmlFor="search" className="text-xs text-gray-600 mb-1">Cari Pemesanan</label>
                                <input
                                    id="search"
                                    type="text"
                                    placeholder="ID, Metode Pengambilan, Biaya Total..."
                                    value={search}
                                    onChange={(e) => {
                                        setSearch(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-green-400"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="status-filter" className="text-xs text-gray-600 mb-1">Status</label>
                                <select
                                    id="status-filter"
                                    value={filter}
                                    onChange={(e) => {
                                        setFilter(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-green-400"
                                >
                                    <option value="">Semua Status</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Disiapkan">Disiapkan</option>
                                    <option value="Dikirim">Dikirim</option>
                                    <option value="Siap Diambil">Siap Diambil</option>
                                    <option value="Sudah Sampai">Sudah Sampai</option>
                                    <option value="Selesai">Selesai</option>
                                    <option value="Hangus">Hangus</option>
                                    <option value="Batal">Batal</option>
                                </select>
                            </div>

                            <div className="flex flex-col w-full md:w-auto">
                                <label className="text-xs text-gray-600 mb-1">Tanggal Pemesanan</label>
                                <div className="flex gap-2">
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => {
                                            setStartDate(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                        className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-green-400"
                                    />
                                    <span className="text-sm flex items-center">--</span>
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => {
                                            setEndDate(e.target.value);
                                            setCurrentPage(1);
                                        }}
                                        className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-green-400"
                                    />
                                </div>
                            </div>
                        </div>



                    </div>
                    {loadingPemesanan ? 
                        <Card className="w-full h-full bg-white/90 backdrop-blur-md p-6 items-center flex justify-center">
                            <PulseLoader size={15} color="#61d52c" />
                        </Card>
                    :
                    
                    (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {pemesanan.data.length === 0 ? (
                            <Card className="col-span-full p-2 shadow-md cursor-pointer min-h-[100px] text-center">
                                <h3 className="text-lg font-semibold">Tidak ada pemesanan</h3>
                                </Card>
                            ): (

                                pemesanan?.data?.map((item, index) => (
                                    <Link to={`/pembeli/profile/pemesanan/${item.id_pemesanan}`} key={index} className="no-underline">
                                        <Card className="p-2 shadow-md cursor-pointer min-h-[100px]">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-lg font-semibold">ID Pemesanan: {item.id_pemesanan}</h3>
                                                <span
                                                    className={`text-m font-semibold px-2 py-1 rounded 
                                                    ${
                                                        item.status === 'Selesai'
                                                            ? 'bg-green-100 text-green-700'
                                                            : item.status === 'Disiapkan'
                                                            ? 'bg-yellow-100 text-yellow-700'
                                                            : item.status === 'Dikirim'
                                                            ? 'bg-blue-100 text-blue-700'
                                                            : item.status === 'Pending'
                                                            ? 'bg-orange-100 text-orange-700'
                                                            : item.status === 'Hangus'
                                                            ? 'bg-red-100 text-red-700'
                                                            : item.status === 'Batal'
                                                            ? 'bg-red-100 text-red-700'
                                                            : item.status === 'Siap Diambil'
                                                            ? 'bg-blue-100 text-blue-700'
                                                            : item.status === 'Sudah Sampai'
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-gray-100 text-gray-700'
                                                    }`}
                                                >
                                                    {item.status}
                                                </span>
                                            </div>
                                            <div className="space-y-1 text-sm">
                                                <p><span className="font-medium">Tanggal Pemesanan:</span> {item.tanggal_pemesanan}</p>
                                                <p>
                                                    <span className="font-medium">Tanggal Jadwal:</span>{' '}
                                                    {item.tanggal_jadwal || <span className="text-gray-400"> -</span>}
                                                </p>
                                                <p>
                                                    <span className="font-medium">Tanggal Selesai:</span>{' '}
                                                    {item.tanggal_selesai || <span className="text-gray-400"> -</span>}
                                                </p>
                                                <p><span className="font-medium">Metode Pengambilan:</span> {item.metode_pengambilan}</p>
                                                <p>
                                                    <span className="font-medium">Ongkos Kirim:</span>{' '}
                                                    {item.ongkos_kirim !== null
                                                        ? `Rp ${parseInt(item.ongkos_kirim).toLocaleString('id-ID')}`
                                                        : 'Tidak ada'}
                                                </p>
                                                <p><span className="font-medium">Biaya Total:</span> Rp {parseInt(item.biaya_total).toLocaleString('id-ID')}</p>
                                            </div>
                                        </Card>
                                    </Link>
                                ))
                            )}
                    </div> )}

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
