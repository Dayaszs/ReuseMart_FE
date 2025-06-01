import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';


const LaporanDonasi = ({ data }) => {

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
        cellIdPenitip: { flex: 1 },
        cellNamaPenitip: { flex: 1 },
        cellTanggalDonasi: { flex: 1 },
        cellOrganisasi: { flex: 1 },
        cellNamaPenerima: { flex: 1 },
    });

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.section}>
                    <Text style={styles.bold}>ReUse Mart</Text>
                    <Text style={styles.text}>Jl. Green Eco Park No. 456 Yogyakarta</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.headerLaporan}>LAPORAN DONASI BARANG</Text>
                    <Text style={styles.text}>Tahun : {new Date().getFullYear()}</Text>
                    <Text style={styles.text}>Tanggal Cetak : {new Date().toLocaleString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</Text>
                </View>

                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        {[
                            { text: 'Kode Produk', style: styles.cellKode },
                            { text: 'Nama Produk', style: styles.cellNama },
                            { text: 'Id Penitip', style: styles.cellIdPenitip },
                            { text: 'Nama Penitip', style: styles.cellNamaPenitip },
                            { text: 'Tanggal Donasi', style: styles.cellTanggalDonasi },
                            { text: 'Organisasi', style: styles.cellOrganisasi },
                            { text: 'Nama Penerima', style: styles.cellNamaPenerima },
                        ].map((item, i) => (
                            <Text key={i} style={[styles.tableCell, styles.headerCell, item.style]}>
                                {item.text}
                            </Text>
                        ))}
                    </View>

                    {data?.flatMap((donasi) =>
                        donasi.barang?.map((item, index) => (
                            <View style={styles.tableRow} key={`${donasi.id_request_donasi}-${index}`}>
                                <Text style={[styles.tableCell, styles.cellKode]}>K{item.id_barang}</Text>
                                <Text style={[styles.tableCell, styles.cellNama]}>{item.nama_barang}</Text>
                                <Text style={[styles.tableCell, styles.cellIdPenitip]}>T{item.id_penitip}</Text>
                                <Text style={[styles.tableCell, styles.cellNamaPenitip]}>{item.nama_penitip}</Text>
                                <Text style={[styles.tableCell, styles.cellTanggalDonasi]}>{formatDate(item.tanggal_donasi)}</Text>
                                <Text style={[styles.tableCell, styles.cellOrganisasi]}>{item.organisasi}</Text>
                                <Text style={[styles.tableCell, styles.cellNamaPenerima]}>{item.nama_penerima}</Text>
                            </View>
                        ))
                    )}
                </View>
            </Page>
        </Document>
    )
}

export default LaporanDonasi;