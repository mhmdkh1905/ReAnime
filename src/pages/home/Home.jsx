import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./home.css";

import { useAuth } from "../../context/AuthContext";
import { logoutUser, getUserProfile } from "../../services/authService";
import { getAllMovies } from "../../services/movieService";
import MovieCard from "../../components/movie/movieCard/MovieCard";
import Footer from "../../components/layout/footer/Footer";
import StoryCallout from "../../components/homeSections/StoryCallout";
import PostMovieModal from "../../components/movie/postMovieModal/PostMovieModal";
import { createMovie } from "../../services/movieService";
import logoImg from "../../assets/logo.jpg";
//`createMovie` and `logoImg` are imported but unused. Remove them.
export default function Home() {
  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [filter, setFilter] = useState("All");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const data = await getAllMovies();
        setMovies(data);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q.trim()), 240);
    return () => clearTimeout(t);
  }, [q]);

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

  useEffect(() => {
    setIsOpen(false);
    //`useEffect(() => setIsOpen(false), [navigate])` is not meaningful. `navigate` is a stable function reference; this effect does not express a real dependency and should be removed.
  }, [navigate]);

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

  const [showPostModal, setShowPostModal] = useState(false);

  const handleCreatedMovie = async (id) => {
    try {
      setLoading(true);
      const data = await getAllMovies();
      setMovies(data);
      alert("Movie created successfully");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page">
        <header className="topbar">
          <div className="brand">ReAnime</div>
          <div className="searchWrap">
            <span className="searchIcon" aria-hidden="true">
              ⌕
            </span>
            <input
              className="searchInput"
              placeholder="Search anime..."
              disabled
            />
            <button
              className="searchBtn"
              type="button"
              disabled
              aria-label="Search"
            >
              Search
            </button>
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
                  <span className="homeCaret" aria-hidden="true">
                    ▾
                  </span>
                </button>
              </div>
            ) : (
              <Link to="/login" className="loginBtn linkBtn">
                Please Login
              </Link>
            )}
          </div>
        </header>
        <main className="main">
          <p style={{ textAlign: "center", marginTop: "40px" }}>
            Loading movies...
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="page">
      <header className="topbar">
        <div className="brand">ReAnime</div>

        <div className="searchWrap">
          <span className="searchIcon" aria-hidden="true">
            ⌕
          </span>
          <input
            className="searchInput"
            placeholder="Search anime..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") setDebouncedQ(q.trim());
            }}
          />
          <button
            className="searchBtn"
            type="button"
            onClick={() => setDebouncedQ(q.trim())}
            aria-label="Search"
          >
            Search
          </button>
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
                <span className="homeCaret" aria-hidden="true">
                  ▾
                </span>
              </button>

              {isOpen && (
                <div className="homeMenu">
                  {profile.role === "admin" && (
                    <button
                      className="homeMenuItem"
                      type="button"
                      onClick={() => {
                        setIsOpen(false);
                        navigate("/admin");
                      }}
                    >
                      Admin Dashboard
                    </button>
                  )}
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
          <h1 className="heroTitle">Reimagine Your Favorite Stories</h1>

          <p className="heroSubtitle">
            Explore anime worlds, watch iconic scenes, and rewrite the narrative
            as the character or creator.
          </p>
        </section>

        <section className="cardsSection">
          <h2 className="sectionTitle">Trending Now</h2>

          <div className="cardsGrid">
            {movies.length === 0 ? (
              <p style={{ gridColumn: "1 / -1", textAlign: "center" }}>
                No movies available
              </p>
            ) : (
              movies
                .filter((movie) => movie.trending !== false)
                .slice(0, 3)
                .map((movie) => (
                  <MovieCard
                    key={movie.id}
                    id={movie.id}
                    title={movie.title}
                    image={movie.image}
                    type={movie.genre}
                    trending={movie.trending}
                  />
                ))
            )}
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
              .filter((movie) => {
                const matchesFilter =
                  filter === "All" || movie.movieOrSeries === filter;

                const search = debouncedQ.toLowerCase();
                const matchesSearch =
                  search === "" ||
                  (movie.title && movie.title.toLowerCase().includes(search)) ||
                  (movie.description &&
                    movie.description.toLowerCase().includes(search)) ||
                  (movie.genre && movie.genre.toLowerCase().includes(search)) ||
                  (movie.createdByName &&
                    movie.createdByName.toLowerCase().includes(search));

                return matchesFilter && matchesSearch;
              })
              .map((movie) => (
                <MovieCard
                  key={movie.id}
                  id={movie.id}
                  title={movie.title}
                  image={movie.image}
                  type={movie.genre}
                  trending={movie.trending}
                />
              ))}
          </div>
        </section>
      </main>
      <StoryCallout />
      <Footer />
      <PostMovieModal
        isOpen={showPostModal}
        onClose={() => setShowPostModal(false)}
        onCreated={handleCreatedMovie}
      />
    </div>
  );
}

// This page is doing too much: movie fetching, auth/profile fetching, search debounce, dropdown management, logout flow, modal orchestration, and rendering. Break this into smaller hooks/components
