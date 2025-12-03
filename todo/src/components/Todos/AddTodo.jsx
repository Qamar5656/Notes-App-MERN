import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import InputField from "../Common/InputeField";
import axios from "axios";
import { toast } from "react-toastify"; // import toast

const AddTodo = ({ onTodoAdded }) => {
  const initialValues = {
    title: "",
    description: "",
    priority: "medium",
  };

  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    priority: Yup.string().oneOf(["low", "medium", "high"]).required(),
  });

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post("/api/todos/create-todo", values, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        toast.success(response.data.message); // show success toast
        resetForm();
        if (onTodoAdded) onTodoAdded();
      } else {
        toast.error(response.data.message); // show error toast
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Server error");
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
            <InputField
              name="title"
              label="Title"
              placeholder="Enter task title"
            />
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
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
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
