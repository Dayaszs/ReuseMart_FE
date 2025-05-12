import axios from "axios";
import api from "@/routes/api";
import { Helmet } from "react-helmet";
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Tabs, TabItem, Button} from 'flowbite-react'
import { PulseLoader } from 'react-spinners';
import { NumericFormat } from 'react-number-format';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel"

// Function to format date
const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
};

const DetailProduct = () => {
    const {id} = useParams();
    const [barang, setBarang] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetailBarang = async () => {
            try{
                console.log(`${api}/barang/${id}/detail`);
                const token = localStorage.getItem('token');

                const response = await axios.get(`${api}/barang/${id}/detail`,{
                    headers:{
                        Authorization: `Bearer ${token}`,
                    }
                });
                
                setBarang(response.data?.barang[0]|| []);
            }catch(error){
                console.error('Error fetching detail barang : ', error);
            }finally{ 
                setLoading(false);
            }
        };

        fetchDetailBarang();
    }, [id]);

    if (loading) {
        return (
            <Card className="w-full h-full bg-white/90 backdrop-blur-md p-6 items-center flex justify-center">
                <PulseLoader size={15} color="#61d52c" />
            </Card>
        );
    }

    return ( 
        <>
            <div>
                <Helmet>
                    <title>Products - Reusemart</title>
                </Helmet>
            </div>
            <div className="w-full h-auto px-20 py-10">
                <div className="grid grid-cols-3 grid-rows-1 gap-10">
                    <div className="h-[500px]">
                        <Carousel className="w-full h-full">
                            <CarouselContent>
                                <CarouselItem className="h-full">
                                    <img 
                                        src="/logo.png"
                                        alt="Product Image"
                                        className="w-full h-full object-contain p-4"
                                    />
                                </CarouselItem>
                                <CarouselItem className="h-full">
                                    <img 
                                        src="/logo.png" 
                                        alt="Product Image" 
                                        className="w-full h-full object-contain p-4"
                                    />
                                </CarouselItem>
                            </CarouselContent>
                            <CarouselPrevious />
                            <CarouselNext />
                        </Carousel>
                    </div>
                    <div className="border-2 col-span-2 p-5 rounded-xl flex flex-col h-full">
                        <div>
                            <p className="font-bold text-3xl mb-3">{barang.nama_barang}</p>
                            <NumericFormat 
                                value={barang.harga} 
                                prefix = "Rp. "
                                displayType = "text"
                                thousandSeparator = "."
                                decimalSeparator=","
                                className="font-bold text-xl"
                            />
                            {barang.tanggal_garansi_habis ? (
                                <p className="mt-1">Tanggal garansi habis : {formatDate(barang.tanggal_garansi_habis)}</p>
                            ) : (
                                <div></div>
                            )}
                            <Tabs aria-label="Tabs with underline" variant="underline" className="mt-5">
                                <TabItem active title="Deskripsi" className=" dark:bg-green-500 ">
                                    <p>{barang.deskripsi}</p>
                                    <p className="mt-5">Berat : {barang.berat} kg</p>
                                </TabItem>
                            </Tabs>
                        </div>
                        <div className="flex gap-3 mt-auto pt-5 ms-auto">
                            <Button color="green" className="w-32">+ Keranjang</Button>
                            <Button color="light" className="w-32">Beli</Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
 
export default DetailProduct;