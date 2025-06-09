import React, { useEffect, useState } from 'react';
import { Document, Page, Text, View, StyleSheet, PDFViewer } from '@react-pdf/renderer';
import { laporanKomisiBulanan } from '@/api/services/apiOwner';
import { PulseLoader } from 'react-spinners';
import { Card } from "flowbite-react";
import { useLocation } from 'react-router-dom';

const LaporanKomisiBulanan = () => {
    const location = useLocation();
    const [ data, setData ] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tanggalPilihan, setTanggalPilihan ] = useState();
    const [tanggalTemp, setTanggalTemp ] = useState();
    const [error, setError] = useState(null);

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const fetchData = async(tanggalBulanan) => {
        setLoading(true);
        const currentDate = new Date();

        if(!tanggalBulanan){
            tanggalBulanan = formatDate(currentDate);
        }

        console.log("tanggal", tanggalBulanan);

        laporanKomisiBulanan(tanggalBulanan)
        .then((res) => {
            console.log(res.data);
            setData(res.data);
            setTanggalPilihan(tanggalBulanan);
        })
        .catch((err) => {
            setError(err.message || "Gagal mengambil data.");
        })
        .finally(() => setLoading(false));
    };

    useEffect(() => {
        const tanggal = location.state?.tanggal;
        console.log("tanggal dari state:", tanggal);
        if (tanggal) {
            setTanggalPilihan(tanggal);
            fetchData(tanggal);
        } else {
            fetchData(null);
        }
    }, [location.state]);

    if (loading) {
        return (
            <Card className="w-full min-h-screen bg-white/90 backdrop-blur-md p-6 items-center flex justify-center">
                <PulseLoader size={15} color="#61d52c" />
            </Card>
        );
    }

    return(
        <div style={{ height: '100vh' }}>
            <PDFViewer style={{ width: '100%', height: '100%' }}>
                <PDFDocument data={data} tanggal={tanggalPilihan} />
            </PDFViewer>
        </div>
    )

}

const styles = StyleSheet.create({
    page: {
        padding: 30,
    },
    header: {
        marginBottom: 20,
        textAlign: 'center',
    },
    companyName: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    companyAddress: {
        fontSize: 12,
        marginBottom: 15,
    },
    reportTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    reportInfo: {
        fontSize: 12,
        marginBottom: 5,
    },
    table: {
        display: 'table',
        width: 'auto',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#bfbfbf',
    },
    tableRow: {
        flexDirection: 'row',
    },
    tableHeader: {
        backgroundColor: '#f0f0f0',
        fontWeight: 'bold',
    },
    tableCell: {
        padding: 5,
        borderWidth: 1,
        borderColor: '#bfbfbf',
        flex: 1,
        fontSize: 10,
    },
});

const PDFDocument = ({ data }) => {
    const currentDate = new Date();
    const lastMonth = new Date(data.bulan_lalu);

    const formattedDate = currentDate.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    const formattedBulan = lastMonth.toLocaleDateString('id-ID', {
        month: 'long',
    });

    const formattedTahun = lastMonth.toLocaleDateString('id-ID', {
        year: 'numeric'
    });

    const formatKodeProduk = (nama_barang, id_barang) => {
        const firstWord = nama_barang[0];
        return `${firstWord}${id_barang}`;
    };

    const formatNumber = (number) => {
        return number.toLocaleString('id-ID');
    };

    return (
        <Document>
            <Page size="A4" orientation="landscape" style={styles.page}>
                <View style={styles.header}>
                    <Text style={styles.companyName}>ReUse Mart</Text>
                    <Text style={styles.companyAddress}>Jl. Green Eco Park No. 456 Yogyakarta</Text>
                    <Text style={[styles.reportTitle, { textDecoration: 'underline' }]}>Laporan Komisi Bulanan</Text>
                    <Text style={styles.reportInfo}>Bulan : {formattedBulan}</Text>
                    <Text style={styles.reportInfo}>Tahun : {formattedTahun}</Text>
                    <Text style={styles.reportInfo}>Tanggal cetak: {formattedDate}</Text>
                </View>
                <View style={styles.table}>
                    <View style={[styles.tableRow, styles.tableHeader]}>
                        <Text style={styles.tableCell}>Kode Produk</Text>
                        <Text style={styles.tableCell}>Nama Produk</Text>
                        <Text style={styles.tableCell}>Harga Jual</Text>
                        <Text style={styles.tableCell}>Tanggal Masuk</Text>
                        <Text style={styles.tableCell}>Tanggal Laku</Text>
                        <Text style={styles.tableCell}>Komisi Hunter</Text>
                        <Text style={styles.tableCell}>Komisi ReUse Mart</Text>
                        <Text style={styles.tableCell}>Bonus Penitip</Text>
                    </View>
                    {data.barang.map((item, index) => (
                        <View key={index} style={styles.tableRow}>
                            <Text style={styles.tableCell}>{formatKodeProduk(item.barang.nama_barang, item.barang.id_barang)}</Text>
                            <Text style={styles.tableCell}>{item.barang.nama_barang}</Text>
                            <Text style={styles.tableCell}>{formatNumber(parseInt(item.barang.harga))}</Text>
                            <Text style={styles.tableCell}>{new Date(item.barang.rincian_penitipan.penitipan.tanggal_masuk).toLocaleDateString('id-ID')}</Text>
                            <Text style={styles.tableCell}>{new Date(item.pemesanan.tanggal_selesai).toLocaleDateString('id-ID')}</Text>
                            {item.komisi_hunter ?
                                (
                                    <Text style={styles.tableCell}>{formatNumber(parseInt(item.komisi_hunter))}</Text>
                                )
                                :
                                (
                                    <Text style={styles.tableCell}>0</Text>
                                ) 
                            }
                            <Text style={styles.tableCell}>{formatNumber(parseInt(item.komisi_perusahaan))}</Text>
                            {item.bonus_penitip ?
                                (
                                    <Text style={styles.tableCell}>{formatNumber(parseInt(item.bonus_penitip))}</Text>
                                )
                                :
                                (
                                    <Text style={styles.tableCell}>0</Text>
                                ) 
                            }
                        </View>
                    ))}
                    <View style={styles.tableRow}>
                        <Text style={[styles.tableCell, {flex : 2.13}]}>Total</Text>
                        <Text style={[styles.tableCell]}>{formatNumber(parseInt(data.total_komisi.total_harga_jual))}</Text>
                        <Text style={[styles.tableCell, {flex : 2.12}]}></Text>
                        <Text style={[styles.tableCell]}>{formatNumber(parseInt(data.total_komisi.total_komisi_hunter))}</Text>
                        <Text style={[styles.tableCell]}>{formatNumber(parseInt(data.total_komisi.total_komisi_perusahaan))}</Text>
                        <Text style={[styles.tableCell]}>{formatNumber(parseInt(data.total_komisi.bonus_penitip))}</Text>
                    </View>
                </View>
            </Page>
        </Document>
    );
};

export default LaporanKomisiBulanan;