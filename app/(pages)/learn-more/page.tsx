"use client"

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  Users,
  Briefcase,
  MessageCircle,
  Sparkles,
  SendIcon,
  GraduationCap,
  FileText,
  FolderOpen,
  Upload,
  CalendarDays,
  Clock3,
  Bell,
  Heart,
  Globe as GlobeIcon,
  FolderKanban,
  Plus,
  Check,
} from "lucide-react";
import { FaInstagram, FaTwitter, FaGithub, FaLinkedin } from "react-icons/fa";

const World = dynamic(() => import("@/components/ui/globe").then((mod) => mod.World), {
  ssr: false,
});


const GLOBE_ARCS = [
  { order: 1, startLat: 40.7128, startLng: -74.006, endLat: 34.0522, endLng: -118.2437, arcAlt: 0.3, color: "#8fb8c9" },
  { order: 2, startLat: 37.7749, startLng: -122.4194, endLat: 47.6062, endLng: -122.3321, arcAlt: 0.2, color: "#7ba7bd" },
  { order: 3, startLat: 41.8781, startLng: -87.6298, endLat: 29.7604, endLng: -95.3698, arcAlt: 0.2, color: "#6b98b3" },
  { order: 4, startLat: -23.5505, startLng: -46.6333, endLat: -22.9068, endLng: -43.1729, arcAlt: 0.2, color: "#8fb8c9" },
  { order: 5, startLat: -34.6037, startLng: -58.3816, endLat: -33.4489, endLng: -70.6693, arcAlt: 0.25, color: "#7ba7bd" },
  { order: 6, startLat: 51.5072, startLng: -0.1276, endLat: 48.8566, endLng: 2.3522, arcAlt: 0.2, color: "#6b98b3" },
  { order: 7, startLat: 48.8566, startLng: 2.3522, endLat: 41.9028, endLng: 12.4964, arcAlt: 0.2, color: "#8fb8c9" },
  { order: 8, startLat: 52.52, startLng: 13.405, endLat: 55.7558, endLng: 37.6173, arcAlt: 0.3, color: "#7ba7bd" },
  { order: 9, startLat: 30.0444, startLng: 31.2357, endLat: -1.2921, endLng: 36.8219, arcAlt: 0.35, color: "#6b98b3" },
  { order: 10, startLat: -26.2041, startLng: 28.0473, endLat: -33.9249, endLng: 18.4241, arcAlt: 0.3, color: "#8fb8c9" },
  { order: 11, startLat: 25.276987, startLng: 55.296249, endLat: 24.7136, endLng: 46.6753, arcAlt: 0.2, color: "#7ba7bd" },
  { order: 12, startLat: 32.0853, startLng: 34.7818, endLat: 41.0082, endLng: 28.9784, arcAlt: 0.25, color: "#6b98b3" },
  { order: 13, startLat: 28.6139, startLng: 77.209, endLat: 19.076, endLng: 72.8777, arcAlt: 0.2, color: "#8fb8c9" },
  { order: 14, startLat: 12.9716, startLng: 77.5946, endLat: 17.385, endLng: 78.4867, arcAlt: 0.15, color: "#7ba7bd" },
  { order: 15, startLat: 22.5726, startLng: 88.3639, endLat: 13.0827, endLng: 80.2707, arcAlt: 0.25, color: "#6b98b3" },
  { order: 16, startLat: 35.6762, startLng: 139.6503, endLat: 37.5665, endLng: 126.978, arcAlt: 0.2, color: "#8fb8c9" },
  { order: 17, startLat: 31.2304, startLng: 121.4737, endLat: 22.3193, endLng: 114.1694, arcAlt: 0.2, color: "#7ba7bd" },
  { order: 18, startLat: 13.7563, startLng: 100.5018, endLat: 1.3521, endLng: 103.8198, arcAlt: 0.2, color: "#6b98b3" },
  { order: 19, startLat: -33.8688, startLng: 151.2093, endLat: -37.8136, endLng: 144.9631, arcAlt: 0.2, color: "#8fb8c9" },
  { order: 20, startLat: -27.4698, startLng: 153.0251, endLat: -31.9505, endLng: 115.8605, arcAlt: 0.3, color: "#7ba7bd" },
  { order: 21, startLat: 40.7128, startLng: -74.006, endLat: 51.5072, endLng: -0.1276, arcAlt: 0.4, color: "#6b98b3" },
  { order: 22, startLat: 34.0522, startLng: -118.2437, endLat: 35.6762, endLng: 139.6503, arcAlt: 0.5, color: "#8fb8c9" },
  { order: 23, startLat: 48.8566, startLng: 2.3522, endLat: 25.276987, endLng: 55.296249, arcAlt: 0.4, color: "#7ba7bd" },
  { order: 24, startLat: 19.076, startLng: 72.8777, endLat: 1.3521, endLng: 103.8198, arcAlt: 0.35, color: "#6b98b3" },
  { order: 25, startLat: 37.7749, startLng: -122.4194, endLat: 22.3193, endLng: 114.1694, arcAlt: 0.45, color: "#8fb8c9" },
];


