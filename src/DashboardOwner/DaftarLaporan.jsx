import React, { useState } from 'react';
import { Button, Label, TextInput } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

const DaftarLaporan = () => {
    const navigate = useNavigate();
    const [ tanggalKomisi, setTanggalKomisi ] = useState(null);
    const [ tahunPenjualan, setTahunPenjualan ] = useState(new Date().getFullYear());
    const [ tahunKategori, setTahunKategori ] = useState(new Date().getFullYear());

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleDateSelect = (date) => {
        if (date) {
            const formattedDate = formatDate(date);
            setTanggalKomisi(formattedDate);
            console.log("tanggal", formattedDate);
        } else {
            setTanggalKomisi(null);
        }
    };

    const handleClickBarangHabisMasaTitip = () => {
        navigate('/laporan-barang-habis-masa-titip');
    };

    const handleClickLaporanKomisiBulanan = () => {
        navigate('/laporan-komisi-bulanan', { state: { tanggal: tanggalKomisi} });
    };

    const handleClickLaporanPerKategori = () => {
        console.log('Navigating with tahun:', tahunKategori);
        navigate('/laporan-per-kategori', { state: { tahun: tahunKategori } });
    };

    const handleClickLaporanStokGudang = () => {
        navigate('/laporan-stok-gudang');
    };

    const handleClickLaporanPenjualanBulanan = () => {
        navigate('/laporan-penjualan-bulanan', { state: { tahun: tahunPenjualan } });
    };

    return (
        <div className='space-y-4'>
            <div className='flex items-center gap-2 mb-4'>
                <Button color="success" onClick={handleClickLaporanPenjualanBulanan}>
                    Laporan Penjualan Bulanan
                </Button>
                <Label htmlFor="tahun" className="ml-4">Pilih Tahun:</Label>
                <select
                    id="tahun"
                    value={tahunPenjualan}
                    onChange={(e) => setTahunPenjualan(parseInt(e.target.value))}
                    className="border border-gray-300 rounded-md p-2"
                >
                    {Array.from({ length: new Date().getFullYear() - 1999 }, (_, i) => 2000 + i).map(year => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </select>
            </div>
            <Button color="success" className='mb-4' onClick={handleClickLaporanStokGudang}>
                Laporan Stok Gudang
            </Button>
            <div className='flex'>
                <div className='flex items-center gap-2'>
                    <p className='px-4'>Pilih tanggal Komisi Bulanan</p>
                    <TextInput
                        type="text"
                        value={tanggalKomisi ? format(tanggalKomisi, "yyyy-MM-dd", { locale: id }) : ""}
                        placeholder="Pilih tanggal"
                        readOnly
                        className="w-48"
                    />
                    <Popover>
                        <PopoverTrigger asChild>
                            <button
                                type="button"
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <CalendarIcon className="h-5 w-5" />
                            </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={tanggalKomisi ? new Date(tanggalKomisi) : undefined}
                                onSelect={handleDateSelect}
                                initialFocus
                                className="bg-white"
                            />
                        </PopoverContent>
                    </Popover>
                    <Button 
                        color="success" 
                        onClick={handleClickLaporanKomisiBulanan}
                    >
                        Lihat Laporan
                    </Button>
                </div>
            </div>
            <Button color="success" className='mb-4' onClick={handleClickBarangHabisMasaTitip}>
                Laporan Barang Habis Masa Titip
            </Button>
            <div className='flex items-center gap-2 mb-4'>
                <Button color="success" className='mb-4' onClick={handleClickLaporanPerKategori}>
                    Laporan Per Kategori
                </Button>
                <Label htmlFor="tahunKategori" className="ml-4">Pilih Tahun:</Label>
                <select
                    id="tahunKategori"
                    value={tahunKategori}
                    onChange={(e) => setTahunKategori(parseInt(e.target.value))}
                    className="border border-gray-300 rounded-md p-2"
                >
                    {Array.from({ length: new Date().getFullYear() - 1999 }, (_, i) => 2000 + i).map(year => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default DaftarLaporan;