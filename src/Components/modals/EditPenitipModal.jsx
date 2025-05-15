import React, { useEffect, useState } from 'react';
import {
    Modal, ModalBody, ModalHeader,
    Button, Label, TextInput, FileInput
} from 'flowbite-react';
import api from '../../routes/api';
import storage from '../../routes/storage';
import { PulseLoader } from 'react-spinners';
import axios from 'axios';
import { getGambarKTP } from '@/api';

const EditPenitipModal = ({ show, onClose, penitipData }) => {
    const [email, setEmail] = useState("");
    const [namaPenitip, setNamaPenitip] = useState("");
    const [noKTP, setNoKTP] = useState("");
    const [alamat, setAlamat] = useState("");
    const [noTelp, setNoTelp] = useState("");
    const [saldo, setSaldo] = useState("");
    const [poin, setPoin] = useState(0);
    const [fotoKTP, setFotoKTP] = useState("");
    const [fotoFile, setFotoFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!show) {
            setError("");
        }
    }, [show]);

    useEffect(() => {
        if (penitipData) {
            setEmail(penitipData.email || "");
            setNamaPenitip(penitipData.nama_penitip || "");
            setNoKTP(penitipData.no_ktp || "");
            setAlamat(penitipData.alamat || "");
            setNoTelp(penitipData.no_telp || "");
            setSaldo(penitipData.saldo || "");
            setPoin(penitipData.poin || 0);
            setFotoKTP(penitipData.foto_ktp ? getGambarKTP(penitipData.foto_ktp) : "");
            setFotoFile(null);
        }
    }, [penitipData]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFotoFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setFotoKTP(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        window.confirm("Apakah anda yakin ingin mengedit penitip?");
        if (!window.confirm) {
            return;
        }
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const formData = new FormData();
            formData.append('email', email);
            formData.append('nama_penitip', namaPenitip);
            formData.append('no_ktp', noKTP);
            formData.append('alamat', alamat);
            formData.append('no_telp', noTelp);
            formData.append('saldo', saldo);
            formData.append('poin', poin);
            if (fotoFile) {
                formData.append('foto_ktp', fotoFile);
            }

            const token = localStorage.getItem('token');
            const response = await axios.post(`${api}/cs/editpenitip/${penitipData.id_penitip}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            onClose();
            window.alert("Penitip berhasil diedit");
            window.location.reload();
        } catch (error) {
            setError(error.response.data.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal dismissible show={show} onClose={onClose} className='modal-backdrop'>
            <ModalHeader>
                Edit Penitip <strong>{penitipData?.nama_penitip}</strong>
            </ModalHeader>
            <ModalBody>
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <div>
                        <Label htmlFor="foto-ktp">Foto KTP Ukuran Max 2MB</Label>
                        {fotoKTP && (
                            <img
                                src={fotoKTP}
                                alt="Foto KTP"
                                className="w-60 h-60 object-contain mb-2 mx-auto"
                            />
                        )}
                        <FileInput id="foto-ktp" accept="image/*" onChange={handleImageChange}
                            className='className="block w-full text-sm text-gray-900 border rounded-lg cursor-pointer bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-green-500 file:text-white hover:file:bg-green-600 transition"' />
                    </div>

                    <div>
                        <Label htmlFor="email">Email Penitip</Label>
                        <TextInput
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="nama">Nama Penitip</Label>
                        <TextInput
                            id="nama"
                            type="text"
                            value={namaPenitip}
                            onChange={(e) => setNamaPenitip(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="noktp">Nomor KTP</Label>
                        <TextInput
                            id="noktp"
                            type="text"
                            value={noKTP}
                            onChange={(e) => setNoKTP(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="alamat">Alamat</Label>
                        <TextInput
                            id="alamat"
                            type="text"
                            value={alamat}
                            onChange={(e) => setAlamat(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="notelp">Nomor Telepon</Label>
                        <TextInput
                            id="notelp"
                            type="text"
                            value={noTelp}
                            onChange={(e) => setNoTelp(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="saldo">Saldo</Label>
                        <TextInput
                            id="saldo"
                            type="number"
                            step="0.01"
                            value={saldo}
                            onChange={(e) => setSaldo(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="poin">Poin</Label>
                        <TextInput
                            id="poin"
                            type="number"
                            value={poin}
                            onChange={(e) => setPoin(Number(e.target.value))}
                            required
                        />
                    </div>

                    {error && <p className="text-red-600 font-semibold">{error}</p>}

                    <div className="flex justify-end gap-2 mt-4">

                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-green-500 hover:bg-green-600 text-white"
                        >
                            {loading ? <PulseLoader size={8} color="#ffffff" /> : 'Simpan'}
                        </Button>

                        <Button
                            type="button"
                            onClick={onClose}
                            className="bg-red-500 hover:bg-red-600 text-white"
                        >
                            Batal
                        </Button>


                    </div>
                </form>
            </ModalBody>
        </Modal>
    );
};

export default EditPenitipModal;
