import Todo from "../models/todoModel.js";

// CREATE TODO
export const createTodo = async (req, res) => {
  try {
    const { task, priority, description, notebook } = req.body;

    if (!task || !priority || !description) {
      return res.status(400).json({
        success: false,
        message: "Task, priority, and description are required.",
      });
    }

    // Create todo for logged-in user
    const newTodo = await Todo.create({
      user: req.user.id,
      task,
      priority,
      description,
      notebook: notebook || "General", // Add notebook field
      taskCreatedAt: new Date(),
      status: "pending", // Default status
    });

    res.status(201).json({
      success: true,
      message: "Task added successfully.",
      data: newTodo,
    });
  } catch (error) {
    console.error("Create Todo Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

// GET TODOS WITH FILTERS (UPDATED)
export const getTodos = async (req, res) => {
  try {
    const { status, notebook, priority, sortBy = "createdAt" } = req.query;

    // Build filter object
    const filter = { user: req.user.id };

    // Filter by status
    if (status) {
      if (status === "all") {
        // Show all except deleted
        filter.status = { $ne: "deleted" };
      } else if (status === "deleted") {
        // Show only deleted
        filter.status = "deleted";
      } else {
        // Show specific status
        filter.status = status;
      }
    } else {
      // Default: show active todos (not deleted)
      filter.status = { $ne: "deleted" };
    }

    // Filter by notebook
    if (notebook && notebook !== "General") {
      filter.notebook = notebook;
    }

    // Filter by priority
    if (priority && priority !== "all") {
      filter.priority = priority;
    }

    // Sort options
    let sort = {};
    switch (sortBy) {
      case "createdAt":
        sort = { taskCreatedAt: -1 };
        break;
      case "priority":
        // Custom sort: high > medium > low
        sort = {
          priority: -1, // Custom sort needed
          taskCreatedAt: -1,
        };
        break;
      case "dueDate":
        sort = { dueDate: 1, taskCreatedAt: -1 };
        break;
      default:
        sort = { taskCreatedAt: -1 };
    }

    const todos = await Todo.find(filter).sort(sort);

    res.status(200).json({
      success: true,
      todos,
      filters: {
        status: status || "active",
        notebook: notebook || "all",
        priority: priority || "all",
      },
    });
  } catch (error) {
    console.error("Get Todos Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

// UPDATE TODO
export const updateTodos = async (req, res) => {
  const { id } = req.params;
  const { task, description, priority, notebook, status } = req.body;

  try {
    //findidng todo
    const todo = await Todo.findById(id);

    if (!todo) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    // Ownership check
    if (todo.user.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    // Update fields
    if (task !== undefined) todo.task = task;
    if (description !== undefined) todo.description = description;
    if (priority !== undefined) todo.priority = priority;
    if (notebook !== undefined) todo.notebook = notebook;
    if (status !== undefined) todo.status = status;

    //update the todo record
    const updatedTodo = await todo.save();

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      todo: updatedTodo,
    });
  } catch (error) {
    console.error("Update Todo Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

// DELETE TODO (SOFT DELETE - Move to trash)
export const DeleteTodo = async (req, res) => {
  const { id } = req.params;

  try {
    const todo = await Todo.findById(id);

    if (!todo) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    // Ownership check
    if (todo.user.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    // SOFT DELETE: Change status to "deleted"
    todo.status = "deleted";
    todo.deletedAt = new Date();
    await todo.save();

    res.status(200).json({
      success: true,
      message: "Task moved to trash successfully",
      todo,
    });
  } catch (error) {
    console.error("Delete Todo Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

// PERMANENT DELETE (Empty trash)
export const permanentDeleteTodo = async (req, res) => {
  const { id } = req.params;

  try {
    const todo = await Todo.findById(id);

    if (!todo) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    // Ownership check
    if (todo.user.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    // PERMANENT DELETE
    await todo.deleteOne();

    res.status(200).json({
      success: true,
      message: "Task permanently deleted",
    });
  } catch (error) {
    console.error("Permanent Delete Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

// routes/todoRoutes.js
export const SearchTodo = async (req, res) => {
  const { search } = req.query;
  const userId = req.user._id; // assuming authentication
  try {
    const todos = await Todo.find({
      user: userId,
      task: { $regex: search || "", $options: "i" },
      status: { $ne: "deleted" },
    });
    res.json({ success: true, todos });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Mark todo as completed
export const markAsCompleted = async (req, res) => {
  const { id } = req.params;

  try {
    const todo = await Todo.findById(id);

    if (!todo) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    // Ownership check
    if (todo.user.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    todo.status = "completed";
    todo.completedAt = new Date();
    await todo.save();

    res.status(200).json({
      success: true,
      message: "Task marked as completed",
      todo,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// RESTORE FROM TRASH
export const restoreTodo = async (req, res) => {
  const { id } = req.params;

  try {
    const todo = await Todo.findById(id);

    if (!todo) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    // Ownership check
    if (todo.user.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    todo.status = "pending";
    todo.deletedAt = null;
    await todo.save();

    res.status(200).json({
      success: true,
      message: "Task restored from trash",
      todo,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get todos by priority (Legacy - keep for compatibility)
export const getTodosByPriority = async (req, res) => {
  const { priority } = req.query;

  if (!priority) {
    return res
      .status(400)
      .json({ success: false, message: "Priority is required" });
  }

  try {
    const todos = await Todo.find({
      user: req.user.id,
      priority,
      status: { $ne: "deleted" }, // Exclude deleted
    }).sort({
      taskCreatedAt: -1,
    });

    res.status(200).json({
      success: true,
      todos,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get todos count by status (for sidebar stats)
export const getTodoStats = async (req, res) => {
  try {
    const stats = await Todo.aggregate([
      { $match: { user: req.user.id } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Convert to object
    const statsObj = {
      pending: 0,
      completed: 0,
      deleted: 0,
    };

    stats.forEach((stat) => {
      statsObj[stat._id] = stat.count;
    });

    res.status(200).json({
      success: true,
      stats: statsObj,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
