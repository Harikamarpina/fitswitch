import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { getWalletBalance, addMoney } from "../api/walletApi";

export default function PurchaseFacilityPlan() {
  const navigate = useNavigate();
  const [planData, setPlanData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [walletBalance, setWalletBalance] = useState(null);
  const [walletLoading, setWalletLoading] = useState(false);
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [addMoneyAmount, setAddMoneyAmount] = useState("");
  const [addingMoney, setAddingMoney] = useState(false);
  const [topUpSuccess, setTopUpSuccess] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const selectedPlan = localStorage.getItem('selectedFacilityPlan');
    if (!selectedPlan) {
      navigate('/gyms');
      return;
    }
    
    try {
      const parsed = JSON.parse(selectedPlan);
      setPlanData(parsed);
      fetchWalletBalance();
    } catch (err) {
      navigate('/gyms');
    }
  }, [navigate]);

  useEffect(() => {
    if (!topUpSuccess) return;
    const timer = setTimeout(() => setTopUpSuccess(""), 4000);
    return () => clearTimeout(timer);
  }, [topUpSuccess]);

  const fetchWalletBalance = async () => {
    try {
      setWalletLoading(true);
      const wallet = await getWalletBalance();
      setWalletBalance(wallet?.balance ?? 0);
    } catch (err) {
      setWalletBalance(null);
    } finally {
      setWalletLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!planData) return;
    
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Subscribe to facility plan
      await axiosInstance.post('/user/facility/subscribe', {
        facilityPlanId: planData.facilityPlanId
      });
      
      // Record the transaction for earnings tracking
      try {
        await axiosInstance.post('/api/owner/earnings/record', {
          type: 'FACILITY_PURCHASE',
          amount: planData.price,
          description: `Facility Plan: ${planData.planName} - ${planData.facilityName}`,
          gymId: planData.gymId,
          facilityId: planData.facilityId,
          planId: planData.facilityPlanId
        });
      } catch (earningsErr) {
        console.warn('Failed to record earnings, but subscription successful:', earningsErr);
      }
      
      setSuccess("Successfully subscribed to facility plan! Enjoy your sessions.");
      localStorage.removeItem('selectedFacilityPlan');
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate('/user/dashboard');
      }, 2000);
      
    } catch (err) {
      const errorMessage = err?.response?.data?.message || "Failed to subscribe to facility plan. Please try again.";
      
      // Handle duplicate subscription error
      if (errorMessage.includes("already have") || errorMessage.includes("duplicate") || errorMessage.includes("existing")) {
        setError("You already have this facility plan. Check your dashboard to view your active subscriptions.");
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddMoney = async (e) => {
    e.preventDefault();
    if (!addMoneyAmount || Number(addMoneyAmount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    try {
      setAddingMoney(true);
      setError("");
      setTopUpSuccess("");
      await addMoney(Number(addMoneyAmount));
      setAddMoneyAmount("");
      setShowAddMoney(false);
      await fetchWalletBalance();
      setTopUpSuccess("Wallet topped up successfully.");
    } catch (err) {
      setError(err?.message || "Failed to add money");
    } finally {
      setAddingMoney(false);
    }
  };

  if (!planData) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  const isInsufficientBalance =
    walletBalance !== null &&
    Number(walletBalance) < Number(planData.price || 0);

  return (
    <div className="min-h-screen bg-black text-white px-4 py-12">
      <div className="max-w-xl mx-auto">
        {/* Header Section */}
        <div className="mb-10 text-center">
          <div className="w-20 h-20 bg-purple-500/10 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-purple-500/20 shadow-[0_0_30px_rgba(168,85,247,0.05)]">
            <svg className="w-10 h-10 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Facility <span className="text-purple-400">Checkout</span></h1>
          <p className="text-zinc-500 mt-2">Activate your specialized service access.</p>
        </div>

        {error && (
          <div className="mb-8 bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-2xl flex items-center gap-3">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-8 bg-lime-400/10 border border-lime-400/20 text-lime-400 px-6 py-4 rounded-2xl flex items-center gap-3 animate-pulse">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm font-bold tracking-wide">{success}</span>
          </div>
        )}

        {topUpSuccess && (
          <div className="mb-8 bg-lime-400/10 border border-lime-400/20 text-lime-400 px-6 py-4 rounded-2xl flex items-center gap-3">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm font-bold tracking-wide">{topUpSuccess}</span>
          </div>
        )}

        <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-[2.5rem] overflow-hidden shadow-2xl">
          <div className="p-10">
            <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-8 border-b border-zinc-800 pb-4">Plan Details</div>
            
            <div className="space-y-6">
              <div className="flex justify-between items-start group">
                <div className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Facility</div>
                <div className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors text-right max-w-[200px]">{planData.facilityName}</div>
              </div>

              <div className="flex justify-between items-start group pt-6 border-t border-zinc-800/50">
                <div className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Gym Location</div>
                <div className="text-lg font-bold text-zinc-300 text-right max-w-[200px]">{planData.gymName}</div>
              </div>
              
              <div className="flex justify-between items-start group pt-6 border-t border-zinc-800/50">
                <div className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Tier</div>
                <div className="text-lg font-bold text-white group-hover:text-lime-400 transition-colors text-right">{planData.planName}</div>
              </div>
              
              <div className="flex justify-between items-center group pt-6 border-t border-zinc-800/50">
                <div className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Duration</div>
                <div className="text-lg font-bold text-white">{planData.durationDays} <span className="text-zinc-500 font-medium">Days</span></div>
              </div>

              <div className="flex justify-between items-center pt-6 border-t border-zinc-800/50">
                <div className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Wallet Balance</div>
                <div className="text-lg font-bold text-white">
                  {walletLoading ? "Loading..." : `â‚¹${walletBalance?.toFixed?.(0) ?? "0"}`}
                </div>
              </div>
              
              <div className="bg-zinc-800/30 -mx-10 mt-8 px-10 py-8 flex justify-between items-center group">
                <div className="text-sm font-black text-zinc-500 uppercase tracking-[0.2em]">Total Amount</div>
                <div className="text-4xl font-black text-purple-400">₹{planData.price}</div>
              </div>
            </div>

            <div className="mt-10">
              {isInsufficientBalance && (
                <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-2xl text-sm font-medium">
                  Insufficient wallet balance. Please add funds before confirming.
                  <div className="mt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddMoney(true)}
                      className="text-lime-400 font-bold hover:text-lime-300"
                    >
                      Top up wallet â†’
                    </button>
                  </div>
                </div>
              )}
              {success ? (
                <div className="grid gap-4">
                  <button
                    onClick={() => navigate('/user/dashboard')}
                    className="h-14 bg-lime-400 text-black font-black rounded-2xl hover:bg-lime-300 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group shadow-[0_0_20px_rgba(163,230,53,0.15)]"
                  >
                    Go to Dashboard
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                  <button
                    onClick={() => navigate('/gyms')}
                    className="h-14 bg-zinc-800 text-white font-bold rounded-2xl hover:bg-zinc-700 active:scale-[0.98] transition-all flex items-center justify-center"
                  >
                    Continue Browsing
                  </button>
                </div>
              ) : (
                <button
                  onClick={handlePurchase}
                  disabled={loading || walletLoading || isInsufficientBalance}
                  className="w-full h-16 bg-purple-500 text-white font-black text-lg rounded-2xl hover:bg-purple-600 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group shadow-[0_0_25px_rgba(168,85,247,0.2)]"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      Confirm Subscription
                      <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </button>
              )}
              
              <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                <svg className="w-4 h-4 text-purple-400/50" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                Secure 256-bit SSL Encryption
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-10 text-center">
          <Link to="/gyms" className="text-zinc-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
            </svg>
            Cancel and Return
          </Link>
        </div>

        {showAddMoney && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 w-full max-w-md shadow-2xl">
              <h3 className="text-2xl font-bold mb-2">Add Money</h3>
              <p className="text-zinc-500 text-sm mb-8">Enter the amount to add to your wallet.</p>
              <form onSubmit={handleAddMoney} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3 ml-1">
                    Amount (INR)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-bold">â‚¹</span>
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
      </div>
    </div>
  );
}
