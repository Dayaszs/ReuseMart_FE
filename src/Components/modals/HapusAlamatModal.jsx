import React, { useState, useEffect } from "react";
import { Modal, ModalBody, ModalHeader, Button, Alert } from "flowbite-react";
import { PulseLoader } from "react-spinners";

const HapusAlamatModal = ({ show, onClose, deleteAlamat, alamatId }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (show) {
            setSuccess(false);
            setError("");
            setLoading(false);
        }
    }, [show]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess(false);

        try {
            await deleteAlamat(alamatId);
            setSuccess(true);
            setTimeout(() => {
                onClose();
            }, 1500);
        } catch (err) {
            setError(err.message || "Failed to delete alamat. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal dismissible show={show} onClose={onClose} className="modal-backfrop">
            <ModalHeader>Hapus Alamat</ModalHeader>
            <ModalBody>
                {error && <Alert color="red">{error}</Alert>}
                {success
                    ? (
                        <Alert color="green">Alamat berhasil dihapus!</Alert>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <p>Apakah Anda yakin ingin menghapus alamat ini?</p>
                            <div className="flex justify-end mt-4">
                                <Button type="button" onClick={onClose} className="mr-2">
                                    Batal
                                </Button>
                                <Button type="submit" disabled={loading} color="red">
                                    {loading ? (
                                        <>
                                            <PulseLoader size={6} color="#fff" className="ml-2" />
                                        </>
                                    ) : (
                                        "Hapus"
                                    )}
                                </Button>
                            </div>
                        </form>
                    )}

            </ModalBody>
        </Modal>
    );
};

export default HapusAlamatModal;