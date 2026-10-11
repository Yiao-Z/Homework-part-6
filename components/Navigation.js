import Link from "next/link";

export default function Navigation() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-3 text-slate-950"
          aria-label="Student Management home"
        >
          <span className="flex size-10 items-center justify-center rounded-xl bg-blue-700 text-sm font-extrabold text-white">
            SM
          </span>
          <span>
            <span className="block text-base font-bold leading-tight">
              Student Management
            </span>
            <span className="mt-0.5 block text-xs font-medium text-slate-500">
              Student directory
            </span>
          </span>
        </Link>

        <nav
          aria-label="Main navigation"
          className="flex flex-wrap items-center gap-1"
        >
          <Link href="/" className="nav-link">
            Dashboard
          </Link>
          <Link href="/students" className="nav-link">
            Students
          </Link>
          <Link
            href="/students/new"
            className="ml-1 inline-flex min-h-10 items-center justify-center rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
          >
            Add student
          </Link>
        </nav>
      </div>
    </header>
  );
}
