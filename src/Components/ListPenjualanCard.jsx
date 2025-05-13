import React, { useState, useEffect } from 'react';
import { Card, Button, Badge } from "flowbite-react";
import { GetBarangTerjual } from '@/api/services/apiPenitip';
import { PulseLoader } from 'react-spinners';
import { LuArrowLeft } from "react-icons/lu";
import { getGambarBarang } from '@/api';
import DetailPenjualanModal from './modals/DetailPenjualanModal';

const ListPenjualanCard = ({ onCloseTransaksi }) => {
    const [barang, setBarang] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [barangId, setBarangId] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    const openDetailModal = (id) => {
        setBarangId(id);
    };

    const closeDetailModal = () => {
        setShowDetailModal(false);
        setBarangId(null);
    };

    const fetchBarang = () => {
        setIsLoading(true);
        GetBarangTerjual()
            .then((res) => {
                setBarang(res.data);
            })
            .catch((err) => {
                console.error(err.message || "Gagal mengambil data.");
            })
            .finally(() => setIsLoading(false));
    };

    useEffect(() => {
        fetchBarang();
    }, []);

    useEffect(() => {
        if (barangId !== null) {
            setShowDetailModal(true);
        }
    }, [barangId]);

    return (
        <>
            <Card className="md:col-span-2">
                <div className='flex flex-wrap items-center justify-start'>
                    <button onClick={onCloseTransaksi} className='flex items-center justify-center w-7 h-7 rounded-full hover:bg-gray-100'>
                        <LuArrowLeft className='w-6 h-6' />
                    </button>
                    <h2 className="text-xl font-semibold text-gray-900 ms-2">Daftar Transaksi Penjualan</h2>
                </div>
                {/* List Transaksi Penjualan */}
                <div className="space-y-4 overflow-y-scroll">
                    {isLoading ? (
                        <div className="flex justify-center items-center py-8 h-full">
                            <PulseLoader size={8} color="#057A55" />
                        </div>
                    ) : (
                        <>
                            {barang.length === 0
                                ? (
                                    <div className="text-center py-6 font-medium text-gray-500">
                                        Pegawai tidak ditemukan.
                                    </div>
                                ) : (
                                    barang?.map((item, index) => (
                                        <div key={item.id_barang} className="relative p-6 rounded-lg border bg-white border-gray-200">
                                            <div className="flex items-center justify-between gap-2 mb-1">
                                                <div className='flex flex-wrap items-center'>
                                                    <Badge
                                                        color={item.status === 'Terjual' ? "success" : "warning"}
                                                        className="text-sm"
                                                    >
                                                        {item.status}
                                                    </Badge>
                                                    <p className="font-sm text-gray-900 ms-4">
                                                        {new Intl.DateTimeFormat('id-ID', {
                                                            day: 'numeric',
                                                            month: 'long',
                                                            year: 'numeric'
                                                        }).format(new Date(item.tanggal_pemesanan))}
                                                    </p>
                                                </div>
                                                <p className="text-md font-bold text-green-500">{`Rp${parseInt(item.komisi).toLocaleString('id-ID')}`}</p>
                                            </div>
                                            <h4 className="font-bold text-md">
                                                {item.nama_barang}
                                            </h4>
                                            <img src={getGambarBarang(item.url_gambar_barang)} alt="Gambar Barang" />
                                            <div className="flex flex-wrap mt-4 text-green-500 text-sm font-medium">
                                                <button onClick={() => openDetailModal(item.id_barang)} className="hover:text-green-700">
                                                    Lihat Detail
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )
                            }
                        </>
                    )}
                </div>
            </Card>
            <DetailPenjualanModal
                show={showDetailModal}
                onClose={closeDetailModal}
                id={barangId}
            />
        </>
    );
};

export default ListPenjualanCard;
