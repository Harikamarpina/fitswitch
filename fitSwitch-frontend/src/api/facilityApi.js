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
