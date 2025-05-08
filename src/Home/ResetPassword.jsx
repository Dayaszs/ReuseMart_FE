import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Card, Button } from "flowbite-react";
import { UpdatePassword } from "../api/services/apiAuth";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { PulseLoader } from "react-spinners";
import { HiCheckCircle } from "react-icons/hi";


function ResetPassword() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    const token = queryParams.get("token");
    const type = queryParams.get("type");

    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({
        token: token,
        type: type,
        password: "",
        password_confirmation: "",
    });
    const [countdown, setCountdown] = useState(10);

    useEffect(() => {
        if (success) {
            const timer = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);

            const redirectTimeout = setTimeout(() => {
                navigate("/login");
            }, 10000);

            return () => {
                clearInterval(timer);
                clearTimeout(redirectTimeout);
            };
        }
    }, [success]);

    const handleChange = (event) => {
        setData({ ...data, [event.target.name]: event.target.value });
        console.log(data);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        console.log(data);

        UpdatePassword(data)
            .then((res) => {
                console.log("Berhasil mengupdate password.");
                setSuccess(true);
            })
            .catch((err) => {
                console.log(err.message);
                setError(err.message);
            })
            .finally(() => {
                setLoading(false);
            });

    };

    return (
        <>
            <Helmet>
                <title>Reset Password - Reusemart</title>
            </Helmet>

            <div className='w-full h-screen flex flex-col items-center justify-center bg-[url("/background.jpg")] bg-cover bg-center bg-no-repeat'>
                <div className="my-6">
                    <img className="mx-auto" style={{ maxWidth: '25%' }} src="/logo.png" alt="Logo" />
                </div>

                <Card className="w-full max-w-md bg-white/90 backdrop-blur-md">

                    {success ? (
                        <>
                            <div className="flex flex-col items-center justify-center gap-4 py-8 px-4 text-center">
                                <h3 className="text-xl font-semibold text-gray-800">
                                    Password Anda Berhasil Diubah
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Anda akan diarahkan ke halaman login dalam {countdown} detik...
                                </p>
                                <p className="text-sm text-gray-500">
                                    Jika tidak diarahkan otomatis, klik <Link to="/login"><span className="text-green-600 hover:underline">disini</span></Link>.
                                </p>
                            </div>
                        </>
                    ) : (
                        <>
                            <h2 className="mb-2 text-center text-2xl font-semibold">Ubah Password</h2>

                            <p className="text-sm text-gray-600 text-center">
                                Masukkan password baru Anda untuk mengubah password.
                            </p>

                            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                <div>
                                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                    <input type="password" id="password" name="password" onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-green-500 block w-full p-2.5" placeholder="•••••••••" required />
                                </div>
                                <div>
                                    <label htmlFor="confirm_password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Konfirmasi password</label>
                                    <input type="password" id="confirm_password" name="password_confirmation" onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-green-500 block w-full p-2.5" placeholder="•••••••••" required />
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
                                        "Kirim"
                                    )}
                                </Button>
                            </form>
                        </>
                    )}
                </Card>
            </div>
        </>
    );
}

export default ResetPassword;
