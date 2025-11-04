export const isAdminAuthenticated = () => {
  return localStorage.getItem("isAdmin") === "true";
};

export const logoutAdmin = () => {
  localStorage.removeItem("isAdmin");
  localStorage.removeItem("adminUser");
  // reload to reset routes/UI
  window.location.href = "/login";
};
