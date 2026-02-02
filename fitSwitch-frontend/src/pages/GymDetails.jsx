import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getGymDetails, getGymFacilities, getGymPlans } from "../api/publicGymApi";

export default function GymDetails() {
  const { gymId } = useParams();
  const navigate = useNavigate();
  const [gym, setGym] = useState(null);
  const [facilities, setFacilities] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGymData = async () => {
      try {
        const [gymRes, facilitiesRes, plansRes] = await Promise.all([
          getGymDetails(gymId),
          getGymFacilities(gymId),
          getGymPlans(gymId)
        ]);
        
        setGym(gymRes.data);
        setFacilities(facilitiesRes.data || []);
        setPlans(plansRes.data || []);
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
    <div className="min-h-screen bg-black text-white px-5 py-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/gyms" className="underline text-zinc-200 hover:text-white mb-6 inline-block">
          ← Back to Gyms
        </Link>

        {/* Gym Info */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 mb-8">
          <h1 className="text-3xl font-bold mb-4">{gym.gymName}</h1>
          <div className="grid md:grid-cols-2 gap-6 text-zinc-300">
            <div>
              <p className="mb-2"><span className="text-white font-semibold">Address:</span> {gym.address}</p>
              <p className="mb-2"><span className="text-white font-semibold">City:</span> {gym.city}, {gym.state}</p>
              <p className="mb-2"><span className="text-white font-semibold">Pincode:</span> {gym.pincode}</p>
            </div>
            <div>
              <p className="mb-2"><span className="text-white font-semibold">Contact:</span> {gym.contactNumber}</p>
              <p className="mb-2"><span className="text-white font-semibold">Hours:</span> {gym.openTime} - {gym.closeTime}</p>
            </div>
          </div>
        </div>

        {/* Facilities */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Facilities</h2>
          {facilities.length === 0 ? (
            <p className="text-zinc-300">No facilities listed.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {facilities.map((facility) => (
                <div key={facility.id} className="p-4 rounded-xl bg-black/30 border border-white/10">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold">{facility.facilityName}</h3>
                      {facility.description && (
                        <p className="text-zinc-300 text-sm mt-1">{facility.description}</p>
                      )}
                    </div>
                    <Link
                      to={`/gyms/${gymId}/facilities/${facility.id}/plans`}
                      className="ml-4 px-3 py-1 text-xs rounded-xl bg-lime-400 text-black font-semibold hover:bg-lime-300 transition"
                    >
                      View Plans
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Plans */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-2xl font-bold mb-4">Membership Plans</h2>
          {plans.length === 0 ? (
            <p className="text-zinc-300">No plans available.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {plans.map((plan) => (
                <div key={plan.id} className="p-6 rounded-xl bg-black/30 border border-white/10">
                  <h3 className="text-xl font-semibold mb-2">{plan.planName}</h3>
                  <p className="text-zinc-300 text-sm mb-4">{plan.description}</p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lime-400 font-bold text-lg">₹{plan.price}</span>
                    <span className="text-zinc-300">{plan.durationDays} days</span>
                  </div>
                  <button 
                    onClick={() => handleSelectPlan(plan)}
                    className="w-full px-4 py-2 rounded-xl bg-lime-400 text-black font-semibold hover:bg-lime-300 transition"
                  >
                    Select Plan
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
