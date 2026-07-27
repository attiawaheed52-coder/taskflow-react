import { useState } from "react";
import "./forgot-password.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import forgotImage from "../../../assets/forget.jpg";

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const resetPassword = async () => {
    setSuccess("");
    setError("");

    // VALIDATION
    if (!email || !newPassword) {
      setError("❌ All fields are required");
      return;
    }

    try {
      // FIND USER
      const response = await axios.get(
        `http://localhost:5000/users?email=${email}`
      );

      const users = response.data;

      if (users.length === 0) {
        setError("❌ Email not found");
        return;
      }

      const user = users[0];

      const updatedUser = {
        ...user,
        password: newPassword,
      };

      // UPDATE PASSWORD
      await axios.put(
        `http://localhost:5000/users/${user.id}`,
        updatedUser
      );

      setSuccess(
        "✅ Password updated successfully"
      );

      // REDIRECT
      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err) {
      console.error(err);
      setError("❌ Something went wrong");
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

      <div className="auth-page">
        <div className="auth-container">

          {/* LEFT CARD */}
          <div className="left-auth">
            <div className="image-content">

              <img
                src={forgotImage}
                alt="Forgot Password"
                className="auth-image"
              />

              <h2>Reset Password</h2>

              <p>
                Update your account password
                securely and continue using
                TaskFlow.
              </p>

            </div>
          </div>

          {/* RIGHT CARD */}
          <div className="right-auth">

            <div className="form-card">

              <div className="logo-center">
                <div className="logo-icon">T</div>
                <h2 className="logo-text">
                  TaskFlow
                </h2>
              </div>

              <h1>Forgot Password</h1>

              <p className="subtitle">
                Reset your account password
              </p>

              {success && (
                <div className="success">
                  {success}
                </div>
              )}

              {error && (
                <div className="error">
                  {error}
                </div>
              )}

              <input
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
              />

              <input
                type="password"
                placeholder="Enter New Password"
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(e.target.value)
                }
              />

              <button
                onClick={resetPassword}
              >
                Update Password
              </button>

              <p className="bottom-text">
                Back to{" "}
                <Link to="/login">
                  Login
                </Link>
              </p>

            </div>

          </div>

        </div>
      </div>
    </>
  );
}

export default ForgotPassword;