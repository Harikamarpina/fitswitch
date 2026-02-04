import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getGymPlans } from "../api/planApi";

export default function GymPlans() {
  const { gymId } = useParams();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await getGymPlans(gymId);
        console.log('Plans response:', res.data); // Debug log
        setPlans(res.data || []);
      } catch (err) {
        console.error('Error fetching plans:', err); // Debug log
        setError("Failed to load gym plans");
        setPlans([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPlans();
  }, [gymId]);

  return (
    <div className="min-h-screen bg-black text-white px-6 py-12">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h2 className="text-4xl font-extrabold tracking-tight">Gym Plans</h2>
            <p className="text-zinc-400 mt-2 text-lg">
              Manage subscription plans and pricing for your gym.
            </p>
          </div>
          <Link
            to={`/owner/gyms/${gymId}/plans/add`}
            className="bg-lime-500 hover:bg-lime-400 text-black font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-lime-500/20 flex items-center justify-center gap-2"
          >
            <span className="text-xl">+</span> Add Plan
          </Link>
        </div>

        {error && (
          <div className="mb-8 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl flex items-center gap-3">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-lime-500/30 border-t-lime-500 rounded-full animate-spin"></div>
            <p className="mt-4 text-zinc-500 font-medium">Loading your plans...</p>
          </div>
        ) : plans.length === 0 ? (
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-16 text-center">
            <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl text-zinc-500">📄</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">No plans found</h3>
            <p className="text-zinc-400 mb-8 max-w-sm mx-auto">
              Create your first subscription plan to start accepting memberships.
            </p>
            <Link
              to={`/owner/gyms/${gymId}/plans/add`}
              className="text-lime-400 hover:text-lime-300 font-semibold"
            >
              Add your first plan →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="group relative p-8 rounded-3xl border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900/80 hover:border-zinc-700 transition-all duration-300 flex flex-col h-full"
              >
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-white group-hover:text-lime-400 transition-colors mb-2">
                    {plan.planName}
                  </h3>
                  <div className="flex items-baseline gap-1 mt-4">
                    <span className="text-3xl font-black text-white">₹{plan.price}</span>
                    <span className="text-zinc-500 text-sm font-medium">/ {plan.durationDays} days</span>
                  </div>
                </div>

                <p className="text-zinc-400 text-sm leading-relaxed mb-8 flex-grow">
                  {plan.description || "No description provided for this plan."}
                </p>

                <Link
                  to={`/owner/plans/edit/${plan.id}`}
                  className="w-full text-center bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 rounded-xl transition-colors text-sm"
                >
                  Edit Plan
                </Link>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 pt-8 border-t border-zinc-900">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-zinc-500 hover:text-lime-400 transition-colors font-medium"
          >
            <span>←</span> Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
