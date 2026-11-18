import React from 'react';
import { Pencil, Trash2, User, Calendar } from 'lucide-react';
import StatusBadge from './StatusBadge';

export const TaskCard = ({
  task,
  onEdit,
  onDelete,
  onStatusChange,
  showOwner = false
}) => {
  const formattedDate = task.createdAt
    ? new Date(task.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      })
    : null;

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between group">
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex-1">
            <h3 className="text-base font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
              {task.title}
            </h3>
            {showOwner && task.owner && (
              <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-500 font-medium">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  Owner: <span className="text-slate-800 font-semibold">{task.owner.name || task.owner.username}</span>
                  <span className="text-slate-400 font-normal ml-1">(@{task.owner.username})</span>
                </span>
              </div>
            )}
          </div>
          <div className="shrink-0">
            <StatusBadge status={task.status} />
          </div>
        </div>

        {task.description ? (
          <p className="text-sm text-slate-600 line-clamp-3 mb-4 leading-relaxed whitespace-pre-wrap">
            {task.description}
          </p>
        ) : (
          <p className="text-xs text-slate-400 italic mb-4">No description provided</p>
        )}
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {formattedDate && (
            <span className="inline-flex items-center gap-1 text-xs text-slate-400">
              <Calendar className="w-3 h-3" />
              {formattedDate}
            </span>
          )}

          {/* Quick status transition dropdown */}
          {onStatusChange && (
            <select
              value={task.status}
              onChange={(e) => onStatusChange(task, e.target.value)}
              className="text-xs bg-slate-50 text-slate-600 border border-slate-200 rounded-md px-2 py-1 hover:bg-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="todo">Mark To Do</option>
              <option value="in_progress">Mark In Progress</option>
              <option value="done">Mark Done</option>
            </select>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(task)}
            title="Edit Task"
            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(task)}
            title="Delete Task"
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;

