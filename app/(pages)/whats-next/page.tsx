"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Globe,
  Users,
  Briefcase,
  FolderKanban,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { FaInstagram, FaTwitter, FaGithub, FaLinkedin } from "react-icons/fa";

function SectionCard({
  icon: Icon,
  title,
  desc,
}: {
  icon: any;
  title: string;
  desc: string;
}) {
  return (
    <div
      className="
      group bg-white border border-cyan-100 rounded-2xl p-6 text-shadow-md
      transition-all duration-300
      hover:-translate-y-2
      hover:shadow-[0_20px_50px_rgba(34,211,238,0.25)]
      hover:border-cyan-400
      cursor-pointer
      "
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 rounded-lg bg-cyan-50 group-hover:bg-cyan-100 transition">
          <Icon className="text-cyan-600 w-5 h-5" />
        </div>
        <h3 className="font-semibold text-lg text-slate-800">
          {title}
        </h3>
      </div>

      <p className="text-sm text-slate-600 leading-6 group-hover:text-slate-700 transition">
        {desc}
      </p>
    </div>
  );
}

export default function WhatsNextPage() {
  return (
    <>
    <main className="min-h-screen bg-gradient-to-b from-white via-cyan-50 to-white px-6 py-16 text-shadow-md">

      {/* BACK */}
      <div className="max-w-6xl mx-auto mb-10">
        <Link
          href="/"
          className="flex items-center gap-2 text-cyan-600 hover:text-cyan-800 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </Link>
      </div>

      {/* HERO */}
      <section className="max-w-6xl mx-auto mb-16 flex flex-col items-center">
        <h1 className="text-4xl md:text-5xl text-center font-bold text-slate-900">
          The Future of <span className="text-cyan-500">Social</span>
        </h1>

        <p className="mt-4 text-slate-600 text-lg text-center leading-7 max-w-3xl">
          We’re building more than just a platform — we’re building a connected campus ecosystem 
          where collaboration, opportunities, and growth happen seamlessly. Social aims to remove 
          friction from student networking and turn everyday interactions into meaningful progress.
        </p>
      </section>

      {/* WHAT IS SOCIAL */}
      <section className="max-w-6xl mx-auto mb-16">
        <h2 className="text-2xl font-semibold mb-4">
          What is Social?
        </h2>

        <p className="text-slate-600 leading-7 max-w-4xl mb-4">
          Social is a campus-first networking platform designed to bridge the gap between students,
          collaboration, and real-world opportunities. Unlike traditional platforms that focus on
          passive interaction, Social is built around active engagement — enabling students to build,
          share, and grow together.
        </p>

        <p className="text-slate-600 leading-7 max-w-4xl">
          It transforms your college network into a dynamic ecosystem where ideas flow freely,
          connections are meaningful, and opportunities are accessible. Whether it’s finding a
          project partner, joining a study group, or discovering your next internship — everything
          happens in one place.
        </p>
      </section>

      {/* BUILT SO FAR */}
      <section className="max-w-6xl mx-auto mb-20">
        <h2 className="text-2xl font-semibold mb-6">
          What We’ve Built So Far
        </h2>

        <p className="text-slate-600 mb-8 max-w-4xl">
          We’ve already laid the foundation of a powerful campus ecosystem by integrating core
          features that enhance communication, collaboration, and engagement among students.
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          {[
            "Real-time messaging with unread tracking",
            "Post sharing with likes, comments, and interactions",
            "Smart file sharing (notes, PDFs, project assets)",
            "Events & reminders for campus activities",
            "Stories and engagement features",
            "Notifications with real-time updates",
            "Achievements and progress tracking",
          ].map((item, i) => (
            <div
              key={i}
              className="
              bg-white border border-cyan-100 rounded-xl px-5 py-3
              transition-all duration-300
              hover:shadow-md hover:border-cyan-300
              hover:translate-x-1
              "
            >
              {item}
            </div>
          ))}
        </div>
      </section>

      {/* WHAT'S NEXT */}
      <section className="max-w-6xl mx-auto mb-20">
        <h2 className="text-2xl font-semibold mb-10">
          What’s Next
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          <SectionCard
            icon={Globe}
            title="Scaling Across Campuses"
            desc="Expanding Social across multiple colleges to create a unified student network where collaboration is not limited by geography."
          />

          <SectionCard
            icon={Users}
            title="Community Ecosystem"
            desc="Building interest-based communities that enable focused discussions, teamwork, and long-term collaboration."
          />

          <SectionCard
            icon={Briefcase}
            title="Opportunities Hub"
            desc="A centralized platform for internships, hackathons, and career opportunities curated specifically for students."
          />

          <SectionCard
            icon={FolderKanban}
            title="Project Showcasing"
            desc="Transforming profiles into portfolios where students can showcase work, gain visibility, and collaborate."
          />

          <SectionCard
            icon={GraduationCap}
            title="Mentor & Alumni Access"
            desc="Connecting students with alumni and mentors for guidance, insights, and career growth."
          />

          <SectionCard
            icon={Sparkles}
            title="Smart Networking"
            desc="Using intelligent recommendations to connect users with relevant people, communities, and opportunities."
          />

        </div>
      </section>

      {/* VISION */}
      <section className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">
          Our Vision
        </h2>

        <div className="text-slate-600 leading-7 max-w-4xl space-y-4">

  <p>
    Our goal is to redefine how students connect, collaborate, and grow in a rapidly evolving academic and professional landscape. Social is not just another platform — it’s a purpose-built ecosystem designed to transform everyday student interactions into meaningful opportunities.
  </p>

  <p>
    We aim to break down the barriers that often exist within campuses — between juniors and seniors, students and mentors, and even between ideas and execution. By bringing everything into one unified space, Social enables seamless communication, smarter networking, and real-time collaboration.
  </p>

  <p>
    Whether it’s finding the right people for a project, discovering opportunities like internships and hackathons, sharing knowledge, or simply building a strong peer network — every interaction on Social is designed to add value.
  </p>

  <p>
    We envision a campus where connections are not random but intentional, where collaboration is effortless, and where growth is continuous. A space where students don’t just scroll — they build, engage, and evolve together.
  </p>

  <p>
    Social is the foundation of that future — a smarter, more connected campus ecosystem where every connection creates opportunity, and every opportunity drives progress.
  </p>

</div>
      </section>

    </main>

  <div className="bg-black border-t border-cyan-400">

  <section className="w-full text-white mt-5  bg-black backdrop-blur-md">

  {/* TOP ROW */}
  <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row justify-between items-center gap-8">

    {/* LEFT */}
    <div className="text-center md:text-left">
      <h2 className="text-xl font-bold text-white/80">Social</h2>
      <p className="text-sm text-white/80 mt-1">
        Connect. Collaborate. Grow within your campus.
      </p>
    </div>

    {/* RIGHT */}
    <div className="flex gap-6 text-sm text-white/80">
      <a href="/features" className="hover:text-cyan-400 transition">Features</a>
      <a href="/contact-us" className="hover:text-cyan-400 transition">Contact</a>
      <a href="/learn-more" className="hover:text-cyan-400 transition">About</a>
    </div>

  </div>

  {/* SOCIAL ROW — EXACT SAME STYLE AS YOUR PAGE */}
  <div className="flex items-center justify-center gap-6 pb-8">
    <span className="text-white/70">Follow Us : </span>
    <a href="https://github.com/AaryanBairagi" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-white hover:bg-cyan-100 transition shadow-sm hover:shadow-md">
      <FaGithub className="w-5 h-5 text-zinc-700" />
    </a>

    <a href="https://www.linkedin.com/in/aaryan-bairagi-183249249/" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-white hover:bg-cyan-100 transition shadow-sm hover:shadow-md">
      <FaLinkedin className="w-5 h-5 text-blue-500" />
    </a>

    <a href="https://x.com/aaryanb4real" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-white hover:bg-cyan-100 transition shadow-sm hover:shadow-md">
      <FaTwitter className="w-5 h-5 text-gray-700" />
    </a>

    <a href="https://www.instagram.com/aaryanb4real/" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-white hover:bg-cyan-100 transition shadow-sm hover:shadow-md">
      <FaInstagram className="w-5 h-5 text-pink-600" />
    </a>

  </div>
  </section>
  <hr className="border-0.5 border-white/60 border-t" />
  {/* BOTTOM */}
  <footer className="text-center py-10 text-sm text-white hover:text-white/90">

    <div>
      © {new Date().getFullYear()} Social · All Rights Reserved
    </div>

    <div className="mt-1">
      Made with <span className="text-red-500">❤️</span> by{" "}
      <span className="font-medium text-cyan-400">
        Aaryan Bairagi
      </span>
    </div>

  </footer>

    </div>

    </>
  );
}