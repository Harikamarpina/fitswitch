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
    <div className="min-h-screen bg-black text-white px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <Link
              to="/user/dashboard"
              className="text-base font-bold text-zinc-400 hover:text-lime-500 transition-colors flex items-center gap-2 group mb-4"
            >
              <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Dashboard
            </Link>
            <h1 className="text-4xl font-bold tracking-tight">Browse Gyms</h1>
            <p className="text-zinc-400 mt-2 text-lg">
              Explore our network of professional fitness centers.
            </p>
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-lime-500"></div>
          </div>
        )}

        {err && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl text-center">
            {err}
          </div>
        )}

        {!loading && !err && gyms.length === 0 && (
          <div className="text-center py-20 bg-zinc-900/20 border border-zinc-800/50 border-dashed rounded-3xl">
            <p className="text-zinc-500">No gyms available in your area yet.</p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {gyms.map((gym) => (
            <div
              key={gym.id}
              className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6 hover:bg-zinc-900/60 transition-all group backdrop-blur-sm"
            >
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight group-hover:text-lime-500 transition-colors">
                    {gym.gymName}
                  </h2>
                  <div className="flex items-center gap-2 text-zinc-500 mt-1">
                    <span className="text-xs font-bold uppercase tracking-widest">{gym.city}</span>
                    <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
                    <span className="text-xs font-bold uppercase tracking-widest">{gym.state}</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full border border-lime-500/20 bg-lime-500/10 text-lime-500">
                  Verified
                </span>
              </div>

              <div className="space-y-3 mb-8">
                <p className="text-zinc-400 text-sm leading-relaxed">
                  {gym.address}, {gym.pincode}
                </p>
                <div className="flex flex-wrap gap-4 pt-4 border-t border-zinc-800/50">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">📞</span>
                    <span className="text-sm font-medium text-zinc-300">{gym.contactNumber || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">🕒</span>
                    <span className="text-sm font-medium text-zinc-300">{gym.openTime} - {gym.closeTime}</span>
                  </div>
                </div>
              </div>

              <Link
                to={`/gyms/${gym.id}`}
                className="block w-full text-center py-3.5 rounded-2xl bg-zinc-100 text-black font-bold hover:bg-white transition-all active:scale-[0.98]"
              >
                View Details & Plans
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
