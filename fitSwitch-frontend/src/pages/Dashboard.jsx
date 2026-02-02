import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllOwnerFacilityPlans } from "../api/facilityApi";

export default function Dashboard() {
  const navigate = useNavigate();
  const [facilityPlans, setFacilityPlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(false);

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (role === "OWNER") {
      fetchFacilityPlans();
    }
  }, [role]);

  const fetchFacilityPlans = async () => {
    try {
      setLoadingPlans(true);
      const response = await getAllOwnerFacilityPlans();
      setFacilityPlans(response.data || []);
    } catch (error) {
      console.error("Failed to fetch facility plans:", error);
    } finally {
      setLoadingPlans(false);
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-zinc-800 text-white px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 shadow-xl">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-zinc-300 mt-1">
            Welcome to <span className="text-lime-400 font-semibold">FitSwitch</span> 💪
          </p>

          <div className="mt-6 grid md:grid-cols-3 gap-4">
            <Card title="Role" value={role || "-"} />
            <Card title="User ID" value={userId || "-"} />
            <Card title="Status" value={token ? "Logged In ✅" : "Logged Out ❌"} />
          </div>

          {/* User-specific navigation */}
          {role === "USER" && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">My Fitness</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <button
                  onClick={() => navigate("/user/dashboard")}
                  className="bg-lime-400 hover:bg-lime-300 text-black font-semibold px-6 py-4 rounded-xl transition text-left"
                >
                  <div className="text-lg font-bold">My Memberships</div>
                  <div className="text-sm opacity-80">View your gym memberships</div>
                </button>
                <button
                  onClick={() => navigate("/gyms")}
                  className="bg-white/10 hover:bg-white/15 border border-white/10 px-6 py-4 rounded-xl transition text-left"
                >
                  <div className="text-lg font-bold">Join New Gym</div>
                  <div className="text-sm text-zinc-300">Find and join gyms</div>
                </button>
              </div>
            </div>
          )}

          {/* Owner-specific navigation */}
          {role === "OWNER" && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Gym Management</h2>
              <div className="grid md:grid-cols-3 gap-4">
                <button
                  onClick={() => navigate("/owner/gyms")}
                  className="bg-lime-400 hover:bg-lime-300 text-black font-semibold px-6 py-4 rounded-xl transition text-left"
                >
                  <div className="text-lg font-bold">My Gyms</div>
                  <div className="text-sm opacity-80">View and manage your gyms</div>
                </button>
                <button
                  onClick={() => navigate("/owner/gyms/add")}
                  className="bg-white/10 hover:bg-white/15 border border-white/10 px-6 py-4 rounded-xl transition text-left"
                >
                  <div className="text-lg font-bold">Add New Gym</div>
                  <div className="text-sm text-zinc-300">Create a new gym listing</div>
                </button>
                <button
                  onClick={() => navigate("/owner/gyms")}
                  className="bg-blue-500 hover:bg-blue-400 text-white font-semibold px-6 py-4 rounded-xl transition text-left"
                >
                  <div className="text-lg font-bold">Gym Users</div>
                  <div className="text-sm opacity-80">View members and activity</div>
                </button>
              </div>
            </div>
          )}

          {/* Facility Plans Section for Owners */}
          {role === "OWNER" && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Facility Plans</h2>
              {loadingPlans ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lime-400 mx-auto"></div>
                  <p className="text-zinc-300 mt-2">Loading facility plans...</p>
                </div>
              ) : facilityPlans.length === 0 ? (
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
                  <div className="text-4xl mb-2">🏃♀️</div>
                  <p className="text-zinc-300">No facility plans created yet</p>
                  <p className="text-zinc-400 text-sm mt-1">Add facilities to your gyms and create plans</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {facilityPlans.map((plan) => (
                    <div
                      key={plan.id}
                      className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lime-400">{plan.planName}</h3>
                          <p className="text-sm text-zinc-300">
                            {plan.facilityName} at {plan.gymName}
                          </p>
                          {plan.description && (
                            <p className="text-xs text-zinc-400 mt-1">{plan.description}</p>
                          )}
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="text-right">
                            <div className="text-lg font-bold text-lime-400">₹{plan.price}</div>
                            <div className="text-xs text-zinc-400">{plan.durationDays} days</div>
                            <span className={`inline-block px-2 py-1 rounded text-xs mt-1 ${
                              plan.active ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                            }`}>
                              {plan.active ? "ACTIVE" : "INACTIVE"}
                            </span>
                          </div>
                          <button
                            onClick={() => navigate(`/owner/facilities/${plan.facilityId}/plans/${plan.id}/users`)}
                            className="px-3 py-1 text-xs rounded-xl bg-purple-500 hover:bg-purple-400 text-white"
                          >
                            View Users
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* General navigation */}
          {role !== "OWNER" && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Explore</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <button
                  onClick={() => navigate("/gyms")}
                  className="bg-white/10 hover:bg-white/15 border border-white/10 px-6 py-4 rounded-xl transition text-left"
                >
                  <div className="text-lg font-bold">Browse Gyms</div>
                  <div className="text-sm text-zinc-300">Find gyms near you</div>
                </button>
                <div className="bg-black/30 border border-white/10 rounded-xl p-4">
                  <div className="text-lg font-semibold">Fitness Card</div>
                  <div className="text-sm text-zinc-300">Coming Soon</div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-400 text-black font-semibold px-6 py-3 rounded-xl transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
      <p className="text-sm text-zinc-300">{title}</p>
      <p className="text-xl font-semibold mt-1">{value}</p>
    </div>
  );
}
