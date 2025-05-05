import React, { useState, useEffect } from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader, Button, Alert } from "flowbite-react";
import { PulseLoader } from "react-spinners";

const HapusOrganisasiModal = ({ show, onClose, deleteOrganisasi, organisasiId }) => {
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
            await deleteOrganisasi(organisasiId);
            setSuccess(true);
            setTimeout(() => {
                onClose();
            }, 1000);
        } catch (err) {
            setError(err.message || "Failed to delete organisasi. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal dismissible show={show} onClose={onClose} className="modal-backfrop">
            <ModalHeader>Hapus Organisasi</ModalHeader>
            <ModalBody>
                {error && <Alert color="red">{error}</Alert>}
                {success && <Alert color="green">Organisasi berhasil dihapus!</Alert>}
                <form onSubmit={handleSubmit}>
                    <p>Apakah Anda yakin ingin menghapus organisasi ini?</p>
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
            </ModalBody>
        </Modal>
    );
};

export default HapusOrganisasiModal;