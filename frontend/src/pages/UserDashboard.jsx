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
  Plus, 
  Search, 
  CheckCircle2, 
  Clock, 
  Layers, 
  Menu, 
  Loader2, 
  AlertCircle, 
  Inbox,
  Check
} from 'lucide-react';

export const UserDashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

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

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get('/tasks');
      setTasks(res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, searchQuery]);

  const handleSaveTask = async (taskData) => {
    if (taskData.id) {
      const res = await api.patch(`/tasks/${taskData.id}`, {
        title: taskData.title,
        description: taskData.description,
        status: taskData.status
      });
      setTasks(prev => prev.map(t => (t.id === taskData.id ? res.data : t)));
      showToast('Task updated successfully');
    } else {
      const res = await api.post('/tasks', {
        title: taskData.title,
        description: taskData.description
      });
      setTasks(prev => [res.data, ...prev]);
      showToast('Task created successfully');
    }
  };

  const handleStatusChange = async (task, newStatus) => {
    try {
      const res = await api.patch(`/tasks/${task.id}`, { status: newStatus });
      setTasks(prev => prev.map(t => (t.id === task.id ? res.data : t)));
      showToast(`Status updated to ${newStatus.replace('_', ' ')}`);
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
    } catch (err) {
      showToast(err.message || 'Failed to delete task');
    } finally {
      setIsDeleting(false);
    }
  };

  const stats = useMemo(() => {
    const total = tasks.length;
    const todo = tasks.filter(t => t.status === 'todo').length;
    const inProgress = tasks.filter(t => t.status === 'in_progress').length;
    const done = tasks.filter(t => t.status === 'done').length;
    return { total, todo, inProgress, done };
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
      const matchesSearch = 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesStatus && matchesSearch;
    });
  }, [tasks, statusFilter, searchQuery]);

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
              <h1 className="text-lg font-bold text-slate-900 leading-tight">My Tasks</h1>
              <p className="text-xs text-slate-500 hidden sm:block">Manage your personal daily workflow and milestones</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setEditingTask(null);
                setIsModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/25 transition-all hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add Task</span>
            </button>
          </div>
        </header>

        {notification && (
          <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 text-sm animate-in fade-in slide-in-from-top-4 duration-200">
            <Check className="w-4 h-4 text-green-400" />
            <span>{notification}</span>
          </div>
        )}

        <main className="p-4 sm:p-8 max-w-7xl w-full mx-auto space-y-6">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 sm:p-8 text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/20 text-blue-100 mb-2">
                <span>User Workspace</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Welcome back, {user?.name || user?.username}!
              </h2>
              <p className="text-blue-100 text-sm mt-1 max-w-xl leading-relaxed">
                Here is an overview of your active tasks and deliverables for today.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Tasks"
              value={stats.total}
              icon={Layers}
              color="slate"
              description="Personal tasks created"
            />
            <StatCard
              title="To Do"
              value={stats.todo}
              icon={Inbox}
              color="amber"
              description="Ready to start"
            />
            <StatCard
              title="In Progress"
              value={stats.inProgress}
              icon={Clock}
              color="blue"
              description="Currently active"
            />
            <StatCard
              title="Completed"
              value={stats.done}
              icon={CheckCircle2}
              color="green"
              description="Successfully finished"
            />
          </div>

          <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  statusFilter === 'all'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All ({stats.total})
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
                In Progress ({stats.inProgress})
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

            <div className="relative w-full md:w-72">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 bg-slate-50/50"
              />
            </div>
          </div>

          {loading ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-3" />
              <p className="text-sm font-medium text-slate-600">Loading your tasks...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 rounded-2xl border border-red-200 p-8 text-center text-red-700">
              <AlertCircle className="w-8 h-8 mx-auto mb-2 text-red-500" />
              <p className="text-sm font-semibold">{error}</p>
              <button
                onClick={fetchTasks}
                className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
                <Inbox className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-slate-900">No tasks found</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                {searchQuery || statusFilter !== 'all'
                  ? 'No tasks match your current filter criteria.'
                  : 'You have no tasks yet. Get started by creating your first task!'}
              </p>
              <button
                onClick={() => {
                  setEditingTask(null);
                  setIsModalOpen(true);
                }}
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create New Task</span>
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {paginatedTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
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
        title="Delete Task"
        message={`Are you sure you want to delete "${deleteTaskTarget?.title}"? This action is permanent and cannot be undone.`}
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTaskTarget(null)}
      />
    </div>
  );
};

export default UserDashboard;
