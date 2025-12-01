import { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Search, Plus, Edit, Trash2, Globe, AlertCircle } from 'lucide-react';
import type { Page, User } from '../App';
import { constellationAPI } from '../services/api';
import localConstellations from '../data/constellations.json';

interface ConstellationsProps {
  user: User | null;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
}

export function Constellations({ user, onNavigate, onLogout }: ConstellationsProps) {
  const [constellations, setConstellations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    abbreviation: ''
  });
  const [formLoading, setFormLoading] = useState(false);

  // Load constellations from API on mount
  useEffect(() => {
    loadConstellations();
  }, []);

  const loadConstellations = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await constellationAPI.getAll();
      // Use API data directly (even if empty)
      setConstellations(data || []);
    } catch (err) {
      // Use local fallback only when API fails (network error, etc.)
      setConstellations(localConstellations as any[]);
      setError('Failed to load constellations from API — using local fallback');
    } finally {
      setLoading(false);
    }
  };

  const deleteConstellation = async (id: number) => {
    if (!confirm('Are you sure you want to delete this constellation?')) return;
    try {
      await constellationAPI.delete(id);
      setConstellations(constellations.filter(c => c.ConstellationID !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete constellation');
    }
  };

  const handleAddConstellation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      setError('Constellation name is required');
      return;
    }
    try {
      setFormLoading(true);
      await constellationAPI.create(
        formData.name,
        formData.description,
        formData.abbreviation
      );
      setFormData({
        name: '',
        description: '',
        abbreviation: ''
      });
      setShowAddModal(false);
      await loadConstellations();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add constellation');
    } finally {
      setFormLoading(false);
    }
  };

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const filteredConstellations = constellations.filter(constellation => {
    const name = (constellation.Name || '').toLowerCase();
    const desc = (constellation.Description || '').toLowerCase();
    return name.includes(searchTerm.toLowerCase()) ||
           desc.includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar user={user} currentPage="constellations" onNavigate={onNavigate} onLogout={onLogout} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading constellations...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar user={user} currentPage="constellations" onNavigate={onNavigate} onLogout={onLogout} />
      
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="mb-2">Constellations</h2>
              <p className="text-gray-400">Explore the official IAU constellations</p>
            </div>
            {user?.role === 'admin' && (
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-all cosmic-glow hover:cosmic-glow-strong"
              >
                <Plus className="w-5 h-5" />
                Add Constellation
              </button>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          )}

          {/* Search */}
          <div className="cosmic-card p-6 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search constellations..."
                className="w-full pl-10 pr-4 py-3 bg-[var(--cosmic-surface)] border border-[var(--cosmic-border)] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
              />
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-4">
            <p className="text-gray-400">
              Showing {filteredConstellations.length} of {constellations.length} constellations
            </p>
          </div>

          {/* Constellations Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredConstellations.map((constellation) => (
              <div key={constellation.ConstellationID} className="cosmic-card p-6 hover:cosmic-glow transition-all group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
                      <Globe className="w-7 h-7" />
                    </div>
                    <div>
                      <h4 className="mb-1">{constellation.Name}</h4>
                    </div>
                  </div>
                </div>

                {constellation.Description && (
                  <p className="text-gray-300 mb-4 min-h-[60px]">
                    {constellation.Description}
                  </p>
                )}

                {constellation.Abbreviation && (
                  <div className="p-3 bg-[var(--cosmic-surface)] rounded-lg">
                    <p className="text-sm text-gray-400 mb-1">Abbr.</p>
                    <p className="font-mono text-sm">{constellation.Abbreviation}</p>
                  </div>
                )}

                {user?.role === 'admin' && (
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity mt-4">
                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white rounded-lg transition-all border border-purple-600/30">
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => deleteConstellation(constellation.ConstellationID || 0)}
                      className="px-4 py-2 bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white rounded-lg transition-all border border-red-600/30"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredConstellations.length === 0 && (
            <div className="cosmic-card p-12 text-center">
              <Globe className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h4 className="mb-2 text-gray-400">No constellations found</h4>
              <p className="text-gray-500">Try adjusting your search</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Modal (simplified) */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-6">
          <div className="cosmic-card p-8 max-w-2xl w-full cosmic-glow">
            <h3 className="mb-6">Add New Constellation</h3>
            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded text-red-300 text-sm">
                {error}
              </div>
            )}
            <form onSubmit={handleAddConstellation} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm mb-2 text-gray-300">Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleFormChange('name', e.target.value)}
                    className="w-full px-4 py-3 bg-[var(--cosmic-surface)] border border-[var(--cosmic-border)] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                    placeholder="e.g., Andromeda"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2 text-gray-300">Abbreviation</label>
                  <input
                    type="text"
                    value={formData.abbreviation}
                    onChange={(e) => handleFormChange('abbreviation', e.target.value)}
                    className="w-full px-4 py-3 bg-[var(--cosmic-surface)] border border-[var(--cosmic-border)] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                    placeholder="e.g., And"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm mb-2 text-gray-300">Description</label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => handleFormChange('description', e.target.value)}
                  className="w-full px-4 py-3 bg-[var(--cosmic-surface)] border border-[var(--cosmic-border)] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors resize-none"
                  placeholder="Description of the constellation..."
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 py-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-lg transition-all cosmic-glow hover:cosmic-glow-strong"
                >
                  {formLoading ? 'Adding...' : 'Add Constellation'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 bg-transparent border border-[var(--cosmic-border)] hover:bg-[var(--cosmic-card)] text-white rounded-lg transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
