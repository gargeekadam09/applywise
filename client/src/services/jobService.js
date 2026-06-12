import axios from "axios";
import API_BASE from "../config";

const API = `${API_BASE}/api/jobs`;

const getToken = () => localStorage.getItem("token");

export const getJobs = async () => {
  const response = await axios.get(API, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return response.data;
};

export const getJobById = async (jobId) => {
  const response = await axios.get(`${API}/${jobId}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data;
};

export const createJob = async (jobData) => {
  const response = await axios.post(API, jobData, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return response.data;
};

export const deleteJob = async (jobId) => {
  const response = await axios.delete(`${API}/${jobId}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return response.data;
};

export const updateJob = async (jobId, updatedData) => {
  const response = await axios.put(
    `${API}/${jobId}`,
    updatedData,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  return response.data;
};