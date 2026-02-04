import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { getUserDashboardStats } from "../api/statsApi";
import { getUserUnsubscribeRequests } from "../api/unsubscribeApi";
import { getDashboardRoute } from "../utils/navigation";
import UserSessionCard from "./UserSessionCard";
import FacilitySessionCard from "./FacilitySessionCard";
import UnsubscribeModal from "../components/UnsubscribeModal";
import CancellationNotificationCard from "../components/CancellationNotificationCard";

export default function UserDashboard() {
  const [memberships, setMemberships] = useState([]);
  const [facilitySubscriptions, setFacilitySubscriptions] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [cancellationRequests, setCancellationRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeSessions, setActiveSessions] = useState({});
  const [selectedMembership, setSelectedMembership] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [dismissedNotifications, setDismissedNotifications] = useState(new Set());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [membershipsRes, facilityRes, statsRes, cancellationRes] = await Promise.all([
          axiosInstance.get("/user/memberships"),
          axiosInstance.get("/user/facility/subscriptions"),
          getUserDashboardStats(),
          getUserUnsubscribeRequests().catch(() => ({ data: [] })) // Handle gracefully if API doesn't exist yet
        ]);
        setMemberships(membershipsRes.data || []);
        setFacilitySubscriptions(facilityRes.data || []);
        setDashboardStats(statsRes.data);
        setCancellationRequests(cancellationRes.data || []);
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

  const handleDismissNotification = (requestId) => {
    setDismissedNotifications(prev => new Set([...prev, requestId]));
  };

  // Filter out pending requests and dismissed notifications
  const visibleNotifications = cancellationRequests.filter(
    request => request.status !== 'PENDING' && !dismissedNotifications.has(request.id)
  );

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
              to="/gyms"
              className="px-5 py-2.5 rounded-xl bg-lime-500 text-black font-bold hover:bg-lime-400 transition-all active:scale-95 shadow-lg shadow-lime-500/10"
            >
              Browse Gyms
            </Link>
          </div>
        </div>

        {successMessage && (
          <div className="mb-8 bg-lime-500/10 border border-lime-500/20 text-lime-500 p-4 rounded-2xl text-sm font-bold flex items-center justify-between">
            <span>{successMessage}</span>
            <button onClick={() => setSuccessMessage("")} className="text-lime-500/50 hover:text-lime-500">✕</button>
          </div>
        )}

        {/* Cancellation Notifications */}
        {visibleNotifications.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-xl font-bold">Cancellation Updates</h2>
              <div className="h-px flex-1 bg-zinc-800"></div>
            </div>
            <div className="space-y-4">
              {visibleNotifications.map((request) => (
                <CancellationNotificationCard
                  key={request.id}
                  request={request}
                  onDismiss={() => handleDismissNotification(request.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Member Portal Cards */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-2xl font-bold">Member Portal</h2>
            <div className="h-px flex-1 bg-zinc-800"></div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <Link
              to="/user/cancellation-requests"
              className="group bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 hover:bg-zinc-900/60 hover:border-zinc-700 transition-all backdrop-blur-sm"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">My Requests</h3>
                  <p className="text-zinc-500 text-sm">Track cancellation status</p>
                </div>
              </div>
              <div className="text-xs text-zinc-600 group-hover:text-zinc-400 transition-colors">
                View your membership cancellation requests and owner responses
              </div>
            </Link>

            <Link
              to="/gyms/map"
              className="group bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 hover:bg-zinc-900/60 hover:border-zinc-700 transition-all backdrop-blur-sm"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors">Find Gyms</h3>
                  <p className="text-zinc-500 text-sm">Discover nearby locations</p>
                </div>
              </div>
              <div className="text-xs text-zinc-600 group-hover:text-zinc-400 transition-colors">
                Use interactive map to find gyms and facilities near you
              </div>
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
              icon="🟢"
              label="Status" 
              value="Per Plan"
              color="text-green-500"
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

        {memberships.filter((m) => m.status === "ACTIVE").length > 0 && (
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-2xl font-bold">Gym Memberships</h2>
              <div className="h-px flex-1 bg-zinc-800"></div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {memberships.filter((m) => m.status === "ACTIVE").map((membership) => (
                <UserSessionCard
                  key={membership.id}
                  membership={membership}
                  dashboardStats={dashboardStats}
                  onSessionUpdate={(sessionData) => handleSessionUpdate(membership.gymId, sessionData)}
                  onUnsubscribe={(m) => setSelectedMembership(m)}
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

        {memberships.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-2xl font-bold">Past Memberships</h2>
              <div className="h-px flex-1 bg-zinc-800"></div>
            </div>
            {memberships.filter((m) => m.status !== "ACTIVE").length === 0 ? (
              <div className="bg-zinc-900/20 border border-zinc-800/50 border-dashed rounded-3xl p-10 text-center">
                <p className="text-zinc-500 font-medium">No past memberships yet.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {memberships.filter((m) => m.status !== "ACTIVE").map((membership) => (
                  <UserSessionCard
                    key={membership.id}
                    membership={membership}
                    dashboardStats={dashboardStats}
                    onSessionUpdate={(sessionData) => handleSessionUpdate(membership.gymId, sessionData)}
                    onUnsubscribe={() => {}}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        <div className="mt-20 pt-10 border-t border-zinc-900"></div>
      </div>

      {selectedMembership && (
        <UnsubscribeModal
          membership={selectedMembership}
          isOpen={!!selectedMembership}
          onClose={() => setSelectedMembership(null)}
          onSuccess={(message) => {
            setSuccessMessage(message);
            setTimeout(() => setSuccessMessage(""), 6000);
          }}
        />
      )}
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
