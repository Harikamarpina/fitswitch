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
    <div className="min-h-screen bg-black text-white px-4 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Link
                to="/dashboard"
                className="p-2 bg-zinc-900 hover:bg-zinc-800 rounded-xl transition-colors text-zinc-400 hover:text-white"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <span className="text-lime-400 font-medium tracking-wider uppercase text-sm">Member Management</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Plan <span className="text-lime-400">Subscribers</span>
            </h1>
            <p className="text-zinc-400 mt-4 max-w-2xl text-lg">
              Detailed breakdown of members currently subscribed to the 
              <span className="text-white font-medium"> {planInfo?.type === "FACILITY" ? "Facility" : "Gym"} Plan</span>.
            </p>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-[2rem] flex items-center gap-6">
            <div className="h-12 w-12 bg-lime-400/10 rounded-2xl flex items-center justify-center">
              <svg className="w-6 h-6 text-lime-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <div className="text-3xl font-bold">{users.length}</div>
              <div className="text-xs text-zinc-500 uppercase tracking-widest font-semibold">Active Members</div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-8 bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-2xl flex items-center gap-3">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        {users.length === 0 ? (
          <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-[2.5rem] py-24 text-center">
            <div className="w-20 h-20 bg-zinc-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-2">No Subscribers Yet</h3>
            <p className="text-zinc-500 max-w-sm mx-auto">This plan hasn't been purchased by any members yet. Check back later for updates.</p>
          </div>
        ) : (
          <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-[2.5rem] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800/50">
                    <th className="py-6 px-8 text-xs font-bold text-zinc-500 uppercase tracking-widest">Subscriber</th>
                    <th className="py-6 px-8 text-xs font-bold text-zinc-500 uppercase tracking-widest">Status</th>
                    <th className="py-6 px-8 text-xs font-bold text-zinc-500 uppercase tracking-widest text-center">Activity</th>
                    <th className="py-6 px-8 text-xs font-bold text-zinc-500 uppercase tracking-widest">Subscription Dates</th>
                    <th className="py-6 px-8 text-xs font-bold text-zinc-500 uppercase tracking-widest">Last Check-in</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {users.map((user) => (
                    <tr key={user.userId} className="hover:bg-zinc-800/20 transition-colors group">
                      <td className="py-6 px-8">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-lime-400 border border-zinc-700">
                            {user.userName.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-white group-hover:text-lime-400 transition-colors">{user.userName}</div>
                            <div className="text-sm text-zinc-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-6 px-8">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${
                          user.status === "ACTIVE" 
                            ? "bg-lime-400/10 text-lime-400" 
                            : "bg-red-400/10 text-red-400"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${user.status === "ACTIVE" ? "bg-lime-400" : "bg-red-400"}`}></span>
                          {user.status}
                        </span>
                      </td>
                      <td className="py-6 px-8">
                        <div className="text-center">
                          <div className="text-xl font-bold text-white">{user.totalVisits}</div>
                          <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-tighter">Total Visits</div>
                        </div>
                      </td>
                      <td className="py-6 px-8">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-zinc-500 w-12">Start:</span>
                            <span className="text-zinc-300 font-medium">{formatDate(user.purchaseDate)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-zinc-500 w-12">Expiry:</span>
                            <span className="text-zinc-300 font-medium">{formatDate(user.expiryDate)}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-6 px-8">
                        <div className="text-sm text-zinc-300 font-medium">
                          {user.lastCheckIn ? formatDateTime(user.lastCheckIn) : (
                            <span className="text-zinc-600 italic">Never checked in</span>
                          )}
                        </div>
                        <div className="text-[10px] text-zinc-500 uppercase font-bold mt-1">
                          {user.lastVisitDate ? `Last visit: ${formatDate(user.lastVisitDate)}` : ""}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}