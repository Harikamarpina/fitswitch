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
        return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
      case 'APPROVED':
        return 'text-green-400 bg-green-400/10 border-green-400/30';
      case 'REJECTED':
        return 'text-red-400 bg-red-400/10 border-red-400/30';
      default:
        return 'text-zinc-400 bg-zinc-400/10 border-zinc-400/30';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-400 mx-auto mb-4"></div>
          <p className="text-zinc-300">Loading unsubscribe requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-5 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Unsubscribe Requests</h1>
            <p className="text-zinc-300 mt-2">
              Manage member unsubscribe requests and refunds
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

        {requests.length === 0 ? (
          <div className="text-center py-16">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-12 max-w-md mx-auto">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-xl font-semibold mb-2">No Unsubscribe Requests</h3>
              <p className="text-zinc-400">
                No members have requested to unsubscribe yet.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <div
                key={request.id}
                className="bg-white/5 border border-white/10 rounded-xl p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold">{request.userName}</h3>
                    <p className="text-zinc-400">{request.userEmail}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm border ${getStatusColor(request.status)}`}>
                    {request.status}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="font-semibold mb-3">Membership Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Gym:</span>
                        <span>{request.gymName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Plan:</span>
                        <span>{request.planName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Request Date:</span>
                        <span>{new Date(request.requestDate).toLocaleDateString("en-IN")}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Refund Calculation</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Used Months:</span>
                        <span>{request.usedMonths} / {request.totalMonths}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Refund Amount:</span>
                        <span className="text-green-400 font-bold">₹{request.refundAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {request.reason && (
                  <div className="mb-6">
                    <h4 className="font-semibold mb-2">Reason</h4>
                    <p className="text-zinc-300 text-sm bg-white/5 p-3 rounded-lg">
                      {request.reason}
                    </p>
                  </div>
                )}

                {request.ownerNotes && (
                  <div className="mb-6">
                    <h4 className="font-semibold mb-2">Owner Notes</h4>
                    <p className="text-zinc-300 text-sm bg-white/5 p-3 rounded-lg">
                      {request.ownerNotes}
                    </p>
                  </div>
                )}

                {request.status === 'PENDING' && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => openActionModal(request, 'approve')}
                      disabled={processing[request.id]}
                      className="px-4 py-2 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-400 transition disabled:opacity-50"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => openActionModal(request, 'reject')}
                      disabled={processing[request.id]}
                      className="px-4 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-400 transition disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </div>
                )}

                {request.status !== 'PENDING' && request.approvalDate && (
                  <div className="text-sm text-zinc-400">
                    {request.status === 'APPROVED' ? 'Approved' : 'Rejected'} on{' '}
                    {new Date(request.approvalDate).toLocaleDateString("en-IN")}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Action Modal */}
        {selectedRequest && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-zinc-900 border border-white/10 rounded-xl p-6 w-full max-w-md mx-4">
              <h3 className="text-xl font-bold mb-4">
                {actionType === 'approve' ? 'Approve' : 'Reject'} Unsubscribe Request
              </h3>
              <div className="mb-4">
                <p className="text-zinc-300 mb-2">
                  {actionType === 'approve' 
                    ? `Approving will refund ₹${selectedRequest.refundAmount.toFixed(2)} to the user's wallet.`
                    : 'Rejecting will keep the subscription active.'
                  }
                </p>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Notes (optional)
                </label>
                <textarea
                  value={ownerNotes}
                  onChange={(e) => setOwnerNotes(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-400 focus:outline-none focus:border-lime-400"
                  placeholder="Add notes for the user..."
                  rows="3"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setSelectedRequest(null);
                    setOwnerNotes("");
                  }}
                  className="flex-1 px-4 py-3 rounded-xl bg-zinc-700 text-white font-semibold hover:bg-zinc-600 transition"
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
                  className={`flex-1 px-4 py-3 rounded-xl font-semibold transition disabled:opacity-50 ${
                    actionType === 'approve'
                      ? 'bg-green-500 text-white hover:bg-green-400'
                      : 'bg-red-500 text-white hover:bg-red-400'
                  }`}
                >
                  {processing[selectedRequest.id] ? "Processing..." : 
                   actionType === 'approve' ? "Approve" : "Reject"}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link to="/dashboard" className="underline text-zinc-200 hover:text-white">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}