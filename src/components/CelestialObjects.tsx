import { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Search, Filter, Plus, Edit, Trash2, Star, Sparkles, AlertCircle } from 'lucide-react';
import type { Page, User } from '../App';
import { objectAPI, typeAPI, CelestialObject } from '../services/api';

interface CelestialObjectsProps {
  user: User | null;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
  onEdit: (id: number) => void;
  onNew: () => void;
}

export function CelestialObjects({ user, onNavigate, onLogout, onEdit, onNew }: CelestialObjectsProps) {
  const [objects, setObjects] = useState<CelestialObject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [magnitudeRange, setMagnitudeRange] = useState<[number, number]>([0, 15]);
  const [objectTypes, setObjectTypes] = useState<string[]>(['All']);

  // Load objects from API on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      // Fetch object types
      const types = await typeAPI.getAll();
      setObjectTypes(['All', ...types.map((t: any) => t.TypeName || t.typeName)]);
      
      // Fetch celestial objects
      const objectsData = await objectAPI.getAll();
      setObjects(objectsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const deleteObject = async (id: number) => {
    if (!confirm('Are you sure you want to delete this object?')) return;
    try {
      await objectAPI.delete(id);
      setObjects(objects.filter(obj => obj.ObjectID !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete object');
    }
  };

  const filteredObjects = objects.filter(obj => {
    const name = (obj.Name || '').toLowerCase();
    const constellation = (obj.ConstellationName || '').toLowerCase();
    const type = obj.TypeName || '';
    const magnitude = obj.Magnitude || 0;

    const matchesSearch = name.includes(searchTerm.toLowerCase()) ||
                         constellation.includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'All' || type === selectedType;
    const matchesMagnitude = magnitude >= magnitudeRange[0] && 
                            magnitude <= magnitudeRange[1];
    return matchesSearch && matchesType && matchesMagnitude;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Star': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
      case 'Galaxy': return 'text-purple-400 bg-purple-400/10 border-purple-400/30';
      case 'Nebula': return 'text-cyan-400 bg-cyan-400/10 border-cyan-400/30';
      case 'Exoplanet': return 'text-pink-400 bg-pink-400/10 border-pink-400/30';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/30';
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar user={user} currentPage="celestial-objects" onNavigate={onNavigate} onLogout={onLogout} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading celestial objects...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar user={user} currentPage="celestial-objects" onNavigate={onNavigate} onLogout={onLogout} />
      
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="mb-2">Celestial Objects</h2>
              <p className="text-gray-400">Explore and manage your celestial catalog</p>
            </div>
            <button
              onClick={onNew}
              className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-all cosmic-glow hover:cosmic-glow-strong"
            >
              <Plus className="w-5 h-5" />
              Add New Object
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          )}

          {/* Filters */}
          <div className="cosmic-card p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Search */}
              <div>
                <label className="block text-sm mb-2 text-gray-300">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name or constellation..."
                    className="w-full pl-10 pr-4 py-2 bg-[var(--cosmic-surface)] border border-[var(--cosmic-border)] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                  />
                </div>
              </div>

              {/* Type Filter */}
              <div>
                <label className="block text-sm mb-2 text-gray-300">Object Type</label>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-[var(--cosmic-surface)] border border-[var(--cosmic-border)] rounded-lg text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors appearance-none"
                  >
                    {objectTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Magnitude Range */}
              <div>
                <label className="block text-sm mb-2 text-gray-300">
                  Magnitude Range: {magnitudeRange[0]} - {magnitudeRange[1]}
                </label>
                <div className="flex gap-4 items-center">
                  <input
                    type="range"
                    min="0"
                    max="15"
                    step="0.1"
                    value={magnitudeRange[0]}
                    onChange={(e) => setMagnitudeRange([parseFloat(e.target.value), magnitudeRange[1]])}
                    className="flex-1"
                  />
                  <input
                    type="range"
                    min="0"
                    max="15"
                    step="0.1"
                    value={magnitudeRange[1]}
                    onChange={(e) => setMagnitudeRange([magnitudeRange[0], parseFloat(e.target.value)])}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-4">
            <p className="text-gray-400">
              Showing {filteredObjects.length} of {objects.length} objects
            </p>
          </div>

          {/* Objects Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredObjects.map((object) => (
              <div key={object.ObjectID} className="cosmic-card p-6 hover:cosmic-glow transition-all group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
                      {object.TypeName === 'Star' && <Star className="w-6 h-6" />}
                      {object.TypeName === 'Galaxy' && <Sparkles className="w-6 h-6" />}
                      {object.TypeName === 'Nebula' && <Sparkles className="w-6 h-6" />}
                      {object.TypeName === 'Exoplanet' && <Star className="w-6 h-6" />}
                    </div>
                    <div>
                      <h5 className="mb-1">{object.Name}</h5>
                      <span className={`inline-block px-2 py-1 text-xs rounded-md border ${getTypeColor(object.TypeName || '')}`}>
                        {object.TypeName}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  {object.ConstellationName && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Constellation:</span>
                      <span>{object.ConstellationName}</span>
                    </div>
                  )}
                  {object.RightAscension && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">RA:</span>
                      <span className="font-mono text-xs">{object.RightAscension}</span>
                    </div>
                  )}
                  {object.Declination && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Dec:</span>
                      <span className="font-mono text-xs">{object.Declination}</span>
                    </div>
                  )}
                  {object.Distance && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Distance:</span>
                      <span>{object.Distance.toLocaleString()} ly</span>
                    </div>
                  )}
                  {object.Magnitude !== undefined && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Magnitude:</span>
                      <span>{object.Magnitude}</span>
                    </div>
                  )}
                  
                  {/* Star-specific details */}
                  {object.TypeName === 'Star' && object.SpectralClass && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Spectral Class:</span>
                      <span className="font-semibold text-yellow-400">{object.SpectralClass}</span>
                    </div>
                  )}
                  {object.TypeName === 'Star' && object.LuminosityClass && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Luminosity:</span>
                      <span>{object.LuminosityClass}</span>
                    </div>
                  )}
                  {object.TypeName === 'Star' && object.Temperature && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Temperature:</span>
                      <span>{object.Temperature.toLocaleString()} K</span>
                    </div>
                  )}
                  {object.TypeName === 'Star' && object.Mass && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Mass:</span>
                      <span>{object.Mass} M☉</span>
                    </div>
                  )}
                  
                  {/* Exoplanet-specific details */}
                  {object.TypeName === 'Exoplanet' && object.OrbitalPeriod && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Orbital Period:</span>
                      <span className="font-semibold text-pink-400">{object.OrbitalPeriod} days</span>
                    </div>
                  )}
                  {object.TypeName === 'Exoplanet' && object.SemiMajorAxis && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Semi-Major Axis:</span>
                      <span>{object.SemiMajorAxis} AU</span>
                    </div>
                  )}
                  {object.TypeName === 'Exoplanet' && object.Eccentricity !== undefined && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Eccentricity:</span>
                      <span>{object.Eccentricity}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onEdit(object.ObjectID || 0)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white rounded-lg transition-all border border-purple-600/30"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => deleteObject(object.ObjectID || 0)}
                    className="px-4 py-2 bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white rounded-lg transition-all border border-red-600/30"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredObjects.length === 0 && (
            <div className="cosmic-card p-12 text-center">
              <Star className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h4 className="mb-2 text-gray-400">No objects found</h4>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
