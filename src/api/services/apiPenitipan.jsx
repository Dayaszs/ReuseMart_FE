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

const editPenitipanBarang = async(data, id) => {
    try{
        const response = await useAxios.post(`/gudang/penitipan/edit/${id}`, data,{
            headers:{
                "Accept": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
        });

        console.log(response.data);
        return response;
    }catch(error){
        throw error.response.data;
    }
}

export { getAllPenitipan, editPenitipanBarang };