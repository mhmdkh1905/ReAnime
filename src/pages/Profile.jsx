import "../styles/user-profile.css";
import { GoArrowLeft } from "react-icons/go";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaRegHeart } from "react-icons/fa";
import { IoDocumentTextOutline } from "react-icons/io5";
import { AiOutlineLike } from "react-icons/ai";
import { AiOutlineDislike } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { getUserProfile } from "../services/authService";

export default function Profile() {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      if (currentUser) {
        const data = await getUserProfile(currentUser.uid);
        setProfile(data);
        console.log(data);
      } else {
        console.log("there is no user");
      }
    }

    fetchProfile();
  }, [currentUser]);

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-page">
      <div className="container">
        <button className="back-btn">← Back to Home</button>

        {/* Profile Card */}
        <div className="profile-card">
          <div className="profile-left">
            <div className="avatar">
              <img src="https://i.pravatar.cc/150?img=12" alt="avatar" />
            </div>

            <div>
              <h2 className="username">{profile.name}</h2>

              <div className="stats">
                <div className="stat">
                  <div className="stat-number">
                    <IoDocumentTextOutline className="document-icon" />
                    <span>{profile.totalPosterScenarios}</span>
                  </div>
                  <span className="stat-label">Scenarios Posted</span>
                </div>

                <div className="stat">
                  <div className="stat-number">
                    <FaRegHeart className="heart-icon" />
                    <span>{profile.totalLikes}</span>
                  </div>
                  <span className="stat-label">Total Likes</span>
                </div>
              </div>
            </div>
          </div>

          <button className="edit-btn">Edit Profile</button>
        </div>

        {/* Scenarios */}
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
            that the Phantom hasn't accounted for. While everyone relies on
            quantum encryption, I'd dig into the city archives and find the
            original blueprints from 2050. The key to defeating the AI isn't
            through advanced tech—it's through understanding the foundation it
            was built upon.
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
