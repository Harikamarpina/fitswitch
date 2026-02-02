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
    <div className="min-h-screen bg-black text-white px-5 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Owner - My Gyms</h1>
            <p className="text-zinc-300 mt-2">
              Manage your gyms. Add new gym or update existing.
            </p>
          </div>

          <Link
            to="/owner/gyms/add"
            className="px-4 py-2 rounded-xl bg-lime-400 text-black font-semibold hover:bg-lime-300 transition"
          >
            + Add Gym
          </Link>
        </div>

        {loading && <p className="mt-6 text-zinc-300">Loading...</p>}

        {err && <p className="mt-6 text-red-400">{err}</p>}

        {!loading && !err && gyms.length === 0 && (
          <p className="mt-6 text-zinc-300">No gyms created yet.</p>
        )}

        <div className="grid md:grid-cols-2 gap-5 mt-6">
          {gyms.map((gym) => (
            <div
              key={gym.id}
              className="rounded-2xl border border-white/10 bg-white/5 p-5"
            >
              <h2 className="text-lg font-semibold">{gym.gymName}</h2>
              <p className="text-sm text-zinc-300 mt-1">{gym.address}</p>
              <p className="text-sm text-zinc-400">
                {gym.city}, {gym.state} - {gym.pincode}
              </p>

              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => navigate(`/owner/gyms/edit/${gym.id}`)}
                  className="px-4 py-2 rounded-xl border border-white/20 hover:bg-white/10 transition"
                >
                  Edit
                </button>

                <button
                  onClick={() => navigate(`/owner/gym/${gym.id}/facilities`)}
                  className="px-4 py-2 rounded-xl bg-blue-500 text-white font-semibold hover:bg-blue-400 transition"
                >
                  Facilities
                </button>

                <button
                  onClick={() => navigate(`/owner/gyms/${gym.id}/plans`)}
                  className="px-4 py-2 rounded-xl bg-purple-500 text-white font-semibold hover:bg-purple-400 transition"
                >
                  Plans
                </button>

                <button
                  onClick={() => navigate(`/gyms/${gym.id}`)}
                  className="px-4 py-2 rounded-xl bg-lime-400 text-black font-semibold hover:bg-lime-300 transition"
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <Link to="/dashboard" className="underline text-zinc-200 hover:text-white">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
