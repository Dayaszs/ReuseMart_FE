import useAxios from "..";

const ShowRincianPenitipan = async(page = 1, search = "") =>{
    try{
        const response = await useAxios.get(`/rincian-penitipan?page=${page}&search=${search}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });

        return response.data;
    }catch(error){
        throw error.response.data;
    }
}

export { ShowRincianPenitipan };