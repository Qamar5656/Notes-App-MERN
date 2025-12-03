import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import InputField from "../Common/InputeField";
import { toast } from "react-toastify";
import apiClient from "../../api/apiClient";

const AddTodo = ({ onTodoAdded }) => {
  const initialValues = {
    task: "",
    description: "",
    priority: "medium",
  };

  const validationSchema = Yup.object({
    task: Yup.string().required("Task is required"),
    description: Yup.string().required("Description is required"),
    priority: Yup.string().oneOf(["low", "medium", "high"]).required(),
  });

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    setSubmitting(true);
    try {
      const response = await apiClient.post("/create-todo", {
        task: values.task,
        description: values.description,
        priority: values.priority,
      });

      if (response.data.success) {
        toast.success(response.data.message);
        resetForm();
        if (onTodoAdded) onTodoAdded();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        // Session expired or token invalid
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
      } else {
        toast.error(error.response?.data?.message || "Server error");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Add New Task</h2>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            <InputField name="task" label="Task" placeholder="Enter task" />
            <InputField
              name="description"
              label="Description"
              placeholder="Enter task description"
            />
            <div>
              <label className="font-bold">Priority:</label>
              <Field
                as="select"
                name="priority"
                className="border border-gray-300 w-full rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </Field>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-gray-800 w-full text-white px-4 py-3 rounded-lg hover:bg-gray-600 transition cursor-pointer"
            >
              {isSubmitting ? "Adding..." : "Add Task"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddTodo;
