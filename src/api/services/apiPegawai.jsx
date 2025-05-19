import axios from "axios";
import useAxios from "..";

const ShowPegawai = async (page = 1, search = "") => {
    try {
        const response = await useAxios.get(`/admin/pegawai/show?page=${page}&search=${search}`, {
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

const ShowPegawaiByJabatan = async (id) => {
    try {
        const response = await useAxios.get(`/pegawai/jabatan/${id}`, {
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

const ResetPassword = async (id) => {
    try {
        const response = await useAxios.put(`/admin/pegawai/${id}/reset`, {}, {
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

const CreatePegawai = async (data) => {
    try {
        const response = await useAxios.post("/admin/pegawai", data, {
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

const GetPegawai = async (page = 1, search = "") => {
    try {
        const response = await useAxios.get(`/admin/pegawai?page=${page}&search=${search}`, {
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

const UpdatePegawai = async (id, data) => {
    try {
        console.log("data ddd: ",data);
        const response = await useAxios.post(`/admin/pegawai/${id}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

const DeletePegawai = async (id) => {
    try {
        const response = await useAxios.delete(`/admin/pegawai/${id}`, {
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

export { ShowPegawai, ResetPassword, GetPegawai, CreatePegawai, UpdatePegawai, DeletePegawai, ShowPegawaiByJabatan };
