import React, { useEffect, useState } from 'react';
import { PulseLoader } from 'react-spinners';
import { IoIosSearch } from "react-icons/io";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { showKlaimMerchandise, updateTanggalPengambilan } from '@/api/services/apiMerchandise'
import { Button, Pagination, Card, Tabs, TabItem } from "flowbite-react";

const ListKlaimMerchandise = () => {
    const [ listKlaim, setListKlaim ] = useState([]);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);

    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [perPage, setPerPage] = useState(10);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const fetchKlaim = (page = 1, search = "") =>{
        setIsLoading(true);
        showKlaimMerchandise(page, search)
            .then((res) => {
                setListKlaim(res.data.data);
                setLastPage(res.data.last_page);
                setPerPage(res.data.per_page);
                setTotal(res.data.total);
            })
            .catch((err) => {
                setError(err.message || "Gagal mengambil data.");
            })
            .finally(() => setIsLoading(false));
    };

    const handleClickUpdateTanggal = (id) =>{
        setIsLoading(true);

        updateTanggalPengambilan(id)
            .then((res) => {
                console.log(res);
                fetchKlaim(currentPage, debouncedSearch);
            })
            .catch((err) => {
                setError(err.message || "Gagal mengambil data.");
            })
            .finally(() => setIsLoading(false));
    }

    useEffect(() => {
        fetchKlaim(currentPage, debouncedSearch);
    }, [currentPage, debouncedSearch]);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setCurrentPage(1);
        }, 1000);

        return () => clearTimeout(handler);
    }, [searchTerm]);

    return(
        <div className='relative overflow-x-auto shadow-md sm:rounded-lg'>
            <div className="flex md:flex-row items-center justify-start flex-wrap gap-4 py-4 ps-6 bg-white">
                <label htmlFor="table-search-users" className="sr-only">Search</label>
                <div className="relative">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <IoIosSearch />
                    </div>
                    <input
                        type="text"
                        id="table-search-users"
                        className="block w-80 ps-10 pt-2 pb-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:outline-green-500"
                        placeholder="Cari Klaim"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                <thead className=" text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            Nama Pembeli
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Nama Merchandise
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Kuantitas
                        </th>
                        <th scope="col" className="px-6 py-3">
                            No Telp Pembeli
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Tanggal Klaim
                        </th>
                        <th scope="col" className="px-6 py-3 flex justify-center items-center">
                            Keterangan
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
                                {listKlaim?.map((item, index) => (
                                    <tr key={item.id_klaim} className="bg-white border-b dark:bg-gray-800 border-gray-200 hover:bg-gray-50">
                                        <th scope="row" className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap">
                                            {/* <img className="w-10 h-10 rounded-full" src={getProfilePictureOrganisasi(item.url_gambar)} alt="Logo Organisasi" /> */}
                                            <div className="ps-3">
                                                <div className="text-base font-semibold">{item.pembeli.nama_pembeli}</div>
                                                <div className="font-normal text-gray-500">{item.pembeli.email}</div>
                                            </div>
                                        </th>
                                        <td className="px-6 py-4">
                                            
                                            {item.merchandise.nama}
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.kuantitas}
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.pembeli.no_telp}
                                        </td>
                                        <td className="px-6 py-4">
                                            {formatDate(item.tanggal_klaim)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-center items-center gap-2">
                                                {item.status === "Selesai" ?
                                                    (
                                                        <p>{item.status}</p>
                                                    )
                                                    :
                                                    (
                                                        <button
                                                            onClick={() => handleClickUpdateTanggal(item.id_klaim)}
                                                            className="p-2 bg-blue-600 text-xs hover:bg-blue-700 text-white rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                                                            type="button"
                                                        >
                                                            Update Tanggal 
                                                        </button>
                                                    ) 
                                                }
                                            </div>
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
    )
}

export default ListKlaimMerchandise;