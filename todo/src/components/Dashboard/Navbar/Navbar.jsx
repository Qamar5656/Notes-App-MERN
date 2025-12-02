import React from "react";
import { FiCheckSquare } from "react-icons/fi";
import { FaSearch } from "react-icons/fa";
import Button from "../../Button/Button";

const Navbar = ({ selectedItem }) => {
  return (
    <nav className="bg-white shadow-md py-4">
      <div className="max-w-7xl mx-auto px-2 flex items-center justify-between">
        {/* Left side: Selected item */}
        <div className="flex items-center gap-2 text-gray-800 font-semibold text-lg">
          <FiCheckSquare size={24} />
          <span className="text-2xl">{selectedItem || "Dashboard"}</span>
        </div>

        {/* Right side: Search + Add Task */}
        <div className="flex items-center gap-3">
          <FaSearch size={24} className="text-gray-600 cursor-pointer" />
          <Button
            caption="+ Add Task"
            className="bg-gray-800 hover:bg-gray-900"
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
