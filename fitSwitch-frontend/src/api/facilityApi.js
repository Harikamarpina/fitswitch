import axiosInstance from "./axiosInstance";

// ✅ Public (User)
export const getGymFacilitiesPublic = (gymId) => {
  return axiosInstance.get(`/gyms/${gymId}/facilities`);
};

// ✅ Owner
export const getGymFacilitiesOwner = (gymId) => {
  return axiosInstance.get(`/owner/facilities/gym/${gymId}`);
};

export const addFacility = (data) => {
  return axiosInstance.post(`/owner/facilities`, data);
};

export const updateFacility = (facilityId, data) => {
  return axiosInstance.put(`/owner/facilities/${facilityId}`, data);
};

// Get all facility plans for owner
export const getAllOwnerFacilityPlans = () => {
  return axiosInstance.get(`/owner/facility-plans`);
};

// Get facility plans grouped by gym (public)
export const getGymFacilityPlans = (gymId) => {
  return axiosInstance.get(`/gyms/${gymId}/facility-plans`);
};

// Get users who purchased a specific gym plan
export const getGymPlanUsers = (gymId, planId) => {
  return axiosInstance.get(`/owner/gyms/${gymId}/plans/${planId}/users`);
};

// Get users who purchased a specific facility plan
export const getFacilityPlanUsers = (gymId, facilityId, planId) => {
  return axiosInstance.get(`/owner/gyms/${gymId}/facilities/${facilityId}/plans/${planId}/users`);
};
