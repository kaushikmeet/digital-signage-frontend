import { useState } from "react";
import api from "../api/services";

export default function SingUp() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "viewer"
  });

  async function submit(e) {
    e.preventDefault();
    try {
      const res = await api.post("/auth/register", form);
      localStorage.setItem("token", res.data.token);
      alert("User created successfully");
    } catch (err) {
      alert(err.response?.data?.error || "Register failed");
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Create User</h2>

      <form onSubmit={submit} className="space-y-3">
        <input
          placeholder="Name"
          className="w-full border p-2 rounded"
          onChange={e => setForm({ ...form, name: e.target.value })}
        />

        <input
          placeholder="Email"
          className="w-full border p-2 rounded"
          onChange={e => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded"
          onChange={e => setForm({ ...form, password: e.target.value })}
        />

        <select
          className="w-full border p-2 rounded"
          onChange={e => setForm({ ...form, role: e.target.value })}
        >
          <option value="viewer">Viewer</option>
          <option value="editor">Editor</option>
          <option value="admin">Admin</option>
        </select>

        <button className="w-full bg-indigo-600 text-white py-2 rounded">
          Register
        </button>
      </form>
    </div>
  );
}
