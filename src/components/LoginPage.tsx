import { useState } from 'react';
import { ArrowLeft, Telescope } from 'lucide-react';
import type { Page, User } from '../App';
import { userAPI } from '../services/api';

interface LoginPageProps {
  onNavigate: (page: Page) => void;
  onLogin: (user: User) => void;
}

export function LoginPage({ onNavigate, onLogin }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (!username || !password) {
        setError('Please enter username and password');
        return;
      }

      // Call backend API to login
      const userData = await userAPI.login(username, password);
      
      // Create User object with response data
      const user: User = {
        id: userData.UserID,
        username: userData.username,
        email: userData.email,
        memberSince: new Date().toISOString().split('T')[0]
      };
      
      console.log('Login successful:', user);
      onLogin(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-6">
      {/* Background */}
      <div className="absolute inset-0 starfield opacity-30"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-cyan-900/20"></div>

      {/* Back button */}
      <button
        onClick={() => onNavigate('landing')}
        className="absolute top-6 left-6 flex items-center gap-2 text-gray-400 hover:text-purple-300 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="cosmic-card p-8 cosmic-glow">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-purple-500 blur-2xl opacity-30"></div>
              <Telescope className="w-16 h-16 text-purple-400 relative" strokeWidth={1.5} />
            </div>
          </div>

          <h2 className="text-center mb-2">Welcome Back</h2>
          <p className="text-center text-gray-400 mb-8">Log in to your Cosmic Vault</p>

          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm mb-2 text-gray-300">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-[var(--cosmic-surface)] border border-[var(--cosmic-border)] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                placeholder="Enter your username"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm mb-2 text-gray-300">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-[var(--cosmic-surface)] border border-[var(--cosmic-border)] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <button type="button" className="text-purple-400 hover:text-purple-300 transition-colors">
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-600 text-white rounded-lg transition-all cosmic-glow hover:cosmic-glow-strong"
            >
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Don't have an account?{' '}
              <button
                onClick={() => onNavigate('signup')}
                className="text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                Create a new account
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
