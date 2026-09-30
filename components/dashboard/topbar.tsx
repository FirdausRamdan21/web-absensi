"use client";

import { Bell } from "lucide-react";
import { usePathname } from "next/navigation";
import { MobileSidebar } from "./mobile-sidebar";

export function Topbar({ name, role }: { name: string; role: string }) {
  const pathname = usePathname();
  const title = pathname === "/dashboard" ? "Dashboard" : pathname.split("/").at(-1)?.replaceAll("-", " ") ?? "Dashboard";
  return <header className="flex min-h-20 items-center justify-between gap-4 border-b border-slate-200 bg-white px-5 sm:px-8">
    <div className="flex items-center gap-3"><MobileSidebar name={name} role={role} /><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-700">Ruang kerja</p><h1 className="mt-1 text-xl font-semibold capitalize text-slate-950">{title}</h1></div></div>
    <div className="flex items-center gap-3"><button aria-label="Notifikasi" className="hidden rounded-xl p-2.5 text-slate-500 hover:bg-slate-100 sm:block" title="Notifikasi" type="button"><Bell size={19} /></button><div className="hidden text-right sm:block"><p className="text-sm font-semibold text-slate-800">{name}</p><p className="text-xs text-slate-400">{role}</p></div><div className="grid size-10 place-items-center rounded-full bg-cyan-100 text-sm font-bold text-cyan-800 sm:hidden">{name.charAt(0).toUpperCase()}</div></div>
  </header>;
}