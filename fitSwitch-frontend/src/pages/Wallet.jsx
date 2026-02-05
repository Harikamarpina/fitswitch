import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getWalletBalance, addMoney, getTransactionHistory } from "../api/walletApi";
import { getDashboardRoute } from "../utils/navigation";

export default function Wallet() {
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addMoneyAmount, setAddMoneyAmount] = useState("");
  const [addingMoney, setAddingMoney] = useState(false);
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [topUpSuccess, setTopUpSuccess] = useState("");

  useEffect(() => {
    fetchWalletData();
  }, []);

  useEffect(() => {
    if (!topUpSuccess) return;
    const timer = setTimeout(() => setTopUpSuccess(""), 4000);
    return () => clearTimeout(timer);
  }, [topUpSuccess]);

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      const [walletRes, transactionsRes] = await Promise.all([
        getWalletBalance(),
        getTransactionHistory()
      ]);
      setWallet(walletRes);
      setTransactions(transactionsRes);
    } catch (err) {
      setError(err.message || "Failed to load wallet data");
    } finally {
      setLoading(false);
    }
  };

  const handleAddMoney = async (e) => {
    e.preventDefault();
    if (!addMoneyAmount || parseFloat(addMoneyAmount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    try {
      setAddingMoney(true);
      setError("");
      setTopUpSuccess("");
      await addMoney(parseFloat(addMoneyAmount));
      setAddMoneyAmount("");
      setShowAddMoney(false);
      await fetchWalletData(); // Refresh data
      setTopUpSuccess("Wallet topped up successfully.");
    } catch (err) {
      setError(err.message || "Failed to add money");
    } finally {
      setAddingMoney(false);
    }
  };

  const getTransactionTypeColor = (type, amount) => {
    if (type === 'MEMBERSHIP_REFUND') {
      return amount >= 0 ? 'text-lime-400' : 'text-red-400';
    }
    switch (type) {
      case 'ADD_MONEY':
        return 'text-green-400';
      case 'FACILITY_USAGE':
        return 'text-red-400';
      case 'SUB':
        return 'text-red-400';
      case 'MEMBERSHIP_SWITCH':
        return 'text-orange-400';
      default:
        return 'text-zinc-300';
    }
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'ADD_MONEY':
        return '💰';
      case 'FACILITY_USAGE':
        return '🏋️';
      case 'SUB':
        return '📋';
      case 'MEMBERSHIP_REFUND':
        return '↩️';
      case 'MEMBERSHIP_SWITCH':
        return '🔄';
      default:
        return '💳';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-400 mx-auto mb-4"></div>
          <p className="text-zinc-300">Loading wallet...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-green-500/5 blur-[150px] rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <Link
              to={getDashboardRoute()}
              className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-white transition-colors mb-4"
            >
              <span>←</span> Back to Dashboard
            </Link>
            <h1 className="text-4xl font-bold tracking-tight">My Wallet</h1>
            <p className="text-zinc-400 mt-2 text-lg">
              Securely manage your funds and track your fitness spend.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-8 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl text-sm font-medium">
            {error}
          </div>
        )}

        {topUpSuccess && (
          <div className="mb-8 bg-lime-400/10 border border-lime-400/20 text-lime-400 p-4 rounded-2xl text-sm font-bold">
            {topUpSuccess}
          </div>
        )}

        {/* Wallet Balance Card */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-10 mb-12 backdrop-blur-md relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 text-7xl opacity-10 group-hover:scale-110 transition-transform duration-500">💳</div>
          <div className="relative z-10">
            <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em] mb-4">Available Funds</h2>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-zinc-400">₹</span>
              <span className={`text-6xl font-black tracking-tighter ${
                wallet?.balance < 0 ? 'text-red-400' : 'text-lime-500'
              }`}>
                {wallet?.balance?.toFixed(0) || '0'}
                <span className={`text-2xl ${
                  wallet?.balance < 0 ? 'text-red-400/50' : 'text-lime-500/50'
                }`}>.{wallet?.balance?.toFixed(2).split('.')[1] || '00'}</span>
              </span>
            </div>
            {wallet?.balance < 0 && (
              <div className="mt-4 p-4 bg-red-400/10 border border-red-400/20 rounded-2xl">
                <div className="flex items-center gap-2 text-red-400 text-sm font-medium">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>Negative balance due to pending refunds. Please add funds to complete transactions.</span>
                </div>
              </div>
            )}
            <div className="mt-10">
              <button
                onClick={() => setShowAddMoney(true)}
                className={`px-8 py-4 rounded-2xl font-bold transition-all active:scale-[0.98] shadow-xl ${
                  wallet?.balance < 0 
                    ? 'bg-red-500 text-white hover:bg-red-400 shadow-red-500/10'
                    : 'bg-lime-500 text-black hover:bg-lime-400 shadow-lime-500/10'
                }`}
              >
                {wallet?.balance < 0 ? 'Add Funds Now' : 'Top Up Wallet'}
              </button>
            </div>
          </div>
        </div>

        {/* Add Money Modal */}
        {showAddMoney && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 w-full max-w-md shadow-2xl">
              <h3 className="text-2xl font-bold mb-2">Add Money</h3>
              <p className="text-zinc-500 text-sm mb-8">Enter the amount you wish to add to your wallet.</p>
              <form onSubmit={handleAddMoney} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3 ml-1">
                    Amount (INR)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-bold">₹</span>
                    <input
                      type="number"
                      step="0.01"
                      min="1"
                      value={addMoneyAmount}
                      onChange={(e) => setAddMoneyAmount(e.target.value)}
                      className="w-full pl-10 pr-4 py-4 rounded-2xl bg-black border border-zinc-800 text-white text-xl font-bold focus:outline-none focus:ring-2 focus:ring-lime-500/20 focus:border-lime-500 transition-all placeholder:text-zinc-800"
                      placeholder="0.00"
                      required
                      autoFocus
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <button
                    type="submit"
                    disabled={addingMoney}
                    className="w-full py-4 rounded-2xl bg-lime-500 text-black font-bold hover:bg-lime-400 transition-all active:scale-[0.98] disabled:opacity-50"
                  >
                    {addingMoney ? "Processing..." : "Confirm Deposit"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddMoney(false);
                      setAddMoneyAmount("");
                      setError("");
                    }}
                    className="w-full py-4 rounded-2xl bg-transparent text-zinc-500 font-bold hover:text-white transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Transaction History */}
        <div className="space-y-6">
          <div className="flex items-center gap-4 mb-2">
            <h3 className="text-2xl font-bold">Activity</h3>
            <div className="h-px flex-1 bg-zinc-800"></div>
          </div>
          
          {transactions.length === 0 ? (
            <div className="text-center py-20 bg-zinc-900/20 border border-zinc-800/50 border-dashed rounded-3xl">
              <div className="text-4xl mb-4 opacity-20">📜</div>
              <p className="text-zinc-500 font-medium">No transactions found in your history.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-5 bg-zinc-900/40 border border-zinc-800 rounded-2xl hover:bg-zinc-900/60 transition-colors group"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-xl bg-black border border-zinc-800 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div>
                      <div className="font-bold text-zinc-200 group-hover:text-white transition-colors">
                        {transaction.description}
                      </div>
                      <div className="text-xs font-bold text-zinc-600 uppercase tracking-tighter mt-1">
                        {new Date(transaction.createdAt).toLocaleString("en-IN", {
                          day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit"
                        })}
                        {transaction.gymName && ` • ${transaction.gymName}`}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-black tracking-tight ${getTransactionTypeColor(transaction.type, transaction.amount)}`}>
                      {transaction.amount >= 0 ? '+' : ''}₹{Math.abs(transaction.amount).toFixed(0)}
                    </div>
                    <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mt-0.5">
                      Bal: ₹{transaction.balanceAfter.toFixed(0)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-20 pt-10 border-t border-zinc-900"></div>
      </div>
    </div>
  );
}
