import { useState } from "react";
import "../styles/user-profile.css";

export default function Profile() {
  const [user] = useState({
    username: "narutoFan",
    email: "user@email.com",
    photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=narutoFan",
    bio: "I love rewriting anime endings",
    scenariosPosted: 24,
    totalLikes: 1842,
  });

  return (
    <div className="profile-container">
      <button className="back-button">
        <span className="arrow">←</span> Back to Home
      </button>

      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-left">
            <div className="avatar-container">
              <img src={user.photoURL} alt={user.username} className="avatar" />
            </div>
            <div className="profile-info">
              <h1 className="username">{user.username}</h1>
              <div className="stats">
                <div className="stat-item">
                  <span className="icon">📄</span>
                  <span className="stat-number">{user.scenariosPosted}</span>
                  <span className="stat-label">Scenarios Posted</span>
                </div>
                <div className="stat-item">
                  <span className="icon">❤️</span>
                  <span className="stat-number">{user.totalLikes}</span>
                  <span className="stat-label">Total Likes</span>
                </div>
              </div>
            </div>
          </div>
          <button className="edit-profile-btn">Edit Profile</button>
        </div>

        <div className="profile-details">
          <div className="detail-row">
            <span className="detail-label">Email:</span>
            <span className="detail-value">{user.email}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Bio:</span>
            <span className="detail-value">{user.bio}</span>
          </div>
        </div>
      </div>

      <div className="scenarios-section">
        <h2 className="section-title">My Scenarios</h2>
        {/* Scenarios will be listed here */}
      </div>
    </div>
  );
}
