import useAxios from "..";

const GetPembayaran = async (page = 1) => {
    try {
        const response = await useAxios.get(`/cs/pembayaran?page=${page}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

const ShowDetailPembayaran = async (pemesananId) => {
    try {
        const response = await useAxios.get(`/pembayaran/${pemesananId}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

const UploadBuktiPembayaran = async (pemesananId, data) => {
    try {
        const response = await useAxios.post(`/pembayaran/${pemesananId}`, data, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        return response.data;
    } catch (error) {
        console.log(error.response.data);
        throw error;
    }
}

const DeleteBuktiPembayaran = async (pembayaranId) => {
    try {
        const response = await useAxios.delete(`/cs/pembayaran/${pembayaranId}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        return response.data;
    } catch (error) {
        console.log(error.response.data);
        throw error;
    }
}

const VerifPembayaran = async (pembayaranId) => {
    try {
        const response = await useAxios.put(`/cs/pembayaran/${pembayaranId}/verifikasi`, {}, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export { GetPembayaran, ShowDetailPembayaran, UploadBuktiPembayaran, DeleteBuktiPembayaran, VerifPembayaran };