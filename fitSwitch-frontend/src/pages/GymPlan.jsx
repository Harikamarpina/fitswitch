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
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-zinc-800 text-white px-4 py-10">
      <div className="max-w-4xl mx-auto bg-white/5 border border-white/10 rounded-2xl p-8 shadow-xl">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold">Gym Plans</h2>
            <p className="text-zinc-300 text-sm mt-1">
              Manage subscription plans for your gym.
            </p>
          </div>
          <Link
            to={`/owner/gyms/${gymId}/plans/add`}
            className="bg-lime-500 hover:bg-lime-400 text-black font-semibold px-4 py-2 rounded-xl transition"
          >
            + Add Plan
          </Link>
        </div>

        {error && (
          <div className="mt-4 bg-red-500/10 border border-red-500/30 text-red-200 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <p className="mt-6 text-zinc-300">Loading plans...</p>
        ) : plans.length === 0 ? (
          <p className="mt-6 text-zinc-300">No plans created yet.</p>
        ) : (
          <div className="mt-6 grid gap-4">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="p-4 rounded-xl border border-white/10 bg-black/30 flex justify-between items-start"
              >
                <div>
                  <h3 className="text-xl font-semibold">{plan.planName}</h3>
                  <p className="text-zinc-300 text-sm mt-1">{plan.description}</p>
                  <p className="text-lime-400 font-semibold mt-2">₹{plan.price} / {plan.durationDays} days</p>
                </div>
                <Link
                  to={`/owner/plans/edit/${plan.id}`}
                  className="px-4 py-2 text-sm rounded-xl bg-white/10 hover:bg-white/20 transition"
                >
                  Edit
                </Link>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8">
          <Link
            to="/dashboard"
            className="text-lime-400 hover:underline text-sm"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
