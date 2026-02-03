import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

export default function OwnerFacilityPlans() {
  const { facilityId } = useParams();
  const [plans, setPlans] = useState([]);
  const [facility, setFacility] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await axiosInstance.get(`/owner/facilities/${facilityId}/plans`);
        setPlans(res.data || []);
        
        if (res.data && res.data.length > 0) {
          setFacility({
            facilityName: res.data[0].facilityName,
            gymName: res.data[0].gymName
          });
        }
      } catch (err) {
        setError("Failed to load facility plans");
      } finally {
        setLoading(false);
      }
    };
    
    fetchPlans();
  }, [facilityId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-400 mx-auto mb-4"></div>
          <p className="text-zinc-500 font-medium tracking-wide">Loading plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Link
                to="/dashboard"
                className="p-2 bg-zinc-900 hover:bg-zinc-800 rounded-xl transition-colors text-zinc-400 hover:text-white"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <span className="text-lime-400 font-medium tracking-wider uppercase text-xs">Plan Management</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Facility <span className="text-lime-400">Plans</span>
            </h1>
            <p className="text-zinc-400 mt-4 text-lg max-w-2xl leading-relaxed">
              Tiered subscription offerings specifically for 
              <span className="text-white font-semibold"> {facility?.facilityName}</span> services.
            </p>
          </div>

          <Link
            to={`/owner/facilities/${facilityId}/plans/add`}
            className="h-14 bg-lime-400 text-black font-bold px-8 rounded-2xl hover:bg-lime-300 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
          >
            <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create New Plan
          </Link>
        </div>

        {error && (
          <div className="mb-10 bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-2xl flex items-center gap-3">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        {plans.length === 0 ? (
          <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-[2.5rem] py-24 text-center">
            <div className="w-20 h-20 bg-zinc-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-2">No Facility Plans Found</h3>
            <p className="text-zinc-500 max-w-sm mx-auto mb-10 leading-relaxed">Targeted plans help members access specific services within your gym facility.</p>
            <Link
              to={`/owner/facilities/${facilityId}/plans/add`}
              className="inline-flex items-center gap-2 text-lime-400 hover:text-white font-bold transition-colors uppercase tracking-widest text-xs"
            >
              Start building your first plan
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="group relative flex flex-col bg-zinc-900/40 border border-zinc-800/50 rounded-[2rem] p-8 hover:bg-zinc-900/60 hover:border-zinc-700/50 transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 bg-lime-400/10 rounded-2xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-lime-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border ${
                    plan.active ? "bg-lime-400/10 text-lime-400 border-lime-400/20" : "bg-zinc-800 text-zinc-500 border-zinc-700"
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${plan.active ? "bg-lime-400" : "bg-zinc-500"}`}></span>
                    {plan.active ? "Live" : "Inactive"}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-lime-400 transition-colors">
                  {plan.planName}
                </h3>
                <div className="flex items-baseline gap-1 mb-6 border-b border-zinc-800 pb-6">
                  <span className="text-3xl font-black text-white">₹{plan.price}</span>
                  <span className="text-zinc-500 text-sm font-medium tracking-tight">/ {plan.durationDays} Days</span>
                </div>

                <p className="text-zinc-400 text-sm leading-relaxed mb-10 flex-grow line-clamp-3 italic">
                  "{plan.description || "Premium facility access with standard membership benefits."}"
                </p>

                <div className="space-y-3">
                  <Link
                    to={`/owner/facilities/${facilityId}/plans/${plan.id}/edit`}
                    className="flex items-center justify-center w-full h-12 bg-zinc-800 text-white font-bold rounded-xl hover:bg-zinc-700 transition-colors text-sm"
                  >
                    Edit Configuration
                  </Link>
                  <Link
                    to={`/owner/gyms/${plan.gymId}/facilities/${facilityId}/plans/${plan.id}/users`}
                    className="flex items-center justify-center w-full h-12 border border-zinc-800 text-zinc-400 font-bold rounded-xl hover:text-white hover:border-zinc-700 transition-colors text-xs uppercase tracking-widest"
                  >
                    View Subscribers
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}