"use server";

import { Prisma, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

type Result = { ok: true } | { ok: false; message: string };

export async function registerStudent(formData: FormData): Promise<Result> {
  const name = String(formData.get("name") ?? "").trim();
  const className = String(formData.get("className") ?? "").trim();
  const nis = String(formData.get("nis") ?? "").trim();
  const nisn = String(formData.get("nisn") ?? "").trim();
  const username = String(formData.get("username") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const confirmation = String(formData.get("confirmation") ?? "");

  if (name.length < 2) return { ok: false, message: "Nama minimal 2 karakter." };
  if (!className) return { ok: false, message: "Kelas wajib diisi." };
  if (!/^\d+$/.test(nis) || !/^\d+$/.test(nisn)) return { ok: false, message: "NIS dan NISN hanya boleh berisi angka." };
  if (!/^[a-z0-9._-]{3,30}$/.test(username)) return { ok: false, message: "Username harus 3-30 karakter dan hanya memakai huruf kecil, angka, titik, garis bawah, atau tanda hubung." };
  if (password.length < 8 || password.length > 128) return { ok: false, message: "Password harus berisi 8-128 karakter." };
  if (password !== confirmation) return { ok: false, message: "Konfirmasi password tidak sama." };

  try {
    const passwordHash = await bcrypt.hash(password, 12);
    await prisma.$transaction(async (transaction) => {
        const latestNumber = await transaction.student.aggregate({ where: { className }, _max: { attendanceNumber: true } });
        const student = await transaction.student.create({ data: { name, className, attendanceNumber: (latestNumber._max.attendanceNumber ?? 0) + 1, nis, nisn } });
      await transaction.user.create({ data: { name, username, passwordHash, role: UserRole.SISWA, studentId: student.id } });
    });
    return { ok: true };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      const target = (error.meta as { target?: string[] } | undefined)?.target ?? [];
      if (target.includes("username")) return { ok: false, message: "Username sudah terdaftar." };
      if (target.includes("nis")) return { ok: false, message: "NIS sudah terdaftar." };
      if (target.includes("nisn")) return { ok: false, message: "NISN sudah terdaftar." };
      return { ok: false, message: "Data sudah terdaftar." };
    }
    return { ok: false, message: "Pendaftaran belum berhasil. Silakan coba lagi." };
  }
}