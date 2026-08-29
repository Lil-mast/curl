import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl text-center py-20 px-4">
      <p className="text-sm font-bold uppercase tracking-widest text-clay">404</p>
      <h1 className="display mt-3 text-3xl sm:text-4xl">Page not found</h1>
      <p className="mt-3 text-sm text-muted">
        The page you are looking for does not exist or has been moved.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Link href="/" className="btn btn-primary">
          Return to Home
        </Link>
      </div>
    </div>
  );
}
