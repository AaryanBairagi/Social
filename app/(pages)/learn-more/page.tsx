"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  GraduationCap,
  Users,
  Briefcase,
  MessageCircle,
  Sparkles,
  ArrowLeft,
  SendIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaInstagram, FaTwitter, FaGithub, FaLinkedin } from "react-icons/fa";


function Card({ icon: Icon, title, desc }: any) {
  return (
    <div
      className="
      group bg-white border border-cyan-100 rounded-3xl p-6 
      shadow-sm transition-all duration-300
      hover:-translate-y-1
      hover:border-cyan-400
      hover:shadow-[0_16px_40px_rgba(34,211,238,0.18)]
      "
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 rounded-xl bg-cyan-50 group-hover:bg-cyan-100 transition">
          <Icon className="text-cyan-600 w-5 h-5" />
        </div>
        <h2 className="font-semibold text-lg text-gray-800">{title}</h2>
      </div>

      <p className="text-sm text-gray-600 leading-6">{desc}</p>
    </div>
  );
}

export default function LearnMore() {
  const router = useRouter();
  const { loading, isAuthenticated } = useAuth();

  const handleGetStartedNow = () => {
    if (loading) return;

    if (!isAuthenticated) {
      router.push("/sign-up");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <>
    <main className="min-h-screen text-shadow bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.18),transparent_30%),linear-gradient(180deg,#ffffff_0%,#e6fbff_45%,#ffffff_100%)] px-6 pb-10">
      {/* BACK */}
      <header className="p-6 flex items-center gap-3">
        <Link
          href="/"
          className="flex items-center gap-2 mt-5 underline text-cyan-500 hover:text-cyan-800 transition"
        >
          <ArrowLeft className="w-5 h-5" /> Back
        </Link>
      </header>

      {/* HERO */}
      <section className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
          Discover How Social{" "}
          <span className="text-cyan-500">Transforms Campus Life</span>
        </h1>

        <p className="mt-4 text-gray-600 text-lg leading-7 max-w-2xl mx-auto">
          Social empowers you to connect, collaborate, and seize every campus opportunity.
          From networking to real-time communication, everything is designed to feel seamless,
          modern, and actually useful.
        </p>
      </section>

      {/* FEATURES GRID */}
      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">

        <Card
          icon={Users}
          title="Build Meaningful Connections"
          desc="Find classmates, seniors, and mentors. Grow your network, join discussions, and explore shared interests in a safe and verified student ecosystem."
        />

        <Card
          icon={Briefcase}
          title="Unlock Campus Opportunities"
          desc="Discover internships, workshops, and curated events. Social connects you with opportunities that actually matter for your academic and career growth."
        />

        <Card
          icon={MessageCircle}
          title="Real-Time Collaboration"
          desc="Create study groups, share notes, and collaborate instantly. Messaging, file sharing, and updates happen in real time without friction."
        />

        <Card
          icon={GraduationCap}
          title="Mentors & Alumni Access"
          desc="Learn directly from seniors and alumni. Get guidance, referrals, and insights that help you move faster and smarter."
        />

        <Card
          icon={Sparkles}
          title="Engaging Social Experience"
          desc="Interact with posts, stories, and communities. Stay updated while actually enjoying the experience — not just scrolling endlessly."
        />

        <Card
          icon={SendIcon}
          title="Smart Communication System"
          desc="Unread tracking, notifications, and smooth UI ensure you never miss important conversations while avoiding unnecessary noise."
        />
      </section>

      {/* TESTIMONIALS */}
      <section className="max-w-5xl mx-auto mb-20">
        <h3 className="text-2xl font-bold text-center mb-8">
          Real Voices, Real Impact
        </h3>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              text: "I met my project team and landed an internship thanks to Social's networking tools.",
              name: "Aayushi K., Class of 2025",
            },
            {
              text: "Managing a college club has never been easier. Everything feels connected.",
              name: "Neeraj S., Club President",
            },
            {
              text: "It brings students, mentors, and alumni into one trusted space.",
              name: "Prof. Mehta, Mentor",
            },
          ].map((t, i) => (
            <div
              key={i}
              className="
              bg-white rounded-2xl p-5 border border-cyan-100 
              shadow-sm text-center transition
              hover:border-cyan-400
              hover:shadow-[0_12px_30px_rgba(34,211,238,0.15)]
              "
            >
              <Sparkles className="text-cyan-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600 italic">{t.text}</p>
              <p className="mt-3 text-cyan-700 font-medium text-sm">
                {t.name}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto text-center">
        <div
          className="
          bg-white border border-cyan-200 rounded-3xl p-10 
          shadow-sm transition
          hover:shadow-[0_16px_40px_rgba(34,211,238,0.2)]
          "
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            Ready to Accelerate Your Campus Journey?
          </h3>

          <p className="text-gray-600 mb-6">
            Join a thriving student network where collaboration, growth,
            and opportunities are just one click away.
          </p>

          <Button
            onClick={handleGetStartedNow}
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-3 rounded-full shadow-md"
          >
            Get Started Now
          </Button>
        </div>
      </section>

    {/* FAQ SECTION */}
    <section className="max-w-4xl mx-auto mt-24 mb-20">
      <h3 className="text-2xl font-bold text-center">
        Frequently Asked Questions
     </h3>
     <p className="text-center text-md text-gray-400 mb-5">
        We are here to help you with any questions you may have. <br /> 
        If you don't find what you need, please contact us. <a href="/contact-us" className="text-cyan-600 hover:text-cyan-800"> Contact Us</a> </p>     

   
    <div className="space-y-4">
    {[
      {
        q: "What is Social?",
        a: "Social is a campus-focused platform that helps students connect, collaborate, and discover opportunities in one place.",
      },
      {
        q: "Is Social only for students?",
        a: "Primarily yes, but mentors, alumni, and clubs can also join to guide and collaborate with students.",
      },
      {
        q: "Is my data secure?",
        a: "Yes. We focus on privacy-first design with secure authentication and encrypted communication.",
      },
      {
        q: "Can I use Social for projects and groups?",
        a: "Absolutely. You can create groups, share files, and collaborate in real time.",
      },
    ].map((item, i) => (
      <details
        key={i}
        className="
        group bg-white border border-cyan-100 rounded-xl p-4
        transition hover:border-cyan-400
        hover:shadow-[0_10px_25px_rgba(34,211,238,0.15)]
        "
      >
        <summary className="cursor-pointer font-medium text-gray-800 flex justify-between items-center">
          {item.q}
          <span className="text-cyan-500 group-open:rotate-45 transition">
            +
          </span>
        </summary>

        <p className="mt-3 text-sm text-gray-600 leading-6">
          {item.a}
        </p>
      </details>
        ))}
        </div>
    </section>

    </main>
    
  <hr className="border border-cyan-400"/>
        
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
      Made with <span className="text-cyan-500">🩵</span> by{" "}
      <span className="font-medium text-cyan-400">
        Aaryan Bairagi
      </span>
    </div>

  </footer>

    </div>

    </>
  );
}

