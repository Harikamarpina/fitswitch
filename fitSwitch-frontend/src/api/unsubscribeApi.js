import axiosInstance from './axiosInstance';

// Create unsubscribe request
export const createUnsubscribeRequest = async (membershipId, reason) => {
  try {
    const response = await axiosInstance.post('/user/subscription/unsubscribe', {
      membershipId,
      reason
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get user's unsubscribe requests
export const getUserUnsubscribeRequests = async () => {
  try {
    const response = await axiosInstance.get('/user/unsubscribe-requests');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get owner's unsubscribe requests
export const getOwnerUnsubscribeRequests = async () => {
  try {
    const response = await axiosInstance.get('/owner/unsubscribe-requests');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Approve unsubscribe request
export const approveUnsubscribeRequest = async (requestId, ownerNotes) => {
  try {
    const response = await axiosInstance.post(`/owner/unsubscribe-requests/${requestId}/approve`, {
      ownerNotes
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Reject unsubscribe request
export const rejectUnsubscribeRequest = async (requestId, ownerNotes) => {
  try {
    const response = await axiosInstance.post(`/owner/unsubscribe-requests/${requestId}/reject`, {
      ownerNotes
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};