import axiosInstance from "./axiosInstance";

// Get all plans for a gym (OWNER)
export const getGymPlans = (gymId) =>
  axiosInstance.get(`/owner/plans/gym/${gymId}`);

// Get single plan
export const getPlan = (planId) =>
  axiosInstance.get(`/owner/plans/${planId}`);

// Add plan
export const addGymPlan = (data) =>
  axiosInstance.post("/owner/plans", data);

// Update plan
export const updateGymPlan = (planId, data) =>
  axiosInstance.put(`/owner/plans/${planId}`, data);
