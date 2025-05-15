import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Card, Button } from "flowbite-react";
import { SignUpPembeli, SignUpOrganisasi } from "../api/services/apiAuth";
import { Link, useNavigate } from "react-router-dom";

function Register() {
    const navigate = useNavigate();
    const [isPembeli, setIsPembeli] = useState(true);
    const [error, setError] = useState("");
    const [isDisabled, setIsDisabled] = useState(true);
    const [dataPembeli, setDataPembeli] = useState({
        nama_pembeli: "",
        no_telp: "",
        email: "",
        password: "",
        password_confirmation: "",
    });
    const [dataOrganisasi, setDataOrganisasi] = useState({
        nama: "",
        alamat: "",
        no_telp: "",
        email: "",
        password: "",
    });

    const handleChangePembeli = (event) => {
        setDataPembeli({ ...dataPembeli, [event.target.name]: event.target.value });
        console.log(dataPembeli);
    };
    const handleChangeOrganisasi = (event) => {
        setDataOrganisasi({ ...dataOrganisasi, [event.target.name]: event.target.value });
        console.log(dataOrganisasi);
    };

    const handleCheck = (e) => {
        let isChecked = e.target.checked;
        if (isChecked) {
            setIsDisabled(false);
        } else {
            setIsDisabled(true);
        }
    };

    const openPembeliForm = () => {
        setIsPembeli(true);
        setIsDisabled(true);
        setDataPembeli({
            nama_pembeli: "",
            no_telp: "",
            email: "",
            password: "",
            password_confirmation: "",
        });
        setError("");
    }

    const openOrganisasiForm = () => {
        setIsPembeli(false);
        setIsDisabled(true);
        setDataOrganisasi({
            nama: "",
            alamat: "",
            no_telp: "",
            email: "",
            password: "",
        });
        setError("");
    }

    const Register = (event) => {
        event.preventDefault();
        setError("");

        if (isPembeli) {
            SignUpPembeli(dataPembeli)
                .then((res) => {
                    alert("Berhasil register akun.");
                    console.log("Berhasil register pembeli.");
                    navigate("/login");
                })
                .catch((err) => {
                    console.log(err.message);
                    setError(err.message);
                });
        } else {
            const formData = new FormData();
            formData.append("nama", dataOrganisasi.nama);
            formData.append("alamat", dataOrganisasi.alamat);
            formData.append("no_telp", dataOrganisasi.no_telp);
            formData.append("email", dataOrganisasi.email);
            formData.append("password", dataOrganisasi.password);
            if (dataOrganisasi.dokumen) {
                formData.append("profile_picture", dataOrganisasi.dokumen);
            }

            SignUpOrganisasi(formData)
                .then((res) => {
                    alert("Berhasil register akun.");
                    console.log("Berhasil register organisasi.");
                    navigate("/login");
                })
                .catch((err) => {
                    console.log(err.message);
                    setError(err.message);
                });
        }

    };

    return (
        <>
            <Helmet>
                <title>Register - Reusemart</title>
            </Helmet>

            <div className='w-full h-screen flex flex-col items-center justify-center bg-[url("/background.jpg")] bg-cover bg-center bg-no-repeat'>
                <div className="my-6">
                    <img className="mx-auto" style={{ maxWidth: '25%' }} src="/logo.png" alt="Logo" />
                </div>

                <Card className="w-full max-w-md bg-white/90 backdrop-blur-md">
                    <h2 className="mb-2 text-center text-2xl font-semibold">Daftar Akun Baru</h2>

                    <div className="flex gap-6">
                        <div className="flex items-center">
                            <input
                                type="radio"
                                id="pembeli"
                                name="userType"
                                checked={isPembeli}
                                onChange={() => openPembeliForm()}
                                className="appearance-none w-4 h-4 border-2 border-gray-400 rounded-full checked:border-green-500 checked:bg-green-500"
                            />
                            <label htmlFor="pembeli" className="ml-2 text-sm font-medium text-gray-900">Pembeli</label>
                        </div>
                        <div className="flex items-center">
                            <input
                                type="radio"
                                id="organisasi"
                                name="userType"
                                checked={!isPembeli}
                                onChange={() => openOrganisasiForm()}
                                className="appearance-none w-4 h-4 border-2 border-gray-400 rounded-full checked:border-green-500 checked:bg-green-500"
                            />
                            <label htmlFor="organisasi" className="ml-2 text-sm font-medium text-gray-900">Organisasi</label>
                        </div>
                    </div>

                    <form onSubmit={Register} className="flex flex-col gap-4">
                        {isPembeli ? (
                            <>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <label htmlFor="nama" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nama</label>
                                        <input type="text" id="nama" name="nama_pembeli" onChange={handleChangePembeli} value={dataPembeli.nama_pembeli} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-green-500 block w-full p-2.5" placeholder="Cnth: Adit tolongin dit" required />
                                    </div>
                                    <div>
                                        <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nomor Telepon</label>
                                        <input type="text" id="phone" name="no_telp" onChange={handleChangePembeli} value={dataPembeli.no_telp} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-green-500 block w-full p-2.5" placeholder="Cnth: 0812-3456-7890" required />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Alamat Email</label>
                                    <input type="email" id="email" name="email" onChange={handleChangePembeli} value={dataPembeli.email} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-green-500 block w-full p-2.5" placeholder="Cnth: reusemart@gmail.com" required />
                                </div>
                                <div>
                                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                    <input type="password" id="password" name="password" onChange={handleChangePembeli} value={dataPembeli.password} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-green-500 block w-full p-2.5" placeholder="•••••••••" required />
                                </div>
                                <div>
                                    <label htmlFor="confirm_password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Konfirmasi password</label>
                                    <input type="password" id="confirm_password" name="password_confirmation" onChange={handleChangePembeli} value={dataPembeli.password_confirmation} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-green-500 block w-full p-2.5" placeholder="•••••••••" required />
                                </div>
                                <div className="flex items-start">
                                    <div className="flex items-center h-5">
                                        <input id="remember" type="checkbox" value="" className="w-4 h-4 border border-gray-300 rounded-sm bg-gray-50 focus:ring-3 focus:ring-blue-300" onChange={handleCheck} required />
                                    </div>
                                    <label htmlFor="remember" className="ms-2 text-sm font-medium text-gray-900">Saya setuju dengan syarat dan ketentuan.</label>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <label htmlFor="nama" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nama Organisasi</label>
                                        <input type="text" id="nama" name="nama" onChange={handleChangeOrganisasi} value={dataOrganisasi.nama} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-green-500 block w-full p-2.5" placeholder="Cnth: Adit tolongin dit" required />
                                    </div>
                                    <div>
                                        <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nomor Telepon</label>
                                        <input type="text" id="phone" name="no_telp" onChange={handleChangeOrganisasi} value={dataOrganisasi.no_telp} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-green-500 block w-full p-2.5" placeholder="Cnth: 0812-3456-7890" required />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="address" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Alamat Organisasi</label>
                                    <input type="text" id="address" name="alamat" onChange={handleChangeOrganisasi} value={dataOrganisasi.alamat} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-green-500 block w-full p-2.5" placeholder="Cnth: Jl. Seminyak P-16" required />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Alamat Email</label>
                                    <input type="email" id="email" name="email" onChange={handleChangeOrganisasi} value={dataOrganisasi.email} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-green-500 block w-full p-2.5" placeholder="Cnth: reusemart@gmail.com" required />
                                </div>
                                <div>
                                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                    <input type="password" id="password" name="password" onChange={handleChangeOrganisasi} value={dataOrganisasi.password} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-green-500 block w-full p-2.5" placeholder="•••••••••" required />
                                </div>
                                <div>
                                    <label
                                        htmlFor="file_input"
                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    >
                                        Unggah Logo Organisasi
                                    </label>
                                    <input
                                        id="file_input"
                                        type="file"
                                        name="dokumen"
                                        accept=".jpg,.jpeg,.png"
                                        onChange={(e) =>
                                            setDataOrganisasi({ ...dataOrganisasi, dokumen: e.target.files[0] })
                                        }
                                        className="block w-full text-sm text-gray-900 border rounded-lg cursor-pointer bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-green-500 file:text-white hover:file:bg-green-600 transition"
                                    />
                                </div>

                                <div className="flex items-start">
                                    <div className="flex items-center h-5">
                                        <input id="remember" type="checkbox" value="" className="w-4 h-4 border border-gray-300 rounded-sm bg-gray-50 focus:ring-3 focus:ring-blue-300" onChange={handleCheck} required />
                                    </div>
                                    <label htmlFor="remember" className="ms-2 text-sm font-medium text-gray-900">Saya setuju dengan syarat dan ketentuan.</label>
                                </div>
                            </>
                        )}


                        {error && (
                            <div className="text-red-600 text-sm font-medium text-center">
                                {error}
                            </div>
                        )}

                        <Button type="submit" color="green" className='mt-2 text-1xl w-full' disabled={isDisabled}>
                            Buat Akun
                        </Button>

                        <p className="text-sm text-center item">
                            Sudah punya akun?{" "}
                            <Link to="/login">
                                <span className="text-green-600 hover:underline">Login disini</span>
                            </Link>
                        </p>
                    </form>
                </Card>
            </div>
        </>
    );
}

export default Register;
