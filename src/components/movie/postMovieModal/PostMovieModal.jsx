import React, { useState } from "react";
import { createMovie } from "../../../services/movieService";

export default function PostMovieModal({ isOpen, onClose, onCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [releaseYear, setReleaseYear] = useState(2024);
  const [rating, setRating] = useState(5);
  const [genre, setGenre] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

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
      const id = await createMovie({
        title: title.trim(),
        description: description.trim(),
        releaseYear,
        rating,
        genre: genre.trim(),
        image: image.trim() || "",
      });
      //onCreated && onCreated(id)` is okay, but use optional chaining style `onCreated?.(id)` for readability.
      onCreated && onCreated(id);
      // reset
      setTitle("");
      setDescription("");
      setReleaseYear(2024);
      setRating(5);
      setGenre("");
      setImage("");
      onClose && onClose();
    } catch (err) {
      console.error(err);
      alert("Error creating movie: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modalOverlay">
      <div className="modalCard">
        <h3>Create Movie Card</h3>

        <label>Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} />

        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <label>Genre</label>
        <input value={genre} onChange={(e) => setGenre(e.target.value)} />

        <label>Release Year</label>
        <input
          type="number"
          value={releaseYear}
          onChange={(e) => setReleaseYear(Number(e.target.value))}
        />

        <label>Rating</label>
        <input
          type="number"
          min={0}
          max={10}
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
        />

        <label>Image URL (optional)</label>
        <input value={image} onChange={(e) => setImage(e.target.value)} />

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
