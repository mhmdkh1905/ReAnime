import "../../styles/MovieCard.css";

export default function MovieCard({ title, image, type, trending }) {
  return (
    <div className="movie-card">
      <div className="movie-image">
        <img src={image} alt={title} />
        <div className="overlay">
          <div className="movie-info">
            <h2>{title}</h2>

            <div className="movie-meta">
              <span className="badge">{type}</span>
            </div>
            {trending === "true" && (
              <div className="trending">
                <span className="dot"></span>
                Trending
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
