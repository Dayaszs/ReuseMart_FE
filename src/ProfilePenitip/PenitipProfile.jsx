import React from 'react'
import { useState, useEffect } from 'react'
import { GetPenitip } from '@/api/services/penitip'
import { Badge } from "flowbite-react";
import { LuAward, LuCircleUserRound } from "react-icons/lu";
import { FaStar } from "react-icons/fa";
import { PulseLoader } from 'react-spinners';
import ProfileInfoCard from '@/Components/ProfileInfoCard';
import StatistikPenitipCard from '@/Components/StatistikPenitipCard';
import { Card } from 'flowbite-react';

const PenitipProfile = () => {
    const [penitip, setPenitip] = useState(null);
    const [inisial, setInisial] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isTransaksi, setIsTransaksi] = useState(false);

    const getInisial = (name) => {
        if (!name) return null;
        const words = name.trim().split(/\s+/);
        if (words.length === 1) return words[0][0]?.toUpperCase() || '';
        return (words[0][0] + (words[1]?.[0] || '')).toUpperCase();
    };

    const fetchPenitip = () => {
        setIsLoading(true);
        GetPenitip()
            .then((res) => {
                setPenitip(res.data);
                setInisial(getInisial(res.data.nama_penitip));
            })
            .catch((err) => {
                setError(err.message || "Gagal mengambil data.");
            })
            .finally(() => setIsLoading(false));
    };

    const openTransaksiCard = () => {
        setIsTransaksi(true);
        setIsAlamat(false);
    }

    useEffect(() => {
        setError("");
        fetchPenitip();
    }, []);

    if (isLoading) {
        return (
            <Card className="w-full h-full bg-white/90 backdrop-blur-md p-6 items-center flex justify-center">
                <PulseLoader size={15} color="#61d52c" />
            </Card>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="flex flex-col gap-6">

                {/* Profile Pic, Avg Rating, Badge */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-28 h-28 rounded-full bg-gray-100 border-2 flex items-center justify-center mb-4">
                            <span className="text-4xl font-medium text-gray-600">{inisial}</span>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">{penitip.nama_penitip}</h1>
                            <div className="flex items-center gap-2 mt-1">
                                <div className="flex items-center">
                                    <FaStar className="h-5 w-5 text-amber-500 fill-amber-500" />
                                    <span className="ml-1 font-medium text-lg">{typeof penitip.rating === 'number' ? penitip.rating.toFixed(1) : '0.0'}</span>
                                </div>
                                {penitip.is_top_seller === 1 ? (
                                    <Badge color='success' className='text-green-500' icon={LuAward}>
                                        <span className='text-sm'>Top Seller</span>
                                    </Badge>
                                ) : (<></>)}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Info Akun Penitip & Performa Penitip */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <ProfileInfoCard
                        nama={penitip.nama_penitip}
                        no_telp={penitip.no_telp}
                        email={penitip.email} />
                    {isTransaksi ? (
                        // <TransaksiCard />
                        <></>
                    ) : (
                        <StatistikPenitipCard
                            rating={typeof penitip.rating === 'number' ? penitip.rating.toFixed(1) : '0.0'}
                            isTopSeller={penitip.is_top_seller}
                            poin={penitip.poin}
                            saldo={penitip.saldo}
                            onOpenTransaksi={openTransaksiCard}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

export default PenitipProfile