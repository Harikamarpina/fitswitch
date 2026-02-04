import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getOwnerGyms } from "../api/gymApi";

export default function Dashboard() {
  const navigate = useNavigate();
  const [ownerGyms, setOwnerGyms] = useState([]);
  const [loadingOwnerGyms, setLoadingOwnerGyms] = useState(false);

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (role === "OWNER") {
      fetchOwnerGyms();
    }
  }, [role]);

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
            <h1 className="text-4xl md:text-5xl font-black tracking-tight uppercase">Control Hub</h1>
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
              className="px-6 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-white font-bold hover:bg-red-500 hover:border-red-500 transition-all active:scale-95"
            >
              Logout
            </button>
          </div>
        </div>

        {/* System Status Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <StatMiniCard label="Current Role" value={role || "-"} />
          <StatMiniCard label="Account ID" value={`#${userId?.slice(-6) || "---"}`} />
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
                color="text-blue-500"
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div 
                onClick={() => navigate("/user/dashboard")}
                className="group p-10 rounded-[2.5rem] bg-lime-500 text-black cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-lime-500/20"
              >
                <div className="text-5xl mb-8">🏋️</div>
                <h3 className="text-3xl font-black tracking-tighter mb-2">My Memberships</h3>
                <p className="text-black/60 font-medium">Access your plans, check-in, and view your progress.</p>
                <div className="mt-10 flex items-center gap-2 font-bold uppercase tracking-widest text-sm">
                  Go to Dashboard <span className="group-hover:translate-x-2 transition-transform">→</span>
                </div>
              </div>

              <div 
                onClick={() => navigate("/gyms")}
                className="group p-10 rounded-[2.5rem] bg-zinc-900 border border-zinc-800 text-white cursor-pointer transition-all hover:bg-zinc-800 hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="text-5xl mb-8">🔍</div>
                <h3 className="text-3xl font-black tracking-tighter mb-2">Explore Network</h3>
                <p className="text-zinc-500 font-medium">Find and join new partner gyms across the city.</p>
                <div className="mt-10 flex items-center gap-2 font-bold uppercase tracking-widest text-sm text-lime-500">
                  Search Gyms <span className="group-hover:translate-x-2 transition-transform">→</span>
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


