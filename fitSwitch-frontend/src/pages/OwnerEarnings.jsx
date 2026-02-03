import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getOwnerEarnings, getTotalEarnings } from "../api/ownerEarningsApi";

export default function OwnerEarnings() {
  const [earnings, setEarnings] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      setLoading(true);
      const [earningsRes, totalRes] = await Promise.all([
        getOwnerEarnings(),
        getTotalEarnings()
      ]);
      setEarnings(earningsRes);
      setTotalEarnings(totalRes);
    } catch (err) {
      setError(err.message || "Failed to load earnings data");
    } finally {
      setLoading(false);
    }
  };

  const getEarningTypeColor = (type) => {
    switch (type) {
      case 'MEMBERSHIP_PURCHASE':
        return 'text-green-400';
      case 'FACILITY_USAGE':
        return 'text-blue-400';
      case 'MEMBERSHIP_SWITCH_USED':
        return 'text-orange-400';
      default:
        return 'text-zinc-300';
    }
  };

  const getEarningIcon = (type) => {
    switch (type) {
      case 'MEMBERSHIP_PURCHASE':
        return '🏋️';
      case 'FACILITY_USAGE':
        return '🏃';
      case 'MEMBERSHIP_SWITCH_USED':
        return '🔄';
      default:
        return '💰';
    }
  };

  const getEarningTypeLabel = (type) => {
    switch (type) {
      case 'MEMBERSHIP_PURCHASE':
        return 'Membership Purchase';
      case 'FACILITY_USAGE':
        return 'Facility Usage';
      case 'MEMBERSHIP_SWITCH_USED':
        return 'Membership Switch';
      default:
        return type;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-400 mx-auto mb-4"></div>
          <p className="text-zinc-300">Loading earnings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-5 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Earnings</h1>
            <p className="text-zinc-300 mt-2">
              Track your earnings from memberships and facility usage
            </p>
          </div>
          <Link
            to="/owner/dashboard"
            className="px-4 py-2 rounded-xl bg-zinc-700 text-white font-semibold hover:bg-zinc-600 transition"
          >
            Back to Dashboard
          </Link>
        </div>

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-200 p-4 rounded-lg">
            {error}
          </div>
        )}

        {/* Total Earnings Card */}
        <div className="bg-gradient-to-r from-green-500/20 to-lime-500/20 border border-green-500/30 rounded-xl p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg text-zinc-300 mb-2">Total Earnings</h2>
              <div className="text-4xl font-bold text-green-400">
                ₹{totalEarnings.toFixed(2)}
              </div>
            </div>
            <div className="text-6xl">💰</div>
          </div>
        </div>

        {/* Earnings History */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h3 className="text-xl font-bold mb-6">Earnings History</h3>
          
          {earnings.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">📊</div>
              <p className="text-zinc-400">No earnings yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {earnings.map((earning) => (
                <div
                  key={earning.id}
                  className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-2xl">
                      {getEarningIcon(earning.type)}
                    </div>
                    <div>
                      <div className="font-medium">
                        {earning.description}
                      </div>
                      <div className="text-sm text-zinc-400">
                        {new Date(earning.createdAt).toLocaleString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </div>
                      <div className="flex gap-4 text-xs text-zinc-500 mt-1">
                        {earning.gymName && (
                          <span>Gym: {earning.gymName}</span>
                        )}
                        {earning.facilityName && (
                          <span>Facility: {earning.facilityName}</span>
                        )}
                        {earning.userName && (
                          <span>User: {earning.userName}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold text-lg ${getEarningTypeColor(earning.type)}`}>
                      +₹{earning.amount.toFixed(2)}
                    </div>
                    <div className="text-sm text-zinc-400">
                      {getEarningTypeLabel(earning.type)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <Link to="/owner/dashboard" className="underline text-zinc-200 hover:text-white">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}