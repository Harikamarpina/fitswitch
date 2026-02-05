import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { getDashboardRoute } from "../utils/navigation";
import { getPublicGyms, getGymFacilities } from "../api/publicGymApi";
import { useFacility } from "../api/walletApi";

export default function DigitalCard() {
  const navigate = useNavigate();
  const [cardData, setCardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showUseCard, setShowUseCard] = useState(false);
  const [gyms, setGyms] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [selectedGymId, setSelectedGymId] = useState("");
  const [selectedFacilityId, setSelectedFacilityId] = useState("");
  const [useCardLoading, setUseCardLoading] = useState(false);
  const [useCardMessage, setUseCardMessage] = useState("");
  const [useCardError, setUseCardError] = useState("");

  useEffect(() => {
    fetchCardData();
  }, []);

  const fetchCardData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/api/digital-card/data');
      setCardData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load digital card data");
    } finally {
      setLoading(false);
    }
  };

  const openUseCard = async () => {
    setShowUseCard(true);
    setUseCardMessage("");
    setUseCardError("");
    setSelectedGymId("");
    setSelectedFacilityId("");
    setFacilities([]);
    try {
      const res = await getPublicGyms();
      setGyms(res.data || []);
    } catch (err) {
      setUseCardError("Failed to load gyms");
    }
  };

  const handleGymChange = async (gymId) => {
    setSelectedGymId(gymId);
    setSelectedFacilityId("");
    setFacilities([]);
    if (!gymId) return;

    try {
      const res = await getGymFacilities(gymId);
      setFacilities(res.data || []);
    } catch (err) {
      setUseCardError("Failed to load facilities");
    }
  };

  const handleUseCard = async (e) => {
    e.preventDefault();
    setUseCardMessage("");
    setUseCardError("");

    if (!selectedGymId || !selectedFacilityId) {
      setUseCardError("Please select a gym and a facility.");
      return;
    }

    try {
      setUseCardLoading(true);
      const response = await useFacility(parseInt(selectedGymId, 10), parseInt(selectedFacilityId, 10));
      if (response?.success === false) {
        setUseCardError(response?.message || "Facility access failed.");
      } else {
        setUseCardMessage("Facility access granted. Enjoy your session!");
        fetchCardData();
        setShowUseCard(false);
        navigate("/user/dashboard");
      }
    } catch (err) {
      setUseCardError(err?.message || "Facility access failed.");
    } finally {
      setUseCardLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-400 mx-auto mb-4"></div>
          <p className="text-zinc-300">Loading digital card...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2" />

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <Link
              to={getDashboardRoute()}
              className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-white transition-colors mb-4"
            >
              <span>←</span> Back to Dashboard
            </Link>
            <h1 className="text-4xl font-bold tracking-tight">Digital Fitness Card</h1>
            <p className="text-zinc-400 mt-2 text-lg">
              Your all-access pass to the FitSwitch network.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-8 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl text-sm font-medium">
            {error}
          </div>
        )}

        {cardData && (
          <div className="space-y-8">
            {/* Digital Card */}
            <div className="relative">
              <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-[2rem] p-8 text-black relative overflow-hidden shadow-2xl shadow-cyan-500/20">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full translate-y-12 -translate-x-12"></div>
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h2 className="text-2xl font-black tracking-tight">FitSwitch</h2>
                      <p className="text-black/60 font-medium text-sm">Digital Fitness Card</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-black/60 uppercase tracking-widest">Balance</p>
                      <p className="text-xl font-black">₹{cardData.walletBalance?.toFixed(0) || '0'}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-bold text-black/60 uppercase tracking-widest mb-1">Cardholder</p>
                      <p className="text-xl font-black">{cardData.userName}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-black/60 uppercase tracking-widest mb-1">Email</p>
                      <p className="font-bold">{cardData.userEmail}</p>
                    </div>
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-black/20">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-xs font-bold text-black/60 uppercase tracking-widest">Active Access</p>
                        <p className="font-black">
                          {cardData.activeMemberships?.length || 0} Gyms • {cardData.activeSubscriptions?.length || 0} Facilities
                        </p>
                      </div>
                      <div className="w-12 h-8 bg-black/20 rounded-lg flex items-center justify-center">
                        <div className="w-6 h-4 bg-black rounded-sm"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Memberships */}
            {cardData.activeMemberships && cardData.activeMemberships.length > 0 && (
              <div>
                <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                  <span>🏋️</span> Active Gym Memberships
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {cardData.activeMemberships.map((membership) => (
                    <div key={membership.membershipId} className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6">
                      <h4 className="font-bold text-lg mb-2">{membership.gymName}</h4>
                      <p className="text-zinc-400 text-sm mb-4">{membership.planName}</p>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-zinc-500">Valid until</span>
                        <span className="font-bold text-lime-400">
                          {new Date(membership.endDate).toLocaleDateString('en-IN', {
                            day: '2-digit', month: 'short', year: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Active Facility Subscriptions */}
            {cardData.activeSubscriptions && cardData.activeSubscriptions.length > 0 && (
              <div>
                <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                  <span>🎯</span> Active Facility Access
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {cardData.activeSubscriptions.map((subscription) => (
                    <div key={subscription.subscriptionId} className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6">
                      <h4 className="font-bold text-lg mb-1">{subscription.facilityName}</h4>
                      <p className="text-zinc-500 text-sm mb-2">{subscription.gymName}</p>
                      <p className="text-zinc-400 text-sm mb-4">{subscription.planName}</p>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-zinc-500">Valid until</span>
                        <span className="font-bold text-purple-400">
                          {new Date(subscription.endDate).toLocaleDateString('en-IN', {
                            day: '2-digit', month: 'short', year: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No Active Subscriptions */}
            {(!cardData.activeMemberships || cardData.activeMemberships.length === 0) && 
             (!cardData.activeSubscriptions || cardData.activeSubscriptions.length === 0) && (
              <div className="text-center py-20 bg-zinc-900/20 border border-zinc-800/50 border-dashed rounded-3xl">
                <div className="text-6xl mb-6 opacity-20">💳</div>
                <h3 className="text-2xl font-bold mb-2">No Active Access</h3>
                <p className="text-zinc-500 mb-8 max-w-sm mx-auto">
                  Your digital card is ready! Subscribe to gym plans or facility access to activate it.
                </p>
                <Link
                  to="/gyms"
                  className="inline-block px-8 py-3.5 rounded-2xl bg-lime-500 text-black font-bold hover:bg-lime-400 transition-all active:scale-95"
                >
                  Explore Gyms
                  </Link>
                </div>
              )}

              <div className="flex justify-center">
                <button
                  onClick={openUseCard}
                  className="px-8 py-3.5 rounded-2xl bg-lime-500 text-black font-bold hover:bg-lime-400 transition-all active:scale-95"
                >
                  Use Digital Card
                </button>
              </div>
          </div>
        )}

        <div className="mt-20 pt-10 border-t border-zinc-900"></div>
      </div>

      {showUseCard && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 w-full max-w-lg shadow-2xl">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold">Use Digital Card</h3>
                <p className="text-zinc-500 text-sm">Select a gym and facility for pay-per-use access.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowUseCard(false)}
                className="text-zinc-500 hover:text-white transition-colors"
              >
                <span className="text-xl">×</span>
              </button>
            </div>

            {useCardError && (
              <div className="mb-4 bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm">
                {useCardError}
              </div>
            )}
            {useCardMessage && (
              <div className="mb-4 bg-lime-500/10 border border-lime-500/20 text-lime-400 p-3 rounded-xl text-sm font-bold">
                {useCardMessage}
              </div>
            )}

            <form onSubmit={handleUseCard} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Gym</label>
                <select
                  value={selectedGymId}
                  onChange={(e) => handleGymChange(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-black border border-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-lime-500/20 focus:border-lime-500 transition-all"
                >
                  <option value="">Select a gym</option>
                  {gyms.map((gym) => (
                    <option key={gym.id} value={gym.id}>{gym.gymName}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Facility</label>
                <select
                  value={selectedFacilityId}
                  onChange={(e) => setSelectedFacilityId(e.target.value)}
                  disabled={!selectedGymId}
                  className="w-full px-4 py-3 rounded-xl bg-black border border-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-lime-500/20 focus:border-lime-500 transition-all disabled:opacity-60"
                >
                  <option value="">Select a facility</option>
                  {facilities.map((facility) => (
                    <option key={facility.id} value={facility.id}>{facility.facilityName}</option>
                  ))}
                </select>
              </div>

                <button
                  type="submit"
                  disabled={useCardLoading}
                  className="w-full py-3.5 rounded-2xl bg-lime-500 text-black font-bold hover:bg-lime-400 transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  {useCardLoading ? "Processing..." : "Confirm Pay-Per-Use (â‚¹100)"}
                </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
