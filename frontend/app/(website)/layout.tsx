import { WebsiteNavbar } from "@/components/layout/WebsiteNavbar"
import { WebsiteFooter } from "@/components/layout/WebsiteFooter"

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0f172a] text-slate-900 dark:text-white font-display">
      <WebsiteNavbar />
      {children}
      <WebsiteFooter />
    </div>
  )
}
