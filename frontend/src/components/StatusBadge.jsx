import React from 'react';
import { Circle, Clock, CheckCircle2 } from 'lucide-react';

export const StatusBadge = ({ status }) => {
  switch (status) {
    case 'done':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
          <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
          Done
        </span>
      );
    case 'in_progress':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
          <Clock className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
          In Progress
        </span>
      );
    case 'todo':
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
          <Circle className="w-3.5 h-3.5 text-slate-400" />
          To Do
        </span>
      );
  }
};

export default StatusBadge;

