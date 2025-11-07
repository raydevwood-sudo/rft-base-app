// src/TodoItem.jsx
import React from 'react';

const TodoItem = ({ todo, onToggle, onDelete }) => {
  
  // Helper function to safely format the date
  const formatDate = (timestamp) => {
    // Check if the timestamp exists and has the .toDate() method
    if (!timestamp || typeof timestamp.toDate !== 'function') {
      return 'No due date';
    }
    const date = timestamp.toDate();
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

   return (
    <li className="flex items-center justify-between bg-gray-50 p-3 rounded shadow-sm">
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={onToggle}
          className="mr-3 h-4 w-4 text-blue-600 border-gray-300 rounded"
        />
        <div>
          <span className={`${todo.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
            {todo.text}
          </span>
          {/* Display the formatted due date */}
          <p className="text-xs text-gray-400 mt-0.5">
            Due: {formatDate(todo.dueDate)}
          </p>
        </div>
      </div>
      <button
        onClick={onDelete}
        className="text-red-500 hover:text-red-700 transition duration-150"
      >
        Delete
      </button>
    </li>
  );
};

export default TodoItem;