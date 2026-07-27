import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { getTasks } from "../../core/services/task.service";

import "./Profile.css";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [successMessage, setSuccessMessage] =
    useState(null);

  const [totalTasks, setTotalTasks] =
    useState(0);

  const [pendingTasks, setPendingTasks] =
    useState(0);

  const [completedTasks, setCompletedTasks] =
    useState(0);

  const [overdueTasks, setOverdueTasks] =
    useState(0);

  const [profileForm, setProfileForm] =
    useState({
      name: "",
      email: "",
    });

  useEffect(() => {
    const currentUser = JSON.parse(
      localStorage.getItem("currentUser")
    );

    setUser(currentUser);

    if (currentUser) {
      setProfileForm({
        name: currentUser.name || "",
        email: currentUser.email || "",
      });
    }

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
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setProfileForm({
      ...profileForm,
      [e.target.name]: e.target.value,
    });
  };

  const updateProfile = (e) => {
    e.preventDefault();

    const updatedUser = {
      ...user,
      name: profileForm.name,
      email: profileForm.email,
    };

    localStorage.setItem(
      "currentUser",
      JSON.stringify(updatedUser)
    );

    setUser(updatedUser);

    setSuccessMessage(
      "Profile Updated Successfully! 🎉"
    );

    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  };

  const logout = () => {
    localStorage.removeItem(
      "currentUser"
    );

    navigate("/login");
  };

  return (
    <div className="dashboard">
      {/* SIDEBAR */}

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
            <Link
              to="/user/profile"
              className="active"
            >
              Profile
            </Link>
          </li>

          <li>
            <Link to="/user/change-password">
              Change Password
            </Link>
          </li>
        </ul>
      </div>

      {/* MAIN */}

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

        {/* STATS */}

        <div className="cards">
          <div className="card total">
            <h2>{totalTasks}</h2>
            <p>📋 Total Tasks</p>
          </div>

          <div className="card pending">
            <h2>{pendingTasks}</h2>
            <p>⏳ Pending</p>
          </div>

          <div className="card completed">
            <h2>{completedTasks}</h2>
            <p>✅ Completed</p>
          </div>

          <div className="card overdue">
            <h2>{overdueTasks}</h2>
            <p>🚨 Overdue</p>
          </div>
        </div>

        {/* PROFILE */}

        <div className="profile-page">
          <div className="profile-card">
            {successMessage && (
              <div className="success-alert">
                {successMessage}
              </div>
            )}

            <div className="profile-top">
              <div className="profile-image">
                {user?.name
                  ? user.name
                      .charAt(0)
                      .toUpperCase()
                  : "A"}
              </div>

              <h1>My Profile</h1>

              <p>
                Manage your account
                information
              </p>
            </div>

            <form
              onSubmit={updateProfile}
            >
              <div className="input-group">
                <label>
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={profileForm.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                />
              </div>

              <div className="input-group">
                <label>
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  value={profileForm.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                />
              </div>

              <button
                type="submit"
                className="update-btn"
              >
                Update Profile
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;