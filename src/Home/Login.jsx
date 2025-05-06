import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Card, Label, TextInput, Button, Toast, ToastToggle } from "flowbite-react";
import axios from "axios";
import api from "../routes/api";
import { redirect, Link, useNavigate } from "react-router-dom";
import { PulseLoader } from "react-spinners";
import { Check } from 'lucide-react';

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState();
    const [showToast, setShowToast] = useState(false);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await axios.post(`${api}/login`, {
                email,
                password,
            });

            localStorage.setItem("token", response.data.token);

            setShowToast(true);
            setTimeout(() => {
                setShowToast(false);
                navigate("/");
            }, 2000);

        } catch (error) {
            
            setError(error.response?.data?.message);
            
        } finally {
            setLoading(false);
        }
};

    return (
        <>
            <Helmet>
                <title>Login - Reusemart</title>
            </Helmet>

            <div className='w-full h-screen flex flex-col items-center justify-center bg-[url("/background.jpg")] bg-cover bg-center bg-no-repeat'>
                <div className="my-6">
                    <img className="mx-auto" style={{ maxWidth: '25%' }} src="/logo.png" alt="Logo" />
                </div>

                <Card className="w-full max-w-md bg-white/90 backdrop-blur-md">
                    <h2 className="mb-5 text-center text-2xl font-semibold">Login</h2>

                    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                        <div>
                            <Label htmlFor="email" className="mb-2 block">Email</Label>
                            <TextInput
                                id="email"
                                type="email"
                                placeholder="Masukkan email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div>
                            <Label htmlFor="passwor" className="mb-2 block">Password</Label>
                            <TextInput
                                id="password"
                                type="password"
                                placeholder="Masukkan password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <div className="text-right mt-1">
                                <Link to="/forgot-password">
                                    <span className="text-sm text-green-600 hover:underline">Lupa Password</span>
                                </Link>
                            </div>
                        </div>

                        {error && (
                            <div className="text-red-600 text-sm font-medium text-center">
                                {error}
                            </div>
                        )}

                        {loading ? (
                            <Button type="submit" color="green" className='mt-6 text-1xl'>
                               <PulseLoader size={8} color="#ffffff" />
                            </Button>
                            
                        ) : (
                            <Button type="submit" color="green" className='mt-6 text-1xl'>
                            Login
                            </Button>
                        )}
                        

                        <p className="text-sm text-center item">
                            Belum punya akun?{" "}
                            <Link to="/register">
                                <span className="text-green-600 hover:underline">Daftar disini</span>
                            </Link>
                        </p>

                    </form>
                </Card>
            </div>

            {showToast && (
                    <div className="fixed top-5 right-5 z-100">
                        <Toast className="bg-green-500 text-white">
                            <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500">
                                <Check color="#00b315" />
                            </div>
                            <div className="ml-3 text-sm font-normal">Login Berhasil!</div>
                        </Toast>
                    </div>
            )}
        </>
    );
}

export default Login;
