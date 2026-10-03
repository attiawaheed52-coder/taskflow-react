import { useState } from "react";
import "./Signup.css";
import { Link, useNavigate } from "react-router-dom";
import signupImage from "../../../assets/signup.jpg";
import { API_BASE_URL, api } from "../../core/services/api";

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "user",
    password: "",
    confirmPassword: "",
  });

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // handle input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // submit signup
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // 1. EMPTY VALIDATION
    if (
      !form.name ||
      !form.email ||
      !form.password ||
      !form.confirmPassword
    ) {
      setError("⚠️ Please fill all fields!");
      return;
    }

    // 2. PASSWORD MATCH
    if (form.password !== form.confirmPassword) {
      setError("❌ Passwords do not match!");
      return;
    }

    if (!API_BASE_URL) {
      setError("API is not configured. Set VITE_API_URL in Vercel and redeploy.");
      return;
    }

    try {
      const res = await api.get(
        `/users?email=${encodeURIComponent(form.email.trim())}`
      );

      if (res.data.length > 0) {
        setError("❌ Email already exists!");
        return;
      }

      await api.post("/users", {
        name: form.name,
        email: form.email.trim(),
        password: form.password,
        role: form.role,
      });

      // 5. SUCCESS MESSAGE
      setSuccess("🎉 Signup successful! Redirecting...");

      // 6. REDIRECT TO LOGIN
      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err) {
      console.error(err);
      setError("Cannot connect to the API. Check that it is running and VITE_API_URL is correct.");
    }
  };

  return (
    <>
      {/* NAVBAR */}
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

      {/* PAGE WRAPPER */}
      <div className="auth-page">
        <div className="auth-container">

          {/* LEFT CARD */}
          <div className="left-auth">
            <div className="image-content">
              <img
                src={signupImage}
                alt="TaskFlow"
                className="auth-image"
              />
              <h2>Welcome to TaskFlow</h2>
              <p>Manage your tasks smartly and efficiently</p>
            </div>
          </div>

          {/* RIGHT CARD */}
          <div className="right-auth">
            <div className="form-card">
              <div className="logo-center">
                <div className="logo-icon">T</div>
                <h2 className="logo-text">TaskFlow</h2>
              </div>

              <h1>Create Account</h1>
              <p className="subtitle">Create your account to continue</p>

              {/* MESSAGES */}
              {error && <div className="error">{error}</div>}
              {success && <div className="success">{success}</div>}

              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={handleChange}
                />

                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                />

                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>

                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                />

                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                />

                <button type="submit">Sign Up</button>
              </form>

              <p className="bottom-text">
                Already have account? <Link to="/login">Login</Link>
              </p>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default Signup;