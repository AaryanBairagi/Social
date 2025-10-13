"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { ArrowLeft, Download, Edit, Trash, X } from "lucide-react";

type Note = {
  _id: string;
  userId: string;
  fileUrl: string;
  description?: string;
  createdAt: string;
  folder?: string; // Add folder property for clarity
};

export default function NotesPage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [notesByFolder, setNotesByFolder] = useState<{ [folder: string]: Note[] }>({});
  const [openFolder, setOpenFolder] = useState<string | null>(null);

  const [editNote , SetEditNote] = useState<Note | null>(null);
  const [editDescription , SetEditDescription] = useState("");
  const [editFolder , SetEditFolder] = useState("");

  const [previewNote , SetPreviewNote] = useState<Note | null>(null);
  const [fileContent, setFileContent] = useState<string>("");

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

        // Group notes by folder
        const grouped = data.reduce((acc: { [folder: string]: Note[] }, note: Note) => {
          const folder = note.folder || "Default";
          if (!acc[folder]) acc[folder] = [];
          acc[folder].push(note);
          return acc;
        }, {});
        setNotesByFolder(grouped);
      } catch (err: any) {
        setError(err.message || "Failed to load notes.");
      } finally {
        setLoading(false);
      }
    }

    fetchNotes();
  }, [isLoaded, isSignedIn, user]);

  useEffect(() => {
  if (previewNote && previewNote.fileUrl.match(/\.(txt|csv)$/i)) {
    fetch(previewNote.fileUrl)
      .then(res => res.text())
      .then(setFileContent)
      .catch(() => setFileContent("Unable to preview this file."));
  } else {
    setFileContent("");
  }
  }, [previewNote]);



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

  // function handleCreateFolder() {
  //   if (!newFolderName.trim()) return;
  //   setNotesByFolder(prev => ({ ...prev, [newFolderName]: [] }));
  //   setNewFolderName("");
  // }

  function openEditModal(note:Note){
    SetEditNote(note);
    SetEditDescription(note.description || "");
    SetEditFolder(note.folder || "");
  }

  async function fetchNotes() {
    setLoading(true);
    setError(null);
      try {
        const res = await fetch(`/api/notes/${user.id}`);
        if (!res.ok) throw new Error("Failed to fetch your notes");
        const data = await res.json();
        setNotes(data);

        // Group notes by folder
        const grouped = data.reduce((acc: { [folder: string]: Note[] }, note: Note) => {
          const folder = note.folder || "Default";
          if (!acc[folder]) acc[folder] = [];
          acc[folder].push(note);
          return acc;
        }, {});
        setNotesByFolder(grouped);
      } catch (err: any) {
        setError(err.message || "Failed to load notes.");
      } finally {
        setLoading(false);
      }
  }


  async function handleEditNote(){
    if(!editNote) return;

    await fetch(`/api/notes/${user.id}/${editNote._id}`,{
      method:"PATCH",
      headers: {"Content-Type" : "application/json"},
      body: JSON.stringify({
        description : editDescription,
        folder : editFolder
      })
    });

    SetEditNote(null);
    SetEditFolder("");
    SetEditDescription("");

    fetchNotes();
  }

  return (
  <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <h1 className="text-3xl font-extrabold text-cyan-700 mb-8 text-center drop-shadow">
      Your Notes
    </h1>
    
    {!openFolder ? (
      // Folder grid view
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 justify-items-center">
        {Object.keys(notesByFolder).map(folder => (
          <button
            key={folder}
            className="flex flex-col items-center focus:outline-none"
            onClick={() => setOpenFolder(folder)}
          >
            <div className="bg-cyan-100 hover:bg-cyan-200 rounded-lg p-6 shadow text-6xl mb-2 transition">
              📁
            </div>
            <div className="text-cyan-700 font-bold mt-1">{folder}</div>
          </button>
        ))}
      </div>
    ) : (
      // Inside a folder: show notes/files
      <div>
        <button
          onClick={() => setOpenFolder(null)}
          className="text-cyan-700 font-bold mb-6 flex items-center gap-1 hover:underline"
        >
          <span> <ArrowLeft size={20} /> </span> Back to Folders
        </button>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(notesByFolder[openFolder] || []).map(note => (
            <div
              key={note._id}
              className="bg-white rounded-xl shadow-lg border border-cyan-200 p-6 flex flex-col hover:shadow-[0_0_15px_rgba(22,210,255,0.5)] transition cursor-pointer"
              // onClick={() => window.open(note.fileUrl, "_blank")}
              onClick={ () => SetPreviewNote(note) }
            >
              <p className="text-gray-800 font-semibold truncate mb-2">{note.description || "No description"}</p>
              <time className="text-xs text-gray-500 mt-auto">
                {new Date(note.createdAt).toLocaleString()}
              </time>

              <div className="flex flex-row items-center gap-3">
              <button
                onClick={e => { 
                  e.stopPropagation();
                  openEditModal(note)
                }}
                className="flex items-center text-cyan-600 underline mt-2"
              >
                <Edit size={20} className="mr-1" /> Edit
              </button>

              <button
                onClick={async e => {
                  e.stopPropagation();
                  if (window.confirm("Delete this note?")){
                  await fetch(`/api/notes/${user.id}/${note._id}`, { method: "DELETE" });
                  fetchNotes(); // Refresh notes on delete
                  }
                }}
                className="flex items-center text-red-600 underline ml-3 mt-2"
              >
                <span> <Trash size={20} className="mr-1" /> </span> Delete
              </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}



    {editNote && (
    <div className="fixed inset-0 bg-white/70 bg-opacity-30 flex items-center justify-center z-50">
      {/* <div className="bg-white p-6 rounded shadow-lg w-full max-w-md"> */}
      <div className="bg-white p-6 rounded-xl border border-cyan-200 shadow-[0_0_25px_rgba(22,210,255,0.5)] ring-2 ring-cyan-300/50 max-w-md w-full transition">
        <h3 className="text-lg font-bold mb-4">Edit Note</h3>
        <input
        value={editDescription}
        onChange={e => SetEditDescription(e.target.value)}
        placeholder="Description"
        className="border px-2 py-1 rounded w-full mb-2"
        />
        <input
        value={editFolder}
        onChange={e => SetEditFolder(e.target.value)}
        placeholder="Folder"
        className="border px-2 py-1 rounded w-full mb-4"
        />
        <div className="flex gap-2">
          <button onClick={handleEditNote} className="bg-cyan-600 text-white px-4 py-1 rounded">
            Save
          </button>
          <button onClick={() => SetEditNote(null)} className="bg-gray-300 px-4 py-1 rounded">
            Cancel
          </button>
        </div>
      </div>
    </div>
    )}

  {previewNote && (
  <div className="fixed inset-0 bg-white/80 bg-opacity-40 flex items-center justify-center z-50">
    {/* <div className="bg-white p-6 rounded shadow-lg w-full max-w-2xl relative"> */}
    <div className="bg-white p-6 max-w-2xl relative rounded-xl border border-cyan-200 shadow-[0_0_25px_rgba(22,210,255,0.5)] ring-2 ring-cyan-300/50 max-w-md w-full transition">
      <button
        onClick={() => SetPreviewNote(null)}
        className="absolute top-2 right-2 text-gray-700 hover:text-red-600"
      >
        <X size={20} />
      </button>
      <h3 className="text-lg font-bold mb-4">{previewNote.description || "File Preview"}</h3>
      {/* Images */}
      {previewNote.fileUrl.match(/\.(jpeg|jpg|png|gif|bmp|webp)$/i) ? (
        <img
          src={previewNote.fileUrl}
          alt={previewNote.description || "Note image"}
          className="rounded-lg object-contain max-h-[60vh] w-full"
        />
      ) : /* PDFs */ previewNote.fileUrl.match(/\.pdf$/i) ? (
        <iframe
          src={previewNote.fileUrl}
          title="PDF Preview"
          className="w-full h-[60vh] rounded"
        />
      ) : /* TXT/CSV */ previewNote.fileUrl.match(/\.(txt|csv)$/i) ? (
        <pre className="max-h-[40vh] overflow-auto p-2 bg-gray-50 text-sm rounded mb-2">{fileContent}</pre>
      ) : /* Word DOCX */ previewNote.fileUrl.match(/\.docx$/i) ? (
        <iframe
          src={`https://docs.google.com/gview?url=${encodeURIComponent(previewNote.fileUrl)}&embedded=true`}
          className="w-full h-[60vh] rounded"
          title="Word Preview"
        />
      ) : (
        <div>
          <p>No preview available for this file type.</p>
        </div>
      )}
      <a
        href={previewNote.fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        download
        className="flex items-center max-w-70 mt-4 bg-cyan-600 text-white px-4 py-1.5 rounded"
      >
        Download / Open in New Tab <span> <Download size={20} className="ml-2" /></span>
      </a>
    </div>
  </div>
  )}

  </main>
);

}