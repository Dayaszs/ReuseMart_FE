import NavigationBar from "../Components/NavigationBar";
import FooterBar from '../Components/FooterBar';
import { Helmet } from "react-helmet";
import { Button, Checkbox, Label, TextInput, Card, Dropdown, DropdownItem} from "flowbite-react";
import { useNavigate } from 'react-router-dom'



function ProductHome() {
    const navigate = useNavigate();
    
    const list_barang = [
        {
            id : 1,
            nama_barang : "box 1",
            harga_barang : "Rp. 200.000",
            gmbr : "./logo.png" 
        },
        {
            id : 2,
            nama_barang : "box 2",
            harga_barang : "Rp. 100.000",
            gmbr : "./logo.png" 
        },
        {
            id : 3,
            nama_barang : "box 3",
            harga_barang : "Rp. 300.000",
            gmbr : "./logo.png" 
        },
        {
            id : 4,
            nama_barang : "box 1",
            harga_barang : "Rp. 200.000",
            gmbr : "./logo.png" 
        },
        {
            id : 5,
            nama_barang : "box 2",
            harga_barang : "Rp. 100.000",
            gmbr : "./logo.png" 
        },
        {
            id : 6,
            nama_barang : "box 3",
            harga_barang : "Rp. 300.000",
            gmbr : "./logo.png" 
        },
        {
            id : 7,
            nama_barang : "box 1",
            harga_barang : "Rp. 200.000",
            gmbr : "./logo.png" 
        },
        {
            id :8,
            nama_barang : "box 2",
            harga_barang : "Rp. 100.000",
            gmbr : "./search.png" 
        },
        {
            id : 9,
            nama_barang : "box 3",
            harga_barang : "Rp. 300.000",
            gmbr : "./logo.png" 
        },
    ];

    const list_kategori =[
        'Elektronik & Gadget',
        'Pakaian & Aksesoris',
        'Perabotan Rumah Tangga',
        'Buku, Alat tulis & Peralatan Sekolah',
        'Hobi, Mainan & Koleksi',
        'Perlengkapan Bayi & Anak',
        'Otomotif & Aksesori',
        'Perlengkapan Taman & Outdoor',
        'Perlengkapan Kantor & Industri',
        'Kosmetik & Perawatan diri',
    ];

    return(
        <>
         <div>
            <Helmet>
                <title>Products - Reusemart</title>
            </Helmet>
        </div>
        
        <NavigationBar/>

        <div className="@container relative">
            <div className='w-full h-auto flex flex-col items-center p-16 bg-[url("./background.jpg")] bg-cover bg-center bg-no-repeat bg-fixed'>
                <div className="flex justify-start w-full ">
                    <Dropdown dismissOnClick={false} label="Select Kategori" size="md" className="ms-20" color="green">
                        {list_kategori.map((kategori, index) =>(
                            <DropdownItem key={index}>{kategori}</DropdownItem>
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
                    {list_barang.map(barang => (
                        <Card onClick={() => navigate(`/products/detail/${barang.id}`)}>
                                <img src={barang.gmbr} alt="" />
                                <p key={barang.id}>{barang.nama_barang}</p>
                                <p key={barang.id} className="font-bold -mt-3">{barang.harga_barang}</p>
                        </Card>
                    ))}
                </div>
            </div>
        </div>

        <FooterBar/>
        </>
    )
}

export default ProductHome;