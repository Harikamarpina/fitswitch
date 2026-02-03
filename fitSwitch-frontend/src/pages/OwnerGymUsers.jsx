import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getGymUsers } from "../api/statsApi";
import { getGymPlans } from "../api/planApi";
import { getGymPlanUsers } from "../api/facilityApi";

export default function OwnerGymUsers() {
  const { gymId } = useParams();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchGymUsers();
  }, [gymId]);

  const fetchGymUsers = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Try main endpoint first
      const response = await getGymUsers(gymId);
      const userData = response?.data || [];
      
      if (Array.isArray(userData) && userData.length > 0) {
        setUsers(userData);
        return;
      }
      
      // If empty, try to get users from gym plans
      const plansResponse = await getGymPlans(gymId);
      const plans = plansResponse?.data || [];
      
      let allUsers = [];
      for (const plan of plans) {
        try {
          const planUsersResponse = await getGymPlanUsers(gymId, plan.id);
          const planUsers = planUsersResponse?.data || [];
          allUsers = allUsers.concat(planUsers);
        } catch (err) {
          console.warn(`Failed to fetch users for plan ${plan.id}`);
        }
      }
      
      // Remove duplicates
      const uniqueUsers = allUsers.filter((user, index, self) => 
        index === self.findIndex(u => u.userId === user.userId)
      );
      
      setUsers(uniqueUsers);
    } catch (err) {
      console.error('API Error:', err);
      setError("Failed to load gym users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-zinc-800 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-400 mx-auto mb-4"></div>
          <p className="text-zinc-300">Loading gym users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-zinc-800 text-white px-4 py-10">
      <div className="max-w-6xl mx-auto bg-white/5 border border-white/10 rounded-2xl p-8 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold">Gym Users</h2>
            <p className="text-zinc-300 text-sm mt-1">Members and subscribers of your gym</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-lime-400">{users.length}</div>
            <div className="text-sm text-zinc-300">Total Users</div>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-200 p-4 rounded-lg">
            {error}
          </div>
        )}

        {!loading && users.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">👥</div>
            <h3 className="text-xl font-semibold mb-2">No users found</h3>
            <p className="text-zinc-400">No members have joined this gym yet.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <Link
                key={user.userId}
                to={`/owner/gyms/${gymId}/users/${user.userId}/stats`}
                className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition block"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{user.userName}</h3>
                    <p className="text-zinc-400 text-sm">{user.email}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-lime-400">{user.totalVisits}</div>
                    <div className="text-xs text-zinc-400">visits</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-zinc-400">Membership</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      user.membershipStatus === "ACTIVE" 
                        ? "bg-green-500/20 text-green-400" 
                        : "bg-zinc-500/20 text-zinc-400"
                    }`}>
                      {user.membershipStatus}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-zinc-400">Facility</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      user.facilitySubscriptionStatus === "ACTIVE" 
                        ? "bg-purple-500/20 text-purple-400" 
                        : "bg-zinc-500/20 text-zinc-400"
                    }`}>
                      {user.facilitySubscriptionStatus}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm pt-2 border-t border-white/10">
                    <span className="text-zinc-400">Last Visit</span>
                    <span className="text-zinc-300">{formatDate(user.lastVisitDate)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-8">
          <Link
            to="/dashboard"
            className="text-lime-400 hover:underline text-sm"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}