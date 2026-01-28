import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Store } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0f172a] text-white">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500 shadow-2xl shadow-emerald-500/20 mb-8">
        <Store className="h-10 w-10 text-white" />
      </div>
      <h1 className="text-6xl font-display font-bold tracking-tight text-center max-w-2xl mb-6">
        Modern Ledger for the <span className="text-emerald-500">Retail Heartland.</span>
      </h1>
      <p className="text-slate-400 text-lg mb-10 text-center max-w-lg">
        Replace your handwritten chittis with Vision AI and a powerful digital dashboard. Secure, scale, and simplify.
      </p>
      <div className="flex gap-4">
        <Button asChild size="lg" className="rounded-2xl">
          <Link href="/dashboard">
            Dashboard <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="rounded-2xl">
          <Link href="/login">
            Log In
          </Link>
        </Button>
      </div>
    </div>
  );
}
