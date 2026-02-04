import axiosInstance from "./axiosInstance";

// Membership session APIs
export const getMembershipSession = (membershipId) => {
  return axiosInstance.get("/user/membership-session/current", {
    params: { membershipId }
  });
};

export const checkInToMembership = (membershipId) => {
  return axiosInstance.post("/user/membership-session/check-in", { membershipId });
};

export const checkOutFromMembership = (membershipId) => {
  return axiosInstance.post("/user/membership-session/check-out", { membershipId });
};

// Facility session APIs
export const getFacilitySession = (facilitySubscriptionId) => {
  return axiosInstance.get("/user/facility-session/current", {
    params: { facilitySubscriptionId }
  });
};

export const getFacilityAccessToday = (facilitySubscriptionId) => {
  return axiosInstance.get("/user/facility-session/today", {
    params: { facilitySubscriptionId }
  });
};

export const getActiveMembershipSessions = () => {
  return axiosInstance.get("/user/membership-session/active");
};

export const getActiveFacilitySessions = () => {
  return axiosInstance.get("/user/facility-session/active");
};

export const checkInToFacility = (facilitySubscriptionId) => {
  return axiosInstance.post("/user/facility-session/check-in", { facilitySubscriptionId });
};

export const checkOutFromFacility = (facilitySubscriptionId) => {
  return axiosInstance.post("/user/facility-session/check-out", { facilitySubscriptionId });
};
