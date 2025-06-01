import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';


const LaporanRequestDonasi = ({ data }) => {

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
            textAlign: 'left',
        },
        headerCell: {
            fontWeight: 'bold',
            textAlign: 'left',
        },
        cellId: { flex: 0.5 },
        cellNama: { flex: 1 },
        cellAlamat: { flex: 1 },
        cellRequest: { flex: 2 },
    });

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.section}>
                    <Text style={styles.bold}>ReUse Mart</Text>
                    <Text style={styles.text}>Jl. Green Eco Park No. 456 Yogyakarta</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.headerLaporan}>LAPORAN REQUEST DONASI</Text>
                    <Text style={styles.text}>Tanggal Cetak : {new Date().toLocaleString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</Text>
                </View>

                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        {[
                            { text: 'ID Organisasi', style: styles.cellId },
                            { text: 'Nama', style: styles.cellNama },
                            { text: 'Alamat', style: styles.cellAlamat },
                            { text: 'Request', style: styles.cellRequest },
                        ].map((item, i) => (
                            <Text key={i} style={[styles.tableCell, styles.headerCell, item.style]}>
                                {item.text}
                            </Text>
                        ))}
                    </View>

                    {data?.flatMap((donasi) =>
                        donasi.barang?.map((item, index) => (
                            <View style={styles.tableRow} key={`${donasi.id_request_donasi}-${index}`}>
                                <Text style={[styles.tableCell, styles.cellId]}>ORG{item.id_organisasi}</Text>
                                <Text style={[styles.tableCell, styles.cellNama]}>{item.organisasi}</Text>
                                <Text style={[styles.tableCell, styles.cellAlamat]}>{item.alamat_organisasi}</Text>
                                <Text style={[styles.tableCell, styles.cellRequest]}>{item.request}</Text>
                            </View>
                        ))
                    )}
                </View>
            </Page>
        </Document>
    )
}

export default LaporanRequestDonasi;