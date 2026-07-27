import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { getUsers, deleteUser } from "../../core/services/user.service";
import { getTasks } from "../../core/services/task.service";

import "./Users.css";

export default function Users() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // ✅ MODAL STATES (FIXED)
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      const usersData = await getUsers();

      const uniqueUsers = usersData.filter(
        (user, index, self) =>
          index ===
          self.findIndex(
            (u) =>
              u.email?.toLowerCase() ===
              user.email?.toLowerCase()
          )
      );

      setUsers(uniqueUsers);
      setTotalUsers(uniqueUsers.length);

      const tasks = await getTasks();
      setTotalTasks(tasks.length);
    } catch (error) {
      console.error(error);
    }
  };

  const clearMessagesAfterDelay = () => {
    setTimeout(() => {
      setSuccessMessage("");
      setErrorMessage("");
    }, 3000);
  };

  // ✅ OPEN MODAL
  const openDeleteModal = (id) => {
    setUserToDelete(id);
    setShowDeleteModal(true);
  };

  // ✅ CONFIRM DELETE
  const confirmDelete = async () => {
    try {
      await deleteUser(userToDelete);

      setSuccessMessage("User deleted successfully 🎉");

      loadAllData();

      setShowDeleteModal(false);
      setUserToDelete(null);

      clearMessagesAfterDelay();
    } catch (err) {
      console.error(err);

      setErrorMessage("Delete failed ❌");

      setShowDeleteModal(false);
      setUserToDelete(null);

      clearMessagesAfterDelay();
    }
  };

  // ✅ CANCEL DELETE
  const cancelDelete = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  const logout = () => {
    localStorage.removeItem("user");
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
            <Link to="/admin/dashboard">Dashboard</Link>
          </li>

          <li>
            <Link to="/admin/users" className="active">
              Users
            </Link>
          </li>

          <li>
            <Link to="/admin/all-tasks">All Tasks</Link>
          </li>
        </ul>
      </div>

      <div className="main">
        <div className="topbar">
          <h1>All Registered Users 👥</h1>

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

        <div className="table-card">
          {successMessage && (
            <div className="success">{successMessage}</div>
          )}

          {errorMessage && (
            <div className="error">{errorMessage}</div>
          )}

          {/* ✅ DELETE MODAL */}
          {showDeleteModal && (
            <div className="custom-modal-overlay">
              <div className="custom-modal-content">
                <div className="modal-icon">🗑️</div>
                <h3>Delete User</h3>
                <p>
                  Are you sure you want to delete this user?
                </p>

                <div className="modal-actions">
                  <button
                    className="modal-btn-delete"
                    onClick={confirmDelete}
                  >
                    Yes Delete
                  </button>

                  <button
                    className="modal-btn-cancel"
                    onClick={cancelDelete}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>

                    <td className="email">{user.email}</td>

                    <td>
                      <span
                        className={
                          user.role === "admin"
                            ? "role-admin"
                            : "role-user"
                        }
                      >
                        {user.role}
                      </span>
                    </td>

                    <td>
                      <button
                        className="delete-user-btn"
                        onClick={() =>
                          openDeleteModal(user.id)
                        }
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="empty-row">
                    No registered users
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}