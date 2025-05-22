import React, { useState, useEffect } from 'react'
import { Modal, ModalHeader, ModalBody } from 'flowbite-react'
import api from '../../routes/api'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { getGambarBarang } from '@/api/index';
import axios from 'axios'
import { PulseLoader } from 'react-spinners';
import { FaStar } from 'react-icons/fa';

const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const DetailBarangPenitipModal = ({ show, onClose, id, gudang = false }) => {
    const [barang, setBarang] = useState();
    const [status, setStatus] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        setBarang(undefined);
        setError("");
        if (show && id) {
            const getDetail = async (id) => {
                setIsLoading(true);
                try {
                    const token = localStorage.getItem('token');
                    const endpoint = gudang
                        ? `${api}/gudang/barang/detail/${id}`
                        : `${api}/penitip/barang/detail/${id}`;
                    const response = await axios.get(endpoint, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    setBarang(response.data.data);
                    setStatus(response.data.status);
                    console.log(response.data.data);
                } catch (err) {
                    setError("Gagal mengambil data barang.");
                } finally {
                    setIsLoading(false);
                }
            };
            getDetail(id);
        }
    }, [show, id, gudang]);

    return (
        <Modal dismissible show={show} onClose={onClose} size="3xl">
            <ModalHeader>
                Detail Barang
            </ModalHeader>
            <ModalBody>
                {isLoading ? (
                    <div className="flex justify-center items-center py-8">
                        <PulseLoader size={8} color="#057A55" />
                    </div>
                ) 
                : barang ? (
                    <div className='flex flex-row gap-4'>
                        <div>
                            {barang.url_gambar_barang ? (
                                <Carousel className="max-w-44 max-h-44">
                                    <CarouselContent>
                                        {barang.url_gambar_barang?.split(';').map((gambar, index) => (
                                            <CarouselItem key={index} className="h-full">
                                                <div className="w-full h-full flex items-center justify-center bg-gray-50">
                                                    <img
                                                        src={getGambarBarang(gambar)}
                                                        alt={`Product Image ${index + 1}`}
                                                        className="max-w-full max-h-full object-contain rounded-md"
                                                        onError={(e) => e.target.src = '/logo.png'}
                                                    />
                                                </div>
                                            </CarouselItem>
                                        ))}
                                    </CarouselContent>
                                    <CarouselPrevious />
                                    <CarouselNext />
                                </Carousel>
                            ) : (
                                <img
                                    src={'/logo.png'}
                                    alt="No Image"
                                    className="max-w-44 max-h-44 object-contain rounded-md"
                                />
                            )}
                        </div>
                        <div className="flex flex-col gap-1 justify-center">
                            <div>
                                <span className="font-medium">Nama Barang:</span> {barang.nama_barang}
                            </div>
                            <div>
                                <span className="font-medium">Harga:</span> Rp {parseInt(barang.harga).toLocaleString('id-ID')}
                            </div>
                            {barang.tanggal_garansi_habis && (
                                <div>
                                    <span className="font-medium">Tanggal Garansi Habis:</span> {formatDate(barang.tanggal_garansi_habis)}
                                </div>
                            )}
                            <div>
                                <span className="font-medium">Tanggal Masuk Penitipan:</span> {formatDate(barang.rincian_penitipan.penitipan.tanggal_masuk)}
                            </div>
                            <div>
                                <span className="font-medium">Tanggal Penitipan Berakhir:</span> {formatDate(barang.rincian_penitipan.tanggal_selesai)}
                            </div>
                            <div>
                                <span className="font-medium">Batas Ambil:</span> {formatDate(barang.rincian_penitipan.batas_ambil)}
                            </div>
                            <div>
                                <span className="font-medium">Status Perpanjangan:</span>{' '}
                                <span className={barang.rincian_penitipan.sudah_diperpanjang ? 'text-green-600' : 'text-orange-600'}>
                                    {barang.rincian_penitipan.sudah_diperpanjang ? 'Sudah Diperpanjang' : 'Belum Diperpanjang'}
                                </span>
                            </div>

                            {barang.status === 'Terjual' && (
                                <div className="flex items-center gap-1">
                                    <span className="font-medium">Dibeli Oleh:</span> {barang.komisi[0].pemesanan.pembeli.nama_pembeli}
                                </div>
                            )}

                            {barang.status === 'Terjual' && barang.rating !== null && (
                                <div className="flex items-center gap-1">
                                    <span className="font-medium">Rating:</span>
                                    <FaStar className="h-4 w-4 text-amber-500 fill-amber-500" />
                                    <span className="ml-1 text-amber-500">{barang.rating}</span>
                                </div>
                            )}

                            {barang.status === 'Didonasikan' && (
                                <>
                                <div>
                                    <span className="font-medium">Didonasikan Ke: </span> {barang.donasi.nama_penerima} ({barang.donasi.request_donasi.organisasi.nama})
                                </div>
                                <div>
                                    <span className="font-medium">Tanggal Didonasikan:</span> {formatDate(barang.donasi.tanggal_diterima)}
                                </div>
                                </>
                            )}

                            {barang.rincian_penitipan.tanggal_konfirmasi && (
                                <div>
                                    <span className="font-medium">Tanggal Konfirmasi Pengambilan:</span> {formatDate(barang.rincian_penitipan.tanggal_konfirmasi)}
                                </div>
                            )}

                            {barang.status === 'Dikembalikan' && (
                                <>
                                <div>
                                    <span className="font-medium">Tanggal Diambil Penitip:</span> {formatDate(barang.rincian_penitipan.tanggal_diambil)}
                                </div>
                                <div>
                                    
                                </div>
                                </>
                            )}

                        </div>
                    </div>
                ) : (
                    <p>Data barang belum dimuat.</p>
                )}
            </ModalBody>
        </Modal>
    )
}

export default DetailBarangPenitipModal