import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, getCurrentUser } from "../context/AuthContext";
import {
  getAllMovies,
  deleteMovie,
  createMovie,
  getMovieById,
} from "../services/movieService";
import {
  getAllScenarios,
  deleteScenario,
  getScenarioById,
} from "../services/scenarioService";
import {
  getCommentsByScenario,
  deleteComment,
  getAllComments,
} from "../services/commentService";
import { getAllUsers, updateUser, deleteUser } from "../services/usersService";
import "./Admin.css";
import { getUserProfile } from "../services/authService";

export default function Admin() {
  const { userLoggedIn, currentUser } = useAuth();
  const navigate = useNavigate();

  const [currentUserProfile, setCurrentUserProfile] = useState(null);
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [movies, setMovies] = useState([]);
  const [scenarios, setScenarios] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [stats, setStats] = useState({
    users: 0,
    movies: 0,
    scenarios: 0,
    comments: 0,
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      const profile = await getUserProfile(currentUser.uid);
      setCurrentUserProfile(profile);
      setLoading(false);
    };

    fetchUserProfile();
  }, [currentUser]);

  useEffect(() => {
    if (!userLoggedIn) {
      navigate("/login");
    } else {
      loadData();
    }
  }, [userLoggedIn]);

  const loadData = async () => {
    try {
      setLoading(true);

      const usersData = await getAllUsers();
      setUsers(usersData || []);

      const moviesData = await getAllMovies();
      setMovies(moviesData || []);

      const scenariosData = await getAllScenarios();
      setScenarios(scenariosData || []);

      const commentsData = await getAllComments();
      setComments(commentsData || []);

      setStats({
        users: usersData?.length || 0,
        movies: moviesData?.length || 0,
        scenarios: scenariosData?.length || 0,
        comments: commentsData?.length || 0,
      });
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(userId);
      setUsers(users.filter((u) => u.id !== userId));
      const userMovies = movies.filter((m) => m.createdBy === userId);
      for (const movie of userMovies) {
        await deleteMovie(movie.id);
      }
      setMovies(movies.filter((m) => m.createdBy !== userId));

      const userScenarios = scenarios.filter((s) => s.createdBy === userId);
      for (const scenario of userScenarios) {
        await deleteScenario(scenario.id);
      }
      setScenarios(scenarios.filter((s) => s.createdBy !== userId));

      const userComments = comments.filter((c) => c.createdBy === userId);
      for (const comment of userComments) {
        await deleteComment(comment.id, comment.scenarioId);
      }
      setComments(comments.filter((c) => c.createdBy !== userId));

      setStats((prev) => ({
        ...prev,
        users: prev.users - 1,
        movies: prev.movies - userMovies.length,
        scenarios: prev.scenarios - userScenarios.length,
        comments: prev.comments - userComments.length,
      }));
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user");
    }
  };

  const handleDeleteMovie = async (movieId) => {
    if (!window.confirm("Are you sure you want to delete this movie?")) return;
    try {
      await deleteMovie(movieId);
      setMovies(movies.filter((m) => m.id !== movieId));
      setStats((prev) => ({ ...prev, movies: prev.movies - 1 }));
    } catch (error) {
      console.error("Error deleting movie:", error);
      alert("Failed to delete movie");
    }
  };

  const handleDeleteScenario = async (scenarioId) => {
    if (!window.confirm("Are you sure you want to delete this scenario?"))
      return;
    try {
      await deleteScenario(scenarioId);
      setScenarios(scenarios.filter((s) => s.id !== scenarioId));
      setStats((prev) => ({ ...prev, scenarios: prev.scenarios - 1 }));
    } catch (error) {
      console.error("Error deleting scenario:", error);
      alert("Failed to delete scenario");
    }
  };

  const handleDeleteComment = async (commentId, scenarioId) => {
    if (!window.confirm("Are you sure you want to delete this comment?"))
      return;
    try {
      await deleteComment(commentId, scenarioId);
      setComments(comments.filter((c) => c.id !== commentId));
      setStats((prev) => ({ ...prev, comments: prev.comments - 1 }));
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert("Failed to delete comment");
    }
  };

  if (!currentUserProfile || currentUserProfile.role !== "admin") {
    return (
      <div className="admin-page">
        <div className="admin-container">
          <div className="admin-header">
            <h1>Access Denied</h1>
          </div>
          <div className="access-denied-message">
            You do not have permission to access this page.
          </div>
          <button className="back-home-btn" onClick={() => navigate("/")}>
            ← Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-container">
          <div className="admin-loading">Loading admin data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-container">
        <div className="admin-header">
          <div className="header-left">
            <button className="back-home-btn" onClick={() => navigate("/")}>
              ← Back to Home
            </button>
            <h1>Admin Dashboard</h1>
          </div>
          <button
            className="create-movie-btn"
            onClick={() => setShowCreateModal(true)}
          >
            + Create Movie
          </button>
        </div>

        {/* Stats Cards */}
        <div className="admin-stats">
          <div className="stat-card">
            <div className="stat-icon users-icon">👥</div>
            <div className="stat-info">
              <span className="stat-number">{stats.users}</span>
              <span className="stat-label">Users</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon movies-icon">🎬</div>
            <div className="stat-info">
              <span className="stat-number">{stats.movies}</span>
              <span className="stat-label">Movies</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon scenarios-icon">📝</div>
            <div className="stat-info">
              <span className="stat-number">{stats.scenarios}</span>
              <span className="stat-label">Scenarios</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon comments-icon">💬</div>
            <div className="stat-info">
              <span className="stat-number">{stats.comments}</span>
              <span className="stat-label">Comments</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="admin-tabs">
          <button
            className={`tab-btn ${activeTab === "users" ? "active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            Users
          </button>
          <button
            className={`tab-btn ${activeTab === "movies" ? "active" : ""}`}
            onClick={() => setActiveTab("movies")}
          >
            Movies
          </button>
          <button
            className={`tab-btn ${activeTab === "scenarios" ? "active" : ""}`}
            onClick={() => setActiveTab("scenarios")}
          >
            Scenarios
          </button>
          <button
            className={`tab-btn ${activeTab === "comments" ? "active" : ""}`}
            onClick={() => setActiveTab("comments")}
          >
            Comments
          </button>
        </div>

        {/* Content */}
        <div className="admin-content">
          {activeTab === "users" && (
            <div className="content-section">
              {users.length === 0 ? (
                <div className="empty-state">No users found</div>
              ) : (
                <div className="items-list">
                  {users.map((user) => (
                    <div key={user.id} className="admin-item">
                      <div className="item-avatar">
                        {user.photoURL ? (
                          <img src={user.photoURL} alt={user.name} />
                        ) : (
                          <div className="no-avatar">👤</div>
                        )}
                      </div>
                      <div className="item-details">
                        <h3>{user.name}</h3>
                        <p className="item-meta">{user.email}</p>
                        <p className="item-desc">
                          Member since:{" "}
                          {user.createdAt
                            ? new Date(
                                user.createdAt.seconds * 1000,
                              ).toLocaleDateString()
                            : "N/A"}
                        </p>

                        <p className="item-meta">Role: {user.role || "User"}</p>
                      </div>
                      <div className="item-actions">
                        <button
                          className="edit-btn"
                          onClick={() => {
                            setEditingUser(user);
                            setShowEditUserModal(true);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "movies" && (
            <div className="content-section">
              {movies.length === 0 ? (
                <div className="empty-state">No movies found</div>
              ) : (
                <div className="items-list">
                  {movies.map((movie) => (
                    <div key={movie.id} className="admin-item">
                      <div className="item-image">
                        {movie.image ? (
                          <img src={movie.image} alt={movie.title} />
                        ) : (
                          <div className="no-image">🎬</div>
                        )}
                      </div>
                      <div className="item-details">
                        <h3>{movie.title}</h3>
                        <p className="item-meta">
                          {movie.genre} • {movie.releaseYear} • Rating:{" "}
                          {movie.rating}
                        </p>
                        <p className="item-desc">
                          {movie.description?.substring(0, 100)}...
                        </p>
                      </div>
                      <div className="item-actions">
                        <button
                          className="delete-btn"
                          onClick={() => handleDeleteMovie(movie.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "scenarios" && (
            <div className="content-section">
              {scenarios.length === 0 ? (
                <div className="empty-state">No scenarios found</div>
              ) : (
                <div className="items-list">
                  {scenarios.map((scenario) => (
                    <div key={scenario.id} className="admin-item">
                      <div className="item-details">
                        <h3>{scenario.title}</h3>
                        <p className="item-meta">
                          Movie: {scenario.movieTitle} • By:{" "}
                          {scenario.createdByName}
                        </p>
                        <p className="item-desc">
                          {scenario.content?.substring(0, 100)}...
                        </p>
                        <p className="item-stats">
                          ❤️ {scenario.likesCount} • 💬{" "}
                          {scenario.commentsCount}{" "}
                        </p>
                      </div>
                      <div className="item-actions">
                        <button
                          className="delete-btn"
                          onClick={() => handleDeleteScenario(scenario.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "comments" && (
            <div className="content-section">
              {comments.length === 0 ? (
                <div className="empty-state">No comments found</div>
              ) : (
                <div className="items-list">
                  {comments.map((comment) => {
                    // Find the movie and scenario from already loaded data
                    const movie = movies.find((m) => m.id === comment.movieId);
                    const scenario = scenarios.find(
                      (s) => s.id === comment.scenarioId,
                    );

                    return (
                      <div key={comment.id} className="admin-item">
                        <div className="item-details">
                          <h3>Comment by {comment.createdByName}</h3>
                          <p className="item-meta">
                            Movie: {movie?.title || "Unknown Movie"}
                          </p>
                          <p className="item-meta">
                            Scenario: {scenario?.title || "Unknown Scenario"}
                          </p>
                          <p className="item-desc">{comment.content}</p>
                        </div>
                        <div className="item-actions">
                          <button
                            className="delete-btn"
                            onClick={() =>
                              handleDeleteComment(
                                comment.id,
                                comment.scenarioId,
                              )
                            }
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Create Movie Modal */}
        {showCreateModal && (
          <CreateMovieModal
            onClose={() => setShowCreateModal(false)}
            onCreated={() => {
              setShowCreateModal(false);
              loadData();
            }}
          />
        )}

        {/* Edit User Modal */}
        {showEditUserModal && editingUser && (
          <EditUserModal
            user={editingUser}
            onClose={() => {
              setShowEditUserModal(false);
              setEditingUser(null);
            }}
            onUpdated={() => {
              setShowEditUserModal(false);
              setEditingUser(null);
              loadData();
            }}
          />
        )}
      </div>
    </div>
  );
}

// Create Movie Modal Component
function CreateMovieModal({ onClose, onCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [releaseYear, setReleaseYear] = useState(2024);
  const [rating, setRating] = useState(5);
  const [genre, setGenre] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (
      !title.trim() ||
      !description.trim() ||
      !releaseYear ||
      !rating ||
      !genre
    ) {
      alert("Please fill the required fields");
      return;
    }

    try {
      setLoading(true);
      const user = getCurrentUser();
      const id = await createMovie({
        title: title.trim(),
        description: description.trim(),
        releaseYear,
        rating,
        genre: genre.trim(),
        image: image.trim() || "",
        createdBy: user?.uid || null,
        createdByName: user?.displayName || user?.email || "Admin",
      });

      // Reset form
      setTitle("");
      setDescription("");
      setReleaseYear(2024);
      setRating(5);
      setGenre("");
      setImage("");

      onCreated && onCreated(id);
    } catch (err) {
      console.error(err);
      alert("Error creating movie: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div
        className="modalCard admin-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <h3>Create New Movie</h3>

        <div className="form-group">
          <label>Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter movie title"
          />
        </div>

        <div className="form-group">
          <label>Description *</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter movie description"
            rows={3}
          />
        </div>

        <div className="form-group">
          <label>Genre *</label>
          <input
            type="text"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            placeholder="e.g., Action, Comedy, Drama"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Release Year *</label>
            <input
              type="number"
              value={releaseYear}
              onChange={(e) => setReleaseYear(Number(e.target.value))}
            />
          </div>

          <div className="form-group">
            <label>Rating (0-10) *</label>
            <input
              type="number"
              min={0}
              max={10}
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Image URL (optional)</label>
          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="https://..."
          />
        </div>

        <div className="modalActions">
          <button
            className="ghostBtn"
            type="button"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="primaryBtn"
            type="button"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Movie"}
          </button>
        </div>
      </div>
    </div>
  );
}

// Edit User Modal Component
function EditUserModal({ user, onClose, onUpdated }) {
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [profilePicture, setProfilePicture] = useState(user?.photoURL || "");
  const [role, setRole] = useState(user?.role || "User");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim() || !email.trim() || !role.trim()) {
      alert("Please fill the required fields");
      return;
    }

    try {
      setLoading(true);
      await updateUser(user.id, {
        name: name.trim(),
        email: email.trim(),
        role: role.trim(),
        profilePicture: profilePicture.trim() || "",
      });

      onUpdated && onUpdated();
    } catch (err) {
      console.error(err);
      alert("Error updating user: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div
        className="modalCard admin-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <h3>Edit User</h3>

        <div className="form-group">
          <label>Name *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter user name"
          />
        </div>

        <div className="form-group">
          <label>Email *</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter user email"
          />
        </div>

        <div className="form-group">
          <label>Profile Picture URL (optional)</label>
          <input
            type="text"
            value={profilePicture}
            onChange={(e) => setProfilePicture(e.target.value)}
            placeholder="https://..."
          />
        </div>

        <div className="form-group">
          <label>Role *</label>
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="admin / user"
          />
        </div>

        <div className="modalActions">
          <button
            className="ghostBtn"
            type="button"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="primaryBtn"
            type="button"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
