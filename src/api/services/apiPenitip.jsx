import useAxios from "..";

const GetPenitip = async () => {
    try {
        const response = await useAxios.get("/penitip/profile", {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};
const GetBarangTerjual = async () => {
    try {
        const response = await useAxios.get("/penitip/transaksi", {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        console.log(response.data);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

const GetDetailBarangTerjual = async (id) => {
    try {
        const response = await useAxios.get(`/penitip/transaksi/${id}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        console.log(response.data);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export { GetPenitip, GetBarangTerjual, GetDetailBarangTerjual };
