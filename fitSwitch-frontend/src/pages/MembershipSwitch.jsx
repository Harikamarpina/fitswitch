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
    <div className="min-h-screen bg-black text-white px-5 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Switch Membership</h1>
            <p className="text-zinc-300 mt-2">
              Switch to a different gym without losing your investment
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

        {success && (
          <div className="mb-6 bg-green-500/10 border border-green-500/30 text-green-200 p-4 rounded-lg">
            {success}
          </div>
        )}

        {memberships.filter(m => (m.passType || 'REGULAR') === 'HYBRID').length === 0 ? (
          <div className="text-center py-16">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-12 max-w-md mx-auto">
              <div className="text-6xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold mb-2">No Switchable Memberships</h3>
              <p className="text-zinc-400 mb-6">
                Only HYBRID pass holders can switch gyms. Regular pass holders cannot switch.
              </p>
              <Link
                to="/dashboard"
                className="inline-block px-6 py-3 rounded-xl bg-lime-400 text-black font-semibold hover:bg-lime-300 transition"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Step 1: Select Current Membership */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="text-xl font-bold mb-6">Step 1: Select Current Membership to Switch</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {memberships.filter(m => (m.passType || 'REGULAR') === 'HYBRID').map((membership) => (
                  <div
                    key={membership.id}
                    onClick={() => setSelectedMembership(membership)}
                    className={`p-4 border rounded-lg cursor-pointer transition ${
                      selectedMembership?.id === membership.id
                        ? 'border-lime-400 bg-lime-400/10'
                        : 'border-white/10 bg-white/5 hover:border-white/20'
                    }`}
                  >
                    <h4 className="font-semibold text-lg mb-2">{membership.gymName}</h4>
                    <p className="text-zinc-400 text-sm mb-2">{membership.planName}</p>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        membership.passType === 'HYBRID' 
                          ? 'bg-purple-500/20 text-purple-400' 
                          : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {membership.passType || 'REGULAR'} PASS
                      </span>
                      {(membership.passType || 'REGULAR') === 'REGULAR' && (
                        <span className="text-xs text-red-400">(Cannot Switch)</span>
                      )}
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-500">Expires:</span>
                      <span className="text-lime-400">
                        {new Date(membership.endDate).toLocaleDateString("en-IN")}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-zinc-500">Price:</span>
                      <span className="text-green-400">₹{membership.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 2: Select New Gym */}
            {selectedMembership && (
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-6">Step 2: Select New Gym</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {gyms.map((gym) => (
                    <div
                      key={gym.id}
                      onClick={() => handleGymSelect(gym)}
                      className={`p-4 border rounded-lg cursor-pointer transition ${
                        selectedGym?.id === gym.id
                          ? 'border-lime-400 bg-lime-400/10'
                          : 'border-white/10 bg-white/5 hover:border-white/20'
                      }`}
                    >
                      <h4 className="font-semibold text-lg mb-2">{gym.gymName}</h4>
                      <p className="text-zinc-400 text-sm mb-2">{gym.address}</p>
                      <div className="text-xs text-zinc-500">
                        {gym.city} • {gym.state}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Select New Plan */}
            {selectedGym && gymPlans.length > 0 && (
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-6">Step 3: Select New Plan</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {gymPlans.map((plan) => (
                    <div
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan)}
                      className={`p-4 border rounded-lg cursor-pointer transition ${
                        selectedPlan?.id === plan.id
                          ? 'border-lime-400 bg-lime-400/10'
                          : 'border-white/10 bg-white/5 hover:border-white/20'
                      }`}
                    >
                      <h4 className="font-semibold text-lg mb-2">{plan.planName}</h4>
                      <p className="text-zinc-400 text-sm mb-3">{plan.description}</p>
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-2xl font-bold text-lime-400">₹{plan.price}</div>
                          <div className="text-xs text-zinc-500">{plan.durationDays} days</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Switch Button */}
            {selectedMembership && selectedGym && selectedPlan && (
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4">Confirm Switch</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">From:</span>
                    <span>{selectedMembership.gymName} - {selectedMembership.planName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">To:</span>
                    <span>{selectedGym.gymName} - {selectedPlan.planName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">New Plan Price:</span>
                    <span className="text-lime-400">₹{selectedPlan.price}</span>
                  </div>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-200 p-4 rounded-lg mb-6">
                  <p className="text-sm">
                    <strong>Note:</strong> Your current membership will be calculated based on usage. 
                    Any remaining balance will be credited to your wallet, and additional payment 
                    (if needed) will be debited from your wallet.
                  </p>
                </div>
                <button
                  onClick={handleSwitch}
                  disabled={switching}
                  className="w-full px-6 py-3 rounded-xl bg-lime-400 text-black font-semibold hover:bg-lime-300 transition disabled:opacity-50"
                >
                  {switching ? "Switching Membership..." : "Switch Membership"}
                </button>
              </div>
            )}
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