import useAxios from "..";

const showKlaimMerchandise = async (page = 1, search = "") => {
    try {
        const response = await useAxios.get(`/cs/merchandise?search=${search}&page=${page}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });

        return response;
    } catch (error) {
        console.log(error.response.data);
        throw error.response.data;
    }
};

const updateTanggalPengambilan = async(id) => {
    try {
        const response = await useAxios.put(`/cs/ambil-merchandise/${id}`, {}, {
            headers: {
                "Accept": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });

        return response;
    } catch (error) {
        console.log(error.response.data);
        throw error.response.data;
    }
}

export { showKlaimMerchandise, updateTanggalPengambilan };