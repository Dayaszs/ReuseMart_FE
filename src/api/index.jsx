import axios from "axios";
export const BASE_URL = "http://127.0.0.1:8000"

export const getProfilePicture = (url_gambar) => {
    return `${BASE_URL}/storage/profile/${url_gambar}`;
}

// export const getGambarProduk = (url_gambar) => {
// jadinya satu kolom banyak link kah??
// }

const useAxios = axios.create({
    baseURL: `${BASE_URL}/api`,
});

export default useAxios; 
