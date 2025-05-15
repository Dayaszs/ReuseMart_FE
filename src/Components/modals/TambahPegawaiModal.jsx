import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Alert, Label, TextInput, Dropdown,DropdownItem } from "flowbite-react";
import { useEffect, useState } from "react";
import { PulseLoader } from 'react-spinners';
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

const TambahPegawaiModal = ({show, onClose, tambahPegawai}) =>{
    const [ nama, setNama ] = useState("");
    const [ no_telp, setNoTelp ] = useState("");
    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ tanggalLahir, setTanggalLahir ] = useState(null);
    const [ jabatan, setJabatan ] = useState("");

    const [ isLoading, setIsLoading ] = useState(false);
    const [ error, setError ] = useState("");
    const [ success, setSuccess ] = useState(false);

    useEffect(() => {
        if(!show){
            setError("");
            setSuccess(false);

            setNama("");
            setNoTelp("");
            setEmail("");
            setPassword("");
            setTanggalLahir(null);
            setJabatan("");
        }
    }, [show]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        setSuccess(false);

        let idJabatan;

        if(jabatan === "Owner"){
            idJabatan = 1;
        }else if(jabatan === "Admin"){
            idJabatan = 2;
        }else if(jabatan === "Gudang"){
            idJabatan = 3;
        }else if(jabatan === "Customer Service"){
            idJabatan = 4;
        }else if(jabatan === "Kurir"){
            idJabatan = 5;
        }else if(jabatan === "Hunter"){
            idJabatan = 6;
        }

        const formattedDate = tanggalLahir ? format(tanggalLahir, "yyyy-MM-dd") : "";

        try {
            console.log("nama", nama);
            console.log("noTelp", no_telp);
            console.log("email", email);
            console.log("tanggalLahir", tanggalLahir);
            console.log("idJabatan", idJabatan);

            const formData = new FormData();
            formData.append('nama', nama);
            formData.append('no_telp', no_telp);
            formData.append('email', email);
            formData.append('password', password);
            // formData.append('komisi', 0);
            formData.append('tanggal_lahir', formattedDate);
            formData.append('id_jabatan', idJabatan);

            // console.log("Form Data : ", formData);

            await tambahPegawai(formData);
            setSuccess(true);
            setTimeout(() => {
                onClose();
            }, 1500);
        } catch (error) {
            setError(error.response?.data?.message || "Terjadi kesalahan saat edit pegawai");
        } finally {
            setIsLoading(false);
        }
    };
    
    return(
        <Modal show={show} onClose={onClose}>
            <ModalHeader>Tambah Pegawai Baru</ModalHeader>
            <ModalBody>
                {error && <Alert color="failure">{error}</Alert>}
                {success ? (
                    <Alert color="success">Berhasil menambah Pegawai!</Alert>
                ) : (
                    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                        <div>
                            <Label htmlFor="nama">Nama</Label>
                            <TextInput
                                id="nama"
                                type="text"
                                value={nama}
                                onChange={(e) => setNama(e.target.value)}
                                placeholder='Masukkan nama pegawai'
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="no_telp">No Telepon</Label>
                            <TextInput
                                id="no_telp"
                                type="text"
                                value={no_telp}
                                onChange={(e) => setNoTelp(e.target.value)}
                                placeholder='Masukkan nomor telepon'
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="email">Email</Label>
                            <TextInput
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder='Masukkan email'
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="password">Password</Label>
                            <TextInput
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder='Masukkan password'
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label>Tanggal Lahir</Label>
                            <div className="relative">
                                <TextInput
                                    type="text"
                                    value={tanggalLahir ? format(tanggalLahir, "yyyy-MM-dd", { locale: id }) : ""}
                                    placeholder="Pilih tanggal lahir"
                                    readOnly
                                    className="pr-10"
                                />
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <button
                                            type="button"
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                        >
                                            <CalendarIcon className="h-5 w-5" />
                                        </button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={tanggalLahir}
                                            onSelect={setTanggalLahir}
                                            disabled={(date) =>
                                                date > new Date() || date < new Date("1900-01-01")
                                            }
                                            initialFocus
                                            className="bg-white"
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="jabatan">Jabatan</Label>
                            <Dropdown
                                label={jabatan || "Pilih jabatan"}
                                dismissOnClick={false}
                                className="w-80 bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-black text-left hover:bg-gray-100"
                            >
                                <DropdownItem onClick={() => setJabatan("Owner")}>Owner</DropdownItem>
                                <DropdownItem onClick={() => setJabatan("Admin")}>Admin</DropdownItem>
                                <DropdownItem onClick={() => setJabatan("Gudang")}>Gudang</DropdownItem>
                                <DropdownItem onClick={() => setJabatan("Customer Service")}>Customer Service</DropdownItem>
                                <DropdownItem onClick={() => setJabatan("Kurir")}>Kurir</DropdownItem>
                                <DropdownItem onClick={() => setJabatan("Hunter")}>Hunter</DropdownItem>
                            </Dropdown>
                        </div>
                    </form>
                )}
            </ModalBody>
            <ModalFooter>
                <Button 
                    color="gray" 
                    onClick={onClose}
                    disabled={isLoading}
                >
                    Batal
                </Button>
                <Button 
                    onClick={handleSubmit}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <PulseLoader size={8} color="#ffffff" />
                    ) : (
                        "Simpan"
                    )}
                </Button>
            </ModalFooter>
        </Modal>
    )
}

export default TambahPegawaiModal;