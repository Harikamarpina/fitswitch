import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getWalletBalance, addMoney, getTransactionHistory } from "../api/walletApi";

export default function Wallet() {
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addMoneyAmount, setAddMoneyAmount] = useState("");
  const [addingMoney, setAddingMoney] = useState(false);
  const [showAddMoney, setShowAddMoney] = useState(false);

  useEffect(() => {
    fetchWalletData();
  }, []);

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
      await addMoney(parseFloat(addMoneyAmount));
      setAddMoneyAmount("");
      setShowAddMoney(false);
      await fetchWalletData(); // Refresh data
    } catch (err) {
      setError(err.message || "Failed to add money");
    } finally {
      setAddingMoney(false);
    }
  };

  const getTransactionTypeColor = (type) => {
    switch (type) {
      case 'ADD_MONEY':
        return 'text-green-400';
      case 'FACILITY_USAGE':
        return 'text-red-400';
      case 'MEMBERSHIP_REFUND':
        return 'text-blue-400';
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
    <div className="min-h-screen bg-black text-white px-5 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Wallet</h1>
            <p className="text-zinc-300 mt-2">
              Manage your wallet balance and view transaction history
            </p>
          </div>
          <Link
            to="/dashboard"
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

        {/* Wallet Balance Card */}
        <div className="bg-gradient-to-r from-lime-500/20 to-green-500/20 border border-lime-500/30 rounded-xl p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg text-zinc-300 mb-2">Current Balance</h2>
              <div className="text-4xl font-bold text-lime-400">
                ₹{wallet?.balance?.toFixed(2) || '0.00'}
              </div>
            </div>
            <div className="text-6xl">💳</div>
          </div>
          <div className="mt-6">
            <button
              onClick={() => setShowAddMoney(true)}
              className="px-6 py-3 rounded-xl bg-lime-400 text-black font-semibold hover:bg-lime-300 transition"
            >
              Add Money
            </button>
          </div>
        </div>

        {/* Add Money Modal */}
        {showAddMoney && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-zinc-900 border border-white/10 rounded-xl p-6 w-full max-w-md mx-4">
              <h3 className="text-xl font-bold mb-4">Add Money to Wallet</h3>
              <form onSubmit={handleAddMoney}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Amount (₹)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    value={addMoneyAmount}
                    onChange={(e) => setAddMoneyAmount(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-400 focus:outline-none focus:border-lime-400"
                    placeholder="Enter amount"
                    required
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddMoney(false);
                      setAddMoneyAmount("");
                      setError("");
                    }}
                    className="flex-1 px-4 py-3 rounded-xl bg-zinc-700 text-white font-semibold hover:bg-zinc-600 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={addingMoney}
                    className="flex-1 px-4 py-3 rounded-xl bg-lime-400 text-black font-semibold hover:bg-lime-300 transition disabled:opacity-50"
                  >
                    {addingMoney ? "Adding..." : "Add Money"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Transaction History */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h3 className="text-xl font-bold mb-6">Transaction History</h3>
          
          {transactions.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">📝</div>
              <p className="text-zinc-400">No transactions yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-2xl">
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div>
                      <div className="font-medium">
                        {transaction.description}
                      </div>
                      <div className="text-sm text-zinc-400">
                        {new Date(transaction.createdAt).toLocaleString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </div>
                      {transaction.gymName && (
                        <div className="text-xs text-zinc-500">
                          {transaction.gymName}
                          {transaction.facilityName && ` - ${transaction.facilityName}`}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold ${getTransactionTypeColor(transaction.type)}`}>
                      {transaction.amount >= 0 ? '+' : ''}₹{transaction.amount.toFixed(2)}
                    </div>
                    <div className="text-sm text-zinc-400">
                      Balance: ₹{transaction.balanceAfter.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <Link to="/dashboard" className="underline text-zinc-200 hover:text-white">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}