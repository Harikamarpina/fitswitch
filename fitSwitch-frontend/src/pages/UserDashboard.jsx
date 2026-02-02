import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { getUserDashboardStats } from "../api/statsApi";
import UserSessionCard from "./UserSessionCard";
import FacilitySessionCard from "./FacilitySessionCard";

export default function UserDashboard() {
  const [memberships, setMemberships] = useState([]);
  const [facilitySubscriptions, setFacilitySubscriptions] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeSessions, setActiveSessions] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [membershipsRes, facilityRes, statsRes] = await Promise.all([
          axiosInstance.get("/user/memberships"),
          axiosInstance.get("/user/facility/subscriptions"),
          getUserDashboardStats()
        ]);
        setMemberships(membershipsRes.data || []);
        setFacilitySubscriptions(facilityRes.data || []);
        setDashboardStats(statsRes.data);
      } catch (err) {
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSessionUpdate = (gymId, sessionData) => {
    setActiveSessions(prev => ({
      ...prev,
      [gymId]: sessionData
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-400 mx-auto mb-4"></div>
          <p className="text-zinc-300">Loading your memberships...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-5 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Dashboard</h1>
            <p className="text-zinc-300 mt-2">
              Manage your gym memberships and track your fitness journey
            </p>
          </div>

          <Link
            to="/gyms"
            className="px-4 py-2 rounded-xl bg-lime-400 text-black font-semibold hover:bg-lime-300 transition"
          >
            Browse Gyms
          </Link>
        </div>

        {/* Dashboard Stats Cards */}
        {dashboardStats && (
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="text-2xl mb-2">📅</div>
              <div className="text-2xl font-bold text-lime-400">{dashboardStats.totalVisitDays}</div>
              <div className="text-sm text-zinc-300">Total Visit Days</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="text-2xl mb-2">🏋️</div>
              <div className="text-lg font-bold text-lime-400">{dashboardStats.activeMemberships?.length || 0}</div>
              <div className="text-sm text-zinc-300">Active Memberships</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="text-2xl mb-2">🏃</div>
              <div className="text-lg font-bold text-purple-400">{dashboardStats.activeFacilitySubscriptions?.length || 0}</div>
              <div className="text-sm text-zinc-300">Facility Subscriptions</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="text-2xl mb-2">{dashboardStats.currentSessionStatus === "ACTIVE" ? "🟢" : "⚫"}</div>
              <div className="text-lg font-bold">
                <span className={dashboardStats.currentSessionStatus === "ACTIVE" ? "text-green-400" : "text-zinc-400"}>
                  {dashboardStats.currentSessionStatus === "ACTIVE" ? "In Session" : "Not Active"}
                </span>
              </div>
              <div className="text-sm text-zinc-300">Current Status</div>
            </div>
          </div>
        )}

        {/* Last Visit & Expiry Info */}
        {dashboardStats && (
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <span className="text-2xl mr-2">🕒</span>
                Last Visit
              </h3>
              <p className="text-zinc-300">
                {dashboardStats.lastVisitDate 
                  ? new Date(dashboardStats.lastVisitDate).toLocaleDateString("en-IN", {
                      day: "2-digit", month: "short", year: "numeric"
                    })
                  : "No visits yet"
                }
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <span className="text-2xl mr-2">⏰</span>
                Upcoming Expiries
              </h3>
              {dashboardStats.subscriptionExpiryDates?.length > 0 ? (
                <div className="space-y-2">
                  {dashboardStats.subscriptionExpiryDates.slice(0, 3).map((expiry, index) => (
                    <div key={index} className="text-sm">
                      <span className={`px-2 py-1 rounded text-xs mr-2 ${
                        expiry.type === "Membership" ? "bg-lime-500/20 text-lime-400" : "bg-purple-500/20 text-purple-400"
                      }`}>
                        {expiry.type}
                      </span>
                      <span className="text-zinc-300">
                        {new Date(expiry.expiryDate).toLocaleDateString("en-IN", {
                          day: "2-digit", month: "short"
                        })}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-zinc-400 text-sm">No active subscriptions</p>
              )}
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-200 p-4 rounded-lg">
            {error}
          </div>
        )}

        {!loading && !error && memberships.length === 0 && facilitySubscriptions.length === 0 && (
          <div className="text-center py-16">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-12 max-w-md mx-auto">
              <div className="text-6xl mb-4">🏋️</div>
              <h3 className="text-xl font-semibold mb-2">No subscriptions found</h3>
              <p className="text-zinc-400 mb-6">
                You haven't joined any gym or facility yet. Start your fitness journey today!
              </p>
              <Link
                to="/gyms"
                className="inline-block px-6 py-3 rounded-xl bg-lime-400 text-black font-semibold hover:bg-lime-300 transition"
              >
                Find Gyms Near You
              </Link>
            </div>
          </div>
        )}

        {memberships.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Gym Memberships & Sessions</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {memberships.map((membership) => (
                <UserSessionCard
                  key={membership.id}
                  membership={membership}
                  onSessionUpdate={(sessionData) => handleSessionUpdate(membership.gymId, sessionData)}
                />
              ))}
            </div>
          </div>
        )}

        {facilitySubscriptions.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Facility Subscriptions & Sessions</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {facilitySubscriptions.map((subscription) => (
                <FacilitySessionCard
                  key={subscription.id}
                  subscription={subscription}
                  onSessionUpdate={(sessionData) => handleSessionUpdate(subscription.gymId, sessionData)}
                />
              ))}
            </div>
          </div>
        )}

        <div className="mt-12 text-center">
          <Link to="/" className="underline text-zinc-200 hover:text-white">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}