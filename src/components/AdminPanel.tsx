import { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Settings, Plus, Edit, Trash2, Users, Database } from 'lucide-react';
import type { Page, User } from '../App';
import { typeAPI, constellationAPI, userAPI, objectAPI } from '../services/api';

interface AdminPanelProps {
  user: User | null;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
}

const mockObjectTypes = [
  { id: 1, name: 'Star', description: 'Self-luminous celestial body', count: 45 },
  { id: 2, name: 'Galaxy', description: 'System of stars and interstellar matter', count: 32 },
  { id: 3, name: 'Nebula', description: 'Cloud of gas and dust in space', count: 28 },
  { id: 4, name: 'Exoplanet', description: 'Planet outside our solar system', count: 23 },
];

const mockUsers = [
  { id: 1, username: 'astro_observer', email: 'observer@cosmicvault.app', observations: 47, joinDate: '2024-01-15' },
  { id: 2, username: 'star_gazer', email: 'gazer@cosmicvault.app', observations: 32, joinDate: '2024-02-20' },
  { id: 3, username: 'nebula_hunter', email: 'hunter@cosmicvault.app', observations: 58, joinDate: '2024-03-10' },
  { id: 4, username: 'cosmic_explorer', email: 'explorer@cosmicvault.app', observations: 21, joinDate: '2024-04-05' },
];

