import React from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getGambarBarang } from '@/api';
import { Check, ChevronRight, CreditCard, MapPin, Package, Plus, Truck } from 'lucide-react';
import { Badge } from 'flowbite-react';
import { TambahPemesanan } from '@/api/services/apiPemesanan';
import { PulseLoader } from 'react-spinners';

const CheckOutPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { state } = useLocation();
  const navigate = useNavigate();
  const [selectedAlamat, setSelectedAlamat] = useState(0)
  const [selectedPayment, setSelectedPayment] = useState(0)
  const [poinTerpakai, setPoinTerpakai] = useState(0);
  const [metodePengiriman, setMetodePengiriman] = useState("Dikirim")

  if (!state) {
    return (
      <>
        <div className='min-h-screen flex items-center justify-center'>
          <div className="text-center">
            <p className="text-xl font-semibold text-gray-800 mb-4">Tidak ada barang yang dipilih untuk checkout...</p>
            <button
              onClick={() => navigate('/pembeli/cart')}
              className="px-6 py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-700 transition-colors duration-150"
            >
              Kembali ke Keranjang
            </button>
          </div>
        </div>
      </>
    );
  }
  const { barang, alamat, poin } = state;
  const metodePembayaran = [
    { id: 0, name: "Bank Transfer", icon: <CreditCard className="w-5 h-5" /> },
  ]
  const subtotal = barang.reduce((total, item) => total + parseFloat(item.harga), 0);
  const diskon = poinTerpakai > 0 ? poinTerpakai * 100 : 0;
  const isDikirim = metodePengiriman === "Dikirim";
  const ongkosKirim = isDikirim && subtotal < 1500000 ? 100000 : 0;
  const total = subtotal + ongkosKirim - diskon;
  const poinAwal = (subtotal - diskon) / 10000;
  const poinBonus = subtotal > 500000 ? ((subtotal - diskon) / 10000) * 0.2 : 0;
  const poinDiperoleh = poinAwal + poinBonus;

  const handlePointsChange = (e) => {
    const poinInputan = Number.parseInt(e.target.value) || 0;
    if (poinInputan > poin) {
      setPoinTerpakai(poin);
    } else {
      setPoinTerpakai(poinInputan);
    }
  }

  const handleUseAllPoints = () => {
    setPoinTerpakai(poin);
  }

  const tambahPemesanan = (data) => {
    setIsLoading(true);
    TambahPemesanan(data)
      .then((response) => {
        // navigate('/pembeli/checkout/pembayaran');
        window.dispatchEvent(new Event('cartChanged'));
        navigate('/pembeli/checkout/pembayaran/' + response.data.id_pemesanan);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setIsLoading(false));
  }

  const handleSubmit = () => {
    const formData = {
      id_barang: barang.map((item) => item.id_barang),
      id_alamat: selectedAlamat,
      metode_pengambilan: metodePengiriman,
      poin_dipakai: poinTerpakai,
    };

    tambahPemesanan(formData);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-8 h-8 bg-green-500 rounded-full text-white">
                <Check className="w-5 h-5" />
              </div>
              <div className="ml-2 text-sm font-medium text-green-500">Keranjang</div>
              <div className="w-16 h-1 bg-green-500 mx-2"></div>
            </div>

            <div className="flex items-center">
              <div className="flex items-center justify-center w-8 h-8 bg-green-500 rounded-full text-white">
                <Check className="w-5 h-5" />
              </div>
              <div className="ml-2 text-sm font-medium text-green-500">Pengiriman</div>
              <div className="w-16 h-1 bg-green-500 mx-2"></div>
            </div>

            <div className="flex items-center">
              <div className="flex items-center justify-center w-8 h-8 bg-green-500 rounded-full text-white">
                <span>3</span>
              </div>
              <div className="ml-2 text-sm font-medium text-green-500">Pembayaran</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Alamat Pengiriman */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-gray-500" />
                    Alamat Pengiriman
                  </h2>

                  <Link to="/pembeli/profile">
                    <button className="text-sm text-green-500 font-medium flex items-center hover:text-green-600 hover:cursor-pointer">
                      <Plus className="w-4 h-4 mr-1" />
                      Tambah Alamat
                    </button>
                  </Link>
                </div>

                <div className="space-y-4">
                  {alamat?.map((alamatItem) => {
                    if (alamatItem.is_primary === 1 && !selectedAlamat) {
                      setSelectedAlamat(alamatItem.id_alamat);
                    }

                    return (
                      <div
                        key={alamatItem.id_alamat}
                        className={`border rounded-lg p-4 cursor-pointer transition-all ${selectedAlamat === alamatItem.id_alamat
                          ? "border-emerald-500 bg-emerald-50"
                          : "border-gray-200 hover:border-gray-300"
                          }`}
                        onClick={() => setSelectedAlamat(alamatItem.id_alamat)}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center">
                              <span className="font-medium">{alamatItem.nama_alamat}</span>
                              {alamatItem.is_primary === 1 && (
                                <Badge color="green" className='ml-2'>
                                  Utama
                                </Badge>
                              )}
                            </div>
                            <div className="text-sm text-gray-700 mt-1">
                              {alamatItem.nama_penerima} | {alamatItem.no_telp}
                            </div>
                            <div className="text-sm text-gray-600 mt-1">{alamatItem.alamat_lengkap}</div>
                          </div>
                          <div className="flex-shrink-0">
                            <div
                              className={`w-5 h-5 rounded-full border flex items-center justify-center ${selectedAlamat === alamatItem.id_alamat
                                ? "border-green-500 bg-green-500"
                                : "border-gray-300"
                                }`}
                            >
                              {selectedAlamat === alamatItem.id_alamat && (
                                <Check className="w-4 h-4 text-white" />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Metode Pengiriman */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center mb-4">
                  <Truck className="w-5 h-5 mr-2 text-gray-500" />
                  <h2 className="text-lg font-medium">Metode Pengiriman</h2>
                </div>

                <div className="space-y-3 mb-4">
                  <div
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${metodePengiriman === "Dikirim"
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-gray-200 hover:border-gray-300"
                      }`}
                    onClick={() => setMetodePengiriman("Dikirim")}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Truck className="w-5 h-5 text-gray-600" />
                        <div className="ml-3">
                          <div className="font-medium">Diantar Kurir</div>
                          <div className="text-sm text-gray-600">Estimasi tiba 2-3 hari</div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="font-medium mr-3">
                          {subtotal < 1500000 ? "Rp100.000" : "Gratis"}
                        </div>
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center ${metodePengiriman === "Dikirim" ? "border-green-500 bg-green-500" : "border-gray-300"
                            }`}
                        >
                          {metodePengiriman === "Dikirim" && <Check className="w-4 h-4 text-white" />}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${metodePengiriman === "Diambil"
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-gray-200 hover:border-gray-300"
                      }`}
                    onClick={() => setMetodePengiriman("Diambil")}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Package className="w-5 h-5 text-gray-600" />
                        <div className="ml-3">
                          <div className="font-medium">Ambil Sendiri</div>
                          <div className="text-sm text-gray-600">Gratis - Ambil di toko Reusemart</div>
                        </div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center ${metodePengiriman === "Diambil" ? "border-green-500 bg-green-500" : "border-gray-300"
                          }`}
                      >
                        {metodePengiriman === "Diambil" && <Check className="w-4 h-4 text-white" />}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Metode Pembayaran */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center mb-4">
                  <CreditCard className="w-5 h-5 mr-2 text-gray-500" />
                  <h2 className="text-lg font-medium">Metode Pembayaran</h2>
                </div>

                <div className="space-y-3">
                  {metodePembayaran.map((method) => (
                    <div
                      key={method.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${selectedPayment === method.id
                        ? "border-emerald-500 bg-emerald-50"
                        : "border-gray-200 hover:border-gray-300"
                        }`}
                      onClick={() => setSelectedPayment(method.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          {method.icon}
                          <span className="ml-3 font-medium">{method.name}</span>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center ${selectedPayment === method.id ? "border-green-500 bg-green-500" : "border-gray-300"
                            }`}
                        >
                          {selectedPayment === method.id && <Check className="w-4 h-4 text-white" />}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
                <h2 className="text-lg font-medium mb-4">Ringkasan Pesanan</h2>

                {/* Daftar Barang dari Cart */}
                <div className="space-y-4 mb-6">
                  {barang?.map((item) => (
                    <div key={item.id_barang} className="flex items-start">
                      <img
                        src={item.url_gambar_barang ? getGambarBarang(item.url_gambar_barang).split(";")[0] : "/logo.png"}
                        alt={item.nama_barang}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      <div className="ml-4 flex-1">
                        <div className="font-medium">{item.nama_barang}</div>
                        <div className="text-sm text-gray-500">1 item</div>
                        <div className="font-medium mt-1">Rp{parseInt(item.harga).toLocaleString("id-ID")}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Poin Cashback */}
                <div className="border rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">Potongan Poin</div>
                    <div className="text-sm text-gray-600">Tersedia: {poin} poin</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={poinTerpakai}
                      onChange={handlePointsChange}
                      min="0"
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Masukkan jumlah poin"
                    />
                    <button
                      onClick={handleUseAllPoints}
                      className="text-sm bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition-colors hover:cursor-pointer"
                    >
                      Gunakan Semua
                    </button>
                  </div>
                </div>

                {/* Ringkasan Harga */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>Rp{subtotal.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {metodePengiriman === "Dikirim" ? "Pengiriman" : "Biaya Pengambilan"}
                    </span>
                    {ongkosKirim > 0
                      ? (
                        <span>Rp{ongkosKirim.toLocaleString("id-ID")}</span>
                      ) : (
                        <span className="text-emerald-500">Gratis</span>
                      )}
                  </div>
                  {diskon > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Potongan Poin (Diskon)</span>
                      <span className="text-emerald-500">-Rp{diskon.toLocaleString("id-ID")}</span>
                    </div>
                  )}
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between font-medium text-lg">
                      <span>Total</span>
                      <span>Rp{total.toLocaleString("id-ID")}</span>
                    </div>
                  </div>
                  <div className='flex justify-between'>
                    <span className="text-gray-600">Perolehan Poin</span>
                    <span>{parseFloat(poinDiperoleh).toFixed(0)} poin</span>
                  </div>
                </div>

                <button type='button' onClick={handleSubmit} className="w-full bg-green-500 text-white py-3 rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center justify-center hover:cursor-pointer">
                  {isLoading ? (
                    <PulseLoader size={8} color="#ffffff" />
                  ) : (
                    <>
                      Lanjutkan Pembayaran
                      <ChevronRight className="w-5 h-5 ml-1" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default CheckOutPage