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
        <p>Loading facility plans...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-zinc-800 text-white px-4 py-10">
      <div className="max-w-4xl mx-auto bg-white/5 border border-white/10 rounded-2xl p-8 shadow-xl">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold">Facility Plans</h2>
            <p className="text-zinc-300 text-sm mt-1">
              Manage subscription plans for {facility?.facilityName} at {facility?.gymName}
            </p>
          </div>
          <Link
            to={`/owner/facilities/${facilityId}/plans/add`}
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

        {plans.length === 0 ? (
          <p className="mt-6 text-zinc-300">No facility plans created yet.</p>
        ) : (
          <div className="mt-6 grid gap-4">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="p-4 rounded-xl border border-white/10 bg-black/30"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold">{plan.planName}</h3>
                    <p className="text-zinc-300 text-sm mt-1">{plan.description}</p>
                    <div className="flex gap-4 mt-2 text-sm">
                      <span className="text-lime-400 font-semibold">₹{plan.price}</span>
                      <span className="text-zinc-400">{plan.durationDays} days</span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        plan.active ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                      }`}>
                        {plan.active ? "ACTIVE" : "INACTIVE"}
                      </span>
                    </div>
                  </div>
                </div>
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