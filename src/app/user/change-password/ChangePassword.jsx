import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { getTasks } from "../../core/services/task.service";

import "./ChangePassword.css";

function ChangePassword() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [successMessage, setSuccessMessage] =
    useState(null);

  const [errorMessage, setErrorMessage] =
    useState(null);

  const [totalTasks, setTotalTasks] =
    useState(0);

  const [pendingTasks, setPendingTasks] =
    useState(0);

  const [completedTasks, setCompletedTasks] =
    useState(0);

  const [overdueTasks, setOverdueTasks] =
    useState(0);

  const [passwordForm, setPasswordForm] =
    useState({
      currentPassword: "",
      newPassword: "",
    });

  useEffect(() => {
    const currentUser = JSON.parse(
      localStorage.getItem("currentUser")
    );

    setUser(currentUser);

    loadTaskStats();
  }, []);

  const loadTaskStats = async () => {
    try {
      const data = await getTasks();

      setTotalTasks(data.length);

      setPendingTasks(
        data.filter(
          (t) =>
            t.status?.toLowerCase() ===
            "pending"
        ).length
      );

      setCompletedTasks(
        data.filter(
          (t) =>
            t.status?.toLowerCase() ===
            "completed"
        ).length
      );

      setOverdueTasks(
        data.filter(
          (t) =>
            t.status?.toLowerCase() ===
            "overdue"
        ).length
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value,
    });
  };

  const clearMessagesAfterDelay = () => {
    setTimeout(() => {
      setSuccessMessage(null);
      setErrorMessage(null);
    }, 3000);
  };

  const changePassword = (e) => {
    e.preventDefault();

    setSuccessMessage(null);
    setErrorMessage(null);

    if (
      !passwordForm.currentPassword ||
      !passwordForm.newPassword
    ) {
      setErrorMessage(
        "Please fill all fields! ⚠️"
      );

      clearMessagesAfterDelay();
      return;
    }

    const currentUser = JSON.parse(
      localStorage.getItem("currentUser")
    );

    if (
      !currentUser ||
      passwordForm.currentPassword !==
        currentUser.password
    ) {
      setErrorMessage(
        "Current Password Incorrect! ❌"
      );

      clearMessagesAfterDelay();
      return;
    }

    currentUser.password =
      passwordForm.newPassword;

    localStorage.setItem(
      "currentUser",
      JSON.stringify(currentUser)
    );

    setSuccessMessage(
      "Password Updated Successfully! 🔑"
    );

    setPasswordForm({
      currentPassword: "",
      newPassword: "",
    });

    clearMessagesAfterDelay();
  };

  const logout = () => {
    localStorage.removeItem(
      "currentUser"
    );

    navigate("/login");
  };

  return (
    <div className="dashboard">
      {/* Sidebar */}

      <div className="sidebar">
        <div className="logo">
          <h2>TaskFlow ✨</h2>
        </div>

        <ul>
          <li>
            <Link to="/user/dashboard">
              Dashboard
            </Link>
          </li>

          <li>
            <Link to="/user/my-tasks">
              My Tasks
            </Link>
          </li>

          <li>
            <Link to="/user/create-task">
              Create Task
            </Link>
          </li>

          <li>
            <Link to="/user/profile">
              Profile
            </Link>
          </li>

          <li>
            <Link
              to="/user/change-password"
              className="active"
            >
              Change Password
            </Link>
          </li>
        </ul>
      </div>

      {/* Main */}

      <div className="main">
        <div className="topbar">
          <h1>
            Welcome back,
            {user?.name} 👋
          </h1>

          <button
            className="logout-btn"
            onClick={logout}
          >
            Logout 🚪
          </button>
        </div>

        {/* Stats */}

        <div className="cards">
          <div className="card">
            <h2>{totalTasks}</h2>
            <p>📋 Total Tasks</p>
          </div>

          <div className="card">
            <h2>{pendingTasks}</h2>
            <p>⏳ Pending</p>
          </div>

          <div className="card">
            <h2>{completedTasks}</h2>
            <p>✅ Completed</p>
          </div>

          <div className="card">
            <h2>{overdueTasks}</h2>
            <p>🚨 Overdue</p>
          </div>
        </div>

        {/* Password Form */}

        <div className="password-page">
          <div className="password-card">

            {successMessage && (
              <div className="success-alert">
                {successMessage}
              </div>
            )}

            {errorMessage && (
              <div className="error-alert">
                {errorMessage}
              </div>
            )}

            <h1>Change Password</h1>

            <form
              onSubmit={changePassword}
            >
              <div className="input-group">
                <label>
                  Current Password
                </label>

                <input
                  type="password"
                  name="currentPassword"
                  value={
                    passwordForm.currentPassword
                  }
                  onChange={handleChange}
                />
              </div>

              <div className="input-group">
                <label>
                  New Password
                </label>

                <input
                  type="password"
                  name="newPassword"
                  value={
                    passwordForm.newPassword
                  }
                  onChange={handleChange}
                />
              </div>

              <button
                type="submit"
                className="update-btn"
              >
                Update Password
              </button>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;