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

const GudangKirimBarangModal = ({ show, onClose, kirim = false, pemesananId, onSuccess }) => {
    const [kurir, setKurir] = useState([]);
    const [pemesanan, setPemesanan] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);
    const [selectedKurir, setSelectedKurir] = useState({ nama: '', id_pegawai: '' });
    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
    const [date, setDate] = useState('');

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
                const response = await axios.get(`${api}/gudang/kurir`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const responsePemesanan = await axios.get(`${api}/gudang/pemesanan/${pemesananId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setKurir(response.data);
                setPemesanan(responsePemesanan.data);
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

    const handleProsesLanjut = async () => {
        if (kirim && selectedKurir.id_pegawai === '') {
            window.alert('Anda belum memilih kurir');
            return;
        } else if (date === '') {
            window.alert('Anda belum memilih tanggal pengiriman');
            return;
        } else if (kirim && isAfterJam4() && isSameDay(date)) {
            window.alert('Tidak Bisa Kirim Barang Setelah jam 4');
            return;
        } else {
            const conirmed = window.confirm('Apakah anda yakin ingin melanjutkan proses pengiriman barang?');
            if (!conirmed) return;
            try {
                setIsLoadingUpdate(true);
                const token = localStorage.getItem('token');
                const response = await axios.post(`${api}/gudang/update-status-pemesanan/${pemesananId}`, 
                    {
                        kurir: selectedKurir.id_pegawai,
                        tanggal_jadwal: date,
                    },
                    {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

               
            } catch (err) {
                setError(true);
                console.error('Error fetching data:', err);
            } finally {
                setIsLoadingUpdate(false);
                window.alert('Proses lanjut barang berhasil');
                onSuccess?.();
                onClose();
            }
        }
    }

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

                            <div className="w-full">
                                <label className="block mb-2 text-sm font-medium text-gray-900">
                                    Jadwal Pengiriman/Pengambilan
                                </label>
                                <input
                                    type="date"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                />
                                {kirim && isAfterJam4() && isSameDay(date) && (
                                    <div className="text-red-500 text-sm mt-2">
                                        Tidak Bisa Kirim Barang Setelah jam 4
                                    </div>
                                )}
                            </div>

                            {kirim && (
                                <Dropdown
                                    label={selectedKurir.nama || "Pilih Kurir"}
                                    dismissOnClick={false}
                                    className='bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded transition-colors w-full text-center'
                                    color="success"

                                >
                                    {kurir.map((item, index) => (
                                        <DropdownItem
                                            className='bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded transition-colors w-full text-center'
                                            key={index}
                                            onClick={() => setSelectedKurir({ nama: item.nama, id_pegawai: item.id_pegawai })}
                                        >
                                            {item.nama}
                                        </DropdownItem>
                                    ))}
                                </Dropdown>
                            )}
                            

                            <Button className='bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded transition-colors w-full text-center'
                                onClick={() => {
                                    handleProsesLanjut();
                                }}
                                
                            >
                                Proses Lanjut
                            </Button>

                            
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