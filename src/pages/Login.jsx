import { useState } from "react";
import api from "../api/services";
import { isAuthenticated } from "../utils/auth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

 useEffect(() => {
  if (isAuthenticated()) {
    navigate("/", { replace: true });
  }
}, [navigate]);

  async function login() {
  setError("");
  setLoading(true);

  try {
    const res = await api.post("/auth/login", {
      email,
      password,
    });

    // ✅ SAVE AUTH DATA
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("refreshToken", res.data.refreshToken);
    localStorage.setItem("user", JSON.stringify(res.data.user));

    // ✅ REDIRECT (remember last page)
    const lastPath = localStorage.getItem("lastPath") || "/";
    navigate(lastPath, { replace: true });

  } catch (err) {
    console.error("LOGIN ERROR:", err);

    setError(
      err.response?.data?.error ||
      err.response?.data?.message ||
      "Invalid email or password"
    );
  } finally {
    setLoading(false);
  }
}


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8">
        
        {/* HEADER */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Sign in to Dashboard
          </h1>
          <p className="text-gray-500 text-sm">
            Digital Signage Admin Panel
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        {/* FORM */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              type="email"
              placeholder="admin@example.com"
              onChange={e => setEmail(e.target.value)}
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              onChange={e => setPassword(e.target.value)}
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <button
            onClick={login}
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-medium transition disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </div>

        {/* FOOTER */}
        <div className="mt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Digital Signage
        </div>
      </div>
    </div>
  );
}
