import React from 'react'
import { useEffect, useState } from "react";
import { ShowPegawai, ResetPassword } from '@/api/services/apiPegawai';
import { IoIosSearch } from "react-icons/io";
import { PulseLoader } from 'react-spinners';
import { FaEdit, FaTrashAlt } from "react-icons/fa";

const ResetPasswordPegawai = () => {

    const [pegawai, setPegawai] = useState([]);

    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState("");

    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);

    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [perPage, setPerPage] = useState(10);

    const handlePageClick = (page) => {
        if (page >= 1 && page <= lastPage && page !== currentPage) {
            setCurrentPage(page);
            fetchOrganisasi(page);
        }
    };

    const showPegawai = (page = 1, search = "") => {
        setIsLoading(true);
        setError("");
        ShowPegawai(page, search)
            .then((res) => {
                const dataPegawai = Array.isArray(res.data) ? res.data : 
                Array.isArray(res.data?.data) ? res.data.data : [];
                
                setPegawai(dataPegawai);
                setLastPage(res.last_page);
                setPerPage(res.per_page);
                setTotal(res.total);
            })
            .catch((err) => {
                setError(err.message || "Gagal mengambil data pegawai.");
                setPegawai(null);
            })
            .finally(() => setIsLoading(false));
    };

    const resetPassword = (id) => {
        setIsLoading(true);
        setError("");
        setIsSuccess(false);

        ResetPassword(id)
            .then(() => {
                setIsSuccess(true);

                showPegawai(currentPage, debouncedSearch);

                setTimeout(() => setIsSuccess(false), 3000);
                alert("Berhasil reset password.");
            })
            .catch((err) => {
                setError(err.message || "Gagal mereset kata sandi.");
                console.error("Reset password error:", err);
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
        showPegawai(currentPage, debouncedSearch);
    }, [currentPage, debouncedSearch]);

    if (error) return <p className="text-center text-red-600">{error}</p>;

    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            {/* Search Bar */}
            <div className="flex flex-col md:flex-row items-center justify-start flex-wrap gap-4 py-4 ps-6 bg-white">
                <label htmlFor="table-search-users" className="sr-only">Search</label>
                <div className="relative">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <IoIosSearch />
                    </div>
                    <input
                        type="text"
                        id="table-search-users"
                        className="block w-80 ps-10 pt-2 pb-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:outline-green-500"
                        placeholder="Cari Pegawai"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Tabel Data Pegawai */}
            <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th scope="col" className="px-14 py-3">
                            Nama Pegawai
                        </th>
                        <th scope="col" className="px-6 py-3 text-center">
                            Jabatan
                        </th>
                        <th scope="col" className="px-6 py-3 text-center">
                            Nomor Telp
                        </th>
                        <th scope="col" className="px-6 py-3 text-center">
                            Tanggal Lahir
                        </th>
                        <th scope="col" className="px-6 py-3 text-center">
                            Reset Password
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading
                        ? (
                            <tr>
                                <td colSpan={5}>
                                    <div className="flex justify-center items-center py-8">
                                        <PulseLoader size={8} color="#057A55" />
                                    </div>
                                </td>
                            </tr>
                        ) : pegawai?.length === 0
                            ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-6 font-medium text-gray-500">
                                        Pegawai tidak ditemukan.
                                    </td>
                                </tr>
                            ) : (
                                pegawai?.map((item) => (
                                    <tr key={item.id_pegawai} className="bg-white border-b dark:bg-gray-800 border-gray-200">
                                        <th scope="row" className=" px-8 py-4 text-gray-900 whitespace-nowrap">
                                            {/* Beri placeholder pegawai */}
                                            <div className="ps-3">
                                                <div className="text-base font-semibold">{item.nama}</div>
                                                <div className="font-normal text-gray-500">{item.email}</div>
                                            </div>
                                        </th>
                                        <td className="px-6 py-4 text-center">
                                            {item.jabatan.nama_jabatan}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {item.no_telp}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {new Date(item.tanggal_lahir).toLocaleDateString('id-ID', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric',
                                            })}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex justify-center items-center">
                                                <button
                                                    onClick={() => resetPassword(item.id_pegawai, item.email)}
                                                    className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-300 w-50"
                                                    type="button"
                                                >
                                                    Reset
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                </tbody>
            </table>

            {/* Pagination untuk Penanda Halaman */}
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

export default ResetPasswordPegawai