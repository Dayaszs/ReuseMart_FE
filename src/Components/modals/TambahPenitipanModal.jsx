import React from 'react'
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Dropdown, DropdownItem, Label, TextInput, FileInput } from 'flowbite-react'
import { useState, useEffect } from 'react'
import { ShowPegawaiByJabatan } from '@/api/services/apiPegawai'
import { showAllPenitip, tambahPenitipanBarang } from '@/api/services/apiPenitip'
import { showKategori } from '@/api/services/apiBarang'
import { IoIosSearch } from "react-icons/io";
import { PiCodepenLogo, PiCornersOutLight } from 'react-icons/pi'
import { ChevronRight } from 'lucide-react'
import { format } from "date-fns"
import { id } from 'date-fns/locale'
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

const TambahPenitipanModal = ({show, onClose}) => {
    // const[ idRincianPenitipan, setIdRincianPenitipan ] = useState("");
    //Penitipan
    const[ penitip, setPenitip ] = useState([]);
    const[ pegawai, setPegawai ] = useState([]);

    const [selectedPegawai, setSelectedPegawai] = useState("");
    const [selectedIdPegawai, setSelectedIdPegawai] = useState("");
    const [selectedPenitip, setSelectedPenitip] = useState("");
    const [selectedIdPenitip, setSelectedIdPenitip] = useState("");
    const [selectedKategori, setSelectedKategori] = useState("");
    const [selectedIdKategori, setSelectedIdKategori] = useState("");
    

    const [ banyakBarang, setBanyakBarang ] = useState(null);
    const [ inputValue, setInputValue ] = useState("");
    const [ barang, setBarang ] = useState([]);
    const [ kategori, setKategori ] = useState([]);
    const [ garansi, setGaransi ] = useState(false);

    //RincianPentipan
    //tanggal diambil dan tanggal konfirmasi dibuat null di be
    //sudah konfirmasi bernilai 0

    //Barang
    const[ namaBarang, setNamaBarang ] = useState("");
    const[ deskripsiBarang, setDeskripsiBarang ] = useState("");
    const[ gambarBarang, setGambarBarang ] = useState("");
    const[ hargaBarang, setHargaBarang ] = useState("");
    const[ tanggalGaransiBarang, setTanggalGaransiBarang ] = useState("");
    //status di set Tersedia di BE
    const[ beratBarang, setBeratBarang ] = useState("");
    //rating di set null di BE
    const[ idKategori, setIdKategori ] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

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
        newItems[index].id_kategori = id;
        newItems[index].namaKategori = nama;
        setBarang(newItems);
    }

    const handleSubmit = async (e) => {
        const confirmed = window.confirm("Apakah anda yakin ingin menambahkan penitipan baru?");
        if (!confirmed) {
            return;
        }
        e.preventDefault();
        setIsLoading(true);
        setError("");
        
        try {

            if (!selectedIdPenitip) {
                setError("Pilih penitip terlebih dahulu");
                setIsLoading(false);
                return;
            }
            
            if (!selectedIdPegawai) {
                setError("Pilih pegawai QC terlebih dahulu");
                setIsLoading(false);
                return;
            }
            
            if (!barang || barang.length === 0) {
                setError("Tambahkan minimal satu barang");
                setIsLoading(false);
                return;
            }

            //cek kosong
            for (let i = 0; i < barang.length; i++) {
                const item = barang[i];
                if (!item.namaBarang.trim()) {
                    setError(`Nama barang ke-${i + 1} harus diisi`);
                    setIsLoading(false);
                    return;
                }
                if (!item.deskripsiBarang.trim()) {
                    setError(`Deskripsi barang ke-${i + 1} harus diisi`);
                    setIsLoading(false);
                    return;
                }
                if (!item.harga || item.harga <= 0) {
                    setError(`Harga barang ke-${i + 1} harus diisi dengan nilai yang valid`);
                    setIsLoading(false);
                    return;
                }
                if (!item.berat || item.berat <= 0) {
                    setError(`Berat barang ke-${i + 1} harus diisi dengan nilai yang valid`);
                    setIsLoading(false);
                    return;
                }
                if (!item.id_kategori || item.id_kategori === 0) {
                    setError(`Kategori barang ke-${i + 1} harus dipilih`);
                    setIsLoading(false);
                    return;
                }
            }
            
            const transformedBarang = barang.map(item => ({
                nama_barang: item.namaBarang.trim(),
                deskripsi: item.deskripsiBarang.trim(),
                url_gambar_barang: item.urlGambarBarang || "", // This should be handled properly for file upload
                harga: parseInt(item.harga),
                tanggal_garansi_habis: item.tanggal_garansi ? 
                    format(new Date(item.tanggal_garansi), "yyyy-MM-dd") : null,
                berat: parseFloat(item.berat),
                id_kategori: parseInt(item.id_kategori)
            }));
            
            const data = {
                id_penitip: parseInt(selectedIdPenitip),
                id_pegawai: parseInt(selectedIdPegawai),
                barang: transformedBarang
            };
            
            console.log("Payload to be sent:", data);
            
            const response = await tambahPenitipanBarang(data, banyakBarang);
            
            console.log("API Response:", response);
            
            alert("Penitipan barang berhasil ditambahkan!");
            
            setSelectedPenitip("");
            setSelectedIdPenitip("");
            setSelectedPegawai("");
            setSelectedIdPegawai("");
            setBanyakBarang(null);
            setInputValue("");
            setBarang([]);
            
            onClose();
            
        } catch (err) {
            console.error('Submit Error:', err);
            setError(err.message || "Gagal menambahkan penitipan barang");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPegawaiGudang();
        fetchPenitip("");
        fetchKategori();
        console.log(pegawai);
        console.log("Penitip", penitip);
        console.log("Kategori", kategori);
    }, []);

    return(
        <Modal show={show} onClose={onClose} size='6xl'> 
            <ModalHeader>Tambah Penitipan Barang</ModalHeader>
            <ModalBody>
                <form onSubmit={handleSubmit}>
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
                    <p>Jumlah Barang yang dititip</p>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            id="table-search-users"
                            className="block w-32 text-center py-1 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:outline-green-500"
                            placeholder="Jumlah Barang"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                        />
                        <Button 
                            color="green"
                            onClick={() => {
                                setBanyakBarang(inputValue);
                                const numberOfItems = parseInt(inputValue) || 0;
                                setBarang(Array(numberOfItems).fill().map((_, index) => ({
                                    id: index + 1,
                                    namaBarang: '',
                                    deskripsiBarang: '',
                                    urlGambarBarang: '',
                                    harga:'',
                                    berat:0.0,
                                    namaKategori:'',
                                    id_kategori: 0,
                                    tanggal_garansi:''
                                })));
                            }}>
                            <ChevronRight size={18}/>
                        </Button>
                    </div>
                </div>

                {banyakBarang ? 
                    (
                        <>
                            <p className='border-b-2 font-bold text-2xl py-2'>Barang</p>
                            {barang.map((item, index) => (
                                <div key={item.id} className='py-2'>
                                    <p className='text-lg font-semibold'>Barang ke - {index + 1}</p>
                                    <p className='py-1'>Nama Barang : </p>
                                    <input
                                        type="text"
                                        className="block w-2/3 ps-2 text-start py-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:outline-green-500"
                                        value={item.namaBarang}
                                        onChange={(e) => {
                                            const newItems = [...barang];
                                            newItems[index].namaBarang = e.target.value;
                                            setBarang(newItems);
                                        }}
                                        placeholder="Masukkan nama barang"
                                    />

                                    <p className='py-1'>Deskripsi Barang : </p>
                                    <input
                                        type="text"
                                        className="block w-2/3 ps-2 text-start py-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:outline-green-500"
                                        value={item.deskripsiBarang}
                                        onChange={(e) => {
                                            const newItems = [...barang];
                                            newItems[index].deskripsiBarang = e.target.value;
                                            setBarang(newItems);
                                        }}
                                        placeholder="Masukkan deskripsi barang"
                                    />

                                    {/* Gambar */}
                                    <p className='py-1'>Gambar Barang : </p>
                                    <div className="flex flex-col gap-2">
                                        <FileInput
                                            className="w-2/3 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:outline-green-500"
                                            multiple
                                            onChange={(e) => {
                                                const files = Array.from(e.target.files);
                                                const newItems = [...barang];
                                                newItems[index].urlGambarBarang = files.map(file => file.name).join(';');
                                                setBarang(newItems);
                                            }}
                                            helperText="Upload file gambar"
                                        />
                                        {item.urlGambarBarang && (
                                            <div className="text-sm text-gray-600">
                                                File terpilih: {item.urlGambarBarang}
                                            </div>
                                        )}
                                    </div>

                                    <p className='py-1'>Harga Barang : </p>
                                    <input
                                        type="text"
                                        className="block w-48 ps-2 text-start py-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:outline-green-500"
                                        value={item.harga}
                                        onChange={(e) => {
                                            const newItems = [...barang];
                                            newItems[index].harga = parseInt(e.target.value) || 0;
                                            setBarang(newItems);
                                        }}
                                        placeholder="Masukkan harga barang"
                                    />

                                    <p className='py-1'>Berat Barang : </p>
                                    <div className='flex justify-start items-center'>
                                        <input
                                            type="number"
                                            step="any"
                                            className="block w-48 ps-2 text-start py-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:outline-green-500"
                                            value={item.berat}
                                            onChange={(e) => {
                                                const newItems = [...barang];
                                                newItems[index].berat = parseFloat(e.target.value) || 0.0;
                                                setBarang(newItems);
                                            }}
                                            placeholder="Masukkan Berat barang"
                                        />
                                        <span className='ps-2'>Kg</span>
                                    </div>

                                    <p className='py-1'>Kategori Barang : </p>
                                    <Dropdown 
                                        dismissOnClick={false} 
                                        label={item.namaKategori ? 
                                            (item.namaKategori)
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

                                    { item.id_kategori !== 0 && item.id_kategori < 9 && (
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
                                    {!item.isChecked ?
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
                                                            value={item.tanggal_garansi ? format(new Date(item.tanggal_garansi), "yyyy-MM-dd", { locale: id }) : ""}
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
                                                                selected={item.tanggal_garansi ? new Date(item.tanggal_garansi) : null}
                                                                onSelect={(date) => {
                                                                    const newItems = [...barang];
                                                                    newItems[index].tanggal_garansi = date;
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
                                </div>
                            ))}
                        </>
                    )
                    :
                    (
                        <></>
                    )
                }
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

export default TambahPenitipanModal;