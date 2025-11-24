import { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Star, BookOpen, Globe, TrendingUp, Plus } from 'lucide-react';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { Page, User } from '../App';
import { objectAPI, logAPI, constellationAPI } from '../services/api';

interface DashboardProps {
  user: User | null;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
}

export function Dashboard({ user, onNavigate, onLogout }: DashboardProps) {
  const [stats, setStats] = useState({
    totalObservations: 0,
    totalObjects: 0,
    savedConstellations: 0,
    recentActivity: 0
  });
  const [loading, setLoading] = useState(true);

  // Load stats from API on mount
  useEffect(() => {
    loadStats();
  }, [user?.id]);

  const loadStats = async () => {
    try {
      if (!user?.id) {
        setStats({
          totalObservations: 0,
          totalObjects: 0,
          savedConstellations: 0,
          recentActivity: 0
        });
        setLoading(false);
        return;
      }
      const [objects, logs, constellations] = await Promise.all([
        objectAPI.getAll(),
        logAPI.getByUser(user.id),
        constellationAPI.getAll()
      ]);
      
      // Calculate recent activity (logs from current week)
      const today = new Date();
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const recent = logs.filter(log => new Date(log.ObservationDate || '') >= weekAgo).length;

      setStats({
        totalObservations: logs.length,
        totalObjects: objects.length,
        savedConstellations: constellations.length,
        recentActivity: recent
      });
    } catch (err) {
      console.error('Failed to load stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const objectTypeData = [
    { name: 'Stars', value: 45, color: '#fbbf24' },
    { name: 'Galaxies', value: 32, color: '#8b5cf6' },
    { name: 'Nebulae', value: 28, color: '#06b6d4' },
    { name: 'Exoplanets', value: 23, color: '#ec4899' },
  ];

  const observationTimeline = [
    { month: 'Jan', observations: 4 },
    { month: 'Feb', observations: 7 },
    { month: 'Mar', observations: 5 },
    { month: 'Apr', observations: 9 },
    { month: 'May', observations: 8 },
    { month: 'Jun', observations: 14 },
  ];

  const recentObservations = [
    { id: 1, object: 'Andromeda Galaxy', date: '2024-06-15', type: 'Galaxy' },
    { id: 2, object: 'Orion Nebula', date: '2024-06-12', type: 'Nebula' },
    { id: 3, object: 'Betelgeuse', date: '2024-06-08', type: 'Star' },
    { id: 4, object: 'Proxima Centauri b', date: '2024-06-05', type: 'Exoplanet' },
  ];

  return (
    <div className="flex min-h-screen">
      <Sidebar user={user} currentPage="dashboard" onNavigate={onNavigate} onLogout={onLogout} />
      
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h2 className="mb-2">Welcome back, {user?.username}!</h2>
            <p className="text-gray-400">Here's what's happening in your observatory.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="cosmic-card p-6 hover:cosmic-glow transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center border border-purple-500/30">
                  <BookOpen className="w-6 h-6 text-purple-400" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <p className="text-3xl mb-1">{stats.totalObservations}</p>
              <p className="text-sm text-gray-400">Total Observations</p>
            </div>

            <div className="cosmic-card p-6 hover:cosmic-glow transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center border border-cyan-500/30">
                  <Star className="w-6 h-6 text-cyan-400" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <p className="text-3xl mb-1">{stats.totalObjects}</p>
              <p className="text-sm text-gray-400">Celestial Objects</p>
            </div>

            <div className="cosmic-card p-6 hover:cosmic-glow transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-pink-500/20 rounded-lg flex items-center justify-center border border-pink-500/30">
                  <Globe className="w-6 h-6 text-pink-400" />
                </div>
              </div>
              <p className="text-3xl mb-1">{stats.savedConstellations}</p>
              <p className="text-sm text-gray-400">Constellations</p>
            </div>

            <div className="cosmic-card p-6 hover:cosmic-glow transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center border border-purple-500/30">
                  <Star className="w-6 h-6 text-purple-400" />
                </div>
              </div>
              <p className="text-3xl mb-1">{stats.recentActivity}</p>
              <p className="text-sm text-gray-400">This Week</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h3 className="mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => onNavigate('observation-log-form')}
                className="cosmic-card p-6 hover:cosmic-glow transition-all text-left group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center group-hover:cosmic-glow-strong transition-all">
                    <Plus className="w-6 h-6" />
                  </div>
                  <div>
                    <h5 className="mb-1">Add Observation</h5>
                    <p className="text-sm text-gray-400">Log a new celestial observation</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => onNavigate('celestial-objects')}
                className="cosmic-card p-6 hover:cosmic-glow transition-all text-left group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-cyan-600 rounded-lg flex items-center justify-center group-hover:cosmic-glow-strong transition-all">
                    <Star className="w-6 h-6" />
                  </div>
                  <div>
                    <h5 className="mb-1">Browse Objects</h5>
                    <p className="text-sm text-gray-400">Explore celestial catalog</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => onNavigate('observation-logs')}
                className="cosmic-card p-6 hover:cosmic-glow transition-all text-left group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-pink-600 rounded-lg flex items-center justify-center group-hover:cosmic-glow-strong transition-all">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <h5 className="mb-1">View My Logs</h5>
                    <p className="text-sm text-gray-400">Review observation history</p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* Object Types Chart */}
            <div className="cosmic-card p-6">
              <h4 className="mb-6">Objects by Type</h4>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={objectTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {objectTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--cosmic-card)', 
                      border: '1px solid var(--cosmic-border)',
                      borderRadius: '8px',
                      color: 'var(--cosmic-text)'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Observations Timeline */}
            <div className="cosmic-card p-6">
              <h4 className="mb-6">Observation Timeline</h4>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={observationTimeline}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--cosmic-border)" />
                  <XAxis dataKey="month" stroke="var(--cosmic-text-muted)" />
                  <YAxis stroke="var(--cosmic-text-muted)" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--cosmic-card)', 
                      border: '1px solid var(--cosmic-border)',
                      borderRadius: '8px',
                      color: 'var(--cosmic-text)'
                    }} 
                  />
                  <Line type="monotone" dataKey="observations" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: '#8b5cf6', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Observations */}
          <div className="cosmic-card p-6">
            <h4 className="mb-6">Recent Observations</h4>
            <div className="space-y-4">
              {recentObservations.map((obs) => (
                <div key={obs.id} className="flex items-center justify-between p-4 bg-[var(--cosmic-surface)] rounded-lg hover:bg-[var(--cosmic-border)] transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
                      <Star className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="mb-1">{obs.object}</h5>
                      <p className="text-sm text-gray-400">{obs.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">{obs.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
