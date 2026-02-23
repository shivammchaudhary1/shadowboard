import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showSuccess, showError } from "../store/slices/notificationSlice";
import api from "../config/api";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      dispatch(showError({ message: "Please fill in all fields" }));
      return;
    }
    if (password.length < 6) {
      dispatch(showError({ message: "Password must be at least 6 characters" }));
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", { email, password });
      if (data.success) {
        dispatch(
          showSuccess({
            message:
              "Registration successful! Check your email to verify your account.",
          }),
        );
        navigate("/login");
      }
    } catch (err) {
      dispatch(
        showError({
          message:
            err.response?.data?.message || "Registration failed. Please try again.",
        }),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="w-full max-w-md bg-slate-800 rounded-xl shadow-xl p-8 border border-slate-700">
        <h1 className="text-2xl font-bold text-center text-white mb-2">
          🎯 Shadow Board
        </h1>
        <p className="text-slate-400 text-center mb-6">
          Create an account to join the voting game
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-300 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-300 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="••••••••"
              minLength={6}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>
        <p className="mt-6 text-center text-slate-400 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
