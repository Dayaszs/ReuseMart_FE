import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import api from '../routes/api';
import { Card, Pagination, Button } from "flowbite-react";
import { PulseLoader } from 'react-spinners';
import { getGambarBarang } from '@/api';
import { FaStar } from "react-icons/fa";
import DetailBarangPenitipModal from '@/Components/modals/DetailBarangPenitipModal';

const BarangPenitip = () => {
    const [barang, setBarang] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lastPage, setLastPage] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState('');
    const [loadingBarang, setLoadingBarang] = useState(false);
    const [filter, setFilter] = useState('');
    const [showDetailBarangPenitipModal, setShowDetailBarangPenitipModal] = useState(false);
    const [idBarang, setIdBarang] = useState(null);


    const onPageChange = (page) => setCurrentPage(page);

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    useEffect(() => {
        const fetchBarang = async () => {
            try {
                setLoadingBarang(true);
                const token = localStorage.getItem('token');
                const response = await axios.get(`${api}/penitip/barang?page=${currentPage}&search=${search}&filter=${filter}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setBarang(response.data.barang);
                setLastPage(response.data.barang.last_page);
            } catch (error) {

            } finally {
                setLoading(false);
                setLoadingBarang(false);
            }
        };
        fetchBarang();
    }, [currentPage, search, filter]);

    const handleAmbilBarang = async (id_barang) => {
        try {
            const confirmed = window.confirm('Apakah anda yakin ingin mengambil barang ini?');
            if (!confirmed) return;

            const token = localStorage.getItem('token');
            const response = await axios.post(`${api}/penitip/ambil-barang`, { id_barang }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(response.data);
            window.alert('Barang berhasil diambil');
            const updatedResponse = await axios.get(`${api}/penitip/barang?page=${currentPage}&search=${search}&filter=${filter}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setBarang(updatedResponse.data.barang);
            setLastPage(updatedResponse.data.barang.last_page);
        } catch (error) {
            console.log(error);
        }
    };

    const handlePerpanjangBarang = async (id_rincian_penitipan) => {
        try {
            const confirmed = window.confirm('Apakah anda yakin ingin memperpanjang penitipan ini?');
            if (!confirmed) return;

            const token = localStorage.getItem('token');
            const response = await axios.post(`${api}/penitip/perpanjang-barang`, { id_rincian_penitipan }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.status === false) {
                window.alert(response.data.message || 'Gagal memperpanjang penitipan');
                return;
            }

            window.alert('Barang berhasil diperpanjang');
            const updatedResponse = await axios.get(`${api}/penitip/barang?page=${currentPage}&search=${search}&filter=${filter}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setBarang(updatedResponse.data.barang);
            setLastPage(updatedResponse.data.barang.last_page);
        } catch (error) {
            console.log(error);
        }
    };

    if (loading) {
        return (
            <Card className="w-full min-h-screen bg-white/90 backdrop-blur-md p-6 items-center flex justify-center">
                <PulseLoader size={15} color="#61d52c" />
            </Card>
        );
    }

    return (
        <Card className="w-full bg-white/90 backdrop-blur-md p-6">
            <div>
                <div className='flex flex-wrap items-center justify-between mb-4'>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
                        <div className="flex flex-col">
                            <label htmlFor="search" className="text-xs text-gray-600 mb-1">Cari Barang</label>
                            <input
                                id="search"
                                type="text"
                                placeholder="Cari..."
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
                                <option value="Tersedia">Tersedia</option>
                                <option value="Akan Diambil">Akan Diambil</option>
                                <option value="Siap Donasi">Siap Donasi</option>
                                <option value="Dikembalikan">Dikembalikan</option>
                                <option value="Didonasikan">Didonasikan</option>
                                <option value="Terjual">Terjual</option>
                            </select>
                        </div>
                    </div>
                </div>
                {loadingBarang ? (
                    <Card className="w-full h-full bg-white/90 backdrop-blur-md p-6 items-center flex justify-center">
                        <PulseLoader size={15} color="#61d52c" />
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {!barang.data || barang.data.length === 0 ? (
                            <Card className="col-span-full p-2 shadow-md cursor-pointer min-h-[100px] text-center">
                                <h3 className="text-lg font-semibold">Tidak ada barang</h3>
                            </Card>
                        ) : (
                            barang.data.map((item, index) => (
                                <Card key={index} className="p-2 shadow-md min-h-[100px]" onClick={() => {
                                    setShowDetailBarangPenitipModal(true);
                                    setIdBarang(item.id_barang);
                                }}>
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-lg font-semibold">ID Barang: {item.id_barang}</h3>
                                        <span
                                            className={`text-m font-semibold px-2 py-1 rounded 
                                            ${item.status === 'Terjual'
                                                    ? 'bg-green-100 text-green-700'
                                                    : item.status === 'Tersedia'
                                                        ? 'bg-yellow-100 text-yellow-700'
                                                        : item.status === 'Didonasikan'
                                                            ? 'bg-green-100 text-green-700'
                                                            : item.status === 'Dikembalikan'
                                                                ? 'bg-orange-100 text-orange-700'
                                                                : item.status === 'Akan Diambil'
                                                                    ? 'bg-blue-100 text-blue-700'
                                                                    : item.status === 'Siap Donasi'
                                                                        ? 'bg-purple-100 text-purple-700'
                                                                            : 'bg-gray-100 text-gray-700'
                                                }`}
                                        >
                                            {item.status}
                                        </span>
                                    </div>
                                    <div className="flex gap-4">
                                        <img
                                            src={item.url_gambar_barang ? getGambarBarang(item.url_gambar_barang.split(';')[0]) : '/logo.png'}
                                            alt="Gambar Barang"
                                            className='w-32 h-32 object-contain'
                                            onError={(e) => e.target.src = '/logo.png'}
                                        />
                                        <div className="flex flex-col gap-1">
                                            <div>
                                                <span className="font-medium">Nama Barang:</span> {item.nama_barang}
                                            </div>
                                            <div>
                                                <span className="font-medium">Harga:</span> Rp {parseInt(item.harga).toLocaleString('id-ID')}
                                            </div>
                                            <div>
                                                <span className="font-medium">Tanggal Penitipan Berakhir:</span> {formatDate(item.rincian_penitipan.tanggal_selesai)}
                                            </div>
                                            <div>
                                                <span className="font-medium">Batas Ambil:</span> {formatDate(item.rincian_penitipan.batas_ambil)}
                                            </div>
                                            <div>
                                                <span className="font-medium">Status Perpanjangan:</span>{' '}
                                                <span className={item.rincian_penitipan.sudah_diperpanjang ? 'text-green-600' : 'text-orange-600'}>
                                                    {item.rincian_penitipan.sudah_diperpanjang ? 'Sudah Diperpanjang' : 'Belum Diperpanjang'}
                                                </span>
                                            </div>
                                            {item.status === 'Terjual' && item.rating !== null && (
                                                <div className="flex items-center gap-1">
                                                    <span className="font-medium">Rating:</span>
                                                    <FaStar className="h-4 w-4 text-amber-500 fill-amber-500" />
                                                    <span className="ml-1 text-amber-500">{item.rating}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2 justify-center mt-2">
                                        {item.status === 'Tersedia' && !item.rincian_penitipan.sudah_diperpanjang && (
                                            <Button className='bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded transition-colors'
                                                onClick={() => {
                                                    handlePerpanjangBarang(item.id_rincian_penitipan);
                                                }}
                                            >
                                                Perpanjang Penitipan
                                            </Button>
                                        )}
                                        {item.status === 'Tersedia' && (
                                            <Button className='bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition-colors'
                                                onClick={() => {
                                                    handleAmbilBarang(item.id_barang);
                                                }}>
                                                Ambil Barang
                                            </Button>
                                        )}
                                    </div>
                                </Card>
                            ))
                        )}
                    </div>
                )}

                <div className="flex justify-center mt-6">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={barang.last_page}
                        onPageChange={onPageChange}
                    />
                </div>
            </div>
            <DetailBarangPenitipModal 
                show={showDetailBarangPenitipModal} 
                onClose={() => setShowDetailBarangPenitipModal(false)} 
                id={idBarang} 
            />
        </Card>
    );
};

export default BarangPenitip;