import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./AdminDashboard.css";

import { getTasks } from "../../core/services/task.service";
import {
  getUsers,
  getUser,
  logout
} from "../../core/services/user.service";

 function AdminDashboard() {

  const navigate = useNavigate();

  const [adminUser, setAdminUser] = useState(null);

  const [totalUsers, setTotalUsers] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {

      const user = getUser();
      setAdminUser(user);

      const tasks = await getTasks();
      setTotalTasks(tasks.length);

      const users = await getUsers();
      setTotalUsers(users.length);

    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="dashboard">

      <div className="sidebar">

        <div className="logo">
          <h2>TaskFlow ✨</h2>
        </div>

        <ul>
          <li>
            <Link
              to="/admin/dashboard"
              className="active"
            >
              Dashboard
            </Link>
          </li>

          <li>
            <Link to="/admin/users">
              Users
            </Link>
          </li>

          <li>
            <Link to="/admin/all-tasks">
              All Tasks
            </Link>
          </li>
        </ul>

      </div>

      <div className="main">

        <div className="topbar">

          <h1>
            {adminUser
              ? `Welcome back, ${adminUser.name} 👋 (Admin)`
              : "Welcome back Admin 👋"}
          </h1>

          <button onClick={handleLogout}>
            Logout 🚪
          </button>

        </div>

        <div className="stats-grid">

          <div className="stat-card total">
            <h2>{totalUsers}</h2>
            <p>👥 Total Users</p>
          </div>

          <div className="stat-card completed">
            <h2>{totalTasks}</h2>
            <p>📋 Global Tasks</p>
          </div>

        </div>

        <div className="admin-console">

          <div className="console-icon">
            ⚙️
          </div>

          <h2>
            System Management Console
          </h2>

          <p>
            Use the sidebar links to view,
            manage and monitor system users,
            tasks and activity across
            the entire TaskFlow platform.
          </p>

          <div className="console-buttons">

            <Link
              to="/admin/users"
              className="console-btn"
            >
              Manage Users
            </Link>

            <Link
              to="/admin/all-tasks"
              className="console-btn secondary"
            >
              View Tasks
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}
export default AdminDashboard;