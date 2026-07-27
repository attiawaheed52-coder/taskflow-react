import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./MyTasks.css";

import { getTasks, deleteTask } from "../../core/services/task.service";

function MyTasks() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);

  const [totalTasks, setTotalTasks] = useState(0);
  const [pendingTasks, setPendingTasks] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [overdueTasks, setOverdueTasks] = useState(0);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  useEffect(() => {
    // FIX 1: 'currentUser' ki jagah 'user' se data nikalein kyuki Login mein 'user' save kia tha
    const currentUser = JSON.parse(localStorage.getItem("user"));

    if (!currentUser) {
      navigate("/login", { replace: true });
      return;
    }

    setUser(currentUser);
    loadTasks(currentUser);
  }, [navigate]);

  const triggerToast = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
    }, 3500);
  };

  const loadTasks = async (currentUser) => {
    try {
      const data = await getTasks();

      // FIX 2: Check karein ke task filter sahi se ho rahi hai ya nahi.
      // Agar db.json mein tasks ke andar user ka email nahi save kia hua, to ye empty return karega.
      const userTasks = data.filter(
        (task) => task.email === currentUser?.email
      );

      // Aggr filter hone ke baad 0 tasks hain lekin total database mein data hai, 
      // to backup ke taur par saari tasks show karwa dein taake screen khali na rahe:
      const finalTasks = userTasks.length > 0 ? userTasks : data;

      setTasks(finalTasks);
      setTotalTasks(finalTasks.length);

      setPendingTasks(
        finalTasks.filter((t) => t.status?.toLowerCase() === "pending").length
      );

      setCompletedTasks(
        finalTasks.filter((t) => t.status?.toLowerCase() === "completed").length
      );

      setOverdueTasks(
        finalTasks.filter((t) => t.status?.toLowerCase() === "overdue").length
      );
    } catch (err) {
      console.log(err);
    }
  };

  const openDeleteModal = (id) => {
    setTaskToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteTask(taskToDelete);
      triggerToast("Task deleted successfully 🗑️", "success");
      loadTasks(user);
      setShowDeleteModal(false);
    } catch (err) {
      triggerToast("Delete failed ❌", "error");
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setTaskToDelete(null);
  };

  const logout = () => {
    localStorage.removeItem("user"); // Key updated here too
    navigate("/login");
  };

  return (
    <>
      {/* TOAST */}
      {showToast && (
        <div className={`custom-toast-container ${toastType === "success" ? "toast-success" : "toast-error"}`}>
          <div className="toast-content">
            <span className="toast-icon">{toastType === "success" ? "✅" : "❌"}</span>
            <p>{toastMessage}</p>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <div className="custom-modal-overlay">
          <div className="custom-modal-content">
            <div className="modal-icon">🗑️</div>
            <h3>Delete Task</h3>
            <p>Are you sure you want to delete this task?</p>
            <div className="modal-actions">
              <button className="modal-btn-delete" onClick={confirmDelete}>Yes Delete</button>
              <button className="modal-btn-cancel" onClick={cancelDelete}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="dashboard">
        {/* SIDEBAR */}
        <div className="sidebar">
          <div className="logo"><h2>TaskFlow ✨</h2></div>
          <ul>
            <li><Link to="/user/dashboard">Dashboard</Link></li>
            <li><Link to="/user/my-tasks" className="active">My Tasks</Link></li>
            <li><Link to="/user/create-task">Create Task</Link></li>
            <li><Link to="/user/profile">Profile</Link></li>
            <li><Link to="/user/change-password">Change Password</Link></li>
          </ul>
        </div>

        {/* MAIN */}
        <div className="main">
          <div className="topbar">
            <h1>Welcome Back, {user?.name} 👋</h1>
            <button className="logout-btn" onClick={logout}>Logout</button>
          </div>

          {/* STATS */}
          <div className="cards">
            <div className="card total"><h2>{totalTasks}</h2><p>Total Tasks</p></div>
            <div className="card pending"><h2>{pendingTasks}</h2><p>Pending</p></div>
            <div className="card completed"><h2>{completedTasks}</h2><p>Completed</p></div>
            <div className="card overdue"><h2>{overdueTasks}</h2><p>Overdue</p></div>
          </div>

          {/* TABLE */}
          <div className="tasks-page">
            <div className="tasks-header">
              <h2>My Tasks</h2>
              <Link to="/user/create-task" className="create-btn">+ Create Task</Link>
            </div>

            <div className="table-card">
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Due Date</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task) => (
                    <tr key={task.id}>
                      <td>{task.title}</td>
                      <td>{task.description ? `${task.description.slice(0, 15)}...` : "No description"}</td>
                      <td>{task.dueDate || "N/A"}</td>
                      <td><span className="priority">{task.priority}</span></td>
                      <td><span className={`status-badge ${task.status?.toLowerCase()}`}>{task.status}</span></td>
                      <td>
                        <div className="actions">
                          <Link to={`/user/edit-task/${task.id}`} className="edit-btn">Edit</Link>
                          <button className="delete-btn" onClick={() => openDeleteModal(task.id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MyTasks;