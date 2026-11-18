import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { 
  CheckSquare, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Circle, 
  Layers, 
  Lock, 
  UserCheck, 
  Sparkles,
  Database,
  Cpu,
  Code2
} from 'lucide-react';
import useAuth from '../hooks/useAuth';

export const Home = () => {
  const { user } = useAuth();
  const targetUrl = user ? (user.role === 'admin' ? '/admin' : '/dashboard') : '/login';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.blue.100),theme(colors.slate.50))] opacity-60" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/80 mb-6 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Modern SaaS Productivity Platform</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-[1.15]">
            Organize your work. <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Get things done.
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            TaskFlow gives teams and individual contributors the clarity to track daily responsibilities, monitor progress milestones, and maintain absolute data ownership.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={targetUrl}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/25 transition-all hover:scale-[1.02]"
            >
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#features"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-300/80 shadow-xs transition-colors"
            >
              <span>Explore Features</span>
            </a>
          </div>

          {/* Interactive Live-Feel Dashboard Preview */}
          <div className="mt-14 max-w-4xl mx-auto">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-3 sm:p-5 shadow-2xl shadow-slate-200/50 text-left">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <span className="ml-3 text-xs font-semibold text-slate-500 hidden sm:inline">TaskFlow Dashboard — Overview</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                  Live Sync
                </div>
              </div>

              {/* Mock Dashboard Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
                  <p className="text-xs text-slate-500 font-medium">Total Tasks</p>
                  <p className="text-xl font-bold text-slate-900 mt-1">12</p>
                </div>
                <div className="p-3.5 rounded-xl bg-blue-50/50 border border-blue-100">
                  <p className="text-xs text-blue-600 font-medium">In Progress</p>
                  <p className="text-xl font-bold text-blue-700 mt-1">4</p>
                </div>
                <div className="p-3.5 rounded-xl bg-green-50/50 border border-green-100">
                  <p className="text-xs text-green-600 font-medium">Completed</p>
                  <p className="text-xl font-bold text-green-700 mt-1">8</p>
                </div>
              </div>

              {/* Mock Task List */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Design System Architecture</p>
                      <p className="text-xs text-slate-500">Define backend models and REST API contract</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                    Done
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Implement Authentication Module</p>
                      <p className="text-xs text-slate-500">Configure express-session and bcrypt hashing</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                    In Progress
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center gap-3">
                    <Circle className="w-4 h-4 text-slate-400 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Run Automated Jest Test Suite</p>
                      <p className="text-xs text-slate-500">Verify unit tests and API permissions</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                    To Do
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section id="features" className="py-20 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-blue-600 uppercase tracking-widest">Capabilities</h2>
            <p className="mt-2 text-3xl font-bold text-slate-900 tracking-tight sm:text-4xl">
              Engineered for clarity and reliability
            </p>
            <p className="mt-4 text-base text-slate-600 leading-relaxed">
              TaskFlow combines lightweight in-memory storage performance with enterprise-grade authorization and session management.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-5">
                <CheckSquare className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Personal Task Management</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Create, organize, update, and delete your tasks with zero friction. Each user operates in a strictly isolated workspace.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-5">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Status Lifecycle Tracking</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Transition tasks seamlessly across defined stages: To Do, In Progress, and Done with intuitive visual badges and instant status updates.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-5">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Secure Authentication</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Robust session cookies with HttpOnly and SameSite flags, paired with industry-standard bcrypt cryptographic password hashing.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-5">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Role-Based Access Control</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Multi-tier authorization enforced strictly by backend middleware. Administrators enjoy elevated visibility with owner attribution.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow: 3 Task Statuses */}
      <section id="workflow" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-blue-600 uppercase tracking-widest">Task Lifecycle</h2>
            <p className="mt-2 text-3xl font-bold text-slate-900 tracking-tight sm:text-4xl">
              Three clear stages of execution
            </p>
            <p className="mt-4 text-base text-slate-600">
              Every task begins at To Do and progresses systematically through verification to completion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden">
              <div className="w-2 h-full bg-slate-400 absolute left-0 top-0" />
              <div className="flex items-center gap-3 mb-4">
                <Circle className="w-6 h-6 text-slate-400" />
                <h3 className="text-xl font-bold text-slate-900">To Do</h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Initial state for every newly created item. Backlogged items ready to be prioritized and picked up by assignees.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden">
              <div className="w-2 h-full bg-blue-600 absolute left-0 top-0" />
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-bold text-slate-900">In Progress</h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Active execution stage. Highlights tasks currently receiving active effort and focus from the owner.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden">
              <div className="w-2 h-full bg-green-600 absolute left-0 top-0" />
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
                <h3 className="text-xl font-bold text-slate-900">Done</h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Completed deliverables. Verified outcomes that reflect tangible productivity and archived accomplishment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* User Roles & Permissions */}
      <section id="roles" className="py-20 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-blue-600 uppercase tracking-widest">Access Control</h2>
            <p className="mt-2 text-3xl font-bold text-slate-900 tracking-tight sm:text-4xl">
              Strict isolation for users, unified oversight for admins
            </p>
            <p className="mt-4 text-base text-slate-600">
              Authorization rules are verified on every backend request to prevent data leakage and ID enumeration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Standard User Role */}
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-blue-100 text-blue-600">
                  <UserCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Standard User</h3>
                  <span className="text-xs font-medium text-blue-600">Personal Workspace</span>
                </div>
              </div>
              <ul className="space-y-3 text-sm text-slate-600 mt-6">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                  <span>View only personally created tasks</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                  <span>Create tasks with automatic `todo` initialization</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                  <span>Edit title, description, and status of owned tasks</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                  <span>Zero visibility into or modification of other users' tasks</span>
                </li>
              </ul>
            </div>

            {/* Administrator Role */}
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-purple-100 text-purple-600">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Administrator</h3>
                  <span className="text-xs font-medium text-purple-600">Global System Governance</span>
                </div>
              </div>
              <ul className="space-y-3 text-sm text-slate-600 mt-6">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                  <span>View all tasks created by all users across the organization</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                  <span>Review tasks grouped dynamically by their respective owners</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                  <span>Update or delete any user's task to resolve bottlenecks</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                  <span>Monitor high-level metrics including total user headcounts</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack Section */}
      <section id="stack" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-blue-600 uppercase tracking-widest">Architecture</h2>
            <p className="mt-2 text-3xl font-bold text-slate-900 tracking-tight sm:text-4xl">
              Proven Full-Stack Technology
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
              <Code2 className="w-7 h-7 mx-auto text-blue-600 mb-2" />
              <p className="font-semibold text-slate-900 text-sm">React & Vite</p>
              <p className="text-xs text-slate-500 mt-1">Blazing UI</p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
              <Sparkles className="w-7 h-7 mx-auto text-blue-600 mb-2" />
              <p className="font-semibold text-slate-900 text-sm">Tailwind CSS</p>
              <p className="text-xs text-slate-500 mt-1">SaaS Design</p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
              <Cpu className="w-7 h-7 mx-auto text-blue-600 mb-2" />
              <p className="font-semibold text-slate-900 text-sm">Express.js</p>
              <p className="text-xs text-slate-500 mt-1">Node Backend</p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
              <Lock className="w-7 h-7 mx-auto text-blue-600 mb-2" />
              <p className="font-semibold text-slate-900 text-sm">Bcrypt & Session</p>
              <p className="text-xs text-slate-500 mt-1">Auth & RBAC</p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
              <Database className="w-7 h-7 mx-auto text-blue-600 mb-2" />
              <p className="font-semibold text-slate-900 text-sm">In-Memory</p>
              <p className="text-xs text-slate-500 mt-1">Zero Latency</p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
              <CheckSquare className="w-7 h-7 mx-auto text-blue-600 mb-2" />
              <p className="font-semibold text-slate-900 text-sm">Jest & Supertest</p>
              <p className="text-xs text-slate-500 mt-1">Automated Tests</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-white border-t border-slate-200 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <CheckSquare className="w-4 h-4" />
            </div>
            <span className="font-bold text-slate-900">TaskFlow</span>
            <span className="text-slate-400 text-sm">© {new Date().getFullYear()}</span>
          </div>

          <div className="flex items-center gap-6 text-sm text-slate-600">
            <a href="#features" className="hover:text-blue-600">Features</a>
            <a href="#roles" className="hover:text-blue-600">Roles</a>
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-700">
              Sign In
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;

