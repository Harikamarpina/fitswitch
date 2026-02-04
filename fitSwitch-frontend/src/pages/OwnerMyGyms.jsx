import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getOwnerGyms } from "../api/gymApi";

export default function OwnerMyGyms() {
  const [gyms, setGyms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOwnerGyms = async () => {
      try {
        const res = await getOwnerGyms();
        setGyms(res.data || []);
      } catch (e) {
        setErr("Failed to load owner gyms. Make sure you're logged in as OWNER.");
      } finally {
        setLoading(false);
      }
    };

    fetchOwnerGyms();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-lime-500/5 blur-[150px] rounded-full -translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
          <div>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-white transition-colors mb-4"
            >
              <span>←</span> Back to Dashboard
            </Link>
            <h1 className="text-4xl font-bold tracking-tight">My Gyms</h1>
            <p className="text-zinc-400 mt-2 text-lg">
              Monitor and manage your fitness centers in the network.
            </p>
          </div>

          <Link
            to="/owner/gyms/add"
            className="px-8 py-4 rounded-2xl bg-lime-500 text-black font-bold hover:bg-lime-400 transition-all active:scale-95 shadow-xl shadow-lime-500/10 flex items-center gap-2"
          >
            <span>+</span> Add New Gym
          </Link>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-lime-500"></div>
          </div>
        )}

        {err && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl text-center mb-10">
            {err}
          </div>
        )}

        {!loading && !err && gyms.length === 0 && (
          <div className="text-center py-24 bg-zinc-900/20 border border-zinc-800 border-dashed rounded-[2.5rem]">
            <div className="text-6xl mb-6 opacity-20">🏢</div>
            <p className="text-zinc-500 font-medium mb-8">You haven't registered any gyms yet.</p>
            <Link
              to="/owner/gyms/add"
              className="inline-block px-8 py-3.5 rounded-2xl bg-zinc-100 text-black font-bold hover:bg-white transition-all"
            >
              Register First Gym
            </Link>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {gyms.map((gym) => (
            <div
              key={gym.id}
              className="group rounded-[2rem] border border-zinc-800 bg-zinc-900/40 p-8 hover:bg-zinc-900/60 transition-all backdrop-blur-sm relative"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight group-hover:text-lime-500 transition-colors">
                    {gym.gymName}
                  </h2>
                  <div className="flex items-center gap-2 text-zinc-500 mt-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest">{gym.city}</span>
                    <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
                    <span className="text-[10px] font-bold uppercase tracking-widest">{gym.state}</span>
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/owner/gyms/edit/${gym.id}`)}
                  className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all"
                  title="Edit Settings"
                >
                  ⚙️
                </button>
              </div>

              <div className="space-y-4 mb-10">
                <div className="flex items-center gap-3">
                  <span className="text-sm opacity-50">📍</span>
                  <p className="text-zinc-400 text-sm leading-relaxed">{gym.address}, {gym.pincode}</p>
                </div>
                <div className="flex items-center gap-6 pt-4 border-t border-zinc-800/50">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-zinc-600 uppercase tracking-tighter">Hours</span>
                    <span className="text-sm font-bold text-zinc-300">{gym.openTime} - {gym.closeTime}</span>
                  </div>
                  <div className="w-px h-6 bg-zinc-800"></div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-zinc-600 uppercase tracking-tighter">Status</span>
                    <span className="text-sm font-bold text-lime-500">Live</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => navigate(`/owner/gym/${gym.id}/facilities`)}
                  className="px-4 py-3 rounded-2xl bg-zinc-800 text-zinc-200 text-xs font-bold uppercase tracking-tighter hover:bg-blue-600 hover:text-white transition-all"
                >
                  Facilities
                </button>
                <button
                  onClick={() => navigate(`/owner/gyms/${gym.id}/plans`)}
                  className="px-4 py-3 rounded-2xl bg-zinc-800 text-zinc-200 text-xs font-bold uppercase tracking-tighter hover:bg-purple-600 hover:text-white transition-all"
                >
                  Plans
                </button>
                <button
                  onClick={() => navigate(`/gyms/${gym.id}`)}
                  className="px-4 py-3 rounded-2xl bg-zinc-800 text-zinc-200 text-xs font-bold uppercase tracking-tighter hover:bg-lime-500 hover:text-black transition-all"
                >
                  Preview
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 pt-10 border-t border-zinc-900"></div>
      </div>
    </div>
  );
}
