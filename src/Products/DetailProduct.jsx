import React from 'react'
import api from '@/routes/api';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Helmet } from "react-helmet";
import { useLocation } from 'react-router-dom';
import { PulseLoader } from "react-spinners";
import { GetDetailBarang } from "@/api/services/apiBarang";
import { TambahDiskusi, GetDiskusi } from '@/api/services/apiDiskusi';
import DiskusiBarangCard from '@/Components/DiskusiBarangCard';
import { useParams } from "react-router-dom";
import { NumericFormat } from 'react-number-format';
import { Card, Tabs, TabItem, Button } from 'flowbite-react'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { getGambarBarang } from '../api';

const DetailProduct = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [barang, setBarang] = useState([]);
    const [diskusi, setDiskusi] = useState([]);
    const { id } = useParams();

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const fetchDiskusi = (id) => {
        GetDiskusi(id)
            .then((res) => {
                console.log("mau set diskusi di fetchDiskusi");
                setDiskusi(res.data);
            })
            .catch((err) => {
                console.log("fetch diskusi error di detail product");
                setError(err.message || "Gagal mengambil data.");
            })
            .finally(() => setIsLoading(false));
    }

    const tambahDiskusi = (id, data) => {
        TambahDiskusi(id, data)
            .then((response) => {
                fetchDiskusi(id);
                return response;
            })
            .catch((err) => {
                setError(err.message);
            })
            .finally(() => setIsLoading(false));
    }

    useEffect(() => {
        if (id) {
            const fetchDetailBarang = async () => {
                try {
                    console.log(`${api}/barang/${id}/detail`);
                    const token = localStorage.getItem('token');

                    const response = await axios.get(`${api}/barang/${id}/detail`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        }
                    });

                    setBarang(response.data?.barang[0] || []);
                } catch (error) {
                    console.error('Error fetching detail barang : ', error);
                } finally {
                    setIsLoading(false)
                }
            };

            fetchDetailBarang();
            fetchDiskusi(id);
        }
    }, [id]);

    return (
        <>
            <Helmet>
                <title>Products - Reusemart</title>
            </Helmet>

            <div className="container min-h-screen mx-auto px-4 py-8">
                {isLoading ? (
                    <>
                        <div className='flex min-h-screen items-center justify-center'>
                            <PulseLoader size={8} color="#057A55" />
                        </div>
                    </>
                ) : (
                    <>
                        <div className="max-w-6xl mx-auto">
                            {/* Detail Barang/Produk */}
                            <div className="w-full h-auto py-10">
                                <div className="grid grid-cols-3 grid-rows-1 gap-10">
                                    <div className="h-[500px]">
                                        <Carousel className="w-full h-full">
                                            <CarouselContent>
                                                {barang.url_gambar_barang?.split(';').map((gambar, index) => (
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
                                    <div className="border-2 col-span-2 p-5 rounded-xl flex flex-col h-full">
                                        <div>
                                            <p className="font-bold text-3xl mb-3">{barang.nama_barang}</p>
                                            <NumericFormat
                                                value={barang.harga}
                                                prefix="Rp. "
                                                displayType="text"
                                                thousandSeparator="."
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


                            {/* Diskusi Produk */}
                            <div className="mt-12 border-t pt-8">
                                <h2 className="text-2xl font-bold mb-6 text-green-500">Diskusi Produk</h2>
                                <DiskusiBarangCard
                                    diskusi={diskusi}
                                    tambahDiskusi={tambahDiskusi}
                                    barangId={id}
                                    error={error}
                                />
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

export default DetailProduct;