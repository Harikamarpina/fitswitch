import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

export default function UserGymVisit() {
  const { gymId } = useParams();
  const [gym, setGym] = useState(null);
  const [membership, setMembership] = useState(null);
  const [activeVisit, setActiveVisit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchData();
  }, [gymId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch user memberships to check if user has active membership for this gym
      const membershipsRes = await axiosInstance.get("/user/memberships");
      console.log('All memberships:', membershipsRes.data);
      console.log('Looking for gymId:', gymId);
      
      const activeMembership = membershipsRes.data.find(
        m => m.gymId == gymId && m.status === "ACTIVE"
      );
      
      console.log('Found membership:', activeMembership);
      
      if (activeMembership) {
        setMembership(activeMembership);
        // Use gym info from membership data
        setGym({
          gymName: activeMembership.gymName,
          gymId: activeMembership.gymId
        });
      } else {
        // Still set gym object even if no membership, so we don't show "gym not found"
        const anyMembership = membershipsRes.data.find(m => m.gymId == gymId);
        if (anyMembership) {
          setGym({
            gymName: anyMembership.gymName,
            gymId: anyMembership.gymId
          });
        } else {
          setError("No membership found for this gym");
        }
      }

    } catch (err) {
      console.error('Error fetching data:', err);
      setError("Failed to load membership information");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    setActionLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axiosInstance.post("/user/visit/check-in", {
        gymId: parseInt(gymId)
      });
      
      setActiveVisit(response.data);
      setSuccess("Successfully checked in! Enjoy your workout.");
      
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to check in");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setActionLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axiosInstance.post("/user/visit/check-out");
      
      setActiveVisit(response.data);
      setSuccess("Successfully checked out! Great workout session.");
      
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to check out");
    } finally {
      setActionLoading(false);
    }
  };

  const formatTime = (dateTime) => {
    return new Date(dateTime).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-400 mx-auto mb-4"></div>
          <p className="text-zinc-300">Loading gym information...</p>
        </div>
      </div>
    );
  }

  if (!gym && !loading) {
    return (
      <div className="min-h-screen bg-black text-white px-5 py-8">
        <div className="max-w-2xl mx-auto">
          <Link to="/user/dashboard" className="underline text-zinc-200 hover:text-white">
            ← Back to Dashboard
          </Link>
          <div className="mt-8 text-center">
            <p className="text-red-400 mb-4">No membership found for this gym</p>
            <Link
              to="/gyms"
              className="inline-block px-6 py-3 rounded-xl bg-lime-400 text-black font-semibold hover:bg-lime-300 transition"
            >
              Browse Gyms
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-5 py-8">
      <div className="max-w-2xl mx-auto">
        <Link to="/user/dashboard" className="underline text-zinc-200 hover:text-white">
          ← Back to Dashboard
        </Link>

        <h1 className="text-2xl font-bold mt-4">Gym Visit</h1>
        <p className="text-zinc-300 mt-2">Check in and out of your gym sessions</p>

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

        {/* Gym Information */}
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-bold mb-4">{gym.gymName}</h2>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-zinc-300">Membership Status</span>
              {membership ? (
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                  ACTIVE
                </span>
              ) : (
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                  NO MEMBERSHIP
                </span>
              )}
            </div>
            
            {membership && (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-300">Plan</span>
                  <span className="text-sm">{membership.planName}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-zinc-300">Valid Until</span>
                  <span className="text-sm">{new Date(membership.endDate).toLocaleDateString()}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Visit Status */}
        {membership && (
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-lg font-semibold mb-4">Today's Visit</h3>
            
            {activeVisit ? (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-300">Status</span>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    activeVisit.status === "ACTIVE" 
                      ? "bg-lime-500/20 text-lime-400 border border-lime-500/30"
                      : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                  }`}>
                    {activeVisit.status === "ACTIVE" ? "CHECKED IN" : "COMPLETED"}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-zinc-300">Check-in Time</span>
                  <span className="font-medium">{formatTime(activeVisit.checkInTime)}</span>
                </div>
                
                {activeVisit.checkOutTime && (
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-300">Check-out Time</span>
                    <span className="font-medium">{formatTime(activeVisit.checkOutTime)}</span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-zinc-400">No visit recorded for today</p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8">
          {!membership ? (
            <div className="text-center">
              <p className="text-zinc-400 mb-4">You need an active membership to visit this gym</p>
              <Link
                to="/gyms"
                className="inline-block px-6 py-3 rounded-xl bg-lime-400 text-black font-semibold hover:bg-lime-300 transition"
              >
                Browse Gym Plans
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Check In Button */}
              {(!activeVisit || activeVisit.status === "COMPLETED") && (
                <button
                  onClick={handleCheckIn}
                  disabled={actionLoading}
                  className="w-full px-4 py-3 rounded-xl bg-lime-400 text-black font-bold hover:bg-lime-300 transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {actionLoading ? "Checking In..." : "Check In"}
                </button>
              )}

              {/* Check Out Button */}
              {activeVisit && activeVisit.status === "ACTIVE" && (
                <button
                  onClick={handleCheckOut}
                  disabled={actionLoading}
                  className="w-full px-4 py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-400 transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {actionLoading ? "Checking Out..." : "Check Out"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}