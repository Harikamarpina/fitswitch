import axiosInstance from "./axiosInstance";

export const createGym = (data) => axiosInstance.post("/owner/gyms", data);
export const getOwnerGyms = () => axiosInstance.get("/owner/gyms");
export const updateGym = (gymId, data) => axiosInstance.put(`/owner/gyms/${gymId}`, data);
export const getAllGyms = () => axiosInstance.get("/gyms");
export const getGymById = (gymId) => axiosInstance.get(`/gyms/${gymId}`);