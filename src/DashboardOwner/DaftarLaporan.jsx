import React from 'react';
import { Button } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';

const DaftarLaporan = () => {
    const navigate = useNavigate();

    const handleClickBarangHabisMasaTitip = () => {
        navigate('/laporan-barang-habis-masa-titip');
    };

    const handleClickLaporanPerKategori = () => {
        navigate('/laporan-per-kategori');
    };

    return (
        <div className='space-y-4'>
            <Button color="success" className='mb-4' onClick={handleClickBarangHabisMasaTitip}>
                Laporan Barang Habis Masa Titip
            </Button>
            <Button color="success" className='mb-4' onClick={handleClickLaporanPerKategori}>
                Laporan Per Kategori
            </Button>
        </div>
    );
};

export default DaftarLaporan;