import React from 'react'
import { useState, useEffect } from 'react';
import { Helmet } from "react-helmet";
import { useLocation } from 'react-router-dom';
import { PulseLoader } from "react-spinners";
import { GetDetailBarang } from "@/api/services/apiBarang";
import { TambahDiskusi, GetDiskusi } from '@/api/services/apiDiskusi';
import DiskusiBarangCard from '@/Components/DiskusiBarangCard';
import { useParams } from "react-router-dom";

const DetailProduct = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [barang, setBarang] = useState([]);
    const [diskusi, setDiskusi] = useState([]);
    const { id } = useParams();

    // const fetchHalaman = (id) => {
    //     setIsLoading(true);
    //     setError("");
    //     GetDetailBarang(id)
    //         .then((res) => {
    //             setBarang(res.barang);
    //             setDiskusi(res.diskusi);
    //         })
    //         .catch((err) => {
    //             setError(err.message || "Gagal mengambil data.");
    //         })
    //         .finally(() => setIsLoading(false));
    // }

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
            fetchDiskusi(id);
        }
    }, [id]);

    return (
        <>
            <Helmet>
                <title>Products - Reusemart</title>
            </Helmet>

            {/* <PulseLoader></PulseLoader> */}
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
                            <div>

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