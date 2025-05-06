import useAxios from "..";

const GetPenitip = async () => {
    try {
        const response = await useAxios.get("/penitip/profile", {
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

export { GetPenitip };
