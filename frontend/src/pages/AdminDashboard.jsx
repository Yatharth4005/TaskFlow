import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import ConfirmDialog from '../components/ConfirmDialog';
import Pagination from '../components/Pagination';
import api from '../services/api';
import useAuth from '../hooks/useAuth';
import { 
  Users, 
  Layers, 
  Clock, 
  CheckCircle2, 
  Inbox, 
  Search, 
  ShieldCheck, 
  Menu, 
  Loader2, 
  AlertCircle, 
  Check,
  Grid,
  List
} from 'lucide-react';

export const AdminDashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, todo: 0, in_progress: 0, done: 0, totalUsers: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

  const [statusFilter, setStatusFilter] = useState('all');
  const [userFilter, setUserFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grouped');

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const [deleteTaskTarget, setDeleteTaskTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const showToast = (message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [tasksRes, statsRes] = await Promise.all([
        api.get('/tasks'),
        api.get('/tasks/stats')
      ]);
      setTasks(tasksRes.data || []);
      setStats(statsRes.data || { total: 0, todo: 0, in_progress: 0, done: 0, totalUsers: 0 });
    } catch (err) {
      setError(err.message || 'Failed to load administrator data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, userFilter, searchQuery, viewMode]);

  const handleSaveTask = async (taskData) => {
    if (taskData.id) {
      const res = await api.patch(`/tasks/${taskData.id}`, {
        title: taskData.title,
        description: taskData.description,
        status: taskData.status
      });
      setTasks(prev => prev.map(t => (t.id === taskData.id ? res.data : t)));
      showToast('Task updated successfully');
      api.get('/tasks/stats').then(r => setStats(r.data)).catch(() => {});
    }
  };

  const handleStatusChange = async (task, newStatus) => {
    try {
      const res = await api.patch(`/tasks/${task.id}`, { status: newStatus });
      setTasks(prev => prev.map(t => (t.id === task.id ? res.data : t)));
      showToast(`Status updated to ${newStatus.replace('_', ' ')}`);
      api.get('/tasks/stats').then(r => setStats(r.data)).catch(() => {});
    } catch (err) {
      showToast(err.message || 'Failed to update status');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTaskTarget) return;
    try {
      setIsDeleting(true);
      await api.delete(`/tasks/${deleteTaskTarget.id}`);
      setTasks(prev => prev.filter(t => t.id !== deleteTaskTarget.id));
      showToast('Task deleted successfully');
      setDeleteTaskTarget(null);
      api.get('/tasks/stats').then(r => setStats(r.data)).catch(() => {});
    } catch (err) {
      showToast(err.message || 'Failed to delete task');
    } finally {
      setIsDeleting(false);
    }
  };

  const distinctUsers = useMemo(() => {
    const map = new Map();
    tasks.forEach(t => {
      if (t.owner) {
        map.set(t.owner.id, t.owner);
      }
    });
    return Array.from(map.values());
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
      const matchesUser = userFilter === 'all' || task.userId === userFilter;
      const matchesSearch = 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (task.owner?.username && task.owner.username.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (task.owner?.name && task.owner.name.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesStatus && matchesUser && matchesSearch;
    });
  }, [tasks, statusFilter, userFilter, searchQuery]);

  const groupedTasksByOwner = useMemo(() => {
    const groups = {};
    filteredTasks.forEach(task => {
      const ownerKey = task.owner?.username || task.userId || 'unknown';
      if (!groups[ownerKey]) {
        groups[ownerKey] = {
          owner: task.owner || { username: ownerKey, name: ownerKey },
          tasks: []
        };
      }
      groups[ownerKey].tasks.push(task);
    });
    return Object.values(groups);
  }, [filteredTasks]);

  const paginatedTasks = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredTasks.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredTasks, currentPage]);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 md:pl-64 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 md:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-slate-900 leading-tight">Admin Overview</h1>
              <p className="text-xs text-slate-500 hidden sm:block">Monitor and manage tasks across all registered users</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
              Administrator Access
            </span>
          </div>
        </header>

        {notification && (
          <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 text-sm animate-in fade-in slide-in-from-top-4 duration-200">
            <Check className="w-4 h-4 text-green-400" />
            <span>{notification}</span>
          </div>
        )}

        <main className="p-4 sm:p-8 max-w-7xl w-full mx-auto space-y-6">
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 rounded-2xl p-6 sm:p-8 text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-200 border border-purple-400/30 mb-2">
                <ShieldCheck className="w-3.5 h-3.5 text-purple-300" />
                <span>Central Governance</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                System-Wide Task Administration
              </h2>
              <p className="text-slate-300 text-sm mt-1 max-w-xl leading-relaxed">
                Review, filter, update, or remove tasks assigned to any team member across the entire platform.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <StatCard
              title="Total Users"
              value={stats.totalUsers}
              icon={Users}
              color="purple"
              description="Standard accounts"
            />
            <StatCard
              title="Total Tasks"
              value={stats.total}
              icon={Layers}
              color="slate"
              description="System-wide"
            />
            <StatCard
              title="To Do"
              value={stats.todo}
              icon={Inbox}
              color="amber"
              description="Pending start"
            />
            <StatCard
              title="In Progress"
              value={stats.in_progress || stats.inProgress}
              icon={Clock}
              color="blue"
              description="Active work"
            />
            <StatCard
              title="Completed"
              value={stats.done}
              icon={CheckCircle2}
              color="green"
              description="Finished items"
            />
          </div>

          <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 w-full lg:w-auto overflow-x-auto pb-1 lg:pb-0">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  statusFilter === 'all'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All Statuses ({stats.total})
              </button>
              <button
                onClick={() => setStatusFilter('todo')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  statusFilter === 'todo'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                To Do ({stats.todo})
              </button>
              <button
                onClick={() => setStatusFilter('in_progress')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  statusFilter === 'in_progress'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                In Progress ({stats.in_progress || stats.inProgress})
              </button>
              <button
                onClick={() => setStatusFilter('done')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  statusFilter === 'done'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Done ({stats.done})
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
              <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 shrink-0">
                <button
                  onClick={() => setViewMode('grouped')}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                    viewMode === 'grouped'
                      ? 'bg-white text-blue-600 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Grouped by Owner"
                >
                  <Grid className="w-3.5 h-3.5" />
                  <span>Grouped</span>
                </button>
                <button
                  onClick={() => setViewMode('paginated')}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                    viewMode === 'paginated'
                      ? 'bg-white text-blue-600 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Paginated List View"
                >
                  <List className="w-3.5 h-3.5" />
                  <span>Paginated</span>
                </button>
              </div>

              <div className="relative w-full sm:w-44">
                <select
                  value={userFilter}
                  onChange={(e) => setUserFilter(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                >
                  <option value="all">All Users</option>
                  {distinctUsers.map(u => (
                    <option key={u.id} value={u.id}>
                      {u.name || u.username} (@{u.username})
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative w-full sm:w-56">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="Search title, desc, user..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 bg-slate-50/50"
                />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-3" />
              <p className="text-sm font-medium text-slate-600">Retrieving system tasks...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 rounded-2xl border border-red-200 p-8 text-center text-red-700">
              <AlertCircle className="w-8 h-8 mx-auto mb-2 text-red-500" />
              <p className="text-sm font-semibold">{error}</p>
              <button
                onClick={fetchData}
                className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto mb-4">
                <Inbox className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-slate-900">No matching tasks</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                No tasks match your chosen filters. Try resetting the status or user filter.
              </p>
            </div>
          ) : viewMode === 'paginated' ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {paginatedTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    showOwner={true}
                    onEdit={(t) => {
                      setEditingTask(t);
                      setIsModalOpen(true);
                    }}
                    onDelete={(t) => setDeleteTaskTarget(t)}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </div>

              <Pagination
                currentPage={currentPage}
                totalItems={filteredTasks.length}
                itemsPerPage={ITEMS_PER_PAGE}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>
          ) : (
            <div className="space-y-8">
              {groupedTasksByOwner.map((group) => (
                <div key={group.owner.username} className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                        {group.owner.name ? group.owner.name.charAt(0) : group.owner.username.charAt(0)}
                      </div>
                      <div>
                        <span className="text-sm font-bold text-slate-900">
                          {group.owner.name || group.owner.username}
                        </span>
                        <span className="text-xs text-slate-400 font-medium ml-1.5">
                          (@{group.owner.username})
                        </span>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                      {group.tasks.length} {group.tasks.length === 1 ? 'task' : 'tasks'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {group.tasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        showOwner={false}
                        onEdit={(t) => {
                          setEditingTask(t);
                          setIsModalOpen(true);
                        }}
                        onDelete={(t) => setDeleteTaskTarget(t)}
                        onStatusChange={handleStatusChange}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      <TaskModal
        isOpen={isModalOpen}
        task={editingTask}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
      />

      <ConfirmDialog
        isOpen={Boolean(deleteTaskTarget)}
        title="Delete User Task"
        message={`Are you sure you want to delete "${deleteTaskTarget?.title}" owned by ${deleteTaskTarget?.owner?.name || deleteTaskTarget?.owner?.username}? This action is permanent and cannot be undone.`}
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTaskTarget(null)}
      />
    </div>
  );
};

export default AdminDashboard;
