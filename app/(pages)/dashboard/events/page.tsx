"use client";

import { useEffect, useState } from "react";
import SectionHeader from "@/global/SectionHeader";
import { CalendarDays } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import Posts from "../_components/Posts";

export default function EventsPage() {
  const { user } = useUser();
  const [events, setEvents] = useState([]);
  const [mongoId, setMongoId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    fetch(`/api/user/profile?clerkId=${user.id}`)
      .then(res => res.json())
      .then(data => {
        if (data._id) setMongoId(data._id);
      });
  }, [user]);

  useEffect(() => {
    if (!mongoId) return;

    fetch("/api/events/my")
      .then(res => res.json())
      .then(data => {
        setEvents(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [mongoId]);

  if (loading) {
    return (
      <div className="flex flex-row justify-center items-center py-10 gap-4 mt-10">
        <p className="text-gray-400">Loading Events</p>
        <svg className="animate-spin h-10 w-10 text-cyan-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4}></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
        </svg>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4">

      {/* HEADER */}
      <SectionHeader
        title="My Events"
        icon={<CalendarDays className="w-7 h-7" />}
      />

      {/* EVENTS */}
      {events.length === 0 ? (
        <p className="text-center text-gray-500 mt-6">
          No saved events yet.
        </p>
      ) : (
        <Posts
          currentUserId={mongoId}
          mode="feed"
          initialPosts={events} 
        />
      )}

    </div>
  );
}