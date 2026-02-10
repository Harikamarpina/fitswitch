import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

export default function AddFacilityPlan() {
  const { facilityId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    planName: "",
    description: "",
    durationDays: "",
    price: "",
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
      await axiosInstance.post(`/owner/facilities/${facilityId}/plans`, {
        ...form,
        durationDays: Number(form.durationDays),
        price: Number(form.price),
      });
      navigate(`/owner/facilities/${facilityId}/plans`);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to add facility plan");
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
              to={`/owner/facilities/${facilityId}/plans`}
              className="p-2 bg-zinc-900 hover:bg-zinc-800 rounded-xl transition-colors text-zinc-400 hover:text-white"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <span className="text-lime-400 font-medium tracking-wider uppercase text-[10px]">Facility Management</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Add <span className="text-lime-400">Facility Plan</span></h1>
          <p className="text-zinc-500 mt-2">Target specific services with a custom subscription plan.</p>
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
              placeholder="e.g. Premium Yoga Monthly"
              value={form.planName} 
              onChange={handleChange}
              required
              maxLength={80}
            />

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">DESCRIPTION</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="What services or equipment does this plan cover?"
                maxLength={300}
                className="w-full px-6 py-4 rounded-2xl bg-black border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-lime-400/50 transition-colors resize-none"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Input 
                label="DURATION (DAYS)" 
                name="durationDays" 
                type="number" 
                placeholder="30"
                value={form.durationDays} 
                onChange={handleChange}
                min="1"
                required
              />
              <Input 
                label="PRICE (₹)" 
                name="price" 
                type="number" 
                placeholder="0.00"
                value={form.price} 
                onChange={handleChange}
                min="1"
                step="0.01"
                required
              />
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
                Create Facility Plan
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
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
