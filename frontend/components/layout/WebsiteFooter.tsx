export function WebsiteFooter() {
  return (
    <footer className="bg-white dark:bg-[#09090b] border-t border-slate-200 dark:border-slate-800 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500 dark:text-slate-400">
        <p>© 2023 Mana Vyapar Solutions Pvt Ltd. All rights reserved.</p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <a href="#" className="hover:text-primary transition-colors">Privacy</a>
          <a href="#" className="hover:text-primary transition-colors">Terms</a>
          <a href="#" className="hover:text-primary transition-colors">Support</a>
        </div>
      </div>
    </footer>
  )
}
