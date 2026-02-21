import "../../styles/MovieCard.css";

export default function MovieCard({ title, image, type, trending }) {
  return (
    <div className="movie-card">
      <img src={image} className="movie-image" />

      <div className="movie-gradient"></div>
{trending && (
  <div className="trending">
    <div className="dot"></div>
    Trending
  </div>
)}

      <div className="movie-content">
        <h3 className="movie-title">{title}</h3>
        <span className={`movie-badge ${type.toLowerCase()}`}>{type}</span>
      </div>
    </div>
  );
}
