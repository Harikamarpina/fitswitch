import axiosInstance from "./axiosInstance";

export const registerUser = (data) => axiosInstance.post("/auth/register", data);
export const verifyOtp = (data) => axiosInstance.post("/auth/verify-otp", data);
export const loginUser = (data) => axiosInstance.post("/auth/login", data);
export const resendOtp = (email) => axiosInstance.post(`/auth/resend-otp?email=${email}`);
export const getUserProfile = () => axiosInstance.get("/auth/profile");
