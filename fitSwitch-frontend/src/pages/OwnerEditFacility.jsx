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
      <div className="app-shell bg-slate-50 text-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-sky-400/30 border-t-sky-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500 font-medium">Loading facility...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell bg-slate-50 text-slate-900 px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <Link
          to={form.gymId ? `/owner/gym/${form.gymId}/facilities` : "/owner/gyms"}
          className="group flex items-center gap-2 text-slate-500 hover:text-slate-700 transition-colors mb-8"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          <span className="text-sm font-medium">Go Back</span>
        </Link>

        <div className="mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight">Edit Facility</h1>
          <p className="text-slate-600 mt-2 text-lg">Update service details and availability.</p>
        </div>

        {error && (
          <div className="mb-8 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl flex items-center gap-3">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-8 surface-card p-8 rounded-3xl"
        >
          <div>
            <label className="block text-sm font-bold text-slate-600 mb-2 uppercase tracking-widest">Facility Name</label>
            <input
              name="facilityName"
              placeholder="e.g. Cardio Zone"
              value={form.facilityName}
              onChange={handleChange}
              className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-600 mb-2 uppercase tracking-widest">Description</label>
            <textarea
              name="description"
              placeholder="Describe what's available here..."
              value={form.description}
              onChange={handleChange}
              rows="5"
              className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-500 transition-all resize-none"
            />
          </div>

          <div className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-slate-200 w-fit">
            <input
              type="checkbox"
              name="active"
              id="active"
              checked={form.active}
              onChange={handleChange}
              className="w-5 h-5 accent-sky-600 rounded cursor-pointer"
            />
            <label htmlFor="active" className="text-sm font-bold text-slate-700 cursor-pointer uppercase tracking-widest">
              Facility is Active
            </label>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-4 rounded-2xl bg-sky-600 text-black cta-btn font-black hover:bg-sky-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-sky-600/10 mt-4"
          >
            {saving ? "UPDATING FACILITY..." : "SAVE CHANGES"}
          </button>
        </form>

      </div>
    </div>
  );
}
