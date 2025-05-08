import axios from "axios";
export const BASE_URL = "http://127.0.0.1:8000"

export const getProfilePictureOrganisasi = (url_gambar) => {
    return `${BASE_URL}/storage/profile/organisasi/${url_gambar}`;
}

export const getProfilePicturePembeli = (url_gambar) => {
    return `${BASE_URL}/storage/profile/pembeli/${url_gambar}`;
}

export const getGambarBarang = (url_gambar) => {
    return `${BASE_URL}/storage/barang/${url_gambar}`;
}

const useAxios = axios.create({
    baseURL: `${BASE_URL}/api`,
});

export default useAxios; 
