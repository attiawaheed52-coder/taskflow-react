import axios from "axios";

const API_URL = "http://localhost:5000/users";

/* ==========================
   GET ALL USERS
========================== */
export const getUsers = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

/* ==========================
   DELETE USER
========================== */
export const deleteUser = async (id) => {
  const response = await axios.delete(
    `${API_URL}/${id}`
  );

  return response.data;
};

/* ==========================
   CURRENT USER
========================== */
export const getUser = () => {
  return JSON.parse(
    localStorage.getItem("user")
  );
};

/* ==========================
   LOGOUT
========================== */
export const logout = () => {
  localStorage.removeItem("user");
};