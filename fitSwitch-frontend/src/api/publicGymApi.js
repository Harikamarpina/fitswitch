import axiosInstance from "./axiosInstance";

// Get all public gyms
export const getPublicGyms = () =>
  axiosInstance.get("/gyms");

// Get gym details
export const getGymDetails = (gymId) =>
  axiosInstance.get(`/gyms/${gymId}`);

// Get gym facilities
export const getGymFacilities = (gymId) =>
  axiosInstance.get(`/gyms/${gymId}/facilities`);

// Get gym plans
export const getGymPlans = (gymId) =>
  axiosInstance.get(`/gyms/${gymId}/plans`);