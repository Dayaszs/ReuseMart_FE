import useAxios from "..";

const GetOrganisasi = async (page = 1, search = "") => {
    try {
        const response = await useAxios.get(`/admin/organisasi?page=${page}&search=${search}`, {
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

const DeleteOrganisasi = async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
        const response = await useAxios.delete(`/admin/organisasi/${id}`, {
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

export { GetOrganisasi, DeleteOrganisasi };
