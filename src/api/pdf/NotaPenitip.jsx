import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';


const NotaPenitip = ({ data }) => {
    const total = {
        harga_jual: 0,
        bonus: 0,
        pendapatan: 0,
    };

    data.barang.forEach((b) => {
        total.harga_jual += b.harga_jual;
        total.bonus += b.bonus_penitip;
        total.pendapatan += b.pendapatan;
    });

    const styles = StyleSheet.create({
        page: {
            padding: 10,
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
        headerLaporan: {
            fontSize: 12,
            marginBottom: 5,
            fontWeight: 'bold',
            textDecoration: 'underline',
        },
        table: {
            display: 'table',
            width: '100%',
            marginVertical: 10,
            borderStyle: 'solid',
            borderWidth: 1,
            borderRightWidth: 0,
            borderBottomWidth: 0,
        },
        tableRow: {
            flexDirection: 'row',
        },
        tableCell: {
            borderStyle: 'solid',
            borderWidth: 1,
            borderLeftWidth: 0,
            borderTopWidth: 0,
            padding: 5,
            fontSize: 10,
            flex: 1,
            textAlign: 'center',
        },
        headerCell: {
            fontWeight: 'bold',
            textAlign: 'center',
        },
        cellKode: { flex: 0.5 },
        cellNama: { flex: 1.5 },
        cellTanggal: { flex: 1 },
        cellHarga: { flex: 1 },
        cellBonus: { flex: 1 },
        cellPendapatan: { flex: 1 },
        cellTotal: {
            flex: 4.5,
            textAlign: 'right',
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
            day: 'numeric',
            month: 'numeric',
            year: 'numeric'
        });
    };

    const formatNumber = (number) => {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.section}>
                    <Text style={styles.bold}>ReUse Mart</Text>
                    <Text style={styles.text}>Jl. Green Eco Park No. 456 Yogyakarta</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.headerLaporan}>LAPORAN TRANSAKSI PENITIP</Text>
                    <Text style={styles.text}>ID Penitip : T{data.id_penitip}</Text>
                    <Text style={styles.text}>Nama Penitip : {data.nama_penitip}</Text>
                    <Text style={styles.text}>Bulan : {new Date().toLocaleString('id-ID', { month: 'long' })}</Text>
                    <Text style={styles.text}>Tahun : {new Date().getFullYear()}</Text>
                    <Text style={styles.text}>Tanggal Cetak : {new Date().toLocaleString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</Text>
                </View>

                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        {[
                            { text: 'Kode Produk', style: styles.cellKode },
                            { text: 'Nama Produk', style: styles.cellNama },
                            { text: 'Tanggal Masuk', style: styles.cellTanggal },
                            { text: 'Tanggal Laku', style: styles.cellTanggal },
                            { text: 'Harga Jual Bersih (sudah dipotong Komisi)', style: styles.cellHarga },
                            { text: 'Bonus terjual cepat', style: styles.cellBonus },
                            { text: 'Pendapatan', style: styles.cellPendapatan },
                        ].map((item, i) => (
                            <Text key={i} style={[styles.tableCell, styles.headerCell, item.style]}>
                                {item.text}
                            </Text>
                        ))}
                    </View>

                    {data.barang.map((item, index) => (
                        <View style={styles.tableRow} key={index}>
                            <Text style={[styles.tableCell, styles.cellKode]}>K{item.id_barang}</Text>
                            <Text style={[styles.tableCell, styles.cellNama]}>{item.nama_barang}</Text>
                            <Text style={[styles.tableCell, styles.cellTanggal]}>{formatDate(item.tanggal_masuk)}</Text>
                            <Text style={[styles.tableCell, styles.cellTanggal]}>{formatDate(item.tanggal_laku)}</Text>
                            <Text style={[styles.tableCell, styles.cellHarga]}>{formatNumber(item.harga_jual)}</Text>
                            <Text style={[styles.tableCell, styles.cellBonus]}>{formatNumber(item.bonus_penitip)}</Text>
                            <Text style={[styles.tableCell, styles.cellPendapatan]}>{formatNumber(item.pendapatan)}</Text>
                        </View>
                    ))}

                    {/* TOTAL */}
                    <View style={styles.tableRow}>
                        <Text style={[styles.tableCell, styles.cellTotal]}>TOTAL</Text>
                        <Text style={[styles.tableCell, styles.cellHarga]}>{formatNumber(total.harga_jual)}</Text>
                        <Text style={[styles.tableCell, styles.cellBonus]}>{formatNumber(total.bonus)}</Text>
                        <Text style={[styles.tableCell, styles.cellPendapatan]}>{formatNumber(total.pendapatan)}</Text>
                    </View>
                </View>
            </Page>
        </Document>
    )
}

export default NotaPenitip;