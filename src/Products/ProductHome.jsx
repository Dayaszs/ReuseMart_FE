import NavigationBar from "../Components/NavigationBar";
import FooterBar from '../Components/FooterBar';
import { Helmet } from "react-helmet";
import { Button, Checkbox, Label, TextInput, Card, Dropdown, DropdownItem} from "flowbite-react";
import axios from "axios";
import api from "@/routes/api";
import { useParams } from "react-router-dom";
import { useEffect, use, useState } from "react";
import { PulseLoader } from 'react-spinners';



function ProductHome() {
    // const navigate = useNavigate();
    const [barang, setBarang] = useState(null);
    const [kategori, setKategori] = useState(null);
    const {id} = useParams();
    const [loading, setLoading] = useState(true);

    useEffect( () => {
        const fetchAll = async () => {
            try{
                const responseBarang = await axios.get(`${api}/barang/home`);
                const responseKategori = await axios.get(`${api}/kategori`);
                
                setBarang(responseBarang.data?.data|| []);
                setKategori(responseKategori.data?.kategori || []);
            }catch(error){
                console.error('Error fetching barang : ', error);
            }finally{
                setLoading(false);
            }
        }

        fetchAll();
    },[])

    if (loading) {
        return (
            <Card className="w-full h-full bg-white/90 backdrop-blur-md p-6 items-center flex justify-center">
                <PulseLoader size={15} color="#61d52c" />;
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
                            <DropdownItem key={index}>{kategori.value}</DropdownItem>
                        ))}
                    </Dropdown>
                    <TextInput className="w-xl ms-3" id="search" placeholder="Search"/>
                    <Button type="submit" className="ms-5 bg-[#A837E8]" size="md">
                        <img 
                            src="./search.png" 
                            className="w-5"
                        />
                    </Button>
                </div>
                <div className="grid grid-cols-5 auto-rows-auto gap-x-4 gap-y-8 p-20">
                    {barang?.map(barang => (
                        <Card key={barang.id_barang} className="border-2">
                                <img src="logo.png" alt="" />
                                <p>{barang.nama_barang}</p>
                                <p className="font-bold -mt-3">Rp. {barang.harga}</p>
                        </Card>
                    ))}
                </div>
            </div>
        </div>

        </>
    )
}

export default ProductHome;