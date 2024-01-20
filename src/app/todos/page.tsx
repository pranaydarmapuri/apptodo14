
"use client";
import { SessionProvider } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

import axios from 'axios';

interface Todo {
  id: string;
  desc: string;
  completed: boolean;
}

export default function Todos() {
  const { data: session, status } = useSession();
  const [inputText, setInputText] = useState<string>('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [editedTodo, setEditedTodo] = useState<Todo>({ id: '', desc: '', completed: false });

  useEffect(() => {
    const fetchData = async () => {
      if (session) {
        try {
          const response = await axios.get<{ todos: Todo[] }>('/api/todos', {
            headers: {
              Authorization: 'Bearer ${session?.access?.token}',
            },
          });
          setTodos(response.data.todos);
        } catch (error) {
          console.error('Error fetching todos', error);
        }
      }
    };

    fetchData();
  }, [session]);

  async function addTodo() {
    const data = {
      desc: inputText,
    };

    const resp = await axios.post<{ todos: Todo[] }>('/api/todos', data);
    console.log(resp);
    setTodos(resp.data.todos);
    setInputText('');
  }

  async function clearTodos() {
    const resp = await axios.delete<{ todos: Todo[] }>('/api/todos');
    console.log(resp.data);
    setTodos([]);
  }

  async function editTodo() {
    try {
      const resp = await axios.put<{ todos: Todo[] }>(`/api/todos/${editedTodo.id}`, editedTodo);
      console.log(resp);
      setTodos(resp.data.todos);
      setEditMode(false);
      setEditedTodo({ id: '', desc: '', completed: false });
    } catch (error) {
      console.error('Error editing todo', error);
    }
  }

  if (editMode) {
    return (
      <div className="flex flex-col items-center gap-8 pt-8 bg-violet-200 pb-32">
        <div className="text-2xl">Edit Todo</div>
        <div className="flex gap-4">
          <div className="text-lg">Edit desc:</div>
          <input
            className="rounded-md shadow-md text-lg"
            type="text"
            placeholder="Enter new desc"
            value={editedTodo.desc}
            onChange={(e) => setEditedTodo({ ...editedTodo, desc: e.target.value })}
          />
        </div>
        <div className="flex gap-4">
          <div className="text-lg">Edit completed:</div>
          <input
            type="checkbox"
            checked={editedTodo.completed}
            onChange={(e) => setEditedTodo({ ...editedTodo, completed: e.target.checked })}
          />
        </div>
        <button
          onClick={editTodo}
          className="text-xl shadow-md bg-blue-600 text-white hover:bg-blue-500 rounded-md px-1"
        >
          Submit
        </button>
      </div>
    );
  }

  return (
    <SessionProvider session={session}>
      <div className="flex flex-col items-center gap-8 pt-8 bg-violet-200 pb-32">
        <div className="text-2xl">Todo List</div>
        <div className="flex gap-2">
          <input
            className="text-xl rounded-md shadow-md"
            type="text"
            placeholder="Enter Todo"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <button
            onClick={addTodo}
            className="text-xl shadow-md bg-blue-600 text-white hover:bg-blue-500 rounded-md px-3 py-1"
          >
            Add
          </button>
          <button
            onClick={clearTodos}
            className="text-xl shadow-md bg-blue-600 text-white hover:bg-blue-500 rounded-md px-3 py-1"
          >
            Clear
          </button>
          </div>
        <div className="w-5/6 flex flex-col gap-2">
          {todos.map((todo, index) => (
            <div key={index} className="bg-violet-600 flex justify-between items-center p-2 rounded-lg shadow-md">
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => {
                    // Handle checkbox change if needed
                  }}
                />
                <div className="text-lg text-white">{todo.desc}</div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditMode(true);
                    setEditedTodo({ ...todo });
                  }}
                  className="text-xl shadow-md bg-green-600 text-white hover:bg-blue-500 rounded-md px-1"
                >
                  Edit
                </button>
                <button
                  onClick={async () => {
                    try {
                      const resp = await axios.delete<{ todos: Todo[] }>(`/api/todos/${todo.id}`);
                      console.log(resp);
                      setTodos(resp.data.todos);
                    } catch (error) {
                      console.error('Error deleting todo', error);
                    }
                  }}
                  className="text-xl shadow-md bg-red-600 text-white hover:bg-blue-500 rounded-md px-1"
                >
                  Delete
                </button>
              </div>
              </div>
          ))}
        </div>
      </div>
    </SessionProvider>
  );
}