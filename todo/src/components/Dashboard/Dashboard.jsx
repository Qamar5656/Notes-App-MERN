// components/Dashboard/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTodos } from "../../hooks/useTodos";
import Navbar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";
import Sidebar from "./Sidebar/Sidebar";
import Table from "./Table/Table";

const Dashboard = () => {
  const { section, name } = useParams();
  const navigate = useNavigate();

  const [selectedItem, setSelectedItem] = useState("Tasks");
  const [filter, setFilter] = useState("");
  const [user, setUser] = useState(null);

  // Get todos data and stats
  const { stats, refreshTodos } = useTodos(filter || "");

  // Load logged-in user
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  useEffect(() => {
    console.log("Dashboard params:", { section, name });
    console.log("Full URL:", window.location.pathname);

    if (!section) {
      setSelectedItem("Tasks");
      setFilter("Tasks");
      navigate("/dashboard/tasks");
      return;
    }

    if (section === "tasks") {
      setSelectedItem("Tasks");
      setFilter("Tasks");
    } else if (section === "completed") {
      setSelectedItem("Completed");
      setFilter("Completed");
    } else if (section === "trash") {
      setSelectedItem("Trash");
      setFilter("Trash");
    } else if (section === "priority" && name) {
      // Handle priority route
      const priorityName =
        name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
      setSelectedItem(`Priority: ${priorityName}`);
      setFilter(`Priority: ${priorityName}`);
    } else if (section === "notebook" && name) {
      setSelectedItem(`Notebook > ${name}`);
      setFilter(`Notebook > ${name}`);
    } else {
      // Fallback for any other section
      setSelectedItem(section);
      setFilter(section);
    }
  }, [section, name, navigate]);

  if (!user) return <p>Loading user...</p>;

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    navigate("/signin");
  };

  // Handle task added - refresh data
  const handleTaskAdded = () => {
    refreshTodos();
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        selectedItem={selectedItem}
        handleLogout={handleLogout}
        stats={stats}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar selectedItem={selectedItem} onTaskAdded={handleTaskAdded} />

        <Table filter={filter} />

        <Footer />
      </div>
    </div>
  );
};

export default Dashboard;
