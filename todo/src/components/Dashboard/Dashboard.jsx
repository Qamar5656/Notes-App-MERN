import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "./Navbar/Navbar";
import Sidebar from "./Sidebar/Sidebar";
import Footer from "./Footer/Footer";
import Table from "./Table/Table";
import { useTodos } from "../../hooks/useTodos";

const Dashboard = () => {
  const {
    todos,
    stats,
    loading,
    addTodoOptimistic,
    completeTask,
    deleteTask,
    restoreTask,
    permanentDeleteTask,
    updateTask,
    setFilter,
  } = useTodos();

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [prefillTodo, setPrefillTodo] = useState(null);

  const { section } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [selectedItem, setSelectedItem] = useState("Tasks");

  // Load user from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  // Set filter when sidebar item changes
  useEffect(() => {
    setFilter(selectedItem);
  }, [selectedItem, setFilter]);

  // Filter todos based on search
  useEffect(() => {
    if (!todos) return;

    setFilteredTodos(
      todos.filter((todo) => {
        const task = todo.task || "";
        const desc = todo.description || "";
        const query = searchQuery.toLowerCase();
        return (
          task.toLowerCase().includes(query) ||
          desc.toLowerCase().includes(query)
        );
      })
    );
  }, [searchQuery, todos]);

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

        <Table
          todos={filteredTodos}
          loading={loading}
          deleteTask={deleteTask}
          restoreTask={restoreTask}
          permanentDeleteTask={permanentDeleteTask}
          completeTask={completeTask}
          onEdit={(todo) => setPrefillTodo(todo)}
        />

        <Footer />
      </div>
    </div>
  );
};

export default Dashboard;
