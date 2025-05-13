import React from 'react'
import { Modal, ModalHeader, ModalBody } from 'flowbite-react'
import { GetDetailBarangTerjual } from '@/api/services/apiPenitip'
import { useState, useEffect } from 'react'
import { getGambarBarang } from '@/api'
import { FaStar } from "react-icons/fa";

const DetailPenjualanModal = ({ show, onClose, id }) => {
    const [pemesanan, setPemesanan] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);

    const getDetail = (id) => {
        setIsLoading(true);
        GetDetailBarangTerjual(id)
            .then((res) => {
                setPemesanan(res.data);
            })
            .catch((err) => {
                setError(err.message || "Gagal mengambil data.");
            })
            .finally(() => setIsLoading(false));
    }

    useEffect(() => {
        setError("");
        getDetail(id);
    }, [show])

    return (
        <Modal dismissible show={show} onClose={onClose}>
            <ModalHeader>
                Detail Transaksi
            </ModalHeader>
            <ModalBody>
                {isLoading
                    ? (
                        <>
                        </>
                    ) : (
                        <>
                            <div className="space-y-6 text-sm text-gray-700">
                                {/* Order Completed */}
                                <div>
                                    <div className="flex justify-between items-center mt-1">
                                        <div>
                                            <p className="text-gray-500">No. Pemesanan</p>
                                            <p className="text-gray-500">Tanggal Pemesanan</p>
                                            <p className="text-gray-500">Status</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-green-500 font-bold">{pemesanan.no_nota}</p>
                                            <p className='font-medium text-black'>
                                                {(() => {
                                                    try {
                                                        const date = new Date(pemesanan.tanggal_pemesanan.replace(' ', 'T'));
                                                        if (isNaN(date.getTime())) {
                                                            throw new Error('Invalid date');
                                                        }
                                                        return new Intl.DateTimeFormat('id-ID', {
                                                            day: 'numeric',
                                                            month: 'long',
                                                            year: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                            hour12: false
                                                        }).format(date) + ' WIB';
                                                    } catch (error) {
                                                        return '';
                                                    }
                                                })()}
                                            </p>
                                            <p className="font-medium text-black">{pemesanan.status_pemesanan}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Informasi & Detail Barang */}
                                <div>
                                    <h3 className="font-bold text-black">Detail Barang</h3>
                                    <div className="flex items-center justify-between mt-2">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={getGambarBarang(pemesanan.url_gambar_barang)}
                                                alt={pemesanan.nama_barang}
                                                className="w-14 h-14 object-cover rounded"
                                            />
                                            <div>
                                                <p className="font-semibold text-black">{pemesanan.nama_barang}</p>
                                                <p className="font-medium text-black">{`Rp${parseInt(pemesanan.harga).toLocaleString('id-ID')}`}</p>
                                            </div>
                                        </div>
                                        <div className='flex flex-wrap self-start'>
                                            <FaStar className="h-5 w-5 text-amber-500 fill-amber-500" />
                                            <p className='font-bold text-black ms-1'>{pemesanan.rating ? pemesanan.rating : "-"}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Informasi Pengambilan/Pengiriman */}
                                <div>
                                    {pemesanan.metode_pengambilan === "Dikirim"
                                        ? (
                                            <>
                                                <h3 className="font-bold text-black">Info Pengiriman</h3>
                                                <div className="flex items-center justify-start mt-2 space-y-1">
                                                    <div>
                                                        <p className="text-gray-500">
                                                            Dikirim Oleh
                                                        </p>
                                                        <p className="text-gray-500">
                                                            Tanggal Pengiriman
                                                        </p>
                                                        <p className="text-gray-500">
                                                            Tanggal Selesai
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className='flex items-center justify-start ms-6'>
                                                            <span>:</span>
                                                            <span className='ms-6 font-medium text-black'>
                                                                {pemesanan.id_pegawai ? `Kurir Reusemart(${pemesanan.nama_pegawai})` : "-"}
                                                            </span>
                                                        </p>
                                                        <p className='flex items-center justify-start ms-6'>
                                                            <span>:</span>
                                                            <span className='ms-6 font-medium text-black'>
                                                                {(() => {
                                                                    try {
                                                                        if (!pemesanan.tanggal_jadwal) {
                                                                            return "-";
                                                                        }
                                                                        const date = new Date(pemesanan.tanggal_jadwal.replace(' ', 'T'));
                                                                        if (isNaN(date.getTime())) {
                                                                            throw new Error('Invalid date');
                                                                        }
                                                                        return new Intl.DateTimeFormat('id-ID', {
                                                                            day: 'numeric',
                                                                            month: 'long',
                                                                            year: 'numeric',
                                                                            hour: '2-digit',
                                                                            minute: '2-digit',
                                                                            hour12: false
                                                                        }).format(date) + ' WIB';
                                                                    } catch (error) {
                                                                        return '';
                                                                    }
                                                                })()}
                                                            </span>
                                                        </p>
                                                        <p className='flex items-center justify-start ms-6'>
                                                            <span>:</span>
                                                            <span className='ms-6 font-medium text-black'>
                                                                {(() => {
                                                                    try {
                                                                        if (!pemesanan.tanggal_selesai) {
                                                                            return "-";
                                                                        }
                                                                        const date = new Date(pemesanan.tanggal_selesai.replace(' ', 'T'));
                                                                        if (isNaN(date.getTime())) {
                                                                            throw new Error('Invalid date');
                                                                        }
                                                                        return new Intl.DateTimeFormat('id-ID', {
                                                                            day: 'numeric',
                                                                            month: 'long',
                                                                            year: 'numeric',
                                                                            hour: '2-digit',
                                                                            minute: '2-digit',
                                                                            hour12: false
                                                                        }).format(date) + ' WIB';
                                                                    } catch (error) {
                                                                        return '';
                                                                    }
                                                                })()}
                                                            </span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <h3 className="font-bold text-black">Info Pengambilan</h3>
                                                <div className="flex items-center justify-start mt-2 space-y-1">
                                                    <div>
                                                        <p className="text-gray-500">
                                                            Diambil Oleh
                                                        </p>
                                                        <p className="text-gray-500">
                                                            Tanggal Pengambilan
                                                        </p>
                                                        <p className="text-gray-500">
                                                            Tanggal Selesai
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className='flex items-center justify-start ms-6'>
                                                            <span>:</span>
                                                            <span className='ms-6 font-medium text-black'>
                                                                {pemesanan.nama_pembeli}
                                                            </span>
                                                        </p>
                                                        <p className='flex items-center justify-start ms-6'>
                                                            <span>:</span>
                                                            <span className='ms-6 font-medium text-black'>
                                                                {(() => {
                                                                    try {
                                                                        if (!pemesanan.tanggal_jadwal) {
                                                                            return "-";
                                                                        }
                                                                        const date = new Date(pemesanan.tanggal_jadwal.replace(' ', 'T'));
                                                                        if (isNaN(date.getTime())) {
                                                                            throw new Error('Invalid date');
                                                                        }
                                                                        return new Intl.DateTimeFormat('id-ID', {
                                                                            day: 'numeric',
                                                                            month: 'long',
                                                                            year: 'numeric',
                                                                            hour: '2-digit',
                                                                            minute: '2-digit',
                                                                            hour12: false
                                                                        }).format(date) + ' WIB';
                                                                    } catch (error) {
                                                                        return '';
                                                                    }
                                                                })()}
                                                            </span>
                                                        </p>
                                                        <p className='flex items-center justify-start ms-6'>
                                                            <span>:</span>
                                                            <span className='ms-6 font-medium text-black'>
                                                                {(() => {
                                                                    try {
                                                                        if (!pemesanan.tanggal_selesai) {
                                                                            return "-";
                                                                        }
                                                                        const date = new Date(pemesanan.tanggal_selesai.replace(' ', 'T'));
                                                                        if (isNaN(date.getTime())) {
                                                                            throw new Error('Invalid date');
                                                                        }
                                                                        return new Intl.DateTimeFormat('id-ID', {
                                                                            day: 'numeric',
                                                                            month: 'long',
                                                                            year: 'numeric',
                                                                            hour: '2-digit',
                                                                            minute: '2-digit',
                                                                            hour12: false
                                                                        }).format(date) + ' WIB';
                                                                    } catch (error) {
                                                                        return '';
                                                                    }
                                                                })()}
                                                            </span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                </div>

                                {/* Rincian Komisi Penitip */}
                                <div>
                                    <h3 className="font-bold text-black">Rincian Komisi</h3>
                                    <div className="flex justify-between items-center mt-2">
                                        <div>
                                            <p className="text-gray-500">
                                                Komisi Reusemart ({(Number(pemesanan.persentase_komisi_perusahaan) * 100).toFixed(0)}%)
                                            </p>
                                            <p className="text-gray-500">
                                                Komisi Hunter {pemesanan.persentase_komisi_hunter ? `(${(Number(pemesanan.persentase_komisi_hunter) * 100).toFixed(0)}%)` : "(0%)"}
                                            </p>
                                            <p className="text-gray-500">
                                                Komisi Penitip ({(Number(pemesanan.persentase_komisi_penitip) * 100).toFixed(0)}%)
                                            </p>
                                            <p className="text-gray-500">Bonus Penitip (Terjual &lt; 7 Hari)</p>
                                            <p className="text-black font-bold mt-2">Total Komisi</p>
                                        </div>
                                        <div className='text-right'>
                                            <p className='font-medium text-black'>{`-Rp${parseInt(pemesanan.komisi_perusahaan).toLocaleString('id-ID')}`}</p>
                                            <p className='font-medium text-black'>{pemesanan.komisi_hunter ? `-Rp${parseInt(pemesanan.komisi_hunter).toLocaleString('id-ID')}` : "-Rp0"}</p>
                                            <p className='font-medium text-black'>{`Rp${parseInt(pemesanan.komisi_penitip).toLocaleString('id-ID')}`}</p>
                                            <p className='font-medium text-black'>{pemesanan.bonus_komisi ? `Rp${parseInt(pemesanan.bonus_komisi).toLocaleString('id-ID')}` : "Rp0"}</p>
                                            <p className='text-black font-bold mt-2'>{`Rp${parseInt(pemesanan.total_komisi).toLocaleString('id-ID')}`}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )
                }
            </ModalBody>
        </Modal>
    )
}

export default DetailPenjualanModal