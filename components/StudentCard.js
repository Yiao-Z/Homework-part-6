import Image from "next/image";

export default function StudentCard({
  student,
  imageSrc,
}) {
  const name = [student.first_name, student.last_name].filter(Boolean).join(" ");

  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative aspect-[4/3] bg-slate-100">
        <Image
          src={imageSrc}
          alt={`Photo of ${name}`}
          fill
          sizes="(max-width: 639px) 50vw, (max-width: 1279px) 33vw, 25vw"
          className="object-cover"
        />
      </div>
      <div className="p-3 sm:p-4">
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="min-w-0 break-words text-sm font-bold text-slate-950 sm:text-base">
            {name}
          </h3>
          <span className="shrink-0 rounded-full bg-blue-50 px-2 py-1 text-[10px] font-semibold text-blue-800 sm:text-xs">
            ID {student.id}
          </span>
        </div>
        <p className="text-xs font-medium text-slate-700 sm:text-sm">
          {student.program}
        </p>
        <p className="mt-1 text-xs text-slate-500">Year {student.year}</p>
        {student.tagline && (
          <p className="mt-2 text-xs leading-relaxed text-slate-600">
            {student.tagline}
          </p>
        )}
        {student.email && (
          <a
            href={`mailto:${student.email}`}
            className="mt-3 block break-all text-xs text-blue-700 hover:text-blue-900"
          >
            {student.email}
          </a>
        )}
        {student.phone && (
          <a
            href={`tel:${student.phone}`}
            className="mt-1 block text-xs text-slate-600 hover:text-slate-900"
          >
            {student.phone}
          </a>
        )}
      </div>
    </article>
  );
}
