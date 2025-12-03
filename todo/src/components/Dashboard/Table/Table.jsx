import React, { useState, useEffect } from "react";
import { useTodos } from "../../../hooks/useTodos";
import { toast } from "react-toastify";
import {
  FaCheck,
  FaEdit,
  FaTrash,
  FaUndo,
  FaTrashRestore,
  FaEye,
  FaFlag,
} from "react-icons/fa";

const Table = ({ filter }) => {
  const {
    todos,
    loading,
    deleteTask,
    permanentDeleteTask,
    restoreTask,
    completeTask,
    updateTask,
  } = useTodos(filter);

  const [user, setUser] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({
    task: "",
    description: "",
    priority: "medium",
  });

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  // Handle edit
  const handleEdit = (todo) => {
    setEditingId(todo._id);
    setEditData({
      task: todo.task,
      description: todo.description,
      priority: todo.priority,
    });
  };

  const handleUpdate = async (id) => {
    try {
      await updateTask(id, editData);
      setEditingId(null);
      toast.success("Task updated successfully");
    } catch (error) {
      toast.error("Failed to update task");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  // Check if we're in Trash view
  const isTrashView = filter === "Trash";

  if (!user) return <p>Loading user...</p>;

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get priority icon
  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "high":
        return "🔴";
      case "medium":
        return "🟡";
      case "low":
        return "🟢";
      default:
        return "⚪";
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "deleted":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  return (
    <main className="flex-1 overflow-auto p-6">
      <div className="bg-white shadow-md rounded-lg p-4">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            {filter === "Tasks" && "All Tasks"}
            {filter === "Completed" && "Completed Tasks"}
            {filter === "Trash" && "Trash"}
            {filter.startsWith("Priority: ") && `${filter}`}
            {filter.startsWith("Notebook > ") && `${filter}`}
          </h2>
          <p className="text-gray-600 text-sm">
            {todos.length} {todos.length === 1 ? "task" : "tasks"} found
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="py-3 px-4 text-left">Title</th>
                <th className="py-3 px-4 text-left">Description</th>
                <th className="py-3 px-4 text-left">Priority</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Created</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {todos.map((todo, index) => (
                <tr
                  key={todo._id}
                  className={
                    index % 2 === 0 ? "border-b" : "border-b bg-gray-50"
                  }
                >
                  <td className="py-3 px-4">
                    {editingId === todo._id ? (
                      <input
                        type="text"
                        value={editData.task}
                        onChange={(e) =>
                          setEditData({ ...editData, task: e.target.value })
                        }
                        className="w-full px-2 py-1 border rounded"
                        autoFocus
                      />
                    ) : (
                      <div className="font-medium">{todo.task}</div>
                    )}
                  </td>

                  <td className="py-3 px-4">
                    {editingId === todo._id ? (
                      <textarea
                        value={editData.description}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            description: e.target.value,
                          })
                        }
                        className="w-full px-2 py-1 border rounded"
                        rows="2"
                      />
                    ) : (
                      <div className="text-gray-600">{todo.description}</div>
                    )}
                  </td>

                  <td className="py-3 px-4">
                    {editingId === todo._id ? (
                      <select
                        value={editData.priority}
                        onChange={(e) =>
                          setEditData({ ...editData, priority: e.target.value })
                        }
                        className="px-2 py-1 border rounded"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    ) : (
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                          todo.priority
                        )}`}
                      >
                        {getPriorityIcon(todo.priority)} {todo.priority}
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        todo.status
                      )}`}
                    >
                      {todo.status}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-sm text-gray-600">
                    {new Date(todo.createdAt).toLocaleDateString()}
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      {editingId === todo._id ? (
                        <>
                          <button
                            className="p-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors duration-200"
                            onClick={() => handleUpdate(todo._id)}
                            title="Save"
                          >
                            <FaCheck size={14} />
                          </button>
                          <button
                            className="p-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors duration-200"
                            onClick={handleCancelEdit}
                            title="Cancel"
                          >
                            <FaUndo size={14} />
                          </button>
                        </>
                      ) : (
                        <>
                          {/* TRASH VIEW ACTIONS */}
                          {isTrashView ? (
                            <>
                              <button
                                className="p-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors duration-200"
                                onClick={() => restoreTask(todo._id)}
                                title="Restore"
                              >
                                <FaTrashRestore size={14} />
                              </button>
                              <button
                                className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200"
                                onClick={() => permanentDeleteTask(todo._id)}
                                title="Permanently Delete"
                              >
                                <FaTrash size={14} />
                              </button>
                            </>
                          ) : (
                            <>
                              {/* NORMAL VIEW ACTIONS */}
                              {todo.status !== "completed" && (
                                <button
                                  className="p-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors duration-200"
                                  onClick={() => completeTask(todo._id)}
                                  disabled={todo.status === "completed"}
                                  title="Mark Complete"
                                >
                                  <FaCheck size={14} />
                                </button>
                              )}

                              <button
                                className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
                                onClick={() => handleEdit(todo)}
                                title="Edit"
                              >
                                <FaEdit size={14} />
                              </button>

                              <button
                                className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200"
                                onClick={() => deleteTask(todo._id)}
                                title="Move to Trash"
                              >
                                <FaTrash size={14} />
                              </button>
                            </>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {todos.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <FaFlag className="text-gray-300 mb-2" size={32} />
                      No tasks found.
                      {filter === "Tasks" && " Start by adding a new task!"}
                      {filter === "Trash" && " Trash is empty."}
                      {filter === "Completed" && " No completed tasks yet."}
                    </div>
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
