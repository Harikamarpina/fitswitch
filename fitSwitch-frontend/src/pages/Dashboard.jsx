import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getOwnerGyms } from "../api/gymApi";
import { getUserProfile } from "../api/authApi";
import { getWalletBalance } from "../api/walletApi";
import { getActiveMembershipSessions, getActiveFacilitySessions } from "../api/sessionApi";
import { getOwnerUnsubscribeRequests } from "../api/unsubscribeApi";

export default function Dashboard() {
  const navigate = useNavigate();
  const [ownerGyms, setOwnerGyms] = useState([]);
  const [loadingOwnerGyms, setLoadingOwnerGyms] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [walletBalance, setWalletBalance] = useState(null);
  const [showWalletAlert, setShowWalletAlert] = useState(false);
  const [membershipEntries, setMembershipEntries] = useState([]);
  const [facilityEntries, setFacilityEntries] = useState([]);
  const [unsubscribeRequests, setUnsubscribeRequests] = useState([]);
  const [dismissedRequests, setDismissedRequests] = useState(() => {
    const saved = localStorage.getItem('dismissedOwnerRequests');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (role === "OWNER") {
      fetchOwnerGyms();
      fetchWalletBalance();
      fetchUnsubscribeRequests();
    }
    if (role === "USER") {
      fetchActiveEntries();
    }
    fetchUserProfile();
  }, [role]);

  const fetchWalletBalance = async () => {
    try {
      const response = await getWalletBalance();
      setWalletBalance(response.balance);
      // Only show alert if balance is actually negative
      if (response.balance < 0) {
        setShowWalletAlert(true);
      } else {
        setShowWalletAlert(false);
      }
    } catch (error) {
      console.error("Failed to fetch wallet balance:", error);
      setWalletBalance(0); // Default to 0 if fetch fails
      setShowWalletAlert(false);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const response = await getUserProfile();
      console.log('User profile response:', response.data);
      setUserProfile(response.data.data);
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      console.error("Error details:", error.response?.data);
    }
  };

  const fetchOwnerGyms = async () => {
    try {
      setLoadingOwnerGyms(true);
      const response = await getOwnerGyms();
      setOwnerGyms(response.data || []);
    } catch (error) {
      console.error("Failed to fetch owner gyms:", error);
    } finally {
      setLoadingOwnerGyms(false);
    }
  };

  const fetchActiveEntries = async () => {
    try {
      const [membershipRes, facilityRes] = await Promise.all([
        getActiveMembershipSessions(),
        getActiveFacilitySessions()
      ]);
      setMembershipEntries(membershipRes.data || []);
      setFacilityEntries(facilityRes.data || []);
    } catch (error) {
      console.error("Failed to fetch active entries:", error);
      setMembershipEntries([]);
      setFacilityEntries([]);
    }
  };

  const fetchUnsubscribeRequests = async () => {
    try {
      const response = await getOwnerUnsubscribeRequests();
      setUnsubscribeRequests(response.data || response || []);
    } catch (error) {
      console.error("Failed to fetch unsubscribe requests:", error);
    }
  };

  const handleDismissRequest = (requestId) => {
    setDismissedRequests(prev => {
      const updated = new Set([...prev, requestId]);
      localStorage.setItem('dismissedOwnerRequests', JSON.stringify([...updated]));
      return updated;
    });
  };

  const pendingRequests = unsubscribeRequests.filter(
    request => request.status === 'PENDING' && !dismissedRequests.has(request.id)
  );

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-lime-500/5 blur-[180px] rounded-full -translate-y-1/2 translate-x-1/2" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight uppercase">Control Hub</h1>
            <p className="text-zinc-500 mt-2 text-lg">
              Manage your <span className="text-lime-500 font-bold">FitSwitch</span> {role === "OWNER" ? "Enterprise" : "Account"}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-zinc-600 uppercase tracking-widest">Signed in as</p>
              <p className="font-bold text-zinc-300">{role}</p>
            </div>
            <button
              onClick={logout}
              className="px-6 py-3 rounded-2xl bg-red-500 border border-red-500 text-white font-bold hover:bg-red-600 hover:border-red-600 transition-all active:scale-95"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Pending Unsubscribe Requests for Owners */}
        {role === "OWNER" && pendingRequests.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-xl font-bold">Pending Cancellation Requests</h2>
              <div className="h-px flex-1 bg-zinc-800"></div>
            </div>
            <div className="space-y-4">
              {pendingRequests.map((request) => (
                <div key={request.id} className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 hover:bg-zinc-900/60 transition-all backdrop-blur-sm">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl text-amber-400 bg-amber-400/10 border-amber-400/20">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">New Cancellation Request</h3>
                        <p className="text-sm text-zinc-400">{request.userName} wants to cancel their membership</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full border text-amber-400 bg-amber-400/10 border-amber-400/20">
                        PENDING
                      </span>
                      <button
                        onClick={() => handleDismissRequest(request.id)}
                        className="p-1 text-zinc-500 hover:text-zinc-300 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-zinc-500">Gym</span>
                      <span className="text-zinc-300 font-medium">{request.gymName}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-zinc-500">Plan</span>
                      <span className="text-zinc-300 font-medium">{request.planName}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-zinc-500">Requested</span>
                      <span className="text-zinc-300 font-medium">
                        {new Date(request.requestDate).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric"
                        })}
                      </span>
                    </div>
                    {request.refundAmount && (
                      <div className="flex justify-between items-center text-sm pt-2 border-t border-zinc-800/50">
                        <span className="text-zinc-500">Refund Amount (70%)</span>
                        <span className="text-amber-400 font-bold">₹{request.refundAmount.toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => navigate("/owner/unsubscribe-requests")}
                    className="w-full py-3 rounded-xl bg-lime-500 text-black font-bold hover:bg-lime-400 transition-colors"
                  >
                    Review Request
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Wallet Balance Alert for Owners */}
        {role === "OWNER" && showWalletAlert && walletBalance !== null && walletBalance < 0 && (
          <div className="mb-8 p-6 bg-red-500/10 border border-red-500/20 rounded-2xl">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-red-400 mb-1">Wallet Balance Alert</h3>
                  <p className="text-red-300 text-sm mb-3">
                    Your wallet balance is <span className="font-bold">₹{walletBalance.toFixed(2)}</span>. 
                    This negative balance is due to approved refunds. Please add funds to complete pending transactions.
                  </p>
                  <button
                    onClick={() => navigate("/wallet")}
                    className="px-4 py-2 bg-red-500 text-white text-sm font-bold rounded-xl hover:bg-red-400 transition-colors"
                  >
                    Add Funds Now
                  </button>
                </div>
              </div>
              <button
                onClick={() => setShowWalletAlert(false)}
                className="text-red-400 hover:text-red-300 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* System Status Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <StatMiniCard label="Current Role" value={role || "-"} />
          <StatMiniCard label="Account Holder" value={userProfile?.fullName || "User Profile"} />
          <StatMiniCard label="System Access" value={token ? "Verified" : "Unverified"} status={!!token} />
        </div>

        {/* Owner Management Interface */}
        {role === "OWNER" && (
          <div className="space-y-12">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold">Gym Management</h2>
              <div className="h-px flex-1 bg-zinc-800"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <ActionCard
                title="My Gyms"
                description="Monitor and manage your active fitness centers"
                icon="🏢"
                onClick={() => navigate("/owner/gyms")}
                primary
              />
              <ActionCard
                title="Add New Gym"
                description="Register a new location to the FitSwitch network"
                icon="➕"
                onClick={() => navigate("/owner/gyms/add")}
              />
              <ActionCard
                title="Revenue Control"
                description="Detailed analytics of your earnings and payouts"
                icon="💰"
                onClick={() => navigate("/owner/earnings")}
                color="text-green-500"
              />
              <ActionCard
                title="Member Requests"
                description="Manage unsubscriptions and user feedback"
                icon="📥"
                onClick={() => navigate("/owner/unsubscribe-requests")}
                color="text-orange-500"
              />
              <ActionCard
                title="Gym Users"
                description="View and manage members across your gyms"
                icon="👥"
                onClick={() => {
                  const targetGymId = ownerGyms[0]?.id;
                  if (targetGymId) navigate(`/owner/gyms/${targetGymId}/users`);
                }}
                disabled={loadingOwnerGyms || ownerGyms.length === 0}
                color="text-purple-500"
              />
              <ActionCard
                title="Wallet Management"
                description="Add funds and manage your wallet balance"
                icon="💳"
                onClick={() => navigate("/wallet")}
                color={walletBalance < 0 ? "text-red-500" : "text-blue-500"}
              />
            </div>
          </div>
        )}

        {/* User Hub Interface */}
        {role === "USER" && (
          <div className="space-y-12">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold">Member Portal</h2>
              <div className="h-px flex-1 bg-zinc-800"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div 
                onClick={() => navigate("/user/dashboard")}
                className="group p-6 rounded-2xl bg-lime-500 text-black cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-lime-500/20"
              >
                <div className="text-3xl mb-4">🏋️</div>
                <h3 className="text-xl font-black tracking-tighter mb-2">My Memberships</h3>
                <p className="text-black/60 font-medium text-sm">Access your plans, check-in, and view your progress.</p>
                <div className="mt-6 flex items-center gap-2 font-bold uppercase tracking-widest text-xs">
                  Go to Dashboard <span className="group-hover:translate-x-2 transition-transform">→</span>
                </div>
              </div>

              <div 
                onClick={() => navigate("/gyms")}
                className="group p-6 rounded-2xl bg-zinc-900 border border-zinc-800 text-white cursor-pointer transition-all hover:bg-zinc-800 hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="text-3xl mb-4">🔍</div>
                <h3 className="text-xl font-black tracking-tighter mb-2">Explore Network</h3>
                <p className="text-zinc-500 font-medium text-sm">Find and join new partner gyms across the city.</p>
                <div className="mt-6 flex items-center gap-2 font-bold uppercase tracking-widest text-xs text-lime-500">
                  Search Gyms <span className="group-hover:translate-x-2 transition-transform">→</span>
                </div>
              </div>

              <div 
                onClick={() => navigate("/user/cancellation-requests")}
                className="group p-6 rounded-2xl bg-zinc-900 border border-zinc-800 text-white cursor-pointer transition-all hover:bg-zinc-800 hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="text-3xl mb-4">📋</div>
                <h3 className="text-xl font-black tracking-tighter mb-2">My Requests</h3>
                <p className="text-zinc-500 font-medium text-sm">Track cancellation status and owner responses.</p>
                <div className="mt-6 flex items-center gap-2 font-bold uppercase tracking-widest text-xs text-amber-500">
                  View Requests <span className="group-hover:translate-x-2 transition-transform">→</span>
                </div>
              </div>

              <div 
                onClick={() => navigate("/gyms/map")}
                className="group p-6 rounded-2xl bg-zinc-900 border border-zinc-800 text-white cursor-pointer transition-all hover:bg-zinc-800 hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="text-3xl mb-4">📍</div>
                <h3 className="text-xl font-black tracking-tighter mb-2">Find Gyms</h3>
                <p className="text-zinc-500 font-medium text-sm">Use interactive map to discover nearby locations.</p>
                <div className="mt-6 flex items-center gap-2 font-bold uppercase tracking-widest text-xs text-purple-500">
                  Open Map <span className="group-hover:translate-x-2 transition-transform">→</span>
                </div>
              </div>

              <div 
                onClick={() => navigate("/user/sessions")}
                className="group p-6 rounded-2xl bg-zinc-900 border border-zinc-800 text-white cursor-pointer transition-all hover:bg-zinc-800 hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="text-3xl mb-4">📘</div>
                <h3 className="text-xl font-black tracking-tighter mb-2">Entries</h3>
                <p className="text-zinc-500 font-medium text-sm">View complete membership and facility session history.</p>
                <div className="mt-6 flex items-center gap-2 font-bold uppercase tracking-widest text-xs text-lime-500">
                  View History <span className="group-hover:translate-x-2 transition-transform">→</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Guest/Undefined Hub */}
        {role !== "OWNER" && role !== "USER" && (
          <div className="text-center py-20 bg-zinc-900/20 border border-zinc-800 border-dashed rounded-[3rem]">
             <h2 className="text-2xl font-bold text-zinc-500">Access Denied</h2>
             <p className="text-zinc-600 mt-2">Please login again to refresh your permissions.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function StatMiniCard({ label, value, status }) {
  return (
    <div className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-3xl backdrop-blur-sm">
      <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-2">{label}</p>
      <div className="flex items-center gap-2">
        <p className="text-xl font-bold text-zinc-200">{value}</p>
        {status !== undefined && (
          <div className={`w-2 h-2 rounded-full ${status ? 'bg-green-500' : 'bg-red-500'}`} />
        )}
      </div>
    </div>
  );
}

function ActionCard({ title, description, icon, onClick, primary, color, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`group p-8 rounded-[2rem] text-left transition-all active:scale-[0.98] flex flex-col h-full border ${
        disabled 
          ? "opacity-40 cursor-not-allowed bg-zinc-900/20 border-zinc-900" 
          : primary
            ? "bg-lime-500 border-lime-500 text-black shadow-xl shadow-lime-500/10"
            : "bg-zinc-900/40 border-zinc-800 text-white hover:bg-zinc-800/80 hover:border-zinc-700 shadow-xl shadow-black/40"
      }`}
    >
      <div className={`text-4xl mb-6 transition-transform group-hover:scale-110 group-hover:-rotate-6 ${disabled ? 'grayscale' : ''}`}>
        {icon}
      </div>
      <h3 className={`text-xl font-black tracking-tight mb-2 ${primary ? 'text-black' : color || 'text-white'}`}>
        {title}
      </h3>
      <p className={`text-sm font-medium leading-relaxed flex-1 ${primary ? 'text-black/60' : 'text-zinc-500'}`}>
        {description}
      </p>
    </button>
  );
}


