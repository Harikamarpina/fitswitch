import axiosInstance from "./axiosInstance";

// User dashboard stats
export const getUserDashboardStats = () => {
  return axiosInstance.get("/user/dashboard/stats");
};

// Owner gym users
export const getGymUsers = (gymId) => {
  return axiosInstance.get(`/owner/gyms/${gymId}/users`);
};

// Owner user stats
export const getUserStats = (gymId, userId) => {
  return axiosInstance.get(`/owner/gyms/${gymId}/users/${userId}/stats`);
};