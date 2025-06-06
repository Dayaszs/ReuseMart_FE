import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Dropdown, DropdownItem, Label, TextInput, FileInput } from 'flowbite-react'
import { useState, useEffect } from 'react'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { getGambarBarang } from '@/api/index';
import { editPenitipanBarang } from '@/api/services/apiPenitipan';
import { showAllPenitip, tambahPenitipanBarang } from '@/api/services/apiPenitip'
import { ShowPegawaiByJabatan } from '@/api/services/apiPegawai'
import { showKategori } from '@/api/services/apiBarang'
import { id } from 'date-fns/locale'
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"

const EditPenitipanModal = ({ show, onClose, data }) => {
    const[ penitip, setPenitip ] = useState([]);
    const[ pegawai, setPegawai ] = useState([]);
    const [ kategori, setKategori ] = useState([]);

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

    const [selectedPegawai, setSelectedPegawai] = useState("");
    const [selectedIdPegawai, setSelectedIdPegawai] = useState("");
    const [selectedPenitip, setSelectedPenitip] = useState("");
    const [selectedIdPenitip, setSelectedIdPenitip] = useState("");
    const [selectedIdPenitipan, setSelectedIdPenitipan] = useState("");
    const [selectedKategori, setSelectedKategori] = useState("");

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

    const fetchPegawaiGudang = () =>{
        // const id = 3;
        setIsLoading(true);
        
        ShowPegawaiByJabatan(3)
        .then((res) =>{
            setPegawai(res);
        })
        .catch((err) =>{
            console.error('API Error:', err);
            console.error('Error details:', {
                message: err.message,
                response: err.response,
                status: err.response?.status
            });
            setError(err.message || "Gagal mengambil data pegawai gudang.");
        })
        .finally(() => setIsLoading(false));
    }

    const fetchPenitip = (search="") => {
        setIsLoading(true);

        showAllPenitip(search)
        .then((res) => {
            // console.log(res.data);
            setPenitip(res.penitip.data);
        })
        .catch((err) => {
            setError(err.message || "Gagal mengambil data penitip.");
        })
        .finally(() => setIsLoading(false));
    }

    const fetchKategori = () => {
        setIsLoading(true);

        showKategori()
        .then((res) => {
            setKategori(res.data);
        })
        .catch((err) => {
            setError(err.message || "Gagal mengambil data kategori.");
        })
        .finally(() => setIsLoading(false));
    }

    const handleClickNamaPegawai = (nama, id) =>{
        setSelectedPegawai(nama);
        setSelectedIdPegawai(id);
    }

    const handleClickNamaPenitip = (nama, id) =>{
        setSelectedPenitip(nama);
        setSelectedIdPenitip(id);
    }

    const handleClickKategori = (nama, id, index) => {
        const newItems = [...barang];
        newItems[index].barang.kategori.id_kategori = id;
        newItems[index].barang.kategori.nama = nama;
        setBarang(newItems);
    }

    const handleSubmit = async(e) =>{
        const confirmed = window.confirm("Apakah anda yakin ingin merubah penitipan ?");
        if (!confirmed) {
            return;
        }
        
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try{
            const transformedBarang = barang.map(item => ({
                id_rincian_penitipan: item.id_rincian_penitipan,
                id_barang: item.barang.id_barang,
                nama_barang: item.barang.nama_barang.trim(),
                deskripsi: item.barang.deskripsi.trim(),
                url_gambar_barang: item.barang.url_gambar_barang || "", // This should be handled properly for file upload
                harga: parseFloat(item.barang.harga),
                tanggal_garansi_habis: item.barang.tanggal_garansi_habis ? 
                    format(new Date(item.barang.tanggal_garansi_habis), "yyyy-MM-dd") : null,
                berat: parseFloat(item.barang.berat),
                id_kategori: parseInt(item.barang.kategori.id_kategori)
            }));

            const data = {
                id_penitip: parseInt(selectedIdPenitip),
                id_pegawai: parseInt(selectedIdPegawai),
                barang: transformedBarang
            };

            const response = await editPenitipanBarang(data, selectedIdPenitipan);
            console.log("API Response:", response);

            onClose();
        }catch (err) {
            console.error('Submit Error:', err);
            setError(err.message || "Gagal edit penitipan barang");
        } finally {
            setIsLoading(false);
        }
    }
    
    useEffect(() => {
        if(!show){
            setError("");
        }
        fetchPegawaiGudang();
        fetchPenitip("");
        fetchKategori();
    }, [show]);

    useEffect(() => {
        if(data){
            console.log("data modal", data);
            setIdPenitipan(data.id_penitipan || "");
            setTanggalMasuk(data.tanggal_masuk || "");

            // setNamaPenitip(data.penitip.nama_penitip || "");
            setSelectedPenitip(data.penitip.nama_penitip || "");
            setAlamatPenitip(data.penitip.alamat || "");
            setNoTelpPenitip(data.penitip.no_telp || "");
            setEmailPenitip(data.penitip.email || "");
            
            // setNamaPegawai(data.pegawai.nama || "");
            setSelectedPegawai(data.pegawai.nama || "");
            setNoTelpPegawai(data.pegawai.no_telp || "");
            setEmailPegawai(data.pegawai.email || "");
            if(data.pegawai.id_jabatan === 3 ){
                setJabatanPegawai("Gudang");
            }

            setSelectedIdPenitipan(data.id_penitipan);
            setSelectedIdPenitip(data.id_penitip);
            setSelectedIdPegawai(data.id_pegawai);

            // setTanggalSelesai(data.rincian_penitipan[0].tanggal_selesai || "");
            // setBatasAmbil(data.rincian_penitipan[0].batas_ambil || "");
            // setTanggalDiambil(data.rincian_penitipan[0].tanggal_diambil || "");

            setBarang(data.rincian_penitipan);
        }
    }, [data]);

    return(
        <Modal show={show} onClose={onClose} size='4xl' >
            <ModalHeader>Edit Penitipan {idPenitipan}</ModalHeader>
            <ModalBody>
                <form onSubmit={handleSubmit}>
                <p className='border-b-2 p-3 text-2xl font-bold'>Edit Penitip dan Pegawai</p>
                <div className='px-6 py-4 space-y-2'>
                    <div className='flex justify-between py-3'>
                        <p>Nama Penitip</p>
                        <Dropdown 
                            dismissOnClick={false} 
                            label={selectedPenitip ? 
                                (selectedPenitip)
                                :
                                ("Select Nama Penitip")
                            } 
                            size="sm" className="border-1" 
                            color="white">
                            {penitip?.map((penitip) =>(
                                <DropdownItem 
                                    key={penitip.id_penitip}
                                    onClick={() => handleClickNamaPenitip(penitip.nama_penitip, penitip.id_penitip)}
                                    // className={selectedKategoriId === kategori.id ? 'bg-green-100' : ''}
                                >
                                    {penitip.nama_penitip}
                                </DropdownItem>
                            ))}
                        </Dropdown>
                    </div>

                    <div className='flex justify-between py-3'>
                        <p>Nama Pegawai QC</p>
                        <Dropdown 
                            dismissOnClick={false} 
                            label={selectedPegawai ? selectedPegawai : "Select Nama QC"} 
                            size="sm" 
                            className="border-1" 
                            color="white"
                        >
                            {pegawai?.map((pegawai) =>(
                                <DropdownItem 
                                    key={pegawai.id_pegawai}
                                    onClick={() => handleClickNamaPegawai(pegawai.nama, pegawai.id_pegawai)}
                                    // className={selectedPegawai?.id_pegawai === pegawai.id_pegawai ? 'bg-green-100' : ''}
                                >
                                    {pegawai.nama}
                                </DropdownItem>
                            ))}
                        </Dropdown>
                    </div>
                </div>

                

                <p className='border-b-2 p-3 text-2xl font-bold'>Edit Barang</p>
                {barang?.map((item, index) => (
                    <div className='px-6 py-4 space-y-2'>
                        <p className='py-1'>Nama Barang : </p>
                        <input
                            type="text"
                            className="block w-2/3 ps-2 text-start py-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:outline-green-500"
                            value={item.barang.nama_barang}
                            onChange={(e) => {
                                const newItems = [...barang];
                                newItems[index].barang.nama_barang = e.target.value;
                                setBarang(newItems);
                            }}
                            placeholder="Masukkan nama barang ${}"
                        />
                        <p className='py-1'>Deskripsi Barang : </p>
                        <input
                            type="text"
                            className="block w-2/3 ps-2 text-start py-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:outline-green-500"
                            value={item.barang.deskripsi}
                            onChange={(e) => {
                                const newItems = [...barang];
                                newItems[index].barang.deskripsi = e.target.value;
                                setBarang(newItems);
                            }}
                            placeholder="Masukkan deskripsi barang"
                        />

                        <p className='py-1'>Gambar Barang : </p>
                        <div className="flex flex-col gap-2">
                            <FileInput
                                className="w-2/3 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:outline-green-500"
                                multiple
                                onChange={(e) => {
                                    const files = Array.from(e.target.files);
                                    const newItems = [...barang];
                                    newItems[index].barang.url_gambar_barang = files.map(file => file.name).join(';');
                                    setBarang(newItems);
                                }}
                                helperText="Upload file gambar"
                            />
                            {item.barang.url_gambar_barang && (
                                <div className="text-sm text-gray-600">
                                    File terpilih: {item.barang.url_gambar_barang}
                                </div>
                            )}
                        </div>
                        <p className='py-1'>Harga Barang : </p>
                        <input
                            type="text"
                            className="block w-48 ps-2 text-start py-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:outline-green-500"
                            value={item.barang.harga}
                            onChange={(e) => {
                                const newItems = [...barang];
                                newItems[index].barang.harga = parseInt(e.target.value) || 0;
                                setBarang(newItems);
                            }}
                            placeholder="Masukkan harga barang"
                        />

                        <p className='py-1'>Berat Barang : </p>
                        <div className='flex justify-start items-center'>
                            <input
                                type="text"
                                className="block w-48 ps-2 text-start py-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:outline-green-500"
                                value={item.barang.berat}
                                onChange={(e) => {
                                    const newItems = [...barang];
                                    newItems[index].barang.berat = parseFloat(e.target.value) || 0.0;
                                    setBarang(newItems);
                                }}
                                placeholder="Masukkan Berat barang"
                            />
                            <span className='ps-2'>Kg</span>
                        </div>

                        <p className='py-1'>Kategori Barang : </p>
                        <Dropdown 
                            dismissOnClick={false} 
                            label={item.barang.kategori.nama ? 
                                (item.barang.kategori.nama)
                                :
                                ("Pilih Kategori Barang")
                            } 
                            size="sm" 
                            className="border-1" 
                            color="white">
                            <div className="max-h-40 overflow-y-auto">
                                {kategori?.map((kategori) =>(
                                    <DropdownItem 
                                        key={kategori.id_kategori}
                                        onClick={() => handleClickKategori(kategori.nama, kategori.id_kategori, index)}
                                    >
                                        {kategori.nama}
                                    </DropdownItem>
                                ))}
                            </div>
                        </Dropdown>

                        { item.barang.kategori.id_kategori !== 0 && item.barang.kategori.id_kategori < 9 && (
                            <div className="flex items-center py-2">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                                    onChange={(e) => {
                                        const newItems = [...barang];
                                        newItems[index].isChecked = e.target.checked;
                                        setBarang(newItems);
                                    }}
                                    checked={item.isChecked || false}
                                />
                                <label className="ml-2 text-sm font-medium text-gray-900">
                                    Punya tanggal garansi
                                </label>
                            </div>
                        )}

                        {!item.isChecked  ?
                            (
                                <></>
                            )
                            :
                            (
                                <div className="flex flex-col gap-2">
                                    <Label>Tanggal Garansi</Label>
                                    <div className="flex gap-2 items-center">
                                        <div className="relative">
                                            <TextInput
                                                type="text"
                                                value={item.barang.tanggal_garansi_habis ? format(new Date(item.barang.tanggal_garansi_habis), "yyyy-MM-dd", { locale: id }) : ""}
                                                placeholder="Pilih tanggal garansi"
                                                readOnly
                                                className="w-48"
                                            />
                                        </div>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <button
                                                    type="button"
                                                    className="text-gray-500 hover:text-gray-700"
                                                >
                                                    <CalendarIcon className="h-5 w-5" />
                                                </button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={item.barang.tanggal_garansi_habis ? new Date(item.barang.tanggal_garansi_habis) : null}
                                                    onSelect={(date) => {
                                                        const newItems = [...barang];
                                                        newItems[index].barang.tanggal_garansi_habis = date;
                                                        setBarang(newItems);
                                                    }}
                                                    disabled={(date) =>
                                                        date < new Date()
                                                    }
                                                    initialFocus
                                                    className="bg-white"
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </div>
                            )
                        }
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
            </form>
            </ModalBody>
            <ModalFooter className='flex justify-end'>
                <Button 
                    color="green"
                    onClick={handleSubmit}>
                    Simpan
                </Button>
                <Button 
                    color="red"
                    onClick={onClose}>
                    Batal
                </Button>
            </ModalFooter>
        </Modal>
    );
}

export default EditPenitipanModal;