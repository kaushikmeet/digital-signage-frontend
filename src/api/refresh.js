import api from "./services";

export async function refreshToken() {
  const refresh = localStorage.getItem("refreshToken");
  if (!refresh) throw new Error("No refresh token");

  const res = await api.post("/auth/refresh", { refresh });
  localStorage.setItem("token", res.data.token);
}
