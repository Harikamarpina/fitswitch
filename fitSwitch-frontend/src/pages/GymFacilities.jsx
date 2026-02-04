import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { getGymFacilitiesOwner } from "../api/facilityApi";

export default function GymFacilities() {
  const { gymId } = useParams();
  const navigate = useNavigate();

  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchFacilities();
  }, []);

  const fetchFacilities = async () => {
    try {
      setLoading(true);
      const res = await getGymFacilitiesOwner(gymId);

      // If your backend wrapper is ApiResponse:
      const list = res.data.data || res.data;
      setFacilities(list);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load facilities");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-12">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-white transition-colors mb-4"
            >
              <span>←</span> Back to Dashboard
            </Link>
            <h2 className="text-4xl font-extrabold tracking-tight">Gym Facilities</h2>
            <p className="text-zinc-400 mt-2 text-lg">
              Manage services and amenities available in your facility.
            </p>
          </div>

          <button
            onClick={() => navigate(`/owner/gym/${gymId}/facilities/add`)}
            className="bg-lime-500 hover:bg-lime-400 text-black font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-lime-500/20 flex items-center justify-center gap-2"
          >
            <span className="text-xl">+</span> Add Facility
          </button>
        </div>

        {error && (
          <div className="mb-8 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl flex items-center gap-3">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-lime-500/30 border-t-lime-500 rounded-full animate-spin"></div>
            <p className="mt-4 text-zinc-500 font-medium">Loading your facilities...</p>
          </div>
        ) : facilities.length === 0 ? (
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-16 text-center">
            <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl text-zinc-500">🏢</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">No facilities yet</h3>
            <p className="text-zinc-400 mb-8 max-w-sm mx-auto">
              Start by adding your first facility to let users know what you offer.
            </p>
            <button
              onClick={() => navigate(`/owner/gym/${gymId}/facilities/add`)}
              className="text-lime-400 hover:text-lime-300 font-semibold"
            >
              Add your first facility →
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {facilities.map((f) => (
              <div
                key={f.id}
                className="group p-6 rounded-3xl border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900/80 hover:border-zinc-700 transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white group-hover:text-lime-400 transition-colors">
                      {f.facilityName}
                    </h3>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`w-2 h-2 rounded-full ${f.active ? "bg-lime-500" : "bg-zinc-600"}`}></span>
                      <span className={`text-xs font-bold uppercase tracking-wider ${f.active ? "text-lime-500" : "text-zinc-500"}`}>
                        {f.active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-zinc-400 text-sm leading-relaxed mb-6 line-clamp-2">
                  {f.description || "No description provided for this facility."}
                </p>

                <div className="flex gap-3">
                  <Link
                    to={`/owner/facilities/edit/${f.id}`}
                    className="flex-1 text-center bg-zinc-800 hover:bg-zinc-700 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
                  >
                    Edit Details
                  </Link>
                  <Link
                    to={`/owner/facilities/${f.id}/plans`}
                    className="flex-1 text-center bg-lime-500/10 hover:bg-lime-500 text-lime-400 hover:text-black font-semibold py-3 rounded-xl transition-all text-sm border border-lime-500/20"
                  >
                    Manage Plans
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
