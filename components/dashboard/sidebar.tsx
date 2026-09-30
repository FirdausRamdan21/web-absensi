"use client";

import Link from "next/link";
import { ClipboardCheck } from "lucide-react";
import { usePathname } from "next/navigation";
import { dashboardNavItems } from "./nav-items";
import { LogoutButton } from "./logout-button";

type SidebarProps = { name: string; role: string };

export function Sidebar({ name, role }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-white lg:flex lg:flex-col">
      <div className="flex h-20 items-center gap-3 border-b border-slate-100 px-7">
        <span className="grid size-10 place-items-center rounded-xl bg-cyan-700 text-white"><ClipboardCheck size={21} /></span>
        <div><p className="font-semibold text-slate-950">Absensi Kelas</p><p className="text-xs text-slate-400">Ruang kerja pengurus</p></div>
      </div>
      <nav aria-label="Navigasi utama" className="flex-1 space-y-1 px-4 py-7">
        <p className="px-3 pb-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Menu utama</p>
        {dashboardNavItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return <Link className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${isActive ? "bg-cyan-50 text-cyan-800" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`} href={href} key={href}><Icon size={18} /><span>{label}</span></Link>;
        })}
      </nav>
      <div className="border-t border-slate-100 p-4">
        <div className="mb-3 flex items-center gap-3 rounded-xl bg-slate-50 p-3">
          <div className="grid size-9 shrink-0 place-items-center rounded-full bg-cyan-100 text-sm font-bold text-cyan-800">{name.charAt(0).toUpperCase()}</div>
          <div className="min-w-0"><p className="truncate text-sm font-semibold text-slate-800">{name}</p><p className="truncate text-xs text-slate-400">{role}</p></div>
        </div>
        <LogoutButton />
      </div>
    </aside>
  );
}