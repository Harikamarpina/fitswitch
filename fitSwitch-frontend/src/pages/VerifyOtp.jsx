import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { verifyOtp, resendOtp } from "../api/authApi";

export default function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState("");
  const [showResend, setShowResend] = useState(false);

  useEffect(() => {
    const incomingEmail = location?.state?.email;
    if (incomingEmail) setEmail(incomingEmail);
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setShowResend(false);

    if (!email.trim()) return setError("Email is required");
    if (!otp.trim()) return setError("OTP is required");
    if (otp.length !== 6) return setError("OTP must be 6 digits");

    try {
      setLoading(true);
      const res = await verifyOtp({ email, otp });
      
      if (!res.data.success) {
        setError(res.data.message || "OTP verification failed");
        if (res.data.message === "OTP has expired") {
          setShowResend(true);
        }
        return;
      }

      navigate("/login", { state: { email } });
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data ||
        "OTP verification failed";
      setError(msg);
      if (msg === "OTP has expired") {
        setShowResend(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError("");
    setShowResend(false);
    
    try {
      setResendLoading(true);
      const res = await resendOtp(email);
      
      if (!res.data.success) {
        setError(res.data.message || "Failed to resend OTP");
        return;
      }
      
      setError("");
      alert("OTP sent successfully! Please check your email.");
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data ||
        "Failed to resend OTP";
      setError(msg);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight">Verify OTP</h2>
          <p className="text-zinc-400 mt-2">
            Enter the 6-digit OTP sent to your email
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm">
            {error}
            {showResend && (
              <div className="mt-2">
                <button
                  onClick={handleResendOtp}
                  disabled={resendLoading}
                  className="text-lime-500 hover:text-lime-400 font-semibold underline text-sm disabled:opacity-50"
                >
                  {resendLoading ? "Resending..." : "Resend OTP"}
                </button>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-400 ml-1">Email Address</label>
            <input
              value={email}
              readOnly
              className="w-full px-4 py-3 rounded-xl bg-zinc-950/50 border border-zinc-800 text-zinc-500 cursor-not-allowed outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-400 ml-1">One-Time Password</label>
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="000000"
              className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-center text-2xl tracking-[0.5em] font-mono focus:outline-none focus:ring-2 focus:ring-lime-500/20 focus:border-lime-500 transition-all placeholder:text-zinc-800 placeholder:tracking-normal"
            />
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
                Verifying...
              </span>
            ) : "Verify Account"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-zinc-800 text-center">
          <p className="text-zinc-400 text-sm">
            Entered wrong email?{" "}
            <Link to="/register" className="text-lime-500 font-semibold hover:text-lime-400 transition-colors">
              Go back
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
