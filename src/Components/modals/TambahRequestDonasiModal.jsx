import React, { useEffect, useState } from 'react';
import {
    Modal, ModalBody, ModalHeader,
    Button, Label, TextInput, Toast
} from 'flowbite-react';
import api from '../../routes/api';
import { PulseLoader } from 'react-spinners';
import axios from 'axios';
import { Check } from 'lucide-react';

const TambahRequestDonasiModal = ({ show, onClose, organisasiID}) => {
    const [deskripsi,  setDeskripsi] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showToast, setShowToast] = useState(false);

    
    useEffect(() => {
        if (!show) {
            setError("");
            setDeskripsi("");
        }
    }, [show]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const formData = new FormData();
            formData.append('deskripsi', deskripsi);
            formData.append('id_organisasi', organisasiID);

            const token = localStorage.getItem('token');
            const response = await axios.post(`${api}/organisasi/addrequestdonasi`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            onClose();
            setShowToast(true);
            setTimeout(() => {
                setShowToast(false);
                window.location.reload();
            }, 2000);
            
        } catch (error) {
            setError(error.response.data.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
        <Modal dismissible show={show} onClose={onClose}>
            <ModalHeader>
               Tambah Request Donasi
            </ModalHeader>
            <ModalBody>
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <div>
                        <Label htmlFor="deskripsi">Deskripsi request</Label>
                        <TextInput
                            id="deskripsi"
                            type="text"
                            value={deskripsi}
                            onChange={(e) => setDeskripsi(e.target.value)}
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
        {showToast && (
            <div className="fixed top-5 right-5 z-100">
                <Toast className="bg-green-500 text-white">
                    <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500">
                        <Check color="#00b315" />
                    </div>
                    <div className="ml-3 text-sm font-normal">Request donasi berhasil ditambahkan</div>
                </Toast>
            </div>
        )}
    </>
    );
};

export default TambahRequestDonasiModal;
