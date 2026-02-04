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
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-lime-500"></div>
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
              to="/owner/gyms"
              className="p-2 bg-zinc-900 hover:bg-zinc-800 rounded-xl transition-colors text-zinc-400 hover:text-white"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <span className="text-lime-400 font-medium tracking-wider uppercase text-[10px]">Gym Profile</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Edit <span className="text-lime-400">Gym Details</span></h1>
          <p className="text-zinc-500 mt-2">Modify your gym's public profile and operational settings.</p>
        </div>

        {err && (
          <div className="mb-8 bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-2xl flex items-center gap-3">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium">{err}</span>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-zinc-900/30 border border-zinc-800/50 rounded-[2.5rem] p-8 sm:p-10 space-y-8"
        >
          <div className="space-y-6">
            <Input label="GYM NAME" name="gymName" value={form.gymName} onChange={handleChange} />
            <Input label="FULL ADDRESS" name="address" value={form.address} onChange={handleChange} />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Input label="CITY" name="city" value={form.city} onChange={handleChange} />
              <Input label="STATE" name="state" value={form.state} onChange={handleChange} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Input label="PINCODE" name="pincode" value={form.pincode} onChange={handleChange} />
              <Input label="CONTACT NUMBER" name="contactNumber" value={form.contactNumber} onChange={handleChange} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-zinc-800/50">
              <Input label="LATITUDE (OPTIONAL)" name="latitude" value={form.latitude} onChange={handleChange} />
              <Input label="LONGITUDE (OPTIONAL)" name="longitude" value={form.longitude} onChange={handleChange} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-zinc-800/50">
              <Input label="OPENING TIME" name="openTime" value={form.openTime} onChange={handleChange} placeholder="e.g. 06:00 AM" />
              <Input label="CLOSING TIME" name="closeTime" value={form.closeTime} onChange={handleChange} placeholder="e.g. 10:00 PM" />
            </div>

            <div className="flex items-center gap-4 p-5 bg-black border border-zinc-800 rounded-2xl group transition-all hover:border-lime-400/30">
              <div className="flex items-center gap-3 cursor-pointer w-full">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    id="active"
                    name="active"
                    checked={form.active}
                    onChange={handleChange}
                    className="w-6 h-6 rounded-lg border-zinc-800 bg-zinc-900 text-lime-400 focus:ring-lime-400/20 transition-all cursor-pointer"
                  />
                </div>
                <label htmlFor="active" className="text-xs font-bold text-zinc-400 uppercase tracking-widest cursor-pointer group-hover:text-zinc-200 transition-colors">
                  Gym is active and visible to members
                </label>
              </div>
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
                Save Profile Changes
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

function Input({ label, ...props }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">{label}</label>
      <input
        {...props}
        className="w-full px-6 h-14 rounded-2xl bg-black border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-lime-400/50 transition-colors"
      />
    </div>
  );
}
