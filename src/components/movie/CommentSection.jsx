import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  createComment,
  subscribeToComments,
  getCommentsByScenario,
} from "../../services/commentService";

export default function CommentSection({ scenarioId, movieId }) {
  const { currentUser } = useAuth();
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    if (!scenarioId) return;

    // try real-time subscription, fallback to one-time fetch
    const unsub = subscribeToComments(scenarioId, (data) => {
      setComments(data);
    });

    // ensure initial load if subscription doesn't fire immediately
    getCommentsByScenario(scenarioId).then(setComments).catch(() => {});

    return () => unsub && unsub();
  }, [scenarioId]);

  const handlePost = async () => {
    if (!text.trim()) return;
    if (!currentUser) {
      alert("Please login to post a comment");
      return;
    }

    setPosting(true);
    try {
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
        alert("Error posting comment: " + (res.error || ""));
      }
    } catch (err) {
      console.error(err);
      alert("Error posting comment");
    } finally {
      setPosting(false);
    }
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
                    {c.createdAt?.toDate ? c.createdAt.toDate().toLocaleString() : ""}
                  </span>
                </div>
                <div className="commentContent">{c.content}</div>
              </div>
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
