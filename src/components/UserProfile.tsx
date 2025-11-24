import { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { User as UserIcon, Mail, Calendar, Star, Eye, Trash2, Lock } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import type { Page, User } from '../App';
import { logAPI, objectAPI } from '../services/api';

interface UserProfileProps {
  user: User | null;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
}

export function UserProfile({ user, onNavigate, onLogout }: UserProfileProps) {
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userStats, setUserStats] = useState({
    totalObservations: 0,
    totalObjects: 0,
    favoriteConstellations: 0,
    observationHours: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserStats();
  }, [user]);

  const loadUserStats = async () => {
    try {
      const [logs, objects] = await Promise.all([
        logAPI.getAll(),
        objectAPI.getAll()
      ]);
      // Filter user's logs
      const userLogs = logs.filter((log: any) => log.UserID === user?.id);
      // Calculate hours (assuming average 4 hours per observation)
      const hours = userLogs.length * 4;
      setUserStats({
        totalObservations: userLogs.length,
        totalObjects: objects.length,
        favoriteConstellations: 12,
        observationHours: hours
      });
    } catch (err) {
      console.error('Failed to load stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const observationCategories = [
    { name: 'Stars', value: 18, color: '#fbbf24' },
    { name: 'Galaxies', value: 15, color: '#8b5cf6' },
    { name: 'Nebulae', value: 8, color: '#06b6d4' },
    { name: 'Exoplanets', value: 6, color: '#ec4899' },
  ];

  const recentActivity = [
    { date: '2024-06-15', action: 'Observed Andromeda Galaxy', type: 'observation' },
    { date: '2024-06-12', action: 'Added Orion Nebula to catalog', type: 'catalog' },
    { date: '2024-06-10', action: 'Updated profile information', type: 'profile' },
    { date: '2024-06-08', action: 'Logged observation of Betelgeuse', type: 'observation' },
  ];

  return (
    <div className="flex min-h-screen">
      <Sidebar user={user} currentPage="profile" onNavigate={onNavigate} onLogout={onLogout} />
      
      <div className="flex-1 overflow-auto">
        <div className="p-8 max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <h2 className="mb-2">My Profile</h2>
            <p className="text-gray-400">Manage your account and view your activity</p>
          </div>

          {/* Profile Card */}
          <div className="cosmic-card p-8 mb-6">
            <div className="flex items-start gap-8">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center text-4xl">
                {user?.username.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <h3 className="mb-4">{user?.username}</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-gray-300">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <span>{user?.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <span>Member since {user?.memberSince}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => setShowChangePassword(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white rounded-lg transition-all border border-purple-600/30"
                >
                  <Lock className="w-5 h-5" />
                  Change Password
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white rounded-lg transition-all border border-red-600/30"
                >
                  <Trash2 className="w-5 h-5" />
                  Delete Account
                </button>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="cosmic-card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center border border-purple-500/30">
                  <Eye className="w-6 h-6 text-purple-400" />
                </div>
              </div>
              <p className="text-3xl mb-1">{userStats.totalObservations}</p>
              <p className="text-sm text-gray-400">Total Observations</p>
            </div>

            <div className="cosmic-card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center border border-cyan-500/30">
                  <Star className="w-6 h-6 text-cyan-400" />
                </div>
              </div>
              <p className="text-3xl mb-1">{userStats.totalObjects}</p>
              <p className="text-sm text-gray-400">Objects Cataloged</p>
            </div>

            <div className="cosmic-card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-pink-500/20 rounded-lg flex items-center justify-center border border-pink-500/30">
                  <UserIcon className="w-6 h-6 text-pink-400" />
                </div>
              </div>
              <p className="text-3xl mb-1">{userStats.favoriteConstellations}</p>
              <p className="text-sm text-gray-400">Constellations</p>
            </div>

            <div className="cosmic-card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center border border-purple-500/30">
                  <Calendar className="w-6 h-6 text-purple-400" />
                </div>
              </div>
              <p className="text-3xl mb-1">{userStats.observationHours}</p>
              <p className="text-sm text-gray-400">Hours Observing</p>
            </div>
          </div>

          {/* Activity Grid */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Most Observed Categories */}
            <div className="cosmic-card p-6">
              <h4 className="mb-6">Most Observed Categories</h4>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={observationCategories}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {observationCategories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Recent Activity */}
            <div className="cosmic-card p-6">
              <h4 className="mb-6">Recent Activity</h4>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-4 p-3 bg-[var(--cosmic-surface)] rounded-lg">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === 'observation' ? 'bg-purple-400' :
                      activity.type === 'catalog' ? 'bg-cyan-400' : 'bg-pink-400'
                    }`}></div>
                    <div className="flex-1">
                      <p className="text-gray-300">{activity.action}</p>
                      <p className="text-sm text-gray-400 mt-1">{activity.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {showChangePassword && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-6">
          <div className="cosmic-card p-8 max-w-md w-full cosmic-glow">
            <h3 className="mb-6">Change Password</h3>
            <form className="space-y-6">
              <div>
                <label className="block text-sm mb-2 text-gray-300">Current Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-3 bg-[var(--cosmic-surface)] border border-[var(--cosmic-border)] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                  placeholder="Enter current password"
                />
              </div>
              <div>
                <label className="block text-sm mb-2 text-gray-300">New Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-3 bg-[var(--cosmic-surface)] border border-[var(--cosmic-border)] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label className="block text-sm mb-2 text-gray-300">Confirm New Password</label>
                <input
                  type="password"
                  className="w-full px-4 py-3 bg-[var(--cosmic-surface)] border border-[var(--cosmic-border)] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                  placeholder="Confirm new password"
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-all cosmic-glow hover:cosmic-glow-strong"
                >
                  Update Password
                </button>
                <button
                  type="button"
                  onClick={() => setShowChangePassword(false)}
                  className="flex-1 py-3 bg-transparent border border-[var(--cosmic-border)] hover:bg-[var(--cosmic-card)] text-white rounded-lg transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Account Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-6">
          <div className="cosmic-card p-8 max-w-md w-full border-2 border-red-500/30">
            <h3 className="mb-4 text-red-400">Delete Account</h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  onLogout();
                }}
                className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-all"
              >
                Yes, Delete My Account
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-3 bg-transparent border border-[var(--cosmic-border)] hover:bg-[var(--cosmic-card)] text-white rounded-lg transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
