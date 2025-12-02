import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import InputField from "../../Common/InputeField";
import Button from "../../Button/Button";
import { forgetPassword } from "../../../api/users";

const ForgetPassword = () => {
  const [message, setMessage] = useState({ type: "", text: "" });
  const navigate = useNavigate();

  const initialValues = {
    email: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setMessage({ type: "", text: "" });
    try {
      const res = await forgetPassword({ email: values.email });
      if (res.data.success) {
        setMessage({
          type: "success",
          text: res.data.message,
        });
        resetForm();
        // Navigate to reset password page after OTP sent
        setTimeout(() => {
          navigate("/reset-password", { state: { email: values.email } });
        }, 1500);
      } else {
        setMessage({ type: "error", text: res.data.message });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Server error. Try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 className="text-3xl font-extrabold text-gray-800 text-center mb-6">
          Forget Password
        </h2>

        {message.text && (
          <div
            className={`mb-4 p-3 rounded ${
              message.type === "success"
                ? "bg-green-200 text-green-800"
                : "bg-red-200 text-red-800"
            }`}
          >
            {message.text}
          </div>
        )}

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="flex flex-col gap-4">
              <InputField
                name="email"
                type="email"
                placeholder="Enter your registered email"
                label="Email"
              />

              <Button caption={isSubmitting ? "Sending OTP..." : "Send OTP"} />
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ForgetPassword;
