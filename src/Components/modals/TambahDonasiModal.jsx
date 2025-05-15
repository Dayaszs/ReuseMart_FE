import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Alert, Label, TextInput} from "flowbite-react";
import { useEffect, useState } from "react";
import { PulseLoader } from 'react-spinners';
import { IoIosSearch } from "react-icons/io";
import { showBarangDonasi } from '@/api/services/apiOwner'
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"


const TambahDonasiModal = ({show, onClose, tambahDonasi, idRequestDonasi}) => {
    const [ barang, setBarang ] = useState([]);

    const [ namaPenerima, setNamaPenerima ] = useState("");
    const [ tanggalDiterima, setTanggalDiterima  ] = useState(null);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [ success, setSuccess ] = useState(false);

    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);

    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [selectedBarang, setSelectedBarang] = useState(null);

    useEffect(() => {
        if(!show){
            setError("");
            setSuccess(false);
            setNamaPenerima("");
            setTanggalDiterima(null);
            setSelectedBarang(null);
        }
    }, [show])

    const handlePageClick = (page) =>{
        if(page >= 1 && page <= lastPage && page !== currentPage){
            setCurrentPage(page);
            fetchPegawai(page);
        }
    }

    const fetchBarang = (page = 1, search = "") =>{
        setIsLoading(true);
        showBarangDonasi(page, search)
            .then((res) => {
                setBarang(res.data);
                setLastPage(res.last_page);
                setPerPage(res.per_page);
                setTotal(res.total);
            })
            .catch((err) => {
                setError(err.message || "Gagal mengambil data.");
            })
            .finally(() => setIsLoading(false));
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        setSuccess(false);

        const formattedDate = tanggalDiterima ? format(tanggalDiterima, "yyyy-MM-dd") : "";

        try{
            console.log("nama penerima : ", namaPenerima);
            console.log("tanggal diterima : ", formattedDate);
            console.log("id_barang : ", selectedBarang);
            console.log("id_req_donasi : ", idRequestDonasi);

            const formData = new FormData();
            formData.append('nama_penerima', namaPenerima);
            formData.append('tanggal_diterima', formattedDate);
            formData.append('id_barang', selectedBarang);
            formData.append('id_request_donasi', idRequestDonasi);

            await tambahDonasi(formData);
            setSuccess(true);
            setTimeout(() => {
                onClose();
            }, 1500);
        }catch(error){
            setError(error.response?.data?.message || "Terjadi kesalahan saat menambah donasi");
        }finally{
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchBarang(currentPage, debouncedSearch);
    }, [currentPage, debouncedSearch]);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setCurrentPage(1);
        }, 1000);

        return () => clearTimeout(handler);
    }, [searchTerm]);


    return(
        <Modal show={show} onClose={onClose}>
        <ModalHeader>Terms of Service</ModalHeader>
        <ModalBody>
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <div className="flex md:flex-row items-center justify-start flex-wrap gap-4 py-4 ps-6 bg-white">
                <label htmlFor="table-search-users" className="sr-only">Search</label>
                <div className="relative">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <IoIosSearch />
                    </div>
                    <input
                        type="text"
                        id="table-search-users"
                        className="block w-80 ps-10 pt-2 pb-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:outline-green-500"
                        placeholder="Cari Barang"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr className="">
                        <th scope="col" className="px-6 py-3">
                            Nama Barang
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Kategori
                        </th>
                        <th scope="col" className="px-6 py-3 text-right">
                            Barang yang dipilih
                        </th>
                        {/* <th scope="col" className="px-6 py-3">
                            Komisi
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Action
                        </th> */}
                    </tr>
                </thead>
                <tbody>
                    {isLoading
                        ? (
                            <tr>
                                <td colSpan={4}>
                                    <div className="flex justify-center items-center py-8">
                                        <PulseLoader size={8} color="#057A55" />
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            <>
                                {barang?.map((item, index) => (
                                    <tr key={item.id_barang} className="bg-white border-b dark:bg-gray-800 border-gray-200 hover:bg-gray-50">
                                        <th scope="row" className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap">
                                            {/* <img className="w-10 h-10 rounded-full" src={getProfilePictureOrganisasi(item.url_gambar)} alt="Logo Organisasi" /> */}
                                            <div className="ps-3">
                                                <div className="text-base font-semibold">{item.nama_barang}</div>
                                                {/* <div className="font-normal text-gray-500">{item.harga}</div> */}
                                            </div>
                                        </th>
                                        <td className="px-6 py-4">
                                            {/* {formatDate(item.tanggal_lahir)} */}
                                            {item.kategori.nama}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end">
                                                <input
                                                    type="radio"
                                                    name="selectedBarang"
                                                    value={item.id_barang}
                                                    checked={selectedBarang === item.id_barang}
                                                    onChange={(e) => setSelectedBarang(Number(e.target.value))}
                                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                                                />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                            {/* <NumericFormat 
                                                value={item.komisi} 
                                                prefix = "Rp. "
                                                displayType = "text"
                                                thousandSeparator = "."
                                                decimalSeparator=","
                                            /> */}
                                            </div>
                                        </td>
                                        {/* <td className="px-6 py-4">
                                            <div className="flex justify-start items-center gap-2"> */}
                                                {/* Modal Edit */}
                                                {/* <button
                                                    onClick={() => openEditModal(item)}
                                                    className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                                                    type="button"
                                                >
                                                    <FaEdit />
                                                </button> */}

                                                {/* Modal Delete */}
                                                {/* <button
                                                    onClick={() => openDeleteModal(item.id_pegawai)}
                                                    className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-sm focus:outline-none focus:ring-2 focus:ring-red-300"
                                                    type="button"
                                                >
                                                    <FaTrashAlt />
                                                </button> */}
                                            {/* </div>
                                        </td> */}
                                    </tr>
                                ))}
                            </>
                        )}
                </tbody>
            </table>
            <div className="mt-3">
                <Label htmlFor="namaPenerima">Nama Penerima</Label>
                <TextInput
                    id="namaPenerima"
                    type="text"
                    value={namaPenerima}
                    onChange={(e) => setNamaPenerima(e.target.value)}
                    placeholder='Masukkan nama penerima donasi'
                    required
                />
            </div>
            <div className="flex flex-col gap-2 mt-3">
                <Label>Tanggal Diterima</Label>
                <div className="relative">
                    <TextInput
                        type="text"
                        value={tanggalDiterima ? format(tanggalDiterima, "yyyy-MM-dd", { locale: id }) : ""}
                        placeholder="Pilih tanggal diterima"
                        readOnly
                        className="pr-10"
                    />
                    <Popover>
                        <PopoverTrigger asChild>
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                <CalendarIcon className="h-5 w-5" />
                            </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={tanggalDiterima}
                                onSelect={setTanggalDiterima}
                                disabled={(date) =>
                                    date < new Date("1900-01-01")
                                }
                                initialFocus
                                className="bg-white"
                            />
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
        <Button 
                    color="gray" 
                    onClick={onClose}
                    disabled={isLoading}
                >
                    Batal
                </Button>
                <Button 
                    onClick={handleSubmit}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <PulseLoader size={8} color="#ffffff" />
                    ) : (
                        "Simpan"
                    )}
                </Button>
        </ModalFooter>
      </Modal>
    );
}

export default TambahDonasiModal;