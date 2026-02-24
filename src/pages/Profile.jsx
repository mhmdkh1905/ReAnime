import "../styles/user-profile.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineLike, AiOutlineDislike } from "react-icons/ai";
import { FaRegHeart, FaRegComment } from "react-icons/fa";
import { IoDocumentTextOutline } from "react-icons/io5";

import { useAuth } from "../context/AuthContext";
import { getUserProfile } from "../services/authService";
import { getScenariosByUserId } from "../services/scenarioService";
import ProfileScenarios from "../components/profile/ProfileScenarios";

export default function Profile() {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [scenarios, setScenarios] = useState([]);
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

  if (!profile) {
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
          ← Back to Home
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

          {/* <button className="edit-btn">Edit Profile</button> */}
        </div>

        <h3 className="section-title">My Scenarios</h3>
        <div className="scenarios-list">
          {setScenarios ? (
            scenarios.length > 0 ? (
              scenarios.map((scenario) => (
                <ProfileScenarios
                  key={scenario.id}
                  scenario={scenario}
                  profile={profile}
                />
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
