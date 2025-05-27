import useAxios from "..";

const getAllPenitipan = async(page = 1, search = "") => {
    try{
        const response = await useAxios.get(`/gudang/penitipan/show?page=${page}&search=${search}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });

        return response.data.data;
    }catch(error){
        throw error.response.data;
    }
}

export { getAllPenitipan };