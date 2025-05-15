import React from 'react'
import { useEffect, useState } from "react";
import { showReqDonasi, tambahDonasiBarang } from '@/api/services/apiOwner';
import { PulseLoader } from 'react-spinners';
import { IoIosSearch } from "react-icons/io";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { Button } from "flowbite-react";
import TambahDonasiModal from '@/Components/modals/TambahDonasiModal'


function ListRequestDonasi() {
    const [ reqDonasi, setReqDonasi] = useState([]);

    const [ isLoading, setIsLoading] = useState(false);
    const [ error, setError] = useState("");

    const [ searchTerm, setSearchTerm] = useState("");
    const [ debouncedSearch, setDebouncedSearch] = useState(searchTerm);

    const [ currentPage, setCurrentPage] = useState(1);
    const [ lastPage, setLastPage] = useState(1);
    const [ total, setTotal] = useState(0);
    const [ perPage, setPerPage] = useState(10);

    const [ showDonasiBarangModal, setShowDonasiBarangModal ] = useState(false);
    const [ idRequestDonasi, setIdRequestDonasi ] = useState(0);

    const handlePageClick = (page) =>{
        if(page >= 1 && page <= lastPage && page !== currentPage){
            setCurrentPage(page);
            fetchPegawai(page);
        }
    }

    const handleClickDonasikan = (id) =>{
        openDonasiBarangModal();
        setIdRequestDonasi(id);
    }

    const fetchRequest = (page = 1, search = "") =>{
        setIsLoading(true);
        showReqDonasi(page, search)
            .then((res) => {
                setReqDonasi(res.data);
                setLastPage(res.last_page);
                setPerPage(res.per_page);
                setTotal(res.total);
            })
            .catch((err) => {
                setError(err.message || "Gagal mengambil data.");
            })
            .finally(() => setIsLoading(false));
    };

    const tambahDonasi = (data) =>{
        console.log(data);
        // console.log("id_req_donasi : ", idRequestDonasi)
        // data.append('id_request_donasi', idRequestDonasi);
        tambahDonasiBarang(data)
            .then((response) =>{
                console.log(response);
                fetchRequest();
            })
            .catch((err) => {
                console.log(err);
            })
    }


    const openDonasiBarangModal = () =>{
        setShowDonasiBarangModal(true);
    }

    const closeDonasiBarangModal = () =>{
        setShowDonasiBarangModal(false);
    }

    useEffect(() => {
        fetchRequest(currentPage, debouncedSearch);
    }, [currentPage, debouncedSearch]);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setCurrentPage(1);
        }, 1000);

        return () => clearTimeout(handler);
    }, [searchTerm]);


    return (
        <>
            <div className='relative overflow-x-auto shadow-md sm:rounded-lg'>
                <div className="flex md:flex-row items-center justify-start flex-wrap gap-4 py-4 ps-6 bg-white">
                    <p className='font-bold'>Daftar Donasi</p>
                    <label htmlFor="table-search-users" className="sr-only">Search</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                            <IoIosSearch />
                        </div>
                        <input
                            type="text"
                            id="table-search-users"
                            className="block w-96 ps-10 pt-2 pb-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:outline-green-500"
                            placeholder="Cari Request Donasi atau Nama Organisasi"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Nama Organisasi
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Deskripsi Barang Donasi
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Nomor Telp
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Alamat
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
                                    {reqDonasi?.map((item, index) => (
                                        <tr key={item.id_request_donasi} className="bg-white border-b dark:bg-gray-800 border-gray-200 hover:bg-gray-50">
                                            <th scope="row" className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap">
                                                {/* <img className="w-10 h-10 rounded-full" src={getProfilePictureOrganisasi(item.url_gambar)} alt="Logo Organisasi" /> */}
                                                <div className="ps-3">
                                                    <div className="text-base font-semibold">{item.organisasi.nama}</div>
                                                    <div className="font-normal text-gray-500">{item.organisasi.email}</div>
                                                </div>
                                            </th>
                                            <td className="px-6 py-4">
                                                {/* {formatDate(item.tanggal_lahir)} */}
                                                {item.deskripsi}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    {item.organisasi.no_telp}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                {/* <NumericFormat 
                                                    value={item.komisi} 
                                                    prefix = "Rp. "
                                                    displayType = "text"
                                                    thousandSeparator = "."
                                                    decimalSeparator=","
                                                /> */}
                                                {item.organisasi.alamat}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex justify-start items-center gap-2">
                                                    {/* Modal Edit */}
                                                    <button
                                                        // onClick={() => openEditModal(item)}
                                                        onClick={() => handleClickDonasikan(item.id_request_donasi)}
                                                        className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                                                        type="button"
                                                    >
                                                        {/* <FaEdit /> */}
                                                        Donasikan
                                                    </button>

                                                    {/* Modal Delete */}
                                                    <button
                                                        onClick={() => openDeleteModal(item.id_pegawai)}
                                                        className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-sm focus:outline-none focus:ring-2 focus:ring-red-300"
                                                        type="button"
                                                    >
                                                        {/* <FaTrashAlt /> */}
                                                        Ditolak
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </>
                            )}
                    </tbody>
                </table>
                {showDonasiBarangModal && (
                    <TambahDonasiModal
                        show={showDonasiBarangModal}
                        onClose={closeDonasiBarangModal}
                        tambahDonasi={tambahDonasi}
                        idRequestDonasi={idRequestDonasi}
                    />
                )}
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
        </>
    );
}

export default ListRequestDonasi;