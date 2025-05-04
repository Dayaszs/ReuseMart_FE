import { use, useEffect, useState } from 'react';
import axios from 'axios';
import api from '../routes/api';
import { Spinner, Card } from "flowbite-react";
import { useParams } from "react-router-dom";

const DetailPemesanan = () => {
  const [pemesanan, setPemesanan] = useState(null);
  const [komisi, setKomisi] = useState(null);
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
      } catch (error) {
        console.error('Error fetching pemesanan:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPemesanan();
  })

  if (loading) {
    return <Spinner color="success" aria-label="Loading..." />;
  }

  return (
    <Card className="w-full bg-white/90 backdrop-blur-md p-6">
      <div className='text-center'>

        <div className="flex items-center mb-2">
          <h1 className='text-xl font-bold'>Detail Pemesanan</h1>
              <span
                  className={`text-xl font-bold px-2 py-1 rounded 
                  ${
                      pemesanan.status === 'selesai'
                      ? 'bg-green-100 text-green-700'
                      : pemesanan.status === 'disiapkan'
                      ? 'bg-yellow-100 text-yellow-700'
                      : pemesanan.status === 'dikirim'
                      ? 'bg-blue-100 text-blue-700'
                      : pemesanan.status === 'pending'
                      ? 'bg-orange-100 text-orange-700'
                      : pemesanan.status === 'hangus'
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
      
    </Card>
  );
}

export default DetailPemesanan;