export function AdminPanel({ user, onNavigate, onLogout }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'object-types' | 'constellations' | 'users'>('object-types');
  const [showAddModal, setShowAddModal] = useState(false);
  const [objectTypes, setObjectTypes] = useState<any[]>([]);
  const [constellations, setConstellations] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [typesData, constData, usersData, objData] = await Promise.all([
        typeAPI.getAll(),
        constellationAPI.getAll(),
        userAPI.getAll(),
        objectAPI.getAll()
      ]);
      setObjectTypes(typesData.map(t => ({
        id: t.TypeID,
        name: t.Name,
        description: 'Object type',
        count: objData.filter((o: any) => o.TypeName === t.Name).length
      })));
      setConstellations(constData);
      setUsers(usersData);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteType = async (id: number) => {
    if (confirm('Delete this object type?')) {
      try {
        await typeAPI.delete(id);
        setObjectTypes(objectTypes.filter(t => t.id !== id));
      } catch (err) {
        console.error('Failed to delete type:', err);
      }
    }
  };

  const deleteUser = async (id: number) => {
    if (confirm('Delete this user?')) {
      try {
        await userAPI.delete(id);
        setUsers(users.filter(u => u.UserID !== id));
      } catch (err) {
        console.error('Failed to delete user:', err);
      }
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar user={user} currentPage="admin" onNavigate={onNavigate} onLogout={onLogout} />
      
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h2 className="mb-2">Admin Panel</h2>
            <p className="text-gray-400">Manage database entities and system configuration</p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="cosmic-card p-6">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4 border border-purple-500/30">
                <Database className="w-6 h-6 text-purple-400" />
              </div>
              <p className="text-3xl mb-1">{objectTypes.reduce((sum: number, t: any) => sum + t.count, 0)}</p>
              <p className="text-sm text-gray-400">Total Objects</p>
            </div>

            <div className="cosmic-card p-6">
              <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center mb-4 border border-cyan-500/30">
                <Users className="w-6 h-6 text-cyan-400" />
              </div>
              <p className="text-3xl mb-1">{users.length}</p>
              <p className="text-sm text-gray-400">Active Users</p>
            </div>

            <div className="cosmic-card p-6">
              <div className="w-12 h-12 bg-pink-500/20 rounded-lg flex items-center justify-center mb-4 border border-pink-500/30">
                <Settings className="w-6 h-6 text-pink-400" />
              </div>
              <p className="text-3xl mb-1">{objectTypes.length}</p>
              <p className="text-sm text-gray-400">Object Types</p>
            </div>

            <div className="cosmic-card p-6">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4 border border-purple-500/30">
                <Database className="w-6 h-6 text-purple-400" />
              </div>
              <p className="text-3xl mb-1">{constellations.length}</p>
              <p className="text-sm text-gray-400">Constellations</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="cosmic-card mb-6">
            <div className="flex border-b border-[var(--cosmic-border)]">
              <button
                onClick={() => setActiveTab('object-types')}
                className={`px-6 py-4 transition-colors ${
                  activeTab === 'object-types'
                    ? 'border-b-2 border-purple-500 text-purple-300'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Object Types
              </button>
              <button
                onClick={() => setActiveTab('constellations')}
                className={`px-6 py-4 transition-colors ${
                  activeTab === 'constellations'
                    ? 'border-b-2 border-purple-500 text-purple-300'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Constellations
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`px-6 py-4 transition-colors ${
                  activeTab === 'users'
                    ? 'border-b-2 border-purple-500 text-purple-300'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Users
              </button>
            </div>
          </div>

          {/* Object Types Tab */}
          {activeTab === 'object-types' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3>Manage Object Types</h3>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-all cosmic-glow hover:cosmic-glow-strong"
                >
                  <Plus className="w-5 h-5" />
                  Add Object Type
                </button>
              </div>

              <div className="cosmic-card">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[var(--cosmic-border)]">
                      <th className="text-left p-4 text-gray-400">ID</th>
                      <th className="text-left p-4 text-gray-400">Name</th>
                      <th className="text-left p-4 text-gray-400">Description</th>
                      <th className="text-left p-4 text-gray-400">Objects Count</th>
                      <th className="text-right p-4 text-gray-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockObjectTypes.map((type) => (
                      <tr key={type.id} className="border-b border-[var(--cosmic-border)] hover:bg-[var(--cosmic-surface)] transition-colors">
                        <td className="p-4 text-gray-400">{type.id}</td>
                        <td className="p-4">
                          <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-md border border-purple-500/30">
                            {type.name}
                          </span>
                        </td>
                        <td className="p-4 text-gray-300">{type.description}</td>
                        <td className="p-4">{type.count}</td>
                        <td className="p-4">
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => deleteType(type.id)}
                              className="p-2 bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white rounded-lg transition-all border border-red-600/30">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Constellations Tab */}
          {activeTab === 'constellations' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3>Manage Constellations</h3>
                <button
                  onClick={() => onNavigate('constellations')}
                  className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-all cosmic-glow hover:cosmic-glow-strong"
                >
                  View Full List
                </button>
              </div>

              <div className="cosmic-card p-6">
                <p className="text-gray-300 mb-4">
                  The 88 official IAU constellations are available in the system. You can manage them from the Constellations page.
                </p>
                <button
                  onClick={() => onNavigate('constellations')}
                  className="px-6 py-3 bg-cyan-600/20 hover:bg-cyan-600 text-cyan-300 hover:text-white rounded-lg transition-all border border-cyan-600/30"
                >
                  Go to Constellations
                </button>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div>
              <div className="mb-6">
                <h3>User Management (View Only)</h3>
              </div>

              <div className="cosmic-card">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[var(--cosmic-border)]">
                      <th className="text-left p-4 text-gray-400">ID</th>
                      <th className="text-left p-4 text-gray-400">Username</th>
                      <th className="text-left p-4 text-gray-400">Email</th>
                      <th className="text-left p-4 text-gray-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((userData) => (
                      <tr key={userData.UserID} className="border-b border-[var(--cosmic-border)] hover:bg-[var(--cosmic-surface)] transition-colors">
                        <td className="p-4 text-gray-400">{userData.UserID}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center text-sm">
                              {userData.username.charAt(0).toUpperCase()}
                            </div>
                            <span>{userData.username}</span>
                          </div>
                        </td>
                        <td className="p-4 text-gray-300">{userData.email}</td>
                        <td className="p-4">
                          <button
                            onClick={() => deleteUser(userData.UserID)}
                            className="p-2 bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white rounded-lg transition-all border border-red-600/30">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Object Type Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-6">
          <div className="cosmic-card p-8 max-w-md w-full cosmic-glow">
            <h3 className="mb-6">Add New Object Type</h3>
            <form className="space-y-6">
              <div>
                <label className="block text-sm mb-2 text-gray-300">Type Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-[var(--cosmic-surface)] border border-[var(--cosmic-border)] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                  placeholder="e.g., Black Hole"
                />
              </div>
              <div>
                <label className="block text-sm mb-2 text-gray-300">Description</label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 bg-[var(--cosmic-surface)] border border-[var(--cosmic-border)] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors resize-none"
                  placeholder="Brief description of the object type..."
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-all cosmic-glow hover:cosmic-glow-strong"
                >
                  Add Type
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
