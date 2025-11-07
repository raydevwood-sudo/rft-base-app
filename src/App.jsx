import React, { useState, useEffect } from 'react';
import { db, auth } from './firebase';
import { collection, addDoc, query, where, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { addTodoFirestore, updateTodoFirestore, deleteTodoFirestore, subscribeTodos } from './todos';
import TodoInput from './TodoInput';
import TodoItem from './TodoItem';
import './index.css';

const addTodo = async (text, dueDateString = null) => {
  await addTodoFirestore(text, dueDateString);
};

const updateTodo = async (id, text, dueDateString = null) => {
  await updateTodoFirestore(id, text, dueDateString);
};

function App() {
  const [todos, setTodos] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // add editing state
  const [editingTodo, setEditingTodo] = useState(null);

  // 1. Listen for Auth State Changes
  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribeAuth;
  }, []);

  // 2. Listen for Firestore Data Changes for the current user
  useEffect(() => {
    if (user) {
      const q = query(collection(db, "todos"), where("userId", "==", user.uid));
      const unsubscribeFirestore = onSnapshot(q, (querySnapshot) => {
        const todosList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setTodos(todosList);
      });
      return unsubscribeFirestore;
    } else {
      // clear todos when signed out
      setTodos([]);
    }
  }, [user]); // Rerun when user object changes

  const addTodo = async (text, dueDate = null) => {
    if (user) {
      try {
        await addDoc(collection(db, "todos"), {
          text,
          completed: false,
          userId: user.uid, // Link the todo to the user ID
          createdAt: new Date(),
          dueDate: dueDate, // pass Date or null
        });
      } catch (error) {
        console.error("Error adding document: ", error);
      }
    }
  };

  // update existing todo in Firestore
  const updateTodo = async (id, text, dueDate = null) => {
    try {
      const todoDoc = doc(db, "todos", id);
      await updateDoc(todoDoc, {
        text,
        dueDate: dueDate, // Date or null
      });
      setEditingTodo(null);
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const toggleTodo = async (id, completed) => {
    const todoDoc = doc(db, "todos", id);
    await updateDoc(todoDoc, {
      completed: !completed
    });
  };

  const deleteTodo = async (id) => {
    const todoDoc = doc(db, "todos", id);
    await deleteDoc(todoDoc);
  };

  const startEdit = (todo) => {
    setEditingTodo(todo);
  };

  const cancelEdit = () => {
    setEditingTodo(null);
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">Full-Stack To-Do List</h1>
        {/* pass editing props */}
        <TodoInput
          onAddTodo={addTodo}
          editingTodo={editingTodo}
          onUpdateTodo={updateTodo}
          onCancelEdit={cancelEdit}
        />
        <ul className="space-y-3">
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={() => toggleTodo(todo.id, todo.completed)}
              onDelete={() => deleteTodo(todo.id)}
              onEdit={() => startEdit(todo)} // provide edit handler
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;