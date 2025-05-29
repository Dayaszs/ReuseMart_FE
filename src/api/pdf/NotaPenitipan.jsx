import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';


const NotaPenitipan = ({ data }) => {
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
        sectionFlex: {
            flexDirection: 'row',
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
        },
        sectionPenitp: {
            flexDirection: 'row',
            display: 'flex',
            justifyContent: 'flex-start',
            // width: '100%',
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

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            month: 'long',
            year: 'numeric'
        });
    };

    const formatNumber = (number) => {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    return(
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.section}>
                    <Text style={styles.bold}>ReUse Mart</Text>
                    <Text style={styles.text}>Jl. Green Eco Park No. 456 Yogyakarta</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.text}>No Nota               : {data.no_nota}</Text>
                    <Text style={styles.text}>Tanggal penitipan     : {formatDatePDF(data.tanggal_masuk)}</Text>
                    <Text style={styles.text}>Masa Penitipan sampai : {formatDatePDF(data.rincian_penitipan[0].batas_ambil)}</Text>
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionPenitp}>
                        <Text style={styles.bold}>Penitip     : </Text>
                        <Text style={styles.text}>T{data.penitip.id_penitip}/{data.penitip.nama_penitip}</Text>
                    </View>
                    <Text style={styles.text}>Alamat      : {data.penitip.alamat}</Text>
                    {/* <Text style={styles.text}>Pegawai QC  : {}</Text> */}
                </View>

                {data.rincian_penitipan?.map((item, index) => (
                    <View style={styles.section}>
                        <View style={styles.sectionFlex}>
                            <Text style={styles.text}>{item.barang.nama_barang}</Text>
                            <Text style={styles.text}>{formatNumber(parseInt(item.barang.harga))}</Text>
                        </View>
                        {item.barang.tanggal_garansi_habis?
                            (
                                <Text style={styles.text}>Garansi ON {formatDate(item.barang.tanggal_garansi_habis)}</Text>
                            )
                            :
                            (
                                <Text style={styles.text}></Text>
                            )
                        }
                        <Text style={styles.text}>Berat barang : {item.barang.berat} kg</Text>
                    </View>
                ))}

                <View style={styles.section}>
                    <Text style={styles.text}>Diterima dan QC oleh : P{data.pegawai.id_pegawai} - {data.pegawai.nama}</Text>
                </View>
            </Page>
        </Document>
    )
}

export default NotaPenitipan;