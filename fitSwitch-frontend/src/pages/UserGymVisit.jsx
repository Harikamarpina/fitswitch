import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { checkInToMembership, checkOutFromMembership, getMembershipSession } from "../api/sessionApi";

export default function UserGymVisit() {
  const { gymId } = useParams();
  const [gym, setGym] = useState(null);
  const [membership, setMembership] = useState(null);
  const [activeVisit, setActiveVisit] = useState(null);
  const [lastVisit, setLastVisit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const storageKey = gymId ? `fitswitch:visit:${gymId}` : "";

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

        try {
          const sessionRes = await getMembershipSession(activeMembership.id);
          const sessionData = sessionRes.data;
          setLastVisit(sessionData || null);
          if (sessionData?.status === "ACTIVE") {
            setActiveVisit(sessionData);
          } else {
            setActiveVisit(null);
          }
        } catch (err) {
          setActiveVisit(null);
          setLastVisit(null);
        }
      } else {
        // Still set gym object even if no membership, so we don't show "gym not found"
        const anyMembership = membershipsRes.data.find(m => m.gymId == gymId);
        if (anyMembership) {
          setGym({
            gymName: anyMembership.gymName,
            gymId: anyMembership.gymId
          });
          setActiveVisit(null);
          setLastVisit(null);
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
      const response = await checkInToMembership(membership.id);

      setActiveVisit(response.data);
      setLastVisit(response.data);
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
      const response = await checkOutFromMembership(membership.id);

      setActiveVisit(null);
      setLastVisit(response.data);
      if (storageKey) {
        localStorage.setItem(storageKey, JSON.stringify({
          completedAt: new Date().toISOString(),
          visitDate: response.data?.visitDate || response.data?.checkInTime || new Date().toISOString(),
          status: response.data?.status || "COMPLETED"
        }));
      }
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

  const isSameDay = (a, b) => {
    const da = new Date(a);
    const db = new Date(b);
    return da.getFullYear() === db.getFullYear()
      && da.getMonth() === db.getMonth()
      && da.getDate() === db.getDate();
  };

  const today = new Date();
  const localLock = (() => {
    if (!storageKey) return null;
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })();

  const hasVisitToday = (
    (lastVisit && (
      (lastVisit.visitDate && isSameDay(lastVisit.visitDate, today)) ||
      (lastVisit.checkInTime && isSameDay(lastVisit.checkInTime, today))
    )) ||
    (localLock && localLock.visitDate && isSameDay(localLock.visitDate, today))
  );

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
      <div className="min-h-screen bg-black text-white px-6 py-10">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <Link to="/user/dashboard" className="text-sm font-medium text-zinc-500 hover:text-white transition-colors">
              ← Back to Dashboard
            </Link>
          </div>
          <div className="text-6xl mb-6 opacity-20">🚫</div>
          <div className="text-center py-20 bg-zinc-900/20 border border-zinc-800/50 border-dashed rounded-3xl">
            <h2 className="text-2xl font-bold mb-2">No Membership Found</h2>
          <p className="text-zinc-500 mb-8 max-w-sm mx-auto">
            You need an active membership to access this gym's session controls.
          </p>
          <Link
            to="/gyms"
            className="inline-block px-8 py-3.5 rounded-2xl bg-lime-500 text-black font-bold hover:bg-lime-400 transition-all active:scale-95 shadow-lg shadow-lime-500/10"
          >
            Browse Gyms
          </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-lime-500/5 blur-[150px] rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-2xl mx-auto relative z-10">
        <div className="mb-12">
          <Link
            to="/user/dashboard"
            className="text-sm font-medium text-zinc-500 hover:text-white transition-colors flex items-center gap-2 mb-6"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold tracking-tight">Gym Visit</h1>
          <p className="text-zinc-400 mt-2 text-lg">
            Manage your attendance for today's session.
          </p>
        </div>

        {error && (
          <div className="mb-8 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl text-sm font-medium">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-8 bg-lime-500/10 border border-lime-500/20 text-lime-400 p-4 rounded-2xl text-sm font-medium">
            {success}
          </div>
        )}

        {/* Gym Information Card */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-8 mb-8 backdrop-blur-md relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-8">
              <div>
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest block mb-2">Partner Gym</span>
                <h2 className="text-3xl font-bold text-white tracking-tight">{gym.gymName}</h2>
              </div>
              {membership ? (
                <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full bg-lime-500/10 text-lime-500 border border-lime-500/20">
                  Active Member
                </span>
              ) : (
                <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full bg-red-500/10 text-red-500 border border-red-500/20">
                  No Membership
                </span>
              )}
            </div>

            {membership && (
              <div className="grid grid-cols-2 gap-6 pt-6 border-t border-zinc-800/50">
                <div>
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter block mb-1">Active Plan</span>
                  <span className="text-sm font-bold text-zinc-200">{membership.planName}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter block mb-1">Valid Until</span>
                  <span className="text-sm font-bold text-zinc-200">{new Date(membership.endDate).toLocaleDateString("en-IN", { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Visit Status Card */}
        {membership && (
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-8 mb-10">
            <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-6">Today's Session</h3>

            {lastVisit ? (
              <div className="space-y-6">
                <div className="flex justify-between items-center p-4 bg-black/40 rounded-2xl border border-zinc-800/50">
                  <span className="text-zinc-400 font-medium">Current Status</span>
                  <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-md ${
                    lastVisit.status === "ACTIVE"
                      ? "bg-lime-500 text-black shadow-lg shadow-lime-500/10"
                      : "bg-zinc-800 text-zinc-400"
                  }`}>
                    {lastVisit.status === "ACTIVE" ? "Checked In" : "Completed"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-black/20 rounded-2xl border border-zinc-800/50 text-center">
                    <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest block mb-1">Entry</span>
                    <span className="text-xl font-black text-zinc-200">{lastVisit.checkInTime ? formatTime(lastVisit.checkInTime) : "--:--"}</span>
                  </div>

                  <div className="p-4 bg-black/20 rounded-2xl border border-zinc-800/50 text-center">
                    <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest block mb-1">Exit</span>
                    <span className="text-xl font-black text-zinc-200">
                      {lastVisit.checkOutTime ? formatTime(lastVisit.checkOutTime) : "--:--"}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-zinc-500 italic">No attendance recorded for today yet.</p>
              </div>
            )}
          </div>
        )}

        {/* Action Controls */}
        <div className="space-y-4">
          {!membership ? (
            <div className="text-center p-8 bg-zinc-900/20 border border-zinc-800 border-dashed rounded-3xl">
              <p className="text-zinc-500 font-medium mb-6">You need an active membership to access this gym.</p>
              <Link
                to={`/gyms/${gymId}`}
                className="inline-block px-8 py-4 rounded-2xl bg-lime-500 text-black font-bold hover:bg-lime-400 transition-all active:scale-[0.98]"
              >
                Browse Gym Plans
              </Link>
            </div>
          ) : (
            <div className="grid gap-4">
              {/* Check In Button */}
              {!hasVisitToday && (
                <button
                  onClick={handleCheckIn}
                  disabled={actionLoading}
                  className="w-full py-5 rounded-2xl bg-lime-500 text-black font-black text-lg hover:bg-lime-400 transition-all active:scale-[0.98] disabled:opacity-50 shadow-xl shadow-lime-500/10"
                >
                  {actionLoading ? "Processing..." : "Check In Now"}
                </button>
              )}

              {hasVisitToday && (lastVisit?.status === "COMPLETED" || localLock) && (
                <div className="text-center p-4 bg-zinc-900/30 border border-zinc-800 rounded-2xl text-zinc-500 text-sm">
                  Today's session is already completed.
                </div>
              )}

              {/* Check Out Button */}
              {activeVisit && activeVisit.status === "ACTIVE" && (
                <button
                  onClick={handleCheckOut}
                  disabled={actionLoading}
                  className="w-full py-5 rounded-2xl bg-white text-black font-black text-lg hover:bg-red-500 hover:text-white transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  {actionLoading ? "Processing..." : "Check Out"}
                </button>
              )}
            </div>
          )}
        </div>

        <div className="mt-20 pt-10 border-t border-zinc-900"></div>
      </div>
    </div>
  );
}
