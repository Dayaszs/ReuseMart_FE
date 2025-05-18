import useAxios from "..";

const GetCart = async () => {
    try {
        const response = await useAxios.get("/cart", {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        return response.data;
    } catch (error) {
        console.log(error.response.data);
        throw error.response.data;
    }
};

const TambahCart = async (barangId) => {
    try {
        const response = await useAxios.post(`/cart/${barangId}`, {
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

const DeleteCart = async (cartId) => {
    try {
        const response = await useAxios.delete(`/cart/${cartId}`, {
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

export { GetCart, TambahCart, DeleteCart };