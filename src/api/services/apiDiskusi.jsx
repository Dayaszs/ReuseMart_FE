import useAxios from "..";

const GetDiskusi = async (barangId) => {
    try {
        console.log(barangId);
        const response = await useAxios.get(`/barang/${barangId}/diskusi`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.log(error.response.data);
        throw error.response.data;
    }
};

const TambahDiskusi = async (barangId, data) => {
    try {
        const response = await useAxios.post(`/barang/${barangId}/diskusi`, data, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.log(error.response.data);
        throw error.response.data;
    }
};

export { GetDiskusi, TambahDiskusi };