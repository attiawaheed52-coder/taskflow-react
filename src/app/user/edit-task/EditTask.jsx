import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./EditTask.css";

import {
  getTaskById,
  updateTask
} from "../../core/services/task.service";

function EditTask() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [taskId, setTaskId] = useState("");
  const [existingTask, setExistingTask] = useState({});

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "",
    status: "Pending"
  });

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  useEffect(() => {
    if (id) {
      setTaskId(id);
      loadTaskDetails(id);
    }
  }, [id]);

  const loadTaskDetails = async (taskId) => {
    try {
      const task = await getTaskById(taskId);

      setExistingTask(task);

      setFormData({
        title: task.title || "",
        description: task.description || "",
        dueDate: task.dueDate || "",
        priority: task.priority || "",
        status: task.status || "Pending"
      });
    } catch (error) {
      console.error("Error loading task:", error);
    }
  };

  const triggerToast = (
    message,
    type = "success"
  ) => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
    }, 3500);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.description ||
      !formData.dueDate ||
      !formData.priority
    ) {
      triggerToast(
        "Please fill out all fields properly! ❌",
        "error"
      );
      return;
    }

    const updatedTask = {
      ...existingTask,
      ...formData
    };

    try {
      await updateTask(taskId, updatedTask);

      triggerToast(
        "Task updated successfully! ✏️",
        "success"
      );

      setTimeout(() => {
        navigate("/user/my-tasks");
      }, 1500);

    } catch (error) {
      console.error(error);

      triggerToast(
        "Failed to update task configuration. ❌",
        "error"
      );
    }
  };

  return (
    <>
      {showToast && (
        <div
          className={`custom-toast-container ${
            toastType === "success"
              ? "toast-success"
              : "toast-error"
          }`}
        >
          <div className="toast-content">
            <span className="toast-icon">
              {toastType === "success"
                ? "✅"
                : "❌"}
            </span>

            <p>{toastMessage}</p>
          </div>
        </div>
      )}

      <div className="edit-page">

        <div className="edit-card">

          <h1>Edit Task</h1>

          <form onSubmit={handleSubmit}>

            <div className="input-group">
              <label>Title</label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label>Description</label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label>Due Date</label>

              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label>Priority</label>

              <select
                name="priority"
                value={formData.priority}
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
            </div>

            <button
              type="submit"
              className="update-btn"
            >
              Update Task
            </button>

          </form>

        </div>

      </div>
    </>
  );
}

export default EditTask;