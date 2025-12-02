import React, { useState, useEffect } from "react";
import {
  FaArrowLeft,
  FaArrowDown,
  FaArrowUp,
  FaFile,
  FaFolder,
  FaUser,
} from "react-icons/fa";
import { FiCheckSquare, FiTrash2, FiLogOut, FiMenu } from "react-icons/fi";

const Sidebar = ({ selectedItem, setSelectedItem, handleLogout }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [openNotebook, setOpenNotebook] = useState(false);
  const [user, setUser] = useState(null);

  // to get loggedin user details
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  if (!user) return <p>Loading user...</p>;

  //Function to handle submenu
  const handleItemClick = (itemName) => {
    setSelectedItem(itemName);
  };

  const renderButton = (icon, label, itemName) => (
    <button
      className={`flex items-center ${
        isOpen ? "justify-start" : "justify-center"
      } w-full px-4 py-3 rounded hover:bg-gray-300 transition-all duration-200 ${
        selectedItem === itemName ? "bg-gray-300" : ""
      }`}
      onClick={() => handleItemClick(itemName)}
    >
      {icon}
      {isOpen && <span className="ml-3 font-medium">{label}</span>}
    </button>
  );

  return (
    <div
      className={` text-gray-800 h-screen transition-all duration-300 ${
        isOpen ? "w-72" : "w-20"
      } flex flex-col`}
    >
      {/* Logo & Hamburger */}
      <div
        className={`flex items-center px-4 py-4 border-b border-gray-700 ${
          isOpen ? "justify-between" : "justify-center"
        }`}
      >
        {/* Logo */}
        {isOpen && (
          <div className="flex items-center gap-2">
            <FiCheckSquare size={56} />
            <span className="text-xl font-bold flex items-center justify-center">
              NotePlus
            </span>
          </div>
        )}

        {/* Menu Toggle */}
        <button
          className="focus:outline-none cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FaArrowLeft size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* User Info */}
      <div
        className={`flex items-center ${
          isOpen ? "justify-start" : "justify-center"
        } gap-3 px-4 py-7 border-b border-gray-300`}
      >
        <div className="bg-gray-300 w-10 h-10 rounded-full flex items-center justify-center text-white text-lg font-bold">
          <FaUser className="text-gray-800" size={28} />
        </div>
        {isOpen && (
          <span className="text-lg font-bold">
            {user.firstName} {user.lastName}
          </span>
        )}
      </div>

      {/* Menu */}
      <div className="flex-1 px-2 py-4 space-y-2 overflow-auto">
        {renderButton(<FaFile size={20} />, " Tasks", " Tasks")}

        {/* Notebook */}
        <div>
          <button
            className={`flex items-center ${
              isOpen ? "justify-between" : "justify-center"
            } w-full px-4 py-3 rounded hover:bg-gray-300 transition-all duration-200`}
            onClick={() => setOpenNotebook(!openNotebook)}
          >
            <div className="flex items-center gap-3">
              <FaFolder size={20} />
              {isOpen && <span className="font-medium">Notebook</span>}
            </div>
            {isOpen && (
              <span>{openNotebook ? <FaArrowUp /> : <FaArrowDown />}</span>
            )}
          </button>

          {openNotebook && isOpen && (
            <div className="ml-8 mt-2 flex flex-col gap-1 font-medium">
              {[
                { name: "Project Plan", icon: <FaFolder size={16} /> },
                { name: "Routing Notes", icon: <FaFolder size={16} /> },
                { name: "Planning", icon: <FaFolder size={16} /> },
              ].map((subItem) => (
                <button
                  key={subItem.name}
                  className={`flex items-center gap-2 px-3 py-2 rounded transition-all duration-200 text-md cursor-pointer ${
                    selectedItem === `Notebook > ${subItem.name}`
                      ? "text-gray-800 font-medium hover:bg-gray-300"
                      : "text-gray-800"
                  }`}
                  onClick={() => handleItemClick(`Notebook > ${subItem.name}`)}
                >
                  {subItem.icon}
                  {isOpen && <span>{subItem.name}</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {renderButton(<FiCheckSquare size={20} />, "Completed", "Completed")}
        {renderButton(<FiTrash2 size={20} />, "Trash", "Trash")}

        {/* Logout */}
        <div className="mt-auto" onClick={handleLogout}>
          {renderButton(<FiLogOut size={20} />, "Logout", "Logout")}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
