import "../styles/login-register.css";
import { useState } from "react";
import logoImg from "../assets/logo.jpg";
import { GoArrowLeft } from "react-icons/go";
import { IoPersonSharp } from "react-icons/io5";
import { Link } from "react-router-dom";
import { auth, db } from "../firebase/firebase.js";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      console.log(user);
      if (user) {
        await setDoc(doc(db, "Users", user.uid), {
          name: name,
          email: user.email,
        });
      }
      console.log("User Register Successfully");
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <Link to="/login" className="link">
          <div className="back-container">
            <GoArrowLeft />
            Back to sign in
          </div>
        </Link>
        <div className="logo">
          <img src={logoImg} alt="kitsuni mask" className="logo-circle" />
        </div>

        <h1 className="title">Create Your Account</h1>

        <form onSubmit={handleCreateAccount}>
          {/* name */}
          <div className="form-group">
            <label>You Full Name</label>
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

          {/* email */}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-wrapper">
              <svg
                className="input-icon"
                viewBox="0 0 24 24"
                width="18"
                height="18"
              >
                <path
                  fill="currentColor"
                  d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
                />
              </svg>
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

          {/* password */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <svg
                className="input-icon"
                viewBox="0 0 24 24"
                width="18"
                height="18"
              >
                <path
                  fill="currentColor"
                  d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"
                />
              </svg>
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

          {/* create account*/}
          <button type="submit" className="sign-in-btn">
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
}
