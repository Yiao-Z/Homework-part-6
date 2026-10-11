import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";
import StudentForm from "../../../components/StudentForm";
import { getStudentSchema } from "../../../lib/students";

async function NewStudentContent() {
  await connection();
  const schema = await getStudentSchema();

  return <StudentForm schemaKind={schema.kind} />;
}

function StudentFormLoading() {
  return (
    <div
      aria-label="Loading student form"
      aria-busy="true"
      className="h-[34rem] animate-pulse rounded-xl border border-slate-200 bg-white"
    />
  );
}

export default function NewStudentPage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/students"
        className="text-sm font-semibold text-blue-700 hover:text-blue-900"
      >
        <span aria-hidden="true">←</span> Back to students
      </Link>
      <div className="mb-7 mt-5">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.16em] text-blue-700">
          Student records
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-950">
          Add a student
        </h1>
        <p className="mt-2 text-slate-600">
          Enter the student details below to add a new directory record.
        </p>
      </div>
      <Suspense fallback={<StudentFormLoading />}>
        <NewStudentContent />
      </Suspense>
    </main>
  );
}
