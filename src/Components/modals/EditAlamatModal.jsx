import React, { useEffect, useState } from 'react';
import {
    Modal, ModalBody, ModalHeader,
    Button, Label, TextInput
} from 'flowbite-react';
import { PulseLoader } from 'react-spinners';

const EditAlamatModal = ({ show, onClose, updateAlamat, alamatData }) => {
    const [namaAlamat, setNamaAlamat] = useState("");
    const [namaPenerima, setNamaPenerima] = useState("");
    const [noTelp, setNoTelp] = useState("");
    const [alamatLengkap, setAlamatLengkap] = useState("");
    const [kota, setKota] = useState("");
    const [provinsi, setProvinsi] = useState("");
    const [kodePos, setKodePos] = useState("");
    const [catatan, setCatatan] = useState("");
    const [isPrimary, setIsPrimary] = useState(false);

    const [isLoading, setisLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!show) {
            setError("");
        }
    }, [show]);

    useEffect(() => {
        if (alamatData) {
            setNamaAlamat(alamatData.nama_alamat || "");
            setNamaPenerima(alamatData.nama_penerima || "");
            setNoTelp(alamatData.no_telp || "");
            setAlamatLengkap(alamatData.alamat_lengkap || "");
            setKota(alamatData.kota || "");
            setProvinsi(alamatData.provinsi || "");
            setKodePos(alamatData.kode_pos || "");
            setCatatan(alamatData.catatan ? alamatData.catatan : "");
            setIsPrimary(alamatData.is_primary === 1 ? true : false);
        }
    }, [alamatData])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setisLoading(true);
        setError("");

        try {
            const formData = new FormData();
            formData.append('nama_alamat', namaAlamat);
            formData.append('nama_penerima', namaPenerima);
            formData.append('no_telp', noTelp);
            formData.append('alamat_lengkap', alamatLengkap);
            formData.append('kota', kota);
            formData.append('provinsi', provinsi);
            formData.append('kode_pos', kodePos);
            if (catatan != "") {
                formData.append('catatan', catatan);
            }
            formData.append('is_primary', isPrimary ? '1' : '0');

            await updateAlamat(alamatData.id_alamat, formData);
            onClose();
        } catch (error) {
            setError(error.response.data.message);
        } finally {
            setisLoading(false);
        }
    };

    return (
        <Modal dismissible show={show} onClose={onClose}>
            <ModalHeader>
                Edit Alamat <strong>{namaAlamat}</strong>
            </ModalHeader>
            <ModalBody>
                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                    <div>
                        <Label htmlFor="namaAlamat">Nama Alamat</Label>
                        <TextInput
                            id="namaAlamat"
                            type="namaAlamat"
                            value={namaAlamat}
                            onChange={(e) => setNamaAlamat(e.target.value)}
                            placeholder='Cnth: Rumah Saya'
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="nama">Nama Penerima</Label>
                        <TextInput
                            id="nama"
                            type="text"
                            value={namaPenerima}
                            onChange={(e) => setNamaPenerima(e.target.value)}
                            placeholder='Cnth: Adit Sopo Jarwo'
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
                            placeholder='Cnth: 082146578824'
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="alamatLengkap">Alamat Lengkap</Label>
                        <TextInput
                            id="alamatLengkap"
                            type="text"
                            value={alamatLengkap}
                            onChange={(e) => setAlamatLengkap(e.target.value)}
                            placeholder='Cnth: Jl. Semarak Durian B-15'
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="kota">Kota</Label>
                        <TextInput
                            id="kota"
                            type="kota"
                            value={kota}
                            onChange={(e) => setKota(e.target.value)}
                            placeholder='Cnth: Semarang'
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="provinsi">Provinsi</Label>
                        <TextInput
                            id="provinsi"
                            type="provinsi"
                            value={provinsi}
                            onChange={(e) => setProvinsi(e.target.value)}
                            placeholder='Cnth: Jawa Tengah'
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="kodePos">Kode Pos</Label>
                        <TextInput
                            id="kodePos"
                            type="kodePos"
                            value={kodePos}
                            onChange={(e) => setKodePos(e.target.value)}
                            placeholder='Cnth: 54821'
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="catatan">Catatan(Opsional)</Label>
                        <TextInput
                            id="catatan"
                            type="catatan"
                            value={catatan}
                            onChange={(e) => setCatatan(e.target.value)}
                            placeholder='Cnth: Rumah warna hijau, dekat warung, dll..'
                        />
                    </div>

                    <div className="flex items-center space-x-2 mt-2">
                        <input
                            id="isPrimary"
                            type="checkbox"
                            checked={isPrimary}
                            onChange={(e) => setIsPrimary(e.target.checked)}
                            className="w-4 h-4"
                        />
                        <Label htmlFor="isPrimary" className="text-sm text-gray-700">
                            Jadikan Alamat Utama
                        </Label>
                    </div>

                    {error && <p className="text-red-600 font-semibold">{error}</p>}

                    <div className="flex justify-end gap-2 mt-4">

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="bg-green-500 hover:bg-green-600 text-white"
                        >
                            {isLoading ? <PulseLoader size={8} color="#ffffff" /> : 'Simpan'}
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

export default EditAlamatModal;
