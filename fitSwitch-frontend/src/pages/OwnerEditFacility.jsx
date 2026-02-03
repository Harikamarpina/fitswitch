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
          <div className="w-10 h-10 border-4 border-lime-500/30 border-t-lime-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-zinc-500 font-medium">Loading facility...</p>
        </div>
      </div>
    );
  }

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
          <h1 className="text-4xl font-extrabold tracking-tight">Edit Facility</h1>
          <p className="text-zinc-400 mt-2 text-lg">Update service details and availability.</p>
        </div>

        {error && (
          <div className="mb-8 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl flex items-center gap-3">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-8 bg-zinc-900/30 border border-zinc-800 p-8 rounded-3xl"
        >
          <div>
            <label className="block text-sm font-bold text-zinc-400 mb-2 uppercase tracking-widest">Facility Name</label>
            <input
              name="facilityName"
              placeholder="e.g. Cardio Zone"
              value={form.facilityName}
              onChange={handleChange}
              className="w-full px-5 py-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-lime-500/50 focus:border-lime-500/50 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-zinc-400 mb-2 uppercase tracking-widest">Description</label>
            <textarea
              name="description"
              placeholder="Describe what's available here..."
              value={form.description}
              onChange={handleChange}
              rows="5"
              className="w-full px-5 py-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-lime-500/50 focus:border-lime-500/50 transition-all resize-none"
            />
          </div>

          <div className="flex items-center gap-3 bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800 w-fit">
            <input
              type="checkbox"
              name="active"
              id="active"
              checked={form.active}
              onChange={handleChange}
              className="w-5 h-5 accent-lime-500 rounded cursor-pointer"
            />
            <label htmlFor="active" className="text-sm font-bold text-zinc-300 cursor-pointer uppercase tracking-widest">
              Facility is Active
            </label>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-4 rounded-2xl bg-lime-500 text-black font-black hover:bg-lime-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-lime-500/10 mt-4"
          >
            {saving ? "UPDATING FACILITY..." : "SAVE CHANGES"}
          </button>
        </form>

        <div className="mt-12 pt-8 border-t border-zinc-900">
          <Link
            to={`/owner/gym/${form.gymId}/facilities`}
            className="inline-flex items-center gap-2 text-zinc-500 hover:text-lime-400 transition-colors font-medium"
          >
            <span>←</span> Back to Facilities
          </Link>
        </div>
      </div>
    </div>
  );
}
