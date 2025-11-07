import React, { useState, useEffect } from 'react';

function TodoInput({ onAddTodo, onUpdateTodo, editingTodo, onCancelEdit }) {
  const [text, setText] = useState('');
  const [dueDate, setDueDate] = useState(''); // YYYY-MM-DD string

  useEffect(() => {
    if (editingTodo) {
      setText(editingTodo.text || '');

      const raw = editingTodo.dueDate ?? null;

      // Normalize many possible stored types -> yyyy-mm-dd string
      if (!raw) {
        setDueDate('');
        return;
      }

      // Firestore Timestamp
      if (typeof raw?.toDate === 'function') {
        const d = raw.toDate();
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        setDueDate(`${year}-${month}-${day}`);
        return;
      }

      // If already a date-only string
      if (typeof raw === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(raw)) {
        setDueDate(raw);
        return;
      }

      // Fallback: parse ISO/other string or Date
      const parsed = raw instanceof Date ? raw : new Date(raw);
      if (!isNaN(parsed.getTime())) {
        const year = parsed.getFullYear();
        const month = String(parsed.getMonth() + 1).padStart(2, '0');
        const day = String(parsed.getDate()).padStart(2, '0');
        setDueDate(`${year}-${month}-${day}`);
      } else {
        setDueDate('');
      }
    } else {
      setText('');
      setDueDate('');
    }
  }, [editingTodo]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    // Keep and send the date-only string (or null) to avoid timezone shifts
    const dueDateString = dueDate && /^\d{4}-\d{2}-\d{2}$/.test(dueDate) ? dueDate : null;

    if (editingTodo && onUpdateTodo) {
      onUpdateTodo(editingTodo.id, text, dueDateString);
    } else if (onAddTodo) {
      onAddTodo(text, dueDateString);
    }

    setText('');
    setDueDate('');
  };

  const getTodayDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <input
        type="text"
        placeholder="Add a new todo..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
      />
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
        min={getTodayDateString()}
      />
      <div className="flex gap-2">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex-1"
        >
          {editingTodo ? 'Update Todo' : 'Add Todo'}
        </button>
        {editingTodo && (
          <button
            type="button"
            onClick={() => {
              setText('');
              setDueDate('');
              if (onCancelEdit) onCancelEdit();
            }}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default TodoInput;