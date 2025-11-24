import { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { ArrowLeft, Save } from 'lucide-react';
import type { Page, User } from '../App';
import { logAPI, objectAPI } from '../services/api';

interface ObservationLogFormProps {
  user: User | null;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
}

const seeingConditions = ['Excellent', 'Good', 'Moderate', 'Poor'];

export function ObservationLogForm({ user, onNavigate, onLogout }: ObservationLogFormProps) {
  const [formData, setFormData] = useState({
    celestialObject: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
    equipment: '',
    seeingConditions: 'Good',
    location: ''
  });
  const [objects, setObjects] = useState<Array<{ObjectID: number; Name: string}>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadObjects();
  }, []);

  const loadObjects = async () => {
    try {
      const data = await objectAPI.getAll();
      setObjects(data);
    } catch (err) {
      console.error('Failed to load objects:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.celestialObject || !formData.date) {
      setError('Please fill in required fields');
      return;
    }
    try {
      setLoading(true);
      await logAPI.create({
        UserID: user?.id || 0,
        ObjectID: parseInt(formData.celestialObject),
        ObservationDate: formData.date,
        Notes: formData.notes,
        Equipment: formData.equipment,
        SeeingCondition: formData.seeingConditions,
        Location: formData.location
      });
      onNavigate('observation-logs');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save log');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar user={user} currentPage="observation-logs" onNavigate={onNavigate} onLogout={onLogout} />
      
      <div className="flex-1 overflow-auto">
        <div className="p-8 max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => onNavigate('observation-logs')}
              className="flex items-center gap-2 text-gray-400 hover:text-purple-300 transition-colors mb-4"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Logs
            </button>
            <h2 className="mb-2">New Observation Log</h2>
            <p className="text-gray-400">
              Record your celestial observation with equipment and conditions
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400">
                {error}
              </div>
            )}
            <div className="cosmic-card p-6 mb-6">
              <h4 className="mb-6">Observation Details</h4>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm mb-2 text-gray-300">Celestial Object *</label>
                  <select
                    value={formData.celestialObject}
                    onChange={(e) => handleChange('celestialObject', e.target.value)}
                    className="w-full px-4 py-3 bg-[var(--cosmic-surface)] border border-[var(--cosmic-border)] rounded-lg text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                    required
                  >
                    <option value="">Select an object...</option>
                    {objects.map(obj => (
                      <option key={obj.ObjectID} value={obj.ObjectID}>{obj.Name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm mb-2 text-gray-300">Observation Date *</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleChange('date', e.target.value)}
                      className="w-full px-4 py-3 bg-[var(--cosmic-surface)] border border-[var(--cosmic-border)] rounded-lg text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2 text-gray-300">Seeing Conditions *</label>
                    <select
                      value={formData.seeingConditions}
                      onChange={(e) => handleChange('seeingConditions', e.target.value)}
                      className="w-full px-4 py-3 bg-[var(--cosmic-surface)] border border-[var(--cosmic-border)] rounded-lg text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                      required
                    >
                      {seeingConditions.map(condition => (
                        <option key={condition} value={condition}>{condition}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-2 text-gray-300">Equipment Used</label>
                  <input
                    type="text"
                    value={formData.equipment}
                    onChange={(e) => handleChange('equipment', e.target.value)}
                    className="w-full px-4 py-3 bg-[var(--cosmic-surface)] border border-[var(--cosmic-border)] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                    placeholder="e.g., 8-inch Dobsonian, 25mm eyepiece"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2 text-gray-300">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleChange('location', e.target.value)}
                    className="w-full px-4 py-3 bg-[var(--cosmic-surface)] border border-[var(--cosmic-border)] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                    placeholder="e.g., Dark Sky Park, Backyard Observatory"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2 text-gray-300">Observation Notes *</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => handleChange('notes', e.target.value)}
                    rows={8}
                    className="w-full px-4 py-3 bg-[var(--cosmic-surface)] border border-[var(--cosmic-border)] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors resize-none"
                    placeholder="Describe what you observed, including details about visibility, features, colors, and any other notable observations..."
                    required
                  />
                  <p className="text-sm text-gray-400 mt-2">
                    Tip: Include details about what you saw, atmospheric conditions, and any interesting features.
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-600/50 text-white rounded-lg transition-all cosmic-glow hover:cosmic-glow-strong"
              >
                <Save className="w-5 h-5" />
                {loading ? 'Saving...' : 'Save Log'}
                Save Observation
              </button>
              <button
                type="button"
                onClick={() => onNavigate('observation-logs')}
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
