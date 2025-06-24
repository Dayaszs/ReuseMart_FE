import React from 'react'
import { useState, useEffect } from 'react'
import { GetPenitip, hitungAvgRatingProfile } from '@/api/services/apiPenitip'
import { Badge, Card, Tabs, TabItem, Label, TextInput, Button } from "flowbite-react";
import { LuAward, LuCircleUserRound } from "react-icons/lu";
import ProfileInfoCard from '@/Components/ProfileInfoCard';
import StatistikPenitipCard from '@/Components/StatistikPenitipCard';
import ListPenjualanCard from '@/Components/ListPenjualanCard';
import BarangPenitip from './BarangPenitip';
import { FaStar } from "react-icons/fa";
import { PulseLoader } from 'react-spinners';
import { NumericFormat } from 'react-number-format';
import { Hand } from 'lucide-react';
import { tarikSaldoPenitip } from '@/api/services/apiPenitip'

const PenarikanSaldoPage = () => {
    const [penitip, setPenitip] = useState(null);
    const [inisial, setInisial] = useState(null);
    const [ saldo, setSaldo ] = useState(0);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isTransaksi, setIsTransaksi] = useState(false);

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

    useEffect(() => {
        setError("");
        fetchPenitip();
    }, []);

    const handleSumbitTarikSaldo = (id, jmlSaldoTarik) =>{
        if(penitip.saldo - jmlSaldoTarik < 0){
            return window.alert("Saldo tidak mecukupi");
        }
        try{
            const confirmed = window.confirm(`Apakah anda yakin akan menarik saldo sebesar Rp. ${jmlSaldoTarik}?` +`\nBiaya penarikan: Rp. ${jmlSaldoTarik * 0.05}` +`\nSisa saldo Anda setelah penarikan adalah: Rp. ${penitip.saldo - jmlSaldoTarik - (jmlSaldoTarik * 0.05)}`
            );
            if (!confirmed) {
                return;
            }
    
            tarikSaldoPenitip(id, jmlSaldoTarik);
            fetchPenitip();
        }catch (error) {
            setError(error.message);
        }
    }

    if (isLoading) {
        return (
            <Card className="w-full min-h-screen bg-white/90 backdrop-blur-md p-6 items-center flex justify-center">
                <PulseLoader size={15} color="#61d52c" />
            </Card>
        );
    }

    return (
        <div className="w-full bg-white/90 backdrop-blur-md p-6">
            <div className="flex flex-col gap-6 items-center">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold mt-10">{penitip.nama_penitip}</h1>
                            <div className="flex items-center gap-2 mt-1 flex-col">
                                    <h1 className="text-2xl font-bold">ID : {penitip.id_penitip}</h1>
                                <div className="flex items-center">
                                    <span className="ml-1 font-medium text-lg">
                                        Saldo : 
                                            <NumericFormat
                                                value={penitip.saldo}
                                                prefix="Rp. "
                                                displayType="text"
                                                thousandSeparator="."
                                                decimalSeparator=","
                                                className="font-bold text-xl"
                                            /></span>
                                </div>
                                
                            {/* <h1 className="text-2xl font-bold mt-10">Penarikan Saldo : {penitip.penarikan_saldo}</h1> */}
                                <div className="flex items-center">
                                    <span className="ml-1 font-medium text-lg">
                                        Penarikan Saldo : 
                                            <NumericFormat
                                                value={penitip.penarikan_saldo}
                                                prefix="Rp. "
                                                displayType="text"
                                                thousandSeparator="."
                                                decimalSeparator=","
                                                className="font-bold text-xl"
                                    /></span>
                                </div>
                                    <div className="relative mt-20 flex-col items-center">
                                        <div>
                                            <Label>Masukkan Jumlah Saldo Yang Ditarik</Label>
                                        </div>
                                        <div>

                                            <input
                                            type="number"
                                            className="block w-2/3 ps-2 text-start py-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:outline-green-500"
                                            value={saldo}
                                            onChange={(e) => setSaldo(e.target.value)}
                                            placeholder="Masukkan Jumlah Penarikan Saldo"
                                            />
                                        </div>
                                        <span>
                                            <Button className='mt-3'
                                                onClick={() => handleSumbitTarikSaldo(penitip.id_penitip, saldo)}
                                            >
                                                Tarik
                                            </Button>
                                        </span>
                                    </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* <Tabs aria-label="Tabs with underline" variant="underline">
                    <TabItem active title="Profil">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <ProfileInfoCard
                                nama={penitip.nama_penitip}
                                no_telp={penitip.no_telp}
                                email={penitip.email} />
                            {isTransaksi ? (
                                <ListPenjualanCard onCloseTransaksi={closeTransaksiCard} />
                            ) : (
                                <StatistikPenitipCard
                                    rating={penitip.avg_rating}
                                    isTopSeller={penitip.is_top_seller}
                                    poin={penitip.poin}
                                    saldo={penitip.saldo}
                                    onOpenTransaksi={openTransaksiCard}
                                />
                            )}
                        </div>
                    </TabItem>
                    <TabItem title="Daftar Barang">
                        <BarangPenitip />
                    </TabItem>
                </Tabs> */}
            </div>
        </div>
    )
}

export default PenarikanSaldoPage;