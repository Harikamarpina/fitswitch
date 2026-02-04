import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getOwnerUnsubscribeRequests, approveUnsubscribeRequest, rejectUnsubscribeRequest } from "../api/unsubscribeApi";

export default function UnsubscribeRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState({});
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [ownerNotes, setOwnerNotes] = useState("");
  const [actionType, setActionType] = useState("");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await getOwnerUnsubscribeRequests();
      setRequests(response);
    } catch (err) {
      setError(err.message || "Failed to load unsubscribe requests");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId) => {
    try {
      setProcessing(prev => ({ ...prev, [requestId]: true }));
      setError("");
      await approveUnsubscribeRequest(requestId, ownerNotes);
      await fetchRequests();
      setSelectedRequest(null);
      setOwnerNotes("");
    } catch (err) {
      setError(err.message || "Failed to approve request");
    } finally {
      setProcessing(prev => ({ ...prev, [requestId]: false }));
    }
  };

  const handleReject = async (requestId) => {
    try {
      setProcessing(prev => ({ ...prev, [requestId]: true }));
      setError("");
      await rejectUnsubscribeRequest(requestId, ownerNotes);
      await fetchRequests();
      setSelectedRequest(null);
      setOwnerNotes("");
    } catch (err) {
      setError(err.message || "Failed to reject request");
    } finally {
      setProcessing(prev => ({ ...prev, [requestId]: false }));
    }
  };

  const openActionModal = (request, action) => {
    setSelectedRequest(request);
    setActionType(action);
    setOwnerNotes("");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      case 'APPROVED':
        return 'text-lime-400 bg-lime-400/10 border-lime-400/20';
      case 'REJECTED':
        return 'text-red-400 bg-red-400/10 border-red-400/20';
      default:
        return 'text-zinc-500 bg-zinc-500/10 border-zinc-500/20';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-400 mx-auto mb-4"></div>
          <p className="text-zinc-500 font-medium tracking-wide">Loading requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-4 py-12">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Link
                to="/dashboard"
                className="p-2 bg-zinc-900 hover:bg-zinc-800 rounded-xl transition-colors text-zinc-400 hover:text-white"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <span className="text-lime-400 font-medium tracking-wider uppercase text-xs">Administrative Tasks</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Unsubscribe <span className="text-lime-400">Requests</span>
            </h1>
            <p className="text-zinc-400 mt-4 text-lg">
              Manage member cancellations and processed refund calculations.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-zinc-900/50 border border-zinc-800 p-2 rounded-2xl">
            <div className="px-6 py-3 bg-zinc-800 rounded-xl">
              <div className="text-2xl font-bold">{requests.length}</div>
              <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Total Pending</div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-8 bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-2xl flex items-center gap-3">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        {requests.length === 0 ? (
          <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-[2.5rem] py-24 text-center">
            <div className="w-20 h-20 bg-zinc-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-2 text-zinc-300">Queue is Empty</h3>
            <p className="text-zinc-500 max-w-xs mx-auto text-sm">No members have requested to cancel their subscriptions at this time.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {requests.map((request) => (
              <div
                key={request.id}
                className="group bg-zinc-900/40 border border-zinc-800/50 hover:border-zinc-700/50 transition-all rounded-[2rem] overflow-hidden"
              >
                <div className="p-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-8 border-b border-zinc-800/50">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-zinc-800 flex items-center justify-center text-2xl font-bold text-lime-400 border border-zinc-700">
                        {request.userName.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-lime-400 transition-colors">{request.userName}</h3>
                        <p className="text-zinc-500 text-sm font-medium">{request.userEmail}</p>
                      </div>
                    </div>
                    <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-bold tracking-[0.1em] uppercase border ${getStatusColor(request.status)}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${request.status === 'PENDING' ? 'bg-amber-400 animate-pulse' : request.status === 'APPROVED' ? 'bg-lime-400' : 'bg-red-400'}`}></span>
                      {request.status}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-10">
                    <div className="space-y-4">
                      <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Membership</div>
                      <div className="space-y-3">
                        <div>
                          <div className="text-xs text-zinc-400 mb-1">Facility / Gym</div>
                          <div className="text-sm font-semibold text-zinc-200">{request.gymName}</div>
                        </div>
                        <div>
                          <div className="text-xs text-zinc-400 mb-1">Plan Tier</div>
                          <div className="text-sm font-semibold text-zinc-200">{request.planName}</div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Usage Metrics</div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-end border-b border-zinc-800/50 pb-2">
                          <span className="text-xs text-zinc-500">Utilization</span>
                          <span className="text-sm font-bold text-zinc-200">{request.usedMonths} <span className="text-zinc-500 font-normal">/ {request.totalMonths} Mo</span></span>
                        </div>
                        <div className="flex justify-between items-end">
                          <span className="text-xs text-zinc-500">Requested On</span>
                          <span className="text-sm font-semibold text-zinc-200">{new Date(request.requestDate).toLocaleDateString("en-IN", { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-zinc-800/30 p-6 rounded-2xl border border-zinc-800/50 flex flex-col justify-center">
                      <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Estimated Refund</div>
                      <div className="text-3xl font-black text-lime-400">₹{request.refundAmount.toFixed(2)}</div>
                      <div className="text-[10px] text-zinc-500 font-medium mt-1 uppercase tracking-tighter italic">* Pro-rated calculation</div>
                    </div>
                  </div>

                  {request.reason && (
                    <div className="mt-8 pt-8 border-t border-zinc-800/50">
                      <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Cancellation Reason</div>
                      <div className="bg-zinc-950/50 text-zinc-300 text-sm px-5 py-4 rounded-2xl border border-zinc-800/50 italic leading-relaxed">
                        "{request.reason}"
                      </div>
                    </div>
                  )}

                  {request.ownerNotes && (
                    <div className="mt-6">
                      <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Resolution Notes</div>
                      <div className="bg-zinc-800/20 text-zinc-400 text-sm px-5 py-4 rounded-2xl border border-zinc-800/50">
                        {request.ownerNotes}
                      </div>
                    </div>
                  )}

                  {request.status === 'PENDING' && (
                    <div className="mt-10 flex flex-col sm:flex-row gap-4">
                      <button
                        onClick={() => openActionModal(request, 'approve')}
                        disabled={processing[request.id]}
                        className="flex-1 h-14 bg-lime-400 text-black font-bold rounded-2xl hover:bg-lime-300 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group/btn"
                      >
                        <svg className="w-5 h-5 group-hover/btn:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                        Approve Cancellation
                      </button>
                      <button
                        onClick={() => openActionModal(request, 'reject')}
                        disabled={processing[request.id]}
                        className="flex-1 h-14 bg-zinc-800 text-white font-bold rounded-2xl hover:bg-zinc-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Reject Request
                      </button>
                    </div>
                  )}

                  {request.status !== 'PENDING' && request.approvalDate && (
                    <div className="mt-8 pt-6 border-t border-zinc-800/50 flex items-center gap-2 text-zinc-500 text-xs font-medium uppercase tracking-wider">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Processed on {new Date(request.approvalDate).toLocaleDateString("en-IN", { day: '2-digit', month: 'long', year: 'numeric' })}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => !processing[selectedRequest.id] && setSelectedRequest(null)}></div>
          <div className="relative bg-zinc-900 border border-zinc-800 w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl">
            <div className="p-8 sm:p-10">
              <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mb-6 ${actionType === 'approve' ? 'bg-lime-400/10 text-lime-400' : 'bg-red-400/10 text-red-400'}`}>
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {actionType === 'approve' ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  )}
                </svg>
              </div>

              <h3 className="text-2xl font-bold text-white mb-2">
                {actionType === 'approve' ? 'Approve Cancellation?' : 'Reject Request?'}
              </h3>
              <p className="text-zinc-400 mb-8 leading-relaxed">
                {actionType === 'approve' 
                  ? `You are about to approve the cancellation. A refund of ₹${selectedRequest.refundAmount.toFixed(2)} will be credited back to ${selectedRequest.userName}'s wallet.`
                  : `Rejecting this request will keep the subscription active for ${selectedRequest.userName}. This action can be reversed by the user submitting a new request.`
                }
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">
                    Administrative Notes
                  </label>
                  <textarea
                    value={ownerNotes}
                    onChange={(e) => setOwnerNotes(e.target.value)}
                    className="w-full px-6 py-4 rounded-2xl bg-black border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-lime-400/50 transition-colors resize-none"
                    placeholder="Provide a reason or feedback for the user..."
                    rows="4"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    onClick={() => setSelectedRequest(null)}
                    disabled={processing[selectedRequest.id]}
                    className="flex-1 h-14 bg-zinc-800 text-white font-bold rounded-2xl hover:bg-zinc-700 transition-all disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (actionType === 'approve') {
                        handleApprove(selectedRequest.id);
                      } else {
                        handleReject(selectedRequest.id);
                      }
                    }}
                    disabled={processing[selectedRequest.id]}
                    className={`flex-[1.5] h-14 font-bold rounded-2xl transition-all flex items-center justify-center gap-2 ${
                      actionType === 'approve'
                        ? 'bg-lime-400 text-black hover:bg-lime-300 shadow-[0_0_20px_rgba(163,230,53,0.15)]'
                        : 'bg-red-500 text-white hover:bg-red-400'
                    } disabled:opacity-50`}
                  >
                    {processing[selectedRequest.id] ? (
                      <div className="w-6 h-6 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                    ) : (
                      actionType === 'approve' ? "Confirm Approval" : "Confirm Rejection"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}