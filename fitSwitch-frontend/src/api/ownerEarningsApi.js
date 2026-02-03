import axiosInstance from './axiosInstance';

// Get owner earnings
export const getOwnerEarnings = async () => {
  try {
    const response = await axiosInstance.get('/api/owner/earnings');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get gym-specific earnings
export const getGymEarnings = async (gymId) => {
  try {
    const response = await axiosInstance.get(`/api/owner/earnings/gym/${gymId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get total earnings
export const getTotalEarnings = async () => {
  try {
    const response = await axiosInstance.get('/api/owner/earnings/total');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get gym total earnings
export const getGymTotalEarnings = async (gymId) => {
  try {
    const response = await axiosInstance.get(`/api/owner/earnings/gym/${gymId}/total`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};