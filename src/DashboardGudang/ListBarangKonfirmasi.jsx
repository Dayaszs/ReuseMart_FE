import React, { useEffect, useState } from 'react';
import { IoIosSearch } from "react-icons/io";
import { PulseLoader } from 'react-spinners';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { Pagination, Button } from "flowbite-react";
import axios from 'axios';
import api from '../routes/api';

const styles = StyleSheet.create({
    page: {
        padding: 30,
    },
    header: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center',
    },
    section: {
        margin: 5,
        padding: 10,
    },
    text: {
        fontSize: 12,
        marginBottom: 5,
    },
    bold: {
        fontSize: 12,
        marginBottom: 5,
        fontWeight: 'bold',
    },
});


const formatDatePDF = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    }).replace(',', '');
};



const NotaPDF = ({ pemesanan }) => {
    const totalOngkosKirim = (parseInt(pemesanan?.biaya_total || 0) + parseInt(pemesanan?.diskon || 0));
    const subTotal = totalOngkosKirim - parseInt(pemesanan?.ongkos_kirim || 0);
    
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.section}>
                    <Text style={styles.bold}>ReUse Mart</Text>
                    <Text style={styles.text}>Jl. Green Eco Park No. 456 Yogyakarta</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.text}>No Nota       : {pemesanan?.no_nota}</Text>
                    <Text style={styles.text}>Tanggal pesan : {formatDatePDF(pemesanan?.tanggal_pemesanan)}</Text>
                    <Text style={styles.text}>Lunas pada    : {formatDatePDF(pemesanan?.pembayaran?.tanggal_pembayaran)}</Text>
                    <Text style={styles.text}>Tanggal kirim : {formatDatePDF(pemesanan?.tanggal_jadwal)}</Text>
                </View>
                <View style={styles.section}>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                        <Text style={styles.bold}>Pembeli: </Text>
                        <Text style={styles.text}>{pemesanan?.pembeli?.email} / {pemesanan?.pembeli?.nama_pembeli}</Text>
                    </View>
                    <Text style={styles.text}>{pemesanan?.alamat_penerima}</Text>
                    <Text style={styles.text}>Delivery : {pemesanan?.pegawai?.nama ? `Kurir ReUseMart (${pemesanan?.pegawai?.nama})` : '- (diambil sendiri)'}</Text>
                </View>
                {/* Items List */}
                <View style={styles.section}>
                    {(pemesanan?.komisi || []).map((komisiItem, idx) => (
                        komisiItem.barang && (
                            <View key={idx} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={styles.text}>{komisiItem.barang.nama_barang}</Text>
                                <Text style={styles.text}>{parseInt(komisiItem.barang.harga).toLocaleString('id-ID')}</Text>
                            </View>
                        )
                    ))}
                </View>
                {/* Totals */}
                <View style={styles.section}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={styles.text}>Total</Text>
                        <Text style={styles.text}>{subTotal.toLocaleString('id-ID')}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={styles.text}>Ongkos Kirim</Text>
                        <Text style={styles.text}>{parseInt(pemesanan?.ongkos_kirim || 0).toLocaleString('id-ID')}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={styles.text}>Total</Text>
                        <Text style={styles.text}>{totalOngkosKirim.toLocaleString('id-ID')}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={styles.text}>Potongan {pemesanan?.poin_ditukar || 0} poin</Text>
                        <Text style={styles.text}>- {parseInt(pemesanan?.diskon || 0).toLocaleString('id-ID')}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={styles.text}>Total</Text>
                        <Text style={styles.text}>{parseInt(pemesanan?.biaya_total || 0).toLocaleString('id-ID')}</Text>
                    </View> 
                </View>

                
                <View style={styles.section}>
                    <Text style={styles.text}>QC oleh: {pemesanan?.komisi[0]?.barang?.rincian_penitipan?.penitipan?.pegawai?.nama || '-'} (P{pemesanan?.komisi[0]?.barang?.rincian_penitipan?.penitipan?.pegawai?.id_pegawai})</Text>
                </View>
                
                <View style={styles.section}>
                    <Text style={styles.text}>Diterima oleh:</Text>
                    <Text style={styles.text}> </Text>
                    <Text style={styles.text}> </Text>
                    <Text style={styles.text}>(.................................)</Text>
                    <Text style={styles.text}>Tanggal: ............................</Text>
                </View>
            </Page>
        </Document>
    );
};

