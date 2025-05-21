import React, { useState, useEffect } from 'react'
import { GetPembayaran, VerifPembayaran, DeleteBuktiPembayaran } from '@/api/services/apiPembayaran'
import { CancelPemesanan } from '@/api/services/apiPemesanan'
import { PulseLoader } from 'react-spinners'
import VerifikasiPembayaranModal from '@/Components/modals/VerifikasiPembayaranModal'

const VerifikasiPembayaran = () => {
    const [pembayaran, setPembayaran] = useState([]);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [perPage, setPerPage] = useState(10);

    const [showVerifikasiModal, setShowVerifikasiModal] = useState(false);
    const [pembayaranData, setPembayaranData] = useState(null);

    const handlePageClick = (page) => {
        if (page >= 1 && page <= lastPage && page !== currentPage) {
            setCurrentPage(page);
            fetchPembayaran(page);
        }
    };

    const fetchPembayaran = (page) => {
        setIsLoading(true);
        GetPembayaran(page)
            .then((res) => {
                setPembayaran(res.data);
                setLastPage(res.last_page);
                setPerPage(res.per_page);
                setTotal(res.total);
            })
            .catch((err) => {
                setError(err.message || "Gagal mengambil data pembayaran.");
            })
            .finally(() => setIsLoading(false));
    };

    const verifikasiPembayaran = (pembayaranId) => {   //pembayaran yang valid
        setIsLoading(true);
        VerifPembayaran(pembayaranId)
            .then((res) => {
                fetchPembayaran(currentPage);
            })
            .catch((err) => {
                setError(err.message || "Gagal mengambil data pembayaran.");
            })
            .finally(() => setIsLoading(false));
    }

    const tolakPembayaran = async (pembayaranId, pemesananId) => {  //pembayaran yang tidak valid
        setIsLoading(true);
        setError(null);

        try {
            await DeleteBuktiPembayaran(pembayaranId);
            await CancelPemesanan(pemesananId);
            fetchPembayaran(currentPage);
        } catch (err) {
            setError(err.response.data.message || "Terjadi kesalahan saat menolak pembayaran.");
        } finally {
            setIsLoading(false);
        }
    };

    const openVerifikasiModal = (data) => {
        setPembayaranData(data);
        setShowVerifikasiModal(true);
    };

    const closeVerifikasiModal = () => {
        setPembayaranData(null);
        setShowVerifikasiModal(false);
    };

    useEffect(() => {
        fetchPembayaran(currentPage);
    }, [currentPage]);

    if (error) return <p className="text-center text-red-600">{error}</p>;

    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">

            {/* Header Verifikasi Pembayaran */}
            <div className="flex flex-col md:flex-row items-center justify-between p-4 space-y-3 md:space-y-0 md:space-x-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Verifikasi Pembayaran</h2>
                </div>
            </div>

            {/* Tabel Data Pembayaran */}
            <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 text-center">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            Nomor Nota Pemesanan
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Nama Pembeli
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Tanggal Pembayaran
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Metode Pembayaran
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
                                {pembayaran?.map((item, index) => (
                                    <tr key={item.id_pembayaran} className="bg-white border-b border-gray-200 hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center text-center text-lg">
                                                {item.no_nota}
                                            </div>
                                        </td>
                                        <td scope="row" className="flex items-center justify-center px-6 py-4 text-gray-900">
                                            {/* <img className="w-10 h-10 rounded-full" src={getProfilePictureOrganisasi(item.url_gambar)} alt="Logo Organisasi" /> */}
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="text-base font-semibold">{item.nama_pembeli}</div>
                                                <div className="font-normal text-gray-500">{item.email}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center">
                                                {new Date(item.tanggal_pembayaran).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric',
                                                })} {new Date(item.tanggal_pembayaran).toLocaleTimeString('id-ID', {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    timeZone: 'Asia/Jakarta'
                                                })} WIB
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center text-center">
                                                {item.metode_pembayaran}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex justify-center items-center">
                                                {item.status_pemesanan !== 'Pending'
                                                    ? (
                                                        <>
                                                            <button
                                                                disabled
                                                                className="p-2 border-emerald-300 bg-emerald-50 text-green-600 rounded-sm w-50"
                                                                type="button"
                                                            >
                                                                Sudah Diverifikasi
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <button
                                                                onClick={() => openVerifikasiModal(item)}
                                                                className="p-2 bg-green-600 hover:cursor-pointer hover:bg-green-700 text-white rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-300 w-50"
                                                                type="button"
                                                            >
                                                                Verifikasi
                                                            </button>
                                                        </>
                                                    )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </>
                        )}
                </tbody>
            </table>

            <VerifikasiPembayaranModal
                show={showVerifikasiModal}
                onClose={closeVerifikasiModal}
                pembayaranData={pembayaranData}
                verifikasiPembayaran={verifikasiPembayaran}
                tolakPembayaran={tolakPembayaran}
            />

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
                                    onClick={() => { handlePageClick(page) }}
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

export default VerifikasiPembayaran