"use client";

import Link from "next/link";
import { ArrowLeft, CalendarDays, CircleCheckBig, FileText, Heart, MessageCircle, ShieldCheck, Sparkles, Users, Upload, Bell, Trophy, FolderOpen, Clock3, SendIcon ,Share } from "lucide-react";
import { motion } from "framer-motion";
import { TextRevealCard } from "@/components/ui/text-reveal-card";

function SectionCard({
  title,
  subtitle,
  children,
  className = "",
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`group rounded-3xl border border-cyan-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/80 hover:shadow-[0_16px_40px_rgba(34,211,238,0.18)] ${className}`}
    >
      <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
      <p className="mt-1 text-sm leading-6 text-slate-500">{subtitle}</p>
      <div className="mt-4">{children}</div>
    </div>
  );
}

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.12),transparent_30%),linear-gradient(180deg,#ffffff_0%,#f3fdff_45%,#ffffff_100%)] text-slate-800">
      <header className="p-6 flex items-center gap-3">
        <Link
          href="/"
          className="mt-5 flex items-center gap-2 underline text-cyan-500 transition hover:text-cyan-800"
        >
          <ArrowLeft className="w-5 h-5" /> Back
        </Link>
      </header>

      <main className="px-6 pb-20">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <h1 className="text-3xl font-bold text-black-800 md:text-4xl">
            Why choose Social?
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-500 md:text-base">
            A clean, interactive social workspace for encrypted chat, stronger connections, file sharing,
            events, engagement, and progress tracking.
          </p>
        </div>

        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
          <SectionCard
            title="Encrypted Messaging"
            subtitle="Hover each line to decrypt the payload into a human-readable message."
          >
            <div className="space-y-3 rounded-2xl bg-cyan-50 p-4">
              <TextRevealCard
                variant="received"
                text="4f9a::packet | NAV-BUILD"
                revealText="did you build the navbar feature?"
              />

              <div className="flex justify-end">
                <TextRevealCard
                  variant="sent"
                  text="tx://reply • encrypted_ack"
                  revealText="yes — I shipped the first pass and it looks clean."
                  className="max-w-[88%]"
                />
              </div>

              <TextRevealCard
                variant="received"
                text="sec-blob::pr-link-request"
                revealText="great, can you share the PR link?"
              />
            </div>

            <div className="mt-4 flex flex-wrap gap-2 text-xs text-cyan-700">
              <span className="rounded-full bg-cyan-50 px-3 py-1">Unread sync</span>
              <span className="rounded-full bg-cyan-50 px-3 py-1">Typing states</span>
              <span className="rounded-full bg-cyan-50 px-3 py-1">Attachments</span>
            </div>
          </SectionCard>

          <SectionCard
            title="Build Your Network"
            subtitle="Connect with classmates, developers, and collaborators without losing context."
          >
            <div className="rounded-2xl bg-cyan-50 p-4">
              <div className="flex items-center gap-3">
                {["/User-Prof1.png", "/User-Prof2.png", "/User-Prof4.jpeg", "/User-Prof3.png"].map((img, i) => (
                  <motion.img
                    key={i}
                    src={img}
                    alt="user"
                    className="h-11 w-11 rounded-full border-2 border-white object-cover shadow-sm"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 2.2, delay: i * 0.15 }}
                    style={{ marginLeft: i === 0 ? 0 : -8 }}
                  />
                ))}
              </div>

              <div className="mt-4 space-y-2 text-sm text-slate-600">
                <p>Find people by skills, interests, or projects.</p>
                <p>Track who is active, and ready to collaborate.</p>
              </div>

              <div className="mt-4 flex flex-wrap gap-2 text-xs text-cyan-700">
                <span className="rounded-full bg-white px-3 py-1">Frontend</span>
                <span className="rounded-full bg-white px-3 py-1">Backend</span>
                <span className="rounded-full bg-white px-3 py-1">Design</span>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="Smart File Sharing"
            subtitle="Send PDFs, images, and project files with previews and quick actions."
          >
            <div className="space-y-3 rounded-2xl bg-cyan-50 p-4">
              <div className="flex items-center gap-3 rounded-xl border border-cyan-100 bg-white px-3 py-2">
                <FileText className="h-4 w-4 text-cyan-600" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">Assignment 2B.pdf</p>
                  <p className="text-xs text-slate-400">Hover to preview • Save to notes</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-cyan-100 bg-white px-3 py-2">
                <FolderOpen className="h-4 w-4 text-cyan-600" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">Project assets.zip</p>
                  <p className="text-xs text-slate-400">Shared from post discussion</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-cyan-100 bg-white px-3 py-2">
                <Upload className="h-4 w-4 text-cyan-600" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">Screenshot.png</p>
                  <p className="text-xs text-slate-400">Instant open • One click upload</p>
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="Post Engagement"
            subtitle="Likes, comments, shares, and previews should feel native, fast, and visual."
          >
            <div className="rounded-2xl bg-cyan-50 p-4">
              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <p className="text-sm font-medium text-slate-700">This is a sample post preview.</p>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Users can react, comment, and share directly from the feed without losing context.
                </p>

                <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Heart className="h-3.5 w-3.5 text-rose-500" /> 12 Likes
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="h-3.5 w-3.5 text-cyan-600" /> 4 Comments
                  </span>
                  <span className="flex items-center gap-1">
                    <SendIcon className="h-3.5 w-3.5 text-slate-500" /> Share
                  </span>
                </div>
              </div>

              <div className="mt-3 grid gap-2 text-xs text-slate-500">
                <p>Fast interaction, real-time updates, and smooth preview cards.</p>
                <p>Built for social browsing, not just static content.</p>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="Events & Reminders"
            subtitle="Plan meetups, study sessions, and launches with reminders that keep users on track."
          >
            <div className="space-y-3 rounded-2xl bg-cyan-50 p-4">
              <div className="flex items-center gap-3 rounded-xl bg-white px-3 py-2">
                <CalendarDays className="h-4 w-4 text-cyan-600" />
                <div>
                  <p className="text-sm font-medium">Hackathon Day</p>
                  <p className="text-xs text-slate-400">April 10 • 6:00 PM</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl bg-white px-3 py-2">
                <Clock3 className="h-4 w-4 text-cyan-600" />
                <div>
                  <p className="text-sm font-medium">Reminder scheduled</p>
                  <p className="text-xs text-slate-400">Auto ping before the event starts</p>
                </div>
              </div>

              <p className="text-sm leading-6 text-slate-600">
                Events should feel alive: countdowns, reminders, and fast RSVP flows.
              </p>
            </div>
          </SectionCard>

          <SectionCard
            title="Achievements & Progress"
            subtitle="Show progress, milestones, and brag-worthy wins in a way that feels rewarding."
          >
            <div className="rounded-2xl bg-cyan-50 p-4">
              <div className="flex flex-wrap gap-3">
                <span className="rounded-2xl bg-white px-4 py-3 text-sm shadow-sm">
                  🏆 Top Contributor
                </span>
                <span className="rounded-2xl bg-white px-4 py-3 text-sm shadow-sm">
                  🔥 7-day streak
                </span>
                <span className="rounded-2xl bg-white px-4 py-3 text-sm shadow-sm">
                  ✅ 100% profile
                </span>
              </div>

              <div className="mt-4 space-y-2 text-sm text-slate-600">
                <p>Use badges and milestones to reward consistency.</p>
                <p>Highlight growth without making the UI feel noisy.</p>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="Stories & Status"
            subtitle="Quick updates, story bubbles, and lightweight status indicators keep the app active."
          >
            <div className="rounded-2xl bg-cyan-50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-white bg-gray-400 text-sm font-semibold text-cyan-700 shadow-sm">
                  +
                </div>

                {["/User-Prof4.jpeg", "/User-Prof5.jpg", "/User-Prof6.jpg"].map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt="story"
                    className="h-14 w-14 rounded-full border-2 border-white object-cover shadow-sm"
                    style={{ marginLeft: i === 0 ? 0 : -8 }}
                  />
                ))}
              </div>

              <div className="mt-4 space-y-2 text-sm text-slate-600">
                <p>Add a story, share a status, or post a quick update.</p>
                <p>Perfect for keeping the feed fresh without creating heavy posts.</p>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            title="Notifications"
            subtitle="Cyan badges, live alerts, and smart hover states make important updates easy to notice."
          >

            <div className="space-y-3 rounded-2xl bg-cyan-50 p-4">
              <div className="flex items-center justify-between rounded-xl bg-white px-3 py-2">
              
              <div className="flex items-center gap-3">
      
              {/* THIS IS THE FIX */}
                <div className="relative">
                  <Bell className="h-4 w-4 text-cyan-600" />
                  <span className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-red-500 rounded-full ring-2 ring-white" />
                </div>

              <div>
                <p className="text-sm font-medium">2 unread messages</p>
                <p className="text-xs text-slate-400">From your active chat</p>
              </div>
              </div>
            </div>
            </div>
          </SectionCard>
        </div>
      </main>
    </div>
  );
}

