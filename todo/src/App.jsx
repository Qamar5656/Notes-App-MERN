import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SignIn from "./components/Users/SignIn/SignIn.jsx";
import SignUp from "./components/Users/SignUp/SignUp.jsx";
import Dashboard from "./components/Dashboard/Dashboard.jsx";
import PublicRoute from "./routes/PublicRoute.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import VerifyOtp from "./components/Users/OtpForm/VerifyOtp.jsx";
import ForgetPassword from "./components/Users/forgetPassword/ForgetPassword.jsx";
import ResetPassword from "./components/Users/resetPassword/ResetPassword.jsx";
import { ToastContainer } from "react-toastify";
import { ModalProvider } from "./context/ModalContext";
import ConfirmModal from "./components/Common/ConfirmModel.jsx";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <>
      <ModalProvider>
        <BrowserRouter>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />

          <ConfirmModal />

          <Routes>
            {/* Public Routes */}
            <Route
              path="/signin"
              element={
                <PublicRoute>
                  <SignIn />
                </PublicRoute>
              }
            />
            <Route
              path="/signup"
              element={
                <PublicRoute>
                  <SignUp />
                </PublicRoute>
              }
            />
            <Route
              path="/verify-otp"
              element={
                <PublicRoute>
                  <VerifyOtp />
                </PublicRoute>
              }
            />
            <Route
              path="/forget-password"
              element={
                <PublicRoute>
                  <ForgetPassword />
                </PublicRoute>
              }
            />
            <Route
              path="/reset-password"
              element={
                <PublicRoute>
                  <ResetPassword />
                </PublicRoute>
              }
            />

            {/* Protected Dashboard Routes - CORRECT ORDER! */}

            {/* 1. Most specific: Two-path routes */}
            <Route
              path="/dashboard/priority/:name"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard/notebook/:name"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* 2. Less specific: One-path routes */}
            <Route
              path="/dashboard/:section"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* 3. Least specific: Base route */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* Redirect any unknown route to SignIn */}
            <Route path="*" element={<Navigate to="/signin" replace />} />
          </Routes>
        </BrowserRouter>
      </ModalProvider>
    </>
  );
};

export default App;
