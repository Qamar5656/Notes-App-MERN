import React from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import InputField from "../Common/InputeField";
import { toast } from "react-toastify";

const AddTodo = ({ onTodoAdded, onTodoUpdated, initialData, closeModal }) => {
  const isEdit = Boolean(initialData && initialData._id);

  const initialValues = {
    task: initialData?.task || "",
    description: initialData?.description || "",
    priority: initialData?.priority || "medium",
  };

  const validationSchema = Yup.object({
    task: Yup.string().required("Task is required"),
    description: Yup.string().required("Description is required"),
    priority: Yup.string().oneOf(["low", "medium", "high"]).required(),
  });
  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    try {
      if (isEdit) {
        await onTodoUpdated(initialData._id, values);
        toast.success("Task updated successfully");
      } else {
        await onTodoAdded(values);
        toast.success("Task added successfully");
      }
      resetForm();
      if (closeModal) closeModal();
    } catch (error) {
      toast.error("Operation failed, please try again");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">
        {isEdit ? "Update Task" : "Add New Task"}
      </h2>
      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            <InputField name="task" label="Task" placeholder="Enter task" />
            <InputField
              name="description"
              label="Description"
              placeholder="Enter description"
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
              {isSubmitting
                ? isEdit
                  ? "Updating..."
                  : "Adding..."
                : isEdit
                ? "Update Task"
                : "Add Task"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddTodo;
