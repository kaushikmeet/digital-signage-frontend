import { useState } from "react";
import api from "../api/services";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function login() {
    const res = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", res.data.token);
    window.location = "/";
  }

  return (
    <>
      <input onChange={e => setEmail(e.target.value)} />
      <input type="password" onChange={e => setPassword(e.target.value)} />
      <button onClick={login}>Login</button>
    </>
  );
}
