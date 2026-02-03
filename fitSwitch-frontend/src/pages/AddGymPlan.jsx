import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { addGymPlan } from "../api/planApi";

export default function AddGymPlan() {
  const { gymId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    planName: "",
    description: "",
    durationDays: "",
    durationMonths: "",
    price: "",
    passType: "REGULAR",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await addGymPlan({
        ...form,
        gymId,
        durationDays: Number(form.durationDays),
        durationMonths: Number(form.durationMonths),
        price: Number(form.price),
      });
      navigate(-1);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to add plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-4 py-12">
      <div className="max-w-xl mx-auto">
        {/* Header Section */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <Link
              to={`/owner/gyms/${gymId}/plans`}
              className="p-2 bg-zinc-900 hover:bg-zinc-800 rounded-xl transition-colors text-zinc-400 hover:text-white"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <span className="text-lime-400 font-medium tracking-wider uppercase text-[10px]">Gym Management</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Create <span className="text-lime-400">Gym Plan</span></h1>
          <p className="text-zinc-500 mt-2">Design a new membership tier for your facility.</p>
        </div>

        {error && (
          <div className="mb-8 bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-2xl flex items-center gap-3">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-zinc-900/30 border border-zinc-800/50 rounded-[2.5rem] p-8 sm:p-10 space-y-8"
        >
          <div className="space-y-6">
            <Input 
              label="PLAN NAME" 
              name="planName" 
              placeholder="e.g. Platinum Annual Membership"
              value={form.planName} 
              onChange={handleChange} 
              required 
            />

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">DESCRIPTION</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe the benefits and access levels of this plan..."
                className="w-full px-6 py-4 rounded-2xl bg-black border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-lime-400/50 transition-colors resize-none"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Input 
                label="DURATION (DAYS)" 
                name="durationDays" 
                type="number" 
                placeholder="30, 90, 365"
                value={form.durationDays} 
                onChange={handleChange} 
                required 
              />
              <Input 
                label="DURATION (MONTHS)" 
                name="durationMonths" 
                type="number" 
                placeholder="1, 3, 12"
                value={form.durationMonths} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Input 
                label="PRICE (₹)" 
                name="price" 
                type="number" 
                placeholder="0.00"
                value={form.price} 
                onChange={handleChange} 
                required 
              />
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">PASS TYPE</label>
                <select
                  name="passType"
                  value={form.passType}
                  onChange={handleChange}
                  className="w-full px-6 h-14 rounded-2xl bg-black border border-zinc-800 text-white focus:outline-none focus:border-lime-400/50 transition-colors"
                  required
                >
                  <option value="REGULAR">Regular</option>
                  <option value="HYBRID">Hybrid</option>
                </select>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-lime-400 text-black font-bold rounded-2xl hover:bg-lime-300 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group shadow-[0_0_20px_rgba(163,230,53,0.1)]"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
            ) : (
              <>
                Save Plan Configuration
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">{label}</label>
      <input
        {...props}
        className="w-full px-6 h-14 rounded-2xl bg-black border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-lime-400/50 transition-colors"
      />
    </div>
  );
}
