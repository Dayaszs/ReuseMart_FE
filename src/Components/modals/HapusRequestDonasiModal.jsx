import React, { useState } from "react";
import { Modal, ModalBody, ModalHeader, Button, Toast} from "flowbite-react";
import { PulseLoader } from "react-spinners";
import api from "../../routes/api";
import axios from "axios";
import { Check } from 'lucide-react';

const HapusRequestDonasiModal = ({ show, onClose, requestDonasi }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showToast, setShowToast] = useState(false);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${api}/organisasi/deleterequestdonasi/${requestDonasi.id_request_donasi}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            onClose();
            setShowToast(true);
            setTimeout(() => {
                setShowToast(false);
                window.location.reload();
            }, 2000);
        } catch (error) {
            setError("Gagal Menghapus Request Donasi");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
        <Modal dismissible show={show} onClose={onClose} className="modal-backdrop">
            <ModalHeader>Hapus Request Donasi</ModalHeader>
            <ModalBody>
                <form onSubmit={handleSubmit}>
                    <p>Apakah Anda yakin ingin menghapus request donasi <strong></strong>?</p>
                    {error && <p className="text-red-600 font-semibold mt-2">{error}</p>}
                    <div className="flex justify-end gap-2 mt-4">

                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-red-500 hover:bg-red-600 text-white"
                        >
                            {loading ? <PulseLoader size={8} color="#ffffff" /> : 'Hapus'}
                        </Button>
                        <Button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-700 hover:bg-gray-600 text-white"
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

export default HapusRequestDonasiModal;
