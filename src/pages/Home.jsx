import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/home.css";

import { useAuth } from "../context/AuthContext";
import { logoutUser, getUserProfile } from "../services/authService";
import MovieCard from "../components/movie/MovieCard";
export default function Home() {
  const [q, setQ] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [filter, setFilter] = useState("All");

  const navigate = useNavigate();
  const { currentUser } = useAuth();
const movies = [
  {
    id: 1,
    title: "Neon Dreams",
    image:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=60",
    type: "Movie",
    trending: true,
  },
  {
    id: 2,
    title: "Spirit Chronicles",
    image:
      "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=800&q=60",
    type: "Series",
    trending: true,
  },
  {
    id: 3,
    title: "Midnight Tales",
    image:
      "https://images.unsplash.com/photo-1497032205916-ac775f0649ae?auto=format&fit=crop&w=800&q=60",
    type: "Movie",
    trending: true,
  },
];
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

  <section className="heroSection">
    <h1 className="heroTitle">
      Reimagine Your Favorite Stories
    </h1>

    <p className="heroSubtitle">
      Explore anime worlds, watch iconic scenes, and rewrite the narrative
      as the character or creator.
    </p>
  </section>

  <section className="cardsSection">
    <h2 className="sectionTitle">Trending Now</h2>

    <div className="cardsGrid">
      {movies
        .filter((movie) => movie.trending)
        .map((movie) => (
          <MovieCard
            key={movie.id}
            title={movie.title}
            image={movie.image}
            type={movie.type}
            trending={movie.trending}
          />
        ))}
    </div>
  </section>
<section className="discoverSection">
  <div className="discoverHeader">
    <h2 className="discoverTitle">
      <span className="discoverIcon">↗</span> Discover
    </h2>

    <div className="discoverFilters">
      <button 
        className={`filterBtn ${filter === "All" ? "active" : ""}`}
        onClick={() => setFilter("All")}
      >
        All
      </button>
      <button 
        className={`filterBtn ${filter === "Movie" ? "active" : ""}`}
        onClick={() => setFilter("Movie")}
      >
        Movies
      </button>
      <button 
        className={`filterBtn ${filter === "Series" ? "active" : ""}`}
        onClick={() => setFilter("Series")}
      >
        Series
      </button>
    </div>
  </div>

  <div className="discoverGrid">
    {movies
      .filter((movie) => filter === "All" || movie.type === filter)
      .map((movie) => (
        <MovieCard
          key={movie.id}
          title={movie.title}
          image={movie.image}
          type={movie.type}
          trending={movie.trending}
        />
      ))}
  </div>
</section>
</main>
    </div>
  );
}
