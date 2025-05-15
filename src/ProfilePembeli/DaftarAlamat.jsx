import React from 'react'
import { useState, useEffect } from 'react'
import { Card, Badge } from 'flowbite-react'
import { PulseLoader } from 'react-spinners'
import { LuPlus } from 'react-icons/lu'
import { GetAlamat, TambahAlamat, UpdateAlamat, DeleteAlamat } from '@/api/services/apiAlamat'
import HapusAlamatModal from '@/Components/modals/HapusAlamatModal'
import TambahAlamatModal from '@/Components/modals/TambahAlamatModal'
import EditAlamatModal from '@/Components/modals/EditAlamatModal'

const DaftarAlamat = () => {
    const [alamat, setAlamat] = useState([]);
    const [searchAlamat, setSearchAlamat] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [alamatId, setAlamatId] = useState(null);
    const [alamatData, setAlamatData] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showTambahModal, setShowTambahModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    const fetchAlamat = () => {
        setIsLoading(true);
        GetAlamat()
            .then((res) => {
                setAlamat(res.data);
            })
            .catch((err) => {
                setError(err.message || "Gagal mengambil data.");
            })
            .finally(() => setIsLoading(false));
    }

    const updateAlamat = (id, data) => {
        UpdateAlamat(id, data)
            .then((response) => {
                fetchAlamat();
                console.log(alamat);
            })
            .catch((err) => {
                console.log(err);
                setError(err.message);
            })
    }

    const deleteAlamat = (id) => {
        DeleteAlamat(id)
            .then((response) => {
                fetchAlamat();
            })
            .catch((err) => {
                console.log(err);
                setError(err.message);
            })
    }

    const tambahAlamat = (data) => {
        TambahAlamat(data)
            .then((response) => {
                fetchAlamat();
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => setIsLoading(false));
    }

    const openEditModal = (data) => {
        setAlamatData(data);
        setShowEditModal(true);
    };

    const closeEditModal = () => {
        setAlamatData(null);
        setShowEditModal(false);
    };

    const openTambahModal = (id) => {
        setShowTambahModal(true);
    };

    const closeTambahModal = () => {
        setShowTambahModal(false);
    };

    const openDeleteModal = (id) => {
        setAlamatId(id);
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setAlamatId(null);
    };

    useEffect(() => {
        fetchAlamat();
    }, []);

    const filteredAlamat = alamat.filter((item) =>
        item.nama_alamat.toLowerCase().includes(searchAlamat.toLowerCase())
    );

    return (
        <div>
            <div className='flex flex-wrap items-center justify-between mb-4'>
                <div className="flex flex-wrap justify-between w-full">
                    <div className="flex flex-col w-80">
                        <label htmlFor="search" className="text-xs text-gray-600 mb-1">Cari Alamat</label>
                        <input
                            id="search"
                            type="text"
                            placeholder="Nama Alamat, Penerima..."
                            value={searchAlamat}
                            onChange={(e) => {
                                setSearchAlamat(e.target.value);
                            }}
                            className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-green-400"
                        />
                    </div>
                    <button
                        type="button"
                        className="flex items-center text-white bg-green-500 hover:bg-green-600 focus:ring-2 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5"
                        onClick={() => openTambahModal()}
                    >
                        <LuPlus className="h-4 w-4 mr-2" />
                        Tambah Alamat
                    </button>
                </div>
            </div>

            {isLoading
                ? (
                    <Card className="w-full h-full bg-white/90 backdrop-blur-md p-6 items-center flex justify-center">
                        <PulseLoader size={15} color="#61d52c" />
                    </Card>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                            {filteredAlamat.length === 0 ? (
                                <Card className="col-span-full w-full p-2 shadow-md cursor-pointer min-h-[100px] text-center">
                                    <h3 className="text-lg font-semibold">Tidak ada Alamat</h3>
                                </Card>
                            ) : (
                                <>
                                    {filteredAlamat.map((item, index) => (
                                        <Card
                                            key={index}
                                            className={`relative rounded-lg border ${item.is_primary
                                                ? "bg-[#F2FDF6] border-green-500"
                                                : "bg-white border-gray-200"
                                                }`}
                                        >
                                            <div>
                                                <div className="flex justify-between items-center">
                                                    <h4 className="font-bold text-black text-sm">
                                                        {item.nama_alamat}
                                                    </h4>
                                                    {item.is_primary ? (
                                                        <Badge color='success'>
                                                            <p className='text-base'>Utama</p>
                                                        </Badge>
                                                    ) : (<></>)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-xl text-gray-900">{item.nama_penerima}</p>
                                                    <p className="text-sm text-black">{item.no_telp}</p>
                                                    <p className="text-sm text-black mb-4">{item.alamat_lengkap}</p>
                                                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-green-500 text-sm font-medium">
                                                        <button onClick={() => openEditModal(item)} className="hover:text-green-700 hover:cursor-pointer">
                                                            Ubah Alamat
                                                        </button>
                                                        {/* {!item.is_primary && ( */}
                                                            <button onClick={() => openDeleteModal(item.id_alamat)} className="text-red-500 hover:text-red-700 hover:cursor-pointer">
                                                                Hapus
                                                            </button>
                                                        {/* )} */}
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </>
                            )}
                        </div>
                        <EditAlamatModal
                            show={showEditModal}
                            onClose={closeEditModal}
                            updateAlamat={updateAlamat}
                            alamatData={alamatData}
                        />
                        <HapusAlamatModal
                            show={showDeleteModal}
                            onClose={closeDeleteModal}
                            deleteAlamat={deleteAlamat}
                            alamatId={alamatId}
                        />
                        <TambahAlamatModal
                            show={showTambahModal}
                            onClose={closeTambahModal}
                            tambahAlamat={tambahAlamat}
                        />
                    </>
                )}
        </div>
    )
}

export default DaftarAlamat