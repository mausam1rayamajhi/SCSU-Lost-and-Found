import { useState } from "react";
import api from "../api/client";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const setToken = useAuthStore((s) => s.setToken);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await api.post("/auth/login", { email, name: "", password });
      setToken(res.data.access_token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.detail ?? "Login failed");
    }
  };

  return (
    <div className="max-w-md mx-auto card">
      <h1 className="text-lg font-semibold mb-4">Login</h1>
      {error && <p className="text-xs text-red-600 mb-2">{error}</p>}
      <form onSubmit={onSubmit} className="space-y-3">
        <div>
          <label className="text-xs font-semibold block mb-1">Email</label>
          <input
            className="input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="text-xs font-semibold block mb-1">Password</label>
          <input
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button className="btn-primary w-full" type="submit">
          Sign in
        </button>
      </form>
    </div>
  );
}
