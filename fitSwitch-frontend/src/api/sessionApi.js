import axiosInstance from "./axiosInstance";

// Get current session status
export const getCurrentSession = () => {
  return axiosInstance.get("/user/session/current");
};

// Check in to gym
export const checkInToGym = (gymId) => {
  return axiosInstance.post("/user/session/check-in", { gymId });
};

// Check out from gym
export const checkOutFromGym = () => {
  return axiosInstance.post("/user/session/check-out");
};