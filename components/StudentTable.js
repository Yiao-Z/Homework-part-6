"use client";

import Image from "next/image";
import { useState } from "react";
import { deleteStudentAction } from "../lib/actions";

const studentImages = [
  "/students/360_F_590807804_e0FgoICXHSfohQf0mtVyvjK6iiDNhjkU.jpg",
  "/students/headshot-smiling-confident-african-american-teen-college-student-with-eyeglasses-looking-camera-vertical-image-education-conc.avif",
  "/students/images.jpg",
  "/students/istockphoto-1395838909-612x612.jpg",
  "/students/pngtree-asian-man-portrait-png-image_21237848.png",
  "/students/portrait-smiling-young-man_1268-21877.avif",
];

export default function StudentTable({ students, allowDelete = false }) {
  const [search, setSearch] = useState("");
  const normalizedSearch = search.trim().toLowerCase();
  const filteredStudents = normalizedSearch
    ? students.filter((student) =>
        [
          student.first_name,
          student.last_name,
          student.email,
          student.phone,
          student.street_address,
          student.city,
          student.province_state,
          student.country,
          student.postal_code,
          student.program,
          student.year,
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedSearch)
      )
    : students;

  return (
    <>
      {allowDelete && (
        <div className="px-5 pt-5 sm:px-6">
          <label htmlFor="student-search" className="sr-only">
            Search students
          </label>
          <input
            id="student-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search students..."
            className="form-field max-w-md"
          />
        </div>
      )}

      {filteredStudents.length === 0 ? (
        <div className="px-6 py-14 text-center">
          <div
            aria-hidden="true"
            className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-blue-50 text-xl font-bold text-blue-700"
          >
            {normalizedSearch ? "?" : "+"}
          </div>
          <h3 className="text-base font-semibold text-slate-900">
            {normalizedSearch ? "No matching students" : "No students yet"}
          </h3>
          <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
            {normalizedSearch
              ? "Try another name, email, location, program, or year."
              : "Add a student to start building your directory."}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <thead>
              <tr className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <th scope="col" className="px-5 py-3 sm:px-6">
                  Student
                </th>
                <th scope="col" className="px-5 py-3">
                  Program
                </th>
                <th scope="col" className="px-5 py-3">
                  Year
                </th>
                <th scope="col" className="px-5 py-3">
                  Location
                </th>
                {allowDelete && (
                  <th scope="col" className="px-5 py-3 text-right sm:px-6">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((student) => (
                <tr
                  key={student.id}
                  className="transition hover:bg-slate-50/70"
                >
                  <td className="px-5 py-4 sm:px-6">
                    <div className="flex items-center gap-3">
                      <Image
                        src={studentImages[(Number(student.id) - 1) % studentImages.length]}
                        alt={`${student.first_name} ${student.last_name}`.trim()}
                        width={40}
                        height={40}
                        className="size-10 shrink-0 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-semibold text-slate-900">
                          {student.first_name} {student.last_name}
                        </p>
                        <p className="mt-0.5 text-sm text-slate-500">
                          {student.email}
                          {student.phone && (
                            <>
                              <span
                                aria-hidden="true"
                                className="mx-2 text-slate-300"
                              >
                                ·
                              </span>
                              {student.phone}
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-700">
                    {student.program}
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-700">
                    <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-800">
                      {student.year}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-700">
                    {student.city ? (
                      <>
                        <p>
                          {student.city}, {student.province_state}
                        </p>
                        <p className="text-xs text-slate-500">
                          {student.country} · {student.postal_code}
                        </p>
                      </>
                    ) : (
                      <span className="text-slate-400">Not provided</span>
                    )}
                  </td>
                  {allowDelete && (
                    <td className="px-5 py-4 text-right sm:px-6">
                      <form
                        action={deleteStudentAction.bind(null, student.id)}
                        onSubmit={(event) => {
                          if (
                            !window.confirm(
                              `Remove ${student.first_name} ${student.last_name} from the student directory?`
                            )
                          ) {
                            event.preventDefault();
                          }
                        }}
                      >
                        <button
                          type="submit"
                          aria-label={`Remove ${student.first_name} ${student.last_name}`}
                          className="rounded-md px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50 hover:text-red-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                        >
                          Remove
                        </button>
                      </form>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="border-t border-slate-100 px-5 py-3 text-xs text-slate-500 sm:px-6">
            Showing {filteredStudents.length}{" "}
            {filteredStudents.length === 1 ? "student" : "students"}
          </p>
        </div>
      )}
    </>
  );
}
