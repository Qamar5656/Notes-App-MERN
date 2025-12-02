import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import InputField from "../../Common/InputeField";
import Button from "../../Button/Button";
import { resetPassword } from "../../../api/users";

const ResetPassword = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const email = state?.email || "";
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (!email) {
      setMessage({
        type: "error",
        text: "No email provided. Go back and try again.",
      });
    }
  }, [email]);

  const initialValues = {
    otp: "",
    newPassword: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object({
    otp: Yup.string()
      .length(6, "OTP must be 6 digits")
      .required("OTP is required"),
    newPassword: Yup.string()
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/,
        "Password must include lowercase, uppercase, number & special character"
      )
      .required("New password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
      .required("Confirm password is required"),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setMessage({ type: "", text: "" });
    try {
      const res = await resetPassword({
        email,
        otp: values.otp,
        newPassword: values.newPassword,
      });

      if (res.data.success) {
        setMessage({ type: "success", text: res.data.message });
        resetForm();
        setTimeout(() => navigate("/signin"), 1500);
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
          Reset Password
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

        {!email ? (
          <p className="text-red-500 text-center">
            Email not provided. Please go back and try again.
          </p>
        ) : (
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="flex flex-col gap-4">
                <Input
                  name="otp"
                  type="text"
                  placeholder="Enter OTP"
                  label="OTP"
                />
                <InputField
                  name="newPassword"
                  type="password"
                  placeholder="Enter new password"
                  label="New Password"
                />
                <InputField
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  label="Confirm Password"
                />

                <Button
                  caption={isSubmitting ? "Resetting..." : "Reset Password"}
                />
              </Form>
            )}
          </Formik>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
