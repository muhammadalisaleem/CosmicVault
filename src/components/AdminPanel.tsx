import { useState, useEffect } from 'react';
import { Settings, Plus, Trash2, Users, Database, Shield, Eye, X } from 'lucide-react';
import type { Page } from '../App';
import { typeAPI, constellationAPI, userAPI, objectAPI, logAPI } from '../services/api';

interface AdminPanelProps {
  onNavigate: (page: Page) => void;
  onLogout: () => void;
}

export function AdminPanel({ onNavigate, onLogout }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'objects' | 'constellations' | 'types'>('overview');
  const [showAddModal, setShowAddModal] = useState(false);
  const [objectTypes, setObjectTypes] = useState<any[]>([]);
  const [constellations, setConstellations] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [objects, setObjects] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [newTypeName, setNewTypeName] = useState('');
  const [newTypeDescription, setNewTypeDescription] = useState('');
  const [newConstellationName, setNewConstellationName] = useState('');
  const [newConstellationAbbr, setNewConstellationAbbr] = useState('');
  const [newConstellationDesc, setNewConstellationDesc] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [typesData, constData, usersData, objData, logsData] = await Promise.all([
        typeAPI.getAll(),
        constellationAPI.getAll(),
        userAPI.getAll(),
        objectAPI.getAll(),
        logAPI.getAll()
      ]);
      setObjectTypes(typesData.map((t: any) => ({
        id: t.TypeID,
        name: t.TypeName,
        description: t.Description || 'Object type',
        count: objData.filter((o: any) => o.TypeName === t.TypeName).length
      })));
      setConstellations(constData);
      setUsers(usersData);
      setObjects(objData);
      setLogs(logsData);
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
    if (confirm('Delete this user? This will also delete all their observations.')) {
      try {
        await userAPI.delete(id);
        setUsers(users.filter(u => u.UserID !== id));
        await loadData(); // Reload to update counts
      } catch (err) {
        console.error('Failed to delete user:', err);
        alert('Failed to delete user. Please try again.');
      }
    }
  };

  const deleteConstellation = async (id: number) => {
    if (confirm('Delete this constellation? This will set ConstellationID to NULL for all associated objects.')) {
      try {
        await constellationAPI.delete(id);
        setConstellations(constellations.filter(c => c.ConstellationID !== id));
        await loadData(); // Reload to update counts
      } catch (err) {
        console.error('Failed to delete constellation:', err);
        alert('Failed to delete constellation. Please try again.');
      }
    }
  };

  const deleteObject = async (id: number) => {
    if (confirm('Delete this celestial object? This will also delete related observations.')) {
      try {
        await objectAPI.delete(id);
        setObjects(objects.filter(o => o.ObjectID !== id));
        await loadData(); // Reload to update counts
      } catch (err) {
        console.error('Failed to delete object:', err);
        alert('Failed to delete object. Please try again.');
      }
    }
  };

  const viewUserDetails = (user: any) => {
    setSelectedUser(user);
    setShowUserDetails(true);
  };

  const handleAddType = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTypeName.trim()) {
      alert('Please enter a type name');
      return;
    }
    
    try {
      await typeAPI.create(newTypeName, newTypeDescription);
      setNewTypeName('');
      setNewTypeDescription('');
      setShowAddModal(false);
      await loadData(); // Reload data to show new type
    } catch (err) {
      console.error('Failed to create type:', err);
      alert('Failed to create object type. Please try again.');
    }
  };

  const handleAddConstellation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newConstellationName.trim()) {
      alert('Please enter a constellation name');
      return;
    }
    
    try {
      await constellationAPI.create(
        newConstellationName,
        newConstellationDesc,
        newConstellationAbbr
      );
      setNewConstellationName('');
      setNewConstellationAbbr('');
      setNewConstellationDesc('');
      setShowAddModal(false);
      await loadData(); // Reload data to show new constellation
    } catch (err) {
      console.error('Failed to create constellation:', err);
      alert(`Failed to create constellation: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Admin Sidebar */}
      <div className="w-64 bg-[var(--cosmic-card)] border-r border-[var(--cosmic-border)]">
        <div className="p-6 border-b border-[var(--cosmic-border)]">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Admin Panel</h3>
              <p className="text-xs text-gray-400">System Control</p>
            </div>
          </div>
        </div>

        <nav className="p-4">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
              activeTab === 'overview'
                ? 'bg-purple-600 text-white'
                : 'text-gray-300 hover:bg-[var(--cosmic-surface)]'
            }`}
          >
            <Database className="w-5 h-5" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
              activeTab === 'users'
                ? 'bg-purple-600 text-white'
                : 'text-gray-300 hover:bg-[var(--cosmic-surface)]'
            }`}
          >
            <Users className="w-5 h-5" />
            <span>Users</span>
          </button>

          <button
            onClick={() => setActiveTab('objects')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
              activeTab === 'objects'
                ? 'bg-purple-600 text-white'
                : 'text-gray-300 hover:bg-[var(--cosmic-surface)]'
            }`}
          >
            <Database className="w-5 h-5" />
            <span>Objects</span>
          </button>

          <button
            onClick={() => setActiveTab('constellations')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
              activeTab === 'constellations'
                ? 'bg-purple-600 text-white'
                : 'text-gray-300 hover:bg-[var(--cosmic-surface)]'
            }`}
          >
            <Database className="w-5 h-5" />
            <span>Constellations</span>
          </button>

          <button
            onClick={() => setActiveTab('types')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
              activeTab === 'types'
                ? 'bg-purple-600 text-white'
                : 'text-gray-300 hover:bg-[var(--cosmic-surface)]'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span>Object Types</span>
          </button>

          <div className="border-t border-[var(--cosmic-border)] my-4"></div>

          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-300 hover:bg-red-600/20 transition-colors"
          >
            <X className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </nav>
      </div>
      
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h2 className="mb-2">
              {activeTab === 'overview' && 'System Overview'}
              {activeTab === 'users' && 'User Management'}
              {activeTab === 'objects' && 'Object Management'}
              {activeTab === 'constellations' && 'Constellation Database'}
              {activeTab === 'types' && 'Object Type Management'}
            </h2>
            <p className="text-gray-400">
              {activeTab === 'overview' && 'Monitor system statistics and database health'}
              {activeTab === 'users' && 'Manage registered users and view their activity'}
              {activeTab === 'objects' && 'Manage celestial objects in the database'}
              {activeTab === 'constellations' && 'View and manage the 88 IAU constellations'}
              {activeTab === 'types' && 'Configure object type classifications'}
            </p>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="cosmic-card p-6">
                  <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center mb-4 border border-cyan-500/30">
                    <Users className="w-6 h-6 text-cyan-400" />
                  </div>
                  <p className="text-3xl mb-1">{users.length}</p>
                  <p className="text-sm text-gray-400">Registered Users</p>
                </div>

                <div className="cosmic-card p-6">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4 border border-purple-500/30">
                    <Database className="w-6 h-6 text-purple-400" />
                  </div>
                  <p className="text-3xl mb-1">{objects.length}</p>
                  <p className="text-sm text-gray-400">Celestial Objects</p>
                </div>

                <div className="cosmic-card p-6">
                  <div className="w-12 h-12 bg-pink-500/20 rounded-lg flex items-center justify-center mb-4 border border-pink-500/30">
                    <Database className="w-6 h-6 text-pink-400" />
                  </div>
                  <p className="text-3xl mb-1">{logs.length}</p>
                  <p className="text-sm text-gray-400">Observations</p>
                </div>

                <div className="cosmic-card p-6">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mb-4 border border-orange-500/30">
                    <Database className="w-6 h-6 text-orange-400" />
                  </div>
                  <p className="text-3xl mb-1">{constellations.length}</p>
                  <p className="text-sm text-gray-400">Constellations</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="cosmic-card p-6">
                  <h3 className="mb-4">Object Types Distribution</h3>
                  <div className="space-y-3">
                    {objectTypes.map(type => (
                      <div key={type.id} className="flex items-center justify-between">
                        <span className="text-gray-300">{type.name}</span>
                        <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-md border border-purple-500/30">
                          {type.count} objects
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="cosmic-card p-6">
                  <h3 className="mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {logs.slice(0, 5).map((log, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">New observation</span>
                        <span className="text-gray-500">{new Date(log.ObservationDate).toLocaleDateString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div>
              <div className="cosmic-card">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[var(--cosmic-border)]">
                      <th className="text-left p-4 text-gray-400">ID</th>
                      <th className="text-left p-4 text-gray-400">Username</th>
                      <th className="text-left p-4 text-gray-400">Email</th>
                      <th className="text-left p-4 text-gray-400">Member Since</th>
                      <th className="text-left p-4 text-gray-400">Observations</th>
                      <th className="text-right p-4 text-gray-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((userData) => {
                      const userLogs = logs.filter(l => l.UserID === userData.UserID);
                      return (
                        <tr key={userData.UserID} className="border-b border-[var(--cosmic-border)] hover:bg-[var(--cosmic-surface)] transition-colors">
                          <td className="p-4 text-gray-400">{userData.UserID}</td>
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center text-sm">
                                {(userData.Username || userData.username)?.charAt(0).toUpperCase()}
                              </div>
                              <span>{userData.Username || userData.username}</span>
                            </div>
                          </td>
                          <td className="p-4 text-gray-300">{userData.Email || userData.email}</td>
                          <td className="p-4 text-gray-400">{userData.CreatedAt ? new Date(userData.CreatedAt).toLocaleDateString() : 'N/A'}</td>
                          <td className="p-4">
                            <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-md border border-cyan-500/30">
                              {userLogs.length}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => viewUserDetails(userData)}
                                className="p-2 bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white rounded-lg transition-all border border-purple-600/30"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => deleteUser(userData.UserID)}
                                className="p-2 bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white rounded-lg transition-all border border-red-600/30"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Objects Tab */}
          {activeTab === 'objects' && (
            <div>
              <div className="cosmic-card">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[var(--cosmic-border)]">
                      <th className="text-left p-4 text-gray-400">ID</th>
                      <th className="text-left p-4 text-gray-400">Name</th>
                      <th className="text-left p-4 text-gray-400">Type</th>
                      <th className="text-left p-4 text-gray-400">Constellation</th>
                      <th className="text-left p-4 text-gray-400">RA</th>
                      <th className="text-left p-4 text-gray-400">Dec</th>
                      <th className="text-right p-4 text-gray-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {objects.map((obj) => (
                      <tr key={obj.ObjectID} className="border-b border-[var(--cosmic-border)] hover:bg-[var(--cosmic-surface)] transition-colors">
                        <td className="p-4 text-gray-400">{obj.ObjectID}</td>
                        <td className="p-4">{obj.Name}</td>
                        <td className="p-4">
                          <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-md border border-purple-500/30">
                            {obj.TypeName}
                          </span>
                        </td>
                        <td className="p-4 text-gray-300">{obj.ConstellationName || 'N/A'}</td>
                        <td className="p-4 text-gray-400">{obj.RightAscension}</td>
                        <td className="p-4 text-gray-400">{obj.Declination}</td>
                        <td className="p-4">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => deleteObject(obj.ObjectID)}
                              className="p-2 bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white rounded-lg transition-all border border-red-600/30"
                            >
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
                <div>
                  <p className="text-gray-400">Manage the 88 IAU constellations</p>
                </div>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-all cosmic-glow hover:cosmic-glow-strong"
                >
                  <Plus className="w-5 h-5" />
                  Add Constellation
                </button>
              </div>

              <div className="cosmic-card">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[var(--cosmic-border)]">
                      <th className="text-left p-4 text-gray-400">ID</th>
                      <th className="text-left p-4 text-gray-400">Name</th>
                      <th className="text-left p-4 text-gray-400">Abbreviation</th>
                      <th className="text-left p-4 text-gray-400">Description</th>
                      <th className="text-right p-4 text-gray-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {constellations.map((constellation: any) => (
                      <tr key={constellation.ConstellationID} className="border-b border-[var(--cosmic-border)] hover:bg-[var(--cosmic-surface)] transition-colors">
                        <td className="p-4 text-gray-400">{constellation.ConstellationID}</td>
                        <td className="p-4">{constellation.Name}</td>
                        <td className="p-4">
                          <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-md border border-cyan-500/30">
                            {constellation.Abbreviation}
                          </span>
                        </td>
                        <td className="p-4 text-gray-300 max-w-md truncate">{constellation.Description}</td>
                        <td className="p-4">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => deleteConstellation(constellation.ConstellationID)}
                              className="p-2 bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white rounded-lg transition-all border border-red-600/30"
                            >
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

          {/* Object Types Tab */}
          {activeTab === 'types' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-gray-400">Manage object type classifications</p>
                </div>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-all cosmic-glow hover:cosmic-glow-strong"
                >
                  <Plus className="w-5 h-5" />
                  Add Type
                </button>
              </div>

              <div className="cosmic-card">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[var(--cosmic-border)]">
                      <th className="text-left p-4 text-gray-400">ID</th>
                      <th className="text-left p-4 text-gray-400">Name</th>
                      <th className="text-left p-4 text-gray-400">Objects Count</th>
                      <th className="text-right p-4 text-gray-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {objectTypes.map((type) => (
                      <tr key={type.id} className="border-b border-[var(--cosmic-border)] hover:bg-[var(--cosmic-surface)] transition-colors">
                        <td className="p-4 text-gray-400">{type.id}</td>
                        <td className="p-4">
                          <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-md border border-purple-500/30">
                            {type.name}
                          </span>
                        </td>
                        <td className="p-4">{type.count}</td>
                        <td className="p-4">
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => deleteType(type.id)}
                              className="p-2 bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white rounded-lg transition-all border border-red-600/30"
                            >
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
        </div>
      </div>

      {/* User Details Modal */}
      {showUserDetails && selectedUser && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-6">
          <div className="cosmic-card p-8 max-w-2xl w-full cosmic-glow max-h-[80vh] overflow-auto">
            <div className="flex items-center justify-between mb-6">
              <h3>User Details</h3>
              <button
                onClick={() => setShowUserDetails(false)}
                className="p-2 hover:bg-[var(--cosmic-surface)] rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center text-2xl">
                  {(selectedUser.Username || selectedUser.username)?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-xl">{selectedUser.Username || selectedUser.username}</h4>
                  <p className="text-gray-400">{selectedUser.Email || selectedUser.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="cosmic-card p-4 bg-[var(--cosmic-surface)]">
                  <p className="text-sm text-gray-400 mb-1">User ID</p>
                  <p className="text-lg">{selectedUser.UserID}</p>
                </div>
                <div className="cosmic-card p-4 bg-[var(--cosmic-surface)]">
                  <p className="text-sm text-gray-400 mb-1">Member Since</p>
                  <p className="text-lg">{selectedUser.CreatedAt ? new Date(selectedUser.CreatedAt).toLocaleDateString() : 'N/A'}</p>
                </div>
                <div className="cosmic-card p-4 bg-[var(--cosmic-surface)]">
                  <p className="text-sm text-gray-400 mb-1">Total Observations</p>
                  <p className="text-lg">{logs.filter(l => l.UserID === selectedUser.UserID).length}</p>
                </div>
                <div className="cosmic-card p-4 bg-[var(--cosmic-surface)]">
                  <p className="text-sm text-gray-400 mb-1">Objects Tracked</p>
                  <p className="text-lg">{new Set(logs.filter(l => l.UserID === selectedUser.UserID).map(l => l.ObjectID)).size}</p>
                </div>
              </div>

              <div>
                <h4 className="mb-3">Recent Observations</h4>
                <div className="space-y-2">
                  {logs
                    .filter(l => l.UserID === selectedUser.UserID)
                    .slice(0, 5)
                    .map((log, idx) => (
                      <div key={idx} className="cosmic-card p-3 bg-[var(--cosmic-surface)] flex items-center justify-between">
                        <span className="text-sm">{log.ObjectName || `Object ${log.ObjectID}`}</span>
                        <span className="text-xs text-gray-400">{new Date(log.ObservationDate).toLocaleDateString()}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Object Type Modal */}
      {showAddModal && activeTab === 'types' && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-6">
          <div className="cosmic-card p-8 max-w-md w-full cosmic-glow">
            <h3 className="mb-6">Add New Object Type</h3>
            <form className="space-y-6" onSubmit={handleAddType}>
              <div>
                <label className="block text-sm mb-2 text-gray-300">Type Name</label>
                <input
                  type="text"
                  value={newTypeName}
                  onChange={(e) => setNewTypeName(e.target.value)}
                  className="w-full px-4 py-3 bg-[var(--cosmic-surface)] border border-[var(--cosmic-border)] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                  placeholder="e.g., Black Hole"
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-2 text-gray-300">Description (Optional)</label>
                <textarea
                  rows={4}
                  value={newTypeDescription}
                  onChange={(e) => setNewTypeDescription(e.target.value)}
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
                  onClick={() => {
                    setShowAddModal(false);
                    setNewTypeName('');
                    setNewTypeDescription('');
                  }}
                  className="flex-1 py-3 bg-transparent border border-[var(--cosmic-border)] hover:bg-[var(--cosmic-card)] text-white rounded-lg transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Constellation Modal */}
      {showAddModal && activeTab === 'constellations' && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-6">
          <div className="cosmic-card p-8 max-w-2xl w-full cosmic-glow">
            <h3 className="mb-6">Add New Constellation</h3>
            <form className="space-y-6" onSubmit={handleAddConstellation}>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm mb-2 text-gray-300">Name *</label>
                  <input
                    type="text"
                    value={newConstellationName}
                    onChange={(e) => setNewConstellationName(e.target.value)}
                    className="w-full px-4 py-3 bg-[var(--cosmic-surface)] border border-[var(--cosmic-border)] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                    placeholder="e.g., Andromeda"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2 text-gray-300">Abbreviation</label>
                  <input
                    type="text"
                    value={newConstellationAbbr}
                    onChange={(e) => setNewConstellationAbbr(e.target.value)}
                    className="w-full px-4 py-3 bg-[var(--cosmic-surface)] border border-[var(--cosmic-border)] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                    placeholder="e.g., And"
                    maxLength={10}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm mb-2 text-gray-300">Description</label>
                <textarea
                  rows={4}
                  value={newConstellationDesc}
                  onChange={(e) => setNewConstellationDesc(e.target.value)}
                  className="w-full px-4 py-3 bg-[var(--cosmic-surface)] border border-[var(--cosmic-border)] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors resize-none"
                  placeholder="Description of the constellation..."
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-all cosmic-glow hover:cosmic-glow-strong"
                >
                  Add Constellation
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setNewConstellationName('');
                    setNewConstellationAbbr('');
                    setNewConstellationDesc('');
                  }}
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
