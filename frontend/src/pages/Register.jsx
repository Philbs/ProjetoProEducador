import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, UserPlus } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const result = await register(name, email, password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[10%] left-[-5%] w-96 h-96 bg-[var(--color-accent-low)] rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-pulse"></div>
      <div className="absolute bottom-[-5%] right-[-5%] w-96 h-96 bg-[var(--color-neon)] rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-pulse delay-500"></div>

      <div className="w-full max-w-md bg-[var(--color-dark-card)] p-8 rounded-2xl shadow-2xl border border-gray-800 relative z-10 transition-all duration-300 hover:border-gray-700">
        <div className="text-center mb-8">
          <div className="bg-[var(--color-dark-bg)] w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner border border-gray-800">
            <LayoutDashboard className="w-8 h-8 text-[var(--color-accent-low)]" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Create Account</h1>
          <p className="text-[var(--color-text-muted)] text-sm">Start organizing your tasks today</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
            <p className="text-red-400 text-sm font-medium text-center">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
           <div className="space-y-1">
            <label htmlFor="reg-name" className="text-sm font-medium text-gray-300 ml-1">Full Name</label>
            <input
              id="reg-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[var(--color-dark-bg)] border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[var(--color-accent-low)] focus:ring-1 focus:ring-[var(--color-accent-low)] transition-all"
              placeholder="John Doe"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="reg-email" className="text-sm font-medium text-gray-300 ml-1">Email Address</label>
            <input
              id="reg-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[var(--color-dark-bg)] border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[var(--color-accent-low)] focus:ring-1 focus:ring-[var(--color-accent-low)] transition-all"
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="reg-password" className="text-sm font-medium text-gray-300 ml-1">Password</label>
            <input
              id="reg-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
               className="w-full bg-[var(--color-dark-bg)] border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[var(--color-accent-low)] focus:ring-1 focus:ring-[var(--color-accent-low)] transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-gradient-to-r from-[var(--color-accent-low)] to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold py-3 px-4 rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group"
          >
            {loading ? 'Creating...' : (
              <>
                Create Account
                <UserPlus className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-[var(--color-text-muted)]">
          Already have an account?{' '}
          <Link to="/login" className="text-[var(--color-accent-low)] hover:text-blue-400 font-medium transition-colors">
            Sign in instead
          </Link>
        </p>
      </div>
    </div>
  );
}
