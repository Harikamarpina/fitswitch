import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUserUnsubscribeRequests } from "../api/unsubscribeApi";

export default function UserCancellationRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await getUserUnsubscribeRequests();
      setRequests(response.data || response || []);
    } catch (err) {
      setError(err.message || "Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      case 'APPROVED':
        return 'text-lime-400 bg-lime-400/10 border-lime-400/20';
      case 'REFUNDED':
        return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'REJECTED':
        return 'text-red-400 bg-red-400/10 border-red-400/20';
      default:
        return 'text-zinc-500 bg-zinc-500/10 border-zinc-500/20';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'REFUNDED':
        return 'COMPLETED';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-400 mx-auto mb-4"></div>
          <p className="text-zinc-500 font-medium tracking-wide">Loading your requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-4 py-12">
      <div className="max-w-4xl mx-auto">
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
              <span className="text-lime-400 font-medium tracking-wider uppercase text-xs">My Requests</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              <span className="text-lime-400">History</span>
            </h1>
            <p className="text-zinc-400 mt-4 text-lg">
              Track the status of your membership details.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-zinc-900/50 border border-zinc-800 p-2 rounded-2xl">
            <div className="px-6 py-3 bg-zinc-800 rounded-xl">
              <div className="text-2xl font-bold">{requests.length}</div>
              <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Total Requests</div>
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
            <h3 className="text-2xl font-bold mb-2 text-zinc-300">No Requests Found</h3>
            <p className="text-zinc-500 max-w-xs mx-auto text-sm">You haven't submitted any cancellation requests yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {requests.map((request) => (
              <div
                key={request.id}
                className="group bg-zinc-900/40 border border-zinc-800/50 hover:border-zinc-700/50 transition-all rounded-[2rem] overflow-hidden"
              >
                <div className="p-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6 pb-6 border-b border-zinc-800/50">
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-lime-400 transition-colors">{request.gymName}</h3>
                      <p className="text-zinc-500 text-sm font-medium mt-1">{request.planName}</p>
                      <p className="text-zinc-600 text-xs mt-2">
                        Requested on {new Date(request.requestDate).toLocaleDateString("en-IN", { 
                          day: '2-digit', month: 'long', year: 'numeric' 
                        })}
                      </p>
                    </div>
                    <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-bold tracking-[0.1em] uppercase border ${getStatusColor(request.status)}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${request.status === 'PENDING' ? 'bg-amber-400 animate-pulse' : request.status === 'APPROVED' ? 'bg-lime-400' : request.status === 'REFUNDED' ? 'bg-emerald-400' : 'bg-red-400'}`}></span>
                      {getStatusLabel(request.status)}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Usage Details</div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-end border-b border-zinc-800/50 pb-2">
                          <span className="text-xs text-zinc-500">Utilization</span>
                          <span className="text-sm font-bold text-zinc-200">{request.usedMonths} <span className="text-zinc-500 font-normal">/ {request.totalMonths} Mo</span></span>
                        </div>
                        {request.status === 'APPROVED' && request.refundAmount && (
                          <div className="flex justify-between items-end">
                            <span className="text-xs text-zinc-500">Refund Amount</span>
                            <span className="text-lg font-bold text-lime-400">INR {request.refundAmount.toFixed(2)}</span>
                          </div>
                        )}
                        {request.status === 'APPROVED' && request.refundAmount && (
                          <div className="mt-3 p-3 bg-lime-400/10 border border-lime-400/20 rounded-xl">
                            <div className="flex items-center gap-2 text-lime-400 text-xs font-medium">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>Refund approved - awaiting owner processing</span>
                            </div>
                          </div>
                        )}
                        {request.status === 'REFUNDED' && request.refundAmount && (
                          <div className="mt-3 p-3 bg-emerald-400/10 border border-emerald-400/20 rounded-xl">
                            <div className="flex items-center gap-2 text-emerald-400 text-xs font-medium">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>Refund completed and credited to your wallet</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {request.reason && (
                      <div className="space-y-4">
                        <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Your Reason</div>
                        <div className="bg-zinc-950/50 text-zinc-300 text-sm px-4 py-3 rounded-xl border border-zinc-800/50 italic leading-relaxed">
                          "{request.reason}"
                        </div>
                      </div>
                    )}
                  </div>

                  {request.ownerNotes && (
                    <div className="mt-8 pt-6 border-t border-zinc-800/50">
                      <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Owner's Response</div>
                      <div className="bg-zinc-800/20 text-zinc-400 text-sm px-5 py-4 rounded-2xl border border-zinc-800/50">
                        {request.ownerNotes}
                      </div>
                      {request.status === 'APPROVED' && request.refundAmount > 0 && (
                        <div className="mt-4 p-4 bg-gradient-to-r from-lime-400/5 to-emerald-400/5 border border-lime-400/20 rounded-2xl">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-lime-400/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <svg className="w-4 h-4 text-lime-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-lime-400 mb-1">Refund Status</div>
                              <div className="text-xs text-zinc-400 leading-relaxed">
                                Your refund of <span className="font-bold text-lime-400">INR {request.refundAmount.toFixed(2)}</span> has been approved.
                                Waiting for owner to process the refund. This may take 2-4 business days.
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      {request.status === 'REFUNDED' && request.refundAmount > 0 && (
                        <div className="mt-4 p-4 bg-gradient-to-r from-emerald-400/5 to-green-400/5 border border-emerald-400/20 rounded-2xl">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-emerald-400/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-emerald-400 mb-1">Refund Completed</div>
                              <div className="text-xs text-zinc-400 leading-relaxed">
                                Your refund of <span className="font-bold text-emerald-400">INR {request.refundAmount.toFixed(2)}</span> has been successfully credited to your wallet.
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {request.status !== 'PENDING' && request.approvalDate && (
                    <div className="mt-6 flex items-center gap-2 text-zinc-500 text-xs font-medium uppercase tracking-wider">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Processed on {new Date(request.approvalDate).toLocaleDateString("en-IN", { 
                        day: '2-digit', month: 'long', year: 'numeric' 
                      })}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-16"></div>
      </div>
    </div>
  );
}
