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
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight">Create Account</h2>
          <p className="text-zinc-400 mt-2">
            Join FitSwitch and start your fitness journey
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Full Name"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            placeholder="John Doe"
          />
          <Input
            label="Email Address"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="name@example.com"
          />
          <Input
            label="Mobile Number (Optional)"
            name="mobile"
            value={form.mobile}
            onChange={handleChange}
            placeholder="+91 98765 43210"
          />
          
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-400 ml-1">Password</label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 focus:outline-none focus:ring-2 focus:ring-lime-500/20 focus:border-lime-500 transition-all placeholder:text-zinc-600"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors p-1"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-400 ml-1">I am a</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 focus:outline-none focus:ring-2 focus:ring-lime-500/20 focus:border-lime-500 transition-all appearance-none cursor-pointer"
            >
              <option value="USER">User (Gym Member)</option>
              <option value="OWNER">Owner (Gym Manager)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-lime-500 hover:bg-lime-400 text-black font-bold py-3.5 rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-2 shadow-lg shadow-lime-500/10"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Account...
              </span>
            ) : "Register & Get OTP"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-zinc-800 text-center">
          <p className="text-zinc-400 text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-lime-500 font-semibold hover:text-lime-400 transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-zinc-400 ml-1">{label}</label>
      <input
        {...props}
        className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 focus:outline-none focus:ring-2 focus:ring-lime-500/20 focus:border-lime-500 transition-all placeholder:text-zinc-600"
      />
    </div>
  );
}
