"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type StudentInput = { name: string; nisn: string; photo?: string };
type ActionResult = { ok: true } | { ok: false; message: string };

async function validateUser() {
  const session = await auth();
  return session?.user?.role === "SEKRETARIS" || session?.user?.role === "KETUA_KELAS";
}

function validateStudentInput(input: StudentInput): string | null {
  const name = input.name.trim();
  const nisn = input.nisn.trim();
  const photo = input.photo?.trim() ?? "";

  if (name.length < 2) return "Nama siswa minimal terdiri dari 2 karakter.";
  if (!/^\d+$/.test(nisn)) return "NISN hanya boleh berisi angka.";
  if (photo && !/^https?:\/\//i.test(photo)) return "URL foto harus diawali http:// atau https://.";
  return null;
}

function getInput(formData: FormData): StudentInput {
  return {
    name: String(formData.get("name") ?? ""),
    nisn: String(formData.get("nisn") ?? ""),
    photo: String(formData.get("photo") ?? ""),
  };
}

export async function createStudent(formData: FormData): Promise<ActionResult> {
  if (!(await validateUser())) return { ok: false, message: "Kamu tidak memiliki izin untuk mengelola siswa." };

  const input = getInput(formData);
  const validationError = validateStudentInput(input);
  if (validationError) return { ok: false, message: validationError };

  try {
    await prisma.student.create({
      data: { name: input.name.trim(), nisn: input.nisn.trim(), photo: input.photo?.trim() || null },
    });
    revalidatePath("/dashboard/students");
    return { ok: true };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { ok: false, message: "NISN tersebut sudah digunakan oleh siswa lain." };
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
      data: { name: input.name.trim(), nisn: input.nisn.trim(), photo: input.photo?.trim() || null },
    });
    revalidatePath("/dashboard/students");
    return { ok: true };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { ok: false, message: "NISN tersebut sudah digunakan oleh siswa lain." };
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
    return { ok: true };
  } catch {
    return { ok: false, message: "Siswa belum dapat dihapus. Silakan coba lagi." };
  }
}