import { useState, useEffect } from "react";
import { checkInToGym, checkOutFromGym, getCurrentSession } from "../api/sessionApi";
import { getAllGyms } from "../api/gymApi";

export default function FacilitySessionCard({ subscription, onSessionUpdate, dashboardStats }) {
  const [loading, setLoading] = useState(false);
  const [activeSession, setActiveSession] = useState(null);
  const [error, setError] = useState("");
  const [gymId, setGymId] = useState(null);

  useEffect(() => {
    // Get gym ID for facility subscription
    const fetchGymId = async () => {
      try {
        const response = await getAllGyms();
        const gyms = response.data || [];
        const gym = gyms.find(g => g.name === subscription.gymName || g.gymName === subscription.gymName);
        
        if (gym) {
          setGymId(gym.id);
        } else {
          setGymId(1); // Fallback
        }
      } catch (err) {
        setGymId(1); // Fallback
      }
    };
    
    if (subscription.gymId || subscription.gym_id) {
      setGymId(subscription.gymId || subscription.gym_id);
    } else {
      fetchGymId();
    }
  }, [subscription]);

  useEffect(() => {
    // Set active session based on dashboard stats
    if (dashboardStats?.currentSessionStatus === "ACTIVE") {
      setActiveSession({ status: "ACTIVE", checkInTime: new Date() });
    } else {
      setActiveSession(null);
    }
  }, [dashboardStats]);

  const handleCheckIn = async () => {
    try {
      setLoading(true);
      setError("");
      
      if (!gymId) {
        setError("Unable to determine gym ID. Please try again.");
        return;
      }
      
      const response = await checkInToGym(gymId);
      setActiveSession(response.data);
      
      if (onSessionUpdate) {
        onSessionUpdate(response.data);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Check-in failed";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    try {
      setLoading(true);
      setError("");
      
      const response = await checkOutFromGym();
      setActiveSession(null);
      
      if (onSessionUpdate) {
        onSessionUpdate(null);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Check-out failed";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6 hover:bg-zinc-900/60 transition-all group backdrop-blur-sm">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-bold tracking-tight text-white group-hover:text-purple-400 transition-colors">
            {subscription.facilityName}
          </h3>
          <p className="text-zinc-500 text-sm font-medium mt-1">{subscription.gymName}</p>
          <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest mt-2">{subscription.planName}</p>
        </div>
        <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full border ${
          subscription.status === "ACTIVE" 
            ? "bg-green-500/10 text-green-500 border-green-500/20" 
            : "bg-red-500/10 text-red-500 border-red-500/20"
        }`}>
          {subscription.status}
        </span>
      </div>

      <div className="space-y-4 mb-8">
        <div className="flex justify-between items-center">
          <span className="text-xs font-semibold text-zinc-600 uppercase tracking-tighter">Duration</span>
          <span className="text-sm font-bold text-zinc-300">{subscription.durationDays} days</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs font-semibold text-zinc-600 uppercase tracking-tighter">Expires On</span>
          <span className="text-sm font-bold text-zinc-300">{formatDate(subscription.endDate)}</span>
        </div>
        <div className="flex justify-between items-center pt-3 border-t border-zinc-800/50">
          <span className="text-xs font-semibold text-zinc-600 uppercase tracking-tighter">Investment</span>
          <span className="text-lg font-black text-purple-400">₹{subscription.price}</span>
        </div>
      </div>

      {error && (
        <div className="mb-4 bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-xs font-medium">
          {error}
        </div>
      )}

      {activeSession && (
        <div className="mb-6 bg-zinc-950 border border-zinc-800 p-4 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">Access Active</p>
          </div>
          <p className="text-lg font-bold mt-1 text-white">
            Entered at {new Date(activeSession.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      )}

      <div className="space-y-3">
        {!activeSession ? (
          <button
            onClick={handleCheckIn}
            disabled={loading || subscription.status !== "ACTIVE"}
            className={`w-full py-3.5 rounded-2xl font-bold transition-all active:scale-[0.98] ${
              loading || subscription.status !== "ACTIVE"
                ? "bg-zinc-800 text-zinc-600 cursor-not-allowed"
                : "bg-purple-500 text-white hover:bg-purple-400 shadow-lg shadow-purple-500/10"
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : "Access Facility"}
          </button>
        ) : (
          <button
            onClick={handleCheckOut}
            disabled={loading}
            className={`w-full py-3.5 rounded-2xl font-bold transition-all active:scale-[0.98] ${
              loading
                ? "bg-zinc-800 text-zinc-600 cursor-not-allowed"
                : "bg-zinc-100 text-black hover:bg-white"
            }`}
          >
            {loading ? "Processing..." : "End Session"}
          </button>
        )}
      </div>
    </div>
  );
}