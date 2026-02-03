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
          <div className="w-12 h-12 border-4 border-lime-500/30 border-t-lime-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-zinc-500 font-medium">Calculating your revenue...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">Revenue Dashboard</h1>
            <p className="text-zinc-400 mt-2 text-lg">
              Detailed tracking of your gym's financial performance.
            </p>
          </div>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors font-medium bg-zinc-900 border border-zinc-800 px-6 py-3 rounded-2xl"
          >
            <span>←</span> Dashboard
          </Link>
        </div>

        {error && (
          <div className="mb-8 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl flex items-center gap-3">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            {error}
          </div>
        )}

        {/* Total Earnings Card - High Impact */}
        <div className="relative overflow-hidden bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-12 mb-12 group">
          <div className="absolute top-0 right-0 w-96 h-96 bg-lime-500/10 blur-[100px] -mr-48 -mt-48 rounded-full group-hover:bg-lime-500/20 transition-colors duration-700"></div>
          <div className="relative z-10">
            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-zinc-500 mb-4">Total Revenue Generated</h2>
            <div className="flex items-baseline gap-4">
              <span className="text-7xl font-black text-white tracking-tighter">
                ₹{totalEarnings.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </span>
              <div className="px-3 py-1 bg-lime-500/10 border border-lime-500/20 rounded-full text-lime-400 text-xs font-black uppercase tracking-widest">
                Life-time
              </div>
            </div>
            
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-black/40 border border-white/5 p-6 rounded-3xl">
                <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Memberships</div>
                <div className="text-xl font-bold text-white">
                  ₹{earnings.filter(e => e.type === 'MEMBERSHIP_PURCHASE').reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}
                </div>
              </div>
              <div className="bg-black/40 border border-white/5 p-6 rounded-3xl">
                <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Facility Access</div>
                <div className="text-xl font-bold text-white">
                  ₹{earnings.filter(e => e.type === 'FACILITY_USAGE').reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}
                </div>
              </div>
              <div className="bg-black/40 border border-white/5 p-6 rounded-3xl">
                <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Switch Credits</div>
                <div className="text-xl font-bold text-white">
                  ₹{earnings.filter(e => e.type === 'MEMBERSHIP_SWITCH_USED').reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Earnings History */}
        <div className="bg-zinc-900/30 border border-zinc-800 rounded-[2.5rem] p-10">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-2xl font-black tracking-tight uppercase">Recent Transactions</h3>
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest bg-zinc-800 px-4 py-2 rounded-full">
              {earnings.length} entries
            </span>
          </div>
          
          {earnings.length === 0 ? (
            <div className="text-center py-20 bg-black/20 rounded-3xl border border-zinc-800 border-dashed">
              <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">📊</span>
              </div>
              <p className="text-zinc-500 font-medium">No transaction history found yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {earnings.map((earning) => (
                <div
                  key={earning.id}
                  className="group flex flex-col md:flex-row md:items-center justify-between p-6 bg-zinc-900/50 border border-zinc-800 rounded-3xl hover:bg-zinc-800/80 hover:border-zinc-700 transition-all duration-300"
                >
                  <div className="flex items-center gap-6 mb-4 md:mb-0">
                    <div className="w-14 h-14 bg-zinc-800 rounded-2xl flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform">
                      {getEarningIcon(earning.type)}
                    </div>
                    <div>
                      <div className="font-black text-white group-hover:text-lime-400 transition-colors">
                        {earning.description}
                      </div>
                      <div className="text-xs font-bold text-zinc-500 mt-1 uppercase tracking-tighter">
                        {new Date(earning.createdAt).toLocaleString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {earning.gymName && (
                          <span className="text-[10px] font-black bg-black/40 text-zinc-400 px-2 py-1 rounded-lg border border-white/5 uppercase">
                            {earning.gymName}
                          </span>
                        )}
                        {earning.userName && (
                          <span className="text-[10px] font-black bg-lime-500/10 text-lime-400 px-2 py-1 rounded-lg border border-lime-500/10 uppercase">
                            {earning.userName}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-left md:text-right border-t md:border-t-0 border-zinc-800 pt-4 md:pt-0">
                    <div className={`text-2xl font-black ${getEarningTypeColor(earning.type)}`}>
                      +₹{earning.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </div>
                    <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mt-1">
                      {getEarningTypeLabel(earning.type)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-16 text-center">
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-zinc-500 hover:text-lime-400 transition-colors font-medium">
            <span>←</span> Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}