import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";
import StudentTable from "../../components/StudentTable";
import { getAllStudents } from "../../lib/students";

async function StudentsContent() {
  await connection();

  const students = await getAllStudents();

  return (
    <>
      <p className="mb-4 text-sm text-slate-600">
        {students.length}{" "}
        {students.length === 1 ? "student record" : "student records"}
      </p>
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
          <h2 className="text-lg font-bold text-slate-950">Student directory</h2>
          <p className="mt-1 text-sm text-slate-500">
            Search records by name, email, location, program, or year.
          </p>
        </div>
        <StudentTable students={students} allowDelete />
      </section>
    </>
  );
}

function StudentsLoading() {
  return (
    <div
      aria-label="Loading student directory"
      aria-busy="true"
      className="overflow-hidden rounded-xl border border-slate-200 bg-white"
    >
      <div className="h-16 animate-pulse bg-slate-100" />
      <div className="h-64 animate-pulse" />
    </div>
  );
}

export default function StudentsPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.16em] text-blue-700">
            Directory
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            All students
          </h1>
        </div>
        <Link
          href="/students/new"
          className="inline-flex min-h-11 items-center justify-center rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
        >
          <span aria-hidden="true" className="mr-2 text-lg leading-none">
            +
          </span>
          Add student
        </Link>
      </section>
      <Suspense fallback={<StudentsLoading />}>
        <StudentsContent />
      </Suspense>
    </main>
  );
}
