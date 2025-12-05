import React from "react";
import { toast } from "react-toastify";
import TableSkeleton from "../../Common/TableSkeleton";
import { FaCheck, FaEdit, FaTrash, FaTrashRestore } from "react-icons/fa";
import { useModal } from "../../../context/ModalContext";
import { useOptimistic } from "react";

const Table = ({
  todos = [],
  filter = "",
  searchQuery = "",
  page,
  totalPages,
  setPage,
  loading = false,
  deleteTask,
  restoreTask,
  permanentDeleteTask,
  completeTask,
  updateTask,
  addTodoOptimistic,
  onEdit,
}) => {
  const { openConfirm } = useModal();

  const [optimisticTodos, updateOptimistic] = useOptimistic(
    todos,
    (currentTodos, action) => {
      switch (action.type) {
        case "delete":
          return currentTodos.filter((t) => t._id !== action.id);
        case "restore":
          return currentTodos.map((t) =>
            t._id === action.id ? { ...t, deleted: false } : t
          );
        case "update":
          return currentTodos.map((t) =>
            t._id === action.id ? { ...t, ...action.data } : t
          );
        case "rollback":
          return todos;
        case "sync":
          return action.data || [];
        default:
          return currentTodos;
      }
    }
  );

  React.useEffect(() => {
    React.startTransition(() => {
      updateOptimistic({ type: "sync", data: todos });
    });
  }, [todos]);

  // Useoptimistic hook implementation
  //Delete Function
  const handleDelete = async (id) => {
    updateOptimistic({ type: "delete", id });
    try {
      await deleteTask(id);
    } catch {
      toast.error("Failed");
      updateOptimistic({ type: "rollback" });
    }
  };

  //Restore Function
  const handleRestore = async (id) => {
    updateOptimistic({ type: "restore", id });
    try {
      await restoreTask(id);
      toast.success("Task restored!");
    } catch {
      toast.error("Failed to restore");
      updateOptimistic({ type: "rollback" });
    }
  };

  // const handleComplete = async (id) => {
  //   updateOptimistic({ type: "update", id, data: { status: "completed" } });
  //   try {
  //     await completeTask(id);
  //   } catch {
  //     toast.error("Failed to complete task");
  //     updateOptimistic({ type: "rollback" });
  //   }
  // };

  // Filter + Search (only on current page)
  const filteredTodos = optimisticTodos.filter((todo) => {
    const matchesFilter =
      filter === "Tasks" ||
      (filter === "Completed" && todo.status === "completed") ||
      (filter === "Trash" && todo.status === "deleted") ||
      (filter.startsWith("Priority: ") &&
        todo.priority.toLowerCase() ===
          filter.replace("Priority: ", "").toLowerCase());

    const matchesSearch =
      todo.task.toLowerCase().includes(searchQuery.toLowerCase()) ||
      todo.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const ITEMS_PER_PAGE = 10;
  const computedTotalPages = Math.ceil(filteredTodos.length / ITEMS_PER_PAGE);

  React.useEffect(() => {
    if (page > computedTotalPages) {
      setPage(computedTotalPages || 1);
    }
  }, [page, computedTotalPages, setPage]);

  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  const paginatedTodos = filteredTodos.slice(start, end);

  if (loading) return <TableSkeleton rows={5} columns={6} />;

  const isTrashView = filter === "Trash";

  return (
    <main className="flex-1 overflow-auto p-6">
      <div className="bg-white shadow-md rounded-lg p-4">
        {/* Header */}
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            {filter === "Tasks" && "All Tasks"}
            {filter === "Completed" && "Completed Tasks"}
            {filter === "Trash" && "Trash"}
            {filter.startsWith("Priority: ") && filter}
          </h2>
          <p className="text-gray-600 text-sm">
            {filteredTodos.length}{" "}
            {filteredTodos.length === 1 ? "task" : "tasks"} found
          </p>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-800 text-white">
              {/* Table Heading Row */}
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
              {/* Tasks Data Fetching */}
              {paginatedTodos.length > 0 ? (
                paginatedTodos.map((todo, index) => (
                  <tr
                    key={todo._id}
                    className={
                      index % 2 === 0 ? "border-b" : "border-b bg-gray-50"
                    }
                  >
                    <td className="py-7 px-4 font-medium">{todo.task}</td>
                    <td className="py-7 px-4 text-gray-600">
                      {/* Long Task description tooltip */}
                      <span title={todo.description}>
                        {todo.description.length > 50
                          ? todo.description.slice(0, 50) + "..."
                          : todo.description}
                      </span>
                    </td>
                    {/* Priority of task  */}
                    <td className="py-7 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          todo.priority === "high"
                            ? "bg-red-100 text-red-800"
                            : todo.priority === "medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {todo.priority}
                      </span>
                    </td>
                    {/* Todo Status */}
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          todo.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : todo.status === "deleted"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {todo.status}
                      </span>
                    </td>
                    {/* Date Record  */}
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {new Date(todo.createdAt).toLocaleDateString()}
                    </td>

                    {/* Buttons Display of table  */}
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        {/* Trash Row data  */}
                        {isTrashView ? (
                          <>
                            <button
                              className="p-2 bg-green-500 text-white rounded hover:bg-green-600 cursor-pointer"
                              onClick={() => handleRestore(todo._id)}
                            >
                              <FaTrashRestore size={14} />
                            </button>
                            <button
                              className="p-2 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer"
                              onClick={() =>
                                openConfirm("Permanently delete?", () =>
                                  permanentDeleteTask(todo._id)
                                )
                              }
                            >
                              <FaTrash size={14} />
                            </button>
                          </>
                        ) : (
                          <>
                            {todo.status !== "completed" && (
                              <button
                                className="p-2 bg-green-500 text-white rounded hover:bg-green-600 cursor-pointer cursor-pointer"
                                onClick={() => completeTask(todo._id)}
                              >
                                <FaCheck size={14} />
                              </button>
                            )}
                            <button
                              className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
                              onClick={() => onEdit(todo)}
                            >
                              <FaEdit size={14} />
                            </button>
                            <button
                              className="p-2 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer"
                              onClick={() =>
                                openConfirm("Move to Trash?", () =>
                                  handleDelete(todo._id)
                                )
                              }
                            >
                              <FaTrash size={14} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">
                    No tasks found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}

          {paginatedTodos.length > 0 ? (
            <div className="flex justify-center items-center gap-4 mt-4">
              <button
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </button>

              <span className="text-gray-700 font-medium">
                Page {page} of {computedTotalPages || 1}
              </span>

              <button
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
                disabled={page >= computedTotalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </button>
            </div>
          ) : (
            " "
          )}
        </div>
      </div>
    </main>
  );
};

export default Table;
