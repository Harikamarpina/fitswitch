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
    <div className="min-h-screen bg-black text-white px-5 py-8">
      <div className="max-w-2xl mx-auto">
        <Link to={-1} className="underline text-zinc-200 hover:text-white">
          ← Back
        </Link>

        <h1 className="text-2xl font-bold mt-4">Edit Gym Plan</h1>
        <p className="text-zinc-300 mt-2">Update your gym plan details.</p>

        {error && <p className="mt-4 text-red-400">{error}</p>}

        {fetchLoading ? (
          <p className="mt-6 text-zinc-300">Loading plan details...</p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4"
          >
          <Input label="Plan Name" name="planName" value={form.planName} onChange={handleChange} required />
          <div>
            <label className="text-sm text-zinc-300">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:outline-none focus:ring-2 focus:ring-lime-400 resize-none"
              rows={3}
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <Input label="Duration (days)" name="durationDays" type="number" value={form.durationDays} onChange={handleChange} required />
            <Input label="Price (₹)" name="price" type="number" value={form.price} onChange={handleChange} required />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 rounded-xl bg-lime-400 text-black font-bold hover:bg-lime-300 transition disabled:opacity-60"
          >
            {loading ? "Updating..." : "Update Plan"}
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
      <label className="text-sm text-zinc-300">{label}</label>
      <input
        {...props}
        className="mt-1 w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:outline-none focus:ring-2 focus:ring-lime-400"
      />
    </div>
  );
}