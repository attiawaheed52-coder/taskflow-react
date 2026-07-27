import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Dashboard.css";
import { getTasks, updateTask } from "../../app/core/services/task.service";

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [totalTasks, setTotalTasks] = useState(0);
  const [pendingTasks, setPendingTasks] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [overdueTasks, setOverdueTasks] = useState(0);

 useEffect(() => {
  const currentUser = localStorage.getItem("user");

  if (!currentUser) {
    navigate("/login", { replace: true });
    return;
  }

  setUser(JSON.parse(currentUser));
  loadTasks();
}, []);

  const loadTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(data);
      setTotalTasks(data.length);
      setPendingTasks(data.filter((t) => t.status === "Pending").length);
      setCompletedTasks(data.filter((t) => t.status === "Completed").length);
      setOverdueTasks(data.filter((t) => t.status === "Overdue").length);
    } catch (error) {
      console.log(error);
    }
  };

  const changeStatus = async (task, status) => {
    try {
      await updateTask(task.id, { ...task, status });
      loadTasks();
    } catch (error) {
      console.log(error);
    }
  };

  const changePriority = async (task, priority) => {
    try {
      await updateTask(task.id, { ...task, priority });
      loadTasks();
    } catch (error) {
      console.log(error);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.clear();
    window.location.replace("/login");
  };

  return (
    <div className="dashboard">
      <div className="sidebar">
        <div className="logo">
          <h2>TaskFlow ✨</h2>
        </div>
        <ul>
          <li><Link to="/user/dashboard">Dashboard</Link></li>
          <li><Link to="/user/my-tasks">My Tasks</Link></li>
          <li><Link to="/user/create-task">Create Task</Link></li>
          <li><Link to="/user/profile">Profile</Link></li>
          <li><Link to="/user/change-password">Change Password</Link></li>
        </ul>
      </div>
      <div className="main">
        <div className="topbar">
          <h1>Welcome back {user?.name} 👋</h1>
          <button onClick={logout}>Logout</button>
        </div>
        <div className="cards">
          <div className="card total">
            <h2>{totalTasks}</h2>
            <p>Total Tasks</p>
          </div>
          <div className="card pending">
            <h2>{pendingTasks}</h2>
            <p>Pending</p>
          </div>
          <div className="card completed">
            <h2>{completedTasks}</h2>
            <p>Completed</p>
          </div>
          <div className="card overdue">
            <h2>{overdueTasks}</h2>
            <p>Overdue</p>
          </div>
        </div>
        <div className="task-section">
          <h2>Recent Tasks</h2>
          <table>
            <thead>
              <tr>
                <th>Task</th>
                <th>Status</th>
                <th>Priority</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id}>
                  <td>{task.title}</td>
                  <td>
                    <select
                      value={task.status}
                      onChange={(e) => changeStatus(task, e.target.value)}
                    >
                      <option>Pending</option>
                      <option>Completed</option>
                      <option>Overdue</option>
                    </select>
                  </td>
                  <td>
                    <select
                      value={task.priority}
                      onChange={(e) => changePriority(task, e.target.value)}
                    >
                      <option>High</option>
                      <option>Medium</option>
                      <option>Low</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;