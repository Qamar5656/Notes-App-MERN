import React, { useState, useEffect } from "react";
import {
  FaArrowLeft,
  FaArrowDown,
  FaArrowUp,
  FaFile,
  FaFolder,
  FaUser,
  FaFlag,
  FaTasks,
  FaCheckCircle,
  FaTrash,
} from "react-icons/fa";
import { FiCheckSquare, FiLogOut, FiMenu } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ selectedItem, handleLogout, stats }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  const [openNotebook, setOpenNotebook] = useState(false);
  const [openPriority, setOpenPriority] = useState(false);
  const [user, setUser] = useState(null);

  // Get loggedin user details
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  if (!user) return <p>Loading user...</p>;

  // Function to handle menu item clicks
  const handleItemClick = (itemName) => {
    if (itemName === "Tasks") navigate("/dashboard/tasks");
    if (itemName === "Completed") navigate("/dashboard/completed");
    if (itemName === "Trash") navigate("/dashboard/trash");

    if (itemName.startsWith("Notebook > ")) {
      const notebook = itemName.replace("Notebook > ", "");
      navigate(`/dashboard/notebook/${notebook}`);
    }

    if (itemName.startsWith("Priority: ")) {
      const priority = itemName.replace("Priority: ", "").toLowerCase();
      navigate(`/dashboard/priority/${priority}`);
    }
  };

  // Render menu button with optional badge
  const renderButton = (icon, label, itemName, badgeCount = null) => (
    <button
      className={`flex items-center ${
        isOpen ? "justify-between" : "justify-center"
      } w-full px-4 py-3 rounded hover:bg-gray-300 transition-all duration-200 ${
        selectedItem === itemName ? "bg-gray-300" : ""
      }`}
      onClick={() => handleItemClick(itemName)}
    >
      <div className="flex items-center gap-3">
        {icon}
        {isOpen && <span className="font-medium">{label}</span>}
      </div>
      {isOpen && badgeCount !== null && (
        <span className="bg-gray-800 text-white text-xs rounded-full px-2 py-1">
          {badgeCount}
        </span>
      )}
    </button>
  );

  return (
    <div
      className={`text-gray-800 h-screen transition-all duration-300 ${
        isOpen ? "w-72" : "w-20"
      } flex flex-col bg-white border-r border-gray-200`}
    >
      {/* Logo & Hamburger */}
      <div
        className={`flex items-center px-4 py-4 border-b border-gray-300 ${
          isOpen ? "justify-between" : "justify-center"
        }`}
      >
        {/* Logo */}
        {isOpen && (
          <div className="flex items-center gap-2">
            <FiCheckSquare size={56} className="text-gray-700" />
            <span className="text-xl font-bold text-gray-900">NotePlus</span>
          </div>
        )}

        {/* Menu Toggle */}
        <button
          className="focus:outline-none cursor-pointer text-gray-600 hover:text-gray-900"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FaArrowLeft size={20} /> : <FiMenu size={20} />}
        </button>
      </div>

      {/* User Info */}
      <div
        className={`flex items-center ${
          isOpen ? "justify-start" : "justify-center"
        } gap-3 px-4 py-5 border-b border-gray-300`}
      >
        <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center">
          <FaUser className="text-gray-700" size={20} />
        </div>
        {isOpen && (
          <div>
            <span className="text-md font-bold text-gray-900 block">
              {user.firstName} {user.lastName}
            </span>
          </div>
        )}
      </div>

      {/* Menu */}
      <div className="flex-1 px-2 py-4 space-y-1 overflow-auto">
        {/* All Tasks */}
        {renderButton(
          <FaTasks size={20} className="text-gray-700" />,
          "All Tasks",
          "Tasks",
          stats ? stats.pending + stats.completed : null
        )}

        {/* Priority Section */}
        <div>
          <button
            className={`flex items-center ${
              isOpen ? "justify-between" : "justify-center"
            } w-full px-4 py-3 rounded hover:bg-gray-300 transition-all duration-200`}
            onClick={() => setOpenPriority(!openPriority)}
          >
            <div className="flex items-center gap-3">
              <FaFlag size={20} className="text-purple-600" />
              {isOpen && <span className="font-medium">Priority</span>}
            </div>
            {isOpen && (
              <span>{openPriority ? <FaArrowUp /> : <FaArrowDown />}</span>
            )}
          </button>

          {openPriority && isOpen && (
            <div className="ml-8 mt-1 mb-2 flex flex-col gap-1">
              {[
                { name: "High", color: "text-red-600", icon: "🔴" },
                { name: "Medium", color: "text-yellow-600", icon: "🟡" },
                { name: "Low", color: "text-green-600", icon: "🟢" },
              ].map((priority) => (
                <button
                  key={priority.name}
                  className={`flex items-center gap-2 px-3 py-2 rounded transition-all duration-200 text-sm cursor-pointer ${
                    selectedItem === `Priority: ${priority.name}`
                      ? "bg-gray-300 font-medium"
                      : "hover:bg-gray-200"
                  }`}
                  onClick={() => handleItemClick(`Priority: ${priority.name}`)}
                >
                  <span>{priority.icon}</span>
                  <span className={priority.color}>{priority.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notebook Section */}

        {/* Completed */}
        {renderButton(
          <FaCheckCircle size={20} className="text-green-600" />,
          "Completed",
          "Completed",
          stats?.completed || null
        )}

        {/* Trash */}
        {renderButton(
          <FaTrash size={20} className="text-red-600" />,
          "Trash",
          "Trash",
          stats?.deleted || null
        )}

        {/* Logout */}
        <button
          className={`flex items-center ${
            isOpen ? "justify-start" : "justify-center"
          } w-full px-4 py-3 rounded hover:bg-red-100 hover:text-red-700 transition-all duration-200 text-red-600`}
          onClick={handleLogout}
        >
          <FiLogOut size={20} />
          {isOpen && <span className="ml-3 font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

{
  /* <div>
          <button
            className={`flex items-center ${
              isOpen ? "justify-between" : "justify-center"
            } w-full px-4 py-3 rounded hover:bg-gray-300 transition-all duration-200`}
            onClick={() => setOpenNotebook(!openNotebook)}
          >
            <div className="flex items-center gap-3">
              <FaFolder size={20} className="text-orange-600" />
              {isOpen && <span className="font-medium">Notebook</span>}
            </div>
            {isOpen && (
              <span>{openNotebook ? <FaArrowUp /> : <FaArrowDown />}</span>
            )}
          </button>

          {openNotebook && isOpen && (
            <div className="ml-8 mt-1 mb-2 flex flex-col gap-1">
              {[
                {
                  name: "Project Plan",
                  icon: <FaFolder size={14} className="text-orange-500" />,
                },
                {
                  name: "Routing Notes",
                  icon: <FaFolder size={14} className="text-blue-500" />,
                },
                {
                  name: "Planning",
                  icon: <FaFolder size={14} className="text-green-500" />,
                },
              ].map((subItem) => (
                <button
                  key={subItem.name}
                  className={`flex items-center gap-2 px-3 py-2 rounded transition-all duration-200 text-sm cursor-pointer ${
                    selectedItem === `Notebook > ${subItem.name}`
                      ? "bg-gray-300 font-medium"
                      : "hover:bg-gray-200"
                  }`}
                  onClick={() => handleItemClick(`Notebook > ${subItem.name}`)}
                >
                  {subItem.icon}
                  <span>{subItem.name}</span>
                </button>
              ))}
            </div>
          )}
        </div> */
}
