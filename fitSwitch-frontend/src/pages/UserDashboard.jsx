import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { getUserDashboardStats } from "../api/statsApi";
import { getDashboardRoute } from "../utils/navigation";
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
    <div className="min-h-screen bg-black text-white px-6 py-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">My Dashboard</h1>
            <p className="text-zinc-400 mt-2 text-lg">
              Welcome back! Here's your fitness overview.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/wallet"
              className="px-5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white font-medium hover:bg-zinc-800 transition-all active:scale-95"
            >
              Wallet
            </Link>
            <Link
              to="/digital-card"
              className="px-5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white font-medium hover:bg-zinc-800 transition-all active:scale-95"
            >
              Digital Card
            </Link>
            <Link
              to="/membership/switch"
              className="px-5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 font-medium hover:bg-zinc-800 hover:text-white transition-all active:scale-95"
            >
              Switch
            </Link>
            <Link
              to="/gyms/map"
              className="px-5 py-2.5 rounded-xl bg-purple-500 text-white font-bold hover:bg-purple-400 transition-all active:scale-95 shadow-lg shadow-purple-500/10"
            >
              Find Gyms
            </Link>
            <Link
              to="/gyms"
              className="px-5 py-2.5 rounded-xl bg-lime-500 text-black font-bold hover:bg-lime-400 transition-all active:scale-95 shadow-lg shadow-lime-500/10"
            >
              Browse Gyms
            </Link>
          </div>
        </div>

        {/* Dashboard Stats Cards */}
        {dashboardStats && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
            <StatCard 
              icon="📅" 
              label="Visit Days" 
              value={dashboardStats.totalVisitDays} 
              color="text-lime-500"
            />
            <StatCard 
              icon="🏋️" 
              label="Memberships" 
              value={dashboardStats.activeMemberships?.length || 0} 
              color="text-lime-500"
            />
            <StatCard 
              icon="🏃" 
              label="Facilities" 
              value={dashboardStats.activeFacilitySubscriptions?.length || 0} 
              color="text-purple-500"
            />
            <StatCard 
              icon="💳" 
              label="Wallet" 
              value={`₹${dashboardStats.walletBalance?.toFixed(0) || '0'}`} 
              color="text-green-500"
            />
            <StatCard 
              icon={dashboardStats.currentSessionStatus === "ACTIVE" ? "🟢" : "⚫"} 
              label="Status" 
              value={dashboardStats.currentSessionStatus === "ACTIVE" ? "In Session" : "Inactive"} 
              color={dashboardStats.currentSessionStatus === "ACTIVE" ? "text-green-500" : "text-zinc-500"}
            />
          </div>
        )}

        {/* Last Visit & Expiry Info */}
        {dashboardStats && (
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 backdrop-blur-sm">
              <h3 className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-4 flex items-center">
                <span className="text-xl mr-2">🕒</span>
                Last Visit
              </h3>
              <p className="text-2xl font-bold">
                {dashboardStats.lastVisitDate 
                  ? new Date(dashboardStats.lastVisitDate).toLocaleDateString("en-IN", {
                      day: "2-digit", month: "long", year: "numeric"
                    })
                  : "No visits recorded"
                }
              </p>
            </div>
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 backdrop-blur-sm">
              <h3 className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-4 flex items-center">
                <span className="text-xl mr-2">⏰</span>
                Upcoming Expiries
              </h3>
              {dashboardStats.subscriptionExpiryDates?.length > 0 ? (
                <div className="space-y-3">
                  {dashboardStats.subscriptionExpiryDates.slice(0, 3).map((expiry, index) => (
                    <div key={index} className="flex items-center justify-between bg-black/20 p-2 rounded-lg">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tighter ${
                        expiry.type === "Membership" ? "bg-lime-500/10 text-lime-500" : "bg-purple-500/10 text-purple-500"
                      }`}>
                        {expiry.type}
                      </span>
                      <span className="text-zinc-300 font-medium">
                        {new Date(expiry.expiryDate).toLocaleDateString("en-IN", {
                          day: "2-digit", month: "short"
                        })}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-zinc-500 italic">No active subscriptions found</p>
              )}
            </div>
          </div>
        )}

        {error && (
          <div className="mb-8 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl text-sm">
            {error}
          </div>
        )}

        {!loading && !error && memberships.length === 0 && facilitySubscriptions.length === 0 && (
          <div className="text-center py-20 bg-zinc-900/20 border border-zinc-800/50 border-dashed rounded-3xl">
            <div className="text-6xl mb-6 opacity-20">🏋️</div>
            <h3 className="text-2xl font-bold mb-2">No active subscriptions</h3>
            <p className="text-zinc-500 mb-8 max-w-sm mx-auto">
              Start your fitness journey today by exploring partner gyms and facilities near you.
            </p>
            <Link
              to="/gyms"
              className="inline-block px-8 py-3.5 rounded-2xl bg-lime-500 text-black font-bold hover:bg-lime-400 transition-all active:scale-95"
            >
              Explore Gyms
            </Link>
          </div>
        )}

        {memberships.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-2xl font-bold">Gym Memberships</h2>
              <div className="h-px flex-1 bg-zinc-800"></div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {memberships.map((membership) => (
                <UserSessionCard
                  key={membership.id}
                  membership={membership}
                  dashboardStats={dashboardStats}
                  onSessionUpdate={(sessionData) => handleSessionUpdate(membership.gymId, sessionData)}
                />
              ))}
            </div>
          </div>
        )}

        {facilitySubscriptions.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-2xl font-bold">Facility Access</h2>
              <div className="h-px flex-1 bg-zinc-800"></div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {facilitySubscriptions.map((subscription) => (
                <FacilitySessionCard
                  key={subscription.id}
                  subscription={subscription}
                  dashboardStats={dashboardStats}
                  onSessionUpdate={(sessionData) => handleSessionUpdate(subscription.gymId, sessionData)}
                />
              ))}
            </div>
          </div>
        )}

        <div className="mt-20 pt-10 border-t border-zinc-900 text-center">
          <Link to={getDashboardRoute()} className="text-base font-bold text-zinc-400 hover:text-lime-500 transition-colors inline-flex items-center gap-2 group">
            <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 backdrop-blur-sm group hover:border-zinc-700 transition-colors">
      <div className="text-2xl mb-3">{icon}</div>
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      <div className="text-xs font-medium text-zinc-500 uppercase tracking-tighter mt-1">{label}</div>
    </div>
  );
}