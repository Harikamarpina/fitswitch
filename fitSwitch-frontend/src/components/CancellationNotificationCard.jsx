import { useState } from "react";

export default function CancellationNotificationCard({ request, onDismiss }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusConfig = (status) => {
    switch (status) {
      case 'APPROVED':
        return {
          color: 'text-lime-400 bg-lime-400/10 border-lime-400/20',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          title: 'Cancellation Approved',
          message: `Your cancellation request for ${request.gymName} has been approved.`
        };
      case 'REJECTED':
        return {
          color: 'text-red-400 bg-red-400/10 border-red-400/20',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          title: 'Cancellation Rejected',
          message: `Your cancellation request for ${request.gymName} has been rejected.`
        };
      default:
        return {
          color: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          title: 'Cancellation Pending',
          message: `Your cancellation request for ${request.gymName} is being reviewed.`
        };
    }
  };

  const statusConfig = getStatusConfig(request.status);

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 hover:bg-zinc-900/60 transition-all backdrop-blur-sm">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${statusConfig.color}`}>
            {statusConfig.icon}
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{statusConfig.title}</h3>
            <p className="text-sm text-zinc-400">{statusConfig.message}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full border ${statusConfig.color}`}>
            {request.status}
          </span>
          <button
            onClick={onDismiss}
            className="p-1 text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex justify-between items-center text-sm">
          <span className="text-zinc-500">Plan</span>
          <span className="text-zinc-300 font-medium">{request.planName}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-zinc-500">Requested</span>
          <span className="text-zinc-300 font-medium">
            {new Date(request.requestDate).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric"
            })}
          </span>
        </div>
        {request.status !== 'PENDING' && request.approvalDate && (
          <div className="flex justify-between items-center text-sm">
            <span className="text-zinc-500">Processed</span>
            <span className="text-zinc-300 font-medium">
              {new Date(request.approvalDate).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric"
              })}
            </span>
          </div>
        )}
        {request.status === 'APPROVED' && request.refundAmount && (
          <div className="flex justify-between items-center text-sm pt-2 border-t border-zinc-800/50">
            <span className="text-zinc-500">Refund Amount</span>
            <span className="text-lime-400 font-bold">₹{request.refundAmount.toFixed(2)}</span>
          </div>
        )}
      </div>

      {request.ownerNotes && (
        <div className="mt-4">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 text-xs font-medium text-zinc-500 hover:text-zinc-300 transition-colors mb-2"
          >
            <span>Owner's Response</span>
            <svg 
              className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {isExpanded && (
            <div className="bg-zinc-950/50 text-zinc-300 text-sm px-4 py-3 rounded-xl border border-zinc-800/50">
              {request.ownerNotes}
            </div>
          )}
        </div>
      )}
    </div>
  );
}