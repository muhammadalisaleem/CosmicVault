import { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { SignupPage } from './components/SignupPage';
import { Dashboard } from './components/Dashboard';
import { CelestialObjects } from './components/CelestialObjects';
import { CelestialObjectForm } from './components/CelestialObjectForm';
import { ObservationLogs } from './components/ObservationLogs';
import { ObservationLogForm } from './components/ObservationLogForm';
import { Constellations } from './components/Constellations';
import { UserProfile } from './components/UserProfile';
import { AdminPanel } from './components/AdminPanel';
import { AdminLoginPage } from './components/AdminLoginPage';

export type Page = 
  | 'landing' 
  | 'login' 
  | 'signup' 
  | 'dashboard' 
  | 'celestial-objects' 
  | 'celestial-object-form' 
  | 'observation-logs' 
  | 'observation-log-form' 
  | 'constellations' 
  | 'profile'
  | 'admin'
  | 'admin-login';

export interface User {
  id: number;
  username: string;
  email: string;
  memberSince: string;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingObjectId, setEditingObjectId] = useState<number | null>(null);

  // Load user and admin session from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('cosmicvault_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    const savedAdmin = localStorage.getItem('cosmicvault_admin');
    if (savedAdmin) {
      setIsAdmin(true);
    }
  }, []);

  const navigate = (page: Page) => {
    setCurrentPage(page);
  };

  const handleLogin = (userData: User) => {
    setUser(userData);
    // Save user to localStorage for persistence
    localStorage.setItem('cosmicvault_user', JSON.stringify(userData));
    navigate('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('cosmicvault_user');
    navigate('landing');
  };

  const handleAdminLogin = () => {
    setIsAdmin(true);
    navigate('admin');
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('cosmicvault_admin');
    navigate('landing');
  };

  const handleEditObject = (id: number) => {
    setEditingObjectId(id);
    navigate('celestial-object-form');
  };

  const handleNewObject = () => {
    setEditingObjectId(null);
    navigate('celestial-object-form');
  };

  return (
    <div className="min-h-screen cosmic-gradient">
      {currentPage === 'landing' && <LandingPage onNavigate={navigate} />}
      {currentPage === 'login' && <LoginPage onNavigate={navigate} onLogin={handleLogin} />}
      {currentPage === 'signup' && <SignupPage onNavigate={navigate} onLogin={handleLogin} />}
      {currentPage === 'dashboard' && <Dashboard user={user} onNavigate={navigate} onLogout={handleLogout} />}
      {currentPage === 'celestial-objects' && <CelestialObjects user={user} onNavigate={navigate} onLogout={handleLogout} onEdit={handleEditObject} onNew={handleNewObject} />}
      {currentPage === 'celestial-object-form' && <CelestialObjectForm user={user} onNavigate={navigate} onLogout={handleLogout} editingId={editingObjectId} />}
      {currentPage === 'observation-logs' && <ObservationLogs user={user} onNavigate={navigate} onLogout={handleLogout} />}
      {currentPage === 'observation-log-form' && <ObservationLogForm user={user} onNavigate={navigate} onLogout={handleLogout} />}
      {currentPage === 'constellations' && <Constellations user={user} onNavigate={navigate} onLogout={handleLogout} />}
      {currentPage === 'profile' && <UserProfile user={user} onNavigate={navigate} onLogout={handleLogout} />}
      {currentPage === 'admin-login' && <AdminLoginPage onAdminLogin={handleAdminLogin} onBack={() => navigate('landing')} />}
      {currentPage === 'admin' && isAdmin && <AdminPanel onNavigate={navigate} onLogout={handleAdminLogout} />}
    </div>
  );
}
