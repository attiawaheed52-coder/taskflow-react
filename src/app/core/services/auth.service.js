import axios from "axios";

const API_URL = "http://localhost:5000/users";

// SIGNUP
export const signup = async (user) => {
  const response = await axios.post(API_URL, user);
  return response.data;
};

// LOGIN
export const login = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// SAVE USER
export const saveUser = (user) => {
  localStorage.setItem(
    "currentUser",
    JSON.stringify(user)
  );
};

// GET USER
export const getUser = () => {
  return JSON.parse(
    localStorage.getItem("currentUser") || "null"
  );
};

// CHECK LOGIN
export const isLoggedIn = () => {
  return !!localStorage.getItem("currentUser");
};

// CHECK ADMIN
export const isAdmin = () => {
  const user = getUser();
  return user && user.role === "admin";
};

// LOGOUT
export const logout = () => {
  localStorage.removeItem("currentUser");
};