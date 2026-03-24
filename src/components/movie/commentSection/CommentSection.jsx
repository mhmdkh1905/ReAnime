import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import {
  subscribeToComments,
  createComment,
  deleteComment,
} from "../../../services/commentService";

import {
  increaseScenarioComentCount,
  decreaseScenarioComentCount,
} from "../../../services/scenarioReactionService";

export default function CommentSection({ scenarioId, movieId }) {
  const { currentUser } = useAuth();
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    //This is one of the most important bugs in the UI layer. The effect depends on `comments.length`, so every change in comment count re-subscribes to Firestore. The dependency should be just `[scenarioId]`.
    if (!scenarioId) return;

    const unsub = subscribeToComments(scenarioId, (data) => {
      setComments(data);
    });

    return () => unsub();
  }, [scenarioId, comments.length]);

  const handlePost = async () => {
    if (!text.trim()) return;

    if (!currentUser) {
      alert("Please login to post a comment");
      return;
    }

    setPosting(true);

    const user = {
      uid: currentUser.uid,
      name: currentUser.displayName || currentUser.email || "Anonymous",
      photoURL: currentUser.photoURL || "",
    };

    const res = await createComment({
      scenarioId,
      movieId: movieId || null,
      content: text.trim(),
      user,
    });

    if (res.success) {
      setText("");
    } else {
      alert("Error posting comment");
    }

    increaseScenarioComentCount(scenarioId);
    setPosting(false);
  };

  return (
    <div className="commentsPanel">
      <div className="commentsList">
        {comments.length === 0 ? (
          <div className="noComments">Be the first to comment</div>
        ) : (
          comments.map((c) => (
            <div key={c.id} className="commentItem">
              <img
                src={c.userPhotoURL || "https://i.pravatar.cc/40"}
                alt={c.createdByName}
                className="commentAvatar"
              />

              <div className="commentBody">
                <div className="commentMeta">
                  <strong>{c.createdByName}</strong>
                  <span className="commentTime">
                    {c.createdAt
                      ? new Date(c.createdAt.seconds * 1000).toLocaleString()
                      : ""}
                  </span>
                </div>

                <div className="commentContent">{c.content}</div>
              </div>
              <button
                className="deleteBtn"
                onClick={() => {
                  deleteComment(c.id);
                  decreaseScenarioComentCount(scenarioId);
                }}
                disabled={!currentUser || currentUser.uid !== c.createdBy}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>

      <div className="commentForm">
        <textarea
          className="scenarioInput"
          rows={2}
          placeholder="Write a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="inputBar">
          <button
            className="postBtn"
            type="button"
            onClick={handlePost}
            disabled={posting}
          >
            {posting ? "Posting..." : "Post Comment"}
          </button>
        </div>
      </div>
    </div>
  );
}
