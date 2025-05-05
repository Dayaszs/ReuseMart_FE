import React, { useEffect, useState } from 'react';
import { Card, Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'flowbite-react';
import axios from 'axios';
import api from '../routes/api';
import { PulseLoader } from 'react-spinners';
import EditPenitipModal from '@/Components/modals/EditPenitipModal';

const CSDash = () => {
    const [penitip, setPenitip] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const [selectedPenitip, setSelectedPenitip] = useState(null);
    const [showModalEdit, setShowModalEdit] = useState(false);

    useEffect(() => {
        const fetchPenitip = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${api}/cs/getpenitip`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setPenitip(response.data.penitip);
            } catch (error) {
                console.error('Error fetching penitip:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPenitip();
    }, []);

    if (loading) {
        return (
            <Card className="w-full h-full bg-white/90 backdrop-blur-md p-6 items-center flex justify-center">
                <PulseLoader size={15} color="#61d52c" />
            </Card>
        );
    }

    
    const filteredPenitip = penitip?.filter(item =>
        item.nama_penitip.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id_penitip.toString().includes(searchTerm)
    );

    return (
        <Card className="w-full bg-white/90 backdrop-blur-md p-6">
            <div className="flex flex-col w-full h-full p-4">
                <h1 className="text-2xl font-bold">Customer Service Dashboard</h1>
                <p className="text-gray-600">Selamat Datang di Customer Service Dashboard</p>

            
                <div className="flex flex-wrap items-center justify-between mt-4 mb-4">
                    <h1 className="text-2xl font-bold">List Penitip</h1>
                    <input
                        type="text"
                        placeholder="Cari nama atau ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-1 w-64 focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                </div>

               
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredPenitip?.map((item, index) => (
                        <Card
                            key={index}
                            className="p-2 shadow-md min-h-[100px] mb-2"
                        >
                            <div className="flex flex-wrap items-center justify-between mt-4 mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold">
                                        {item.id_penitip} - {item.nama_penitip} - Poin {item.poin}
                                    </h3>
                                    <div className="grid grid-cols-[auto_1fr] gap-x-2 text-md">
                                        <span>Email</span>
                                        <span>: {item.email}</span>
                                        <span>No. KTP</span>
                                        <span>: {item.no_ktp}</span>
                                        <span>No. Telepon</span>
                                        <span>: {item.no_telp}</span>
                                        <span>Avg Rating</span>
                                        <span>: {item.avg_rating}</span>
                                        <span>Saldo</span>
                                        <span>: Rp {parseInt(item.saldo).toLocaleString('id-ID')}</span>
                                    </div>
                                </div>

                                <div className='flex flex-row gap-2'>
                                    <Button 
                                        className='bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded transition-colors'
                                        onClick={() => {
                                            setSelectedPenitip(item);  // 🔧 Set selected penitip here
                                            setShowModalEdit(true);
                                        }}
                                    >
                                        Edit
                                    </Button>

                                    <Button className='bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition-colors'>
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
            <EditPenitipModal
                show={showModalEdit}
                onClose={() => setShowModalEdit(false)}
                penitipData={selectedPenitip}
            />
        </Card>

        
    );
}

export default CSDash;
