import React from 'react';

function formatDueDate(raw) {
  if (!raw) return null;

  // If date-only string yyyy-mm-dd -> construct local Date for display
  if (typeof raw === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    const [y, m, d] = raw.split('-').map(Number);
    const localDate = new Date(y, m - 1, d);
    return localDate.toLocaleDateString();
  }

  // If Firestore Timestamp (older items) -> convert to local date
  if (typeof raw?.toDate === 'function') {
    const dt = raw.toDate();
    return dt.toLocaleDateString();
  }

  // fallback parse
  const parsed = raw instanceof Date ? raw : new Date(raw);
  if (!isNaN(parsed.getTime())) return parsed.toLocaleDateString();
  return null;
}

function TodoItem({ todo, onToggle, onDelete, onEdit }) {
  const due = formatDueDate(todo.dueDate);

  return (
    <li className="flex items-center justify-between bg-white p-3 rounded shadow-sm">
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={!!todo.completed}
          onChange={onToggle}
          className="mt-1"
        />
        <div>
          <div className={todo.completed ? 'line-through text-gray-500' : 'text-gray-800'}>
            {todo.text}
          </div>
          {due && (
            <div className="text-sm text-gray-400">
              Due: {due}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onEdit}
          aria-label="Edit"
          title="Edit"
          className="p-1 hover:bg-gray-100 rounded"
        >
          {/* pencil icon */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536M16.5 3.5a2.121 2.121 0 113 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
        </button>

        <button
          onClick={onDelete}
          aria-label="Delete"
          title="Delete"
          className="p-1 hover:bg-gray-100 rounded"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3" />
          </svg>
        </button>
      </div>
    </li>
  );
}

export default TodoItem;