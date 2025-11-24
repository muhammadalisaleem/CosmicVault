import { Home, Star, BookOpen, User, Settings, LogOut, Telescope } from 'lucide-react';
import type { Page, User as UserType } from '../App';

interface SidebarProps {
  user: UserType | null;
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
}

export function Sidebar({ user, currentPage, onNavigate, onLogout }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard' as Page, label: 'Dashboard', icon: Home },
    { id: 'celestial-objects' as Page, label: 'Celestial Objects', icon: Star },
    { id: 'observation-logs' as Page, label: 'Observations', icon: BookOpen },
    { id: 'constellations' as Page, label: 'Constellations', icon: Telescope },
    { id: 'profile' as Page, label: 'Profile', icon: User },
    { id: 'admin' as Page, label: 'Admin Panel', icon: Settings },
  ];

  return (
    <div className="w-64 min-h-screen bg-[var(--cosmic-surface)] border-r border-[var(--cosmic-border)] flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-[var(--cosmic-border)]">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-purple-500 blur-xl opacity-30"></div>
            <Telescope className="w-8 h-8 text-purple-400 relative" strokeWidth={1.5} />
          </div>
          <div>
            <h4 className="bg-gradient-to-r from-purple-300 to-cyan-300 bg-clip-text text-transparent">
              Cosmic Vault
            </h4>
          </div>
        </div>
      </div>

      {/* User Info */}
      {user && (
        <div className="p-6 border-b border-[var(--cosmic-border)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
              <span>{user.username.charAt(0).toUpperCase()}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate">{user.username}</p>
              <p className="text-sm text-gray-400 truncate">{user.email}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-purple-600 text-white cosmic-glow'
                      : 'text-gray-400 hover:bg-[var(--cosmic-card)] hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-[var(--cosmic-border)]">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
