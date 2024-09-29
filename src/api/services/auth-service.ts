import axios from "axios";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}login`;

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
