import React from 'react'
import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { GetCart, DeleteCart } from '@/api/services/apiCart'
import { PulseLoader } from 'react-spinners'
import { getGambarBarang } from '@/api'
import { Card } from 'flowbite-react'
import { FaTrashAlt } from "react-icons/fa";
import { HiX } from "react-icons/hi";
import { Toast } from 'flowbite-react'
import { CheckoutPreview } from '@/api/services/apiPemesanan'

const CartPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingCheckout, setIsLoadingCheckout] = useState(false);
    const [error, setError] = useState("");
    const [cart, setCart] = useState([]);
    const [checkedItems, setCheckedItems] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

    const toastTimeout = useRef(null);
    const [showToast, setShowToast] = useState(false);

    const stickyRef = useRef(null);
    const [isStuck, setIsStuck] = useState(false);
    const navigate = useNavigate();

    const toggleItem = (id) => {
        setCheckedItems((prev) =>
            prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
        );
        console.log(checkedItems);
    };

    const toggleAll = () => {
        setSelectAll((prevSelectAll) => {
            const newSelectAll = !prevSelectAll;
            setCheckedItems(newSelectAll ? cart.map(item => item.id_barang) : []);
            return newSelectAll;
        });
    };

    const toggleToast = () => {
        setShowToast(true);
        if (toastTimeout.current) {
            clearTimeout(toastTimeout.current);
        }
        toastTimeout.current = setTimeout(() => {
            setShowToast(false);
        }, 3000);
    };

    const totalChecked = checkedItems.length;
    const totalPrice = cart
        .filter((item) => checkedItems.includes(item.id_barang))
        .reduce((sum, item) => sum + parseInt(item.barang.harga), 0)
        .toLocaleString('id-ID');

    const fetchCart = () => {
        setIsLoading(true);
        GetCart()
            .then((res) => {
                setCart(res.data);
            })
            .catch((err) => {
                setError(err.message || "Gagal mengambil data.");
            })
            .finally(() => setIsLoading(false));
    }

    const deleteCart = (cartId) => {
        const confirmed = confirm("Apakah anda yakin ingin menghapus barang dari keranjang?");
        if (confirmed) {
            DeleteCart(cartId)
                .then((response) => {
                    toggleToast();
                    fetchCart();
                    window.dispatchEvent(new Event('cartChanged'));
                })
                .catch((err) => {
                    console.log(err);
                    setError(err.message);
                })
        }
    }

    const checkout = () => {
        setIsLoadingCheckout(true);

        CheckoutPreview({ id_barang: checkedItems })
            .then((res) => {
                if (res.status) {
                    navigate("/pembeli/checkout", {
                        state: {
                            barang: res.data,
                            alamat: res.alamat,
                            poin: res.poin,
                        },
                    });
                } else {
                    setError(res.message || "Gagal mendapatkan data checkout.");
                    toggleToast();
                }
            })
            .catch((err) => {
                setError(err.response.data.message || "Terjadi kesalahan saat checkout.");
                toggleToast();
                if (err.response && err.response.status === 409) {
                    fetchCart();
                }
            })
            .finally(() => {
                setIsLoadingCheckout(false);
            });
    };


    useEffect(() => {
        fetchCart();
    }, []);

    useEffect(() => {
        setCheckedItems([]);
        setSelectAll(false);
    }, [cart]);

    useEffect(() => {
        const handleScroll = () => {
            if (stickyRef.current) {
                const rect = stickyRef.current.getBoundingClientRect();
                setIsStuck(rect.bottom >= window.innerHeight);
            }
        };

        window.addEventListener("scroll", handleScroll);
        handleScroll();

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            <Helmet>
                <title>Keranjang - Reusemart</title>
            </Helmet>

            <div className="container min-h-screen mx-auto px-4 py-8">
                {isLoading ? (
                    <>
                        <div className='flex min-h-screen items-center justify-center'>
                            <PulseLoader size={8} color="#057A55" />
                        </div>
                    </>
                ) : (
                    <>
                        <div className="max-w-6xl mx-auto @container relative">
                            <h1 className='text-4xl font-bold'>Keranjang</h1>
                            <div className='space-y-4'>
                                <Card className='shadow-sm rounded-t-md rounded-b-none mt-4'>
                                    <div className='flex items-center'>
                                        <input
                                            id="default-checkbox"
                                            type="checkbox"
                                            value=""
                                            checked={selectAll}
                                            onChange={toggleAll}
                                            className="w-4 h-4 accent-green-500 hover:cursor-pointer"
                                        />
                                        <label htmlFor="default-checkbox" className="ms-2">
                                            <span className='ms-2 text-lg font-bold'>Pilih Semua</span>
                                            <span className='ms-2 text-lg font-medium text-gray-400'>({cart.length})</span>
                                        </label>
                                    </div>
                                </Card>
                                {cart.length === 0
                                    ? (
                                        <>
                                            <div className='flex items-center justify-center'>
                                                <h1 className='text-xl font-bold text-gray-400 mt-7'>Keranjang kosong</h1>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            {cart.map((item, index) => (
                                                <Card
                                                    key={index}
                                                    className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200 rounded-none overflow-hidden"
                                                >
                                                    <div className="flex space-x-4">
                                                        <input
                                                            id={`checkbox-${item.id_cart}`}
                                                            type="checkbox"
                                                            checked={checkedItems.includes(item.id_barang)}
                                                            onChange={() => toggleItem(item.id_barang)}
                                                            className="w-4 h-4 accent-green-500 self-center hover:cursor-pointer"
                                                        />
                                                        <Link to={`/products/detail/${item.id_barang}`} className='no-underline flex space-x-4'>
                                                            <img
                                                                src={
                                                                    item.barang.url_gambar_barang
                                                                        ? getGambarBarang(item.barang.url_gambar_barang.split(";")[0])
                                                                        : "/logo.png"
                                                                }
                                                                alt={item.barang.nama_barang}
                                                                className="w-16 h-16 object-cover rounded-md"
                                                                onError={(e) => (e.target.src = "/logo.png")}
                                                            />
                                                            <div className="flex flex-col items-start">
                                                                <h4 className="text-md font-semibold text-gray-800 line-clamp-2 self-start">
                                                                    {item.barang.nama_barang}
                                                                </h4>
                                                                <p className="text-base font-bold text-gray-900">
                                                                    Rp{parseInt(item.barang.harga).toLocaleString("id-ID")}
                                                                </p>
                                                            </div>
                                                        </Link>
                                                        <div className='flex-1'></div>
                                                        <button
                                                            onClick={() => deleteCart(item.id_cart)}
                                                            className="w-8 h-8 self-center text-gray-400 hover:text-red-500 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-red-300 rounded-sm flex items-center justify-center hover:cursor-pointer"
                                                            type="button"
                                                            aria-label="Hapus item dari keranjang"
                                                        >
                                                            <FaTrashAlt className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                </Card>
                                            ))}
                                        </>
                                    )
                                }
                            </div>

                            {cart.length > 0 && (
                                <Card
                                    ref={stickyRef}
                                    className={`sticky bottom-0 rounded-t-none rounded-b-md mt-4 transition-all duration-300 bg-white z-10 ${isStuck
                                        ? 'shadow-[0_-10px_20px_-6px_rgba(0,0,0,0.15)] translate-y-0'
                                        : 'translate-y-1'
                                        }`}
                                >
                                    <div className="flex items-center max-w-7xl ms-auto">
                                        <div className="flex items-center space-x-2 me-4">
                                            <span className="text-lg font-semibold text-gray-800">
                                                Total ({totalChecked} barang):
                                            </span>
                                            <span className="text-lg font-bold text-gray-900">
                                                Rp{totalPrice}
                                            </span>
                                        </div>
                                        <button
                                            className="px-6 py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-700 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 hover:cursor-pointer disabled:hover:cursor-default"
                                            disabled={totalChecked === 0 || isLoadingCheckout}
                                            onClick={() => checkout()}
                                        >
                                            Checkout
                                        </button>
                                    </div>
                                </Card>
                            )}
                        </div>

                        {showToast && (
                            <div className="fixed top-4 right-4">
                                <Toast>
                                    <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200">
                                        <HiX className="h-5 w-5" />
                                    </div>
                                    <div className="ml-3 text-sm font-normal">{error ? error : "Cart berhasil dihapus."}</div>
                                </Toast>
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
}

export default CartPage