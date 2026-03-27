import { WebsiteNavbar } from "@/components/layout/WebsiteNavbar"
import { WebsiteFooter } from "@/components/layout/WebsiteFooter"
import { SmoothScroll } from "@/components/layout/SmoothScroll"

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SmoothScroll>
      <div className="min-h-screen bg-white dark:bg-[#09090b] text-slate-900 dark:text-white font-display overflow-x-hidden">
        <WebsiteNavbar />
        {children}
        <WebsiteFooter />
      </div>
    </SmoothScroll>
  )
}
