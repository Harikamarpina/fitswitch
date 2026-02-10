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
      gymId: parseInt(gymId, 10),
      facilityId: plan.facilityId || parseInt(facilityId, 10),
      gymName: plan.gymName,
      facilityName: plan.facilityName,
      planName: plan.planName,
      price: plan.price,
      durationDays: plan.durationDays
    };
    
    localStorage.setItem('selectedFacilityPlan', JSON.stringify(planData));
    navigate('/purchase-facility-plan');
  };

  const getActivePlanIds = () => {
    const today = new Date();
    return new Set(
      userSubscriptions
        .filter(sub => sub.status === "ACTIVE" && sub.endDate && new Date(sub.endDate) >= today)
        .map(sub => sub.facilityPlanId)
        .filter(Boolean)
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
    <div className="min-h-screen bg-black text-white px-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Link
              to={`/gyms/${gymId}`}
              className="p-2 bg-zinc-900 hover:bg-zinc-800 rounded-xl transition-colors text-zinc-400 hover:text-white"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <span className="text-lime-400 font-medium tracking-wider uppercase text-xs">Facility Access</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            {facility?.facilityName} <span className="text-lime-400">Plans</span>
          </h1>
          <p className="text-zinc-400 mt-4 text-lg max-w-2xl leading-relaxed">
            Choose a plan that fits your schedule at 
            <span className="text-white font-semibold"> {gym?.gymName}</span>.
          </p>
        </div>

        {error && (
          <div className="mb-8 bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-2xl flex items-center gap-3">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        {!loading && !error && plans.length === 0 && (
          <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-[2.5rem] py-24 text-center">
            <div className="w-20 h-20 bg-zinc-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-2">No Plans Available</h3>
            <p className="text-zinc-500 max-w-xs mx-auto text-sm leading-relaxed">This facility hasn't listed any subscription plans yet. Please check back soon.</p>
          </div>
        )}

        {plans.length > 0 && (() => {
          const activePlanIds = getActivePlanIds();
          const visiblePlans = plans.filter(plan => !activePlanIds.has(plan.id));
          if (visiblePlans.length === 0) {
            return (
              <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-[2.5rem] py-16 text-center">
                <p className="text-zinc-500">You already have an active plan for this facility.</p>
              </div>
            );
          }
          return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {visiblePlans.map((plan) => (
                <div
                  key={plan.id}
                  className="group relative flex flex-col bg-zinc-900/40 border border-zinc-800/50 rounded-[2rem] p-8 hover:bg-zinc-900/60 hover:border-zinc-700/50 transition-all duration-300"
                >
                  <div className="mb-6">
                    <div className="w-12 h-12 bg-lime-400/10 rounded-2xl flex items-center justify-center mb-4">
                      <svg className="w-6 h-6 text-lime-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-white group-hover:text-lime-400 transition-colors">
                      {plan.planName}
                    </h3>
                  </div>

                  <div className="space-y-4 mb-8 border-t border-zinc-800/50 pt-6">
                    <div className="flex justify-between items-end">
                      <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Duration</span>
                      <span className="text-lg font-bold text-zinc-200">{plan.durationDays} <span className="text-zinc-500 font-medium">Days</span></span>
                    </div>
                    <div className="flex justify-between items-end border-b border-zinc-800/50 pb-6">
                      <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Price</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black text-lime-400">₹{plan.price}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-10 flex-grow">
                    <p className="text-zinc-400 text-sm leading-relaxed italic line-clamp-3">
                      "{plan.description || `Premium access to all ${facility?.facilityName} equipment and classes.`}"
                    </p>
                  </div>

                  <button
                    onClick={() => handleSelectPlan(plan)}
                    className="h-14 w-full rounded-2xl font-bold transition-all active:scale-[0.98] flex items-center justify-center gap-2 bg-lime-400 text-black hover:bg-lime-300 shadow-[0_0_20px_rgba(163,230,53,0.15)] group-hover:shadow-[0_0_30px_rgba(163,230,53,0.25)]"
                  >
                    Purchase Plan
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          );
        })()}
      </div>
    </div>
  );
}
