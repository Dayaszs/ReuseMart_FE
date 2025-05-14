import useAxios from "..";

const showReqDonasi = async (page = 1, search = "") => {
    try{
        const token = localStorage.getItem("token");
        const response = await useAxios.get(`/owner/request/status?page=${page}&search=${search}&status=Pending`, {
            headers:{
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            },
        });

        return response.data;
    }catch(error){
        throw error.response.data;
    }
}

const showHistoriDonasi = async (page = 1, search = "") => {
    try{
        const token = localStorage.getItem("token");
        const response = await useAxios.get(`/owner/request/status?page=${page}&search=${search}&status=Selesai`, {
            headers:{
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            },
        });

        return response.data;
    }catch(error){
        throw error.response.data;
    }
}

export { showReqDonasi, showHistoriDonasi };