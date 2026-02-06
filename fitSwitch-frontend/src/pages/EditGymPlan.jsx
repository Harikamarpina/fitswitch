import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { updateGymPlan, getPlan } from "../api/planApi";

export default function EditGymPlan() {
  const { planId } = useParams();
  const navigate = useNavigate();
  const [gymId, setGymId] = useState(null);

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
        setGymId(plan.gymId || plan.gym?.id || null);
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
      if (gymId) {
        navigate(`/owner/gyms/${gymId}/plans`);
      } else {
        navigate("/owner/gyms");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell bg-slate-50 text-slate-900 px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <Link
          to={gymId ? `/owner/gyms/${gymId}/plans` : "/owner/gyms"}
          className="group flex items-center gap-2 text-slate-500 hover:text-slate-700 transition-colors mb-8"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          <span className="text-sm font-medium">Go Back</span>
        </Link>

        <div className="mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight">Edit Gym Plan</h1>
          <p className="text-slate-600 mt-2 text-lg">Adjust pricing and duration for your membership plan.</p>
        </div>

        {error && (
          <div className="mb-8 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl flex items-center gap-3">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            {error}
          </div>
        )}

        {fetchLoading ? (
          <div className="flex flex-col items-center justify-center py-20 surface-card rounded-[2.5rem]">
            <div className="w-10 h-10 border-4 border-sky-400/30 border-t-sky-500 rounded-full animate-spin"></div>
            <p className="mt-4 text-slate-500 font-medium tracking-wide uppercase text-xs">Loading plan configuration...</p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="space-y-8 surface-card p-8 rounded-3xl"
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
              <label className="block text-sm font-bold text-slate-600 mb-2 uppercase tracking-widest">Description</label>
              <textarea
                name="description"
                placeholder="What does this membership offer?"
                value={form.description}
                onChange={handleChange}
                rows="4"
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-500 transition-all resize-none"
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
              className="w-full py-4 rounded-2xl bg-sky-600 text-black cta-btn font-black hover:bg-sky-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-sky-600/10 mt-4 uppercase tracking-[0.2em]"
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
      <label className="block text-sm font-bold text-slate-600 mb-2 uppercase tracking-widest">{label}</label>
      <input
        {...props}
        className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-500 transition-all"
      />
    </div>
  );
}
