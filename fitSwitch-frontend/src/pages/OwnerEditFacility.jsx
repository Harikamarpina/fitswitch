import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { updateFacility } from "../api/facilityApi";
import axiosInstance from "../api/axiosInstance";

export default function OwnerEditFacility() {
  const { facilityId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    facilityName: "",
    description: "",
    active: true,
    gymId: null,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // ✅ Load facility details
  useEffect(() => {
    fetchFacility();
  }, [facilityId]);

  const fetchFacility = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axiosInstance.get(`/owner/facilities/${facilityId}`); 
      const data = res.data.data || res.data;

      setForm({
        facilityName: data.facilityName || "",
        description: data.description || "",
        active: data.active ?? true,
        gymId: data.gymId,
      });
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load facility");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.facilityName.trim()) return setError("Facility name is required");

    try {
      setSaving(true);

      const payload = {
        facilityName: form.facilityName,
        description: form.description,
        active: form.active,
      };

      const res = await updateFacility(facilityId, payload);
      const success = res.data.success ?? true;

      if (!success) {
        setError(res.data.message || "Update failed");
        return;
      }

      navigate(`/owner/gym/${form.gymId}/facilities`);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update facility");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-lime-400/30 border-t-lime-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-zinc-500 font-medium">Loading facility...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-4 py-12">
      <div className="max-w-xl mx-auto">
        {/* Header Section */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <Link
              to={form.gymId ? `/owner/gym/${form.gymId}/facilities` : "/owner/gyms"}
              className="p-2 bg-zinc-900 hover:bg-zinc-800 rounded-xl transition-colors text-zinc-400 hover:text-white"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <span className="text-lime-400 font-medium tracking-wider uppercase text-[10px]">Facility Management</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Edit <span className="text-lime-400">Facility</span></h1>
          <p className="text-zinc-500 mt-2">Update service details and availability.</p>
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
                placeholder="e.g. Cardio Zone"
                value={form.facilityName}
                onChange={handleChange}
                required
                maxLength={80}
                className="w-full px-6 h-14 rounded-2xl bg-black border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-lime-400/50 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">DESCRIPTION</label>
              <textarea
                name="description"
                placeholder="Describe what's available here..."
                value={form.description}
                onChange={handleChange}
                rows="5"
                maxLength={300}
                className="w-full px-6 py-4 rounded-2xl bg-black border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-lime-400/50 transition-colors resize-none"
              />
            </div>

            <div className="flex items-center gap-3 bg-zinc-800/30 p-4 rounded-2xl border border-zinc-800">
              <input
                type="checkbox"
                name="active"
                id="active"
                checked={form.active}
                onChange={handleChange}
                className="w-5 h-5 accent-lime-400 rounded cursor-pointer"
              />
              <label htmlFor="active" className="text-sm font-bold text-zinc-300 cursor-pointer uppercase tracking-widest">
                Facility is Active
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full h-14 bg-lime-400 text-black font-bold rounded-2xl hover:bg-lime-300 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group shadow-[0_0_20px_rgba(163,230,53,0.1)]"
          >
            {saving ? (
              <div className="w-6 h-6 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
            ) : (
              <>
                Save Changes
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                </svg>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
