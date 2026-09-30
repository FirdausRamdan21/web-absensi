import { AttendanceStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { normalizeAttendanceDate, todayAttendanceDate } from "@/lib/attendance-date";
import { AttendanceManager, type AttendanceStudent } from "@/components/attendance/attendance-manager";

export default async function AttendancePage({ searchParams }: { searchParams: Promise<{ date?: string }> }) {
  const params = await searchParams;
  const dateValue = params.date && normalizeAttendanceDate(params.date) ? params.date : todayAttendanceDate();
  const date = normalizeAttendanceDate(dateValue) as Date;
  const [students, attendances] = await Promise.all([
    prisma.student.findMany({ orderBy: [{ className: "asc" }, { attendanceNumber: "asc" }, { name: "asc" }], select: { id: true, name: true, nisn: true, photo: true } }),
    prisma.attendance.findMany({ where: { date }, select: { studentId: true, status: true } }),
  ]);
  const attendanceMap = new Map(attendances.map((attendance) => [attendance.studentId, attendance.status]));
  const rows: AttendanceStudent[] = students.map((student) => ({ ...student, status: attendanceMap.get(student.id) ?? AttendanceStatus.HADIR }));

  return <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8"><AttendanceManager key={dateValue} date={dateValue} students={rows} /></div>;
}