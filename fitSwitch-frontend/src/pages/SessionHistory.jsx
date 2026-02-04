import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

export default function SessionHistory() {
  const [membershipSessions, setMembershipSessions] = useState([]);
  const [facilitySessions, setFacilitySessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const [membershipRes, facilityRes] = await Promise.all([
          axiosInstance.get("/user/history/sessions"),
          axiosInstance.get("/user/history/facility-sessions")
        ]);
        setMembershipSessions(membershipRes.data || []);
        setFacilitySessions(facilityRes.data || []);
      } catch (err) {
        setError("Failed to load session history");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-400 mx-auto mb-4"></div>
          <p className="text-zinc-400">Loading session history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <Link to="/dashboard" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-4">
              <span>←</span> Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold">Session History</h1>
            <p className="text-zinc-500 mt-2">Detailed history of your membership and facility check-ins.</p>
          </div>
        </div>

        {error && (
          <div className="mb-8 bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-2xl">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Membership Sessions</h3>
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                {membershipSessions.length} entries
              </span>
            </div>
            {membershipSessions.length === 0 ? (
              <p className="text-zinc-500 text-sm">No membership sessions found.</p>
            ) : (
              <div className="space-y-3">
                {membershipSessions.map((s) => (
                  <div key={s.id} className="bg-black/30 border border-zinc-800 rounded-2xl p-4">
                    <div className="font-bold text-white">{s.gymName}</div>
                    <div className="text-xs text-zinc-500">
                      {new Date(s.visitDate).toLocaleDateString("en-IN")} • {s.status}
                    </div>
                    <div className="text-xs text-zinc-400 mt-2">
                      In: {s.checkInTime ? new Date(s.checkInTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "-"}
                      {"  "}Out: {s.checkOutTime ? new Date(s.checkOutTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "-"}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Facility Sessions</h3>
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                {facilitySessions.length} entries
              </span>
            </div>
            {facilitySessions.length === 0 ? (
              <p className="text-zinc-500 text-sm">No facility sessions found.</p>
            ) : (
              <div className="space-y-3">
                {facilitySessions.map((s) => (
                  <div key={s.id} className="bg-black/30 border border-zinc-800 rounded-2xl p-4">
                    <div className="font-bold text-white">{s.facilityName}</div>
                    <div className="text-xs text-zinc-500">{s.gymName}</div>
                    <div className="text-xs text-zinc-500">
                      {new Date(s.visitDate).toLocaleDateString("en-IN")} • {s.status}
                    </div>
                    <div className="text-xs text-zinc-400 mt-2">
                      In: {s.checkInTime ? new Date(s.checkInTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "-"}
                      {"  "}Out: {s.checkOutTime ? new Date(s.checkOutTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "-"}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
