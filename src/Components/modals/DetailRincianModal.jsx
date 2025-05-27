import React from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'flowbite-react'
import { useState, useEffect } from 'react'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { getGambarBarang } from '@/api/index';

const DetailRincianModal = ({ show, onClose, data }) =>{
    // const [ rincianPenitipan, setRincianPenitipan ] = useState([]);
    const[ idRincianPenitipan, setIdRincianPenitipan ] = useState("");
    const[ namaPenitip, setNamaPenitip ] = useState("");
    const[ noTelpPenitip, setNoTelpPenitip ] = useState("");
    const[ emailPenitip, setEmailPenitip ] = useState("");
    const[ alamatPenitip, setAlamatPenitip ] = useState("");

    const[ namaPegawai, setNamaPegawai ] = useState("");
    const[ noTelpPegawai, setNoTelpPegawai ] = useState("");

    const[ namaBarang, setNamaBarang ] = useState("");
    const[ deskripsiBarang, setDeskripsiBarang ] = useState("");
    const[ gambarBarang, setGambarBarang ] = useState("");
    const[ hargaBarang, setHargaBarang ] = useState("");
    const[ tanggalGaransiBarang, setTanggalGaransiBarang ] = useState("");
    const[ statusBarang, setStatusBarang ] = useState("");
    const[ beratBarang, setBeratBarang ] = useState("");

    const[ tanggalMasukBarang, setTanggalMasukBarang ] = useState("");
    const[ tanggalSelesaiBarang, setTanggalSelesaiBarang ] = useState("");
    const[ batasAmbilBarang, setBatasAmbilBarang ] = useState("");
    const[ tanggalDiambilBarang, setTanggalDiambilBarang ] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    useEffect(() => {
        if(!show){
            setError("");
        }
    }, [show]);

    useEffect(() => {
        if(data){
            setIdRincianPenitipan(data.id_rincian_penitipan || "");

            setNamaPenitip(data.penitipan.penitip.nama_penitip || "");
            setNoTelpPenitip(data.penitipan.penitip.no_telp || "");
            setEmailPenitip(data.penitipan.penitip.email || "");
            setAlamatPenitip(data.penitipan.penitip.alamat || "");
            
            setNamaPegawai(data.penitipan.pegawai.nama || "");
            setNoTelpPegawai(data.penitipan.pegawai.no_telp || "");
            
            setNamaBarang(data.barang.nama_barang || "");
            setDeskripsiBarang(data.barang.deskripsi || "");
            setGambarBarang(data.barang.url_gambar_barang || "");
            setHargaBarang(data.barang.harga || "");
            setTanggalGaransiBarang(data.barang.tanggal_garansi_habis || "");
            setStatusBarang(data.barang.status || "");
            setBeratBarang(data.barang.berat || "");

            setTanggalMasukBarang(data.penitipan.tanggal_masuk || "");
            setTanggalSelesaiBarang(data.tanggal_selesai || "");
            setBatasAmbilBarang(data.batas_ambil || "");
            setTanggalDiambilBarang(data.tanggal_diambil || "");
        }
    }, [data]);

    return(
        <Modal show={show} onClose={onClose} size='4xl' >
            <ModalHeader>Detail Rincian Penitipan {idRincianPenitipan}</ModalHeader>
            <ModalBody>
                <p className='border-b-2 p-3 text-2xl font-bold'>Penitip</p>
                <div className='px-6 py-4 space-y-2'>
                    <p>Nama : {namaPenitip}</p>
                    <p>No Telepon : {noTelpPenitip}</p>
                    <p>Email : {emailPenitip}</p>
                    <p>Alamat : {alamatPenitip}</p>
                </div>

                <p className='border-b-2 p-3 text-2xl font-bold'>Profile QC</p>
                <div className='px-6 py-4 space-y-2'>
                    <p>Nama : {namaPegawai}</p>
                    <p>No Telepon : {noTelpPegawai}</p>
                </div>

                <p className='border-b-2 p-3 text-2xl font-bold'>Detail Barang</p>
                <div className='px-6 py-4 space-y-2'>
                    <p>Nama : {namaBarang}</p>
                    <p>Deskripsi : {deskripsiBarang}</p>
                    <p>Harga : {hargaBarang}</p>
                    {tanggalGaransiBarang == "" ? 
                        (
                            <></>
                        ) 
                        : 
                        (
                            <p>Tanggal Garansi Barang Berakhir : {formatDate(tanggalGaransiBarang)}</p>
                        )
                    }
                    <p>Status : {statusBarang}</p>
                    <p>Berat : {beratBarang} Kg</p>
                    <Carousel className="w-2/3 h-2/3 py-5 ">
                        <CarouselContent>
                            {gambarBarang?.split(';').map((gambar, index) => (
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
                </div>

                {/* <p className='border-b-2 p-3 text-2xl font-bold'>Profile QC</p> */}
                <div className='px-6 py-4 space-y-2'>
                    <p>Tanggal Barang Masuk : {formatDate(tanggalMasukBarang)}</p>
                    <p>Tanggal Barang Berakhir : {formatDate(tanggalSelesaiBarang)}</p>
                    <p>Batas Pengambilan Barang : {formatDate(batasAmbilBarang)}</p>
                    <p>Tanggal Barang diambil oleh penitip : {tanggalDiambilBarang == "" ? 
                        (
                            "Barang belum diambil."
                        )
                        : 
                        (
                            formatDate(tanggalDiambilBarang)
                        )
                    }</p>
                    
                </div>
            </ModalBody>
        </Modal>
    )
}

export default DetailRincianModal;