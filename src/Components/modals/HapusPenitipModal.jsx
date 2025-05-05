import React, { useState } from "react";
import { Modal, Button, Alert } from "flowbite-react";
import { PulseLoader } from "react-spinners";
import api from "../../routes/api";
import axios from "axios";

const HapusPenitipModal = ({show, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess(false);

        try {
            // Simulate API call to delete penitip
            await new Promise((resolve) => setTimeout(resolve, 2000));
            setSuccess(true);
            onClose(); // Close the modal after successful deletion
        } catch (err) {
            setError("Failed to delete penitip. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal dismissible show={show} onClose={onClose}>
            <Modal.Header>Hapus Penitip</Modal.Header>
            <Modal.Body>
                {error && <Alert color="red">{error}</Alert>}
                {success && <Alert color="green">Penitip berhasil dihapus!</Alert>}
                <form onSubmit={handleSubmit}>
                    <p>Apakah Anda yakin ingin menghapus penitip ini?</p>
                    <div className="flex justify-end mt-4">
                        <Button type="button" onClick={onClose} className="mr-2">Batal</Button>
                        <Button type="submit" disabled={loading} color="red">
                            {loading ? "Menghapus..." : "Hapus"}
                        </Button>
                    </div>
                </form>
            </Modal.Body>
        </Modal>
    );
};
export default HapusPenitipModal;