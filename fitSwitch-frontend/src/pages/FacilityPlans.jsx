import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

export default function FacilityPlans() {
  const { gymId, facilityId } = useParams();
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [facility, setFacility] = useState(null);
  const [gym, setGym] = useState(null);
  const [userSubscriptions, setUserSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, [gymId, facilityId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch facility plans
      const plansRes = await axiosInstance.get(`/gyms/${gymId}/facilities/${facilityId}/plans`);
      setPlans(plansRes.data || []);
      
      if (plansRes.data && plansRes.data.length > 0) {
        setGym({ gymName: plansRes.data[0].gymName });
        setFacility({ facilityName: plansRes.data[0].facilityName });
      }

      // Fetch user's facility subscriptions to check active ones
      try {
        const subscriptionsRes = await axiosInstance.get("/user/facility/subscriptions");
        setUserSubscriptions(subscriptionsRes.data || []);
      } catch (err) {
        // User might not be logged in, ignore error
        setUserSubscriptions([]);
      }

    } catch (err) {
      setError("Failed to load facility plans");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = (plan) => {
    const planData = {
      facilityPlanId: plan.id,
      gymName: plan.gymName,
      facilityName: plan.facilityName,
      planName: plan.planName,
      price: plan.price,
      durationDays: plan.durationDays
    };
    
    localStorage.setItem('selectedFacilityPlan', JSON.stringify(planData));
    navigate('/purchase-facility-plan');
  };

  const hasActiveSubscription = (facilityId) => {
    return userSubscriptions.some(sub => 
      sub.facilityId == facilityId && sub.status === "ACTIVE"
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-400 mx-auto mb-4"></div>
          <p className="text-zinc-300">Loading facility plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-5 py-8">
      <div className="max-w-4xl mx-auto">
        <Link to={`/gyms/${gymId}`} className="underline text-zinc-200 hover:text-white">
          ← Back to Gym Details
        </Link>

        <div className="mt-6">
          <h1 className="text-3xl font-bold">{facility?.facilityName} Plans</h1>
          <p className="text-zinc-300 mt-2">
            Available subscription plans for {facility?.facilityName} at {gym?.gymName}
          </p>
        </div>

        {error && (
          <div className="mt-4 bg-red-500/10 border border-red-500/30 text-red-200 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {!loading && !error && plans.length === 0 && (
          <div className="mt-8 text-center py-16">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-12 max-w-md mx-auto">
              <div className="text-6xl mb-4">🏃‍♀️</div>
              <h3 className="text-xl font-semibold mb-2">No plans available</h3>
              <p className="text-zinc-400">
                This facility doesn't have any subscription plans yet.
              </p>
            </div>
          </div>
        )}

        {plans.length > 0 && (
          <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => {
              const isActive = hasActiveSubscription(plan.facilityId);
              
              return (
                <div
                  key={plan.id}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition"
                >
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold text-lime-400">
                      {plan.planName}
                    </h3>
                    {plan.description && (
                      <p className="text-zinc-300 text-sm mt-2">{plan.description}</p>
                    )}
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-zinc-400">Duration</span>
                      <span className="font-medium">{plan.durationDays} days</span>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-white/10">
                      <span className="text-zinc-400">Price</span>
                      <span className="font-bold text-lime-400 text-xl">₹{plan.price}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSelectPlan(plan)}
                    disabled={isActive}
                    className={`w-full px-4 py-3 rounded-xl font-semibold transition ${
                      isActive
                        ? "bg-zinc-700 text-zinc-400 cursor-not-allowed"
                        : "bg-lime-400 text-black hover:bg-lime-300"
                    }`}
                  >
                    {isActive ? "Already Subscribed" : "Buy Facility Plan"}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link to="/gyms" className="underline text-zinc-200 hover:text-white">
            ← Browse All Gyms
          </Link>
        </div>
      </div>
    </div>
  );
}