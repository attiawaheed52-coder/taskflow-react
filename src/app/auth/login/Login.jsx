import { useState } from "react";
import "./login.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import loginImage from "../../../assets/login 1.jpg";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    if (!form.email || !form.password) {
      setError("❌ Please fill all fields");
      return;
    }

    try {
      const response = await axios.get("http://localhost:5000/users");
      const cleanEmail = form.email.trim().toLowerCase();
      const user = response.data.find(
        (u) => u.email?.trim().toLowerCase() === cleanEmail && u.password === form.password
      );

      if (!user) {
        setError("❌ Invalid Credentials! Please try again.");
        setTimeout(() => setError(""), 3000);
        return;
      }

      localStorage.setItem(
        "user",
        JSON.stringify({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        })
      );

      setSuccess("✅ Login Successful! Welcome Back");
      setForm({ email: "", password: "" });

      setTimeout(() => {
        if (user.role === "admin") {
          navigate("/admin/dashboard", { replace: true });
        } else {
          navigate("/user/dashboard", { replace: true });
        }
      }, 1500);
    } catch (err) {
      console.error(err);
      setError("❌ Network connection failed!");
    }
  };
 const logout = () => {
  localStorage.removeItem("user");
  navigate("/login", { replace: true });
};

  return (
    <>
      <nav className="auth-navbar">
        <div className="logo">
          <div className="logo-icon">T</div>
          <h2>TaskFlow</h2>
        </div>
        <div className="nav-links">
          <Link to="/login">Login</Link>
          <Link to="/signup">Sign Up</Link>
        </div>
      </nav>
      <div className="auth-page">
        <div className="auth-container">
          <div className="left-auth">
            <div className="image-content">
              <img src={loginImage} alt="Login" className="auth-image" />
              <h2>Welcome Back</h2>
              <p>Continue managing your tasks and projects efficiently.</p>
            </div>
          </div>
          <div className="right-auth">
            <div className="form-card">
              <div className="logo-center">
                <div className="logo-icon">T</div>
                <h2 className="logo-text">TaskFlow</h2>
              </div>
              <h1>Welcome Back</h1>
              <p className="subtitle">Login to continue</p>
              {error && <div className="error">{error}</div>}
              {success && <div className="success">{success}</div>}
              <form onSubmit={handleSubmit}>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter Email"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="off"
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Enter Password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="off"
                />
                <div className="options">
                  <label className="remember">
                    <input type="checkbox" /> Remember Me
                  </label>
                  <Link to="/forgot-password" className="forgot-link">Forgot Password?</Link>
                </div>
                <button type="submit">Login</button>
              </form>
              <p className="bottom-text">
                Don't have an account? <Link to="/signup">Sign Up</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;