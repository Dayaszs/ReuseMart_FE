import React, { useEffect, useState } from 'react';
import {
    Modal, ModalBody, ModalHeader,
    Button, Label, TextInput,
    Alert
} from 'flowbite-react';
import { PulseLoader } from 'react-spinners';
import { getGambarBarang, getGambarBuktiPembayaran } from '@/api';
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { Calendar, CircleDollarSign, CreditCard, Users } from 'lucide-react';

const VerifikasiPembayaranModal = ({ show, onClose, pembayaranData, verifikasiPembayaran, tolakPembayaran }) => {
    const [pemesananId, setPemesananId] = useState(null);
    const [pembayaranId, setPembayaranId] = useState(null);

    const [buktiPembayaran, setBuktiPembayaran] = useState("");
    const [metodePembayaran, setMetodePembayaran] = useState("");
    const [noNota, setNoNota] = useState("");
    const [biayaTotal, setBiayaTotal] = useState("");
    const [namaPembeli, setNamaPembeli] = useState("");
    const [emailPembeli, setEmailPembeli] = useState("");
    const [barang, setBarang] = useState([]);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleTerima = async (e) => {
        const confirmed = confirm("Apakah anda yakin ingin menerima pembayaran ini?");
        if (!confirmed) {
            return;
        }
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            await verifikasiPembayaran(pembayaranId);
            setSuccess("Berhasil memverifikasi pembayaran!");
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (err) {
            setError(error.response.data.message || "Terjadi kesalahan saat memverifikasi pembayaran.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleTolak = async (e) => {
        const confirmed = confirm("Apakah anda yakin ingin menolak pembayaran ini?");
        if (!confirmed) {
            return;
        }
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            await tolakPembayaran(pembayaranId, pemesananId);
            setSuccess("Berhasil menolak pembayaran!");
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (err) {
            setError(error.response.data.message || "Terjadi kesalahan saat memverifikasi pembayaran.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!show) {
            setError("");
            setSuccess(null);
        }
    }, [show]);

    useEffect(() => {
        if (pembayaranData) {
            setPemesananId(pembayaranData.id_pemesanan);
            setPembayaranId(pembayaranData.id_pembayaran);
            setBuktiPembayaran(pembayaranData.bukti_pembayaran);
            setMetodePembayaran(pembayaranData.metode_pembayaran);
            setNoNota(pembayaranData.no_nota);
            setBiayaTotal(pembayaranData.biaya_total);
            setNamaPembeli(pembayaranData.nama_pembeli);
            setEmailPembeli(pembayaranData.email);
            setBarang(pembayaranData.barang);
        }
    }, [pembayaranData]);

    return (
        <Modal dismissible show={show} onClose={onClose}>
            <ModalHeader className="border-b border-gray-200">
                <div className="flex items-center justify-between w-full">
                    <h3 className="text-xl font-semibold text-gray-800">
                        Detail Verifikasi Pembayaran
                    </h3>
                </div>
            </ModalHeader>
            <ModalBody>
                {success ? (
                    <>
                        <Alert color="green">{success}</Alert>
                    </>
                ) : (
                    <>
                        {/* Detail Pembayaran/Pemesanan */}
                        <div className="max-h-[calc(90vh-8rem)]">
                            {/* Nomor Nota */}
                            <div className="mb-5 flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-500">No. Nota: <strong>{noNota}</strong></span>
                            </div>

                            {/* Informasi Pembayaran */}
                            <div className="mb-6 rounded-lg border border-gray-100 bg-gray-50 p-4">
                                <h4 className="mb-3 text-sm font-medium text-gray-700">Informasi Pembayaran</h4>

                                <div className="grid grid-cols-2 gap-4">
                                    {/* Tanggal Pembayaran */}
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="h-4 w-4 text-gray-400" />
                                            <p className="text-xs font-medium text-gray-500">Tanggal</p>
                                        </div>
                                        <p className="text-sm font-medium">
                                            {new Date(pembayaranData?.tanggal_pembayaran).toLocaleDateString("id-ID", {
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric",
                                            })}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {new Date(pembayaranData?.tanggal_pembayaran).toLocaleTimeString("id-ID", {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                timeZone: "Asia/Jakarta",
                                            })}{" "}
                                            WIB
                                        </p>
                                    </div>

                                    {/* Metode Pembayaran */}
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-1.5">
                                            <CreditCard className="h-4 w-4 text-gray-400" />
                                            <p className="text-xs font-medium text-gray-500">Metode</p>
                                        </div>
                                        <p className="text-sm font-medium">{metodePembayaran}</p>
                                    </div>

                                    {/* Informasi Pembeli */}
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-1.5">
                                            <Users className="h-4 w-4 text-gray-400" />
                                            <p className="text-xs font-medium text-gray-500">Pembeli</p>
                                        </div>
                                        <p className="text-sm font-medium">{namaPembeli}</p>
                                        <p className="text-xs text-gray-500">{emailPembeli}</p>
                                    </div>

                                    {/* Biaya Total */}
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-1.5">
                                            <CircleDollarSign className="h-4 w-4 text-gray-400" />
                                            <p className="text-xs font-medium text-gray-500">Biaya Total (+Ongkir, dll.)</p>
                                        </div>
                                        <p className="text-sm font-bold text-green-600">
                                            Rp{Number.parseInt(biayaTotal).toLocaleString("id-ID")}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Barang-barang yang Dibeli */}
                            <div className="mb-6">
                                <h4 className="mb-3 text-sm font-medium text-gray-700">Produk</h4>

                                <div className="space-y-2">
                                    {barang.map((item, index) => (
                                        <div key={index} className="flex items-center gap-3 rounded-lg border border-gray-100 p-3">
                                            <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
                                                <img
                                                    src={item.url_gambar_barang ? getGambarBarang(item.url_gambar_barang).split(';')[0] : "/logo.png"}
                                                    alt={item.nama_barang}
                                                    className="h-full w-full object-cover"
                                                    onError={(e) => {
                                                        e.target.src = "/logo.png"
                                                    }}
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="truncate text-sm font-medium">{item.nama_barang}</p>
                                                {item.quantity && <p className="text-xs text-gray-500">Jml: {item.quantity}</p>}
                                            </div>
                                            {item.harga && (
                                                <div className="text-right">
                                                    <p className="whitespace-nowrap text-sm font-medium">
                                                        Rp{Number.parseInt(item.harga).toLocaleString("id-ID")}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Bukti Pembayaran */}
                            <div>
                                <h4 className="mb-3 text-sm font-medium text-gray-700">Bukti Pembayaran</h4>

                                <div className="flex flex-col items-center">
                                    <div className="mb-2 w-full overflow-hidden rounded-lg border border-gray-200">
                                        <img
                                            src={buktiPembayaran ? getGambarBuktiPembayaran(buktiPembayaran) : "/logo.png"}
                                            alt="Bukti Pembayaran"
                                            className="h-auto w-full object-cover"
                                            onError={(e) => {
                                                e.target.src = "/logo.png"
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            {pembayaranData?.status_pemesanan === 'Pending' && (
                                <div className="flex flex-col sm:flex-row gap-3 justify-end mt-6">
                                    <button onClick={handleTolak} type="button" className="flex items-center justify-center gap-2 text-white bg-red-600 hover:bg-red-700 hover:cursor-pointer focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-4">
                                        <FaTimesCircle />
                                        <span>Tolak Pembayaran</span>
                                    </button>
                                    <button onClick={handleTerima} type="button" className="flex items-center justify-center gap-2 text-white bg-green-600 hover:bg-green-700 hover:cursor-pointer focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-4">
                                        <FaCheckCircle />
                                        <span>Verifikasi Pembayaran</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </ModalBody>
        </Modal>
    );
};

export default VerifikasiPembayaranModal;
