import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

export default function UserDashboard() {
  const [memberships, setMemberships] = useState([]);
  const [facilitySubscriptions, setFacilitySubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMemberships = async () => {
      try {
        const [membershipsRes, facilityRes] = await Promise.all([
          axiosInstance.get("/user/memberships"),
          axiosInstance.get("/user/facility/subscriptions")
        ]);
        setMemberships(membershipsRes.data || []);
        setFacilitySubscriptions(facilityRes.data || []);
      } catch (err) {
        setError("Failed to load subscriptions");
      } finally {
        setLoading(false);
      }
    };

    fetchMemberships();
  }, []);

  const getStatusBadge = (status) => {
    if (status === "ACTIVE") {
      return (
        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
          ACTIVE
        </span>
      );
    } else {
      return (
        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
          EXPIRED
        </span>
      );
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-400 mx-auto mb-4"></div>
          <p className="text-zinc-300">Loading your memberships...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-5 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Dashboard</h1>
            <p className="text-zinc-300 mt-2">
              Manage your gym memberships and track your fitness journey
            </p>
          </div>

          <Link
            to="/gyms"
            className="px-4 py-2 rounded-xl bg-lime-400 text-black font-semibold hover:bg-lime-300 transition"
          >
            Browse Gyms
          </Link>
        </div>

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-200 p-4 rounded-lg">
            {error}
          </div>
        )}

        {!loading && !error && memberships.length === 0 && facilitySubscriptions.length === 0 && (
          <div className="text-center py-16">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-12 max-w-md mx-auto">
              <div className="text-6xl mb-4">🏋️</div>
              <h3 className="text-xl font-semibold mb-2">No subscriptions found</h3>
              <p className="text-zinc-400 mb-6">
                You haven't joined any gym or facility yet. Start your fitness journey today!
              </p>
              <Link
                to="/gyms"
                className="inline-block px-6 py-3 rounded-xl bg-lime-400 text-black font-semibold hover:bg-lime-300 transition"
              >
                Find Gyms Near You
              </Link>
            </div>
          </div>
        )}

        {memberships.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Gym Memberships</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {memberships.map((membership) => (
                <div
                  key={membership.id}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-lime-400">
                        {membership.gymName}
                      </h3>
                      <p className="text-zinc-300 text-sm mt-1">
                        {membership.planName}
                      </p>
                    </div>
                    {getStatusBadge(membership.status)}
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-zinc-400">Duration</span>
                      <span className="font-medium">{membership.durationDays} days</span>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                      <span className="text-zinc-400">Start Date</span>
                      <span className="font-medium">{formatDate(membership.startDate)}</span>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                      <span className="text-zinc-400">End Date</span>
                      <span className="font-medium">{formatDate(membership.endDate)}</span>
                    </div>

                    <div className="flex justify-between items-center text-sm pt-2 border-t border-white/10">
                      <span className="text-zinc-400">Price Paid</span>
                      <span className="font-bold text-lime-400">₹{membership.price}</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/10">
                    <div className="flex gap-3">
                      <Link
                        to={`/user/gym/${membership.gymId}/visit`}
                        className={`flex-1 px-4 py-2 rounded-xl font-semibold transition text-center ${
                          membership.status === "ACTIVE"
                            ? "bg-blue-500 text-white hover:bg-blue-400"
                            : "bg-zinc-700 text-zinc-400 cursor-not-allowed pointer-events-none"
                        }`}
                      >
                        Visit Gym
                      </Link>
                      <button
                        disabled={membership.status === "EXPIRED"}
                        className={`flex-1 px-4 py-2 rounded-xl font-semibold transition ${
                          membership.status === "ACTIVE"
                            ? "bg-lime-400 text-black hover:bg-lime-300"
                            : "bg-zinc-700 text-zinc-400 cursor-not-allowed"
                        }`}
                      >
                        {membership.status === "ACTIVE" ? "Active Membership" : "Membership Expired"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {facilitySubscriptions.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Facility Subscriptions</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {facilitySubscriptions.map((subscription) => (
                <div
                  key={subscription.id}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-purple-400">
                        {subscription.facilityName}
                      </h3>
                      <p className="text-zinc-300 text-sm mt-1">
                        {subscription.gymName}
                      </p>
                      <p className="text-zinc-400 text-xs mt-1">
                        {subscription.planName}
                      </p>
                    </div>
                    {getStatusBadge(subscription.status)}
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-zinc-400">Duration</span>
                      <span className="font-medium">{subscription.durationDays} days</span>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                      <span className="text-zinc-400">Start Date</span>
                      <span className="font-medium">{formatDate(subscription.startDate)}</span>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                      <span className="text-zinc-400">End Date</span>
                      <span className="font-medium">{formatDate(subscription.endDate)}</span>
                    </div>

                    <div className="flex justify-between items-center text-sm pt-2 border-t border-white/10">
                      <span className="text-zinc-400">Price Paid</span>
                      <span className="font-bold text-purple-400">₹{subscription.price}</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/10">
                    <button
                      disabled={subscription.status === "EXPIRED"}
                      className={`w-full px-4 py-2 rounded-xl font-semibold transition ${
                        subscription.status === "ACTIVE"
                          ? "bg-purple-500 text-white hover:bg-purple-400"
                          : "bg-zinc-700 text-zinc-400 cursor-not-allowed"
                      }`}
                    >
                      {subscription.status === "ACTIVE" ? "Active Subscription" : "Subscription Expired"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-12 text-center">
          <Link to="/" className="underline text-zinc-200 hover:text-white">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}