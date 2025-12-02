import React, { useState } from "react";
import InputField from "../../Common/InputeField";
import Button from "../../Button/Button";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { SignInUser } from "../../../api/users";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const initialValues = {
  email: "",
  password: "",
};

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Email format is incorrect")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginSuccess, setLoginSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setLoginError("");
    setLoginSuccess("");
    try {
      const response = await SignInUser(values);
      const data = response.data;

      if (data.success) {
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem("user", JSON.stringify(data.user));

        setTimeout(() => {
          navigate("/dashboard");
        }, 100);

        setLoginSuccess("Login successful!");
        resetForm();
      }
    } catch (error) {
      setLoginError(
        error.response?.data?.message || "Login failed. Try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 className="text-3xl font-extrabold text-gray-800 text-center mb-6 relative">
          Sign In
        </h2>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="flex flex-col gap-4">
              {/* Show Login Success or Error */}
              {loginSuccess && (
                <div className="text-green-500 text-center">{loginSuccess}</div>
              )}
              {loginError && (
                <div className="text-red-500 text-center">{loginError}</div>
              )}

              {/* Email Field */}
              <InputField
                name="email"
                type="email"
                placeholder="Enter Your Email"
                label="Email"
              />

              {/* Password Field */}
              <div className="relative w-full">
                <InputField
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Your Password"
                  label="Password"
                  className="pr-10"
                />
                <span
                  className="absolute top-[38px] right-3 cursor-pointer text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <AiOutlineEyeInvisible size={20} />
                  ) : (
                    <AiOutlineEye size={20} />
                  )}
                </span>
              </div>

              <Button caption={isSubmitting ? "Signing In..." : "Sign In"} />
            </Form>
          )}
        </Formik>

        <p className="text-center text-red-5s00 mt-4 text-sm">
          <Link to="/forget-password">Forgot Password ?</Link>
        </p>

        <p className="text-center text-gray-500 mt-4 text-sm">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-500 cursor-pointer hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
