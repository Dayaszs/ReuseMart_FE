import React, { useEffect, useState } from 'react';
import {
    Modal, ModalBody, ModalHeader,
    Button, Label, TextInput, FileInput
} from 'flowbite-react';
import { PulseLoader } from 'react-spinners';
import { getProfilePicture } from '@/api';


const EditOrganisasiModal = ({ show, onClose, organisasiData, updateOrganisasi }) => {
    const [namaOrganisasi, setNamaOrganisasi] = useState("");
    const [alamat, setAlamat] = useState("");
    const [noTelp, setNoTelp] = useState("");
    const [email, setEmail] = useState("");
    const [logo, setLogo] = useState("");
    const [fotoFile, setFotoFile] = useState(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!show) {
            setError("");
        }
    }, [show]);

    useEffect(() => {
        if (organisasiData) {
            setNamaOrganisasi(organisasiData.nama || "");
            setAlamat(organisasiData.alamat || "");
            setNoTelp(organisasiData.no_telp || "");
            setEmail(organisasiData.email || "");
            setLogo(organisasiData.url_gambar ? getProfilePicture(organisasiData.url_gambar) : "gada woi");
            setFotoFile(null);
        }
    }, [organisasiData]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFotoFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogo(reader.result);
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
            formData.append('nama', namaOrganisasi);
            formData.append('alamat', alamat);
            formData.append('no_telp', noTelp);
            formData.append('email', email);
            if (fotoFile) {
                formData.append('profile_picture', fotoFile);
            }

            // debugging
            for (let [key, value] of formData.entries()) {
                console.log(key, value);
            }
            

            await updateOrganisasi(organisasiData.id_organisasi, formData);
            onClose();
        } catch (error) {
            setError(error.response.data.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal dismissible show={show} onClose={onClose} className='modal-backdrop'>
            <ModalHeader>
                Edit Organisasi <strong>{organisasiData?.nama}</strong>
            </ModalHeader>
            <ModalBody>
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <div>
                        <Label htmlFor='file_input'>Logo Organisasi</Label>
                        {logo && (
                            <img
                                src={logo}
                                alt="Logo Organisasi"
                                className="w-60 h-60 object-contain mb-2 mx-auto"
                            />
                        )}
                        <input
                            id="file_input"
                            type="file"
                            name="dokumen"
                            accept=".jpg,.jpeg,.png"
                            onChange={handleImageChange}
                            className="block w-full text-sm text-gray-900 border rounded-lg cursor-pointer bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-green-500 file:text-white hover:file:bg-green-600 transition"
                        />
                    </div>

                    <div>
                        <Label htmlFor="nama">Nama Organisasi</Label>
                        <TextInput
                            id="nama"
                            type="text"
                            value={namaOrganisasi}
                            onChange={(e) => setNamaOrganisasi(e.target.value)}
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
                        <Label htmlFor="email">Email Organisasi</Label>
                        <TextInput
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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

export default EditOrganisasiModal;
