import Sidebar from "@/components/admin/sidebar";
import Topbar from "@/components/admin/topbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <Topbar />
      <main className="pl-64 pt-16 min-h-screen">
        {children}
      </main>
    </div>
  );
}
