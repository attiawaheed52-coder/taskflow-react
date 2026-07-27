import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./Create-Task.css";

import {
  getTasks,
  addTask
} from "../../../app/core/services/task.service";

function CreateTask() {

  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [totalTasks, setTotalTasks] = useState(0);
  const [pendingTasks, setPendingTasks] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [overdueTasks, setOverdueTasks] = useState(0);

  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    status: "Pending",
    priority: "",
  });

  useEffect(() => {
    const currentUser = JSON.parse(
      localStorage.getItem("currentUser")
    );

    setUser(currentUser);

    loadTaskStats(currentUser);
  }, []);

  const loadTaskStats = async (currentUser) => {

    try {

      const res = await getTasks();

      const userTasks = res.data.filter(
        task => task.email === currentUser?.email
      );

      setTotalTasks(userTasks.length);

      setPendingTasks(
        userTasks.filter(
          t => t.status === "Pending"
        ).length
      );

      setCompletedTasks(
        userTasks.filter(
          t => t.status === "Completed"
        ).length
      );

      setOverdueTasks(
        userTasks.filter(
          t => t.status === "Overdue"
        ).length
      );

    } catch (err) {

      console.log(err);

    }
  };

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    setSuccess("");
    setError("");

    if (
      !form.title ||
      !form.description ||
      !form.dueDate ||
      !form.priority
    ) {

      setError(
        "⚠️ Please fill all required fields!"
      );

      return;
    }

    try {

      const payload = {
        ...form,
        email: user?.email
      };

      await addTask(payload);

      setSuccess(
        "🎉 Task Created Successfully!"
      );

      setForm({
        title: "",
        description: "",
        dueDate: "",
        status: "Pending",
        priority: "",
      });

      loadTaskStats(user);

      setTimeout(() => {
        navigate("/user/my-tasks");
      }, 2500);

    } catch (err) {

      setError(
        "❌ Something went wrong while creating task!"
      );

    }
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
            <Link
              to="/user/create-task"
              className="active"
            >
              Create Task
            </Link>
          </li>

          <li>
            <Link to="/user/profile">
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

          <h1>Create New Task ✨</h1>

          <button
            onClick={logout}
          >
            Logout
          </button>

        </div>

        {/* STATS */}

        <div className="stats-grid">

          <div className="stat-card total">
            <h2>{totalTasks}</h2>
            <p>Total Tasks</p>
          </div>

          <div className="stat-card pending">
            <h2>{pendingTasks}</h2>
            <p>Pending</p>
          </div>

          <div className="stat-card completed">
            <h2>{completedTasks}</h2>
            <p>Completed</p>
          </div>

          <div className="stat-card overdue">
            <h2>{overdueTasks}</h2>
            <p>Overdue</p>
          </div>

        </div>

        {/* FORM CARD */}

        <div className="task-card">

          <h2>Create Task</h2>

          {success &&
            <div className="success">
              {success}
            </div>
          }

          {error &&
            <div className="error">
              {error}
            </div>
          }

          <form onSubmit={handleSubmit}>

            <input
              type="text"
              name="title"
              placeholder="Task Title"
              value={form.title}
              onChange={handleChange}
            />

            <textarea
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
            />

            <input
              type="date"
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
            />

            <select
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              <option value="Pending">
                Pending
              </option>

              <option value="Completed">
                Completed
              </option>

              <option value="Overdue">
                Overdue
              </option>
            </select>

            <select
              name="priority"
              value={form.priority}
              onChange={handleChange}
            >
              <option value="">
                Select Priority
              </option>

              <option value="High">
                High
              </option>

              <option value="Medium">
                Medium
              </option>

              <option value="Low">
                Low
              </option>
            </select>

            <button type="submit">
              Create Task
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}

export default CreateTask;