import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Link } from 'react-router-dom';
import { getPublicGyms } from '../api/publicGymApi';
import { getDashboardRoute } from '../utils/navigation';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function GymMap() {
  const [gyms, setGyms] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchGyms();
  }, []);

  const fetchGyms = async () => {
    try {
      const response = await getPublicGyms();
      console.log('Gyms loaded:', response);
      
      // Handle different response structures
      const gymsArray = Array.isArray(response) ? response : (response.data || []);
      
      const gymsWithCoords = gymsArray.map((gym) => ({
        ...gym,
        latitude: gym.latitude != null ? Number(gym.latitude) : null,
        longitude: gym.longitude != null ? Number(gym.longitude) : null,
      }));
      setGyms(gymsWithCoords);
    } catch (err) {
      console.error('Error loading gyms:', err);
      setError('Failed to load gyms');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-400 mx-auto mb-4"></div>
          <p className="text-zinc-300">Loading gym locations...</p>
        </div>
      </div>
    );
  }

  const normalizedQuery = query.trim().toLowerCase();
  const filteredGyms = normalizedQuery.length === 0
    ? gyms
    : gyms.filter((gym) => {
        const haystack = [
          gym.gymName,
          gym.address,
          gym.city,
          gym.state,
          gym.pincode
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return haystack.includes(normalizedQuery);
      });

  const firstMatch = filteredGyms.find((g) => g.latitude && g.longitude);

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-lime-400 hover:text-lime-300 mb-3">
            <span>←</span> Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold">Find Gyms Near You</h1>
        </div>
      </div>

      <div className="mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by gym name, city, state, address, or pincode"
          className="w-full px-5 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-lime-400/50 transition-colors"
        />
      </div>

      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl">
          {error}
        </div>
      )}

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Gym List */}
        <div className="lg:col-span-1">
          <h3 className="text-lg font-bold mb-4">Available Gyms ({filteredGyms.length})</h3>
          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {filteredGyms.map((gym) => (
              <div key={gym.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                <h4 className="font-bold text-white mb-2">{gym.gymName}</h4>
                <p className="text-zinc-400 text-sm mb-2">{gym.address}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-zinc-800 px-2 py-1 rounded">{gym.city}</span>
                  {(!gym.latitude || !gym.longitude) && (
                    <span className="text-xs text-amber-400">Location unavailable</span>
                  )}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Link
                    to={`/gyms/${gym.id}`}
                    className="text-xs font-bold uppercase tracking-widest text-lime-400 hover:text-lime-300"
                  >
                    View Details
                  </Link>
                  {gym.latitude && gym.longitude && (
                    <button
                      type="button"
                      onClick={() => window.open(`https://www.google.com/maps?q=${gym.latitude},${gym.longitude}`, "_blank", "noopener,noreferrer")}
                      className="text-xs font-bold uppercase tracking-widest text-blue-400 hover:text-blue-300"
                    >
                      Navigate
                    </button>
                  )}
                </div>
              </div>
            ))}
            {filteredGyms.length === 0 && (
              <div className="text-zinc-500 text-sm">No gyms match your search.</div>
            )}
          </div>
        </div>

        {/* Map */}
        <div className="lg:col-span-3">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden" style={{ height: '500px' }}>
            {filteredGyms.length > 0 ? (
              <MapContainer
                center={[
                  firstMatch?.latitude || 28.6139,
                  firstMatch?.longitude || 77.2090
                ]}
                zoom={11}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='© OpenStreetMap contributors'
                />
                {filteredGyms
                  .filter((gym) => gym.latitude && gym.longitude && !Number.isNaN(gym.latitude) && !Number.isNaN(gym.longitude))
                  .map((gym) => (
                  <Marker key={gym.id} position={[gym.latitude, gym.longitude]}>
                    <Popup>
                      <div>
                        <h4 className="font-bold">{gym.gymName}</h4>
                        <p className="text-sm">{gym.address}</p>
                        <Link to={`/gyms/${gym.id}`} className="text-blue-500 hover:underline">
                          View Details
                        </Link>
                        {gym.latitude && gym.longitude && (
                          <button
                            type="button"
                            onClick={() => window.open(`https://www.google.com/maps?q=${gym.latitude},${gym.longitude}`, "_blank", "noopener,noreferrer")}
                            className="ml-3 text-blue-500 hover:underline"
                          >
                            Navigate
                          </button>
                        )}
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-zinc-500">
                No gyms to display on map
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


