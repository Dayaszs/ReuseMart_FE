import React, { useState } from "react";
import { Modal, ModalBody, ModalHeader, Button, } from "flowbite-react";
import { PulseLoader } from "react-spinners";
import api from "../../routes/api";
import axios from "axios";

const HapusPenitipModal = ({ show, onClose, penitipData }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${api}/cs/deletepenitip/${penitipData.id_penitip}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            onClose();
            window.alert("Penitip berhasil dihapus");
            window.location.reload();
        } catch (err) {
            setError("Gagal Menghapus Penitip");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal dismissible show={show} onClose={onClose} className="modal-backdrop">
            <ModalHeader>Hapus Penitip</ModalHeader>
            <ModalBody>
                <form onSubmit={handleSubmit}>
                    <p>Apakah Anda yakin ingin menghapus penitip <strong>{penitipData?.nama_penitip}</strong>?</p>
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
    );
};

export default HapusPenitipModal;
