import axios from "axios";

const API_URL = "http://localhost:5000/tasks";

/* ===========================
   REFRESH SYSTEM (optional)
=========================== */

let listeners = [];

// Notify UI to refresh
export const notifyRefresh = () => {
  listeners.forEach((cb) => cb());
};

// Subscribe to refresh events
export const subscribeRefresh = (callback) => {
  listeners.push(callback);

  return () => {
    listeners = listeners.filter((cb) => cb !== callback);
  };
};

/* ===========================
   TASK APIs (AXIOS PROMISES)
=========================== */

// GET ALL TASKS
export const getTasks = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// GET TASK BY ID
export const getTaskById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

// ADD TASK
export const addTask = async (task) => {
  const response = await axios.post(API_URL, task);

  notifyRefresh();
  return response.data;
};

// UPDATE TASK
export const updateTask = async (id, task) => {
  const response = await axios.put(`${API_URL}/${id}`, task);

  notifyRefresh();
  return response.data;
};

// DELETE TASK
export const deleteTask = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);

  notifyRefresh();
  return response.data;
};