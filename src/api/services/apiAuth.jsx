import useAxios from "..";

const SignUpPembeli = async (data) => {
  try {
    const response = await useAxios.post("/register/pembeli", data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

const SignUpOrganisasi = async (data) => {
  try {
    const response = await useAxios.post("/register/organisasi", data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

const Login = async (data) => {
  try {
    const response = await useAxios.post("/login", data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

const SendResetLink = async (data) => {
  try {
    const response = await useAxios.post("/forgot-password", data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

const UpdatePassword = async (data) => {
  try {
    const response = await useAxios.post("/reset-password", data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export { SignUpPembeli, SignUpOrganisasi, Login, SendResetLink, UpdatePassword };
