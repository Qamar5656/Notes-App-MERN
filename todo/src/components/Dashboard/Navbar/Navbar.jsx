import React, { useState } from "react";
import { FiCheckSquare } from "react-icons/fi";
import { FaSearch } from "react-icons/fa";
import Button from "../../Button/Button";
import AddTodo from "../../Todos/AddTodo";
import SearchTodo from "../../Todos/SearchTodo";

const Navbar = ({ selectedItem, onTaskAdded }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchmodal, setSearchModal] = useState(false);

  const openSearch = () => {
    setSearchModal(true);
  };

  const closeSearch = () => {
    setSearchModal(false);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);

  const handleTaskAdded = () => {
    if (onTaskAdded) onTaskAdded();
    closeModal();
  };

  return (
    <>
      <nav className="bg-white shadow-md py-4">
        <div className="max-w-7xl mx-auto px-2 flex items-center justify-between">
          {/* Left side: Selected item */}
          <div className="flex items-center gap-2 text-gray-800 font-semibold text-lg">
            <FiCheckSquare size={24} />
            <span className="text-2xl">{selectedItem || "Dashboard"}</span>
          </div>

          {/* Right side: Search + Add Task */}
          <div className="flex items-center gap-3">
            <FaSearch
              size={24}
              className="text-gray-600 cursor-pointer"
              onClick={openSearch}
            />
            <Button
              caption="+ Add Task"
              className="bg-gray-800 hover:bg-gray-900"
              onClick={openModal}
            />
          </div>
        </div>
      </nav>

      {/* Search functionality  */}
      {searchmodal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
            {/* Close button */}
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-5xl font-bold"
              onClick={closeSearch}
            >
              &times;
            </button>

            {/* Search Input  */}
            <SearchTodo />
          </div>
        </div>
      )}

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
            {/* Close button */}
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-5xl font-bold"
              onClick={closeModal}
            >
              &times;
            </button>

            {/* Todo form */}
            <AddTodo onTodoAdded={handleTaskAdded} />
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
