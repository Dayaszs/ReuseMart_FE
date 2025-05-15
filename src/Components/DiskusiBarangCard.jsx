import React from 'react'
import { useState, useEffect, useRef } from 'react';
import { Button, Badge } from 'flowbite-react';
import { LuMessageSquarePlus } from "react-icons/lu";
import { PulseLoader } from 'react-spinners';

const DiskusiBarangCard = ({ tambahDiskusi, diskusi, barangId, error }) => {
    const [pesanBaru, setPesanBaru] = useState("");
    const [isExpanded, setIsExpanded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [localError, setLocalError] = useState(false);
    const [success, setSuccess] = useState(false);

    // Auto scroll ke chat paling bawah
    const chatContainerRef = useRef(null);
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo({
                top: chatContainerRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }
    }, [diskusi]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setLocalError("");
        setSuccess(false);

        try {
            const formData = new FormData();
            formData.append('pesan', pesanBaru);

            await tambahDiskusi(barangId, formData);
            setPesanBaru("");
            setSuccess(true);
        } catch (error) {
            setLocalError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-4 border-b border-gray-100">
                <h3 className="font-medium text-gray-800">Diskusi ({diskusi.length})</h3>
            </div>

            <div ref={chatContainerRef} className="p-4 space-y-6 max-h-[500px] overflow-y-auto">
                {diskusi.map((item, index) => {
                    const isCustomerService = item.penulis === 'Customer Service';
                    const isWrittenByMe = item.oleh_saya === true;
                    return (
                        <div key={index} className="flex flex-col">
                            <div className={`flex items-center ${isWrittenByMe && "justify-end"} gap-2 mb-1`}>
                                {isWrittenByMe && <span className="text-xs text-gray-500">{item.created_at}</span>}
                                <span className={`font-semibold text-base ${isCustomerService ? "text-green-500" : "text-gray-800"}`}>
                                    {item.penulis}
                                </span>
                                {isCustomerService && <Badge color="success">
                                    <span className='text-green-500'>CS</span>
                                </Badge>}
                                {!isWrittenByMe && <span className="text-xs text-gray-500">{item.created_at}</span>}
                            </div>

                            <div className={`w-full p-3 rounded-lg ${isCustomerService ? `bg-green-50 ${isWrittenByMe ? "border-r-4" : "border-l-4"} border-green-500` : "bg-gray-50"}`}>
                                <p className={`text-black ${isWrittenByMe && "text-right"}`}>{item.pesan}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="p-4 border-t border-gray-100">
                <form onSubmit={handleSubmit} className="flex gap-2">
                    {!isExpanded
                        ? (
                            <button type="button" onClick={() => setIsExpanded(true)} className="w-full flex items-center justify-center text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">
                                <LuMessageSquarePlus className='h-5 w-5 me-2' />
                                Ajukan pertanyaan tentang barang ini
                            </button>
                        ) : (
                            <>
                                {error
                                    ? <div className='flex-1 px-4 py-2 border border-red-100 rounded-lg bg-red-100'>
                                        <span className="text-sm text-red-500">{error}</span>
                                    </div>
                                    : <input
                                        type="text"
                                        value={pesanBaru}
                                        onChange={(e) => setPesanBaru(e.target.value)}
                                        placeholder="Tulis pertanyaan Anda..."
                                        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                }
                                <button
                                    type="submit"
                                    disabled={pesanBaru === ""}
                                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 hover:cursor-pointer transition-colors disabled:bg-gray-700 disabled:hover:cursor-default"
                                >
                                    {isLoading
                                        ? (<><PulseLoader size={8} color='#ffffff' /></>)
                                        : "Kirim"}
                                </button>
                            </>
                        )}
                </form>
            </div>
        </div>
    )
}

export default DiskusiBarangCard