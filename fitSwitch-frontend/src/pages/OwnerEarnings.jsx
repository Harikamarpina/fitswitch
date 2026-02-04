import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getOwnerEarnings, getTotalEarnings } from "../api/ownerEarningsApi";
import { getTransactionHistory } from "../api/walletApi";
import { getAllOwnerFacilityPlans, getFacilityPlanUsers } from "../api/facilityApi";
import { getOwnerGyms } from "../api/gymApi";
import { getApprovedRefundRequests, processRefund } from "../api/unsubscribeApi";

export default function OwnerEarnings() {
  const [earnings, setEarnings] = useState([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refundRequests, setRefundRequests] = useState([]);
  const [processingRefund, setProcessingRefund] = useState({});
  const [walletTransactions, setWalletTransactions] = useState([]);

  useEffect(() => {
    fetchEarnings();
    fetchRefundRequests();
    fetchWalletTransactions();
  }, []);

  const fetchRefundRequests = async () => {
    try {
      const response = await getApprovedRefundRequests();
      setRefundRequests(response || []);
    } catch (err) {
      console.error('Failed to fetch refund requests:', err);
    }
  };

  const fetchWalletTransactions = async () => {
    try {
      const response = await getTransactionHistory();
      setWalletTransactions(response || []);
    } catch (err) {
      console.error('Failed to fetch wallet transactions:', err);
    }
  };

  const handleProcessRefund = async (requestId) => {
    try {
      setProcessingRefund(prev => ({ ...prev, [requestId]: true }));
      const response = await processRefund(requestId);
      setError({ type: 'success', message: response?.message || 'Refund processed successfully!' });
      await Promise.all([
        fetchRefundRequests(),
        fetchEarnings(),
        fetchWalletTransactions()
      ]);
    } catch (err) {
      setError({ type: 'error', message: err.message || 'Failed to process refund' });
    } finally {
      setProcessingRefund(prev => ({ ...prev, [requestId]: false }));
    }
  };

  const fetchEarnings = async () => {
    try {
      setLoading(true);
      const [earningsRes, totalRes] = await Promise.all([
        getOwnerEarnings(),
        getTotalEarnings()
      ]);
      
      let allEarnings = earningsRes || [];
      let totalAmount = totalRes || 0;
      
      // If facility earnings are missing, fetch them separately
      const facilityEarnings = allEarnings.filter(e => e.type === 'FACILITY_USAGE' || e.type === 'FACILITY_PURCHASE');
      
      if (facilityEarnings.length === 0) {
        try {
          // Fetch facility plan purchases as backup
          const [facilityPlansRes, gymsRes] = await Promise.all([
            getAllOwnerFacilityPlans().catch(() => ({ data: [] })),
            getOwnerGyms().catch(() => ({ data: [] }))
          ]);
          
          const facilityPlans = facilityPlansRes.data || [];
          const gyms = gymsRes.data || [];
          
          for (const plan of facilityPlans) {
            try {
              const gym = gyms.find(g => g.id === plan.gymId);
              const usersRes = await getFacilityPlanUsers(plan.gymId, plan.facilityId, plan.id).catch(() => ({ data: [] }));
              const users = usersRes.data || [];
              
              // Create synthetic earnings records for facility purchases
              const facilityTransactions = users.map(user => ({
                id: `facility-${plan.id}-${user.userId}`,
                type: 'FACILITY_PURCHASE',
                amount: plan.price || 0,
                description: `Facility Plan: ${plan.name}`,
                gymName: gym?.name || 'Unknown Gym',
                userName: user.userName || 'Unknown User',
                createdAt: user.purchaseDate || new Date().toISOString()
              }));
              
              allEarnings = [...allEarnings, ...facilityTransactions];
              totalAmount += facilityTransactions.reduce((sum, t) => sum + t.amount, 0);
            } catch (err) {
              console.warn(`Failed to fetch users for facility plan ${plan.id}`);
            }
          }
        } catch (err) {
          console.warn('Failed to fetch facility earnings backup');
        }
      }
      
      // Sort by date (newest first)
      allEarnings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      setEarnings(allEarnings);
      setTotalEarnings(totalAmount);
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
      case 'FACILITY_PURCHASE':
        return 'text-blue-400';
      case 'MEMBERSHIP_SWITCH_USED':
        return 'text-orange-400';
      case 'MEMBERSHIP_REFUND':
        return 'text-red-400';
      default:
        return 'text-zinc-300';
    }
  };

  const getEarningIcon = (type) => {
    switch (type) {
      case 'MEMBERSHIP_PURCHASE':
        return '🏋️';
      case 'FACILITY_USAGE':
      case 'FACILITY_PURCHASE':
        return '🏃';
      case 'MEMBERSHIP_SWITCH_USED':
        return '🔄';
      case 'MEMBERSHIP_REFUND':
        return '↩️';
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
      case 'FACILITY_PURCHASE':
        return 'Facility Plan Purchase';
      case 'MEMBERSHIP_SWITCH_USED':
        return 'Membership Switch';
      case 'MEMBERSHIP_REFUND':
        return 'Membership Refund';
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
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors font-medium bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-xl mb-4"
            >
              <span>←</span> Back to Dashboard
            </Link>
            <h1 className="text-4xl font-extrabold tracking-tight">Revenue Dashboard</h1>
            <p className="text-zinc-400 mt-2 text-lg">
              Detailed tracking of your gym's financial performance.
            </p>
          </div>
        </div>

        {error && (
          <div className={`mb-8 p-4 rounded-2xl flex items-center gap-3 ${
            error.type === 'success' ? 'bg-lime-500/10 border border-lime-500/20 text-lime-400' :
            'bg-red-500/10 border border-red-500/20 text-red-400'
          }`}>
            <span className={`w-2 h-2 rounded-full animate-pulse ${
              error.type === 'success' ? 'bg-lime-500' : 'bg-red-500'
            }`}></span>
            {error.message || error}
          </div>
        )}

        {/* Refund Requests Section */}
        {refundRequests.length > 0 && (
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-[2.5rem] p-10 mb-12">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-black tracking-tight uppercase text-amber-400">Pending Refunds</h3>
                <p className="text-amber-300/70 text-sm mt-1">Approved cancellations awaiting refund processing</p>
              </div>
              <span className="text-xs font-bold text-amber-500 uppercase tracking-widest bg-amber-500/20 px-4 py-2 rounded-full">
                {refundRequests.length} pending
              </span>
            </div>
            
            <div className="space-y-4">
              {refundRequests.map((request) => (
                <div key={request.id} className="bg-black/40 border border-amber-500/20 rounded-2xl p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
                        <span className="text-amber-400 font-bold">{request.userName?.charAt(0) || 'U'}</span>
                      </div>
                      <div>
                        <div className="font-bold text-white">{request.userName}</div>
                        <div className="text-sm text-amber-300">{request.gymName} - {request.planName}</div>
                        <div className="text-xs text-amber-400/70 mt-1">
                          Approved on {new Date(request.approvalDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-xl font-bold text-amber-400">INR {Number(request.refundAmount || 0).toFixed(2)}</div>
                        <div className="text-xs text-amber-400/70">Refund Amount</div>
                      </div>
                      <button
                        onClick={() => handleProcessRefund(request.id)}
                        disabled={processingRefund[request.id]}
                        className="px-6 py-3 bg-amber-500 text-black font-bold rounded-xl hover:bg-amber-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {processingRefund[request.id] ? 'Processing...' : 'Send Refund'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Total Earnings Card - High Impact */}
        <div className="relative overflow-hidden bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-12 mb-12 group">
          <div className="absolute top-0 right-0 w-96 h-96 bg-lime-500/10 blur-[100px] -mr-48 -mt-48 rounded-full group-hover:bg-lime-500/20 transition-colors duration-700"></div>
          <div className="relative z-10">
            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-zinc-500 mb-4">Total Revenue Generated</h2>
            <div className="flex items-baseline gap-4">
              <span className="text-5xl md:text-6xl font-black text-white tracking-tighter">
                INR {totalEarnings.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </span>
              <div className="px-3 py-1 bg-lime-500/10 border border-lime-500/20 rounded-full text-lime-400 text-xs font-black uppercase tracking-widest">
                Life-time
              </div>
            </div>
            
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-black/40 border border-white/5 p-6 rounded-3xl">
                <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Memberships</div>
                <div className="text-lg font-bold text-white">
                  INR {earnings.filter(e => e.type === 'MEMBERSHIP_PURCHASE').reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}
                </div>
              </div>
              <div className="bg-black/40 border border-white/5 p-6 rounded-3xl">
                <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Facility Access</div>
                <div className="text-lg font-bold text-white">
                  INR {earnings.filter(e => e.type === 'FACILITY_USAGE' || e.type === 'FACILITY_PURCHASE').reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}
                </div>
              </div>
              <div className="bg-black/40 border border-white/5 p-6 rounded-3xl">
                <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Switch Credits</div>
                <div className="text-lg font-bold text-white">
                  INR {earnings.filter(e => e.type === 'MEMBERSHIP_SWITCH_USED').reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}
                </div>
              </div>
              <div className="bg-black/40 border border-white/5 p-6 rounded-3xl">
                <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Refunds</div>
                <div className="text-lg font-bold text-white">
                  INR {Math.abs(earnings.filter(e => e.type === 'MEMBERSHIP_REFUND').reduce((acc, curr) => acc + curr.amount, 0)).toLocaleString()}
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
                    <div className={`text-xl font-black ${getEarningTypeColor(earning.type)}`}>
                      {(earning.amount < 0 ? '-' : '+')}INR {Math.abs(earning.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
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

        {/* Wallet Transactions */}
        <div className="bg-zinc-900/30 border border-zinc-800 rounded-[2.5rem] p-10 mt-12">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-2xl font-black tracking-tight uppercase">Wallet Transactions</h3>
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest bg-zinc-800 px-4 py-2 rounded-full">
              {walletTransactions.length} entries
            </span>
          </div>

          {walletTransactions.length === 0 ? (
            <div className="text-center py-16 bg-black/20 rounded-3xl border border-zinc-800 border-dashed">
              <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">🧾</span>
              </div>
              <p className="text-zinc-500 font-medium">No wallet transactions found yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {walletTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-zinc-900/50 border border-zinc-800 rounded-3xl"
                >
                  <div className="mb-4 md:mb-0">
                    <div className="font-bold text-white">{tx.description || 'Wallet transaction'}</div>
                    <div className="text-xs font-bold text-zinc-500 mt-1 uppercase tracking-tighter">
                      {new Date(tx.createdAt).toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {tx.gymName && (
                        <span className="text-[10px] font-black bg-black/40 text-zinc-400 px-2 py-1 rounded-lg border border-white/5 uppercase">
                          {tx.gymName}
                        </span>
                      )}
                      {tx.facilityName && (
                        <span className="text-[10px] font-black bg-blue-500/10 text-blue-400 px-2 py-1 rounded-lg border border-blue-500/10 uppercase">
                          {tx.facilityName}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-left md:text-right">
                    <div className={`text-xl font-black ${tx.amount < 0 ? 'text-red-400' : 'text-lime-400'}`}>
                      {tx.amount < 0 ? '-' : '+'}INR {Math.abs(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </div>
                    <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mt-1">
                      Balance: INR {Number(tx.balanceAfter || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-16"></div>
      </div>
    </div>
  );
}
