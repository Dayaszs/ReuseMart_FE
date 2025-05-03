import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import api from '../routes/api';
import { Spinner, Card } from "flowbite-react";


const Profile = () => {
    const [userRole, setUserRole] = useState(null);
    const [user, setUser] = useState(null);
    const [pemesanan, setPemesanan] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');

                const response = await axios.get(`${api}/getprofile`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if(response.data.role === "Pembeli") {
                    setPemesanan(response.data.pemesanan);
                }

                setUser(response.data.user);
                setUserRole(response.data.role);
            } catch (error) {
                console.error('Error fetching user profile:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) {
        return <Spinner color="success" aria-label="Loading..." />;
    }


    if (userRole === "Pembeli") {
        return (
            <Card className="w-full bg-white/90 backdrop-blur-md p-6">
              <div className="flex flex-col items-center space-y-4">
                <img
                  src={user?.url_gambar}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover"
                />
                <div className="text-center">
                  <h1 className="text-xl font-bold">Profil Pembeli</h1>
                  <p>Nama: {user?.nama_pembeli}</p>
                  <p>Poin: {user?.poin}</p>
                  <p>Email: {user?.email}</p>
                  <p>No Telepon: {user?.no_telp}</p>
                </div>
              </div>
          
              <div className="mt-6">
                <h2 className="text-lg font-semibold mb-4">Daftar Pemesanan:</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pemesanan?.map((item, index) => (
                    <Link to={`/profile/pemesanan/${item.id_pemesanan}`} key={index} className="no-underline"> 
                        <Card
                            key={index}
                            className="p-2 shadow-md cursor-pointer min-h-[100px]"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-lg font-semibold">ID Pemesanan: {item.id_pemesanan}</h3>
                                <span
                                    className={`text-m font-semibold px-2 py-1 rounded 
                                    ${
                                        item.status === 'selesai'
                                        ? 'bg-green-100 text-green-700'
                                        : item.status === 'disiapkan'
                                        ? 'bg-yellow-100 text-yellow-700'
                                        : item.status === 'dikirim'
                                        ? 'bg-blue-100 text-blue-700'
                                        : item.status === 'pending'
                                        ? 'bg-orange-100 text-orange-700'
                                        : item.status === 'hangus'
                                        ? 'bg-red-100 text-red-700'
                                        : 'bg-gray-100 text-gray-700'
                                    }
                                    `}
                                >
                                    {item.status}
                                </span>
                            </div>
                            <div className="space-y-1 text-sm">
                                <p><span className="font-medium">Tanggal Pemesanan:</span> {item.tanggal_pemesanan}</p>

                                <p>
                                    <span className="font-medium">Tanggal Jadwal:</span>
                                    {item.tanggal_jadwal || <span className="text-gray-400"> -</span>}
                                </p>

                                <p>
                                    <span className="font-medium">Tanggal Selesai:</span>
                                    {item.tanggal_selesai || <span className="text-gray-400"> -</span>}
                                </p>

                                <p><span className="font-medium">Metode Pengambilan:</span> {item.metode_pengambilan}</p>
                                <p><span className="font-medium">Ongkos Kirim:</span> {item.ongkos_kirim ?? 'Tidak ada'}</p>
                                <p><span className="font-medium">Biaya Total:</span> Rp {parseInt(item.biaya_total).toLocaleString('id-ID')}</p>
                            </div>
                        </Card>
                    </Link>
                    ))}

                </div>
              </div>
            </Card>
          );
          
    }

    return (
        <div>
            <h1>Profil Pengguna</h1>
            <p>Nama: {user?.name}</p>
            <p>Email: {user?.email}</p>
            <p>Peran: {userRole}</p>
        </div>
    );
};

export default Profile;
