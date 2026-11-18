import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  CheckSquare, 
  LayoutDashboard, 
  ListTodo, 
  ShieldCheck, 
  LogOut, 
  Users,
  X
} from 'lucide-react';
import useAuth from '../hooks/useAuth';

export const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isAdmin = user?.role === 'admin';

  const userLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'My Tasks', path: '/dashboard', icon: ListTodo }
  ];

  const adminLinks = [
    { name: 'Admin Overview', path: '/admin', icon: LayoutDashboard },
    { name: 'All Tasks', path: '/admin', icon: CheckSquare }
  ];

  const links = isAdmin ? adminLinks : userLinks;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          onClick={onClose} 
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Header & Logo */}
          <div className="h-16 px-6 flex items-center justify-between border-b border-slate-100">
            <NavLink to={isAdmin ? '/admin' : '/dashboard'} className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/30">
                <CheckSquare className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">TaskFlow</span>
            </NavLink>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 md:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="p-4 space-y-1">
            <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {isAdmin ? 'Administrator Area' : 'Workspace'}
            </div>
            {links.map((link, idx) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={idx}
                  to={link.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 font-semibold shadow-xs'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.name}</span>
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* User Profile & Logout section */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3 px-2 py-2 mb-2">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm border border-blue-200">
              {user?.name ? user.name.charAt(0).toUpperCase() : (user?.username?.charAt(0).toUpperCase() || 'U')}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">{user?.name || user?.username}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-medium uppercase tracking-wider ${
                  isAdmin ? 'bg-purple-100 text-purple-700 font-bold' : 'bg-blue-100 text-blue-700'
                }`}>
                  {isAdmin && <ShieldCheck className="w-3 h-3 mr-0.5" />}
                  {user?.role}
                </span>
                <span className="text-xs text-slate-400 truncate">@{user?.username}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50/80 transition-colors border border-slate-200/60 bg-white shadow-xs"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

