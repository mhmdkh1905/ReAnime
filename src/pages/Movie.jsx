import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import "../styles/movie.css";
import { useAuth } from "../context/AuthContext";
import { getMovieById } from "../services/movieService";
import { getScenariosByMovie, createScenario } from "../services/scenarioService";

export default function Movie() {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [scenarios, setScenarios] = useState([]);
  const [mode, setMode] = useState("actor");
  const [text, setText] = useState("");
  const [sortBy, setSortBy] = useState("Most Liked");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  // Fetch movie data
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);
        const movieData = await getMovieById(id);
        if (movieData) {
          setMovie(movieData);
        }
      } catch (error) {
        console.error("Error fetching movie:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMovie();
    }
  }, [id]);

  // Fetch scenarios for this movie
  useEffect(() => {
    const fetchScenarios = async () => {
      if (!id) return;
      try {
        const scenariosData = await getScenariosByMovie(id);
        setScenarios(scenariosData);
      } catch (error) {
        console.error("Error fetching scenarios:", error);
      }
    };

    fetchScenarios();
  }, [id]);

  const handlePostScenario = async () => {
    if (!text.trim()) {
      alert("Please write something!");
      return;
    }

    if (!currentUser) {
      alert("Please login to post a scenario");
      navigate("/login");
      return;
    }

    try {
      setPosting(true);
      const result = await createScenario({
        movieId: id,
        movieTitle: movie?.title,
        title: mode,
        content: text,
        user: {
          uid: currentUser.uid,
          name: currentUser.displayName || "Anonymous",
          photoURL: currentUser.photoURL,
        },
      });

      if (result.success) {
        setText("");
        // Refresh scenarios
        const scenariosData = await getScenariosByMovie(id);
        setScenarios(scenariosData);
        alert("Scenario posted successfully!");
      } else {
        alert("Error posting scenario: " + result.error);
      }
    } catch (error) {
      console.error("Error posting scenario:", error);
      alert("Error posting scenario");
    } finally {
      setPosting(false);
    }
  };

  if (loading) {
    return (
      <div className="moviePage">
        <div className="movieContainer">
          <Link className="backLink" to="/">← Back to Home</Link>
          <p style={{ textAlign: "center", marginTop: "40px" }}>Loading movie...</p>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="moviePage">
        <div className="movieContainer">
          <Link className="backLink" to="/">← Back to Home</Link>
          <h1 className="movieTitle">Movie not found</h1>
        </div>
      </div>
    );
  }

  const charactersCount = text.length;
  const sortedScenarios = [...scenarios].sort((a, b) => {
    if (sortBy === "Most Liked") return b.likesCount - a.likesCount;
    if (sortBy === "Newest") return new Date(b.createdAt?.toDate?.()) - new Date(a.createdAt?.toDate?.());
    if (sortBy === "Oldest") return new Date(a.createdAt?.toDate?.()) - new Date(b.createdAt?.toDate?.());
    return 0;
  });

  return (
    <div className="moviePage">
      <div className="movieContainer">
        <Link className="backLink" to="/">← Back to Home</Link>

        {/* VIDEO */}
        <section className="videoWrap">
          {movie.youtubeId ? (
            <iframe
              className="videoFrame"
              src={`https://www.youtube.com/embed/${movie.youtubeId}`}
              title="Video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <div className="videoPlaceholder">
              <div className="placeholderIcon">🎬</div>
              <p>Video coming soon</p>
            </div>
          )}
        </section>

        {/* HERO */}
        <div className="movieHero">
          <h1 className="movieTitle">{movie.title}</h1>
          <span className="moviePill">{movie.genre || movie.type || "Movie"}</span>
        </div>

        {/* STORY CARD */}
        <section className="panel">
          <h2 className="panelTitle">{movie.title}</h2>
          <p className="panelText">{movie.description}</p>

          <button className="promptBtn" type="button">
            <span className="sparkle" aria-hidden="true">✦</span>
            What if you were the character or the creator?
          </button>
        </section>

        {/* WRITE YOUR SCENARIO */}
        <section className="panel">
          <h2 className="panelTitle">Write Your Scenario</h2>
          <p className="panelHint">Choose your mode:</p>

          <div className="modeRow">
            <button
              type="button"
              className={`modeBtn ${mode === "actor" ? "active" : ""}`}
              onClick={() => setMode("actor")}
            >
              🎭 Actor Mode
            </button>
            <button
              type="button"
              className={`modeBtn ${mode === "creator" ? "active" : ""}`}
              onClick={() => setMode("creator")}
            >
              ✨ Creator Mode
            </button>
          </div>

          <p className="modeDesc">
            {mode === "actor"
              ? "Imagine yourself inside the story. How would you act? What would you do differently?"
              : "Rewrite the story as the creator. Change the plot, characters, or twist the ending."}
          </p>

          <div className="inputWrap">
            <textarea
              className="scenarioInput"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={
                mode === "actor"
                  ? "Write what you would do in the story..."
                  : "Rewrite the story: new twist, new ending..."
              }
              rows={6}
            />
            <div className="inputBar">
              <span className="charCount">{charactersCount} characters</span>
              <button 
                className="postBtn" 
                type="button"
                onClick={handlePostScenario}
                disabled={posting}
              >
                {posting ? "Posting..." : "Post Your Scenario"}
              </button>
            </div>
          </div>
        </section>

        {/* COMMUNITY */}
        <section className="panel">
          <div className="communityHeader">
            <h2 className="panelTitle" style={{ margin: 0 }}>Community Scenarios ({scenarios.length})</h2>

            <div className="sortWrap">
              <span className="sortLabel">Sort by:</span>
              <select
                className="sortSelect"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option>Most Liked</option>
                <option>Newest</option>
                <option>Oldest</option>
              </select>
            </div>
          </div>

          {sortedScenarios.length === 0 ? (
            <div className="emptyState">
              <div className="emptyIcon" aria-hidden="true">✦</div>
              <p className="emptyText">No scenarios yet. Be the first to share your vision!</p>
            </div>
          ) : (
            <div className="scenariosList">
              {sortedScenarios.map((scenario) => (
                <div key={scenario.id} className="scenarioItem">
                  <div className="scenarioHeader">
                    <div className="scenarioAuthor">
                      <img 
                        src={scenario.userPhotoURL || "https://i.pravatar.cc/80?img=1"} 
                        alt={scenario.createdByName}
                        className="authorAvatar"
                      />
                      <div>
                        <h4 className="authorName">{scenario.createdByName}</h4>
                        <span className="modeBadge">{scenario.title === "actor" ? "🎭 Actor" : "✨ Creator"}</span>
                      </div>
                    </div>
                    <span className="likesCount">❤ {scenario.likesCount}</span>
                  </div>
                  <p className="scenarioContent">{scenario.content}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}