import "../styles/user-profile.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaRegHeart, FaRegComment } from "react-icons/fa";
import { IoDocumentTextOutline } from "react-icons/io5";
import { AiOutlineLike, AiOutlineDislike } from "react-icons/ai";
import { useAuth } from "../context/AuthContext";
import { getUserProfile } from "../services/authService";

export default function Profile() {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
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

          <button className="edit-btn">Edit Profile</button>
        </div>

        <h3 className="section-title">My Scenarios</h3>

        <div className="scenario-card">
          <div className="scenario-header">
            <img
              src="https://i.pravatar.cc/40?img=12"
              alt="avatar"
              className="scenario-avatar"
            />
            <div>
              <span className="scenario-name">SakuraFan92</span>
              <span className="badge">Actor</span>
              <p className="time">6 days ago</p>
            </div>
          </div>

          <p className="scenario-text">
            What if I was Akira? I would use my knowledge of old analog systems
            that the Phantom hasn't accounted for...
          </p>

          <div className="scenario-actions">
            <AiOutlineLike />
            <span>234</span>

            <AiOutlineDislike />
            <span>12</span>

            <FaRegComment />
            <span>45</span>
          </div>
        </div>
      </div>
    </div>
  );
}
