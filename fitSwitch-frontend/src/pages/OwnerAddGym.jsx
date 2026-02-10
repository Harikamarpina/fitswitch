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
    <div className="min-h-screen bg-black text-white px-6 py-10 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-lime-500/5 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2" />

      <div className="max-w-3xl mx-auto relative z-10">
        <div className="mb-12">
          <Link
            to="/dashboard"
            className="text-base font-bold text-zinc-400 hover:text-lime-500 transition-colors flex items-center gap-2 mb-6 group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold tracking-tight">Register Gym</h1>
          <p className="text-zinc-400 mt-2 text-lg">
            Add a new location to the FitSwitch partner network.
          </p>
        </div>

        {err && (
          <div className="mb-8 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl text-sm font-medium">
            {err}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-8 bg-zinc-900/40 border border-zinc-800 rounded-[2.5rem] p-10 backdrop-blur-sm shadow-2xl shadow-black/40"
        >
          <div className="grid gap-6">
            <Input label="Gym Name" name="gymName" value={form.gymName} onChange={handleChange} placeholder="e.g. Iron Paradise Elite" required />
            <Input label="Full Address" name="address" value={form.address} onChange={handleChange} placeholder="Street name, building..." required />
            
            <div className="grid md:grid-cols-2 gap-6">
              <Input label="City" name="city" value={form.city} onChange={handleChange} placeholder="e.g. Mumbai" />
              <Input label="State" name="state" value={form.state} onChange={handleChange} placeholder="e.g. Maharashtra" />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Input label="Pincode" name="pincode" value={form.pincode} onChange={handleChange} placeholder="6-digit code" pattern="\\d{6}" />
              <Input label="Contact Number" name="contactNumber" value={form.contactNumber} onChange={handleChange} placeholder="10-digit number" pattern="\\d{10}" />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Input label="Latitude" name="latitude" value={form.latitude} onChange={handleChange} placeholder="Optional" type="number" step="0.000001" min="-90" max="90" />
              <Input label="Longitude" name="longitude" value={form.longitude} onChange={handleChange} placeholder="Optional" type="number" step="0.000001" min="-180" max="180" />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Input label="Opening Time" name="openTime" value={form.openTime} onChange={handleChange} placeholder="HH:mm" type="time" />
              <Input label="Closing Time" name="closeTime" value={form.closeTime} onChange={handleChange} placeholder="HH:mm" type="time" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 rounded-2xl bg-lime-500 text-black font-black text-lg hover:bg-lime-400 transition-all active:scale-[0.98] disabled:opacity-50 shadow-xl shadow-lime-500/10"
          >
            {loading ? "Registering..." : "Complete Registration"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">{label}</label>
      <input
        {...props}
        className="w-full px-5 py-4 rounded-2xl bg-black border border-zinc-800 text-white placeholder:text-zinc-800 focus:outline-none focus:ring-2 focus:ring-lime-500/20 focus:border-lime-500 transition-all"
      />
    </div>
  );
}

