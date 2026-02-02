import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api/authApi";
import { Eye, EyeOff } from "lucide-react";






export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const incomingEmail = location?.state?.email;
    if (incomingEmail) {
      setForm((prev) => ({ ...prev, email: incomingEmail }));
    }
  }, [location]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email.trim()) return setError("Email is required");
    if (!form.password.trim()) return setError("Password is required");

    try {
      setLoading(true);
      const res = await loginUser(form);

      // Check if login was successful
      if (!res.data.success) {
        setError(res.data.message || "Login failed");
        return;
      }

      // Extract data from nested response structure
      const { token, email, role, userId } = res.data.data;
      localStorage.setItem("token", token);
      localStorage.setItem("email", email);
      localStorage.setItem("role", role);
      localStorage.setItem("userId", userId);

      navigate("/dashboard");
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data ||
        "Login failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-zinc-800 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-8 shadow-xl">
        <h2 className="text-3xl font-bold">Welcome Back</h2>
        <p className="text-zinc-300 mt-1 text-sm">
          Login to continue your fitness journey 🔥
        </p>

        {error && (
          <div className="mt-4 bg-red-500/10 border border-red-500/30 text-red-200 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <Input
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter email"
          />
          <div>
  <label className="text-sm text-zinc-300">Password</label>

  <div className="mt-1 relative">
    <input
      name="password"
      type={showPassword ? "text" : "password"}
      value={form.password}
      onChange={handleChange}
      placeholder="Enter password"
      className="w-full px-4 py-3 pr-14 rounded-xl bg-black/40 border border-white/10 focus:outline-none focus:ring-2 focus:ring-lime-400"
    />

    <button
      type="button"
      onClick={() => setShowPassword((prev) => !prev)}
      className="absolute right-3 top-1/2 -translate-y-1/2
                 text-white
                 px-2 py-2 rounded-lg border border-white/20
                 hover:bg-white/10 transition"
      aria-label="Toggle password visibility"
      title="Toggle password visibility"
    >
      {showPassword ? (
        <EyeOff size={20} className="text-white" />
      ) : (
        <Eye size={20} className="text-white" />
      )}
    </button>
  </div>
</div>

          <button
            type="submit"
            disabled={loading}
            className="bg-lime-500 hover:bg-lime-400 text-black font-semibold py-3 rounded-xl transition disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-sm text-zinc-300 mt-5">
          Don’t have an account?{" "}
          <Link to="/register" className="text-lime-400 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div>
      <label className="text-sm text-zinc-300">{label}</label>
      <input
        {...props}
        className="mt-1 w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:outline-none focus:ring-2 focus:ring-lime-400"
      />
    </div>
  );
}
