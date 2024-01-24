'use client'
import { useEffect, useState } from 'react';
import axios from 'axios';
import useAuth from '../../../useAuth';

interface Todo {
  id: string;
  desc: string;
  completed: boolean;
}

export default function Todos() {
  const [inputText, setInputText] = useState<string>('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [editedTodo, setEditedTodo] = useState<Todo>({ id: '', desc: '', completed: false });

  const { isAuthenticated, jwtToken } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (isAuthenticated && jwtToken) {
        try {
          console.log('Sending request with JWT token:', jwtToken);

          const response = await axios.get<{ todos: Todo[] }>('/api/todos', {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          });

          console.log('Response from server:', response);

          setTodos(response.data.todos);
        } catch (error: any) {
          console.error('Error fetching todos:', error.response?.data || error.message);
          alert('Error fetching todos. Please try again.');
        }
      }
    };

    fetchData();
  }, [isAuthenticated, jwtToken]);

  async function addTodo() {
    try {
      const data = {
        desc: inputText,
      };

      console.log('Adding todo:', data);

      const resp = await axios.post<{ msg: string; success: boolean; savedTodo: Todo }>(
        '/api/todos',
        data,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      console.log('Todo added response:', resp.data);

      setTodos((prevTodos) => (Array.isArray(prevTodos) ? [...prevTodos, resp.data.savedTodo] : [resp.data.savedTodo]));

      setInputText('');
    } catch (error: any) {
      console.error('Error adding todo', error.response?.data || error.message);
      alert('Error adding todo. Please try again.');
    }
  }

  async function clearTodos() {
    try {
      const resp = await axios.delete<{ todos: Todo[] }>('/api/todos', {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      console.log(resp.data);
      setTodos([]);
    } catch (error: any) {
      console.error('Error deleting todos', error.response?.data || error.message);
    }
  }

  async function editTodo() {
    try {
      const resp = await axios.put<{ msg: string; success: boolean; updatedTodo: Todo }>(
        `/api/todos/${editedTodo.id}`,
        editedTodo,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      console.log(resp);

      // We are updating the state locally
      setTodos((prevTodos) => {
        const updatedIndex = prevTodos.findIndex((todo) => todo.id === editedTodo.id);
        if (updatedIndex !== -1) {
          const updatedTodos = [...prevTodos];
          updatedTodos[updatedIndex] = resp.data.updatedTodo;
          return updatedTodos;
        }
        return prevTodos;
      });

      setEditMode(false);
      setEditedTodo({ id: '', desc: '', completed: false });
    } catch (error: any) {
      console.error('Error editing todo', error.response?.data || error.message);
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
        {todos &&
          todos.map((todo) => (
            <div key={todo && todo.id} className="bg-violet-600 flex justify-between items-center p-2 rounded-lg shadow-md">
              <div key={`${todo && todo.id}-content`} className="flex gap-2">
                <input
                  type="checkbox"
                  checked={todo && todo.completed}
                  onChange={() => {}}
                />

                <div key={`${todo && todo.id}-desc`} className="text-lg text-white">
                  {todo && todo.desc}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  key={`${todo && todo.id}-edit`}
                  onClick={() => {
                    setEditMode(true);
                    setEditedTodo({ ...todo });
                  }}
                  className="text-xl shadow-md bg-green-600 text-white hover:bg-blue-500 rounded-md px-1"
                >
                  Edit
                </button>
                <button
  key={`${todo && todo.id}-delete`}
  onClick={async () => {
    try {
      const resp = await axios.delete<{ todos: Todo[] }>(`/api/todos/${todo.id}`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      console.log(resp);
      setTodos((prevTodos) => prevTodos.filter((t) => t.id !== todo.id));
    } catch (error: any) {
      console.error('Error deleting todo', error.response?.data || error.message);
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
  );
}
