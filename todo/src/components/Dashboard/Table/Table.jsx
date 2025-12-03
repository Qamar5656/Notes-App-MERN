// components/Dashboard/Table/Table.jsx
import React, { useState, useEffect } from "react";
import { useTodos } from "../../../hooks/useTodos";
import { toast } from "react-toastify";

const Table = ({ filter = "" }) => {
  const { todos, loading, deleteTask, completeTask } = useTodos(filter);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  if (!user) return <p>Loading user...</p>;
  if (loading) return <p>Loading tasks...</p>;

  // Filter tasks by logged-in user
  const userTodos = (todos || []).filter((todo) => todo.user === user._id);

  return (
    <main className="flex-1 overflow-auto p-6">
      <div className="bg-white shadow-md rounded-lg p-4">
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="py-2 px-4 text-left">Title</th>
                <th className="py-2 px-4 text-left">Description</th>
                <th className="py-2 px-4 text-left">Status</th>
                <th className="py-2 px-4 text-left">Created</th>
                <th className="py-2 px-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {userTodos.map((todo, index) => (
                <tr
                  key={todo._id}
                  className={
                    index % 2 === 0 ? "border-b" : "border-b bg-gray-50"
                  }
                >
                  <td className="py-2 px-4">{todo.task}</td>
                  <td className="py-2 px-4">{todo.description}</td>
                  <td className="py-2 px-4">{todo.status}</td>
                  <td className="py-2 px-4">
                    {new Date(todo.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 flex gap-2">
                    <button
                      className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                      onClick={() => completeTask(todo._id)}
                      disabled={todo.status === "completed"}
                    >
                      Complete
                    </button>
                    <button
                      className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                      onClick={() => toast.info("Update modal here")}
                    >
                      Update
                    </button>
                    <button
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      onClick={() => deleteTask(todo._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {userTodos.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-gray-500">
                    No tasks found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

export default Table;
