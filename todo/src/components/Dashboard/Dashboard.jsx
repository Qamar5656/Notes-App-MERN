import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar/Navbar";
import Sidebar from "./Sidebar/Sidebar";
import Footer from "./Footer/Footer";
import Table from "./Table/Table";
import { useTodos } from "../../hooks/useTodos";

const Dashboard = () => {
  const {
    todos,
    stats,
    page,
    totalPages,
    loading,
    addTodoOptimistic,
    setPage,
    completeTask,
    deleteTask,
    restoreTask,
    permanentDeleteTask,
    updateTask,
    setFilter,
  } = useTodos();

  const [searchQuery, setSearchQuery] = useState("");
  const [prefillTodo, setPrefillTodo] = useState(null);
  const [selectedItem, setSelectedItem] = useState("Tasks");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Load user from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  // Set filter when sidebar item changes
  useEffect(() => {
    setFilter(selectedItem);
  }, [selectedItem, setFilter]);

  const handleTaskAdded = (todo) => addTodoOptimistic(todo);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/signin");
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        selectedItem={selectedItem}
        stats={stats}
        setSelectedItem={setSelectedItem}
        handleLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar
          selectedItem={selectedItem}
          addTodoOptimistic={handleTaskAdded}
          updateTask={updateTask}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          editTodo={prefillTodo}
          setEditTodo={setPrefillTodo}
        />

        {/* <Table
          todos={todos} // pass full todos
          loading={loading}
          deleteTask={deleteTask}
          restoreTask={restoreTask}
          permanentDeleteTask={permanentDeleteTask}
          completeTask={completeTask}
          addTodoOptimistic={addTodoOptimistic}
          searchQuery={searchQuery}
          updateTask={updateTask}
          filter={selectedItem}
          onEdit={(todo) => setPrefillTodo(todo)}
          /> */}

        <Table
          todos={todos}
          loading={loading}
          deleteTask={deleteTask}
          restoreTask={restoreTask}
          permanentDeleteTask={permanentDeleteTask}
          completeTask={completeTask}
          updateTask={updateTask}
          addTodoOptimistic={addTodoOptimistic}
          // filter={filter}
          filter={selectedItem}
          searchQuery={searchQuery}
          page={page}
          limit={10}
          setPage={setPage}
          totalPages={totalPages}
          onEdit={(todo) => setPrefillTodo(todo)}
        />

        <Footer />
      </div>
    </div>
  );
};

export default Dashboard;
