import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';

export const TaskModal = ({
  isOpen,
  task = null, // null = create mode, task object = edit mode
  onClose,
  onSave
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('todo');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEdit = Boolean(task);

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setStatus(task.status || 'todo');
    } else {
      setTitle('');
      setDescription('');
      setStatus('todo');
    }
    setError('');
  }, [task, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedTitle = title.trim();

    if (trimmedTitle.length < 3 || trimmedTitle.length > 100) {
      setError('Title must be between 3 and 100 characters.');
      return;
    }

    if (description.trim().length > 500) {
      setError('Description cannot exceed 500 characters.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      if (isEdit) {
        await onSave({
          id: task.id,
          title: trimmedTitle,
          description: description.trim(),
          status
        });
      } else {
        await onSave({
          title: trimmedTitle,
          description: description.trim()
        });
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save task.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div 
        className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {isEdit ? 'Edit Task' : 'Create New Task'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {isEdit ? 'Update task details and progress status' : 'Add a new task to your personal workflow'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="task-title" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Title <span className="text-red-500">*</span>
              </label>
              <span className={`text-xs ${title.trim().length > 100 || (title.trim().length > 0 && title.trim().length < 3) ? 'text-red-500 font-medium' : 'text-slate-400'}`}>
                {title.trim().length}/100
              </span>
            </div>
            <input
              id="task-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Conduct user research interviews"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm placeholder:text-slate-400 transition-all"
              required
              minLength={3}
              maxLength={100}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="task-desc" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Description <span className="text-slate-400 font-normal lowercase">(optional)</span>
              </label>
              <span className={`text-xs ${description.trim().length > 500 ? 'text-red-500 font-medium' : 'text-slate-400'}`}>
                {description.trim().length}/500
              </span>
            </div>
            <textarea
              id="task-desc"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details, acceptance criteria, or links..."
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm placeholder:text-slate-400 resize-none transition-all"
              maxLength={500}
            />
          </div>

          {isEdit ? (
            <div>
              <label htmlFor="task-status" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Status
              </label>
              <select
                id="task-status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm bg-white transition-all"
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
          ) : (
            <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-lg text-xs text-blue-700 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0"></span>
              <span>New tasks are automatically initialized with the <strong>To Do</strong> status.</span>
            </div>
          )}

          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm inline-flex items-center gap-1.5 disabled:opacity-50"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {isSubmitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;

