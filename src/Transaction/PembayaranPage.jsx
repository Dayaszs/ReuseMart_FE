import React from 'react'
import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { PulseLoader } from 'react-spinners';
import { LuClock, LuUpload } from "react-icons/lu";
import { Card, Label, Alert } from "flowbite-react"
import { RxCross2 } from "react-icons/rx";
import { FaCheck } from "react-icons/fa6";
import { PiWarningCircleLight } from "react-icons/pi";
import { ShowDetailPembayaran, UploadBuktiPembayaran } from '../api/services/apiPembayaran';
import { CancelPemesanan } from '../api/services/apiPemesanan';

const PembayaranPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [detailPembayaran, setDetailPembayaran] = useState({})
    const [timeLeft, setTimeLeft] = useState(99);
    const [file, setFile] = useState(null)
    const [preview, setPreview] = useState("")
    const [isUploading, setIsUploading] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [isSuccess, setIsSuccess] = useState(false)
    const [isBatal, setIsBatal] = useState(false)
    const fileInputRef = useRef(null)

    const formatTime = (detik) => {
        const mins = Math.floor(detik / 60)
        const secs = detik % 60
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0]
        if (!selectedFile) return

        setFile(selectedFile)
        const fileUrl = URL.createObjectURL(selectedFile)
        setPreview(fileUrl)
    }

    const triggerFileInput = () => {
        fileInputRef.current.click()
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('bukti_pembayaran', file);

        UploadBuktiPembayaran(id, formData)
            .then((res) => {
                setIsSuccess(true);
            })
            .catch((err) => {
                setError(err.message || "Gagal mengupload bukti pembayaran.");
            })
            .finally(() => {
                setIsUploading(false);
            });
    }

    const getDetailPembayaran = () => {
        setIsLoading(true);
        ShowDetailPembayaran(id)
            .then((res) => {
                setDetailPembayaran(res.data);
                // const batasWaktu = new Date(res.data.batas_waktu).getTime();
                // localStorage.setItem(`batasWaktu_${id}`, batasWaktu.toString());
                // updateTimeLeft(batasWaktu);
            })
            .catch((err) => {
                setError(err.message || "Gagal mengambil data.");
                if (err.response && err.response.status === 403) {
                    navigate('/unauthorized');
                }
            })
            .finally(() => setIsLoading(false));
    }

    const cancelPemesanan = () => {
        setIsLoading(true);
        CancelPemesanan(id)
            .then((res) => {
                setIsBatal(true);
            })
            .catch((err) => {
                setError(err.message || "Gagal mengambil data.");
                if (err && err.status === 410) {
                    setIsBatal(false);
                    setIsSuccess(true);
                }
            })
            .finally(() => setIsLoading(false));
    }

    useEffect(() => {
        getDetailPembayaran();
    }, []);

    useEffect(() => {
        const batasWaktu = new Date(detailPembayaran.batas_waktu).getTime();
        localStorage.setItem(`batasWaktu_${id}`, batasWaktu.toString());
        updateTimeLeft(batasWaktu);
    }, [detailPembayaran]);

    const updateTimeLeft = (batasWaktu) => {
        const now = Date.now();
        const remaining = Math.max(0, Math.floor((batasWaktu - now) / 1000));
        setTimeLeft(remaining);
    };

    useEffect(() => {
        const key = `batasWaktu_${id}`;

        const interval = setInterval(() => {
            const storedBatas = localStorage.getItem(key);
            if (storedBatas) {
                updateTimeLeft(parseInt(storedBatas));
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [id]);

    useEffect(() => {
        console.log("timeLeft", timeLeft);
        console.log("isSuccess", isSuccess);
        const storedBatas = localStorage.getItem(`batasWaktu_${id}`);
        if (timeLeft === 0 && !isSuccess && storedBatas) {
            console.log("storedBatas", storedBatas);
            cancelPemesanan();
        }
    }, [timeLeft, isSuccess]);


    if (isLoading) {
        return (
            <Card className="w-full min-h-screen bg-white/90 backdrop-blur-md p-6 items-center flex justify-center">
                <PulseLoader size={15} color="#057A55" />
            </Card>
        );
    }

    return (
        <div className='min-h-screen flex items-center justify-center bg-[url("/background.jpg")] bg-cover bg-center bg-no-repeat p-6'>
            <Card className="w-full max-w-4xl">
                {isBatal ? (
                    <>
                        <div className='flex flex-col items-center justify-center space-y-8 p-12'>
                            <div className='flex flex-col items-center text-center space-y-6'>
                                <div className='w-20 h-20 bg-red-100 rounded-full flex items-center justify-center transform transition-all duration-300 hover:scale-110'>
                                    <RxCross2 className='w-10 h-10 text-red-500' />
                                </div>
                                <div className="space-y-3">
                                    <h2 className='text-3xl font-bold text-gray-800 text-center'>Pemesanan Dibatalkan</h2>
                                    <p className='text-gray-500 text-lg text-center leading-relaxed'>
                                        Waktu pembayaran telah habis. Silakan kembali ke halaman profil.
                                    </p>
                                </div>
                            </div>
                            <button
                                className='bg-green-500 hover:bg-green-600 transition duration-200 hover:cursor-pointer text-white px-6 py-3 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 shadow-md'
                                onClick={() => navigate('/pembeli/profile')}
                            >
                                Kembali ke Profil
                            </button>
                        </div>
                    </>
                ) : isSuccess ? (
                    <>
                        <div className='flex flex-col items-center justify-center space-y-8 p-12'>
                            <div className='flex flex-col items-center text-center space-y-6'>
                                <div className='w-20 h-20 bg-green-100 rounded-full flex items-center justify-center transform transition-all duration-300 hover:scale-110'>
                                    <FaCheck className='w-10 h-10 text-green-500' />
                                </div>
                                <div className="space-y-3">
                                    <h2 className='text-3xl font-bold text-gray-800 text-center'>Bukti Pembayaran Terkirim</h2>
                                    <p className='text-gray-500 text-lg text-center leading-relaxed'>
                                        Terima kasih telah mengunggah bukti pembayaran Anda. Mohon tunggu verifikasi dari Reusemart.
                                    </p>
                                </div>
                            </div>
                            <button
                                className='bg-green-500 hover:bg-green-600 transition duration-200 hover:cursor-pointer text-white px-6 py-3 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 shadow-md'
                                onClick={() => navigate('/pembeli/profile')}
                            >
                                Kembali ke Profil
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <div>
                            <h5 className="text-xl font-semibold text-gray-900">Konfirmasi Pembayaran</h5>
                            <p className="text-sm font-normal text-gray-500">Silakan transfer dan upload bukti pembayaran Anda</p>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-6">
                                    {/* Timer */}
                                    <div className="flex items-center justify-center">
                                        <div
                                            className={`flex items-center justify-center rounded-full ${timeLeft <= 10 ? "bg-red-100" : "bg-gray-100"} p-4 h-24 w-24`}
                                        >
                                            <div className="text-center">
                                                <LuClock className={`h-5 w-5 mx-auto mb-1 ${timeLeft <= 10 ? "text-red-500" : "text-gray-500"}`} />
                                                <span className={`text-lg font-bold ${timeLeft <= 10 ? "text-red-500" : "text-gray-700"}`}>
                                                    {formatTime(timeLeft)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Payment Details */}
                                    <div className="rounded-lg border p-4 bg-white">
                                        <h3 className="font-medium text-sm text-gray-500 mb-3">Rincian Pembayaran</h3>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Subtotal</span>
                                                <span className="font-medium">Rp{parseInt(detailPembayaran.subtotal).toLocaleString("id-ID")}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Ongkos Kirim</span>
                                                <span className="font-medium">Rp{parseInt(detailPembayaran.ongkos_kirim).toLocaleString("id-ID")}</span>
                                            </div>
                                            {detailPembayaran.diskon > 0 && (
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Diskon</span>
                                                    <span className="font-medium text-green-500">
                                                        -Rp{parseInt(detailPembayaran.diskon).toLocaleString("id-ID")}
                                                    </span>
                                                </div>
                                            )}
                                            <div className="border-t my-2"></div>
                                            <div className="flex justify-between">
                                                <span className="font-semibold">Total</span>
                                                <span className="font-bold text-lg">Rp{parseInt(detailPembayaran.biaya_total).toLocaleString("id-ID")}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bank Account Info */}
                                    <div className="rounded-lg border border-emerald-500 p-4 bg-emerald-50">
                                        <h3 className="font-medium text-sm text-gray-500 mb-2">Rekening Perusahaan</h3>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Bank BCA</span>
                                                <span className="font-medium">1234-5678-9012</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Bank Mandiri</span>
                                                <span className="font-medium">0987-6543-2109</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">A/N</span>
                                                <span className="font-medium">PT Reusemart</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>


                                <div className="space-y-2 flex-1">
                                    <div>
                                        <Label htmlFor="file-upload" className="font-medium text-lg">
                                            Upload Bukti Pembayaran
                                        </Label>
                                    </div>

                                    {!preview ? (
                                        <div
                                            onClick={triggerFileInput}
                                            className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors h-full min-h-[300px]"
                                        >
                                            <LuUpload className="h-8 w-8 text-gray-400 mb-2" />
                                            <p className="text-sm text-gray-500">Klik untuk upload bukti pembayaran</p>
                                            <p className="text-xs text-gray-400 mt-1">Format: JPEG, JPG, PNG (Maks. 2MB)</p>
                                        </div>
                                    ) : (
                                        <div className="border rounded-lg overflow-hidden h-full flex flex-col">
                                            <div className="relative bg-gray-100 flex-1">
                                                <img
                                                    src={preview || "/logo.png"}
                                                    alt="Preview bukti pembayaran"
                                                    className="w-full h-full object-contain"
                                                />
                                                <button
                                                    onClick={() => {
                                                        setFile(null)
                                                        setPreview("")
                                                    }}
                                                    className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm hover:cursor-pointer hover:bg-gray-200 transition-colors duration-150"
                                                >
                                                    <span className="sr-only">Hapus</span>
                                                    <RxCross2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                            <div className="p-3 bg-white">
                                                <p className="text-sm truncate">{file?.name}</p>
                                                <p className="text-xs text-gray-500">{(file?.size / 1024 / 1024).toFixed(2)} MB</p>
                                            </div>
                                        </div>
                                    )}

                                    <input
                                        id="file-upload"
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        accept=".jpg,.jpeg,.png"
                                        className="hidden"
                                    />
                                </div>


                                <div className="col-span-1 md:col-span-2 mt-6">
                                    {/* Warning for time running out */}
                                    {timeLeft <= 10 && !isSuccess && (
                                        <Alert color="failure">
                                            <div className="flex items-center gap-3">
                                                <PiWarningCircleLight className='h-7 w-7 text-red-500' />
                                                <div>
                                                    <h3 className="font-medium text-red-800">Perhatian!</h3>
                                                    <div className="text-sm text-red-700">Waktu hampir habis. Segera upload bukti pembayaran Anda.</div>
                                                </div>
                                            </div>
                                        </Alert>
                                    )}
                                </div>

                                <div className={`col-span-1 md:col-span-2 ${timeLeft <= 10 && !isSuccess ? "" : "mt-6"}`}>
                                    <button
                                        type='submit'
                                        disabled={!file || isUploading || isSuccess || timeLeft <= 0}
                                        className="w-full bg-green-500 text-white py-3 rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center justify-center hover:cursor-pointer"
                                    >
                                        {isUploading ? (
                                            <>
                                                <PulseLoader color="#fff" size={8} />
                                            </>
                                        ) : (
                                            "Konfirmasi Pembayaran"
                                        )}
                                    </button>
                                </div>
                            </div>
                        </form>

                        {/* <div className="mt-4">
                            <button
                                type='submit'
                                // disabled={!file || isUploading || isSuccess || timeLeft <= 0}
                                className="w-full bg-green-500 text-white py-3 rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center justify-center hover:cursor-pointer"
                            >
                                {isUploading ? (
                                    <>
                                        <PulseLoader color="#fff" size={8} />
                                    </>
                                ) : isSuccess ? (
                                    <>
                                        <p>Berhasil Diunggah</p>
                                    </>
                                ) : (
                                    "Konfirmasi Pembayaran"
                                )}
                            </button>
                        </div> */}
                    </>
                )}
            </Card>
        </div>
    );
}

export default PembayaranPage