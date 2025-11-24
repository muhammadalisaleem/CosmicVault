import { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { ArrowLeft, Save } from 'lucide-react';
import type { Page, User } from '../App';
import { objectAPI, typeAPI, constellationAPI } from '../services/api';

interface CelestialObjectFormProps {
  user: User | null;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
  editingId: number | null;
}

const objectTypes = ['Star', 'Galaxy', 'Nebula', 'Exoplanet'];
const constellations = ['Andromeda', 'Orion', 'Ursa Major', 'Ursa Minor', 'Cassiopeia', 'Cygnus', 'Leo', 'Virgo', 'Scorpius', 'Sagittarius', 'Centaurus', 'Canis Major', 'Canes Venatici'];
const spectralClasses = ['O', 'B', 'A', 'F', 'G', 'K', 'M'];
const luminosityClasses = ['Ia', 'Ib', 'II', 'III', 'IV', 'V'];

export function CelestialObjectForm({ user, onNavigate, onLogout, editingId }: CelestialObjectFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'Star',
    constellation: '',
    rightAscension: '',
    declination: '',
    distance: '',
    apparentMagnitude: '',
    // Star specific
    spectralClass: 'G',
    luminosityClass: 'V',
    temperature: '',
    mass: '',
    // Exoplanet specific
    hostStar: '',
    orbitalPeriod: '',
    semiMajorAxis: '',
    eccentricity: ''
  });
  const [types, setTypes] = useState<Array<{TypeID: number; Name: string}>>([]);
  const [constellations, setConstellations] = useState<Array<{ConstellationID: number; Name: string}>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
    if (editingId) {
      loadObjectData();
    }
  }, [editingId]);

  const loadData = async () => {
    try {
      const [typesData, constData] = await Promise.all([
        typeAPI.getAll(),
        constellationAPI.getAll()
      ]);
      setTypes(typesData);
      setConstellations(constData);
    } catch (err) {
      console.error('Failed to load data:', err);
    }
  };

  const loadObjectData = async () => {
    if (!editingId) return;
    try {
      const obj = await objectAPI.getById(editingId);
      setFormData({
        name: obj.Name || '',
        type: obj.TypeName || 'Star',
        constellation: obj.ConstellationName || '',
        rightAscension: obj.RightAscension || '',
        declination: obj.Declination || '',
        distance: obj.Distance || '',
        apparentMagnitude: obj.ApparentMagnitude || '',
        spectralClass: obj.SpectralClass || 'G',
        luminosityClass: obj.LuminosityClass || 'V',
        temperature: obj.Temperature || '',
        mass: obj.Mass || '',
        hostStar: obj.HostStar || '',
        orbitalPeriod: obj.OrbitalPeriod || '',
        semiMajorAxis: obj.SemiMajorAxis || '',
        eccentricity: obj.Eccentricity || ''
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load object');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.type || !formData.constellation) {
      setError('Please fill in required fields');
      return;
    }
    try {
      setLoading(true);
      if (editingId) {
        await objectAPI.update(editingId, formData as any);
      } else {
        await objectAPI.create(formData as any);
      }
      onNavigate('celestial-objects');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save object');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar user={user} currentPage="celestial-objects" onNavigate={onNavigate} onLogout={onLogout} />
      
      <div className="flex-1 overflow-auto">
        <div className="p-8 max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => onNavigate('celestial-objects')}
              className="flex items-center gap-2 text-gray-400 hover:text-purple-300 transition-colors mb-4"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Objects
            </button>
            <h2 className="mb-2">{editingId ? 'Edit' : 'Add New'} Celestial Object</h2>
            <p className="text-gray-400">
              {editingId ? 'Update the information for this celestial object' : 'Add a new object to your celestial catalog'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="cosmic-card p-6 mb-6">
              <h4 className="mb-6">Basic Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm mb-2 text-gray-300">Object Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="w-full px-4 py-3 bg-[var(--cosmic-surface)] border border-[var(--cosmic-border)] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                    placeholder="e.g., Andromeda Galaxy"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2 text-gray-300">Object Type *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => handleChange('type', e.target.value)}
                    className="w-full px-4 py-3 bg-[var(--cosmic-surface)] border border-[var(--cosmic-border)] rounded-lg text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                    required
                  >
                    {types.map(type => (
                      <option key={type.TypeID} value={type.Name}>{type.Name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm mb-2 text-gray-300">Constellation *</label>
                  <select
                    value={formData.constellation}
                    onChange={(e) => handleChange('constellation', e.target.value)}
                    className="w-full px-4 py-3 bg-[var(--cosmic-surface)] border border-[var(--cosmic-border)] rounded-lg text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                    required
                  >
                    {constellations.map(c => (
                      <option key={c.ConstellationID} value={c.Name}>{c.Name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm mb-2 text-gray-300">Apparent Magnitude</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.apparentMagnitude}
                    onChange={(e) => handleChange('apparentMagnitude', e.target.value)}
                    className="w-full px-4 py-3 bg-[var(--cosmic-surface)] border border-[var(--cosmic-border)] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                    placeholder="e.g., 3.44"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2 text-gray-300">Right Ascension</label>
                  <input
                    type="text"
                    value={formData.rightAscension}
                    onChange={(e) => handleChange('rightAscension', e.target.value)}
                    className="w-full px-4 py-3 bg-[var(--cosmic-surface)] border border-[var(--cosmic-border)] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors font-mono"
                    placeholder="e.g., 00h 42m 44s"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2 text-gray-300">Declination</label>
                  <input
                    type="text"
                    value={formData.declination}
                    onChange={(e) => handleChange('declination', e.target.value)}
                    className="w-full px-4 py-3 bg-[var(--cosmic-surface)] border border-[var(--cosmic-border)] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors font-mono"
                    placeholder="e.g., +41° 16' 9&quot;"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm mb-2 text-gray-300">Distance (light years)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.distance}
                    onChange={(e) => handleChange('distance', e.target.value)}
                    className="w-full px-4 py-3 bg-[var(--cosmic-surface)] border border-[var(--cosmic-border)] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                    placeholder="e.g., 2537000"
                  />
                </div>
              </div>
            </div>

            {/* Conditional: Star Details */}
            {formData.type === 'Star' && (
              <div className="cosmic-card p-6 mb-6">
                <h4 className="mb-6">Star Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm mb-2 text-gray-300">Spectral Class</label>
                    <select
                      value={formData.spectralClass}
                      onChange={(e) => handleChange('spectralClass', e.target.value)}
                      className="w-full px-4 py-3 bg-[var(--cosmic-surface)] border border-[var(--cosmic-border)] rounded-lg text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                    >
                      {spectralClasses.map(sc => (
                        <option key={sc} value={sc}>{sc}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm mb-2 text-gray-300">Luminosity Class</label>
                    <select
                      value={formData.luminosityClass}
                      onChange={(e) => handleChange('luminosityClass', e.target.value)}
                      className="w-full px-4 py-3 bg-[var(--cosmic-surface)] border border-[var(--cosmic-border)] rounded-lg text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                    >
                      {luminosityClasses.map(lc => (
                        <option key={lc} value={lc}>{lc}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm mb-2 text-gray-300">Temperature (K)</label>
                    <input
                      type="number"
                      value={formData.temperature}
                      onChange={(e) => handleChange('temperature', e.target.value)}
                      className="w-full px-4 py-3 bg-[var(--cosmic-surface)] border border-[var(--cosmic-border)] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                      placeholder="e.g., 5778"
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2 text-gray-300">Mass (Solar Masses)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.mass}
                      onChange={(e) => handleChange('mass', e.target.value)}
                      className="w-full px-4 py-3 bg-[var(--cosmic-surface)] border border-[var(--cosmic-border)] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                      placeholder="e.g., 1.0"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Conditional: Exoplanet Details */}
            {formData.type === 'Exoplanet' && (
              <div className="cosmic-card p-6 mb-6">
                <h4 className="mb-6">Exoplanet Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm mb-2 text-gray-300">Host Star</label>
                    <select
                      value={formData.hostStar}
                      onChange={(e) => handleChange('hostStar', e.target.value)}
                      className="w-full px-4 py-3 bg-[var(--cosmic-surface)] border border-[var(--cosmic-border)] rounded-lg text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                    >
                      <option value="">Select host star...</option>
                      <option value="1">Betelgeuse</option>
                      <option value="2">Sirius</option>
                      <option value="3">Proxima Centauri</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm mb-2 text-gray-300">Orbital Period (days)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.orbitalPeriod}
                      onChange={(e) => handleChange('orbitalPeriod', e.target.value)}
                      className="w-full px-4 py-3 bg-[var(--cosmic-surface)] border border-[var(--cosmic-border)] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                      placeholder="e.g., 11.186"
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2 text-gray-300">Semi-Major Axis (AU)</label>
                    <input
                      type="number"
                      step="0.001"
                      value={formData.semiMajorAxis}
                      onChange={(e) => handleChange('semiMajorAxis', e.target.value)}
                      className="w-full px-4 py-3 bg-[var(--cosmic-surface)] border border-[var(--cosmic-border)] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                      placeholder="e.g., 0.0485"
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2 text-gray-300">Eccentricity</label>
                    <input
                      type="number"
                      step="0.001"
                      value={formData.eccentricity}
                      onChange={(e) => handleChange('eccentricity', e.target.value)}
                      className="w-full px-4 py-3 bg-[var(--cosmic-surface)] border border-[var(--cosmic-border)] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                      placeholder="e.g., 0.35"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-all cosmic-glow hover:cosmic-glow-strong"
              >
                <Save className="w-5 h-5" />
                {loading ? 'Saving...' : 'Save Object'}
              </button>
              <button
                type="button"
                onClick={() => onNavigate('celestial-objects')}
                className="px-6 py-3 bg-transparent border border-[var(--cosmic-border)] hover:bg-[var(--cosmic-card)] text-white rounded-lg transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}