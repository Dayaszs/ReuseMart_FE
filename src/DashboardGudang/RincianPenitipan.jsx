import React from 'react'
import { useEffect, useState } from "react";
import { ShowRincianPenitipan } from '@/api/services/apiRincianPenitipan'
import { ShowPegawaiByJabatan } from '@/api/services/apiPegawai'
import { IoIosSearch } from "react-icons/io";
import { PulseLoader } from 'react-spinners';
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { Button } from "flowbite-react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { getGambarBarang } from '@/api/index';

const RincianPenitipan = () => {
    const [ rincianPenitipan, setRincianPenitipan ] = useState([]);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);

    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [perPage, setPerPage] = useState(8);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const handlePageClick = (page) => {
        if (page >= 1 && page <= lastPage && page !== currentPage) {
            setCurrentPage(page);
            fetchRincianPenitipan(page);
        }
    };

    const fetchRincianPenitipan = (page = 1, search = "") =>{
        setIsLoading(true);

        ShowRincianPenitipan(page, search)
        .then((res) => {
            const dataRincianPenitipan = Array.isArray(res.data) ? res.data : 
            Array.isArray(res.data?.data) ? res.data.data : [];

            setRincianPenitipan(dataRincianPenitipan);

            setLastPage(res.data.last_page);
            setPerPage(res.data.per_page);
            setTotal(res.data.total);
        })
        .catch((err) => {
            setError(err.message || "Gagal mengambil data rincian penitipan");
        })
        .finally(() => setIsLoading(false));
    };

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setCurrentPage(1);
        }, 1000);

        return () => clearTimeout(handler);
    }, [searchTerm]);

    useEffect(() => {
        fetchRincianPenitipan(currentPage, debouncedSearch);
    }, [currentPage, debouncedSearch]);

    if(error)
        return
            <p className='text-center text-red-600'>
                {error}
            </p>;

    return(
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            {/* Search Bar */}
            <div className="flex flex-col md:flex-row items-center justify-start flex-wrap gap-4 py-4 ps-6 bg-white">
                <label htmlFor="table-search-users" className="sr-only">Search</label>
                <p className='font-bold'>Rincian Penitipan</p>
                <div className="relative">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <IoIosSearch />
                    </div>
                    <input
                        type="text"
                        id="table-search-users"
                        className="block w-80 ps-10 pt-2 pb-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:outline-green-500"
                        placeholder="Cari Rincian Penitipan"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button color="green" 
                className='ms-auto me-10'
                onClick={() => openCreateModal()}>
                    + Create
                </Button>
            </div>

            {/* Tabel Data Rincian Penitipan */}
            <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            Gambar Barang
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Nama Barang
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Nama QC
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Nama Penitip
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Tanggal Masuk
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Tanggal Selesai
                        </th>
                        <th scope="col" className="px-6 py-3">
                            <p className='text-xs'>Batas Pengambilan Barang</p>
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading
                        ? (
                            <tr>
                                <td colSpan={4}>
                                    <div className="flex justify-center items-center py-8">
                                        <PulseLoader size={8} color="#057A55" />
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            <>
                                {rincianPenitipan?.map((item, index) => (
                                    <tr key={item.id_rincian_penitipan} className="bg-white border-b dark:bg-gray-800 border-gray-200 hover:bg-gray-50">
                                        <th scope="row" className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap">
                                            <div className="ps-3">
                                                {/* <img className="w-24 h-24" src={item.barang.url_gambar_barang} alt="Logo Organisasi" /> */}
                                                {/* <div className="text-base font-semibold">{item.nama}</div>
                                                <div className="font-normal text-gray-500">{item.email}</div> */}
                                                <Carousel className="max-w-44 max-h-44">
                                                    <CarouselContent>
                                                        {item.barang.url_gambar_barang?.split(';').map((gambar, index) => (
                                                            <CarouselItem key={index} className="h-full">
                                                                <div className="w-full h-full flex items-center justify-center bg-gray-50">
                                                                    <img
                                                                        src={getGambarBarang(gambar)}
                                                                        alt={`Product Image ${index + 1}`}
                                                                        className="max-w-full max-h-full object-contain rounded-md"
                                                                        onError={(e) => e.target.src = '/logo.png'}
                                                                    />
                                                                </div>
                                                            </CarouselItem>
                                                        ))}
                                                    </CarouselContent>
                                                    <CarouselPrevious />
                                                    <CarouselNext />
                                                </Carousel>
                                            </div>
                                        </th>
                                        <td className="px-6 py-4">
                                            {item.barang.nama_barang}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                {item.penitipan.pegawai.nama}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                {item.penitipan.penitip.nama_penitip}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                {formatDate(item.penitipan.tanggal_masuk)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                {formatDate(item.tanggal_selesai)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                {formatDate(item.batas_ambil)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {/* Modal Edit */}
                                            <button
                                                onClick={() => openEditModal(item)}
                                                className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                                                type="button"
                                            >
                                                <FaEdit />
                                            </button>

                                            {/* Modal Delete */}
                                            <button
                                                onClick={() => openDeleteModal(item.id_pegawai)}
                                                className="p-2 ms-2 bg-red-600 hover:bg-red-700 text-white rounded-sm focus:outline-none focus:ring-2 focus:ring-red-300"
                                                type="button"
                                            >
                                                <FaTrashAlt />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </>
                        )}
                </tbody>
            </table>
            <nav className="flex flex-col md:flex-row items-center justify-between py-4 px-6">
                <span className="text-sm text-gray-500">
                    Showing{" "}
                    <span className="font-semibold text-gray-900">
                        {(currentPage - 1) * perPage + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-semibold text-gray-900">
                        {Math.min(currentPage * perPage, total)}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-gray-900">
                        {total}
                    </span>
                </span>

                <ul className="inline-flex -space-x-px text-sm h-8 mt-2 md:mt-0">
                    <li>
                        <button
                            className="px-3 h-8 text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 disabled:bg-gray-100"
                            onClick={() => handlePageClick(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>
                    </li>
                    {[...Array(lastPage)].map((_, i) => {
                        const page = i + 1;
                        return (
                            <li key={page}>
                                <button
                                    className={`px-3 h-8 border border-gray-300 ${page === currentPage
                                        ? "bg-green-500 text-white"
                                        : "bg-white text-gray-500 hover:bg-gray-100"
                                        }`}
                                    onClick={() => handlePageClick(page)}
                                >
                                    {page}
                                </button>
                            </li>
                        );
                    })}
                    <li>
                        <button
                            className="px-3 h-8 text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 disabled:bg-gray-100"
                            onClick={() => handlePageClick(currentPage + 1)}
                            disabled={currentPage === lastPage}
                        >
                            Next
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

export default RincianPenitipan;