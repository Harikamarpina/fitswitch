import { useState, useEffect } from "react";
import { checkInToGym, checkOutFromGym } from "../api/sessionApi";
import { getAllGyms } from "../api/gymApi";

export default function UserSessionCard({ membership, onSessionUpdate, dashboardStats }) {
  const [loading, setLoading] = useState(false);
  const [activeSession, setActiveSession] = useState(null);
  const [error, setError] = useState("");
  const [gymId, setGymId] = useState(null);

  useEffect(() => {
    // Get gym ID by matching gym name
    const fetchGymId = async () => {
      try {
        const response = await getAllGyms();
        const gyms = response.data || [];
        const gym = gyms.find(g => g.name === membership.gymName || g.gymName === membership.gymName);
        
        if (gym) {
          setGymId(gym.id);
        } else {
          setGymId(1); // Fallback
        }
      } catch (err) {
        setGymId(1); // Fallback
      }
    };
    
    if (membership.gymId || membership.gym_id) {
      setGymId(membership.gymId || membership.gym_id);
    } else {
      fetchGymId();
    }
  }, [membership]);

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
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-lime-400">{membership.gymName}</h3>
          <p className="text-zinc-300 text-sm mt-1">{membership.planName}</p>
        </div>
        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
          membership.status === "ACTIVE" 
            ? "bg-green-500/20 text-green-400 border border-green-500/30" 
            : "bg-red-500/20 text-red-400 border border-red-500/30"
        }`}>
          {membership.status}
        </span>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex justify-between items-center text-sm">
          <span className="text-zinc-400">Duration</span>
          <span className="font-medium">{membership.durationDays} days</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-zinc-400">End Date</span>
          <span className="font-medium">{formatDate(membership.endDate)}</span>
        </div>
        <div className="flex justify-between items-center text-sm pt-2 border-t border-white/10">
          <span className="text-zinc-400">Price Paid</span>
          <span className="font-bold text-lime-400">₹{membership.price}</span>
        </div>
      </div>

      {error && (
        <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-200 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {activeSession && (
        <div className="mb-4 bg-lime-500/10 border border-lime-500/30 text-lime-200 p-3 rounded-lg text-sm">
          <p className="font-semibold">Active Session</p>
          <p>Checked in at: {new Date(activeSession.checkInTime).toLocaleTimeString()}</p>
        </div>
      )}

      <div className="pt-4 border-t border-white/10">
        {!activeSession ? (
          <button
            onClick={handleCheckIn}
            disabled={loading || membership.status !== "ACTIVE"}
            className={`w-full px-4 py-3 rounded-xl font-semibold transition ${
              loading || membership.status !== "ACTIVE"
                ? "bg-zinc-700 text-zinc-400 cursor-not-allowed"
                : "bg-lime-400 text-black hover:bg-lime-300"
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                Checking In...
              </div>
            ) : (
              "Check In to Gym"
            )}
          </button>
        ) : (
          <button
            onClick={handleCheckOut}
            disabled={loading}
            className={`w-full px-4 py-3 rounded-xl font-semibold transition ${
              loading
                ? "bg-zinc-700 text-zinc-400 cursor-not-allowed"
                : "bg-red-500 text-white hover:bg-red-400"
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Checking Out...
              </div>
            ) : (
              "Check Out from Gym"
            )}
          </button>
        )}
      </div>
    </div>
  );
}