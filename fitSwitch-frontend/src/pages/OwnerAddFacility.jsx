import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { addFacility } from "../api/facilityApi";

export default function OwnerAddFacility() {
  const { gymId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    gymId: Number(gymId),
    facilityName: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.facilityName.trim()) return setError("Facility name is required");

    try {
      setLoading(true);
      const res = await addFacility(form);

      const success = res.data.success ?? true;
      if (!success) {
        setError(res.data.message || "Failed to add facility");
        return;
      }

      navigate(`/owner/gym/${gymId}/facilities`);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to add facility");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-zinc-800 text-white px-4 py-10">
      <div className="max-w-xl mx-auto bg-white/5 border border-white/10 rounded-2xl p-8 shadow-xl">
        <h2 className="text-3xl font-bold">Add Facility</h2>
        <p className="text-zinc-300 mt-1 text-sm">
          Add a new facility for your gym.
        </p>

        {error && (
          <div className="mt-4 bg-red-500/10 border border-red-500/30 text-red-200 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <div>
            <label className="text-sm text-zinc-300">Facility Name</label>
            <input
              name="facilityName"
              value={form.facilityName}
              onChange={handleChange}
              placeholder="Ex: Cardio, Yoga, CrossFit"
              className="mt-1 w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:outline-none focus:ring-2 focus:ring-lime-400"
            />
          </div>

          <div>
            <label className="text-sm text-zinc-300">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Optional description"
              rows="4"
              className="mt-1 w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:outline-none focus:ring-2 focus:ring-lime-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-lime-500 hover:bg-lime-400 text-black font-semibold py-3 rounded-xl transition disabled:opacity-60"
          >
            {loading ? "Adding..." : "Add Facility"}
          </button>
        </form>

        <div className="mt-6">
          <Link
            to={`/owner/gym/${gymId}/facilities`}
            className="text-lime-400 hover:underline text-sm"
          >
            ← Back
          </Link>
        </div>
      </div>
    </div>
  );
}
