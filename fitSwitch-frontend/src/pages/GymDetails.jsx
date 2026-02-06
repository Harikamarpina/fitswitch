import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getGymDetails, getGymFacilities, getGymPlans } from "../api/publicGymApi";
import { getGymFacilityPlans } from "../api/facilityApi";
import { useFacility } from "../api/walletApi";

export default function GymDetails() {
  const { gymId } = useParams();
  const navigate = useNavigate();
  const [gym, setGym] = useState(null);
  const [facilities, setFacilities] = useState([]);
  const [plans, setPlans] = useState([]);
  const [facilityPlans, setFacilityPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cardMessage, setCardMessage] = useState("");
  const [cardError, setCardError] = useState("");
  const [cardLoading, setCardLoading] = useState({});

  useEffect(() => {
    const fetchGymData = async () => {
      try {
        const [gymRes, facilitiesRes, plansRes, facilityPlansRes] = await Promise.all([
          getGymDetails(gymId),
          getGymFacilities(gymId),
          getGymPlans(gymId),
          getGymFacilityPlans(gymId)
        ]);
        
        setGym(gymRes.data);
        setFacilities(facilitiesRes.data || []);
        setPlans(plansRes.data || []);
        setFacilityPlans(facilityPlansRes.data || []);
      } catch (err) {
        setError("Failed to load gym details");
      } finally {
        setLoading(false);
      }
    };
    
    fetchGymData();
  }, [gymId]);

  const handleSelectPlan = (plan) => {
    const planData = {
      gymId: parseInt(gymId),
      planId: plan.id,
      gymName: gym.gymName,
      planName: plan.planName,
      price: plan.price,
      durationDays: plan.durationDays
    };
    
    localStorage.setItem('selectedPlan', JSON.stringify(planData));
    navigate('/purchase-plan');
  };

  const handleUseCard = async (facilityId) => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    setCardMessage("");
    setCardError("");

    if (!token || token === "undefined" || token === "null") {
      navigate("/login");
      return;
    }

    if (role !== "USER") {
      setCardError("Only users can access facilities with the digital card.");
      return;
    }

    try {
      setCardLoading((prev) => ({ ...prev, [facilityId]: true }));
      const response = await useFacility(parseInt(gymId, 10), facilityId);
      if (response?.success === false) {
        setCardError(response?.message || "Facility access failed.");
      } else {
        setCardMessage("Facility access granted. Enjoy your session!");
      }
    } catch (err) {
      const msg = err?.message || "Facility access failed.";
      setCardError(msg);
    } finally {
      setCardLoading((prev) => ({ ...prev, [facilityId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Loading gym details...</p>
      </div>
    );
  }

  if (error || !gym) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-red-400">{error || "Gym not found"}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-lime-500/5 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2" />
      
      <div className="max-w-5xl mx-auto relative z-10">
        <Link to="/owner/gyms" className="text-base font-bold text-zinc-400 hover:text-lime-500 transition-colors mb-10 inline-flex items-center gap-2 group">
          <span className="group-hover:-translate-x-1 transition-transform">←</span> Back
        </Link>

        {/* Gym Header Section */}
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-10 mb-12 backdrop-blur-md">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
              <span className="inline-block px-3 py-1 rounded-full bg-lime-500/10 border border-lime-500/20 text-lime-500 text-[10px] font-bold tracking-widest uppercase">
                Partner Gym
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">{gym.gymName}</h1>
              <div className="space-y-1">
                <p className="text-zinc-400 font-medium">{gym.address}</p>
                <p className="text-zinc-500 text-sm">{gym.city}, {gym.state} - {gym.pincode}</p>
              </div>
            </div>
            
            <div className="flex flex-col items-start md:items-end gap-3 pt-6 md:pt-0 border-t md:border-t-0 border-zinc-800">
              <div className="flex items-center gap-3">
                <span className="text-xl">📞</span>
                <span className="font-bold text-zinc-300">{gym.contactNumber}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xl">🕒</span>
                <span className="font-bold text-zinc-300">{gym.openTime} - {gym.closeTime}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-10">
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-12">
            {(cardMessage || cardError) && (
              <div className={`p-4 rounded-2xl text-sm font-medium ${
                cardError
                  ? "bg-red-500/10 border border-red-500/20 text-red-400"
                  : "bg-lime-400/10 border border-lime-400/20 text-lime-400"
              }`}>
                {cardError || cardMessage}
              </div>
            )}
            
            {/* Membership Plans Section */}
            <section>
              <div className="flex items-center gap-4 mb-8">
                <h2 className="text-2xl font-bold">Membership Plans</h2>
                <div className="h-px flex-1 bg-zinc-800"></div>
              </div>
              
              {plans.length === 0 ? (
                <div className="p-10 rounded-3xl bg-zinc-900/20 border border-zinc-800/50 border-dashed text-center">
                  <p className="text-zinc-500 font-medium">No memberships available at this location.</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {plans.map((plan) => (
                    <div key={plan.id} className="p-8 rounded-3xl bg-zinc-900/40 border border-zinc-800 hover:border-lime-500/30 transition-all flex flex-col">
                      <h3 className="text-xl font-bold mb-3">{plan.planName}</h3>
                      <p className="text-zinc-500 text-sm leading-relaxed mb-8 flex-1">{plan.description}</p>
                      
                      <div className="flex items-end justify-between mb-8">
                        <div>
                          <span className="text-xs font-bold text-zinc-600 uppercase tracking-tighter block mb-1">Total Access</span>
                          <span className="text-2xl font-black text-lime-500">₹{plan.price}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-bold text-zinc-600 uppercase tracking-tighter block mb-1">Duration</span>
                          <span className="text-sm font-bold text-zinc-300">{plan.durationDays} Days</span>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => handleSelectPlan(plan)}
                        className="w-full py-4 rounded-2xl bg-zinc-100 text-black font-bold hover:bg-white transition-all active:scale-[0.98]"
                      >
                        Enroll Now
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Facilities Section */}
            <section>
              <div className="flex items-center gap-4 mb-8">
                <h2 className="text-2xl font-bold">Available Facilities</h2>
                <div className="h-px flex-1 bg-zinc-800"></div>
              </div>
              
              {facilities.length === 0 ? (
                <p className="text-zinc-500 italic">This gym hasn't listed specific facilities yet.</p>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {facilities.map((facility) => (
                    <div key={facility.id} className="p-6 rounded-2xl bg-zinc-900/20 border border-zinc-800/50 group hover:border-zinc-700 transition-colors">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-bold text-white group-hover:text-lime-500 transition-colors">{facility.facilityName}</h3>
                          {facility.description && (
                            <p className="text-zinc-500 text-xs mt-2 leading-relaxed">{facility.description}</p>
                          )}
                        </div>
                        {facility.hasPlans && (
                          <Link
                            to={`/gyms/${gymId}/facilities/${facility.id}/plans`}
                            className="ml-4 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-full bg-zinc-800 text-zinc-400 hover:bg-lime-500 hover:text-black transition-all"
                          >
                            Add-ons
                          </Link>
                        )}
                      </div>

                      <div className="mt-5">
                        <button
                          onClick={() => handleUseCard(facility.id)}
                          disabled={cardLoading[facility.id]}
                          className={`w-full py-3 rounded-xl font-bold text-sm transition-all active:scale-[0.98] ${
                            cardLoading[facility.id]
                              ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                              : "bg-lime-500 text-black hover:bg-lime-400"
                          }`}
                        >
                          {cardLoading[facility.id] ? "Processing..." : "Use Digital Card "}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Sidebar Area - Facility Add-On Plans */}
          {facilityPlans.length > 0 && (
            <aside className="lg:col-span-4">
              <div className="sticky top-10 space-y-6">
                <div className="p-8 rounded-3xl bg-zinc-900/60 border border-zinc-800 backdrop-blur-md">
                  <h2 className="text-xl font-bold mb-2">Enhance Experience</h2>
                  <p className="text-zinc-500 text-sm mb-8 leading-relaxed">Specific facility plans designed to target your fitness goals.</p>
                  
                  <div className="space-y-10">
                    {Object.entries(
                      facilityPlans.reduce((acc, plan) => {
                        if (!acc[plan.facilityName]) {
                          acc[plan.facilityName] = [];
                        }
                        acc[plan.facilityName].push(plan);
                        return acc;
                      }, {})
                    ).map(([facilityName, plans]) => (
                      <div key={facilityName} className="space-y-4">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-lime-500">{facilityName}</h3>
                        <div className="space-y-3">
                          {plans.map((plan) => (
                            <div key={plan.id} className="p-4 rounded-2xl bg-black/40 border border-zinc-800 group hover:border-lime-500/20 transition-all">
                              <h4 className="font-bold text-sm mb-1">{plan.planName}</h4>
                              <div className="flex justify-between items-center mt-4">
                                <span className="text-sm font-black text-white">₹{plan.price}</span>
                                <Link
                                  to={`/gyms/${gymId}/facilities/${plan.facilityId}/plans`}
                                  className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-lime-500 transition-colors"
                                >
                                  Details →
                                </Link>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}

