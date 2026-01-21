import { useState } from "react";
import api from "../api/services";

export default function SignUp() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "viewer",
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
    <div className="min-h-screen flex bg-gray-100">
      
      {/* LEFT PANEL */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-indigo-600 to-purple-700 text-white p-16 flex-col justify-center">
        <h1 className="text-4xl font-bold mb-6">
          Digital Signage Platform
        </h1>

        <p className="text-lg mb-8 opacity-90">
          Manage screens, playlists, users and analytics from one powerful dashboard.
        </p>

        <ul className="space-y-4 text-base">
          <li>📺 Multi-screen management</li>
          <li>🎞 Playlist scheduling</li>
          <li>🔐 Role-based access</li>
          <li>📊 Playback analytics</li>
          <li>🔄 Real-time updates</li>
        </ul>
      </div>

      {/* RIGHT FORM PANEL */}
      <div className="w-full lg:w-1/2 flex items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
          
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Create Account
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Add a new user to the platform
          </p>

          <form onSubmit={submit} className="space-y-4">
            
            <div>
              <label className="text-sm text-gray-600">Name</label>
              <input
                placeholder="John Doe"
                className="w-full mt-1 border px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                onChange={e => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Email</label>
              <input
                type="email"
                placeholder="user@example.com"
                className="w-full mt-1 border px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full mt-1 border px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Role</label>
              <select
                className="w-full mt-1 border px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                onChange={e => setForm({ ...form, role: e.target.value })}
              >
                <option value="viewer">Viewer</option>
                <option value="editor">Editor</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-semibold transition"
            >
              Create User
            </button>
          </form>

          <p className="mt-6 text-xs text-center text-gray-400">
            © {new Date().getFullYear()} Digital Signage Platform
          </p>
        </div>
      </div>
    </div>
  );
}
