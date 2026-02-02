import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createGym } from "../api/gymApi";

export default function OwnerAddGym() {
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
    closeTime: ""
  });

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      const payload = {
        ...form,
        latitude: form.latitude ? Number(form.latitude) : null,
        longitude: form.longitude ? Number(form.longitude) : null
      };

      await createGym(payload);
      navigate("/owner/gyms");
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to create gym");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-5 py-8">
      <div className="max-w-3xl mx-auto">
        <Link to="/owner/gyms" className="underline text-zinc-200 hover:text-white">
          ← Back
        </Link>

        <h1 className="text-2xl font-bold mt-4">Add Gym</h1>
        <p className="text-zinc-300 mt-2">Create a new gym under your account.</p>

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

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 rounded-xl bg-lime-400 text-black font-bold hover:bg-lime-300 transition disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create Gym"}
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
