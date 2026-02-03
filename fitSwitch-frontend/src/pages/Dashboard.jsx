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
                  onClick={() => {
                    const targetGymId = ownerGyms[0]?.id;
                    if (targetGymId) {
                      navigate(`/owner/gyms/${targetGymId}/users`);
                    }
                  }}
                  className="bg-blue-500 hover:bg-blue-400 text-white font-semibold px-6 py-4 rounded-xl transition text-left disabled:opacity-60 disabled:cursor-not-allowed"
                  disabled={loadingOwnerGyms || ownerGyms.length === 0}
                >
                  <div className="text-lg font-bold">Gym Users</div>
                  <div className="text-sm opacity-80">View members and activity</div>
                </button>
              </div>
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


