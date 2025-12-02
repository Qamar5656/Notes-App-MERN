import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Dashboard/Navbar/Navbar";
import Footer from "../Dashboard/Footer/Footer";
import Sidebar from "../Dashboard/Sidebar/Sidebar";
import Table from "../Dashboard/Table/Table";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [selectedItem, setSelectedItem] = useState("Tasks");
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  if (!user) return <p>Loading user...</p>;

  // Logout Function
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    navigate("/signin");
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        // username={`${user.firstName} ${user.lastName}`}
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
        handleLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <Navbar selectedItem={selectedItem} />

        {/* Table Data */}
        <Table />

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default Dashboard;
