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

const CreatePegawai = async(data) =>{
    try{
        const response = useAxios.post('/admin/pegawai', data,{
            headers:{
                "Content-Type":"application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });
        console.log(response.data);

        return response.data;
    }catch(error){
        throw error.response.data;
    }
};

const UpdatePegawai = async(id, data) =>{
    try{
        const response = useAxios.put(`/admin/pegawai/${id}`, data,{
            headers:{
                "Content-Type":"application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            },
        });

        return response.data;
    }catch(error){
        throw error.response.data;
    }
}

const DeletePegawai = async(id) => {
    try{
        const response = await useAxios.delete(`/admin/pegawai/${id}`, {
            headers:{
                "Content-Type": "application/json",
                Authorization:`Bearer ${localStorage.getItem("token")}`
            }
        });

        return response.data;
    }catch(error){
        throw error.response.data;
    }
}

export { ShowPegawai, ResetPassword, CreatePegawai, UpdatePegawai, DeletePegawai };