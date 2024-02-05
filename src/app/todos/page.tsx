'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'

import useAuth from '@/hooks/useAuth'

interface Todo {
  id: string
  _id?: string
  desc: string
  completed: boolean
}

export default function Todos() {
  const [inputText, setInputText] = useState<string>('')
  const [todos, setTodos] = useState<Todo[]>([])
  const [editMode, setEditMode] = useState<boolean>(false)
  const [editedTodo, setEditedTodo] = useState<Todo>({ id: '', desc: '', completed: false })

  const { isAuthenticated, jwtToken, logout, fetchUserTodos, userState } = useAuth()
  useEffect(() => {

    if (isAuthenticated) {
      fetchUserTodos(userState?._id);
    }
  }, [isAuthenticated, fetchUserTodos, userState]);

  function handleLogout() {
    logout()

  }


  const fetchTodos = async () => {
    try {
      console.log('Fetching todos with token:', jwtToken)
      const response = await axios.get<{ todos: Todo[] }>(`/api/${userState?._id}/todos`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'X-Session-ID': localStorage.getItem('sessionId')
        }
      });
      console.log(response.data, response.status)
      setTodos(response.data.todos);
    } catch (error: any) {
      console.error('Error fetching todos:', error.response?.data || error.message);
      alert('Error fetching todos. Please try again.');
    }
  };


  async function addTodo() {
    try {


      const data = {
        desc: inputText
      }


      const resp = await axios.post<{ msg: string; success: boolean; savedTodo?: Todo }>('/api/todos', data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'X-Session-ID': localStorage.getItem('sessionId'),
        }
      })

      if (!resp.data.success) {
        console.error('Error adding todo:', resp.data.msg)
        alert(`Error adding todo: ${resp.data.msg}`)
        return
      }

      console.log('Todo added response:', resp.data)

      if (resp.data.savedTodo) {
        setTodos(prevTodos => [...prevTodos, ...(resp.data.savedTodo ? [resp.data.savedTodo] : [])])

        setInputText('')
      } else {
        console.error('Saved todo is not present or has unexpected properties.')
      }
    } catch (error: any) {
      console.error('Error adding todo', error.response?.data || error.message)
      alert('Error adding todo. Please try again.')
    }
  }

  async function clearTodos() {
    try {


      const resp = await axios.delete<{ todos: Todo[] }>('/api/todos', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'X-Session-ID': localStorage.getItem('sessionId'),
        }
      })
      console.log(resp.data)
      setTodos([])
    } catch (error: any) {
      console.error('Error deleting todos', error.response?.data || error.message)
    }
  }

  async function editTodo() {
    try {
      const resp = await axios.put<{ msg: string; success: boolean; updatedTodo: Todo }>(
        `/api/todos/${editedTodo.id}`,
        { desc: editedTodo.desc, completed: editedTodo.completed },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'X-Session-ID': localStorage.getItem('sessionId'),
          }
        }
      );

      console.log('Edit response:', resp);

      if (resp.data.success && resp.data.updatedTodo) {
        setTodos(prevTodos => {
          const updatedIndex = prevTodos.findIndex(todo => todo._id === editedTodo.id);
          if (updatedIndex !== -1) {
            const updatedTodos = [...prevTodos];
            updatedTodos[updatedIndex] = resp.data.updatedTodo;
            return updatedTodos;
          }
          return prevTodos;
        });

        setEditMode(false);
        setEditedTodo({ id: '', desc: '', completed: false });
      } else {
        console.error('Error editing todo:', resp.data.msg);
      }
    } catch (error: any) {
      console.error('Error editing todo', error.response?.data || error.message);
    }
  }


  async function handleCheckboxChange(id: string | undefined) {
    try {
      if (!id) {
        console.error('Invalid todo ID for checkbox change');
        return;
      }

      const updatedTodos = todos.map((todo) =>
        todo._id === id ? { ...todo, completed: !todo.completed } : todo
      );

      await axios.put<{ msg: string; success: boolean; updatedTodo: Todo }>(
        `/api/todos/${id}`,
        { completed: !todos.find((todo) => todo._id === id)?.completed },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'X-Session-ID': localStorage.getItem('sessionId'),
          },
        }
      );

      setTodos(updatedTodos);
    } catch (error: any) {
      console.error('Error updating todo', error.response?.data || error.message);
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
            onChange={e => setEditedTodo({ ...editedTodo, desc: e.target.value })}
          />
        </div>
        <div className="flex gap-4">
          <div className="text-lg">Edit completed:</div>
          <input
            type="checkbox"
            checked={editedTodo.completed}
            onChange={e => setEditedTodo({ ...editedTodo, completed: e.target.checked })}
          />
        </div>
        <button
          onClick={editTodo}
          className="text-xl shadow-md bg-blue-600 text-white hover:bg-blue-500 rounded-md px-1"
        >
          Submit
        </button>
      </div>
    )
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
          onChange={e => setInputText(e.target.value)}
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
        <button
          onClick={handleLogout}
          className="text-xl shadow-md bg-red-600 text-white hover:bg-blue-500 rounded-md px-3 py-1"
        >
          Logout
        </button>
      </div>

      <div className="w-5/6 flex flex-col gap-2">
        {todos &&
          todos.map((todo, indx) => (
            <div
              key={`todo-${todo?.id ?? indx}`}
              className="bg-violet-600 flex justify-between items-center p-2 rounded-lg shadow-md"
            >
              <div className="flex gap-2">
                <input
                  type="checkbox"
                  checked={todo?.completed || false}
                  onChange={() => handleCheckboxChange(todo._id)}
                />

                <div className={`text-lg text-white ${todo && todo.completed ? 'completed' : ''}`}>
                  {todo && todo.desc}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    console.log('Edit button clicked. Todo:', todo);
                    if (todo._id) {
                      setEditMode(true);
                      setEditedTodo({ ...todo, id: todo._id });
                    } else {
                      console.error('Invalid todo ID for edit');
                    }
                  }}
                  className="text-xl shadow-md bg-green-600 text-white hover:bg-blue-500 rounded-md px-1"
                >
                  Edit
                </button>

                <button
                  onClick={async () => {
                    try {
                      // Check if jwtToken is missing or invalid


                      const resp = await axios.delete<{ todos: Todo[] }>(`/api/todos/${todo.id}`, {
                        headers: {
                          Authorization: `Bearer ${localStorage.getItem('token')}`,
                          'X-Session-ID': localStorage.getItem('sessionId'),
                        }
                      })
                      console.log(resp)
                      setTodos(prevTodos => prevTodos.filter(t => t.id !== todo.id))
                    } catch (error: any) {
                      console.error('Error deleting todo', error.response?.data || error.message)
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
  )
}
