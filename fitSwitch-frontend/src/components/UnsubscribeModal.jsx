import { useState, useEffect } from "react";
import { createUnsubscribeRequest, getRefundCalculation } from "../api/unsubscribeApi";

export default function UnsubscribeModal({ membership, isOpen, onClose, onSuccess }) {
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [refundCalculation, setRefundCalculation] = useState(null);
  const [loadingRefund, setLoadingRefund] = useState(false);

  useEffect(() => {
    if (isOpen && membership?.id) {
      fetchRefundCalculation();
    }
  }, [isOpen, membership?.id]);

  const fetchRefundCalculation = async () => {
    try {
      setLoadingRefund(true);
      const calculation = await getRefundCalculation(membership.id);
      setRefundCalculation(calculation);
    } catch (err) {
      console.error('Error fetching refund calculation:', err);
      setRefundCalculation({ refundAmount: 0 });
    } finally {
      setLoadingRefund(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError("");
      console.log('Submitting unsubscribe request for membership:', membership.id);
      console.log('Reason:', reason);
      
      const response = await createUnsubscribeRequest(membership.id, reason);
      console.log('Unsubscribe success:', response);
      
      onSuccess("Unsubscribe request submitted successfully. Awaiting owner approval.");
      onClose();
      setReason("");
    } catch (err) {
      console.error('Unsubscribe request error:', err);
      console.error('Error details:', err);
      
      let errorMessage = "An unexpected error occurred";
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      }
      
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const displayRefundAmount = loadingRefund ? "..." : 
    refundCalculation ? refundCalculation.refundAmount.toFixed(2) : "0.00";

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-[100] p-4 md:p-8 transition-all duration-300">
      <div className="bg-zinc-900 border border-zinc-800 rounded-[2rem] w-full max-w-4xl shadow-[0_0_80px_rgba(0,0,0,0.8)] relative overflow-hidden flex flex-col md:flex-row min-h-[500px]">
        
        {/* Check if user has REGULAR pass type */}
        {(membership.passType === 'REGULAR' || !membership.passType) ? (
          <div className="flex-1 p-10 flex flex-col items-center justify-center text-center space-y-8">
            <div className="text-6xl mb-4">🚫</div>
            <div className="space-y-4">
              <h3 className="text-3xl font-black tracking-tight text-white">
                Cancellation <span className="text-red-500">Not Available</span>
              </h3>
              <p className="text-zinc-400 text-lg max-w-md mx-auto leading-relaxed">
                Only HYBRID plan members are allowed to cancel their subscriptions. Regular plan members cannot cancel their memberships.
              </p>
            </div>
            <button
              onClick={() => {
                onClose();
                setReason("");
                setError("");
              }}
              className="px-8 py-4 rounded-xl bg-zinc-800 text-zinc-300 font-bold hover:bg-zinc-700 hover:text-white transition-all active:scale-[0.98] uppercase tracking-widest text-sm"
            >
              Go Back
            </button>
          </div>
        ) : (
          <>
            {/* Left Side: Context & Form */}
            <div className="flex-[1.5] p-6 md:p-10 space-y-10">
              <div className="space-y-4">
                <h3 className="text-2xl md:text-3xl font-black tracking-tighter text-white uppercase leading-[0.9]">
                  Membership <br />
                  <span className="text-red-500">Cancellation</span>
                </h3>
                <p className="text-zinc-500 font-medium text-sm max-w-md leading-relaxed">
                  We're sorry to see you go. Please review your refund details.
                </p>
              </div>

              <div className="space-y-8">
                <div className="bg-orange-500/5 border border-orange-500/20 p-6 rounded-[1.5rem] flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500/80">Owner Approval Required</p>
                    <p className="text-xs leading-relaxed text-zinc-400 font-medium">
                      Refunds are pro-rated based on remaining time and processed back to your original payment method once approved.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between px-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">
                      Reason for leaving
                    </label>
                    <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">Optional but helpful</span>
                  </div>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full px-6 py-4 rounded-[1.5rem] bg-black border border-zinc-800 text-white placeholder-zinc-700 focus:outline-none focus:border-red-500/30 transition-all resize-none font-medium h-32 text-sm"
                    placeholder="How can we improve your experience?"
                  />
                </div>
              </div>
            </div>

            {/* Right Side: Summary & Actions */}
            <div className="flex-1 bg-zinc-950/50 border-l border-zinc-800 p-6 md:p-10 flex flex-col justify-between">
              <div className="space-y-8">
                <div>
                  <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] mb-6">Selected Plan</h4>
                  <div className="space-y-1">
                    <p className="text-xl font-black text-white tracking-tight">{membership.gymName}</p>
                    <p className="text-lime-500 font-bold text-[10px] uppercase tracking-widest">{membership.planName}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-zinc-900">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Original Amount</span>
                    <span className="text-sm font-bold text-zinc-400">₹{membership.price}</span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-lime-500 uppercase tracking-[0.2em]">Est. Refund</span>
                      <div className="text-right">
                        <p className="text-3xl font-black text-lime-400 tracking-tighter">₹{displayRefundAmount}</p>
                      </div>
                    </div>
                    <p className="text-[9px] text-zinc-600 font-medium leading-relaxed text-right">
                      Calculated pro-rata based on remaining days.
                    </p>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-[9px] font-black uppercase tracking-widest text-center">
                    {error}
                  </div>
                )}
              </div>

              <div className="space-y-3 mt-10">
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="w-full h-12 rounded-xl bg-red-500 text-white font-black uppercase tracking-widest text-[10px] hover:bg-red-600 shadow-lg shadow-red-500/10 transition-all active:scale-[0.98] disabled:opacity-30"
                >
                  {submitting ? "Processing..." : "Confirm Cancellation"}
                </button>
                
                <button
                  onClick={() => {
                    onClose();
                    setReason("");
                    setError("");
                  }}
                  className="w-full h-12 rounded-xl bg-zinc-800 text-zinc-400 font-bold hover:bg-zinc-700 hover:text-white transition-all active:scale-[0.98] uppercase tracking-widest text-[10px]"
                >
                  Keep My Membership
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}