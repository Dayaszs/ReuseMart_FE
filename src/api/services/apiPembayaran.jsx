import useAxios from "..";

const GetPembayaran = async () => {
    try {
        const response = await useAxios.get("/pembayaran", {
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
        const response = await useAxios.delete(`/pembayaran/${pembayaranId}`, {
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

const VerifikasiPembayaran = async (pembayaranId) => {
    try {
        const response = await useAxios.put(`/pembayaran/${pembayaranId}/verifikasi`, {
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

export { GetPembayaran, ShowDetailPembayaran, UploadBuktiPembayaran, DeleteBuktiPembayaran };