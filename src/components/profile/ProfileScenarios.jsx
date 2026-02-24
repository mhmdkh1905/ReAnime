import { AiOutlineLike, AiOutlineDislike } from "react-icons/ai";
import { FaRegHeart, FaRegComment } from "react-icons/fa";
export default function ProfileScenarios(props) {
  return (
    <div className="scenario-card">
      <div className="scenario-header">
        <img
          src={props.profile.photoURL}
          alt="avatar"
          className="scenario-avatar"
        />
        <div>
          <span className="scenario-name">{props.scenario.movieTitle}</span>
          <p className="time">
            {props.scenario.updatedAt?.toDate().toDateString()}
          </p>
        </div>
      </div>

      <p className="scenario-text">{props.scenario.content}</p>

      <div className="scenario-actions">
        <AiOutlineLike />
        <span>{props.scenario.likesCount || 0}</span>

        <AiOutlineDislike />
        <span>{props.scenario.dislikesCount || 0}</span>

        <FaRegComment />
        <span>{props.scenario.commentsCount}</span>
      </div>
    </div>
  );
}
