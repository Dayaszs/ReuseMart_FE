import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Card, Label, TextInput, Button } from "flowbite-react";
import axios from "axios";
import api from "../routes/api";
import { redirect, Link, useNavigate } from "react-router-dom";
import { PulseLoader } from "react-spinners";

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState();


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

            alert("Login successful");
            navigate("/");
        } catch (error) {
            if (err.response && err.response.status === 401) {
                setError("Email atau password salah.");
            } 
        } finally {
            setLoading(false);
        }
};

    return (
        <>
            <Helmet>
                <title>Login - Reusemart</title>
            </Helmet>

            <div
                className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center"
                style={{ backgroundImage: 'url(./background.jpg)' }}
            >
                <div className="my-6">
                    <img className="mx-auto" style={{ maxWidth: '25%' }} src="./logo.png" alt="Logo" />
                </div>

                <Card className="w-full max-w-md bg-white/90 backdrop-blur-md">
                    <h2 className="mb-5 text-center text-2xl font-semibold">Login</h2>

                    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                        <div>
                            <Label htmlFor="email" value="Email address" />
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
                            <Label htmlFor="password" value="Password" />
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
        </>
    );
}

export default Login;
