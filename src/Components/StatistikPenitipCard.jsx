import React from 'react';
import { Card, Button } from "flowbite-react";
import { FaRegStar } from "react-icons/fa";
import { LuAward, LuCircleDollarSign, LuMapPin, LuList } from "react-icons/lu";

const StatistikPenitipCard = ({ rating, isTopSeller, poin, saldo, onOpenTransaksi }) => {
    const formatRupiah = (number) => {
        return (
            'Rp' +
            new Intl.NumberFormat('id-ID', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            }).format(number)
        );
    };
    return (
        <Card className="md:col-span-2">
            <div className="pb-1">
                <h2 className="text-xl font-semibold text-gray-900">Detail Akun Penitip</h2>
            </div>
            <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-0">
                    <div className="flex flex-col items-center p-4 bg-[#F2FDF6] rounded-lg">
                        <div className="p-3 bg-green-100 rounded-full mb-2">
                            <FaRegStar className='text-green-500 h-6 w-6' />
                        </div>
                        <p className="text-sm font-medium text-gray-500">Rating</p>
                        <p className="text-2xl font-bold text-gray-900">{rating}</p>
                    </div>
                    <div className="flex flex-col items-center p-4 bg-[#F2FDF6] rounded-lg">
                        <div className="p-3 bg-green-100 rounded-full mb-2">
                            <LuAward className='text-green-500 h-6 w-6' />
                        </div>
                        <p className="text-sm font-medium text-gray-500">Status Badge</p>
                        <p className="text-lg font-bold text-gray-900">{isTopSeller === 1 ? 'Top Seller' : 'Great Seller'}</p>
                    </div>
                    <div className="flex flex-col items-center p-4 bg-[#F2FDF6] rounded-lg">
                        <div className="p-3 bg-green-100 rounded-full mb-2">
                            <LuCircleDollarSign className='text-green-500 h-6 w-6' />
                        </div>
                        <p className="text-sm font-medium text-gray-500">Poin Dimiliki</p>
                        <p className="text-2xl font-bold text-gray-900">{poin}</p>
                    </div>
                </div>
                <div className="mt-4">
                    <div className="bg-[#F2FDF6] p-6 rounded-lg mb-4">
                        <h3 className="text-lg font-medium mb-2">Saldo Anda</h3>
                        <p className="text-3xl font-bold text-green-500">{`Rp${parseInt(saldo).toLocaleString('id-ID')}`}</p>
                        <p className="text-sm text-muted-foreground mt-1">Dapat ditarik</p>
                    </div>

                    <div className="grid grid-cols-1">
                        {/* <Button
                            className="flex items-center justify-center gap-2 py-6 rounded-sm"
                            color="light"
                        onClick={onOpenAlamat}
                        >
                            <LuMapPin className="h-5 w-5" />
                            <span className="text-base">Lihat Daftar Alamat</span>
                        </Button> */}

                        <Button
                            className="flex items-center justify-center gap-2 py-6 rounded-sm"
                            color="light"
                            onClick={onOpenTransaksi}
                        >
                            <LuList className="h-5 w-5" />
                            <span className="text-base">Lihat Riwayat Penjualan</span>
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default StatistikPenitipCard;