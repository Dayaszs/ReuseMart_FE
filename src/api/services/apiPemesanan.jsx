import useAxios from "..";

const CheckoutPreview = async (data) => {
    try {
        const response = await useAxios.post("/checkout-preview", data, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        return response.data;
    } catch (error) {
        console.log(error.response.data);
        throw error;
    }
};

const TambahPemesanan = async (data) => {
    try {
        const response = await useAxios.post("/checkout", data, {
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

export { CheckoutPreview, TambahPemesanan };