import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { createUser } from "../../api/users";

function SimpleForm({ editingUser, onUpdate, onCancel }) {
  const [serverError, setServerError] = useState("");

  // Password required only on CREATE
  const validationSchema = Yup.object({
    firstName: Yup.string()
      .min(2, "First name must be at least 2 characters")
      .required("First name is required"),
    lastName: Yup.string()
      .min(2, "Last name must be at least 2 characters")
      .required("Last name is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: editingUser
      ? Yup.string() // optional for update
      : Yup.string()
          .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/,
            "Password must include lowercase, uppercase, number & special character"
          )
          .required("Password is required"),
  });

  const initialValues = {
    firstName: editingUser?.firstName || "",
    lastName: editingUser?.lastName || "",
    email: editingUser?.email || "",
    password: "",
  };

  useEffect(() => {
    setServerError("");
  }, [editingUser]);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setServerError("");

    try {
      if (editingUser) {
        // Remove password if left empty
        const payload = { ...values };
        if (!payload.password) delete payload.password;

        await onUpdate(editingUser._id, payload);
      } else {
        await createUser(values);
      }

      resetForm();
      onCancel(); // close form
    } catch (error) {
      setServerError("Something went wrong. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-6">
        {editingUser ? "Update User" : "Add User"}
      </h2>

      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            {serverError && (
              <div className="text-red-600 text-sm mb-2 text-center">
                {serverError}
              </div>
            )}

            {/* First Name */}
            <div>
              <label className="block text-sm font-medium mb-1">
                First Name
              </label>
              <Field
                name="firstName"
                type="text"
                className="w-full px-3 py-2 border rounded-md"
              />
              <ErrorMessage name="firstName" className="text-red-500 text-sm" />
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Last Name
              </label>
              <Field
                name="lastName"
                type="text"
                className="w-full px-3 py-2 border rounded-md"
              />
              <ErrorMessage name="lastName" className="text-red-500 text-sm" />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Field
                name="email"
                type="email"
                className="w-full px-3 py-2 border rounded-md"
              />
              <ErrorMessage name="email" className="text-red-500 text-sm" />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <Field
                name="password"
                type="password"
                placeholder={editingUser ? "Leave blank to keep same" : ""}
                className="w-full px-3 py-2 border rounded-md"
              />
              <ErrorMessage name="password" className="text-red-500 text-sm" />
            </div>

            {/* Buttons */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2 bg-blue-600 text-white rounded-md"
            >
              {editingUser ? "Update User" : "Submit"}
            </button>

            {editingUser && (
              <button
                type="button"
                onClick={onCancel}
                className="w-full py-2 bg-gray-400 text-white rounded-md cursor-pointer"
              >
                Cancel
              </button>
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default SimpleForm;
