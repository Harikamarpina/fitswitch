import { useState } from "react";
import { createUnsubscribeRequest } from "../api/unsubscribeApi";

export default function UnsubscribeModal({ membership, isOpen, onClose, onSuccess }) {
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError("");
      await createUnsubscribeRequest(membership.id, reason);
      onSuccess("Unsubscribe request submitted successfully. Awaiting owner approval.");
      onClose();
      setReason("");
    } catch (err) {
      setError(err.message || "Failed to submit unsubscribe request");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  // Calculate estimated refund (simplified calculation for display)
  const calculateEstimatedRefund = () => {
    const today = new Date();
    const endDate = new Date(membership.endDate);
    const startDate = new Date(membership.startDate);
    
    const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    const usedDays = Math.ceil((today - startDate) / (1000 * 60 * 60 * 24));
    const remainingDays = Math.max(0, totalDays - usedDays);
    
    const dailyRate = membership.price / totalDays;
    const estimatedRefund = dailyRate * remainingDays;
    
    return Math.max(0, estimatedRefund);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-6">
      <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-10 w-full max-w-lg shadow-2xl relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500/50 to-transparent"></div>
        
        <div className="mb-8">
          <h3 className="text-3xl font-black tracking-tight text-white">Membership <span className="text-red-500">Cancellation</span></h3>
          <p className="text-zinc-500 mt-2 font-medium">Please review the refund policy before proceeding.</p>
        </div>
        
        <div className="mb-8 space-y-6">
          <div className="bg-red-500/5 border border-red-500/20 text-red-400 p-6 rounded-3xl flex items-start gap-4">
            <svg className="w-6 h-6 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p className="text-sm font-bold uppercase tracking-wider mb-1">Owner Approval Required</p>
              <p className="text-xs leading-relaxed opacity-80">
                Your request will be sent to the gym owner. Refunds are pro-rated and processed back to your original payment method upon approval.
              </p>
            </div>
          </div>
          
          <div className="bg-black/40 border border-zinc-800 p-8 rounded-[2rem] space-y-4">
            <div className="flex justify-between items-center group">
              <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Selected Plan</span>
              <span className="text-sm font-bold text-zinc-200 group-hover:text-white transition-colors">{membership.gymName} • {membership.planName}</span>
            </div>
            
            <div className="flex justify-between items-center group pt-4 border-t border-zinc-800/50">
              <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Original Amount</span>
              <span className="text-sm font-bold text-zinc-400 italic">₹{membership.price}</span>
            </div>
            
            <div className="flex justify-between items-center pt-4 border-t border-zinc-800/50">
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Est. Refund</span>
              <span className="text-2xl font-black text-lime-400">₹{calculateEstimatedRefund().toFixed(2)}</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-2xl text-sm font-medium animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-2">
              REASON FOR LEAVING
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-6 py-4 rounded-2xl bg-black border border-zinc-800 text-white placeholder-zinc-700 focus:outline-none focus:border-red-500/50 transition-all resize-none"
              placeholder="Tell us how we can improve..."
              rows="3"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="button"
              onClick={() => {
                onClose();
                setReason("");
                setError("");
              }}
              className="flex-1 h-14 rounded-2xl bg-zinc-800 text-zinc-400 font-bold hover:bg-zinc-700 hover:text-white transition-all active:scale-[0.98]"
            >
              Go Back
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 h-14 rounded-2xl bg-red-500 text-white font-black hover:bg-red-600 shadow-xl shadow-red-500/10 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {submitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
              ) : "Confirm Cancellation"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}