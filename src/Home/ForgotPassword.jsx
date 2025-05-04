import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Card, Button } from "flowbite-react";
import { SendResetLink } from "../api/services/auth";
import { Link, useNavigate } from "react-router-dom";
import { PulseLoader } from "react-spinners";
import { HiCheckCircle } from "react-icons/hi";


function ForgotPassword() {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({
        email: "",
    });

    const handleChange = (event) => {
        setData({ ...data, [event.target.name]: event.target.value });
        console.log(data);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        SendResetLink(data)
            .then((res) => {
                console.log("Berhasil rmengirim link.");
                setLoading(false);
            })
            .catch((err) => {
                console.log(err.message);
                setError(err.message);
            })
            .finally(() => {
                setSuccess(true);
            });

    };

    return (
        <>
            <Helmet>
                <title>Forgot Password - Reusemart</title>
            </Helmet>

            <div
                className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center"
                style={{ backgroundImage: 'url(./background.jpg)' }}
            >
                <div className="my-6">
                    <img className="mx-auto" style={{ maxWidth: '25%' }} src="./logo.png" alt="Logo" />
                </div>

                <Card className="w-full max-w-md bg-white/90 backdrop-blur-md">

                    {success ? (
                        <>
                            <div className="flex flex-col items-center justify-center gap-4 py-8 px-4 text-center">
                                <HiCheckCircle className="text-green-500 text-[80px] animate-bounce" />
                                <h3 className="text-xl font-semibold text-gray-800">Tautan Berhasil Dikirim</h3>
                                <p className="text-sm text-gray-600">
                                    Silakan cek email Anda untuk reset password.
                                </p>
                            </div>
                        </>
                    ) : (
                        <>
                            <h2 className="mb-2 text-center text-2xl font-semibold">Lupa Password</h2>

                            <p className="text-sm text-gray-600 text-center">
                                Masukkan email Anda untuk menerima tautan reset password.
                            </p>

                            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                <div>
                                    {/* <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Alamat Email</label> */}
                                    <input type="email" id="email" name="email" onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-green-500 block w-full p-2.5" placeholder="Cnth: reusemart@gmail.com" required />
                                </div>

                                {error && (
                                    <div className="text-red-600 text-sm font-medium text-center">
                                        {error}
                                    </div>
                                )}

                                <Button
                                    type="submit"
                                    color="green"
                                    className="mt-2 text-1xl w-full flex justify-center items-center"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <PulseLoader size={8} color="#ffffff" />
                                    ) : (
                                        "Kirim Link"
                                    )}
                                </Button>


                                <p className="text-sm text-center">
                                    Sudah ingat password?{" "}
                                    <Link to="/login">
                                        <span className="text-green-600 hover:underline">Login Disini</span>
                                    </Link>
                                </p>
                            </form>
                        </>
                    )}
                </Card>
            </div>
        </>
    );
}

export default ForgotPassword;
