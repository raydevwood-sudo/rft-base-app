// src/TodoItem.jsx
import React from 'react';

const TodoItem = ({ todo, onToggle, onDelete }) => {
  return (
    <li className="flex items-center justify-between bg-gray-50 p-3 rounded-md shadow-sm mb-2">
      <span
        className={`flex-grow cursor-pointer ${
          todo.completed ? 'line-through text-gray-500' : 'text-gray-800'
        }`}
        onClick={onToggle} // Call the simplified handler from App.jsx
      >
        {todo.text}
      </span>
      <button
        onClick={onDelete} // Call the simplified handler from App.jsx
        className="text-red-500 hover:text-red-700 ml-4 transition duration-150"
      >
        Remove
      </button>
    </li>
  );
};

export default TodoItem;