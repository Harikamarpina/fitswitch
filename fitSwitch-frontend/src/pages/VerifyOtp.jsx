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
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-zinc-800 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-8 shadow-xl">
        <h2 className="text-3xl font-bold">Verify OTP</h2>
        <p className="text-zinc-300 mt-1 text-sm">
          Enter the 6-digit OTP sent to your email.
        </p>

        {error && (
          <div className="mt-4 bg-red-500/10 border border-red-500/30 text-red-200 p-3 rounded-lg text-sm">
            {error}
            {showResend && (
              <div className="mt-2">
                <button
                  onClick={handleResendOtp}
                  disabled={resendLoading}
                  className="text-lime-400 hover:text-lime-300 underline text-sm disabled:opacity-60"
                >
                  {resendLoading ? "Sending..." : "Send Again"}
                </button>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <div>
            <label className="text-sm text-zinc-300">Email</label>
            <input
              value={email}
              readOnly
              className="mt-1 w-full px-4 py-3 rounded-xl bg-black/30 border border-white/10 opacity-80"
            />
          </div>

          <div>
            <label className="text-sm text-zinc-300">OTP</label>
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="Enter 6-digit OTP"
              className="mt-1 w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:outline-none focus:ring-2 focus:ring-lime-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-lime-500 hover:bg-lime-400 text-black font-semibold py-3 rounded-xl transition disabled:opacity-60"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <p className="text-sm text-zinc-300 mt-5">
          Back to{" "}
          <Link to="/register" className="text-lime-400 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
