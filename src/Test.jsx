import { useEffect, useState } from "react";
import {
  createScenario,
  getScenariosByMovie,
  updateScenario,
  deleteScenario,
} from "./services/scenarioService";
import {
  createComment,
  getCommentsByScenario,
  updateComment,
  deleteComment,
  likeComment,
  unlikeComment,
} from "./services/commentService";
import { getAllMovies } from "./services/movieService";
import { getCurrentUser } from "./services/authService";

// Optional preset anime scenarios
const presetScenarios = [
  {
    title: "The Fall of Shiganshina",
    content:
      "The Colossal Titan suddenly appears and destroys the outer wall of Shiganshina. Eren watches helplessly as his mother is trapped under debris.",
  },
  {
    title: "Naruto vs Sasuke – Final Valley",
    content:
      "Naruto confronts Sasuke at the Valley of the End to stop him from joining Orochimaru. Both fight with full emotion and determination.",
  },
];

export default function Test() {
  const [movies, setMovies] = useState([]);
  const [selectedMovieId, setSelectedMovieId] = useState("");
  const [scenarios, setScenarios] = useState([]);
  const [editingScenarioId, setEditingScenarioId] = useState(null);
  const [form, setForm] = useState({ title: "", content: "" });

  const [commentsMap, setCommentsMap] = useState({}); // scenarioId => comments
  const [commentInput, setCommentInput] = useState(""); // input for current comment
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [currentScenarioId, setCurrentScenarioId] = useState(null); // for comment input

  // Fetch movies
  const fetchMovies = async () => {
    const data = await getAllMovies();
    setMovies(data);
  };

  // Fetch scenarios for selected movie
  const fetchScenarios = async (movieId) => {
    if (!movieId) return;
    const data = await getScenariosByMovie(movieId);
    setScenarios(data);

    // fetch comments for each scenario
    const newCommentsMap = {};
    for (let s of data) {
      const comments = await getCommentsByScenario(s.id);
      newCommentsMap[s.id] = comments;
    }
    setCommentsMap(newCommentsMap);
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  useEffect(() => {
    fetchScenarios(selectedMovieId);
  }, [selectedMovieId]);

  // Form input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Select preset scenario
  const handlePresetSelect = (e) => {
    const preset = presetScenarios.find((s) => s.title === e.target.value);
    if (preset) setForm(preset);
  };

  // Submit scenario
  const handleScenarioSubmit = async (e) => {
    e.preventDefault();
    const user = getCurrentUser();
    if (!user?.uid) return alert("You must be logged in.");
    if (!selectedMovieId) return alert("Select a movie first.");
    if (!form.title.trim() || !form.content.trim())
      return alert("Title and content cannot be empty.");

    const movie = movies.find((m) => m.id === selectedMovieId);

    try {
      if (editingScenarioId) {
        await updateScenario(editingScenarioId, {
          title: form.title,
          titleLowercase: form.title.toLowerCase(),
          content: form.content,
          isEdited: true,
        });
        setEditingScenarioId(null);
      } else {
        await createScenario({
          movieId: selectedMovieId,
          movieTitle: movie.title,
          title: form.title,
          content: form.content,
          user: {
            uid: user.uid,
            name: user.displayName || user.email,
            photoURL: user.photoURL || "",
          },
        });
      }
      setForm({ title: "", content: "" });
      fetchScenarios(selectedMovieId);
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  // Edit scenario
  const handleScenarioEdit = (s) => {
    setForm({ title: s.title, content: s.content });
    setEditingScenarioId(s.id);
  };

  // Delete scenario
  const handleScenarioDelete = async (id) => {
    if (!window.confirm("Delete this scenario?")) return;
    await deleteScenario(id);
    fetchScenarios(selectedMovieId);
  };

  /* =====================================================
     COMMENTS
  ===================================================== */

  const handleCommentSubmit = async (scenarioId) => {
    const user = getCurrentUser();
    if (!user?.uid) return alert("You must be logged in.");
    if (!commentInput.trim()) return alert("Comment cannot be empty.");

    try {
      if (editingCommentId) {
        await updateComment(editingCommentId, commentInput);
        setEditingCommentId(null);
      } else {
        await createComment({
          scenarioId,
          movieId: selectedMovieId,
          content: commentInput,
          user: {
            uid: user.uid,
            name: user.displayName || user.email,
            photoURL: user.photoURL || "",
          },
        });
      }
      setCommentInput("");
      fetchScenarios(selectedMovieId); // refresh scenarios + comments
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  const handleCommentEdit = (c) => {
    setCommentInput(c.content);
    setEditingCommentId(c.id);
    setCurrentScenarioId(c.scenarioId);
  };

  const handleCommentDelete = async (c) => {
    if (!window.confirm("Delete this comment?")) return;
    await deleteComment(c.id, c.scenarioId);
    fetchScenarios(selectedMovieId);
  };

  const handleLikeComment = async (c) => {
    const user = getCurrentUser();
    if (!user?.uid) return alert("Login to like comment");
    await likeComment(c.id, user.uid);
    fetchScenarios(selectedMovieId);
  };

  const handleUnlikeComment = async (c) => {
    const user = getCurrentUser();
    if (!user?.uid) return alert("Login to unlike comment");
    await unlikeComment(c.id, user.uid);
    fetchScenarios(selectedMovieId);
  };

  return (
    <div style={{ padding: 30, maxWidth: 800, margin: "auto" }}>
      <h2>🎬 Scenario & Comments Manager</h2>

      {/* Select Movie */}
      <select
        value={selectedMovieId}
        onChange={(e) => setSelectedMovieId(e.target.value)}
      >
        <option value="">Select Movie</option>
        {movies.map((m) => (
          <option key={m.id} value={m.id}>
            {m.title}
          </option>
        ))}
      </select>

      {/* Preset Scenarios */}
      {selectedMovieId && (
        <select onChange={handlePresetSelect} style={{ marginLeft: 10 }}>
          <option value="">Load Preset Scenario</option>
          {presetScenarios.map((s) => (
            <option key={s.title}>{s.title}</option>
          ))}
        </select>
      )}

      {/* Scenario Form */}
      {selectedMovieId && (
        <form onSubmit={handleScenarioSubmit} style={{ marginTop: 20 }}>
          <input
            name="title"
            placeholder="Scenario Title"
            value={form.title}
            onChange={handleChange}
            required
          />
          <br />
          <textarea
            name="content"
            placeholder="Rewrite the scenario..."
            value={form.content}
            onChange={handleChange}
            rows={4}
            required
          />
          <br />
          <button type="submit">
            {editingScenarioId ? "Update Scenario" : "Add Scenario"}
          </button>
        </form>
      )}

      <hr />

      {/* Scenarios List */}
      {scenarios.map((s) => (
        <div
          key={s.id}
          style={{
            border: "1px solid #ccc",
            padding: 15,
            marginBottom: 20,
          }}
        >
          <h3>{s.title}</h3>
          <p>{s.content}</p>
          <p>
            👤 {s.createdByName} | ❤️ {s.likesCount} | 💬 {s.commentsCount}
          </p>
          <button onClick={() => handleScenarioEdit(s)}>Edit</button>
          <button onClick={() => handleScenarioDelete(s.id)}>Delete</button>

          {/* Comments */}
          <div style={{ marginTop: 15, paddingLeft: 15 }}>
            <h4>Comments</h4>
            {(commentsMap[s.id] || []).map((c) => (
              <div
                key={c.id}
                style={{
                  borderBottom: "1px solid #eee",
                  paddingBottom: 5,
                  marginBottom: 5,
                }}
              >
                <p>{c.content}</p>
                <p>
                  👤 {c.createdByName} | ❤️ {c.likesCount}{" "}
                  <button onClick={() => handleLikeComment(c)}>Like</button>
                  <button onClick={() => handleUnlikeComment(c)}>Unlike</button>
                </p>
                <button onClick={() => handleCommentEdit(c)}>Edit</button>
                <button onClick={() => handleCommentDelete(c)}>Delete</button>
              </div>
            ))}

            {/* Add Comment */}
            <input
              placeholder="Add a comment..."
              value={
                editingCommentId && currentScenarioId === s.id
                  ? commentInput
                  : currentScenarioId === s.id
                    ? commentInput
                    : ""
              }
              onChange={(e) => {
                setCommentInput(e.target.value);
                setCurrentScenarioId(s.id);
              }}
            />
            <button onClick={() => handleCommentSubmit(s.id)}>
              {editingCommentId && currentScenarioId === s.id
                ? "Update Comment"
                : "Add Comment"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
