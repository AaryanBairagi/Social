"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

type Note = {
  _id: string;
  userId: string;
  fileUrl: string;
  description?: string;
  createdAt: string;
};

export default function NotesPage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;

    async function fetchNotes() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/notes/${user.id}`);
        if (!res.ok) throw new Error("Failed to fetch your notes");
        const data = await res.json();
        setNotes(data);
      } catch (err: any) {
        setError(err.message || "Failed to load notes.");
      } finally {
        setLoading(false);
      }
    }

    fetchNotes();
  }, [isLoaded, isSignedIn, user]);

  if (!isSignedIn) {
    return (
      <div className="text-center text-red-600 mt-20 font-semibold">
        Please sign in to view your notes.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        {/* Loading Spinner */}
        <svg className="animate-spin h-12 w-12 text-cyan-600" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4} />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto p-6 bg-red-100 text-red-700 rounded-lg mt-8 text-center font-semibold">
        {error}
      </div>
    );
  }

  if (!notes.length) {
    return (
      <div className="max-w-xl mx-auto p-10 bg-white rounded-xl shadow-md mt-12 text-center text-gray-600 select-none">
        <p className="text-lg mb-4">You don't have any notes yet.</p>
        <p className="text-sm">Download files or upload content to add notes here.</p>
      </div>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-extrabold text-cyan-700 mb-8 text-center drop-shadow">
        Your Notes
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes.map(note => (
          <div
            key={note._id}
            className="bg-white rounded-xl shadow-lg border border-cyan-200 p-6 flex flex-col hover:shadow-[0_0_15px_rgba(22,210,255,0.5)] transition cursor-pointer"
            onClick={() => window.open(note.fileUrl, "_blank")}
            tabIndex={0}
            role="button"
            aria-label={`Open note file ${note.description || ""}`}
          >
            {note.fileUrl.match(/\.(jpeg|jpg|png|gif|bmp|webp)$/i) ? (
              <img
                src={note.fileUrl}
                alt={note.description || "Note image"}
                className="rounded-lg mb-4 object-contain max-h-48 w-full"
                loading="lazy"
              />
            ) : (
              <div className="flex items-center justify-center bg-cyan-100 rounded-lg mb-4 text-cyan-600 font-semibold h-48">
                <p className="select-text break-words">{note.description || "File"}</p>
              </div>
            )}

            <p className="text-gray-800 font-semibold truncate">{note.description || "No description"}</p>
            <time className="mt-auto text-xs text-gray-500">
              {new Date(note.createdAt).toLocaleString()}
            </time>
          </div>
        ))}
      </div>
    </main>
  );
}
