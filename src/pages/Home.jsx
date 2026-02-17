import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/home.css";

import { useAuth } from "../context/AuthContext";
import { logoutUser, getUserProfile } from "../services/authService";

export default function Home() {
  const [q, setQ] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [profile, setProfile] = useState(null);

  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    let alive = true;

    async function fetchProfile() {
      if (!currentUser) {
        if (alive) setProfile(null);
        return;
      }
      const data = await getUserProfile(currentUser.uid);
      if (alive) setProfile(data);
    }

    fetchProfile();
    return () => {
      alive = false;
    };
  }, [currentUser]);

  // סגירת dropdown כשעוברים דף
  useEffect(() => {
    setIsOpen(false);
  }, [navigate]);

  // סגירה בלחיצה מחוץ
  useEffect(() => {
    const onDocClick = (e) => {
      if (!e.target.closest(".homeProfileWrap")) setIsOpen(false);
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    setIsOpen(false);
    navigate("/login", { replace: true });
  };

  return (
    <div className="page">
      <header className="topbar">
        <div className="brand">ReAnime</div>

        <div className="searchWrap">
          <span className="searchIcon" aria-hidden="true">⌕</span>
          <input
            className="searchInput"
            placeholder="Search anime..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>

        <div className="homeRight">
          {profile ? (
            <div className="homeProfileWrap">
              <button
                className="homeProfileBtn"
                onClick={() => setIsOpen((v) => !v)}
                type="button"
              >
                <img
                  className="homeAvatar"
                  src={profile.photoURL || "https://i.pravatar.cc/80?img=3"}
                  alt="avatar"
                />
                <span className="homeName">{profile.name || "User"}</span>
                <span className="homeCaret" aria-hidden="true">▾</span>
              </button>

              {isOpen && (
                <div className="homeMenu">
                  <button
                    className="homeMenuItem"
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      navigate("/profile");
                    }}
                  >
                    Profile
                  </button>

                  <div className="homeMenuSep" />

                  <button
                    className="homeMenuItem danger"
                    type="button"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="loginBtn linkBtn">
              Please Login
            </Link>
          )}
        </div>
      </header>

      <main className="main">
        <section className="heroCard">
          <h1 className="heroTitle">
            Reimagine Your Favorite <br /> Stories
          </h1>

          <p className="heroDesc">
            Explore anime worlds, watch iconic scenes, and rewrite the narrative
            as the character or creator
          </p>

          <div className="heroMedia">
            <div className="mediaThumb" />
            <div className="mediaText">
              <div className="chip">AI Stories</div>
              <h3>Turn scenes into alternate endings</h3>
              <p>Pick an anime → choose a moment → rewrite it in your style.</p>

              <div className="heroActions">
                <button className="primaryBtn">Get Started</button>
                <button className="ghostBtn">Browse Popular</button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
