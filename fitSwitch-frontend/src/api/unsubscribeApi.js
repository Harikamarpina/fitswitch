import axiosInstance from './axiosInstance';

// Get refund calculation
export const getRefundCalculation = async (membershipId) => {
  try {
    const response = await axiosInstance.get(`/api/user/membership/${membershipId}/refund-calculation`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Create unsubscribe request
export const createUnsubscribeRequest = async (membershipId, reason) => {
  try {
    console.log('Creating unsubscribe request:', { membershipId, reason });
    const response = await axiosInstance.post('/api/user/subscription/unsubscribe', {
      membershipId,
      reason
    });
    console.log('Unsubscribe request response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Unsubscribe API error:', error);
    console.error('Error response data:', error.response?.data);
    console.error('Error response status:', error.response?.status);
    console.error('Error response headers:', error.response?.headers);
    console.error('Full error object:', JSON.stringify(error.response?.data, null, 2));
    throw error.response?.data || error.message;
  }
};

// Get user's unsubscribe requests
export const getUserUnsubscribeRequests = async () => {
  try {
    const response = await axiosInstance.get('/api/user/unsubscribe-requests');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get owner's unsubscribe requests
export const getOwnerUnsubscribeRequests = async () => {
  try {
    const response = await axiosInstance.get('/api/owner/unsubscribe-requests');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Approve unsubscribe request
export const approveUnsubscribeRequest = async (requestId, ownerNotes) => {
  try {
    const response = await axiosInstance.post(`/api/owner/unsubscribe-requests/${requestId}/approve`, {
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
    const response = await axiosInstance.post(`/api/owner/unsubscribe-requests/${requestId}/reject`, {
      ownerNotes
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get approved refund requests
export const getApprovedRefundRequests = async () => {
  try {
    const response = await axiosInstance.get('/api/owner/refund-requests');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Process refund
export const processRefund = async (requestId) => {
  try {
    const response = await axiosInstance.post(`/api/owner/refund-requests/${requestId}/process`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};