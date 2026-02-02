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
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-zinc-800 text-white px-4 py-10">
      <div className="max-w-4xl mx-auto bg-white/5 border border-white/10 rounded-2xl p-8 shadow-xl">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold">Gym Facilities</h2>

          <button
            onClick={() => navigate(`/owner/gym/${gymId}/facilities/add`)}
            className="bg-lime-500 hover:bg-lime-400 text-black font-semibold px-4 py-2 rounded-xl"
          >
            + Add Facility
          </button>
        </div>

        <p className="text-zinc-300 text-sm mt-1">
          Manage services available in your gym.
        </p>

        {error && (
          <div className="mt-4 bg-red-500/10 border border-red-500/30 text-red-200 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <p className="mt-6 text-zinc-300">Loading facilities...</p>
        ) : facilities.length === 0 ? (
          <p className="mt-6 text-zinc-300">No facilities added yet.</p>
        ) : (
          <div className="mt-6 grid gap-4">
            {facilities.map((f) => (
              <div
                key={f.id}
                className="p-4 rounded-xl border border-white/10 bg-black/30 flex justify-between items-start"
              >
                <div>
                  <h3 className="text-xl font-semibold">{f.facilityName}</h3>
                  <p className="text-zinc-300 text-sm mt-1">
                    {f.description || "-"}
                  </p>
                  <p className="text-xs mt-2">
                    Status:{" "}
                    <span
                      className={
                        f.active ? "text-lime-400" : "text-red-300"
                      }
                    >
                      {f.active ? "ACTIVE" : "INACTIVE"}
                    </span>
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <Link
                    to={`/owner/facilities/edit/${f.id}`}
                    className="px-4 py-2 text-sm rounded-xl bg-white/10 hover:bg-white/20"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8">
          <Link
            to="/dashboard"
            className="text-lime-400 hover:underline text-sm"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
