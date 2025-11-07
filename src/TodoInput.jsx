// src/TodoInput.jsx

import React, { useState } from 'react';

function TodoInput({ onAddTodo }) {
  const [text, setText] = useState('');
  const [dueDate, setDueDate] = useState(''); // State to hold the date string

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    // Convert the input string (e.g., "2025-11-20") into a JS Date object
    // If no date is set, dateObj remains null
    const dateObj = dueDate ? new Date(dueDate) : null;

    onAddTodo(text, dateObj); // Pass both text and the Date object to App.jsx
    setText('');
    setDueDate('');
  };

  // Helper function to get today's date in YYYY-MM-DD format for the input min attribute
  const getTodayDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
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
      {/* Add a date input field */}
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
        // Use the helper function to set a minimum date
        // min={getTodayDateString()} 
      />
      <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full">
        Add Todo
      </button>
    </form>
  );
}

export default TodoInput;