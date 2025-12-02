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

export const updateTodos = async (req, res) => {};
