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
    <div className="min-h-screen bg-black text-white px-6 py-12 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-lime-500/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16 space-y-4">
          <span className="inline-block px-3 py-1 rounded-full bg-lime-500/10 border border-lime-500/20 text-lime-500 text-[10px] font-bold tracking-widest uppercase">
            Discovery
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">Find Your Perfect Gym</h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Discover professional fitness centers near you and choose the membership that fits your lifestyle.
          </p>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-500"></div>
            <p className="text-zinc-500 font-medium">Discovering gyms...</p>
          </div>
        )}
        
        {error && (
          <div className="max-w-md mx-auto bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl text-center font-medium">
            {error}
          </div>
        )}

        {!loading && !error && gyms.length === 0 && (
          <div className="text-center py-20 bg-zinc-900/20 border border-zinc-800/50 border-dashed rounded-3xl">
            <p className="text-zinc-500">No gyms available at the moment. Please check back later.</p>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {gyms.map((gym) => (
            <div
              key={gym.id}
              className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8 hover:bg-zinc-900/60 transition-all group backdrop-blur-sm relative flex flex-col"
            >
              <div className="flex-1">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-bold tracking-tight group-hover:text-lime-500 transition-colors">
                    {gym.gymName}
                  </h2>
                </div>
                
                <div className="space-y-2 mb-8">
                  <p className="text-zinc-300 font-medium">{gym.address}</p>
                  <div className="flex items-center gap-2 text-zinc-500">
                    <span className="text-xs font-bold uppercase tracking-widest">{gym.city}</span>
                    <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
                    <span className="text-xs font-bold uppercase tracking-widest">{gym.state}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-zinc-400 mb-8 pt-6 border-t border-zinc-800/50">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-tighter text-zinc-600 font-bold">Opens</span>
                    <span className="font-bold text-zinc-300">{gym.openTime}</span>
                  </div>
                  <div className="w-px h-6 bg-zinc-800"></div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-tighter text-zinc-600 font-bold">Closes</span>
                    <span className="font-bold text-zinc-300">{gym.closeTime}</span>
                  </div>
                </div>
              </div>

              <Link
                to={`/gyms/${gym.id}`}
                className="block w-full text-center py-4 rounded-2xl bg-lime-500 text-black font-bold hover:bg-lime-400 transition-all active:scale-[0.98] shadow-lg shadow-lime-500/10"
              >
                Explore Plans
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <Link to="/" className="text-base font-bold text-zinc-400 hover:text-lime-500 transition-colors inline-flex items-center gap-2 group">
            <span className="group-hover:-translate-x-1 transition-transform">←</span> Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}