import useAxios from "..";

const GetDetailBarang = async (barangId) => {
    try {
        const response = await useAxios.get(`/barang/${barangId}/detail`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        console.log(response.barang);
        console.log(response.diskusi);
        return response.data;
    } catch (error) {
        console.log(error.response.data);
        throw error.response.data;
    }
};

const showBarangTersedia = async(page = 1, search = "")=> {
    try{
        const response = await useAxios.get(`/barang/home?page=${page}&search=${search}&status=Tersedia`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });

        return response.data;
    }catch(error){
        throw error.response.data;
    }
}

const showBarangByKategori = async(page = 1, min_kode, max_kode) =>{
    try{
        const response = await useAxios.get(`/kategori?&min_kode=${min_kode}&max_kode=${max_kode}&page=${page}`,{
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        
        return response.data;
    }catch(error){
        throw error.response.data;
    }
}

const showKategori = async() =>{
    try{
        const response = await useAxios.get(`/getAllKategori`,{
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });

        return response;
    }catch(error){
        throw error.response;
    }
}

// const TambahBarang = async (data) => {
//     try {
//         const response = await useAxios.post("/barang", data, {
//             headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `Bearer ${localStorage.getItem("token")}`,
//             },
//         });
//         console.log(response.data);
//         return response.data;
//     } catch (error) {
//         throw error.response.data;
//     }
// };

// const UpdateBarang = async (id, data) => {
//     try {
//         const response = await useAxios.put(`/barang/${id}`, data, {
//             headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `Bearer ${localStorage.getItem("token")}`,
//             },
//         });
//         return response.data;
//     } catch (error) {
//         throw error.response.data;
//     }
// };

// const DeleteBarang = async (id) => {
//     try {
//         const response = await useAxios.delete(`/barang/${id}`, {
//             headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `Bearer ${localStorage.getItem("token")}`,
//             },
//         });
//         return response.data;
//     } catch (error) {
//         throw error.response.data;
//     }
// };

export { GetDetailBarang, showBarangTersedia, showBarangByKategori, showKategori };