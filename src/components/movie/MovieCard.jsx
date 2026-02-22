import { Link } from "react-router-dom";
import "../../styles/MovieCard.css";

export default function MovieCard({ id, title, image, type, trending }) {
  return (
    <Link to={`/movie/${id}`} className="movie-card-link">
      <div className="movie-card">
        <img src={image} className="movie-image" alt={title} />

        <div className="movie-gradient"></div>

        {trending && (
          <div className="trending">
            <div className="dot"></div>
            Trending
          </div>
        )}

        <div className="movie-content">
          <h3 className="movie-title">{title}</h3>
          <span className={`movie-badge ${type.toLowerCase()}`}>
            {type}
          </span>
        </div>
      </div>
    </Link>
  );
}