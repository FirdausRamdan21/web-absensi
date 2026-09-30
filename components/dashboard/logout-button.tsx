"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export function LogoutButton({ compact = false }: { compact?: boolean }) {
  return (
    <button
      aria-label="Keluar dari akun"
      className={`flex w-full items-center gap-3 rounded-xl text-sm font-semibold text-slate-500 transition hover:bg-red-50 hover:text-red-700 ${compact ? "justify-center px-3 py-2" : "px-3 py-2.5"}`}
      onClick={() => signOut({ callbackUrl: "/login" })}
      title="Keluar"
      type="button"
    >
      <LogOut size={18} />
      {!compact && <span>Keluar</span>}
    </button>
  );
}