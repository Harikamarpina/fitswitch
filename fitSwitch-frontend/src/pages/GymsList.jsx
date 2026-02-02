import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllGyms } from "../api/gymApi";

export default function GymsList() {
  const [gyms, setGyms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    const fetchGyms = async () => {
      try {
        const res = await getAllGyms();
        setGyms(res.data || []);
      } catch (e) {
        setErr("Failed to load gyms");
      } finally {
        setLoading(false);
      }
    };
    fetchGyms();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white px-5 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">Gyms</h1>
          <Link
            to="/"
            className="text-sm text-zinc-200 hover:text-white underline"
          >
            Back to Home
          </Link>
        </div>

        <p className="text-zinc-300 mt-2">
          Browse gyms and view details (location, timings, contact).
        </p>

        {loading && (
          <p className="mt-6 text-zinc-300">Loading gyms...</p>
        )}

        {err && (
          <p className="mt-6 text-red-400">{err}</p>
        )}

        {!loading && !err && gyms.length === 0 && (
          <p className="mt-6 text-zinc-300">No gyms found.</p>
        )}

        <div className="grid md:grid-cols-2 gap-5 mt-6">
          {gyms.map((gym) => (
            <div
              key={gym.id}
              className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold">{gym.gymName}</h2>
                  <p className="text-sm text-zinc-300 mt-1">
                    {gym.address}
                  </p>
                  <p className="text-sm text-zinc-400">
                    {gym.city}, {gym.state} - {gym.pincode}
                  </p>
                </div>
                <span className="text-xs px-3 py-1 rounded-full border border-lime-400/30 text-lime-300">
                  Active
                </span>
              </div>

              <div className="mt-4 text-sm text-zinc-300 space-y-1">
                <p>📞 {gym.contactNumber || "-"}</p>
                <p>🕒 {gym.openTime || "-"} to {gym.closeTime || "-"}</p>
              </div>

              <div className="mt-4 flex gap-3">
                <Link
                  to={`/gyms/${gym.id}`}
                  className="px-4 py-2 rounded-xl bg-lime-400 text-black font-semibold hover:bg-lime-300 transition"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
