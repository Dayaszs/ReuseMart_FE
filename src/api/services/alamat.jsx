import useAxios from "..";

const GetAlamat = async (data) => {
    try {
        const response = await useAxios.post("/alamat", data, {
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

export { GetAlamat };