import "../styles/login-register.css";
import { useState } from "react";
import logoImg from "../assets/logo.jpg";
import { GoArrowLeft } from "react-icons/go";
import { IoPersonSharp } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const navigate = useNavigate();

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      const user = await registerUser(name, email, password);
      console.log("Registered user:", user);

      navigate("/", { replace: true });
    } catch (error) {
      console.log("REGISTER ERROR FULL:", error);
      setErr(
        error?.code
          ? `${error.code}: ${error.message}`
          : error?.message || "Register failed",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <Link to="/login" className="link">
          <div className="back-container">
            <GoArrowLeft className="arrow" />
            Back to sign in
          </div>
        </Link>

        <div className="logo">
          <img src={logoImg} alt="kitsuni mask" className="logo-circle" />
        </div>

        <h1 className="title">Create Your Account</h1>
        <p className="subtitle">Sign up to start your journey</p>

        {err ? <div className="form-error">{err}</div> : null}

        <form onSubmit={handleCreateAccount}>
          <div className="form-group">
            <label htmlFor="name">Your Full Name</label>
            <div className="input-wrapper">
              <IoPersonSharp className="input-icon" />
              <input
                type="text"
                id="name"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-wrapper">
              <input
                type="email"
                id="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <input
                type="password"
                id="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="sign-in-btn" disabled={loading}>
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}
