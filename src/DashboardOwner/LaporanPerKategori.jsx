import React, { useEffect, useState } from 'react';
import { Document, Page, Text, View, StyleSheet, PDFViewer } from '@react-pdf/renderer';
import axios from 'axios';
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
    // Get current date and format it
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    return (
        <Document>
            <Page size="A4" orientation="landscape" style={styles.page}>
                <View style={styles.header}>
                    <Text style={styles.companyName}>ReUse Mart</Text>
                    <Text style={styles.companyAddress}>Jl. Green Eco Park No. 456 Yogyakarta</Text>
                    <Text style={styles.reportTitle}>LAPORAN BARANG PER KATEGORI</Text>
                    <Text style={styles.reportInfo}>Tahun: {currentDate.getFullYear()}</Text>
                    <Text style={styles.reportInfo}>Tanggal cetak: {formattedDate}</Text>
                </View>
                <View style={styles.table}>
                    <View style={[styles.tableRow, styles.tableHeader]}>
                        <Text style={styles.tableCell}>Kode Produk</Text>
                        <Text style={styles.tableCell}>Nama Produk</Text>
                        <Text style={styles.tableCell}>Id Penitip</Text>
                        <Text style={styles.tableCell}>Nama Penitip</Text>
                        <Text style={styles.tableCell}>Tanggal Masuk</Text>
                        <Text style={styles.tableCell}>Tanggal Akhir Batas</Text>
                        <Text style={styles.tableCell}>Batas Ambil</Text>
                    </View>
                    {data.map((item, index) => (
                        <View key={index} style={styles.tableRow}>
                            <Text style={styles.tableCell}>{item.id_barang}</Text>
                            <Text style={styles.tableCell}>{item.nama_barang}</Text>
                            <Text style={styles.tableCell}>{item.rincian_penitipan.penitipan.id_penitip}</Text>
                            <Text style={styles.tableCell}>{item.rincian_penitipan.penitipan.penitip.nama_penitip}</Text>
                            <Text style={styles.tableCell}>
                                {new Date(item.rincian_penitipan.penitipan.tanggal_masuk).toLocaleDateString('id-ID')}
                            </Text>
                            <Text style={styles.tableCell}>
                                {new Date(item.rincian_penitipan.tanggal_selesai).toLocaleDateString('id-ID')}
                            </Text>
                            <Text style={styles.tableCell}>
                                {new Date(item.rincian_penitipan.batas_ambil).toLocaleDateString('id-ID')}
                            </Text>
                        </View>
                    ))}
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
                const response = await axios.get(`${api}/owner/barang/titipan-habis`, {
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
        return <div>Loading...</div>;
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
