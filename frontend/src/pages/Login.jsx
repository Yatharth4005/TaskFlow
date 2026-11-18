import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  CheckSquare, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  Loader2, 
  AlertCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import useAuth from '../hooks/useAuth';

export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDemoCreds, setShowDemoCreds] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError('Please provide both username and password.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const loggedUser = await login(username.trim(), password);

      if (from) {
        navigate(from, { replace: true });
      } else if (loggedUser.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Invalid username or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDemoUser = (user, pass) => {
    setUsername(user);
    setPassword(pass);
    setError('');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-slate-50 relative">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2.5 mb-4 group">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/30 group-hover:scale-105 transition-transform">
            <CheckSquare className="w-6 h-6 stroke-[2.2]" />
          </div>
          <span className="text-2xl font-bold text-slate-900 tracking-tight">TaskFlow</span>
        </Link>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Enter your credentials to access your task dashboard
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-xl shadow-slate-200/50 rounded-2xl border border-slate-200/80 sm:px-10">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-700 text-sm">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div className="flex-1">{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="username" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Username
              </label>
              <div className="relative rounded-lg">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. piyush or admin"
                  className="block w-full pl-10 pr-3.5 py-2.5 text-sm text-slate-900 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 placeholder:text-slate-400 transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
              </div>
              <div className="relative rounded-lg">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="block w-full pl-10 pr-10 py-2.5 text-sm text-slate-900 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 placeholder:text-slate-400 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm shadow-blue-500/30 transition-all hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? 'Authenticating...' : 'Sign In'}
              </button>
            </div>
          </form>

          {/* Prominent Link to Create Account / Register */}
          <div className="mt-5 text-center p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <p className="text-sm text-slate-600">
              New to TaskFlow?{' '}
              <Link to="/register" className="font-bold text-blue-600 hover:text-blue-700 hover:underline">
                Create an account
              </Link>
            </p>
          </div>

          {/* Quick Demo Helper Accordion */}
          <div className="mt-5 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowDemoCreds(!showDemoCreds)}
              className="w-full flex items-center justify-between text-xs text-slate-500 hover:text-slate-800 transition-colors"
            >
              <span className="flex items-center gap-1.5 font-medium">
                <HelpCircle className="w-3.5 h-3.5 text-blue-500" />
                Need quick demo credentials?
              </span>
              {showDemoCreds ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showDemoCreds && (
              <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-2">
                <p className="font-semibold text-slate-700">Click any account to fill:</p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleSelectDemoUser('admin', 'Admin@123')}
                    className="p-2 text-left rounded-lg bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition-colors"
                  >
                    <span className="font-bold text-slate-800 block">admin</span>
                    <span className="text-[10px] text-purple-600 font-semibold block uppercase">Admin Role</span>
                    <span className="text-[10px] text-slate-400 font-mono">Admin@123</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectDemoUser('piyush', 'User@123')}
                    className="p-2 text-left rounded-lg bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition-colors"
                  >
                    <span className="font-bold text-slate-800 block">piyush</span>
                    <span className="text-[10px] text-blue-600 font-semibold block uppercase">User Role</span>
                    <span className="text-[10px] text-slate-400 font-mono">User@123</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectDemoUser('rahul', 'User@123')}
                    className="p-2 text-left rounded-lg bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition-colors"
                  >
                    <span className="font-bold text-slate-800 block">rahul</span>
                    <span className="text-[10px] text-blue-600 font-semibold block uppercase">User Role</span>
                    <span className="text-[10px] text-slate-400 font-mono">User@123</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectDemoUser('amit', 'User@123')}
                    className="p-2 text-left rounded-lg bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition-colors"
                  >
                    <span className="font-bold text-slate-800 block">amit</span>
                    <span className="text-[10px] text-blue-600 font-semibold block uppercase">User Role</span>
                    <span className="text-[10px] text-slate-400 font-mono">User@123</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link to="/" className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">
            ← Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
