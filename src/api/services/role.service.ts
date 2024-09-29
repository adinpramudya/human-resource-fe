import axios from "axios";
import { RoleModel } from "../models/role.model";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}roles`;

export class RoleService {
  constructor() {}
  getAll = async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      throw new Error("Gagal mendapatkan data");
    }
  };
  update = async (id: number, role: RoleModel) => {
    try {
      const response = await axios.patch(`${API_URL}/${id}`, role);
      return response.data;
    } catch (error) {
      throw new Error("Gagal membuat data");
    }
  };
  findById = async (id: number) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw new Error("Gagal mendapatkan data");
    }
  };
  create = async (role: RoleModel) => {
    try {
      const response = await axios.post(`${API_URL}`, role);
      return response.data;
    } catch (error) {
      throw new Error("Gagal membuat data");
    }
  };
}
