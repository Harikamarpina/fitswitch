import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { updateGymPlan, getPlan } from "../api/planApi";

export default function EditGymPlan() {
  const { planId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    planName: "",
    description: "",
    durationDays: "",
    price: "",
  });

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const res = await getPlan(planId);
        const plan = res.data;
        setForm({
          planName: plan.planName || "",
          description: plan.description || "",
          durationDays: plan.durationDays?.toString() || "",
          price: plan.price?.toString() || "",
        });
      } catch (err) {
        setError("Failed to load plan details");
      } finally {
        setFetchLoading(false);
      }
    };
    
    fetchPlan();
  }, [planId]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await updateGymPlan(planId, {
        ...form,
        durationDays: Number(form.durationDays),
        price: Number(form.price),
      });
      navigate(-1);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <button 
          onClick={() => navigate(-1)} 
          className="group flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-8"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          <span className="text-sm font-medium">Go Back</span>
        </button>

        <div className="mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight">Edit Gym Plan</h1>
          <p className="text-zinc-400 mt-2 text-lg">Adjust pricing and duration for your membership plan.</p>
        </div>

        {error && (
          <div className="mb-8 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl flex items-center gap-3">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            {error}
          </div>
        )}

        {fetchLoading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-zinc-900/20 border border-zinc-800 rounded-[2.5rem]">
            <div className="w-10 h-10 border-4 border-lime-500/30 border-t-lime-500 rounded-full animate-spin"></div>
            <p className="mt-4 text-zinc-500 font-medium tracking-wide uppercase text-xs">Loading plan configuration...</p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="space-y-8 bg-zinc-900/30 border border-zinc-800 p-8 rounded-3xl"
          >
            <Input 
              label="Plan Name" 
              name="planName" 
              placeholder="e.g. Annual Platinum Membership"
              value={form.planName} 
              onChange={handleChange} 
              required 
            />
            
            <div>
              <label className="block text-sm font-bold text-zinc-400 mb-2 uppercase tracking-widest">Description</label>
              <textarea
                name="description"
                placeholder="What does this membership offer?"
                value={form.description}
                onChange={handleChange}
                rows="4"
                className="w-full px-5 py-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-lime-500/50 focus:border-lime-500/50 transition-all resize-none"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Input 
                label="Duration (days)" 
                name="durationDays" 
                type="number" 
                placeholder="365"
                value={form.durationDays} 
                onChange={handleChange} 
                required 
              />
              <Input 
                label="Price (₹)" 
                name="price" 
                type="number" 
                placeholder="15000"
                value={form.price} 
                onChange={handleChange} 
                required 
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-lime-500 text-black font-black hover:bg-lime-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-lime-500/10 mt-4 uppercase tracking-[0.2em]"
            >
              {loading ? "UPDATING..." : "UPDATE GYM PLAN"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm font-bold text-zinc-400 mb-2 uppercase tracking-widest">{label}</label>
      <input
        {...props}
        className="w-full px-5 py-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-lime-500/50 focus:border-lime-500/50 transition-all"
      />
    </div>
  );
}