const ListBarangPembeli = () => {
    const [pemesanan, setPemesanan] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [filter, setFilter] = useState("");

    const onPageChange = (page) => setCurrentPage(page);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    

    const fetchRincianPenitipan = async () => {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        const response = await axios.get(
            `${api}/gudang/pemesanan-pembeli?page=${currentPage}&search=${searchTerm}&filter=${filter}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        setPemesanan(response.data.pemesanan);
        setLastPage(response.data.pemesanan.last_page);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchRincianPenitipan();
    }, [currentPage, searchTerm, filter, searchTerm]);

    if (error)
        return <p className='text-center text-red-600'>{error}</p>;

    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            {/* Search Bar */}
            <div className="flex flex-col md:flex-row items-center justify-start flex-wrap gap-4 py-4 ps-6 bg-white">
                <label htmlFor="table-search-users" className="sr-only">Search</label>
                <p className='font-bold'>List Barang Proses</p>
                <div className="flex flex-row gap-4">
                    <div className="relative">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                            <IoIosSearch />
                        </div>
                        <input
                            type="text"
                            className="block w-50 ps-10 pt-2 pb-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:outline-green-500"
                            placeholder="Cari..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                    </div>
                    <select
                        value={filter}
                        onChange={(e) => {
                            setFilter(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="block w-50 pt-2 pb-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:outline-green-500"
                    >
                        <option value="">Semua Status</option>
                        <option value="Dikirim">Dikirim</option>
                        <option value="Siap Diambil">Siap Diambil</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            ID Pemesanan
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Tanggal Pemesanan
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Tanggal Penjadwalan
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Alamat Penerima
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Metode Pengambilan
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Biaya Total
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Nama Kurir
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Action
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Nota
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading ? (
                        <tr>
                            <td colSpan={9}>
                                <div className="flex justify-center items-center py-8">
                                    <PulseLoader size={8} color="#057A55" />
                                </div>
                            </td>
                        </tr>
                    ) : pemesanan?.data?.length > 0 ? (
                        <>
                            {pemesanan?.data?.map((item) => (
                                <tr key={item.id_pemesanan} className="bg-white border-b dark:bg-gray-800 border-gray-200 hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        {item.id_pemesanan}
                                    </td>
                                    <td className="px-6 py-4">
                                        {formatDate(item.tanggal_pemesanan)}
                                    </td>
                                    <td className="px-6 py-4">
                                        {formatDate(item.tanggal_jadwal)}
                                    </td>
                                    <td className="px-6 py-4">
                                        {item.alamat_penerima}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`font-semibold ${item.metode_pengambilan === 'Dikirim' ? 'text-blue-600' : item.metode_pengambilan === 'Diambil' ? 'text-red-600' : ''}`}>
                                            {item.metode_pengambilan}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        Rp. {parseInt(item.biaya_total).toLocaleString('id-ID')}
                                    </td>
                                    <td className="px-6 py-4">
                                        {item.pegawai?.nama || '-'}
                                    </td>
                                    <td className="px-6 py-4">
                                        {item.metode_pengambilan === 'Diambil' ? (
                                            <button
                                                className='bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition-colors w-50 text-center'
                                                type="button"
                                            >
                                                Konfirmasi
                                            </button>
                                        ) : item.metode_pengambilan === 'Dikirim' ? (
                                            <span className='text-blue-600'>Barang Sedang Dikirim</span>
                                        ) : null}
                                    </td>
                                    <td className="px-6 py-4"> 
                                        <Button
                                        className='bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded transition-colors w-50 text-center inline-block cursor-pointer'>
                                            <PDFDownloadLink
                                                document={<NotaPDF pemesanan={item} />}
                                                fileName={`nota-${item.no_nota}.pdf`}
                                                style={{ textDecoration: 'none' }}
                                            >
                                                Cetak Nota
                                            </PDFDownloadLink>
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </>
                    ) : (
                        <tr>
                            <td colSpan={9}>
                                <div className="flex justify-center items-center py-8 text-gray-500">
                                    Tidak ada pemesanan
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            <div className="flex justify-center mt-6">
                <Pagination
                    currentPage={currentPage}
                    totalPages={lastPage}
                    onPageChange={onPageChange}
                />
            </div>
        </div>
    );
}

export default ListBarangPembeli;