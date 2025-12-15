import React, { useState } from 'react';
import { loginUser, registerUser } from '../services/storage';
import { User } from '../types';
import { Lock, User as UserIcon, LogIn, UserPlus } from 'lucide-react';

interface AuthProps {
  onLoginSuccess: () => void;
}

const Auth: React.FC<AuthProps> = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Veuillez remplir tous les champs.');
      return;
    }

    if (isLogin) {
      const success = loginUser(username, password);
      if (success) {
        onLoginSuccess();
      } else {
        setError('Nom d\'utilisateur ou mot de passe incorrect.');
      }
    } else {
      const newUser: User = { username, passwordHash: password };
      const success = registerUser(newUser);
      if (success) {
        // Auto login after register
        loginUser(username, password);
        onLoginSuccess();
      } else {
        setError('Ce nom d\'utilisateur existe déjà.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-200">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 mb-4">
            <Lock size={32} />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">
            {isLogin ? 'Connexion' : 'Inscription'}
          </h1>
          <p className="text-slate-500 mt-2">
            Bienvenue sur Organisa-Simple
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nom d'utilisateur</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserIcon size={18} className="text-slate-400" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="Votre nom"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Mot de passe</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-slate-400" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm bg-red-50 p-2 rounded border border-red-200">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full flex justify-center items-center gap-2 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all font-medium"
          >
            {isLogin ? <><LogIn size={18}/> Se connecter</> : <><UserPlus size={18}/> Créer un compte</>}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
          >
            {isLogin ? "Pas encore de compte ? S'inscrire" : "Déjà un compte ? Se connecter"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
