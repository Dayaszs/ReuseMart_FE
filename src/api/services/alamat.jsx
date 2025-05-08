import useAxios from "..";

const GetAlamat = async () => {
    try {
        const response = await useAxios.get("/alamat", {
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

const TambahAlamat = async (data) => {
    try {
        const response = await useAxios.post("/alamat", data, {
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

const UpdateAlamat = async (id, data) => {
    try {
        const response = await useAxios.put(`/alamat/${id}`, data, {
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

const DeleteAlamat = async (id) => {
    try {
        const response = await useAxios.delete(`/alamat/${id}`, {
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

export { GetAlamat, TambahAlamat, UpdateAlamat, DeleteAlamat };