import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";
import StudentCard from "../components/StudentCard";
import WeatherCard from "../components/WeatherCard";
import { getAllStudents, getStudentStats } from "../lib/students";

const studentPhotos = [
  "/students/360_F_590807804_e0FgoICXHSfohQf0mtVyvjK6iiDNhjkU.jpg",
  "/students/headshot-smiling-confident-african-american-teen-college-student-with-eyeglasses-looking-camera-vertical-image-education-conc.avif",
  "/students/images.jpg",
  "/students/istockphoto-1395838909-612x612.jpg",
  "/students/pngtree-asian-man-portrait-png-image_21237848.png",
  "/students/portrait-smiling-young-man_1268-21877.avif",
];

async function DashboardContent() {
  await connection();

  const [students, stats] = await Promise.all([
    getAllStudents(),
    getStudentStats(),
  ]);

  const metrics = [
    {
      label: "Total students",
      value: stats.totalStudents,
      detail: "Students in the directory",
      icon: "ST",
      tone: "blue",
    },
    {
      label: "Programs",
      value: stats.programs,
      detail: "Distinct study programs",
      icon: "PR",
      tone: "violet",
    },
    {
      label: "Year levels",
      value: stats.yearLevels,
      detail: "Different study years",
      icon: "YR",
      tone: "amber",
    },
  ];
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.16em] text-blue-700">
            Student records
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Dashboard
          </h1>
          <p className="mt-2 max-w-2xl text-slate-600">
            Keep your student directory organized and up to date.
          </p>
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

      <section
        aria-label="Student statistics"
        className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3"
      >
        {metrics.map((metric) => (
          <article
            key={metric.label}
            className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div
              className={`flex size-12 shrink-0 items-center justify-center rounded-xl text-xs font-bold tracking-wide ${
                metric.tone === "blue"
                  ? "bg-blue-100 text-blue-800"
                  : metric.tone === "violet"
                    ? "bg-violet-100 text-violet-800"
                    : "bg-amber-100 text-amber-800"
              }`}
            >
              {metric.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">
                {metric.label}
              </p>
              <p className="mt-0.5 text-2xl font-bold text-slate-950">
                {metric.value}
              </p>
              <p className="text-xs text-slate-500">{metric.detail}</p>
            </div>
          </article>
        ))}
      </section>

      <WeatherCard />

      <section>
        <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-xl font-bold text-slate-950">Student directory</h2>
            <p className="mt-1 text-sm text-slate-500">
              {stats.totalStudents} registered{" "}
              {stats.totalStudents === 1 ? "student" : "students"}.
            </p>
          </div>
          <Link
            href="/students"
            className="text-sm font-semibold text-blue-700 hover:text-blue-900"
          >
            Manage students <span aria-hidden="true">→</span>
          </Link>
        </div>
        {students.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
            {students.map((student, index) => (
              <StudentCard
                key={student.id}
                student={student}
                imageSrc={studentPhotos[index % studentPhotos.length]}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
            <h3 className="font-semibold text-slate-900">No students yet</h3>
            <p className="mt-2 text-sm text-slate-600">
              Add a student with the registration form or insert student records
              into the <code>student_management_app.students</code> table.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}

function DashboardLoading() {
  return (
    <main
      aria-label="Loading student dashboard"
      aria-busy="true"
      className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
    >
      <div className="h-9 w-56 animate-pulse rounded bg-slate-200" />
      <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-28 animate-pulse rounded-xl border border-slate-200 bg-white"
          />
        ))}
      </div>
      <div className="mt-7 h-64 animate-pulse rounded-xl border border-slate-200 bg-white" />
    </main>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardContent />
    </Suspense>
  );
}