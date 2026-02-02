import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getGymById, updateGym } from "../api/gymApi";

export default function OwnerEditGym() {
  const { gymId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    gymName: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    contactNumber: "",
    latitude: "",
    longitude: "",
    openTime: "",
    closeTime: "",
    active: true
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    const loadGym = async () => {
      try {
        const res = await getGymById(gymId);
        const g = res.data;

        setForm({
          gymName: g.gymName || "",
          address: g.address || "",
          city: g.city || "",
          state: g.state || "",
          pincode: g.pincode || "",
          contactNumber: g.contactNumber || "",
          latitude: g.latitude ?? "",
          longitude: g.longitude ?? "",
          openTime: g.openTime || "",
          closeTime: g.closeTime || "",
          active: g.active ?? true
        });
      } catch (e) {
        setErr("Failed to load gym for edit");
      } finally {
        setLoading(false);
      }
    };

    loadGym();
  }, [gymId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErr("");

    try {
      const payload = {
        ...form,
        latitude: form.latitude === "" ? null : Number(form.latitude),
        longitude: form.longitude === "" ? null : Number(form.longitude),
        active: Boolean(form.active)
      };

      await updateGym(gymId, payload);
      navigate("/owner/gyms");
    } catch (e) {
      setErr(e?.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white px-5 py-8">
        <p className="text-zinc-300">Loading gym...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-5 py-8">
      <div className="max-w-3xl mx-auto">
        <Link to="/owner/gyms" className="underline text-zinc-200 hover:text-white">
          ← Back
        </Link>

        <h1 className="text-2xl font-bold mt-4">Edit Gym</h1>

        {err && <p className="mt-4 text-red-400">{err}</p>}

        <form
          onSubmit={handleSubmit}
          className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4"
        >
          <Input label="Gym Name" name="gymName" value={form.gymName} onChange={handleChange} />
          <Input label="Address" name="address" value={form.address} onChange={handleChange} />

          <div className="grid md:grid-cols-2 gap-4">
            <Input label="City" name="city" value={form.city} onChange={handleChange} />
            <Input label="State" name="state" value={form.state} onChange={handleChange} />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Input label="Pincode" name="pincode" value={form.pincode} onChange={handleChange} />
            <Input label="Contact Number" name="contactNumber" value={form.contactNumber} onChange={handleChange} />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Input label="Latitude" name="latitude" value={form.latitude} onChange={handleChange} />
            <Input label="Longitude" name="longitude" value={form.longitude} onChange={handleChange} />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Input label="Open Time" name="openTime" value={form.openTime} onChange={handleChange} />
            <Input label="Close Time" name="closeTime" value={form.closeTime} onChange={handleChange} />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="active"
              checked={form.active}
              onChange={handleChange}
              className="h-4 w-4"
            />
            <span className="text-sm text-zinc-200">Gym Active</span>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full px-4 py-3 rounded-xl bg-lime-400 text-black font-bold hover:bg-lime-300 transition disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
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
