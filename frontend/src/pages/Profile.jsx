import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Mail, Calendar, ArrowLeft } from 'lucide-react';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[var(--color-dark-bg)] text-white font-sans p-6">
      
      {/* Header */}
      <div className="max-w-4xl mx-auto flex items-center justify-between mb-10">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar
        </button>
        <h1 className="text-2xl font-bold tracking-tight">Meu Perfil</h1>
        <div className="w-16"></div> {/* Spacer to center title */}
      </div>

      {/* Main Profile Card */}
      <div className="max-w-2xl mx-auto">
        <div className="p-8 rounded-3xl bg-gray-800/40 border border-gray-700/50 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          
          {/* Decorative Background Glows */}
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-[var(--color-neon)] opacity-10 blur-3xl rounded-full"></div>
          <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-emerald-500 opacity-10 blur-3xl rounded-full"></div>

          <div className="relative z-10 flex flex-col items-center">
            
            {/* Avatar Section */}
            <div className="relative mb-6">
              {user.avatarUrl ? (
                <img 
                  src={user.avatarUrl} 
                  alt={user.name} 
                  className="w-32 h-32 rounded-full object-cover border-4 border-gray-800 shadow-xl"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-[var(--color-neon)] to-blue-500 p-1 shadow-xl">
                  <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center">
                     <span className="text-4xl font-bold text-white">
                        {user.name.charAt(0).toUpperCase()}
                     </span>
                  </div>
                </div>
              )}
            </div>

            {/* User Details */}
            <h2 className="text-3xl font-bold text-white mb-2">{user.name}</h2>
            <p className="text-gray-400 flex items-center gap-2 mb-8">
               <Mail className="w-4 h-4" /> 
               {user.email}
            </p>

            <div className="w-full h-px bg-gray-700/50 my-6"></div>

            {/* Logout Action */}
            <button 
              onClick={handleLogout}
              className="w-full md:w-auto px-8 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 font-medium transition-all flex items-center justify-center gap-3 hover:-translate-y-1 hover:shadow-lg hover:shadow-red-500/10"
            >
              <LogOut className="w-5 h-5" />
              Sair da Conta
            </button>
            
          </div>
        </div>
      </div>
    </div>
  );
}
