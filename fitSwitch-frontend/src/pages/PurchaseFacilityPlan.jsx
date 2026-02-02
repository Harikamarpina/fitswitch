import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

export default function PurchaseFacilityPlan() {
  const navigate = useNavigate();
  const [planData, setPlanData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const selectedPlan = localStorage.getItem('selectedFacilityPlan');
    if (!selectedPlan) {
      navigate('/gyms');
      return;
    }
    
    try {
      setPlanData(JSON.parse(selectedPlan));
    } catch (err) {
      navigate('/gyms');
    }
  }, [navigate]);

  const handlePurchase = async () => {
    if (!planData) return;
    
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await axiosInstance.post('/user/facility/subscribe', {
        facilityPlanId: planData.facilityPlanId
      });
      
      setSuccess("Successfully subscribed to facility plan! Enjoy your sessions.");
      localStorage.removeItem('selectedFacilityPlan');
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate('/user/dashboard');
      }, 2000);
      
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to subscribe to facility plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!planData) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-5 py-8">
      <div className="max-w-2xl mx-auto">
        <Link to="/gyms" className="underline text-zinc-200 hover:text-white">
          ← Back to Gyms
        </Link>

        <h1 className="text-2xl font-bold mt-4">Purchase Facility Plan</h1>
        <p className="text-zinc-300 mt-2">Review your selected facility plan and complete purchase.</p>

        {error && (
          <div className="mt-4 bg-red-500/10 border border-red-500/30 text-red-200 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-4 bg-green-500/10 border border-green-500/30 text-green-200 p-3 rounded-lg text-sm">
            {success}
          </div>
        )}

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-xl font-bold mb-6">Facility Plan Details</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-white/10">
              <span className="text-zinc-300">Gym</span>
              <span className="font-semibold">{planData.gymName}</span>
            </div>
            
            <div className="flex justify-between items-center py-3 border-b border-white/10">
              <span className="text-zinc-300">Facility</span>
              <span className="font-semibold text-lime-400">{planData.facilityName}</span>
            </div>
            
            <div className="flex justify-between items-center py-3 border-b border-white/10">
              <span className="text-zinc-300">Plan</span>
              <span className="font-semibold">{planData.planName}</span>
            </div>
            
            <div className="flex justify-between items-center py-3 border-b border-white/10">
              <span className="text-zinc-300">Duration</span>
              <span className="font-semibold">{planData.durationDays} days</span>
            </div>
            
            <div className="flex justify-between items-center py-3">
              <span className="text-zinc-300">Price</span>
              <span className="font-bold text-lime-400 text-xl">₹{planData.price}</span>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10">
            {success ? (
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/user/dashboard')}
                  className="w-full px-4 py-3 rounded-xl bg-lime-400 text-black font-bold hover:bg-lime-300 transition"
                >
                  Go to Dashboard
                </button>
                <button
                  onClick={() => navigate('/gyms')}
                  className="w-full px-4 py-3 rounded-xl border border-white/20 hover:bg-white/10 transition"
                >
                  Browse More Facilities
                </button>
              </div>
            ) : (
              <button
                onClick={handlePurchase}
                disabled={loading}
                className="w-full px-4 py-3 rounded-xl bg-lime-400 text-black font-bold hover:bg-lime-300 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Processing..." : "Purchase Facility Plan"}
              </button>
            )}
            
            <p className="text-xs text-zinc-400 mt-3 text-center">
              By purchasing, you agree to the facility's terms and conditions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}