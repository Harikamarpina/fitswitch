import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getGymUsers } from "../api/statsApi";
import { getGymPlans } from "../api/planApi";
import { getGymPlanUsers, getGymFacilitiesOwner, getFacilityPlanUsers } from "../api/facilityApi";
import { getGymFacilityPlans } from "../api/facilityApi";

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
      
      let allUsers = [];
      
      // Get users from gym membership plans
      try {
        const plansResponse = await getGymPlans(gymId);
        const plans = plansResponse?.data || [];
        
        for (const plan of plans) {
          try {
            const planUsersResponse = await getGymPlanUsers(gymId, plan.id);
            const planUsers = planUsersResponse?.data || [];
            allUsers = allUsers.concat(planUsers);
          } catch (err) {
            console.warn(`Failed to fetch users for gym plan ${plan.id}`);
          }
        }
      } catch (err) {
        console.warn('Failed to fetch gym plans');
      }
      
      // Get users from facility plans
      try {
        const facilityPlansResponse = await getGymFacilityPlans(gymId);
        const facilityPlans = facilityPlansResponse?.data || [];
        
        for (const facilityPlan of facilityPlans) {
          try {
            const facilityUsersResponse = await getFacilityPlanUsers(gymId, facilityPlan.facilityId, facilityPlan.id);
            const facilityUsers = facilityUsersResponse?.data || [];
            allUsers = allUsers.concat(facilityUsers);
          } catch (err) {
            console.warn(`Failed to fetch users for facility plan ${facilityPlan.id}`);
          }
        }
      } catch (err) {
        console.warn('Failed to fetch facility plans');
      }
      
      // Remove duplicates based on userId
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
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-lime-500/30 border-t-lime-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-zinc-500 font-medium">Analyzing member data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-white transition-colors mb-4"
            >
              <span>←</span> Back to Dashboard
            </Link>
            <h2 className="text-4xl font-extrabold tracking-tight">Gym Members</h2>
            <p className="text-zinc-400 mt-2 text-lg">Detailed overview of your gym's community and active subscribers.</p>
          </div>
          <div className="bg-zinc-900/50 border border-zinc-800 px-8 py-4 rounded-3xl flex items-center gap-6">
            <div className="text-center">
              <div className="text-3xl font-black text-lime-400 leading-none">{users.length}</div>
              <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-500 mt-2">Total Members</div>
            </div>
            <div className="w-px h-8 bg-zinc-800"></div>
            <div className="text-center">
              <div className="text-3xl font-black text-white leading-none">
                {users.filter(u => u.membershipStatus === "ACTIVE").length}
              </div>
              <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-500 mt-2">Active Now</div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-8 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl flex items-center gap-3">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            {error}
          </div>
        )}

        {users.length === 0 ? (
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-20 text-center">
            <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl text-zinc-500">👥</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">No members found</h3>
            <p className="text-zinc-400 max-w-sm mx-auto">Your community is just starting. Members will appear here once they join your gym.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {users.map((user) => (
              <Link
                key={user.userId}
                to={`/owner/gyms/${gymId}/users/${user.userId}/stats`}
                className="group relative bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 hover:bg-zinc-900/80 hover:border-zinc-700 transition-all duration-300"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-lime-500/10 rounded-2xl flex items-center justify-center text-lime-400 font-bold text-xl">
                    {user.userName?.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white group-hover:text-lime-400 transition-colors truncate">
                      {user.userName}
                    </h3>
                    <p className="text-zinc-500 text-xs truncate">{user.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-black/40 p-3 rounded-2xl border border-white/5">
                    <div className="text-[10px] uppercase font-bold text-zinc-500 mb-1">Total Visits</div>
                    <div className="text-lg font-black text-white">{user.totalVisits}</div>
                  </div>
                  <div className="bg-black/40 p-3 rounded-2xl border border-white/5">
                    <div className="text-[10px] uppercase font-bold text-zinc-500 mb-1">Last Visit</div>
                    <div className="text-sm font-bold text-zinc-300 truncate">{formatDate(user.lastVisitDate)}</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center bg-black/20 p-2 rounded-xl">
                    <span className="text-[10px] uppercase font-bold text-zinc-500">Gym Sub</span>
                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black tracking-tighter ${
                      user.membershipStatus === "ACTIVE" 
                        ? "bg-lime-500/10 text-lime-400" 
                        : "bg-zinc-800 text-zinc-500"
                    }`}>
                      {user.membershipStatus}
                    </span>
                  </div>
                  <div className="flex justify-between items-center bg-black/20 p-2 rounded-xl">
                    <span className="text-[10px] uppercase font-bold text-zinc-500">Facility Sub</span>
                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black tracking-tighter ${
                      user.facilitySubscriptionStatus === "ACTIVE" 
                        ? "bg-blue-500/10 text-blue-400" 
                        : "bg-zinc-800 text-zinc-500"
                    }`}>
                      {user.facilitySubscriptionStatus}
                    </span>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <span className="text-xs text-lime-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    View Member Profile →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
