import { Helmet } from "react-helmet";
import { Button, Checkbox, Label, TextInput, Card, Dropdown, DropdownItem, Badge} from "flowbite-react";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, use, useState } from "react";
import { PulseLoader } from 'react-spinners';
import { NumericFormat } from 'react-number-format';
import { IoIosSearch } from "react-icons/io";
import { getGambarBarang } from '@/api';
import { showBarangTersedia, showBarangByKategori } from '@/api/services/apiBarang';


function ProductHome() {
    const navigate = useNavigate();
    const [barang, setBarang] = useState([]);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);

    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [perPage, setPerPage] = useState(25);

    const [selectedKategoriId, setSelectedKategoriId] = useState(null);

    const handlePageClick = (page) =>{
        if(page >= 1 && page <= lastPage && page !== currentPage){
            setCurrentPage(page);
            if (selectedKategoriId) {
                fetchBarangByKategori(page, selectedKategoriId * 10, selectedKategoriId * 10 + 10);
            } else {
                fetchBarang(page, debouncedSearch);
            }
        }
    }

    const fetchBarang = (page = 1, search = "") => {
        setIsLoading(true);

        showBarangTersedia(page, search)
        .then((res) => {
            console.log('API Response:', res);
            const barangData = Array.isArray(res.data) ? res.data : 
                             Array.isArray(res.data?.data) ? res.data.data : [];
            
            setBarang(barangData);
            setLastPage(parseInt(res.last_page || res.data?.last_page || 1));
            setPerPage(parseInt(res.per_page || res.data?.per_page || 25));
            setTotal(parseInt(res.total || res.data?.total || 0));
        })
        .catch((err) =>{
            console.error('Error fetching data:', err);
            setError(err.message || "Gagal mengambil data barang tersedia.");
            setBarang([]);
            setLastPage(1);
            setPerPage(25);
            setTotal(0);
        })
        .finally(() => setIsLoading(false));
    };

    const fetchBarangByKategori = (page = 1, min_kode, max_kode) =>{
        setIsLoading(true);

        showBarangByKategori(page, min_kode, max_kode)
        .then((res) => {
            const barangData = Array.isArray(res.data) ? 
                res.data :
                Array.isArray(res.data?.data) ?
                res.data.data : [];
                
            setBarang(barangData);
            setLastPage(parseInt(res.last_page || res.data?.last_page || 1));
            setPerPage(parseInt(res.per_page || res.data?.per_page || 25));
            setTotal(parseInt(res.total || res.data?.total || 0));
        })
        .catch((err) =>{
            console.error('Error fetch data by kategori : ', err);
            setError(err.message || "Gagal mengambil data barang kategori yang tersedia.");
            setBarang([]);
            setLastPage(1);
            setPerPage(25);
            setTotal(0);
        })
        .finally(() => setIsLoading(false));
    };

    useEffect(() => {
        if (!selectedKategoriId) {
            fetchBarang(currentPage, debouncedSearch);
        }
    }, [currentPage, debouncedSearch, selectedKategoriId]);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setCurrentPage(1);
        }, 1000);

        return () => clearTimeout(handler);
    }, [searchTerm]);
    
    useEffect(() => {
        if (selectedKategoriId) {
            fetchBarangByKategori(currentPage, selectedKategoriId * 10, selectedKategoriId * 10 + 10);
        }
    }, [selectedKategoriId, currentPage]);


    const detailProductClick = (barangId) =>{
        navigate(`/products/detail/${barangId}`);
    };

    const handleKategoriSelect = (kategoriId) => {
        console.log('Kategori Selected:', kategoriId);
        setSelectedKategoriId(kategoriId);
    };

    const list_kategori = [
        { id: 1, value: 'Elektronik & Gadget' },
        { id: 2, value: 'Pakaian & Aksesoris' },
        { id: 3, value: 'Perabotan Rumah Tangga' },
        { id: 4, value: 'Buku, Alat tulis & Peralatan Sekolah' },
        { id: 5, value: 'Hobi, Mainan & Koleksi' },
        { id: 6, value: 'Perlengkapan Bayi & Anak' },
        { id: 7, value: 'Otomotif & Aksesori' },
        { id: 8, value: 'Perlengkapan Taman & Outdoor' },
        { id: 9, value: 'Perlengkapan Kantor & Industri' },
        { id: 10, value: 'Kosmetik & Perawatan diri' }
    ];

    return(
        <>
         <div>
            <Helmet>
                <title>Products - Reusemart</title>
            </Helmet>
        </div>

        <div className="@container relative">
            <div className='w-full h-auto flex flex-col items-center p-16 bg-white'>
                <div className="flex justify-start w-full ">
                    <Dropdown dismissOnClick={false} label="Select Kategori" size="md" className="ms-20 mt-4" color="green">
                        {list_kategori?.map((kategori, index) =>(
                            <DropdownItem 
                                key={index}
                                onClick={() => handleKategoriSelect(kategori.id)}
                                className={selectedKategoriId === kategori.id ? 'bg-green-100' : ''}
                            >
                                {kategori.value}
                            </DropdownItem>
                        ))}
                    </Dropdown>
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
                                placeholder="Cari Pegawai"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Button color="green" 
                        className='ms-auto me-10'
                        onClick={() => openCreateModal()}>
                            + Create
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-5 auto-rows-auto gap-x-4 gap-y-8 p-20" >
                    {isLoading
                        ? (
                            <div className="flex justify-center items-center py-8">
                                <PulseLoader size={8} color="#057A55" />
                            </div>
                        ) : (
                            <>
                                {barang?.map((item, index) => (
                                    <Card key={item.id_barang} className="border-2" onClick={() => detailProductClick(item.id_barang)}>
                                        <img src={item.url_gambar_barang ? getGambarBarang(item.url_gambar_barang.split(';')[0]) : '/logo.png'} alt="" />
                                        <p>{item.nama_barang}</p>
                                        <NumericFormat 
                                            value={item.harga} 
                                            prefix = "Rp. "
                                            displayType = "text"
                                            thousandSeparator = "."
                                            decimalSeparator=","
                                            className="font-bold -mt-3"
                                        />
                                        {item.tanggal_garansi_habis?(
                                            <Badge color="success" className="w-fit h-8">Bergaransi</Badge>
                                        ) : ( 
                                            <Badge  className="w-auto h-8 text-transparent bg-transparen hover:bg-transparent"></Badge>
                                        )}
                                    </Card>
                                ))}
                            </>
                        ) }
                </div>
                        <nav className="flex flex-col md:flex-row items-center justify-between py-4 px-6">
                            <span className="text-sm text-gray-500">
                                Showing{" "}
                                <span className="font-semibold text-gray-900">
                                    {(currentPage - 1) * perPage + 1}
                                </span>{" "}
                                to{" "}
                                <span className="font-semibold text-gray-900">
                                    {Math.min(currentPage * perPage, total)}
                                </span>{" "}
                                of{" "}
                                <span className="font-semibold text-gray-900">
                                    {total}
                                </span>
                            </span>

                            <ul className="inline-flex -space-x-px text-sm h-8 mt-2 md:mt-0">
                                <li>
                                    <button
                                        className="px-3 h-8 text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 disabled:bg-gray-100"
                                        onClick={() => handlePageClick(currentPage - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        Previous
                                    </button>
                                </li>
                                {[...Array(lastPage)].map((_, i) => {
                                    const page = i + 1;
                                    return (
                                        <li key={page}>
                                            <button
                                                className={`px-3 h-8 border border-gray-300 ${page === currentPage
                                                    ? "bg-green-500 text-white"
                                                    : "bg-white text-gray-500 hover:bg-gray-100"
                                                    }`}
                                                onClick={() => handlePageClick(page)}
                                            >
                                                {page}
                                            </button>
                                        </li>
                                    );
                                })}
                                <li>
                                    <button
                                        className="px-3 h-8 text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 disabled:bg-gray-100"
                                        onClick={() => handlePageClick(currentPage + 1)}
                                        disabled={currentPage === lastPage}
                                    >
                                        Next
                                    </button>
                                </li>
                            </ul>
                        </nav>
            </div>
        </div>
        </>
    )
}

export default ProductHome;