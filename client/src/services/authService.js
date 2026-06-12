import axios from "axios";
import API_BASE from "../config";

const API = `${API_BASE}/api/auth`;

export const registerUser = async (userData) => {
  const response = await axios.post(`${API}/register`, userData);
  return response.data;
};

export const loginUser = async (userData) => {
  const response = await axios.post(`${API}/login`, userData);
  return response.data;
};