import React, { useState, useEffect } from 'react'
import { Modal, ModalHeader, ModalBody } from 'flowbite-react'
import { Dropdown, DropdownItem } from 'flowbite-react'
import { Button } from 'flowbite-react'
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

const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
};

const GudangKirimBarangModal = ({ show, onClose, kirim = false, pemesananId, onSuccess }) => {
    const [kurir, setKurir] = useState([]);
    const [pemesanan, setPemesanan] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);
    const [selectedKurir, setSelectedKurir] = useState({ nama: '', id_pegawai: '' });
    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
    const [date, setDate] = useState('');
    const [isLoadingAmbil, setIsLoadingAmbil] = useState(false);

    const isAfterJam4 = () => {
        const now = new Date();
        return now.getHours() >= 16; 
    };

    const isSameDay = (dateStr) => {
        const today = new Date();
        const selectedDate = new Date(dateStr);
        return today.toDateString() === selectedDate.toDateString();
    };

    useEffect(() => {
        const getKurir = async () => {
            if (!pemesananId) return;
            
            setIsLoading(true);
            try {
                const token = localStorage.getItem('token');
                
                const responsePemesanan = await axios.get(`${api}/gudang/pemesanan/${pemesananId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

    
                setPemesanan(responsePemesanan.data);
                console.log(responsePemesanan.data);
            } catch (err) {
                setError(true);
                console.error('Error fetching data:', err);
            } finally {
                setIsLoading(false);
            }
        }
        setSelectedKurir({ nama: '', id_pegawai: '' });
        getKurir();
    }, [show, pemesananId]);

    

    const handleKonfirmasiAmbil = async () => {
        const confirmed = window.confirm('Apakah anda yakin ingin mengkonfirmasi pengambilan barang?');
        if (!confirmed) return;
        
        try {
            setIsLoadingAmbil(true);
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `${api}/gudang/konfirmasi-pengambilan/${pemesananId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            
            if (response.status === 200) {
                window.alert('Pengambilan barang berhasil dikonfirmasi');
                onSuccess?.();
            }
        } catch (error) {
            console.error('Error confirming pickup:', error);
            window.alert(error.response?.data?.message || 'Terjadi kesalahan saat mengkonfirmasi pengambilan');
        } finally {
            setIsLoadingAmbil(false);
        }
    };

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
                ) : error ? (
                    <div className="text-red-500 text-center">Error loading data</div>
                ) : pemesanan?.komisi && pemesanan.komisi.length > 0 ? (
                    <div>
                        <div>
                            <span className='font-medium'>Nomor Nota:</span> {pemesanan.no_nota}
                        </div>
                        <div>
                            <span className='font-medium'>Nama Pembel:</span> {pemesanan.pembeli.nama_pembeli}
                        </div>
                        <div>
                            <span className='font-medium'>Alamat Pembeli:</span> {pemesanan.alamat_penerima}
                        </div>

                        {pemesanan.ongkos_kirim && (
                            <div>
                                <span className='font-medium'>Ongkos Kirim:</span> Rp {parseInt(pemesanan.ongkos_kirim).toLocaleString('id-ID')}
                            </div>
                        )}
                        

                        <div className='flex flex-col gap-6 mt-4'>
                            {pemesanan.komisi.map((item, index) => (
                                <div key={index} className="flex flex-row gap-6 border rounded-lg p-4">
                                    <div className="w-1/3">
                                        <Carousel className="w-full">
                                            <CarouselContent>
                                                {item.barang.url_gambar_barang?.split(';').map((gambar, imgIndex) => (
                                                    <CarouselItem key={imgIndex} className="h-full">
                                                        <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-lg">
                                                            <img
                                                                src={getGambarBarang(gambar)}
                                                                alt={`Product Image ${imgIndex + 1}`}
                                                                className="max-w-full max-h-44 object-contain rounded-md"
                                                                onError={(e) => e.target.src = '/logo.png'}
                                                            />
                                                        </div>
                                                    </CarouselItem>
                                                ))}
                                            </CarouselContent>
                                            <CarouselPrevious />
                                            <CarouselNext />
                                        </Carousel>
                                    </div>
                                    <div className="flex-1 flex flex-col justify-center">
                                        <div className="space-y-2">
                                            <div>
                                                <span className="font-medium">Nama Barang:</span> {item.barang.nama_barang}
                                            </div>
                                            <div>
                                                <span className="font-medium">Harga:</span> Rp {parseInt(item.barang.harga).toLocaleString('id-ID')}
                                            </div>
                                            <div>
                                                <span className="font-medium">Berat:</span> {item.barang.berat} Kg
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            

                            {pemesanan.metode_pengambilan === 'Diambil' ? (
                                <>
                                <div className="bg-red-50 p-4 rounded-lg">
                                    <h3 className="font-semibold text-red-700 mb-2">Informasi Pengambilan</h3>
                                    <div className="space-y-2">
                                        <p>
                                            <span className="font-medium">Status:</span> Barang Sedang Dikirim
                                        </p>
                                        <p>
                                            <span className="font-medium">Tanggal Pengambilan:</span> {formatDate(pemesanan.tanggal_jadwal)}
                                        </p>
                                    </div>
                                </div>
                                <Button 
                                    className='bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition-colors w-full text-center'
                                    onClick={handleKonfirmasiAmbil}
                                    disabled={isLoadingAmbil}
                                >
                                    {isLoadingAmbil ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <PulseLoader size={8} color="#ffffff" />
                                        </div>
                                    ) : (
                                        'Konfirmasi Pengambilan'
                                    )}
                                </Button>
                                </>
                            ) : pemesanan.metode_pengambilan === 'Dikirim' ? (
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <h3 className="font-semibold text-blue-700 mb-2">Informasi Pengiriman</h3>
                                    <div className="space-y-2">
                                        <p>
                                            <span className="font-medium">Kurir:</span> {pemesanan.pegawai?.nama || '-'}
                                        </p>
                                        <p>
                                            <span className="font-medium">Status:</span> Barang Sedang Dikirim
                                        </p>
                                        <p>
                                            <span className="font-medium">Tanggal Pengiriman:</span> {formatDate(pemesanan.tanggal_jadwal)}
                                        </p>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-gray-500">No data available</div>
                )}
            </ModalBody>
        </Modal>
    )
}

export default GudangKirimBarangModal;