import { AdminSidebar } from "@/components/layout/AdminSidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="dark bg-background-dark min-h-screen flex text-slate-300 font-body selection:bg-primary selection:text-white">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Admin Header (Optional or part of pages) */}
        <main className="flex-1 overflow-y-auto bg-background-dark">
          {children}
        </main>
      </div>
    </div>
  )
}
