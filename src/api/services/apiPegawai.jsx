import useAxios from "..";

const ShowPegawai = async (data) => {
    try {
        const response = await useAxios.post("/admin/pegawai/show", data, {
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