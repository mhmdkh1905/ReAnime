import { useEffect, useState } from "react";
import {
  createMovie,
  getAllMovies,
  updateMovie,
  deleteMovie,
} from "./services/movieService";
import { getCurrentUser } from "./services/authService";
export default function Test() {
  const [movies, setMovies] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    releaseYear: "",
    rating: "",
    genre: "",
  });

  const [editingId, setEditingId] = useState(null);

  const fetchMovies = async () => {
    const data = await getAllMovies();
    setMovies(data);
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = getCurrentUser();
    if (!user) {
      alert("You must be logged in to add or edit movies.");
      return;
    }
    if (editingId) {
      await updateMovie(editingId, form);
      setEditingId(null);
    } else {
      await createMovie({
        ...form,
        rating: Number(form.rating),
        releaseYear: Number(form.releaseYear),
        createdBy: user.uid,
        createdByName: user.displayName,
      });
    }

    setForm({
      title: "",
      description: "",
      releaseYear: "",
      rating: "",
      genre: "",
      image: "",
    });

    fetchMovies();
  };

  const handleEdit = (movie) => {
    setForm({
      title: movie.title,
      description: movie.description,
      releaseYear: movie.releaseYear,
      rating: movie.rating,
      genre: movie.genre,
      image: movie.image,
    });
    setEditingId(movie.id);
  };

  const handleDelete = async (id) => {
    await deleteMovie(id);
    fetchMovies();
  };

  return (
    <div style={{ padding: "30px", maxWidth: "600px", margin: "auto" }}>
      <h2>🎬 Movie Manager</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <br />

        <input
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />
        <br />

        <input
          name="releaseYear"
          placeholder="Release Year"
          value={form.releaseYear}
          onChange={handleChange}
          type="number"
        />
        <br />

        <input
          name="rating"
          placeholder="Rating"
          value={form.rating}
          onChange={handleChange}
          type="number"
          step="0.1"
        />
        <br />
        <input
          name="genre"
          placeholder="Genre"
          value={form.genre}
          onChange={handleChange}
        />

        <br />
        <input
          name="image"
          placeholder="Image URL"
          value={form.image}
          onChange={handleChange}
        />

        <br />

        <button type="submit">
          {editingId ? "Update Movie" : "Add Movie"}
        </button>
      </form>

      <hr />

      {movies.map((movie) => (
        <div
          key={movie.id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <h3>{movie.title}</h3>
          <p>{movie.description}</p>
          <p>
            ⭐ {movie.rating} | 📅 {movie.releaseYear}
          </p>
          <p>Genre: {movie.genre}</p>
          {movie.image && (
            <img
              src={movie.image}
              alt="Movie"
              style={{ width: "100%", height: "200px", objectFit: "cover" }}
            />
          )}

          <button onClick={() => handleEdit(movie)}>Edit</button>
          <button onClick={() => handleDelete(movie.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
