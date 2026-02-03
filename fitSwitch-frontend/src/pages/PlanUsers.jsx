import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getGymPlanUsers, getFacilityPlanUsers } from "../api/facilityApi";

export default function PlanUsers() {
  const { gymId, planId, facilityId } = useParams();
  const [users, setUsers] = useState([]);
  const [planInfo, setPlanInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isFacilityPlan = !!facilityId;

  useEffect(() => {
    fetchPlanUsers();
  }, [gymId, planId, facilityId]);

  const fetchPlanUsers = async () => {
    try {
      setLoading(true);
      let response;
      
      if (isFacilityPlan) {
        response = await getFacilityPlanUsers(gymId, facilityId, planId);
      } else {
        response = await getGymPlanUsers(gymId, planId);
      }
      
      setUsers(response.data || []);
      
      if (response.data && response.data.length > 0) {
        setPlanInfo({
          type: response.data[0].planType,
          totalUsers: response.data.length
        });
      }
    } catch (err) {
      setError("Failed to load plan users");
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

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return "Never";
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
          <p className="text-zinc-300">Loading plan users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-zinc-800 text-white px-4 py-10">
      <div className="max-w-6xl mx-auto bg-white/5 border border-white/10 rounded-2xl p-8 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold">Plan Users</h2>
            <p className="text-zinc-300 text-sm mt-1">
              {planInfo?.type === "FACILITY" ? "Facility Plan" : "Gym Plan"} subscribers and their activity
            </p>
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

        {users.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">👥</div>
            <h3 className="text-xl font-semibold mb-2">No users found</h3>
            <p className="text-zinc-400">No one has purchased this plan yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 font-semibold">User</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 font-semibold">Purchase Date</th>
                  <th className="text-left py-3 px-4 font-semibold">Expiry Date</th>
                  <th className="text-left py-3 px-4 font-semibold">Total Visits</th>
                  <th className="text-left py-3 px-4 font-semibold">Last Visit</th>
                  <th className="text-left py-3 px-4 font-semibold">Last Check-in</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.userId} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-semibold">{user.userName}</div>
                        <div className="text-sm text-zinc-400">{user.email}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        user.status === "ACTIVE" 
                          ? "bg-green-500/20 text-green-400" 
                          : "bg-red-500/20 text-red-400"
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm">{formatDate(user.purchaseDate)}</td>
                    <td className="py-4 px-4 text-sm">{formatDate(user.expiryDate)}</td>
                    <td className="py-4 px-4">
                      <span className="font-semibold text-lime-400">{user.totalVisits}</span>
                    </td>
                    <td className="py-4 px-4 text-sm">{formatDate(user.lastVisitDate)}</td>
                    <td className="py-4 px-4 text-sm">{formatDateTime(user.lastCheckIn)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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