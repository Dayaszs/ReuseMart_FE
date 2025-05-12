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

export { ShowPegawai, ResetPassword };