"use client";

import type { AttendanceStatus } from "@prisma/client";

const attendanceStatuses: AttendanceStatus[] = ["HADIR", "SAKIT", "IZIN", "ALFA"];

const labels: Record<AttendanceStatus, string> = {
  HADIR: "Hadir",
  SAKIT: "Sakit",
  IZIN: "Izin",
  ALFA: "Alfa",
};

export function AttendanceStatusSelect({ value, onChange, name }: { value: AttendanceStatus; onChange: (value: AttendanceStatus) => void; name: string }) {
  return <select aria-label={`Status ${name}`} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-cyan-600 focus:ring-4 focus:ring-cyan-100 sm:w-36" value={value} onChange={(event) => onChange(event.target.value as AttendanceStatus)}>{attendanceStatuses.map((status) => <option key={status} value={status}>{labels[status]}</option>)}</select>;
}

export { labels };