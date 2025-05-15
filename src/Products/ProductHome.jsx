import { Helmet } from "react-helmet";
import { Button, Checkbox, Label, TextInput, Card, Dropdown, DropdownItem, Badge} from "flowbite-react";
import axios from "axios";
import api from "@/routes/api";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, use, useState } from "react";
import { PulseLoader } from 'react-spinners';
import { NumericFormat } from 'react-number-format';
import { IoIosSearch } from "react-icons/io";
import { getGambarBarang } from '@/api';


function ProductHome() {
    const navigate = useNavigate();
    const [barang, setBarang] = useState(null);
    const [allBarang, setAllBarang] = useState(null); // Store all barang
    const [kategori, setKategori] = useState(null);
    const [selectedKategoriId, setSelectedKategoriId] = useState(null);
    const {id} = useParams();
    const [loading, setLoading] = useState(true);
    const detailProductClick = (barangId) =>{
        navigate(`/products/detail/${barangId}`);
    };


    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);

    useEffect( () => {
        const fetchAll = async () => {
            try{
                const responseBarang = await axios.get(`${api}/barang/home`);
                const responseKategori = await axios.get(`${api}/kategori`);
                
                console.log('API Response Kategori:', responseKategori.data?.data);
                
                const availableBarang = responseBarang.data?.data?.filter(item => item.status === "Tersedia") || [];
                setAllBarang(availableBarang);
                setBarang(availableBarang);
                console.log("available barang", availableBarang);

                if (selectedKategoriId) {
                    const filteredBarang = responseBarang.data?.data?.filter(item => 
                        item.kategori_kode < selectedKategoriId * 10 + 10 &&
                        item.kategori_kode > selectedKategoriId * 10 && 
                        item.status === "Tersedia"
                    );

                    console.log(filteredBarang);
                    setBarang(filteredBarang);
                } else {
                    setKategori(responseKategori.data?.data || []);
                }
            }catch(error){
                console.error('Error fetching barang : ', error);
            }finally{
                setLoading(false);
            }
        }
        fetchAll();
    },[selectedKategoriId])

    useEffect(() => {
        if (allBarang) {
            const filteredProducts = allBarang.filter(item => 
                item.nama_barang.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setBarang(filteredProducts);
        }
    }, [searchTerm, allBarang]);

    const handleKategoriSelect = (kategoriId) => {
        console.log('Kategori Selected:', kategoriId);
        setSelectedKategoriId(kategoriId);
    };

    if (loading) {
        return (
            <Card className="w-full h-full bg-white/90 backdrop-blur-md p-6 items-center flex justify-center">
                <PulseLoader size={15} color="#61d52c" />
            </Card>
        );
    }

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
                    <Dropdown dismissOnClick={false} label="Select Kategori" size="md" className="ms-20" color="green">
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
                    <label htmlFor="table-search-users" className="sr-only">Search</label>
                    <div className="relative ms-5">
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
                </div>

                <div className="grid grid-cols-5 auto-rows-auto gap-x-4 gap-y-8 p-20" >
                    {barang?.map(barang => (
                        <Card key={barang.id_barang} className="border-2" onClick={() => detailProductClick(barang.id_barang)}>
                                <img src={barang.url_gambar_barang ? getGambarBarang(barang.url_gambar_barang.split(';')[0]) : '/logo.png'} alt="" />
                                <p>{barang.nama_barang}</p>
                                <NumericFormat 
                                    value={barang.harga} 
                                    prefix = "Rp. "
                                    displayType = "text"
                                    thousandSeparator = "."
                                    decimalSeparator=","
                                    className="font-bold -mt-3"
                                />
                                {barang.tanggal_garansi_habis?(
                                    <Badge color="success" className="w-fit h-8">Bergaransi</Badge>
                                ) : (
                                    <Badge  className="w-auto h-8 text-transparent bg-transparen hover:bg-transparent"></Badge>
                                )}
                        </Card>
                    ))}
                </div>
            </div>
        </div>

        </>
    )
}

export default ProductHome;