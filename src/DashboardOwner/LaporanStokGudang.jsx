import React, { useEffect, useState } from 'react';
import { Document, Page, Text, View, StyleSheet, PDFViewer } from '@react-pdf/renderer';
import { laporanStokGudang } from '@/api/services/apiOwner';
import { PulseLoader } from 'react-spinners';
import { Card } from "flowbite-react";

const LaporanStokGudang = () => {
    const [ data, setData ] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async() => {
        setLoading(true);

        laporanStokGudang()
        .then((res) => {
            console.log(res.data);
            setData(res.data);
            // console.log(res.data.data);
            // setData(res.data.data);
        })
        .catch((err) => {
            setError(err.message || "Gagal mengambil data.");
        })
        .finally(() => setLoading(false));
    }

    useEffect(() => {
        fetchData();
    }, []);

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
                <PDFDocument data={data} />
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
    const formattedDate = currentDate.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
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
                    <Text style={styles.reportTitle}>Laporan Stok Gudang</Text>
                    <Text style={styles.reportInfo}>Tanggal cetak: {formattedDate}</Text>
                </View>
                <View style={styles.table}>
                    <View style={[styles.tableRow, styles.tableHeader]}>
                        <Text style={styles.tableCell}>Kode Produk</Text>
                        <Text style={styles.tableCell}>Nama Produk</Text>
                        <Text style={styles.tableCell}>Id Penitip</Text>
                        <Text style={styles.tableCell}>Nama Penitip</Text>
                        <Text style={styles.tableCell}>Tanggal Masuk</Text>
                        <Text style={styles.tableCell}>Perpanjangan</Text>
                        <Text style={styles.tableCell}>ID Hunter</Text>
                        <Text style={styles.tableCell}>Nama Hunter</Text>
                        <Text style={styles.tableCell}>Harga</Text>
                    </View>
                    {data.map((item, index) => (
                        <View key={index} style={styles.tableRow}>
                            <Text style={styles.tableCell}>{formatKodeProduk(item.nama_barang, item.id_barang)}</Text>
                            <Text style={styles.tableCell}>{item.nama_barang}</Text>
                            <Text style={styles.tableCell}>T{item.rincian_penitipan.penitipan.id_penitip}</Text>
                            <Text style={styles.tableCell}>{item.rincian_penitipan.penitipan.penitip.nama_penitip}</Text>
                            <Text style={styles.tableCell}>{new Date(item.rincian_penitipan.penitipan.tanggal_masuk).toLocaleDateString('id-ID')}</Text>
                            {item.rincian_penitipan.sudah_diperpanjang == true ?
                                (<Text style={styles.tableCell}>Ya</Text>)
                            :
                                (<Text style={styles.tableCell}>Tidak</Text>)
                            }
                            {item.pegawai?
                                (
                                    <>
                                        <Text style={styles.tableCell}>P{item.pegawai.id_pegawai}</Text>
                                        <Text style={styles.tableCell}>{item.pegawai.nama}</Text>
                                    </>
                                )
                            :
                                (
                                    <>
                                        <Text style={styles.tableCell}>-</Text>
                                        <Text style={styles.tableCell}>-</Text>
                                    </>
                                )
                            }
                            <Text style={styles.tableCell}>{formatNumber(parseInt(item.harga))}</Text>
                        </View>
                    ))}
                </View>
            </Page>
        </Document>
    );
};


export default LaporanStokGudang;