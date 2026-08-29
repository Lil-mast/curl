import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl text-center py-20 px-4">
      <p className="text-sm font-semibold uppercase tracking-widest text-emerald-800">404</p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Page not found</h1>
      <p className="mt-3 text-sm text-stone-600">
        The page you are looking for does not exist or has been moved.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Link
          href="/"
          className="rounded-full bg-emerald-800 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-900 transition-colors"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
