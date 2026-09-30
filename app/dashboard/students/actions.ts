"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type StudentInput = { name: string; className: string; attendanceNumber: string; nis: string; nisn: string; phone?: string; address?: string };
type ActionResult = { ok: true } | { ok: false; message: string };

async function validateUser() {
  const session = await auth();
  return session?.user?.role === "SEKRETARIS" || session?.user?.role === "KETUA_KELAS";
}

function validateStudentInput(input: StudentInput): string | null {
  const name = input.name.trim();
  const className = input.className.trim();
  const attendanceNumber = Number(input.attendanceNumber.trim());
  const nis = input.nis.trim();
  const nisn = input.nisn.trim();
  const phone = input.phone?.trim() ?? "";

  if (name.length < 2) return "Nama siswa minimal terdiri dari 2 karakter.";
  if (!className) return "Kelas wajib diisi.";
  if (!Number.isInteger(attendanceNumber) || attendanceNumber < 1) return "Nomor absen harus berupa angka positif.";
  if (!/^\d+$/.test(nis)) return "NIS hanya boleh berisi angka.";
  if (!/^\d+$/.test(nisn)) return "NISN hanya boleh berisi angka.";
  if (phone && !/^[+\d][+\d\s-]*$/.test(phone)) return "Nomor telepon tidak valid.";
  return null;
}

function getInput(formData: FormData): StudentInput {
  return {
    name: String(formData.get("name") ?? ""),
    className: String(formData.get("className") ?? ""),
    attendanceNumber: String(formData.get("attendanceNumber") ?? ""),
    nis: String(formData.get("nis") ?? ""),
    nisn: String(formData.get("nisn") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    address: String(formData.get("address") ?? ""),
  };
}

export async function createStudent(formData: FormData): Promise<ActionResult> {
  if (!(await validateUser())) return { ok: false, message: "Kamu tidak memiliki izin untuk mengelola siswa." };

  const input = getInput(formData);
  const validationError = validateStudentInput(input);
  if (validationError) return { ok: false, message: validationError };

  try {
    await prisma.student.create({
      data: { name: input.name.trim(), className: input.className.trim(), attendanceNumber: Number(input.attendanceNumber), nis: input.nis.trim(), nisn: input.nisn.trim(), phone: input.phone?.trim() || null, address: input.address?.trim() || null },
    });
    revalidatePath("/dashboard/students");
    revalidatePath("/dashboard");
    return { ok: true };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      const target = (error.meta as { target?: string[] } | undefined)?.target ?? [];
      return { ok: false, message: target.includes("nis") ? "NIS tersebut sudah digunakan oleh siswa lain." : "NISN tersebut sudah digunakan oleh siswa lain." };
    }
    return { ok: false, message: "Siswa belum dapat ditambahkan. Silakan coba lagi." };
  }
}

export async function updateStudent(formData: FormData): Promise<ActionResult> {
  if (!(await validateUser())) return { ok: false, message: "Kamu tidak memiliki izin untuk mengelola siswa." };

  const id = String(formData.get("id") ?? "").trim();
  const input = getInput(formData);
  const validationError = validateStudentInput(input);
  if (!id) return { ok: false, message: "Data siswa tidak valid." };
  if (validationError) return { ok: false, message: validationError };

  try {
    await prisma.student.update({
      where: { id },
      data: { name: input.name.trim(), className: input.className.trim(), attendanceNumber: Number(input.attendanceNumber), nis: input.nis.trim(), nisn: input.nisn.trim(), phone: input.phone?.trim() || null, address: input.address?.trim() || null },
    });
    revalidatePath("/dashboard/students");
    revalidatePath("/dashboard");
    return { ok: true };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      const target = (error.meta as { target?: string[] } | undefined)?.target ?? [];
      return { ok: false, message: target.includes("nis") ? "NIS tersebut sudah digunakan oleh siswa lain." : "NISN tersebut sudah digunakan oleh siswa lain." };
    }
    return { ok: false, message: "Siswa belum dapat diperbarui. Silakan coba lagi." };
  }
}

export async function deleteStudent(formData: FormData): Promise<ActionResult> {
  if (!(await validateUser())) return { ok: false, message: "Kamu tidak memiliki izin untuk mengelola siswa." };

  const id = String(formData.get("id") ?? "").trim();
  if (!id) return { ok: false, message: "Data siswa tidak valid." };

  try {
    await prisma.student.delete({ where: { id } });
    revalidatePath("/dashboard/students");
    revalidatePath("/dashboard");
    return { ok: true };
  } catch {
    return { ok: false, message: "Siswa belum dapat dihapus. Silakan coba lagi." };
  }
}