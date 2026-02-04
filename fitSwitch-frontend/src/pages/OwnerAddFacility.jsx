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
    <div className="min-h-screen bg-black text-white px-4 py-12">
      <div className="max-w-xl mx-auto">
        {/* Header Section */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <Link
              to={`/owner/gym/${gymId}/facilities`}
              className="p-2 bg-zinc-900 hover:bg-zinc-800 rounded-xl transition-colors text-zinc-400 hover:text-white"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <span className="text-lime-400 font-medium tracking-wider uppercase text-[10px]">Facility Management</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Register <span className="text-lime-400">Facility</span></h1>
          <p className="text-zinc-500 mt-2">Add specialized service zones to your gym profile.</p>
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
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">FACILITY NAME</label>
              <input
                name="facilityName"
                value={form.facilityName}
                onChange={handleChange}
                placeholder="Ex: Cardio, Yoga, CrossFit"
                className="w-full px-6 h-14 rounded-2xl bg-black border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-lime-400/50 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">DESCRIPTION</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="What equipment and amenities are available in this zone?"
                className="w-full px-6 py-4 rounded-2xl bg-black border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-lime-400/50 transition-colors resize-none"
                rows={5}
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
                Save Facility Details
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
