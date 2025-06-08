import React, { useEffect, useState } from 'react';
import { Document, Page, Text, View, StyleSheet, PDFViewer } from '@react-pdf/renderer';
import axios from 'axios';
import { PulseLoader } from 'react-spinners';
import { Card } from "flowbite-react";
import api from '@/routes/api';

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
    title: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center',
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
    },
    totalRow: {
        backgroundColor: '#e6e6e6',
        fontWeight: 'bold',
    },
});

const allCategories = [
    "Elektronik & Gadget",
    "Pakaian & Aksesori",
    "Perabotan Rumah Tangga",
    "Buku, Alat Tulis, & Peralatan Sekolah",
    "Hobi, Mainan, & Koleksi",
    "Perlengkapan Bayi & Anak",
    "Otomotif & Aksesori",
    "Perlengkapan Taman & Outdoor",
    "Peralatan Kantor & Industri",
    "Kosmetik & Perawatan Diri"
];

const PDFDocument = ({ data }) => {
    // Create a map of existing data
    const dataMap = data.reduce((acc, item) => {
        acc[item.nama_kategori] = item;
        return acc;
    }, {});

    // Calculate totals
    const totals = data.reduce((acc, item) => {
        acc.total_terjual += item.total_terjual;
        acc.total_non_terjual += item.total_non_terjual;
        return acc;
    }, { total_terjual: 0, total_non_terjual: 0 });

    // Get current date and format it
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Text style={styles.companyName}>ReUse Mart</Text>
                    <Text style={styles.companyAddress}>Jl. Green Eco Park No. 456 Yogyakarta</Text>
                    <Text style={styles.reportTitle}>LAPORAN PENJUALAN PER KATEGORI BARANG</Text>
                    <Text style={styles.reportInfo}>Tahun: {currentDate.getFullYear()}</Text>
                    <Text style={styles.reportInfo}>Tanggal cetak: {formattedDate}</Text>
                </View>
                <View style={styles.table}>
                    <View style={[styles.tableRow, styles.tableHeader]}>
                        <Text style={styles.tableCell}>Kategori</Text>
                        <Text style={styles.tableCell}>Jumlah Item Terjual</Text>
                        <Text style={styles.tableCell}>Jumlah Item Gagal Terjual</Text>
                    </View>
                    {allCategories.map((category, index) => {
                        const item = dataMap[category] || { total_terjual: 0, total_non_terjual: 0 };
                        return (
                            <View key={index} style={styles.tableRow}>
                                <Text style={styles.tableCell}>{category}</Text>
                                <Text style={styles.tableCell}>{item.total_terjual}</Text>
                                <Text style={styles.tableCell}>{item.total_non_terjual}</Text>
                            </View>
                        );
                    })}
                    <View style={[styles.tableRow, styles.totalRow]}>
                        <Text style={styles.tableCell}>Total</Text>
                        <Text style={styles.tableCell}>{totals.total_terjual}</Text>
                        <Text style={styles.tableCell}>{totals.total_non_terjual}</Text>
                    </View>
                </View>
            </Page>
        </Document>
    );
};



const LaporanPerKategori = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${api}/owner/komisi/kategori`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.data.status) {
                    setData(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <Card className="w-full min-h-screen bg-white/90 backdrop-blur-md p-6 items-center flex justify-center">
                <PulseLoader size={15} color="#61d52c" />
            </Card>
        );
    }

    return (
        <div style={{ height: '100vh' }}>
            <PDFViewer style={{ width: '100%', height: '100%' }}>
                <PDFDocument data={data} />
            </PDFViewer>
        </div>
    );
};

export default LaporanPerKategori;
