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
  }, []);

  const fetchFacility = async () => {
    try {
      setLoading(true);
      setError("");

      // ⚠️ Owner API does not have single facility GET
      // so using repository direct endpoint is not present.
      // We will fetch through existing owner list (workaround) OR create backend GET endpoint later.

      // Temporary workaround: call backend public or create a GET endpoint later
      const res = await axiosInstance.get(`/owner/facilities/${facilityId}`); 
      // ✅ This will work only if backend exists (recommended)

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
        Loading facility...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-zinc-800 text-white px-4 py-10">
      <div className="max-w-xl mx-auto bg-white/5 border border-white/10 rounded-2xl p-8 shadow-xl">
        <h2 className="text-3xl font-bold">Edit Facility</h2>

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
              className="mt-1 w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:outline-none focus:ring-2 focus:ring-lime-400"
            />
          </div>

          <div>
            <label className="text-sm text-zinc-300">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="4"
              className="mt-1 w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 focus:outline-none focus:ring-2 focus:ring-lime-400"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="active"
              checked={form.active}
              onChange={handleChange}
              className="w-4 h-4 accent-lime-400"
            />
            <span className="text-sm text-zinc-300">Active</span>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="bg-lime-500 hover:bg-lime-400 text-black font-semibold py-3 rounded-xl transition disabled:opacity-60"
          >
            {saving ? "Updating..." : "Update Facility"}
          </button>
        </form>

        <div className="mt-6">
          <Link
            to={`/owner/gym/${form.gymId}/facilities`}
            className="text-lime-400 hover:underline text-sm"
          >
            ← Back
          </Link>
        </div>
      </div>
    </div>
  );
}
