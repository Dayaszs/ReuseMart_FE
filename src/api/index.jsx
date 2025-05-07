import axios from "axios";
export const BASE_URL = "http://127.0.0.1:8000"

export const getProfilePicture = (url_gambar) => {
    return `${BASE_URL}/storage/profile/${url_gambar}`;
}

export const getGambarBarang = (url_gambar) => {
    return `${BASE_URL}/storage/barang/${url_gambar}`;
}

const useAxios = axios.create({
    baseURL: `${BASE_URL}/api`,
});

export default useAxios; 
