import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Card, Label, TextInput, Button } from "flowbite-react";
import axios from "axios";
import { SignUpPembeli, SignUpOrganisasi } from "../api/services/auth";

function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await axios.post(`${api}/register/pembeli`, {
                email,
                password,
            });

            localStorage.setItem("token", response.data.token);

            alert("Register successful");
        } catch (err) {
            if (err.response && err.response.status === 401) {
                setError("Email atau password salah.");
            } else {
                setError("Terjadi kesalahan saat register.");
            }
        }
    };

    return (
        <>
            <Helmet>
                <title>Register - Reusemart</title>
            </Helmet>

            <div
                className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center"
                style={{ backgroundImage: 'url(./background.jpg)' }}
            >
                <div className="my-6">
                    <img className="mx-auto" style={{ maxWidth: '30%' }} src="./logo.png" alt="Logo" />
                </div>

                <Card className="w-full max-w-md bg-white/90 backdrop-blur-md">
                    <h2 className="mb-5 text-center text-2xl font-semibold">Register</h2>

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
                        </div>

                        {error && (
                            <div className="text-red-600 text-sm text-center">
                                {error}
                            </div>
                        )}

                        <Button type="submit" color="green" className='mt-10 text-1xl'>
                            Register
                        </Button>
                    </form>
                </Card>
            </div>
        </>
    );
}

export default Register;
