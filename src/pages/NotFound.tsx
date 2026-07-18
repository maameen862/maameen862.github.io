import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center container text-center">
      <h1 className="font-display text-6xl md:text-8xl text-foreground">404</h1>
      <p className="mt-4 text-muted-foreground">Page not found.</p>
      <Link to="/" className="mt-8 inline-flex items-center gap-2 rounded-sm bg-primary px-6 py-3 font-mono text-xs uppercase tracking-widest text-primary-foreground">
        Back home
      </Link>
    </div>
  );
}
