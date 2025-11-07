import { db } from './firebase';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';

const todosCol = collection(db, 'todos');

export function subscribeTodos(setTodos, userId = null) {
  // keep your existing user-scoped query if you use userId; simplified here
  const q = query(todosCol, orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        text: data.text || '',
        completed: !!data.completed,
        // dueDate stored as date-only string "yyyy-mm-dd" or null
        dueDate: data.dueDate ?? null,
        createdAt: data.createdAt ? data.createdAt.toDate().toISOString() : null,
      };
    });
    setTodos(items);
  });
}

export const addTodoFirestore = async (text, dueDateString) => {
  await addDoc(todosCol, {
    text,
    completed: false,
    dueDate: dueDateString ?? null, // store date-only string
    createdAt: serverTimestamp(),
  });
};

export const updateTodoFirestore = async (id, text, dueDateString, completed) => {
  const d = doc(db, 'todos', id);
  const payload = {
    text,
    dueDate: dueDateString ?? null,
  };
  if (typeof completed === 'boolean') payload.completed = completed;
  await updateDoc(d, payload);
};

export const deleteTodoFirestore = async (id) => {
  await deleteDoc(doc(db, 'todos', id));
};