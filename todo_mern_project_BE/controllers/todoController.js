import Todo from "../models/todoModel.js";

//Todo Creation api
export const createTodo = async (req, res) => {
  try {
    const { task, priority, description } = req.body;

    // Validation
    if (!task || !priority || !description) {
      return res.status(400).json({
        success: false,
        message: "Task, priority, and description are required.",
      });
    }

    // Create task with timestamp
    const newTask = await Todo.create({
      task,
      priority,
      description,
      taskCreatedAt: new Date(),
    });

    //correct response
    return res.status(201).json({
      success: true,
      message: "Task added successfully.",
      data: newTask,
    });
  } catch (error) {
    console.error("Create Todo Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

//Todos fetching from database
export const getTodos = async (req, res) => {
  try {
    const todos = await Todo.find();
    res.status(200).json({
      success: true,
      todos,
    });
  } catch (err) {
    console.error("Backend Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

//Update todo
export const updateTodos = async (req, res) => {
  const { id } = req.params;
  const { task, description } = req.body;

  console.log("id value is ", id);
  try {
    //find todo from database
    const todo = await Todo.findById(id);

    //if no todo found
    if (!todo) {
      return res
        .status(404)
        .json({ success: false, message: "Task Not Found" });
    }

    //update provided fields
    todo.task = task || todo.task;
    todo.description = description || todo.description;

    //Save Updated todo
    const updatedTodo = await todo.save();

    //correct response
    res.status(200).json({
      success: true,
      message: "Todo updated successfully",
      todo: updatedTodo,
    });
  } catch (error) {
    console.error("Backend Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

//Delete todo
export const DeleteTodo = async (req, res) => {
  const { id } = req.params; // get user ID from route

  try {
    const todo = await Todo.findOneAndDelete({ _id: id });

    if (!todo) {
      return res.status(404).json({ message: "todo not found" });
    }

    res.status(200).json({ message: "todo deleted successfully", todo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
};
