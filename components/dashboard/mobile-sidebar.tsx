"use client";

import Link from "next/link";
import { ClipboardCheck, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { dashboardNavItems } from "./nav-items";
import { LogoutButton } from "./logout-button";

export function MobileSidebar({ name, role }: { name: string; role: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return <>
    <button aria-label="Buka menu navigasi" className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 lg:hidden" onClick={() => setIsOpen(true)} title="Buka menu" type="button"><Menu size={22} /></button>
    {isOpen && <div className="fixed inset-0 z-50 lg:hidden">
      <button aria-label="Tutup menu navigasi" className="absolute inset-0 bg-slate-950/40" onClick={() => setIsOpen(false)} type="button" />
      <aside className="relative flex h-full w-[min(19rem,88vw)] flex-col bg-white shadow-2xl">
        <div className="flex h-20 items-center justify-between border-b border-slate-100 px-6">
          <div className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-xl bg-cyan-700 text-white"><ClipboardCheck size={19} /></span><p className="font-semibold text-slate-950">Absensi Kelas</p></div>
          <button aria-label="Tutup menu" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" onClick={() => setIsOpen(false)} title="Tutup menu" type="button"><X size={20} /></button>
        </div>
        <nav aria-label="Navigasi mobile" className="flex-1 space-y-1 px-4 py-7">
          {dashboardNavItems.map(({ href, label, icon: Icon }) => <Link className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium ${pathname === href ? "bg-cyan-50 text-cyan-800" : "text-slate-500"}`} href={href} key={href} onClick={() => setIsOpen(false)}><Icon size={18} /><span>{label}</span></Link>)}
        </nav>
        <div className="border-t border-slate-100 p-4"><p className="mb-1 text-sm font-semibold text-slate-800">{name}</p><p className="mb-3 text-xs text-slate-400">{role}</p><LogoutButton /></div>
      </aside>
    </div>}
  </>;
}