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
      <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-zinc-800 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-400 mx-auto mb-4"></div>
          <p className="text-zinc-300">Loading user statistics...</p>
        </div>
      </div>
    );
  }

  if (error || !userStats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-zinc-800 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400">{error || "User not found"}</p>
          <Link to={`/owner/gyms/${gymId}/users`} className="text-lime-400 hover:underline mt-4 inline-block">
            ← Back to Users
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-zinc-800 text-white px-4 py-10">
      <div className="max-w-4xl mx-auto bg-white/5 border border-white/10 rounded-2xl p-8 shadow-xl">
        {/* User Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold">{userStats.userName}</h2>
            <p className="text-zinc-300 mt-1">{userStats.email}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-lime-400">{userStats.totalVisitCount}</div>
            <div className="text-sm text-zinc-300">Total Visits</div>
          </div>
        </div>

        {/* Visit Activity */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <span className="text-2xl mr-2">🔑</span>
              Last Check-in
            </h3>
            <p className="text-zinc-300">{formatDateTime(userStats.lastCheckIn)}</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <span className="text-2xl mr-2">🚪</span>
              Last Check-out
            </h3>
            <p className="text-zinc-300">{formatDateTime(userStats.lastCheckOut)}</p>
          </div>
        </div>

        {/* Memberships */}
        {userStats.memberships && userStats.memberships.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <span className="text-2xl mr-2">🏋️</span>
              Gym Memberships
            </h3>
            <div className="space-y-4">
              {userStats.memberships.map((membership, index) => (
                <div key={index} className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-lime-400">{membership.planName}</h4>
                      <div className="text-sm text-zinc-300 mt-2 space-y-1">
                        <div>Purchase Date: {formatDate(membership.purchaseDate)}</div>
                        <div>Expiry Date: {formatDate(membership.expiryDate)}</div>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded text-xs font-semibold ${
                      membership.status === "ACTIVE" 
                        ? "bg-green-500/20 text-green-400" 
                        : "bg-red-500/20 text-red-400"
                    }`}>
                      {membership.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Facility Subscriptions */}
        {userStats.facilitySubscriptions && userStats.facilitySubscriptions.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <span className="text-2xl mr-2">🏃</span>
              Facility Subscriptions
            </h3>
            <div className="space-y-4">
              {userStats.facilitySubscriptions.map((subscription, index) => (
                <div key={index} className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-purple-400">{subscription.facilityName}</h4>
                      <p className="text-sm text-zinc-400">{subscription.planName}</p>
                      <div className="text-sm text-zinc-300 mt-2 space-y-1">
                        <div>Purchase Date: {formatDate(subscription.purchaseDate)}</div>
                        <div>Expiry Date: {formatDate(subscription.expiryDate)}</div>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded text-xs font-semibold ${
                      subscription.status === "ACTIVE" 
                        ? "bg-green-500/20 text-green-400" 
                        : "bg-red-500/20 text-red-400"
                    }`}>
                      {subscription.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {(!userStats.memberships || userStats.memberships.length === 0) && 
         (!userStats.facilitySubscriptions || userStats.facilitySubscriptions.length === 0) && (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">📋</div>
            <p className="text-zinc-400">No active subscriptions found for this user.</p>
          </div>
        )}

        <div className="mt-8">
          <Link
            to={`/owner/gyms/${gymId}/users`}
            className="text-lime-400 hover:underline text-sm"
          >
            ← Back to Gym Users
          </Link>
        </div>
      </div>
    </div>
  );
}