const DARK_GLOBE_CONFIG = {
  globeColor: "#070d19",
  polygonColor: "rgba(150, 190, 205, 0.3)",
  atmosphereColor: "#6fa6b8",
  showAtmosphere: true,
  emissive: "#0a1f2c",
  emissiveIntensity: 0.15,
  shininess: 0.35,
  rings: 1,
  maxRings: 3,
};


const display = Space_Grotesk({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-display" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono" });

/* ------------------------------------------------------------------ */
/*  Small primitives                                                   */
/* ------------------------------------------------------------------ */

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span
      className={` inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-cyan-300/70`}
    >
      <span className="h-px w-4 bg-cyan-400/60" />
      {children}
    </span>
  );
}

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Aurora + noise backdrop                                             */
/* ------------------------------------------------------------------ */

function Aurora() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="aurora-blob aurora-a" />
      <div className="aurora-blob aurora-b" />
      <div className="aurora-blob aurora-c" />
      <div
        className="absolute inset-0 opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,8,10,0)_0%,#05080a_92%)]" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Cursor spotlight — a soft light that follows the pointer            */
/* ------------------------------------------------------------------ */

function Spotlight({ containerRef }: { containerRef: React.RefObject<HTMLDivElement> }) {
  const x = useMotionValue(-400);
  const y = useMotionValue(-400);
  const sx = useSpring(x, { stiffness: 120, damping: 22 });
  const sy = useSpring(y, { stiffness: 120, damping: 22 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      x.set(e.clientX - r.left);
      y.set(e.clientY - r.top);
    };
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, [containerRef, x, y]);

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute -z-0 h-[520px] w-[520px] rounded-full opacity-[0.16] blur-3xl"
      style={{
        left: sx,
        top: sy,
        translateX: "-50%",
        translateY: "-50%",
        background:
          "radial-gradient(circle, rgba(34,211,238,0.9) 0%, rgba(124,108,246,0.35) 45%, transparent 72%)",
      }}
    />
  );
}



