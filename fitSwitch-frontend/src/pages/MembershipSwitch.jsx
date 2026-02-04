import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { getPublicGyms } from "../api/publicGymApi";
import { switchMembership } from "../api/walletApi";

export default function MembershipSwitch() {
  const [memberships, setMemberships] = useState([]);
  const [gyms, setGyms] = useState([]);
  const [selectedMembership, setSelectedMembership] = useState(null);
  const [selectedGym, setSelectedGym] = useState(null);
  const [gymPlans, setGymPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [switching, setSwitching] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [membershipsRes, gymsRes] = await Promise.all([
        axiosInstance.get("/user/memberships"),
        getPublicGyms()
      ]);
      
      // Filter only active memberships
      const activeMemberships = membershipsRes.data.filter(m => m.status === 'ACTIVE');
      setMemberships(activeMemberships);
      setGyms(gymsRes);
    } catch (err) {
      setError(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleGymSelect = async (gym) => {
    setSelectedGym(gym);
    setSelectedPlan(null);
    try {
      const response = await axiosInstance.get(`/public/gyms/${gym.id}/plans`);
      setGymPlans(response.data);
    } catch (err) {
      setError("Failed to load gym plans");
    }
  };

  const handleSwitch = async () => {
    if (!selectedMembership || !selectedGym || !selectedPlan) {
      setError("Please select membership, gym, and plan");
      return;
    }

    try {
      setSwitching(true);
      setError("");
      setSuccess("");

      await switchMembership(selectedMembership.id, selectedGym.id, selectedPlan.id);
      setSuccess("Membership switched successfully! Redirecting to dashboard...");
      
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (err) {
      setError(err.message || "Failed to switch membership");
    } finally {
      setSwitching(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-400 mx-auto mb-4"></div>
          <p className="text-zinc-300">Loading membership data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">Switch Membership</h1>
            <p className="text-zinc-400 mt-2 text-lg">
              Seamlessly transition between gyms while preserving your investment.
            </p>
          </div>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors font-medium bg-zinc-900 border border-zinc-800 px-6 py-3 rounded-2xl"
          >
            <span>←</span> Dashboard
          </Link>
        </div>

        {error && (
          <div className="mb-8 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl flex items-center gap-3">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            {error}
          </div>
        )}

        {success && (
          <div className="mb-8 bg-lime-500/10 border border-lime-500/20 text-lime-400 p-4 rounded-2xl flex items-center gap-3">
            <span className="w-2 h-2 bg-lime-500 rounded-full"></span>
            {success}
          </div>
        )}

        {memberships.filter(m => (m.passType || 'REGULAR') === 'HYBRID').length === 0 ? (
          <div className="text-center py-20 bg-zinc-900/30 border border-zinc-800 rounded-[2.5rem] max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl">🔒</div>
            <h3 className="text-3xl font-black mb-4">No Switchable Plans</h3>
            <p className="text-zinc-400 mb-10 px-12 leading-relaxed">
              Only <span className="text-purple-400 font-bold uppercase tracking-widest">Hybrid Pass</span> holders can utilize the switch feature. Regular memberships are gym-specific.
            </p>
            <Link
              to="/dashboard"
              className="inline-block px-10 py-4 rounded-2xl bg-lime-500 text-black font-black hover:bg-lime-400 transition-all shadow-xl shadow-lime-500/10"
            >
              GO TO DASHBOARD
            </Link>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Step 1: Select Current Membership */}
            <section>
              <div className="flex items-center gap-4 mb-8">
                <span className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center font-black text-lime-400 border border-zinc-700">1</span>
                <h3 className="text-2xl font-black uppercase tracking-tight">Current Membership</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {memberships.filter(m => (m.passType || 'REGULAR') === 'HYBRID').map((membership) => (
                  <div
                    key={membership.id}
                    onClick={() => setSelectedMembership(membership)}
                    className={`group relative p-8 rounded-[2rem] border transition-all duration-300 cursor-pointer ${
                      selectedMembership?.id === membership.id
                        ? 'border-lime-500 bg-lime-500/5 shadow-2xl shadow-lime-500/5'
                        : 'border-zinc-800 bg-zinc-900/40 hover:border-zinc-600'
                    }`}
                  >
                    <h4 className="font-black text-2xl mb-2 group-hover:text-lime-400 transition-colors">{membership.gymName}</h4>
                    <p className="text-zinc-500 font-bold text-sm mb-6 uppercase tracking-tighter">{membership.planName}</p>
                    
                    <div className="flex flex-col gap-4">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-zinc-500 uppercase tracking-widest">Pass Type</span>
                        <span className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-lg font-black border border-purple-500/20 uppercase tracking-widest">
                          {membership.passType || 'REGULAR'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-zinc-500 uppercase tracking-widest">Expires</span>
                        <span className="text-zinc-300 font-bold">
                          {new Date(membership.endDate).toLocaleDateString("en-IN", { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                    {selectedMembership?.id === membership.id && (
                      <div className="absolute -top-3 -right-3 w-8 h-8 bg-lime-500 rounded-full flex items-center justify-center shadow-lg shadow-lime-500/20">
                        <span className="text-black font-black">✓</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Step 2: Select New Gym */}
            {selectedMembership && (
              <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-4 mb-8">
                  <span className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center font-black text-lime-400 border border-zinc-700">2</span>
                  <h3 className="text-2xl font-black uppercase tracking-tight">Target Gym</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {gyms.map((gym) => (
                    <div
                      key={gym.id}
                      onClick={() => handleGymSelect(gym)}
                      className={`group p-6 rounded-3xl border transition-all duration-300 cursor-pointer ${
                        selectedGym?.id === gym.id
                          ? 'border-lime-500 bg-lime-500/5 shadow-xl shadow-lime-500/5'
                          : 'border-zinc-800 bg-zinc-900/40 hover:border-zinc-600'
                      }`}
                    >
                      <h4 className="font-bold text-lg mb-2 group-hover:text-lime-400 transition-colors">{gym.gymName}</h4>
                      <p className="text-zinc-500 text-xs font-medium leading-relaxed mb-4">{gym.address}</p>
                      <div className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">
                        {gym.city}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Step 3: Select New Plan */}
            {selectedGym && (
              <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-4 mb-8">
                  <span className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center font-black text-lime-400 border border-zinc-700">3</span>
                  <h3 className="text-2xl font-black uppercase tracking-tight">New Strategy</h3>
                </div>
                {gymPlans.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {gymPlans.map((plan) => (
                      <div
                        key={plan.id}
                        onClick={() => setSelectedPlan(plan)}
                        className={`group p-8 rounded-[2rem] border transition-all duration-300 cursor-pointer ${
                          selectedPlan?.id === plan.id
                            ? 'border-lime-500 bg-lime-500/5 shadow-xl shadow-lime-500/5'
                            : 'border-zinc-800 bg-zinc-900/40 hover:border-zinc-600'
                        }`}
                      >
                        <h4 className="font-black text-2xl mb-2 group-hover:text-lime-400 transition-colors">{plan.planName}</h4>
                        <p className="text-zinc-500 text-sm font-medium mb-8 leading-relaxed">{plan.description}</p>
                        
                        <div className="mt-auto">
                          <div className="text-3xl font-black text-white">₹{plan.price}</div>
                          <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mt-1">{plan.durationDays} Days Duration</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center bg-zinc-900/20 border border-zinc-800 border-dashed rounded-3xl">
                    <p className="text-zinc-500 font-medium">No active plans found for this gym.</p>
                  </div>
                )}
              </section>
            )}

            {/* Confirmation & Action */}
            {selectedMembership && selectedGym && selectedPlan && (
              <section className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-10 mt-16 animate-in zoom-in-95 duration-500">
                <div className="flex flex-col md:flex-row gap-12 items-center">
                  <div className="flex-1 space-y-6">
                    <h3 className="text-3xl font-black uppercase tracking-tighter">Confirmation</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between py-4 border-b border-zinc-800">
                        <span className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Origin</span>
                        <span className="font-black text-zinc-300">{selectedMembership.gymName}</span>
                      </div>
                      <div className="flex items-center justify-between py-4 border-b border-zinc-800">
                        <span className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Destination</span>
                        <span className="font-black text-lime-400">{selectedGym.gymName}</span>
                      </div>
                      <div className="flex items-center justify-between py-4">
                        <span className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Target Plan</span>
                        <span className="font-black text-white">{selectedPlan.planName} (₹{selectedPlan.price})</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-full md:w-96">
                    <div className="bg-zinc-800/50 p-6 rounded-3xl mb-8">
                      <div className="flex gap-4 mb-4">
                        <span className="text-xl">ℹ️</span>
                        <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                          <strong>Note:</strong> Pro-rated calculations will apply. Your remaining balance will be credited/debited from your wallet accordingly.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleSwitch}
                      disabled={switching}
                      className="w-full py-5 rounded-2xl bg-lime-500 text-black font-black hover:bg-lime-400 transition-all shadow-2xl shadow-lime-500/20 disabled:opacity-50"
                    >
                      {switching ? "INITIATING SWITCH..." : "CONFIRM & SWITCH"}
                    </button>
                  </div>
                </div>
              </section>
            )}
          </div>
        )}

        <div className="mt-20"></div>
      </div>
    </div>
  );
}
