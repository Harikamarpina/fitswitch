import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../api/authApi";
import { Eye, EyeOff } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  


  const [form, setForm] = useState({
    fullName: "",
    email: "",
    mobile: "",
    password: "",
    role: "USER",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    if (!form.fullName.trim()) return "Full name is required";
    if (!form.email.trim()) return "Email is required";
    if (!form.password.trim()) return "Password is required";
    if (form.password.length < 6) return "Password must be at least 6 characters";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const msg = validate();
    if (msg) return setError(msg);

    try {
      setLoading(true);
      const res = await registerUser(form);

      // Check if registration was successful
      if (!res.data.success) {
        setError(res.data.message || "Registration failed");
        return;
      }

      // navigate to otp screen with email
      navigate("/verify-otp", { state: { email: form.email } });
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data ||
        "Registration failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-zinc-800 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-8 shadow-xl">
        <h2 className="text-3xl font-bold">Create Account</h2>
        <p className="text-zinc-300 mt-1 text-sm">
          Join FitSwitch and start your fitness journey 💪
        </p>

        {error && (
          <div className="mt-4 bg-red-500/10 border border-red-500/30 text-red-200 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <Input
            label="Full Name"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            placeholder="Enter your name"
          />
          <Input
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />
          <Input
            label="Mobile (optional)"
            name="mobile"
            value={form.mobile}
            onChange={handleChange}
            placeholder="Enter mobile number"
          />
          <div>
  <label className="text-sm text-zinc-300">Password</label>

  <div className="mt-1 relative">
    <input
      name="password"
      type={showPassword ? "text" : "password"}
      value={form.password}
      onChange={handleChange}
      placeholder="Create password"
      className="w-full px-4 py-3 pr-14 rounded-xl bg-black/40 border border-white/10 focus:outline-none focus:ring-2 focus:ring-lime-400"
    />

    <button
      type="button"
      onClick={() => setShowPassword((prev) => !prev)}
      className="absolute right-3 top-1/2 -translate-y-1/2
                 text-white text-lg font-bold
                 px-2 py-1 rounded-lg border border-white/20
                 hover:bg-white/10 transition"
      aria-label="Toggle password visibility"
      title="Toggle password visibility"
    >
      {showPassword ? <EyeOff size={18} color="white" /> : <Eye size={18} color="white" />}
    </button>
  </div>
</div>

          <div>
            <label className="text-sm text-zinc-300">Role</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:outline-none focus:ring-2 focus:ring-lime-400"
            >
              <option value="USER">USER</option>
              <option value="OWNER">OWNER</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-lime-500 hover:bg-lime-400 text-black font-semibold py-3 rounded-xl transition disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Register & Get OTP"}
          </button>
        </form>

        <p className="text-sm text-zinc-300 mt-5">
          Already have an account?{" "}
          <Link to="/login" className="text-lime-400 hover:underline">
            Login
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
