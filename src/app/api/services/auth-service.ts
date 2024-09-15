import axios from "axios";

const API_URL = `http://localhost:8000/api/v1/auth`; // Ganti dengan URL API NestJS Anda

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(API_URL, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw new Error("Gagal login");
  }
};

// Tambahkan fungsi lain sesuai kebutuhan
