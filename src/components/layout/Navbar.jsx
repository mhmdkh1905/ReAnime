import "../../styles/navbar.css";
import { IoSearch } from "react-icons/io5";
import { useEffect, useState } from "react";
import { X, UserPen, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser, getUserProfile } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
export default function Navbar() {
  const [searchingText, setSearchingText] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const { currentUser } = useAuth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      if (currentUser) {
        const data = await getUserProfile(currentUser.uid);
        setProfile(data);
      }
    }

    fetchProfile();
  }, [currentUser]);

  return (
    <nav className="navbar">
      <Link to="/" className="link">
        <h2 className="logo">ReAnime</h2>
      </Link>
      <div className="search-bar">
        <IoSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search anime..."
          className="search-input"
          onChange={(e) => {
            setSearchingText(e.target.value);
          }}
          value={searchingText}
        />
        {searchingText !== "" ? (
          <X
            size={20}
            style={{ color: "white", cursor: "pointer" }}
            onClick={() => {
              setSearchingText("");
            }}
          />
        ) : (
          ""
        )}
      </div>
      <div className="profile-navbar-container">
        {profile !== null ? (
          <button
            className="profile-btn"
            onClick={() => {
              if (isOpen) {
                setIsOpen(false);
              } else {
                setIsOpen(true);
              }
            }}
          >
            <img className="profile-pic" src={profile.photoURL} alt="avatar" />
            <span className="profile-name">{profile.name}</span>
          </button>
        ) : (
          <Link to="/login" className="link">
            <div className="login-label">Please Login</div>
          </Link>
        )}
        {isOpen && (
          <div className="drop-down-menu">
            <ul className="list">
              <Link to="/profile" className="link">
                <li
                  className="element"
                  onClick={() => {
                    setIsOpen(false);
                  }}
                >
                  <UserPen className="icon" />
                  <p className="label">Profile</p>
                </li>
              </Link>
              <div className="separator"></div>
              <li
                className="element"
                onClick={() => {
                  logoutUser();
                  navigate("/login");
                  setIsOpen(false);
                }}
              >
                <LogOut className="icon" />
                <p className="label">Logout</p>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}
