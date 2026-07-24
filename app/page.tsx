
"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { AuroraBackground } from "@/components/ui/aurora-background";

export default function LandingPage() {
  const router = useRouter();
  const { loading, isAuthenticated } = useAuth();

  const handleGetStarted = () => {
    if (loading) return;
    router.push(isAuthenticated ? "/dashboard" : "/sign-up");
  };

  const handleLearnMore = () => {
    if(loading) return;
    router.push("/learn-more");
  }

  return (
    <AuroraBackground>
      {/* Hero */}
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-center px-6 pb-10 pt-20 sm:px-8">
        <div className="mt-15 mb-14 max-w-3xl text-center">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-cyan-300/80">
            Campus networking, rebuilt
          </p>
          <h1 className="mb-6 text-5xl font-bold leading-tight text-white sm:text-6xl">
            Where your campus
            <br />
            <span className="text-cyan-400">actually connects.</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-white/70">
            Social is a networking platform built for students — encrypted
            messaging, real connections with peers and mentors, and a shared
            space for projects, notes, and events. No noise, no algorithm to
            fight. Just the people and work that matter to you.
          </p>

          <div className="mt-10 flex items-center justify-center gap-4">
            <Button
              onClick={handleGetStarted}
              className="group flex items-center gap-2 rounded-xl bg-cyan-700/50 px-6 py-4.5 text-base shadow-lg drop-shadow-lg hover:bg-cyan-700/80 hover:text-white/80"
            >
              Get started
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </Button>


            <Button
              onClick={handleLearnMore}
              className="group flex items-center gap-2 rounded-xl border border-white/20 px-6 py-3.5 text-white/90 transition hover:bg-cyan-300 hover:border-cyan-400 hover:text-cyan-300"
            >
              <BookOpen className="h-4 w-4 transition group-hover:translate-x-0.5" />
              Learn more
            </Button>
          </div>
        </div>

      </main>

      <footer className="py-10 text-center text-sm text-white hover:text-white/90">
        <div>© {new Date().getFullYear()} Social v3.0 · All Rights Reserved</div>
        <div className="mt-1">
          Made with <span className="text-cyan-500">🩵</span> by{" "}
          <span className="font-medium text-cyan-400">Aaryan Bairagi</span>
        </div>
      </footer>
    </AuroraBackground>
  );
}