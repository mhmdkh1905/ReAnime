import "./user-profile.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AiOutlineLike,
  AiOutlineDislike,
  AiOutlineEdit,
  AiOutlineDelete,
} from "react-icons/ai";
import { FaRegHeart, FaRegComment } from "react-icons/fa";
import { IoDocumentTextOutline } from "react-icons/io5";

import { useAuth } from "../../context/AuthContext";
import { getUserProfile } from "../../services/authService";
import {
  getScenariosByUserId,
  updateScenario,
  deleteScenario,
} from "../../services/scenarioService";

export default function Profile() {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [scenarios, setScenarios] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProfile() {
      if (currentUser) {
        const data = await getUserProfile(currentUser.uid);
        setProfile(data);
      }
    }
    fetchProfile();
  }, [currentUser]);

  useEffect(() => {
    async function fetchScenarios() {
      if (currentUser) {
        const data = await getScenariosByUserId(currentUser.uid);
        setScenarios(data);
      }
    }
    fetchScenarios();
  }, [currentUser]);

  const handleEditClick = (scenario) => {
    setEditingId(scenario.id);
    setEditContent(scenario.content);
  };

  const handleSaveEdit = async (scenarioId) => {
    if (!editContent.trim()) {
      alert("Content cannot be empty");
      return;
    }
    try {
      await updateScenario(scenarioId, { content: editContent.trim() });
      setScenarios(
        scenarios.map((s) =>
          s.id === scenarioId
            ? { ...s, content: editContent.trim(), isEdited: true }
            : s,
        ),
      );
      setEditingId(null);
      setEditContent("");
    } catch (error) {
      console.error("Error updating scenario:", error);
      alert("Failed to update scenario");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditContent("");
  };

  const handleDelete = async (scenarioId) => {
    if (!window.confirm("Are you sure you want to delete this scenario?")) {
      return;
    }
    setDeletingId(scenarioId);
    try {
      await deleteScenario(scenarioId);
      setScenarios(scenarios.filter((s) => s.id !== scenarioId));
    } catch (error) {
      console.error("Error deleting scenario:", error);
      alert("Failed to delete scenario");
    } finally {
      setDeletingId(null);
    }
  };

  if (!profile) {
    // `if (!profile)` shows loading forever even when there is no logged-in user. This should distinguish “loading” from “unauthorized / no user”.
    return (
      <div className="profile-page">
        <div className="container">
          <div className="loadingCard">Loading profile...</div>
        </div>
      </div>
    );
  }

  const avatarSrc = profile.photoURL;

  return (
    <div className="profile-page">
      <div className="container">
        <button className="back-btn" onClick={() => navigate("/")}>
          ← Back to Home Back button should include `type="button"` for safety
          {/* if the DOM structure changes later */}
        </button>

        <div className="profile-card">
          <div className="profile-left">
            <div className="avatar">
              <img src={avatarSrc} alt="avatar" />
            </div>

            <div>
              <h2 className="username">{profile.name || "User"}</h2>
              <label className="email">Email:- {profile.email}</label>
              <div className="stats">
                <div className="stat">
                  <div className="stat-number">
                    <IoDocumentTextOutline className="document-icon" />
                    <span>{profile.totalPosterScenarios || 0}</span>
                  </div>
                  <span className="stat-label">Scenarios Posted</span>
                </div>

                <div className="stat">
                  <div className="stat-number">
                    <FaRegHeart className="heart-icon" />
                    <span>{profile.totalLikes || 0}</span>
                  </div>
                  <span className="stat-label">Total Likes</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <h3 className="section-title">My Scenarios</h3>
        <div className="scenarios-list">
          {setScenarios ? (
            scenarios.length > 0 ? (
              scenarios.map((scenario) => (
                <div key={scenario.id} className="scenario-card">
                  <div className="scenario-header">
                    <img
                      src={profile.photoURL}
                      alt="avatar"
                      className="scenario-avatar"
                    />
                    <div>
                      <span className="scenario-name">
                        {scenario.movieTitle}
                      </span>
                      {scenario.isEdited && (
                        <span className="badge">Edited</span>
                      )}
                      <p className="time">
                        {scenario.updatedAt?.toDate
                          ? scenario.updatedAt.toDate().toDateString()
                          : "Unknown date"}
                      </p>
                    </div>
                    <div className="scenario-owner-actions">
                      <button
                        className="action-btn edit-btn-scenario"
                        onClick={() => handleEditClick(scenario)}
                        title="Edit"
                      >
                        <AiOutlineEdit />
                      </button>
                      <button
                        className="action-btn delete-btn-scenario"
                        onClick={() => handleDelete(scenario.id)}
                        disabled={deletingId === scenario.id}
                        title="Delete"
                      >
                        <AiOutlineDelete />
                      </button>
                    </div>
                  </div>

                  {editingId === scenario.id ? (
                    <div className="edit-mode">
                      <textarea
                        className="edit-textarea"
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        rows={5}
                      />
                      <div className="edit-actions">
                        <button
                          className="save-btn"
                          onClick={() => handleSaveEdit(scenario.id)}
                        >
                          Save
                        </button>
                        <button
                          className="cancel-btn"
                          onClick={handleCancelEdit}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="scenario-text">{scenario.content}</p>
                  )}

                  <div className="scenario-actions">
                    <AiOutlineLike />
                    <span>{scenario.likesCount || 0}</span>

                    <AiOutlineDislike />
                    <span>{scenario.dislikesCount || 0}</span>

                    <FaRegComment />
                    <span>{scenario.commentsCount || 0}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-content">
                You haven't posted any scenarios yet.
              </p>
            )
          ) : (
            <p className="loadingCard">Loading scenarios...</p>
          )}
        </div>
      </div>
    </div>
  );
}
