import React, { useEffect, useState } from "react";
import { FiCheckSquare } from "react-icons/fi";
import Button from "../../Button/Button";
import AddTodo from "../../Todos/AddTodo";

const Navbar = ({
  selectedItem,
  addTodoOptimistic,
  updateTask,
  searchQuery,
  setSearchQuery,
  editTodo,
  setEditTodo,
}) => {
  const [isAddModalOpen, setAddModalOpen] = useState(false);

  // Open modal when editTodo changes
  useEffect(() => {
    if (editTodo) setAddModalOpen(true);
  }, [editTodo]);

  return (
    <nav className="bg-white shadow-md py-4 relative">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        {/* Left: Dashboard title */}
        <div className="flex items-center gap-2 text-gray-800 font-semibold text-lg">
          <FiCheckSquare size={24} />
          <span className="text-2xl">{selectedItem || "Dashboard"}</span>
        </div>

        {/* Center: Search box */}
        <div className="flex-1 flex justify-center">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks..."
            className="w-1/2 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Right: Add Task */}
        <div className="flex items-center gap-3">
          <Button
            caption="+ Add Task"
            className="bg-gray-800 hover:bg-gray-900"
            onClick={() => setAddModalOpen(true)}
          />
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-5xl font-bold"
              onClick={() => {
                setAddModalOpen(false);
                setEditTodo(null);
              }}
            >
              &times;
            </button>

            <AddTodo
              initialData={editTodo}
              onTodoAdded={addTodoOptimistic}
              onTodoUpdated={updateTask}
              closeModal={() => {
                setAddModalOpen(false);
                setEditTodo(null);
              }}
            />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
