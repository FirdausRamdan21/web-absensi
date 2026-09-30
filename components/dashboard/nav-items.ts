import { ClipboardCheck, FileClock, LayoutDashboard, Users } from "lucide-react";

export const dashboardNavItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/students", label: "Daftar Siswa", icon: Users },
  { href: "/dashboard/attendance", label: "Absensi", icon: ClipboardCheck },
  { href: "/dashboard/history", label: "Riwayat Absensi", icon: FileClock },
];