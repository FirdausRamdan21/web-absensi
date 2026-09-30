import { prisma } from "@/lib/prisma";
import { StudentManager, type StudentRow } from "@/components/students/student-manager";

export default async function StudentsPage() {
  const students = await prisma.student.findMany({ orderBy: [{ className: "asc" }, { attendanceNumber: "asc" }, { name: "asc" }], select: { id: true, name: true, className: true, attendanceNumber: true, nis: true, nisn: true, phone: true, address: true, photo: true, createdAt: true } });
  const serializableStudents: StudentRow[] = students.map((student) => ({ ...student, createdAt: student.createdAt.toISOString() }));

  return <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8"><StudentManager students={serializableStudents} /></div>;
}