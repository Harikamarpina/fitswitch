import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPublicGyms } from "../api/publicGymApi";

export default function PublicGyms() {
  const [gyms, setGyms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGyms = async () => {
      try {
        const res = await getPublicGyms();
        setGyms(res.data || []);
      } catch (err) {
        setError("Failed to load gyms");
      } finally {
        setLoading(false);
      }
    };
    
    fetchGyms();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white px-5 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Find Your Perfect Gym</h1>
          <p className="text-zinc-300 mt-2">Discover gyms near you and choose the best membership plan</p>
        </div>

        {loading && <p className="text-center text-zinc-300">Loading gyms...</p>}
        
        {error && <p className="text-center text-red-400">{error}</p>}

        {!loading && !error && gyms.length === 0 && (
          <p className="text-center text-zinc-300">No gyms available at the moment.</p>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gyms.map((gym) => (
            <div
              key={gym.id}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition"
            >
              <h2 className="text-xl font-semibold mb-2">{gym.gymName}</h2>
              <p className="text-zinc-300 text-sm mb-1">{gym.address}</p>
              <p className="text-zinc-400 text-sm mb-4">{gym.city}, {gym.state}</p>
              
              <div className="flex justify-between items-center text-sm text-zinc-300 mb-4">
                <span>Open: {gym.openTime}</span>
                <span>Close: {gym.closeTime}</span>
              </div>

              <Link
                to={`/gyms/${gym.id}`}
                className="block w-full text-center px-4 py-2 rounded-xl bg-lime-400 text-black font-semibold hover:bg-lime-300 transition"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link to="/" className="underline text-zinc-200 hover:text-white">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}