import MovieCard from "./MovieCard";

export default function MoviesGrid({ title, data }) {
  return (
    <section className="section">
      <h2>{title}</h2>

      <div className="grid">
        {data.map((item, index) => (
          <MovieCard
            key={index}
            title={item.title}
            image={item.image}
            type={item.type}
          />
        ))}
      </div>
    </section>
  );
}
