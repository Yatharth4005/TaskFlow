import React from 'react';
import { Link } from 'react-router-dom';
import { CheckSquare, ArrowLeft, HelpCircle } from 'lucide-react';
import useAuth from '../hooks/useAuth';

export const NotFound = () => {
  const { user } = useAuth();
  const backTarget = user ? (user.role === 'admin' ? '/admin' : '/dashboard') : '/';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 text-center">
      <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 border border-blue-100 shadow-sm">
        <HelpCircle className="w-8 h-8" />
      </div>

      <h1 className="text-6xl font-black text-slate-900 tracking-tight">404</h1>
      <h2 className="text-2xl font-bold text-slate-800 mt-2">Page Not Found</h2>
      <p className="text-slate-500 text-sm mt-2 max-w-md">
        The page you are looking for does not exist, has been removed, or is temporarily unavailable.
      </p>

      <div className="mt-8">
        <Link
          to={backTarget}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to {user ? 'Dashboard' : 'Homepage'}</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

