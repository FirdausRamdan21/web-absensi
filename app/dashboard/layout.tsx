import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";

export default async function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role === "SISWA") redirect("/student");

  const role = session.user.role === "KETUA_KELAS" ? "Ketua Kelas" : "Sekretaris";
  return <div className="flex min-h-screen bg-slate-100"><Sidebar name={session.user.name ?? "Pengguna"} role={role} /><div className="flex min-w-0 flex-1 flex-col"><Topbar name={session.user.name ?? "Pengguna"} role={role} /><main className="flex-1">{children}</main></div></div>;
}