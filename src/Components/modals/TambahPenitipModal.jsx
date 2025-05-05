import React, { useEffect, useState } from 'react';
import {
    Modal, ModalBody, ModalHeader,
    Button, Label, TextInput, FileInput
} from 'flowbite-react';
import api from '../../routes/api';
import { PulseLoader } from 'react-spinners';
import axios from 'axios';

const TambahPenitipModal = ({ show, onClose, }) => {
    const [email, setEmail] = useState("");
    const [namaPenitip, setNamaPenitip] = useState("");
    const [noKTP, setNoKTP] = useState("");
    const [noTelp, setNoTelp] = useState("");
    const [password, setPassword] = useState("");
    const [fotoKTP, setFotoKTP] = useState("");
    const [fotoFile, setFotoFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!show) {
            setError("");
            setFotoKTP(`https://png.pngtree.com/png-clipart/20230527/original/pngtree-indonesian-identity-card-illustration-png-image_9171687.png`);        }
    }, [show]);

    useEffect(() => {
        setFotoKTP(`https://png.pngtree.com/png-clipart/20230527/original/pngtree-indonesian-identity-card-illustration-png-image_9171687.png`);
        setFotoFile(null);
    },[]);

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
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const formData = new FormData();
            formData.append('email', email);
            formData.append('nama_penitip', namaPenitip);
            formData.append('no_ktp', noKTP);
            formData.append('no_telp', noTelp);
            formData.append('password', password);
            if (fotoFile) {
                formData.append('foto_ktp', fotoFile);
            }

            const token = localStorage.getItem('token');
            const response = await axios.post(`${api}/cs/addpenitip`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            onClose();
            window.alert("Penitip berhasil ditambah");
            window.location.reload();
        } catch (error) {
            setError(error. response.data.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal dismissible show={show} onClose={onClose} className='modal-backdrop'>
            <ModalHeader>
               Tambah Penitip
            </ModalHeader>
            <ModalBody>
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <div>
                        <Label htmlFor="foto-ktp">Foto KTP</Label>
                        {fotoKTP && (
                            <img
                                src={fotoKTP}
                                alt="Foto KTP"
                                className="w-60 h-60 object-contain mb-2 mx-auto"
                            />
                        )}
                        <FileInput id="foto-ktp" accept="image/*" onChange={handleImageChange} />
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
                        <Label htmlFor="password">Password Penitip</Label>
                        <TextInput
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
                        <Label htmlFor="notelp">Nomor Telepon</Label>
                        <TextInput
                            id="notelp"
                            type="text"
                            value={noTelp}
                            onChange={(e) => setNoTelp(e.target.value)}
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
                            {loading ? <PulseLoader size={8} color="#ffffff" /> : 'Tambah'}
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

export default TambahPenitipModal;
