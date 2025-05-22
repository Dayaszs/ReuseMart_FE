import React, { useEffect, useState } from 'react';
import { IoIosSearch } from "react-icons/io";
import { PulseLoader } from 'react-spinners';
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { Button, Pagination, Card, Tabs, TabItem } from "flowbite-react";
import axios from 'axios';
import api from '../routes/api';
import DetailBarangModal from '@/Components/modals/DetailBarangPenitipModal';

const ListBarangPenitip = () => {
    const [barang, setBarang] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [showDetailBarangModal, setShowDetailBarangModal] = useState(false);
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
            minute: '2-digit',
        });
    };

    const fetchRincianPenitipan = async () => {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        const response = await axios.get(
            `${api}/gudang/barang-ambil-penitip?page=${currentPage}&search=${searchTerm}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        setBarang(response.data.barang);
        setLastPage(response.data.barang.last_page);
        setIsLoading(false);
    };

    const handleKembalikanBarang = async (id) => {
        const confirmed = window.confirm('Apakah anda yakin ingin mengembalikan barang ini?');
        if(!confirmed) return;

        const token = localStorage.getItem('token');
        const response = await axios.get(`${api}/gudang/kembalikan-barang-penitip/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if(response.status === 200) {
            window.alert('Barang berhasil dikembalikan');
            fetchRincianPenitipan();
        }
    };

    useEffect(() => {
        fetchRincianPenitipan();
    }, [currentPage, searchTerm]);

    if(error)
        return <p className='text-center text-red-600'>{error}</p>;

    return(
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            {/* Search Bar */}
            <div className="flex flex-col md:flex-row items-center justify-start flex-wrap gap-4 py-4 ps-6 bg-white">
                <label htmlFor="table-search-users" className="sr-only">Search</label>
                <p className='font-bold'>List Barang Penitip</p>
                <div className="relative">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <IoIosSearch />
                    </div>
                    <input
                        type="text"
                        id="table-search-users"
                        className="block w-80 ps-10 pt-2 pb-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:outline-green-500"
                        placeholder="Cari Barang Penitip"
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
                            ID Barang
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Nama Barang
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Tanggal Batas Ambil
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Tanggal Konfirmasi Pengambilan
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Tanggal Diambil Penitip
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Nama Penitip
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading ? (
                        <tr>
                            <td colSpan={7}>
                                <div className="flex justify-center items-center py-8">
                                    <PulseLoader size={8} color="#057A55" />
                                </div>
                            </td>
                        </tr>
                    ) : (
                        <>
                            {barang?.data?.map((item) => (
                                <tr key={item.id_barang} className="bg-white border-b dark:bg-gray-800 border-gray-200 hover:bg-gray-50 cursor-pointer" onClick={() => {
                                    setShowDetailBarangModal(true);
                                    setIdBarang(item.id_barang);
                                }}>
                                    <td className="px-6 py-4">
                                        {item.id_barang}
                                    </td>
                                    <td className="px-6 py-4">
                                        {item.nama_barang}
                                    </td>
                                    <td className="px-6 py-4">
                                        {formatDate(item.rincian_penitipan?.batas_ambil)}
                                    </td>
                                    <td className="px-6 py-4">
                                        {formatDate(item.rincian_penitipan?.tanggal_konfirmasi)}
                                    </td>
                                    <td className="px-6 py-4">
                                        {item.rincian_penitipan?.tanggal_diambil ? formatDate(item.rincian_penitipan?.tanggal_diambil) : "-"}
                                    </td>
                                    <td className="px-6 py-4">
                                        {item.rincian_penitipan?.penitipan?.penitip?.nama_penitip}
                                    </td>
                                   
                                    <td className="px-6 py-4">
                                        {item.status === 'Akan Diambil' ? (
                                            <button
                                                className='bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded transition-colors w-50 text-center'
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleKembalikanBarang(item.id_barang);
                                                }}
                                            >
                                                Kembalikan Barang
                                            </button>
                                        ) : (
                                            <span className="text-gray-600">Dikembalikan</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </>
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
            <DetailBarangModal
                show={showDetailBarangModal}
                onClose={() => setShowDetailBarangModal(false)}
                id={idBarang}
                gudang={true}
            />
        </div>
    );
}

export default ListBarangPenitip;