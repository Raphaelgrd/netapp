import React, { useState, useEffect } from 'react';
import Auth from './components/Auth';
import FileBrowser from './components/FileBrowser';
import { AuthState } from './types';
import { getCurrentUser, logoutUser } from './services/storage';
import { LogOut, User } from 'lucide-react';

const App: React.FC = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    currentUser: null,
  });

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setAuthState({ isAuthenticated: true, currentUser: user });
    }
  }, []);

  const handleLoginSuccess = () => {
    const user = getCurrentUser();
    setAuthState({ isAuthenticated: true, currentUser: user });
  };

  const handleLogout = () => {
    logoutUser();
    setAuthState({ isAuthenticated: false, currentUser: null });
  };

  if (!authState.isAuthenticated || !authState.currentUser) {
    return <Auth onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 shadow-sm z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
            O
          </div>
          <span className="font-bold text-lg tracking-tight text-slate-800">Organisa-Simple</span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full border border-slate-200">
            <User size={16} className="text-slate-500" />
            <span className="text-sm font-medium text-slate-700">{authState.currentUser}</span>
          </div>
          <button 
            onClick={handleLogout}
            className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Se déconnecter"
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden flex flex-col">
        <FileBrowser username={authState.currentUser} />
      </main>
    </div>
  );
};

export default App;