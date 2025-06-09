import React, { useEffect, useState } from 'react';
import { Document, Page, Text, View, StyleSheet, PDFViewer } from '@react-pdf/renderer';
import axios from 'axios';
import { PulseLoader } from 'react-spinners';
import { Card } from "flowbite-react";
import { laporanPenjualanBulanan } from '@/api/services/apiOwner';
import { useLocation } from 'react-router-dom';

const LaporanPenjualanBulanan = () => {
    const location = useLocation();
    const [ data, setData ] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tahunPilihan, setTahunPilihan] = useState();

    const fetchData = async(tahun) => {
        setLoading(true);

        laporanPenjualanBulanan(tahun)
        .then((res) => {
            console.log(res.data.data);
            setData(res.data.data);
        })
        .catch((err) => {
            setError(err.message || "Gagal mengambil data.");
        })
        .finally(() => setLoading(false));
    };

    useEffect(() => {
        const tahunDariState = location.state?.tahun;
        // console.log("Tahun dari state:", tahunDariState);
        // if (tahunDariState) {
        //     setTahunPilihan(tahunDariState);
            fetchData(tahunDariState);
        // } else {
        //     fetchData(new Date().getFullYear()); // Default ke tahun sekarang jika tidak ada dari state
        // }
    },[location.state]);

    if (loading) {
        return (
            <Card className="w-full min-h-screen bg-white/90 backdrop-blur-md p-6 items-center flex justify-center">
                <PulseLoader size={15} color="#61d52c" />
            </Card>
        );
    }

    if (error) {
        return (
            <Card className="w-full min-h-screen bg-white/90 backdrop-blur-md p-6 items-center flex justify-center">
                <Text>Error: {error}</Text>
            </Card>
        );
    }

    return(
        <div style={{ height: '100vh' }}>
            <PDFViewer style={{ width: '100%', height: '100%' }}>
                <PDFDocument data={data} tahun={tahunPilihan} />
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

const PDFDocument = ({ data}) => {
    const currentDate = new Date();

    const formatNumber = (number) => {
        return number.toLocaleString('id-ID');
    };

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
                    <Text style={[styles.reportTitle, { textDecoration: 'underline' }]}>Laporan Penjualan Bulanan</Text>
                    <Text style={styles.reportInfo}>Tahun : {data.tahun}</Text>
                    <Text style={styles.reportInfo}>Tanggal cetak: {formattedDate}</Text>
                </View>
                <View style={styles.table}>
                    <View style={[styles.tableRow, styles.tableHeader]}>
                        <Text style={styles.tableCell}>Bulan</Text>
                        <Text style={styles.tableCell}>Jumlah Barang Terjual</Text>
                        <Text style={styles.tableCell}>Jumlah Penjualan Kotor</Text>
                    </View>
                    {data.penghasilan_bulanan.map((item, index) => (
                        <View key={index} style={styles.tableRow}>
                            <Text style={styles.tableCell}>{item.bulan}</Text>
                            <Text style={styles.tableCell}>{item.jumlah_barang}</Text>
                            <Text style={styles.tableCell}>{formatNumber(parseInt(item.total_penghasilan))}</Text>
                        </View>
                    ))}
                    <View style={styles.tableRow}>
                        <Text style={[styles.tableCell, {flex : 2.05}]}>Total</Text>
                        <Text style={[styles.tableCell]}>{formatNumber(parseInt(data.total_tahunan))}</Text>
                    </View>
                </View>

            <View style={{ marginTop: 20 }}>
                <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 10, marginTop: 75 }}>Grafik Penjualan Bulanan</Text>
                <View style={{ 
                    height: 250, 
                    borderWidth: 1, 
                    borderColor: '#bfbfbf', 
                    padding: 15,
                    position: 'relative'
                }}>
                    <View style={{ 
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: 40,
                        justifyContent: 'space-between',
                        paddingVertical: 10
                    }}>
                        {(() => {
                            const maxValue = Math.max(...data.penghasilan_bulanan.map(i => parseInt(i.total_penghasilan)));
                            const safeMaxValue = maxValue === 0 ? 1 : maxValue; // Ensure maxValue is not zero
                            const step = Math.ceil(safeMaxValue / 4);
                            return [maxValue, step * 3, step * 2, step, 0].map((value, index) => (
                                <Text key={index} style={{ 
                                    fontSize: 8,
                                    color: '#666',
                                    textAlign: 'right',
                                    paddingRight: 5
                                }}>
                                    {formatNumber(value)}
                                </Text>
                            ));
                        })()}
                    </View>

                    <View style={{ 
                        marginLeft: 45,
                        height: '100%',
                        position: 'relative'
                    }}>
                        {(() => {
                            const maxValue = Math.max(...data.penghasilan_bulanan.map(i => parseInt(i.total_penghasilan)));
                            const safeMaxValue = maxValue === 0 ? 1 : maxValue; // Ensure maxValue is not zero
                            const step = Math.ceil(safeMaxValue / 4);
                            return [0, step, step * 2, step * 3, maxValue].map((value, index) => (
                                <View key={index} style={{
                                    position: 'absolute',
                                    left: 0,
                                    right: 0,
                                    top: `${(1 - (value / safeMaxValue)) * 100}%`,
                                    height: 1,
                                    backgroundColor: '#e0e0e0',
                                    zIndex: 1
                                }} />
                            ));
                        })()}

                        {data.penghasilan_bulanan && data.penghasilan_bulanan.map((item, index) => {
                            const maxValue = Math.max(...data.penghasilan_bulanan.map(i => parseInt(i.total_penghasilan)));
                            const safeMaxValue = maxValue === 0 ? 1 : maxValue; // Ensure maxValue is not zero
                            const barHeight = (parseInt(item.total_penghasilan) / safeMaxValue) * 180;
                            const barWidth = `${(80 / data.penghasilan_bulanan.length)}%`;
                            const barSpacing = `${(20 / data.penghasilan_bulanan.length)}%`;
                            
                            return (
                                <View key={index} style={{ 
                                    position: 'absolute',
                                    bottom: 0,
                                    left: `calc(${(index * 100 / data.penghasilan_bulanan.length)}% + ${barSpacing})`,
                                    width: barWidth,
                                    height: barHeight,
                                    backgroundColor: '#8CCDEB',
                                    borderTopLeftRadius: 4,
                                    borderTopRightRadius: 4,
                                    zIndex: 2
                                }}>
                                    <Text style={{ 
                                        position: 'absolute',
                                        top: -20,
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        fontSize: 8,
                                        textAlign: 'center',
                                        width: 60,
                                        color: '#333'
                                    }}>
                                        {formatNumber(parseInt(item.total_penghasilan))}
                                    </Text>
                                </View>
                            );
                        })}
                    </View>
                </View>
                <View style={{ 
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 5,
                    marginLeft: 45,
                    paddingRight: 15
                }}>
                    {data.penghasilan_bulanan && data.penghasilan_bulanan.map((item, index) => (
                        <Text key={index} style={{ 
                            fontSize: 8,
                            width: `${80 / data.penghasilan_bulanan.length}%`,
                            textAlign: 'center',
                            color: '#666'
                        }}>
                            {item.bulan}
                        </Text>
                    ))}
                </View>
            </View>
            </Page>
        </Document>
    );
};

export default LaporanPenjualanBulanan;