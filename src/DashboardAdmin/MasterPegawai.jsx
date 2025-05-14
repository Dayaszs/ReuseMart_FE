import React from 'react'
import { useEffect, useState } from "react";
import { CreatePegawai, DeletePegawai, ShowPegawai, UpdatePegawai } from '@/api/services/apiPegawai';
import { PulseLoader } from 'react-spinners';
import { IoIosSearch } from "react-icons/io";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { Button } from "flowbite-react";
import { NumericFormat } from 'react-number-format';
import TambahPegawaiModal from '@/Components/modals/TambahPegawaiModal';
import EditPegawaiModal from '@/Components/modals/EditPegawaiModel';


const MasterPegawai = () => {
    const [pegawai, setPegawai] = useState([]);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);

    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [perPage, setPerPage] = useState(10);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [pegawaiData, setPegawaiData] = useState(null);
    const [deleteId, setDeteltedId] = useState(null);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const handlePageClick = (page) =>{
        if(page >= 1 && page <= lastPage && page !== currentPage){
            setCurrentPage(page);
            fetchPegawai(page);
        }
    }

    const fetchPegawai = (page = 1, search = "") =>{
        setIsLoading(true);
        ShowPegawai(page, search)
            .then((res) => {
                setPegawai(res.data);
                setLastPage(res.last_page);
                setPerPage(res.per_page);
                setTotal(res.total);
            })
            .catch((err) => {
                setError(err.message || "Gagal mengambil data.");
            })
            .finally(() => setIsLoading(false));
    };

    const tambahPegawai = (data) =>{
        CreatePegawai(data)
            .then((response) =>{
                console.log(response);
                fetchPegawai();
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => setIsLoading(false));
    }

    const updatePegawai = (id, data) => {
        console.log("data : ",id);
        UpdatePegawai(id, data)
            .then((response) => {
                fetchPegawai(currentPage, debouncedSearch);
            })
            .catch((err) => {
                console.log(err);
            })
    }

    const openCreateModal = () =>{
        // setPegawai(data);
        setShowCreateModal(true);
    } 

    const closeCreateModal = () =>{
        setShowCreateModal(false);
        fetchPegawai(1, debouncedSearch);
    }

    const openEditModal = (data) =>{
        setPegawaiData(data);
        setShowEditModal(true);
    };

    const closeEditModal = () => {
        setPegawaiData(null);
        setShowEditModal(false);
    };



    useEffect(() => {
        fetchPegawai(currentPage, debouncedSearch);
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
                        placeholder="Cari Pegawai"
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

            <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            Nama Pegawai
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Tanggal Lahir
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Nomor Telp
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Komisi
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
                                {pegawai?.map((item, index) => (
                                    <tr key={item.id_pegawai} className="bg-white border-b dark:bg-gray-800 border-gray-200 hover:bg-gray-50">
                                        <th scope="row" className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap">
                                            {/* <img className="w-10 h-10 rounded-full" src={getProfilePictureOrganisasi(item.url_gambar)} alt="Logo Organisasi" /> */}
                                            <div className="ps-3">
                                                <div className="text-base font-semibold">{item.nama}</div>
                                                <div className="font-normal text-gray-500">{item.email}</div>
                                            </div>
                                        </th>
                                        <td className="px-6 py-4">
                                            {formatDate(item.tanggal_lahir)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                {item.no_telp}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                            <NumericFormat 
                                                value={item.komisi} 
                                                prefix = "Rp. "
                                                displayType = "text"
                                                thousandSeparator = "."
                                                decimalSeparator=","
                                            />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-start items-center gap-2">
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
                                                    onClick={() => openDeleteModal(item.id_organisasi)}
                                                    className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-sm focus:outline-none focus:ring-2 focus:ring-red-300"
                                                    type="button"
                                                >
                                                    <FaTrashAlt />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </>
                        )}
                </tbody>
            </table>
            {showCreateModal && (
                <TambahPegawaiModal
                    show={showCreateModal}
                    onClose={closeCreateModal}
                    tambahPegawai={tambahPegawai}
                />
            )}
            {showEditModal && (
                <EditPegawaiModal
                    show={showEditModal}
                    onClose={closeEditModal}
                    updatePegawai={updatePegawai}
                    pegawaiData={pegawaiData}
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
    )
}

export default MasterPegawai