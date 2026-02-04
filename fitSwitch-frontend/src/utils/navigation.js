export const getDashboardRoute = () => {
  const role = localStorage.getItem("role");
  
  switch (role) {
    case "USER":
      return "/user/dashboard";
    case "OWNER":
      return "/dashboard";
    default:
      return "/";
  }
};