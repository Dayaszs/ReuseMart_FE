import { use, useEffect, useState } from 'react';
import axios from 'axios';
import api from '../routes/api';
import { Card } from "flowbite-react";
import { useParams } from "react-router-dom";
import { PulseLoader } from 'react-spinners';

const DetailPemesanan = () => {
  const [pemesanan, setPemesanan] = useState(null);
  const [komisi, setKomisi] = useState(null);
  const [barang, setBarang] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    const fetchPemesanan = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${api}/pemesanan/${id}/detail`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPemesanan(response.data.pemesanan);
        setKomisi(response.data.komisi);

        if (Array.isArray(response.data.komisi)) {
          const allBarang = response.data.komisi.map(item => item.barang);
          setBarang(allBarang);
        }
      } catch (error) {
        console.error('Error fetching pemesanan:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPemesanan();
  })

  if (loading) {
    return (
      <Card className="w-full h-full bg-white/90 backdrop-blur-md p-6 items-center flex justify-center">
          <PulseLoader size={15} color="#61d52c" />;
      </Card>
    );
  }

  return (
    <Card className="w-full bg-white/90 backdrop-blur-md p-6">
      <div className='text-center'>

        <div className="flex items-center mb-2">
          <h1 className='text-xl font-bold mr-3'>Detail Pemesanan</h1>
              <span
                  className={`text-xl font-bold px-2 py-1 rounded 
                  ${
                      pemesanan.status === 'Selesai'
                      ? 'bg-green-100 text-green-700'
                      : pemesanan.status === 'Disiapkan'
                      ? 'bg-yellow-100 text-yellow-700'
                      : pemesanan.status === 'Dikirim'
                      ? 'bg-blue-100 text-blue-700'
                      : pemesanan.status === 'Pending'
                      ? 'bg-orange-100 text-orange-700'
                      : pemesanan.status === 'Hangus'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-gray-100 text-gray-700'
                  }
                  `}
              >
                  {pemesanan?.status}
              </span>
        </div>  
      </div>
        <p>Id Pemesanan : {pemesanan?.id_pemesanan}</p>
        
      {barang?.map((item, index) => (
        <Card
            key={index}
            className="p-2 shadow-md cursor-pointer min-h-[100px]"
        >
            <div className="flex mb-2">
                <img
                        src={item.url_gambar_barang}
                        alt="Barang"
                        className="w-32 h-32 object-contain"
                  />

                <div className='fex flex-col justify-center ml-4'>
                  <h3 className="text-lg font-semibold ">{item.nama_barang}</h3>
                  <p className='text-lg'>{item.deskripsi}</p>
                </div>
                
            </div>
            <p className='text-sm'>Harga: <span>Rp {parseInt(item.harga).toLocaleString('id-ID')}</span>
            </p>
        </Card>
      ))}

      <p className='font-semibold'>Harga Total: Rp. {pemesanan.biaya_total}</p>
    </Card>
  );
}

export default DetailPemesanan;