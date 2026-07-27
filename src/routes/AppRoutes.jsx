import { Routes, Route } from "react-router-dom";
import AdminRoute from "../app/core/guards/AdminGuard";
import AuthGuard from "../app/core/guards/AuthGuard";

import Login from "../app/auth/login/Login";
import Signup from "../app/auth/signup/Signup";
import ForgotPassword from "../app/auth/forgot-password/Forgot-Password";

import Dashboard from "../app/user/dashboard";
import CreateTask from "../app/user/create-task/Create-Task";
import MyTasks from "../app/user/my-tasks/MyTasks";
import EditTask from "../app/user/edit-task/EditTask";
import Profile from "../app/user/profile/Profile";
import ChangePassword from "../app/user/change-password/ChangePassword";

import AdminDashboard from "../app/admin/admin-dashboard/AdminDashboard";
import Users from "../app/admin/users/Users";
import AllTasks from "../app/admin/all-tasks/AllTasks";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Protected User Routes */}
      <Route
        path="/user/dashboard"
        element={
          <AuthGuard>
            <Dashboard />
          </AuthGuard>
        }
      />

      <Route
        path="/user/create-task"
        element={
          <AuthGuard>
            <CreateTask />
          </AuthGuard>
        }
      />

      <Route
        path="/user/my-tasks"
        element={
          <AuthGuard>
            <MyTasks />
          </AuthGuard>
        }
      />

      <Route
        path="/user/edit-task/:id"
        element={
          <AuthGuard>
            <EditTask />
          </AuthGuard>
        }
      />

      <Route
        path="/user/profile"
        element={
          <AuthGuard>
            <Profile />
          </AuthGuard>
        }
      />

      <Route
        path="/user/change-password"
        element={
          <AuthGuard>
            <ChangePassword />
          </AuthGuard>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/users"
        element={
          <AdminRoute>
            <Users />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/all-tasks"
        element={
          <AdminRoute>
            <AllTasks />
          </AdminRoute>
        }
      />
    </Routes>
  );
}

export default AppRoutes;