function CipherLine({
  cipher,
  plain,
  align = "left",
}: {
  cipher: string;
  plain: string;
  align?: "left" | "right";
}) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`relative overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-2.5 text-sm cursor-default ${
        align === "right" ? "ml-auto max-w-[85%] text-right" : "max-w-[85%]"
      }`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {hover ? (
          <motion.span
            key="plain"
            initial={{ opacity: 0, filter: "blur(4px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="block text-cyan-100"
          >
            {plain}
          </motion.span>
        ) : (
          <motion.span
            key="cipher"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={` block tracking-wide text-cyan-300/50`}
          >
            {cipher}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Bento feature card                                                  */
/* ------------------------------------------------------------------ */

function Bento({
  className = "",
  eyebrow,
  title,
  desc,
  children,
}: {
  className?: string;
  eyebrow: string;
  title: string;
  desc: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={`group relative rounded-3xl border border-white/[0.07] bg-gradient-to-b from-white/[0.035] to-white/[0.015] p-6 transition-all duration-300 hover:border-cyan-400/30 hover:from-white/[0.06] ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ boxShadow: "0 0 60px -20px rgba(34,211,238,0.25) inset" }}
      />
      <p className={` text-[10px] uppercase tracking-[0.22em] text-cyan-300/60`}>{eyebrow}</p>
      <h3 className={`${display.className} mt-2 text-lg font-semibold text-white/90`}>{title}</h3>
      <p className="mt-1.5 text-[13px] leading-6 text-white/45">{desc}</p>
      {children && <div className="mt-5">{children}</div>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  FAQ accordion                                                       */
/* ------------------------------------------------------------------ */

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02]">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className={`${display.className} text-[15px] font-medium text-white/85`}>{q}</span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-cyan-400/30 text-cyan-300"
        >
          <Plus className="h-3.5 w-3.5" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-4 text-sm leading-6 text-white/45">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Footer (kept close to the original, restyled dark)                  */
/* ------------------------------------------------------------------ */

function Footer() {
  return (
    <footer className="border-t border-white/[0.07] bg-black">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-6 py-12 md:flex-row">
        <div className="text-center md:text-left">
          <h2 className={`${display.className} text-xl font-bold text-white/80`}>Social</h2>
          <p className="mt-1 text-sm text-white/40">Connect. Collaborate. Grow within your campus.</p>
        </div>
        <div className="flex gap-6 text-sm text-white/50">
          <a href="/features" className="transition hover:text-cyan-400">Features</a>
          <a href="/contact-us" className="transition hover:text-cyan-400">Contact</a>
          <a href="/learn-more" className="transition hover:text-cyan-400">About</a>
        </div>
      </div>

      <div className="flex items-center justify-center gap-6 pb-10">
        <span className="text-white/40">Follow us:</span>
        {[
          { href: "https://github.com/AaryanBairagi", Icon: FaGithub, color: "text-zinc-200" },
          { href: "https://www.linkedin.com/in/aaryan-bairagi-183249249/", Icon: FaLinkedin, color: "text-blue-400" },
          { href: "https://x.com/aaryanb4real", Icon: FaTwitter, color: "text-zinc-200" },
          { href: "https://www.instagram.com/aaryanb4real/", Icon: FaInstagram, color: "text-pink-400" },
        ].map(({ href, Icon, color }) => (
          <a
            key={href}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-white/10 bg-white/[0.04] p-3 transition hover:border-cyan-400/40 hover:bg-white/[0.08]"
          >
            <Icon className={`h-4 w-4 ${color}`} />
          </a>
        ))}
      </div>

      <div className="border-t border-white/[0.06]" />
      <div className="py-8 text-center text-sm text-white/40">
        <div>© {new Date().getFullYear()} Social · All Rights Reserved</div>
        <div className="mt-1">
          Made with <span className="text-cyan-400">🩵</span> by{" "}
          <span className="font-medium text-cyan-300">Aaryan Bairagi</span>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/*  Data                                                                */
/* ------------------------------------------------------------------ */

const testimonials = [
  { text: "I met my project team and landed an internship through Social's networking tools.", name: "Aayushi K.", role: "Class of 2025" },
  { text: "Managing a college club has never been easier — everything feels connected.", name: "Neeraj S.", role: "Club President" },
  { text: "It brings students, mentors, and alumni into one trusted space.", name: "Prof. Mehta", role: "Mentor" },
];

const faqs = [
  { q: "What is Social?", a: "Social is a campus-focused platform that helps students connect, collaborate, and discover opportunities in one place." },
  { q: "Is Social only for students?", a: "Primarily yes — but mentors, alumni, and clubs can also join to guide and collaborate with students." },
  { q: "Is my data secure?", a: "Yes. Social is built privacy-first, with secure authentication and encrypted communication end to end." },
  { q: "Can I use Social for projects and groups?", a: "Absolutely — create groups, share files, and collaborate in real time from a single thread." },
];

const shipped = [
  "Real-time messaging with unread tracking",
  "Post sharing with likes, comments, and interactions",
  "Smart file sharing — notes, PDFs, project assets",
  "Events & reminders for campus activities",
  "Stories and lightweight status updates",
  "Real-time notifications",
  "Achievements and progress tracking",
];

const roadmap = [
  { icon: GlobeIcon, title: "Scaling across campuses", desc: "One unified student network, not bounded by a single college." },
  { icon: Users, title: "Community ecosystem", desc: "Interest-based communities for focused discussion and long-term teamwork." },
  { icon: Briefcase, title: "Opportunities hub", desc: "Internships, hackathons, and roles — curated specifically for students." },
  { icon: FolderKanban, title: "Project showcasing", desc: "Profiles become portfolios: visible work, real collaborators." },
  { icon: GraduationCap, title: "Mentor & alumni access", desc: "Direct lines to people who've already walked the path." },
  { icon: Sparkles, title: "Smart networking", desc: "Recommendations that surface the right people, not just more people." },
];

/* ------------------------------------------------------------------ */
/*  Page                                                                */
/* ------------------------------------------------------------------ */

export default function LearnMore() {
  const router = useRouter();
  const { loading, isAuthenticated } = useAuth();
  const heroRef = useRef<HTMLDivElement>(null);

  const handleGetStarted = () => {
    if (loading) return;
    router.push(isAuthenticated ? "/dashboard" : "/sign-up");
  };

  return (
    <div className={`${display.variable} ${mono.variable} min-h-screen bg-[#05080a] text-white antialiased`}>
      <style jsx global>{`
        @keyframes drift1 {
          0%, 100% { transform: translate(-8%, -6%) scale(1); }
          50% { transform: translate(6%, 4%) scale(1.12); }
        }
        @keyframes drift2 {
          0%, 100% { transform: translate(8%, 6%) scale(1.05); }
          50% { transform: translate(-6%, -8%) scale(0.95); }
        }
        @keyframes drift3 {
          0%, 100% { transform: translate(0%, 0%) scale(1); }
          50% { transform: translate(4%, -6%) scale(1.08); }
        }
        .aurora-blob { position: absolute; border-radius: 9999px; filter: blur(90px); opacity: 0.55; }
        .aurora-a { width: 620px; height: 620px; left: -120px; top: -160px; background: radial-gradient(circle, #22d3ee, transparent 65%); animation: drift1 22s ease-in-out infinite; }
        .aurora-b { width: 560px; height: 560px; right: -160px; top: 40px; background: radial-gradient(circle, #7c6cf6, transparent 65%); animation: drift2 26s ease-in-out infinite; opacity: 0.35; }
        .aurora-c { width: 480px; height: 480px; left: 30%; bottom: -220px; background: radial-gradient(circle, #0ea5b7, transparent 65%); animation: drift3 30s ease-in-out infinite; opacity: 0.4; }
        @media (prefers-reduced-motion: reduce) {
          .aurora-blob { animation: none !important; }
        }
      `}</style>

      {/* ============================================================ */}
      {/*  NAV                                                          */}
      {/* ============================================================ */}
      <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#05080a]/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2 text-sm text-white/60 transition hover:text-cyan-300">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
          <nav className={` hidden items-center gap-8 text-[11px] uppercase tracking-[0.2em] text-white/45 md:flex`}>
            <a href="#what-is" className="transition hover:text-cyan-300">What it is</a>
            <a href="#features" className="transition hover:text-cyan-300">Features</a>
            <a href="#roadmap" className="transition hover:text-cyan-300">Roadmap</a>
            <a href="#faq" className="transition hover:text-cyan-300">FAQ</a>
          </nav>

        </div>
      </header>

      {/* ============================================================ */}
      {/*  01 · HERO                                                    */}
      {/* ============================================================ */}
      <section ref={heroRef} className="relative overflow-hidden px-6 pb-28 pt-20 md:pt-28">
        {/* <Aurora /> */}
        <Spotlight containerRef={heroRef} />

        <div className="relative mx-auto grid max-w-7xl items-center gap-16 md:grid-cols-2">
          <div>
            <Eyebrow>The campus graph, live</Eyebrow>
            <h1 className={`${display.className} mt-6 text-[2.6rem] font-semibold leading-[1.05] tracking-tight md:text-6xl`}>
              Every campus
              <br />
              <span className="bg-gradient-to-r from-cyan-300 via-cyan-200 to-white bg-clip-text text-transparent">
                is one connection away.
              </span>
            </h1>
            <p className="mt-6 max-w-lg text-[15px] leading-7 text-white/50">
              Social is the connective tissue for student life — messaging, opportunities, mentorship,
              and collaboration, running on a single, quietly encrypted graph instead of a dozen
              disconnected apps.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <button
                onClick={handleGetStarted}
                className="group inline-flex items-center gap-2 rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-black transition hover:bg-cyan-300"
              >
                Get started 
                <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
              <a
                href="#what-is"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm text-white/70 transition hover:border-white/30 hover:text-white"
              >
                See how it works
              </a>
            </div>
          </div>

          {/* <div className="flex justify-center md:justify-end">
            <CampusGlobe />
          </div> */}

          <div className="flex justify-center md:justify-end h-[560px] w-[560px] max-w-full overflow-hidden rounded-3xl drop-shadow-[0_0_45px_rgba(111,166,184,0.3)] transition-shadow hover:drop-shadow-[0_0_65px_rgba(111,166,184,0.45)]">
            <World globeConfig={DARK_GLOBE_CONFIG} data={GLOBE_ARCS} />
          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/*  02 · WHAT IS SOCIAL                                          */}
      {/* ============================================================ */}
      <section id="what-is" className="relative border-t border-white/[0.06] px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <Eyebrow>What is Social</Eyebrow>
            <h2 className={`${display.className} mt-4 max-w-3xl text-3xl font-semibold leading-tight md:text-4xl`}>
              A campus-first network, built around doing — not scrolling.
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-8 md:grid-cols-2">
            <Reveal delay={0.05}>
              <p className="text-[15px] leading-7 text-white/50">
                Unlike platforms built for passive feeds, Social is built around active engagement —
                letting students build, share, and grow together instead of just watching a timeline
                go by.
              </p>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="text-[15px] leading-7 text-white/50">
                It turns a college network into a living ecosystem, where finding a project partner,
                joining a study group, or discovering an internship all happen in the same place —
                without losing the thread.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  03 · FEATURE BENTO                                           */}
      {/* ============================================================ */}
      <section id="features" className="relative border-t border-white/[0.06] px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <Eyebrow>Inside the product</Eyebrow>
            <h2 className={`${display.className} mt-4 max-w-2xl text-3xl font-semibold leading-tight md:text-4xl`}>
              One workspace for the whole social side of campus life.
            </h2>
          </Reveal>

          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-6">
            {/* Encrypted messaging — wide */}
            <Reveal className="md:col-span-4">
              <Bento eyebrow="Messaging" title="Encrypted by default" desc="Hover a line to decrypt it — every message here is protected the same way in the real product.">
                <div className="space-y-2.5">
                  <CipherLine cipher="4f9a::packet / NAV-BUILD" plain="did you build the navbar feature?" />
                  <CipherLine cipher="tx://reply · encrypted_ack" plain="yes — shipped the first pass, looks clean." align="right" />
                  <CipherLine cipher="sec-blob::pr-link-request" plain="great, can you share the PR link?" />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {["Unread sync", "Typing states", "Attachments"].map((t) => (
                    <span key={t} className={` rounded-full border border-white/10 px-3 py-1 text-[10px] uppercase tracking-wide text-cyan-300/70`}>
                      {t}
                    </span>
                  ))}
                </div>
              </Bento>
            </Reveal>

            {/* Network */}
            <Reveal className="md:col-span-2" delay={0.05}>
              <Bento eyebrow="Network" title="Built around who you know" desc="Find people by skill, interest, or project — and see who's active right now.">
                <div className="flex -space-x-3">
                  {["/User-Prof1.png", "/User-Prof2.png", "/User-Prof4.jpeg", "/User-Prof3.png"].map((img, i) => (
                    <img key={i} src={img} alt="" className="h-10 w-10 rounded-full border-2 border-[#0b0f13] object-cover" />
                  ))}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {["Frontend", "Backend", "Design"].map((t) => (
                    <span key={t} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] text-white/60">{t}</span>
                  ))}
                </div>
              </Bento>
            </Reveal>

            {/* Files */}
            <Reveal className="md:col-span-2" delay={0.08}>
              <Bento eyebrow="File sharing" title="Files that stay in context" desc="PDFs, images, and project files with previews and one-tap actions.">
                <div className="space-y-2">
                  {[
                    { Icon: FileText, label: "Assignment 2B.pdf", sub: "Hover to preview" },
                    { Icon: FolderOpen, label: "Project assets.zip", sub: "Shared in discussion" },
                    { Icon: Upload, label: "Screenshot.png", sub: "One-click upload" },
                  ].map(({ Icon, label, sub }) => (
                    <div key={label} className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2">
                      <Icon className="h-4 w-4 shrink-0 text-cyan-300" />
                      <div className="min-w-0">
                        <p className="truncate text-[13px] font-medium text-white/80">{label}</p>
                        <p className="text-[11px] text-white/35">{sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Bento>
            </Reveal>

            {/* Engagement */}
            <Reveal className="md:col-span-2" delay={0.11}>
              <Bento eyebrow="Engagement" title="Feed that feels native" desc="Reactions, comments, and shares built for speed, not distraction.">
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4">
                  <p className="text-[13px] font-medium text-white/75">Sample post preview</p>
                  <p className="mt-1.5 text-[12px] leading-5 text-white/40">Users react, comment, and share directly from the feed without losing context.</p>
                  <div className="mt-3 flex gap-4 text-[11px] text-white/45">
                    <span className="flex items-center gap-1"><Heart className="h-3.5 w-3.5 text-rose-400" /> 12</span>
                    <span className="flex items-center gap-1"><MessageCircle className="h-3.5 w-3.5 text-cyan-300" /> 4</span>
                    <span className="flex items-center gap-1"><SendIcon className="h-3.5 w-3.5" /> Share</span>
                  </div>
                </div>
              </Bento>
            </Reveal>

            {/* Events */}
            <Reveal className="md:col-span-2" delay={0.05}>
              <Bento eyebrow="Events" title="Reminders that actually ping" desc="Meetups, study sessions, and launches, kept on everyone's radar.">
                <div className="space-y-2">
                  <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2">
                    <CalendarDays className="h-4 w-4 text-cyan-300" />
                    <div>
                      <p className="text-[13px] font-medium text-white/80">Hackathon Day</p>
                      <p className="text-[11px] text-white/35">April 10 · 6:00 PM</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2">
                    <Clock3 className="h-4 w-4 text-cyan-300" />
                    <div>
                      <p className="text-[13px] font-medium text-white/80">Reminder scheduled</p>
                      <p className="text-[11px] text-white/35">Auto-ping before it starts</p>
                    </div>
                  </div>
                </div>
              </Bento>
            </Reveal>

            {/* Achievements */}
            <Reveal className="md:col-span-2" delay={0.08}>
              <Bento eyebrow="Progress" title="Milestones worth showing off" desc="Badges and streaks that reward consistency, not noise.">
                <div className="flex flex-wrap gap-2">
                  {["🏆 Top contributor", "🔥 7-day streak", "✅ 100% profile"].map((b) => (
                    <span key={b} className="rounded-xl border border-white/[0.06] bg-white/[0.04] px-3 py-2 text-[12px] text-white/70">{b}</span>
                  ))}
                </div>
              </Bento>
            </Reveal>

            {/* Stories + Notifications combined wide */}
            <Reveal className="md:col-span-6" delay={0.1}>
              <Bento eyebrow="Presence" title="Stories, status, and the alerts that matter" desc="Lightweight updates and notifications tuned to feel calm, not noisy.">
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#0b0f13] bg-white/10 text-white/60">
                      <Plus className="h-4 w-4" />
                    </div>
                    {["/User-Prof4.jpeg", "/User-Prof5.jpg", "/User-Prof6.jpg"].map((img, i) => (
                      <img key={i} src={img} alt="" className="-ml-3 h-12 w-12 rounded-full border-2 border-[#0b0f13] object-cover" style={{ marginLeft: i === 0 ? -12 : -12 }} />
                    ))}
                  </div>
                  <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-2.5">
                    <div className="relative">
                      <Bell className="h-4 w-4 text-cyan-300" />
                      <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-[#0b0f13]" />
                    </div>
                    <div>
                      <p className="text-[13px] font-medium text-white/80">2 unread messages</p>
                      <p className="text-[11px] text-white/35">From your active chat</p>
                    </div>
                  </div>
                </div>
              </Bento>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  04 · NOW / NEXT TIMELINE                                     */}
      {/* ============================================================ */}
      <section id="roadmap" className="relative border-t border-white/[0.06] px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <Eyebrow>Where we are</Eyebrow>
            <h2 className={`${display.className} mt-4 max-w-2xl text-3xl font-semibold leading-tight md:text-4xl`}>
              Two phases: what's shipped, and what's being built next.
            </h2>
          </Reveal>

          <div className="mt-14 grid gap-10 lg:grid-cols-2">
            {/* Phase 01 */}
            <Reveal>
              <div className="flex items-center gap-3">
                <span className={`flex h-8 w-8 items-center justify-center rounded-full border border-cyan-400/40 text-xs text-cyan-300`}>01</span>
                <h3 className={`${display.className} text-xl font-semibold text-white/85`}>Shipped</h3>
              </div>
              <div className="mt-6 space-y-2.5">
                {shipped.map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />
                    <span className="text-[13px] leading-6 text-white/60">{item}</span>
                  </div>
                ))}
              </div>
            </Reveal>

            {/* Phase 02 */}
            <Reveal delay={0.08}>
              <div className="flex items-center gap-3">
                <span className={` flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-xs text-white/60`}>02</span>
                <h3 className={`${display.className} text-xl font-semibold text-white/85`}>Building next</h3>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {roadmap.map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition hover:border-cyan-400/25">
                    <Icon className="h-4 w-4 text-cyan-300" />
                    <p className="mt-2 text-[13px] font-medium text-white/80">{title}</p>
                    <p className="mt-1 text-[12px] leading-5 text-white/40">{desc}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  05 · TESTIMONIALS                                            */}
      {/* ============================================================ */}
      <section className="relative border-t border-white/[0.06] px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <Reveal className="text-center">
            <Eyebrow>Real voices</Eyebrow>
            <h2 className={`${display.className} mt-4 text-3xl font-semibold`}>What people actually say</h2>
          </Reveal>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <Reveal key={t.name} delay={i * 0.06}>
                <div className="h-full rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 text-center transition hover:border-cyan-400/25">
                  <Sparkles className="mx-auto mb-3 h-4 w-4 text-cyan-300" />
                  <p className="text-[13px] italic leading-6 text-white/55">&ldquo;{t.text}&rdquo;</p>
                  <p className="mt-4 text-sm font-medium text-cyan-200">{t.name}</p>
                  <p className="text-[11px] text-white/35">{t.role}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  06 · VISION                                                  */}
      {/* ============================================================ */}
      <section className="relative border-t border-white/[0.06] px-6 py-28">
        <div className="mx-auto max-w-4xl text-center">
          <Reveal>
            <Eyebrow>Our vision</Eyebrow>
            <p className={`${display.className} mt-6 text-2xl font-medium leading-snug text-white/85 md:text-[2rem]`}>
              A campus where connections aren't random but intentional — where students don't just
              scroll, they <span className="text-cyan-300">build, engage, and evolve</span> together.
            </p>
            <p className="mx-auto mt-6 max-w-2xl text-[14px] leading-7 text-white/40">
              We're breaking down the barriers that quietly exist on every campus — between juniors
              and seniors, students and mentors, ideas and execution — by bringing everything into one
              unified, purpose-built space.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  07 · FAQ                                                     */}
      {/* ============================================================ */}
      <section id="faq" className="relative border-t border-white/[0.06] px-6 py-24">
        <div className="mx-auto max-w-3xl">
          <Reveal className="text-center">
            <Eyebrow>Questions</Eyebrow>
            <h2 className={`${display.className} mt-4 text-3xl font-semibold`}>Frequently asked</h2>
            <p className="mt-3 text-sm text-white/40">
              Still curious?{" "}
              <a href="/contact-us" className="text-cyan-300 underline underline-offset-4 hover:text-cyan-200">
                Contact us
              </a>
              .
            </p>
          </Reveal>
          <div className="mt-10 space-y-3">
            {faqs.map((f) => (
              <FaqItem key={f.q} {...f} />
            ))}
          </div>
        </div>
      </section>



      <Footer />
    </div>
  );
}


