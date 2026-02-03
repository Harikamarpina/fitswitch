import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getWalletBalance, digitalCardCheckIn } from "../api/walletApi";
import { getPublicGyms } from "../api/publicGymApi";

export default function DigitalCard() {
  const [wallet, setWallet] = useState(null);
  const [gyms, setGyms] = useState([]);
  const [selectedGym, setSelectedGym] = useState(null);
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [walletRes, gymsRes] = await Promise.all([
        getWalletBalance(),
        getPublicGyms()
      ]);
      setWallet(walletRes);
      setGyms(gymsRes);
    } catch (err) {
      setError(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleGymSelect = async (gym) => {
    setSelectedGym(gym);
    try {
      // Fetch facilities for selected gym
      const response = await fetch(`/api/public/gyms/${gym.id}/facilities`);
      const facilitiesData = await response.json();
      setFacilities(facilitiesData);
    } catch (err) {
      setError("Failed to load gym facilities");
    }
  };

  const handleFacilityAccess = async (facilityId) => {
    if (!selectedGym || !facilityId) return;

    // Check wallet balance
    if (!wallet || wallet.balance < 50) {
      setError("Insufficient wallet balance. Please add money to your wallet first.");
      return;
    }

    try {
      setProcessing(true);
      setError("");
      setSuccess("");

      await digitalCardCheckIn(selectedGym.id, facilityId);
      setSuccess("Digital card access granted! You can now use the facility.");
      
      // Refresh wallet balance
      const updatedWallet = await getWalletBalance();
      setWallet(updatedWallet);
    } catch (err) {
      setError(err.message || "Failed to access facility");
    } finally {
      setProcessing(false);
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
    <div className="min-h-screen bg-black text-white px-5 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Digital Fitness Card</h1>
            <p className="text-zinc-300 mt-2">
              Access any facility at any gym with pay-per-use
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/wallet"
              className="px-4 py-2 rounded-xl bg-lime-400 text-black font-semibold hover:bg-lime-300 transition"
            >
              My Wallet
            </Link>
            <Link
              to="/dashboard"
              className="px-4 py-2 rounded-xl bg-zinc-700 text-white font-semibold hover:bg-zinc-600 transition"
            >
              Dashboard
            </Link>
          </div>
        </div>

        {/* Wallet Balance */}
        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg text-zinc-300 mb-2">Wallet Balance</h2>
              <div className="text-2xl font-bold text-purple-400">
                ₹{wallet?.balance?.toFixed(2) || '0.00'}
              </div>
            </div>
            <div className="text-4xl">💳</div>
          </div>
          <div className="mt-4 text-sm text-zinc-400">
            Facility usage cost: ₹50.00 per session
          </div>
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

        {/* Gym Selection */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8">
          <h3 className="text-xl font-bold mb-6">Select a Gym</h3>
          
          {gyms.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">🏋️</div>
              <p className="text-zinc-400">No gyms available</p>
            </div>
          ) : (
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
          )}
        </div>

        {/* Facility Selection */}
        {selectedGym && (
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-6">
              Select Facility at {selectedGym.gymName}
            </h3>
            
            {facilities.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">🏃</div>
                <p className="text-zinc-400">No facilities available at this gym</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {facilities.map((facility) => (
                  <div
                    key={facility.id}
                    className="p-4 border border-white/10 bg-white/5 rounded-lg"
                  >
                    <h4 className="font-semibold text-lg mb-2">{facility.facilityName}</h4>
                    <p className="text-zinc-400 text-sm mb-4">{facility.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="text-lime-400 font-bold">₹50.00</div>
                      <button
                        onClick={() => handleFacilityAccess(facility.id)}
                        disabled={processing || !wallet || wallet.balance < 50}
                        className="px-4 py-2 rounded-lg bg-lime-400 text-black font-semibold hover:bg-lime-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {processing ? "Processing..." : "Access Now"}
                      </button>
                    </div>
                  </div>
                ))}
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