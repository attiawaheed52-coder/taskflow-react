import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";

export default function AllTasks() {
  const navigate = useNavigate();
  const location = useLocation();

  const [tasks, setTasks] = useState([]);
  const [groupedTasks, setGroupedTasks] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);

  const [isEditing, setIsEditing] = useState(false);
  const [selectedTask, setSelectedTask] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDeleteId, setTaskToDeleteId] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  useEffect(() => {
    loadAllGlobalTasks();
  }, []);

  const triggerToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 3500);
  };

  const groupTasksByEmail = (allTasks) => {
    const groups = allTasks.reduce((acc, task) => {
      const email = task.email || "system.sync@taskflow.com";
      if (!acc[email]) {
        acc[email] = [];
      }
      acc[email].push(task);
      return acc;
    }, {});

    const formattedGroups = Object.keys(groups).map((email) => ({
      email: email,
      tasks: groups[email],
    }));

    setGroupedTasks(formattedGroups);
  };

  const loadAllGlobalTasks = async () => {
    try {
      const res = await fetch("http://localhost:5000/tasks");
      if (!res.ok) throw new Error("Server offline");
      const data = await res.json();
      const taskList = data || [];
      setTasks(taskList);
      setTotalTasks(taskList.length);
      groupTasksByEmail(taskList);
    } catch (err) {
      console.error("Global tasks fetch error:", err);
      const localTasks = JSON.parse(localStorage.getItem("tasks") || "[]");
      setTasks(localTasks);
      setTotalTasks(localTasks.length);
      groupTasksByEmail(localTasks);
    }

    try {
      const res = await fetch("http://localhost:5000/users"); 
      if (!res.ok) throw new Error("Server error");
      const serverUsers = await res.json();
      setTotalUsers(serverUsers ? serverUsers.length : 0);
    } catch {
      const usersList = JSON.parse(localStorage.getItem("users") || "[]");
      setTotalUsers(usersList.length);
    }
  };

  const deleteAdminTask = (taskId) => {
    if (!taskId) {
      triggerToast("Task ID is missing! ❌", "error");
      return;
    }
    setTaskToDeleteId(taskId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setShowDeleteModal(false);
    try {
      const res = await fetch(`http://localhost:5000/tasks/${taskToDeleteId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Direct wipe breakdown");
      triggerToast("Task permanently deleted. 👍", "success");
      loadAllGlobalTasks();
      setTaskToDeleteId(null);
    } catch (err) {
      console.error(err);
      triggerToast("Failed to delete task! ❌", "error");
      setTaskToDeleteId(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setTaskToDeleteId(null);
  };

  const editTask = (task) => {
    setSelectedTask({ ...task });
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedTask((prev) => ({ ...prev, [name]: value }));
  };

  const saveTaskUpdate = async () => {
    if (!selectedTask.title || !selectedTask.description) {
      triggerToast("Please fill out all fields! ❌", "error");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/tasks/${selectedTask.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedTask),
      });
      if (!res.ok) throw new Error("PUT decline");
      triggerToast("Task updated successfully! ✏️", "success");
      setIsEditing(false);
      loadAllGlobalTasks();
    } catch (err) {
      console.error(err);
      triggerToast("Failed to update task! ❌", "error");
    }
  };

  const logout = () => {
    localStorage.removeItem("token"); 
    navigate("/login");
  };

  return (
    <div className="admin-dashboard" style={{ display: "flex", minHeight: "100vh", backgroundColor: "#0f172a" }}>
      {toast.show && (
        <div className={`custom-toast-container ${toast.type === "success" ? "toast-success" : "toast-error"}`}>
          <div className="toast-content">
            <span>{toast.type === "success" ? "✅" : "❌"}</span>
            <p className="toast-text">{toast.message}</p>
          </div>
        </div>
      )}

      <div className="sidebar">
        <div className="logo">
          <h2>TaskFlow ✨</h2>
        </div>
        <ul>
          <li><Link to="/admin/dashboard" className={location.pathname === "/admin/dashboard" ? "active" : ""}>Dashboard</Link></li>
          <li><Link to="/admin/users" className={location.pathname === "/admin/users" ? "active" : ""}>Users</Link></li>
          <li><Link to="/admin/all-tasks" className={location.pathname === "/admin/all-tasks" ? "active" : ""}>All Tasks</Link></li>
        </ul>
      </div>

      <div className="main" style={{ flex: 1, padding: "35px" }}>
        <div className="topbar">
          <h1 style={{ color: "white" }}>Global Network Tasks 📋</h1>
          <button onClick={logout}>Logout 🚪</button>
        </div>

        <div className="stats-grid">
          <div className="stat-card total">
            <h2>{totalUsers}</h2>
            <p>👥 Total Registered Users</p>
          </div>
          <div className="stat-card pending">
            <h2>{totalTasks}</h2>
            <p>📋 Total Global Tasks</p>
          </div>
        </div>

        {/* 100% INLINE STYLE FIX FOR THE EDIT FORM CONTAINER & INPUTS */}
        {isEditing && (
          <div style={{ width: "100%", display: "flex", justifyContent: "flex-start", marginBottom: "35px" }}>
            <div style={{
              background: "rgba(30, 41, 59, 0.85)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              padding: "30px",
              borderRadius: "24px",
              maxWidth: "550px", // Form ko chota aur clean banaye ga
              width: "100%",
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.4)"
            }}>
              <h3 style={{ color: "white", fontSize: "22px", marginBottom: "20px", fontWeight: "600" }}>✏️ Edit Task</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ color: "#cbd5e1", fontWeight: "600", fontSize: "14px" }}>Title</label>
                  <input 
                    type="text" 
                    name="title" 
                    value={selectedTask.title || ""} 
                    onChange={handleInputChange}
                    style={{ width: "100%", background: "#0f172a", border: "1px solid rgba(255, 255, 255, 0.15)", padding: "12px 16px", borderRadius: "12px", color: "white", fontSize: "15px", outline: "none" }}
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ color: "#818cf8", fontWeight: "600", fontSize: "14px" }}>Assigned User Email</label>
                  <input 
                    type="email" 
                    name="email" 
                    value={selectedTask.email || ""} 
                    onChange={handleInputChange} 
                    style={{ width: "100%", background: "#0f172a", border: "1px solid rgba(255, 255, 255, 0.15)", padding: "12px 16px", borderRadius: "12px", color: "white", fontSize: "15px", outline: "none" }}
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ color: "#cbd5e1", fontWeight: "600", fontSize: "14px" }}>Description</label>
                  <textarea 
                    name="description" 
                    value={selectedTask.description || ""} 
                    onChange={handleInputChange}
                    style={{ width: "100%", background: "#0f172a", border: "1px solid rgba(255, 255, 255, 0.15)", padding: "12px 16px", borderRadius: "12px", color: "white", fontSize: "15px", outline: "none", minHeight: "100px", resize: "vertical" }}
                  ></textarea>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ color: "#cbd5e1", fontWeight: "600", fontSize: "14px" }}>Status</label>
                  <select 
                    name="status" 
                    value={selectedTask.status || "Pending"} 
                    onChange={handleInputChange}
                    style={{ width: "100%", background: "#0f172a", border: "1px solid rgba(255, 255, 255, 0.15)", padding: "12px 16px", borderRadius: "12px", color: "white", fontSize: "15px", outline: "none" }}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                    <option value="Overdue">Overdue</option>
                  </select>
                </div>

                <div style={{ display: "flex", gap: "14px", marginTop: "10px" }}>
                  <button onClick={saveTaskUpdate} style={{ flex: 1, padding: "12px", border: "none", borderRadius: "12px", cursor: "pointer", fontWeight: "600", background: "linear-gradient(135deg, #7c3aed, #4f46e5)", color: "white" }}>Save Changes</button>
                  <button onClick={() => setIsEditing(false)} style={{ flex: 1, padding: "12px", border: "none", borderRadius: "12px", cursor: "pointer", fontWeight: "600", background: "rgba(255, 255, 255, 0.08)", color: "#cbd5e1" }}>Cancel</button>
                </div>

              </div>
            </div>
          </div>
        )}

        <div className="admin-overview-section">
          {groupedTasks.map((group) => (
            <div key={group.email} className="table-card user-task-card-group" style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.06)", borderRadius: "24px", padding: "30px", marginBottom: "30px" }}>
              
              {/* 100% INLINE STYLE FIX FOR EMAIL HEADER COLOR */}
              <div className="user-card-header" style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "22px", paddingBottom: "14px", borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>
                <span style={{ fontSize: "20px" }}>📧</span>
                <h3 style={{ color: "#818cf8", fontFamily: "monospace", fontSize: "19px", fontWeight: "600", margin: 0 }}>
                  {group.email}
                </h3>
              </div>

              <div className="table-responsive">
                <table>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Description</th>
                      <th>Due Date</th>
                      <th>Priority</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.tasks.map((task) => (
                      <tr key={task.id}>
                        <td className="task-title-cell">{task.title}</td>
                        <td className="task-desc-cell">{task.description}</td>
                        <td>{task.dueDate || "N/A"}</td>
                        <td>
                          <span className={`priority-badge priority-${task.priority?.toLowerCase() || "low"}`}>
                            {task.priority || "Low"}
                          </span>
                        </td>
                        <td><span className="status-indicator">● {task.status || "Pending"}</span></td>
                        <td>
                          {/* Clean Action Buttons layout reset */}
                          <div style={{ display: "flex", gap: "10px" }}>
                            <button onClick={() => editTask(task)} title="Edit Task" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer", fontSize: "16px", padding: "8px 12px", borderRadius: "8px", color: "white" }}>✏️</button>
                            <button onClick={() => deleteAdminTask(task.id)} title="Delete Task" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer", fontSize: "16px", padding: "8px 12px", borderRadius: "8px", color: "white" }}>🗑️</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showDeleteModal && (
        <div className="custom-modal-overlay">
          <div className="custom-modal-content">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this task?</p>
            <div className="modal-actions">
              <button className="modal-btn-delete" onClick={confirmDelete}>Yes, Delete</button>
              <button className="modal-btn-cancel" onClick={cancelDelete}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}