import useAxios from "..";

const showReqDonasi = async (page = 1, search = "") => {
    try{
        const token = localStorage.getItem("token");
        const response = await useAxios.get(`/owner/request/status?page=${page}&search=${search}&status=Pending`, {
            headers:{
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            },
        });

        return response.data;
    }catch(error){
        throw error.response.data;
    }
}

const showHistoriDonasi = async (page = 1, search = "") => {
    try{
        const token = localStorage.getItem("token");
        const response = await useAxios.get(`/owner/request/status?page=${page}&search=${search}&status=Selesai`, {
            headers:{
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            },
        });

        return response.data;
    }catch(error){
        throw error.response.data;
    }
}

const showBarangDonasi = async (page = 1, search = "") => {
    try{
        const token = localStorage.getItem("token");
        const response = await useAxios.get(`/owner/barang/donasi?page=${page}&search=${search}`, {
            headers:{
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            },
        });

        return response.data.data;
    }catch(error){
        throw error.response.data;
    }
}

const tambahDonasiBarang = async(data) =>{
    try{
        const response = await useAxios.post("/owner/donasi", data,{
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });

        console.log(response.data);
        return response.data;
    }catch(error){
        throw error.response.data;
    }
};

const tolakRequestDonasi = async(id) =>{
    try{
        const response = await useAxios.post(`/owner/donasi/${id}`, {}, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        console.log(response.data);

        return response.data;
    }catch(error){
        throw error.response.data
    }
}

const laporanStokGudang = async () => {
    try{
        const token = localStorage.getItem("token");
        const response = await useAxios.get(`/owner/barang/laporan-stok-gudang`, {
            headers:{
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            },
        });

        return response;
    }catch(error){
        throw error.response;
    }
}

const laporanKomisiBulanan = async (tanggal) => {
    try{
        const token = localStorage.getItem("token");
        const response = await useAxios.get(`/owner/barang/laporan-komisi-bulanan?tanggal=${tanggal}`, {
            headers:{
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            },
        });

        return response;
    }catch(error){
        throw error.response;
    }
}

const laporanPenjualanBulanan = async (tahun) => {
    try{
        const token = localStorage.getItem("token");
        const response = await useAxios.get(`/owner/barang/laporan-penjualan-bulanan?tahun=${tahun}`, {
            headers:{
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            },
        });

        return response;
    }catch(error){
        throw error.response;
    }
}

export { showReqDonasi, showHistoriDonasi, showBarangDonasi , tambahDonasiBarang, tolakRequestDonasi, laporanStokGudang, laporanKomisiBulanan , laporanPenjualanBulanan};