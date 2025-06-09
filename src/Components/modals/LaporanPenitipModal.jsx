import React, { useEffect, useState } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Label, Alert } from "flowbite-react";
import { PulseLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';


const LaporanPenitipModal = ({ show, onClose, penitipData }) => {
    const navigate = useNavigate();
    const [bulan, setBulan] = useState("");
    const [tahun, setTahun] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!show) {
            setError("");
            setBulan("");
            setTahun("");
        }
    }, [show]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!bulan) {
            setError("Pilih bulan terlebih dahulu");
            return;
        }
        if (!tahun) {
            setError("Pilih tahun terlebih dahulu");
            return;
        }
        setLoading(true);
        setError("");

        try {
            navigate('/laporan-penitip', { state: { data: penitipData, bulan: bulan, tahun: tahun } });
        } catch (err) {
            setError("Gagal navigasi ke laporan. Coba lagi.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            show={show}
            onClose={onClose}
        >
            <ModalHeader>
                Laporan Transaksi Penitip <strong>{penitipData?.nama_penitip}</strong>
            </ModalHeader>
            <ModalBody>
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <div>
                        <Label htmlFor="bulan">Pilih Bulan</Label>
                        <select
                            id="bulan"
                            value={bulan}
                            onChange={(e) => {
                                setBulan(e.target.value);
                            }}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                            required
                        >
                            <option value="">Pilih Bulan</option>
                            <option value="01">Januari</option>
                            <option value="02">Februari</option>
                            <option value="03">Maret</option>
                            <option value="04">April</option>
                            <option value="05">Mei</option>
                            <option value="06">Juni</option>
                            <option value="07">Juli</option>
                            <option value="08">Agustus</option>
                            <option value="09">September</option>
                            <option value="10">Oktober</option>
                            <option value="11">November</option>
                            <option value="12">Desember</option>
                        </select>
                    </div>

                    <div>
                        <Label htmlFor="tahun">Pilih Tahun</Label>
                        <select
                            id="tahun"
                            value={tahun}
                            onChange={(e) => {
                                setTahun(e.target.value);
                            }}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                            required
                        >
                            <option value="">Pilih Tahun</option>
                            <option value="2025">2025</option>
                            <option value="2024">2024</option>
                            <option value="2023">2023</option>
                            <option value="2022">2022</option>
                        </select>
                    </div>

                    {error && <Alert color="failure">{error}</Alert>}

                    <div className="flex justify-end gap-2 mt-4">

                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-green-500 hover:bg-green-600 hover:cursor-pointer text-white"
                        >
                            {loading ? <PulseLoader size={8} color="#ffffff" /> : 'Lihat Laporan'}
                        </Button>

                        <Button
                            type="button"
                            onClick={onClose}
                            className="bg-red-500 hover:bg-red-600 hover:cursor-pointer text-white"
                        >
                            Batal
                        </Button>

                    </div>
                </form>
            </ModalBody>
        </Modal>
    );
};

export default LaporanPenitipModal;
