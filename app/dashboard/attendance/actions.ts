"use server";

import { AttendanceStatus, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { normalizeAttendanceDate } from "@/lib/attendance-date";
import { prisma } from "@/lib/prisma";

type ActionResult = { ok: true } | { ok: false; message: string };
const validStatuses = new Set(Object.values(AttendanceStatus));

export async function saveAttendance(formData: FormData): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user || !["SEKRETARIS", "KETUA_KELAS"].includes(session.user.role)) {
    return { ok: false, message: "Kamu tidak memiliki izin untuk mengelola absensi." };
  }

  const dateValue = String(formData.get("date") ?? "");
  const date = normalizeAttendanceDate(dateValue);
  if (!date) return { ok: false, message: "Tanggal absensi tidak valid." };

  let statuses: unknown;
  try {
    statuses = JSON.parse(String(formData.get("statuses") ?? "{}"));
  } catch {
    return { ok: false, message: "Data status absensi tidak valid." };
  }

  if (!statuses || typeof statuses !== "object" || Array.isArray(statuses)) {
    return { ok: false, message: "Data status absensi tidak valid." };
  }

  const entries = Object.entries(statuses);
  if (entries.some(([studentId, status]) => !studentId || typeof status !== "string" || !validStatuses.has(status as AttendanceStatus))) {
    return { ok: false, message: "Ada status absensi yang tidak valid." };
  }

  try {
    const studentIds = entries.map(([studentId]) => studentId);
    const students = await prisma.student.findMany({ where: { id: { in: studentIds } }, select: { id: true } });
    if (students.length !== studentIds.length) return { ok: false, message: "Ada siswa yang tidak ditemukan." };

    await prisma.$transaction(
      entries.map(([studentId, status]) => prisma.attendance.upsert({
        where: { studentId_date: { studentId, date } },
        create: { studentId, date, status: status as AttendanceStatus },
        update: { status: status as AttendanceStatus },
      })),
    );
    revalidatePath("/dashboard/attendance");
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/history");
    return { ok: true };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { ok: false, message: "Absensi untuk siswa dan tanggal tersebut sudah ada." };
    }
    return { ok: false, message: "Absensi belum dapat disimpan. Silakan coba lagi." };
  }
}