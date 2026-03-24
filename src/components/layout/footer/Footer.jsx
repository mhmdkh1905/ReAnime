import "./footer.css";

export default function Footer() {
  // Hardcoding `2026` is fragile. Use `new Date().getFullYear()` so the footer stays current automatically.
  const year = 2026;
  return (
    <footer className="footer">
      <p>© {year} ReAnime. All rights reserved.</p>
    </footer>
  );
}
