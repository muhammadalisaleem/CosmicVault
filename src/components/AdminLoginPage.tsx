import { useState } from 'react';
import { Shield, AlertCircle } from 'lucide-react';

interface AdminLoginPageProps {
  onAdminLogin: () => void;
  onBack: () => void;
}

export function AdminLoginPage({ onAdminLogin, onBack }: AdminLoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Admin credentials check
      if (username === 'admin' && password === 'admin123') {
        // Store admin session
        localStorage.setItem('cosmicvault_admin', JSON.stringify({
          username: 'admin',
          isAdmin: true,
          loginTime: new Date().toISOString()
        }));
        onAdminLogin();
      } else {
        setError('Invalid admin credentials');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="cosmic-card p-8 max-w-md w-full cosmic-glow relative z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8" />
          </div>
          <h2 className="mb-2">Admin Access</h2>
          <p className="text-gray-400">Enter administrator credentials</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm mb-2 text-gray-300">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-[var(--cosmic-surface)] border border-[var(--cosmic-border)] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
              placeholder="admin"
              required
              autoComplete="username"
            />
          </div>

          <div>
            <label className="block text-sm mb-2 text-gray-300">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-[var(--cosmic-surface)] border border-[var(--cosmic-border)] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 disabled:opacity-50 text-white rounded-lg transition-all cosmic-glow hover:cosmic-glow-strong"
          >
            {loading ? 'Authenticating...' : 'Access Admin Panel'}
          </button>

          <button
            type="button"
            onClick={onBack}
            className="w-full py-3 bg-transparent border border-[var(--cosmic-border)] hover:bg-[var(--cosmic-card)] text-white rounded-lg transition-all"
          >
            Back to Main Site
          </button>
        </form>

        <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <p className="text-sm text-yellow-300">
            <strong>Admin Access Only:</strong> This area is restricted to system administrators.
          </p>
        </div>
      </div>
    </div>
  );
}
