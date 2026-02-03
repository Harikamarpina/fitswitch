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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-zinc-900 border border-white/10 rounded-xl p-6 w-full max-w-md mx-4">
        <h3 className="text-xl font-bold mb-4">Request Unsubscribe</h3>
        
        <div className="mb-6">
          <div className="bg-red-500/10 border border-red-500/30 text-red-200 p-4 rounded-lg mb-4">
            <p className="text-sm">
              <strong>Warning:</strong> Unsubscribing requires owner approval. 
              Refunds are calculated in full months only.
            </p>
          </div>
          
          <div className="bg-white/5 p-4 rounded-lg mb-4">
            <h4 className="font-semibold mb-2">Membership Details</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-400">Gym:</span>
                <span>{membership.gymName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Plan:</span>
                <span>{membership.planName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Paid Amount:</span>
                <span>₹{membership.price}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Estimated Refund:</span>
                <span className="text-green-400">₹{calculateEstimatedRefund().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-200 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Reason for Unsubscribing (optional)
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-400 focus:outline-none focus:border-lime-400"
              placeholder="Please share why you want to unsubscribe..."
              rows="3"
            />
          </div>
          
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                onClose();
                setReason("");
                setError("");
              }}
              className="flex-1 px-4 py-3 rounded-xl bg-zinc-700 text-white font-semibold hover:bg-zinc-600 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-400 transition disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Request Unsubscribe"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}