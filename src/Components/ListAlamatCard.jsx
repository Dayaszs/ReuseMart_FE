import React, { useState, useEffect } from 'react';
import { Card, Button, Badge } from "flowbite-react";
import { LuPlus } from "react-icons/lu";
import { IoIosSearch } from "react-icons/io";
import { FaMapMarkerAlt } from "react-icons/fa";
import { GetAlamat } from '@/api/services/apiAlamat';
import { PulseLoader } from 'react-spinners';

const ListAlamatCard = () => {
    const [alamat, setAlamat] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchAlamat();
    }, []);

    const fetchAlamat = () => {
        setIsLoading(true);
        GetAlamat()
            .then((res) => {
                setAlamat(res.data);
            })
            .catch((err) => {
                console.error(err.message || "Gagal mengambil data.");
            })
            .finally(() => setIsLoading(false));

        console.log(alamat);
    };

    const filteredAlamat = alamat.filter((item) =>
        item.alamat_lengkap.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Card className="md:col-span-2">
            <h2 className="text-xl font-semibold text-gray-900">Daftar Alamat</h2>

            {/* Search Bar + Tambah Alamat */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-4 bg-white">
                <div className="relative">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <IoIosSearch className="h-5 w-5 text-gray-500" />
                    </div>
                    <input
                        type="text"
                        className="block w-80 ps-10 pt-2 pb-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Cari Alamat"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button
                    type="button"
                    className="flex items-center text-white bg-green-500 hover:bg-green-600 focus:ring-2 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5"
                >
                    <LuPlus className="h-4 w-4 mr-2" />
                    Tambah Alamat
                </button>
            </div>

            {/* Address List */}
            <div className="space-y-4">
                {isLoading ? (
                    <div className="flex justify-center items-center py-8">
                        <PulseLoader size={8} color="#057A55" />
                    </div>
                ) : (
                    filteredAlamat.map((item, index) => (
                        <div
                            key={index}
                            className={`relative p-6 rounded-lg border ${item.is_primary
                                ? "bg-green-50 border-green-500"
                                : "bg-white border-gray-200"
                                }`}
                        >
                            <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-base text-green-700">
                                    {item.nama}
                                </h4>
                                {item.is_primary && (
                                    <Badge color='gray'>
                                        Utama
                                    </Badge>
                                )}
                            </div>
                            <p className="font-bold text-gray-900">{item.nama_penerima}</p>
                            <p className="text-sm text-gray-700">{item.no_telp}</p>
                            <p className="text-sm text-gray-700 mb-3">{item.alamat_lengkap}</p>
                            <div className="flex flex-wrap gap-x-4 gap-y-2 text-green-700 text-sm font-medium">
                                <button className="hover:underline">Ubah Alamat</button>
                                {!item.is_primary && (
                                    <button className="hover:underline text-red-500">Hapus</button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </Card>
    );
};

export default ListAlamatCard;
