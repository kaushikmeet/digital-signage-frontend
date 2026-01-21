export function isAuthenticated() {
  return !!localStorage.getItem("token");
}

export function getUser() {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}
