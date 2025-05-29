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

const DetailPenitipanModal = ({ show, onClose, data }) => {
    //Penitipan
    const [ idPenitipan, setIdPenitipan ] = useState("");
    const [ tanggalMasuk, setTanggalMasuk ] = useState("");
    
    //Penitip
    const [ namaPenitip, setNamaPenitip ] = useState("");
    const [ alamatPenitip, setAlamatPenitip ] = useState("");
    const [ noTelpPenitip, setNoTelpPenitip ] = useState("");
    const [ emailPenitip, setEmailPenitip ] = useState("");
    
    //Pegawai
    const [ namaPegawai, setNamaPegawai ] = useState("");
    const [ noTelpPegawai, setNoTelpPegawai ] = useState("");
    const [ emailPegawai, setEmailPegawai ] = useState("");
    const [ jabatanPegawai, setJabatanPegawai ] = useState("");
    
    //Rincian Penitipan
    const [ tanggalSelesai, setTanggalSelesai ] = useState("");
    const [ batasAmbil, setBatasAmbil ] = useState("");
    const [ tanggalDiambil, setTanggalDiambil ] = useState("");

    //Barang & Rincian Penitipan
    const [ barang, setBarang] = useState([]);

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
            console.log("data modal", data);
            setIdPenitipan(data.id_penitipan || "");
            setTanggalMasuk(data.tanggal_masuk || "");

            setNamaPenitip(data.penitip.nama_penitip || "");
            setAlamatPenitip(data.penitip.alamat || "");
            setNoTelpPenitip(data.penitip.no_telp || "");
            setEmailPenitip(data.penitip.email || "");
            
            setNamaPegawai(data.pegawai.nama || "");
            setNoTelpPegawai(data.pegawai.no_telp || "");
            setEmailPegawai(data.pegawai.email || "");
            if(data.pegawai.id_jabatan === 3 ){
                setJabatanPegawai("Gudang");
            }

            // setTanggalSelesai(data.rincian_penitipan[0].tanggal_selesai || "");
            // setBatasAmbil(data.rincian_penitipan[0].batas_ambil || "");
            // setTanggalDiambil(data.rincian_penitipan[0].tanggal_diambil || "");

            setBarang(data.rincian_penitipan);
        }
    }, [data]);
    

    return(
        <Modal show={show} onClose={onClose} size='4xl' >
            <ModalHeader>Detail Penitipan {idPenitipan}</ModalHeader>
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
                    <p>Email : {emailPegawai}</p>
                    <p>Jabatan : {jabatanPegawai}</p>
                </div>

                <p className='border-b-2 p-3 text-2xl font-bold'>Barang</p>
                {barang?.map((item, index) => (
                    <div className='px-6 py-4 space-y-2'>
                        <p>Nama : {item.barang.nama_barang}</p>
                        <p>Deskripsi : {item.barang.deskripsi}</p>
                        <p>Harga : {item.barang.harga}</p>
                        {!item.barang.tanggal_garansi_habis  ? 
                            (
                                <></>
                            ) 
                            : 
                            (
                                <p>Tanggal Garansi Barang Berakhir : {formatDate(item.barang.tanggal_garansi_habis)}</p>
                            )
                        }
                        <p>Status : {item.barang.status}</p>
                        <p>Berat : {item.barang.berat} Kg</p>
                        <p>Tanggal Masuk :  {formatDate(tanggalMasuk)}</p>
                        <p>Tanggal Selesai :  {formatDate(item.tanggal_selesai)}</p>
                        {item.tanggal_diambil == null ?
                            (
                                <p>Batas Pengambilan Barang:  {formatDate(item.batas_ambil)}</p>
                            )
                            :
                            (
                                <p>Tanggal Barang diambil :  {formatDate(item.tanggal_diambil)}</p>
                            )
                        }
                        <Carousel className="w-2/3 h-2/3 py-5 ">
                            <CarouselContent>
                                {item.barang.url_gambar_barang?.split(';').map((gambar, index) => (
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
                        <p className='border-b-2'></p>
                    </div>
                ))}

                {/* <p className='border-b-2 p-3 text-2xl font-bold'>Profile QC</p> */}
                {/* <div className='px-6 py-4 space-y-2'>
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
                    
                </div> */}
            </ModalBody>
        </Modal>
    );
}

export default DetailPenitipanModal;