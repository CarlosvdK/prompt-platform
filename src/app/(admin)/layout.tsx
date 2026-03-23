import { redirect } from "next/navigation";
import { getServerAuth } from "@/lib/auth";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { AdminHeader } from "@/components/layout/admin-header";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  const role = (session.user as { role?: string }).role;
  if (role !== "ADMIN" && role !== "REVIEWER") {
    redirect("/auth/signin");
  }

  return (
    <div className="flex h-full min-h-screen">
      {/* Sidebar - hidden on mobile, visible on lg+ */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-border">
        <AdminSidebar />
      </aside>

      <div className="flex flex-1 flex-col">
        <AdminHeader />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
