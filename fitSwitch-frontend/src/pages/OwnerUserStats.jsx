import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getUserStats } from "../api/statsApi";

export default function OwnerUserStats() {
  const { gymId, userId } = useParams();
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUserStats();
  }, [gymId, userId]);

  const fetchUserStats = async () => {
    try {
      setLoading(true);
      const response = await getUserStats(gymId, userId);
      setUserStats(response.data);
    } catch (err) {
      setError("Failed to load user statistics");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not available";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return "Not available";
    return new Date(dateTimeString).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-lime-500/30 border-t-lime-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-zinc-500 font-medium">Fetching member profile...</p>
        </div>
      </div>
    );
  }

  if (error || !userStats) {
    return (
      <div className="min-h-screen bg-black text-white px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <Link
            to={`/owner/gyms/${gymId}/users`}
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-white transition-colors mb-6"
          >
            <span>←</span> Back to Members
          </Link>
          <div className="text-center p-8 bg-zinc-900/50 border border-zinc-800 rounded-3xl">
            <p className="text-red-400 mb-6 font-medium">{error || "Member not found"}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 py-12">
      <div className="max-w-5xl mx-auto">
        <button 
          onClick={() => window.history.back()} 
          className="group flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-8"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          <span className="text-sm font-medium">Back to Members</span>
        </button>

        {/* User Profile Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-lime-500/10 rounded-3xl flex items-center justify-center text-lime-400 font-black text-4xl border border-lime-500/20">
              {userStats.userName?.charAt(0)}
            </div>
            <div>
              <h2 className="text-5xl font-black tracking-tighter mb-2">{userStats.userName}</h2>
              <p className="text-zinc-500 font-medium text-lg">{userStats.email}</p>
            </div>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 px-8 py-4 rounded-3xl text-center">
            <div className="text-4xl font-black text-lime-400 leading-none">{userStats.totalVisitCount}</div>
            <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-500 mt-2">Life-time Visits</div>
          </div>
        </div>

        {/* Quick Activity Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-8 group hover:bg-zinc-900/60 transition-colors">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 text-xl">
                🔑
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest text-zinc-400">Recent Check-in</h3>
            </div>
            <p className="text-2xl font-bold text-white leading-tight">
              {formatDateTime(userStats.lastCheckIn)}
            </p>
          </div>

          <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-8 group hover:bg-zinc-900/60 transition-colors">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-400 text-xl">
                🚪
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest text-zinc-400">Recent Check-out</h3>
            </div>
            <p className="text-2xl font-bold text-white leading-tight">
              {formatDateTime(userStats.lastCheckOut)}
            </p>
          </div>
        </div>

        {/* Session History */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-8">
          
            <h3 className="text-2xl font-black tracking-tight uppercase">Session History</h3>
          </div>

          {userStats.sessionHistory && userStats.sessionHistory.length > 0 ? (
            <div className="space-y-4 max-h-[520px] overflow-y-auto pr-2">
              {userStats.sessionHistory.map((session) => (
                <div key={`${session.planType}-${session.id}`} className="bg-zinc-900/30 border border-zinc-800/50 rounded-3xl p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <div className="text-sm font-bold text-white">
                        {session.planType === "FACILITY" ? "Facility Session" : "Gym Session"}
                      </div>
                      <div className="text-xs text-zinc-500">{session.gymName}</div>
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${
                      session.planType === "FACILITY"
                        ? "bg-purple-500/10 text-purple-400"
                        : "bg-lime-500/10 text-lime-400"
                    }`}>
                      {session.planType}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="bg-black/30 rounded-xl p-3">
                      <div className="text-[10px] uppercase font-bold text-zinc-500">Visit Date</div>
                      <div className="text-zinc-200 font-semibold">{formatDate(session.visitDate)}</div>
                    </div>
                    <div className="bg-black/30 rounded-xl p-3">
                      <div className="text-[10px] uppercase font-bold text-zinc-500">Check-in</div>
                      <div className="text-zinc-200 font-semibold">{formatDateTime(session.checkInTime)}</div>
                    </div>
                    <div className="bg-black/30 rounded-xl p-3">
                      <div className="text-[10px] uppercase font-bold text-zinc-500">Check-out</div>
                      <div className="text-zinc-200 font-semibold">{formatDateTime(session.checkOutTime)}</div>
                    </div>
                  </div>

                  <div className="mt-3 text-[10px] uppercase font-bold text-zinc-500">
                    Status: <span className="text-zinc-300">{session.status}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-zinc-900/20 border border-zinc-800 border-dashed rounded-3xl p-10 text-center">
              <p className="text-zinc-500 font-medium">No sessions found....
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Gym Memberships */}
          <section>
            <div className="flex items-center gap-3 mb-8">
              <span className="text-2xl">🏋️</span>
              <h3 className="text-2xl font-black tracking-tight uppercase">Gym Memberships</h3>
            </div>
            {userStats.memberships && userStats.memberships.length > 0 ? (
              <div className="space-y-4">
                {userStats.memberships.map((membership, index) => (
                  <div key={index} className="bg-zinc-900/30 border border-zinc-800/50 rounded-3xl p-6 relative overflow-hidden group">
                    <div className={`absolute top-0 right-0 px-4 py-1 text-[10px] font-black uppercase tracking-widest rounded-bl-xl ${
                      membership.status === "ACTIVE" ? "bg-lime-500 text-black" : "bg-zinc-800 text-zinc-500"
                    }`}>
                      {membership.status}
                    </div>
                    <h4 className="text-xl font-bold text-white mb-4 group-hover:text-lime-400 transition-colors">
                      {membership.planName}
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Purchased</div>
                        <div className="text-sm font-bold text-zinc-300">{formatDate(membership.purchaseDate)}</div>
                      </div>
                      <div>
                        <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Expires</div>
                        <div className="text-sm font-bold text-zinc-300">{formatDate(membership.expiryDate)}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-zinc-900/20 border border-zinc-800 border-dashed rounded-3xl p-10 text-center">
                <p className="text-zinc-500 font-medium">No gym memberships found</p>
              </div>
            )}
          </section>

          {/* Facility Subscriptions */}
          <section>
            <div className="flex items-center gap-3 mb-8">
              <span className="text-2xl">🏃</span>
              <h3 className="text-2xl font-black tracking-tight uppercase">Facility Passes</h3>
            </div>
            {userStats.facilitySubscriptions && userStats.facilitySubscriptions.length > 0 ? (
              <div className="space-y-4">
                {userStats.facilitySubscriptions.map((subscription, index) => (
                  <div key={index} className="bg-zinc-900/30 border border-zinc-800/50 rounded-3xl p-6 relative overflow-hidden group">
                    <div className={`absolute top-0 right-0 px-4 py-1 text-[10px] font-black uppercase tracking-widest rounded-bl-xl ${
                      subscription.status === "ACTIVE" ? "bg-blue-500 text-white" : "bg-zinc-800 text-zinc-500"
                    }`}>
                      {subscription.status}
                    </div>
                    <div className="mb-4">
                      <h4 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                        {subscription.facilityName}
                      </h4>
                      <p className="text-xs font-bold text-zinc-500 uppercase tracking-tighter">{subscription.planName}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Purchased</div>
                        <div className="text-sm font-bold text-zinc-300">{formatDate(subscription.purchaseDate)}</div>
                      </div>
                      <div>
                        <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Expires</div>
                        <div className="text-sm font-bold text-zinc-300">{formatDate(subscription.expiryDate)}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-zinc-900/20 border border-zinc-800 border-dashed rounded-3xl p-10 text-center">
                <p className="text-zinc-500 font-medium">No facility passes found</p>
              </div>
            )}
          </section>
        </div>

      </div>
    </div>
  );
}
