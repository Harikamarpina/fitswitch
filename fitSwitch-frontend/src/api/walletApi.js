import axiosInstance from './axiosInstance';

// Get wallet balance
export const getWalletBalance = async () => {
  try {
    const response = await axiosInstance.get('/api/wallet/balance');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Add money to wallet
export const addMoney = async (amount) => {
  try {
    const response = await axiosInstance.post('/api/wallet/add-money', { amount });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Use facility with wallet
export const useFacility = async (gymId, facilityId) => {
  try {
    const response = await axiosInstance.post('/api/wallet/use-facility', {
      gymId,
      facilityId
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get wallet transaction history
export const getTransactionHistory = async () => {
  try {
    const response = await axiosInstance.get('/api/wallet/transactions');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Switch membership
export const switchMembership = async (currentMembershipId, newGymId, newPlanId) => {
  try {
    const response = await axiosInstance.post('/api/membership/switch', {
      currentMembershipId,
      newGymId,
      newPlanId
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
