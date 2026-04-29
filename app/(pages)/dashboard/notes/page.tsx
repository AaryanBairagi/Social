"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { ArrowLeft, Download, Edit, Trash, X } from "lucide-react";
import SectionHeader from "@/global/SectionHeader";
import { FileText } from "lucide-react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import { Worker } from "@react-pdf-viewer/core";
import dynamic from "next/dynamic";

const Viewer = dynamic(
  () => import("@react-pdf-viewer/core").then(mod => mod.Viewer),
  { ssr: false }
);

import "@react-pdf-viewer/core/lib/styles/index.css";

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
  const [mounted , setMounted] = useState(false);
  const [notesByFolder, setNotesByFolder] = useState<{ [folder: string]: Note[] }>({});
  const [openFolder, setOpenFolder] = useState<string | null>(null);
  const [deleteNoteId , setDeleteNoteId] = useState<string | null>(null);
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
        const res = await fetch(`/api/notes/${user?.id}`);
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

  useEffect(()=>{
    setMounted(true);
  },[]);

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


  function openEditModal(note:Note){
    SetEditNote(note);
    SetEditDescription(note.description || "");
    SetEditFolder(note.folder || "");
  }

  async function fetchNotes() {
    setLoading(true);
    setError(null);
      try {
        const res = await fetch(`/api/notes/${user?.id}`);
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
    try{ 
    if(!editNote) return;

    await fetch(`/api/notes/${user?.id}/${editNote._id}`,{
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
    toast.success("Note updated" , {
      description : "Your note has been updated successfully"
    });

  }catch(err){
    console.log(err);
    toast.error("Failed to update note. Please try again.");
  }
  }

  return (
  <main className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <SectionHeader
      title="My Notes"
      icon={<FileText className="w-7 h-7" />}
    />
    
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
                  setDeleteNoteId(note._id);
                  }
                }
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
      <div className="bg-white p-6 rounded-xl border border-cyan-200 shadow-[0_0_25px_rgba(22,210,255,0.5)] ring-2 ring-cyan-300/50 max-w-md w-full transition">
        <h3 className="text-lg font-bold mb-4">Edit Note</h3>
        <div className="space-y-4">
          <div>
          <label className="text-sm text-gray-600 font-medium">Description : </label>
          <input
          value={editDescription}
          onChange={e => SetEditDescription(e.target.value)}
          placeholder="Description"
          className="border px-2 py-1 rounded w-full mb-2"
          />
          </div>
          <div> 
          <label className="text-sm font-medium text-gray-600">Folder Name : </label>
          <input
            value={editFolder}
            onChange={e => SetEditFolder(e.target.value)}
            placeholder="Folder"
            className="border px-2 py-1 rounded w-full mb-4"
          />
          </div>
        <div className="flex gap-2">
          <button onClick={handleEditNote} className="bg-cyan-600 hover:bg-cyan-800 text-white/90 hover:text-white  px-4 py-2 rounded-md transition">
            Save
          </button>
          <button onClick={() => SetEditNote(null)} className="bg-black/90 hover:bg-black/70 text-white/70 hover:text-white/90 transition px-4 py-2 rounded-md">
            Cancel
          </button>
        </div>
        </div>
      </div>
    </div>
    )}


    {deleteNoteId && (
    <div className="fixed top-10 inset-0 flex items-center justify-center z-50">

    <div className="bg-white p-6 rounded-xl w-full max-w-md border border-cyan-200 shadow-[0_0_25px_rgba(22,210,255,0.5)] ring-2 ring-cyan-300/50">

      <h3 className="text-lg font-semibold mb-2">
        Delete this note?
      </h3>

      <p className="text-gray-500 mb-4">
        This action cannot be undone.
      </p>

      <div className="flex justify-end gap-2">

        <button
          onClick={() => setDeleteNoteId(null)}
          className="px-4 py-2 bg-black/90 text-gray-200 hover:bg-black/70 hover:text-white rounded-xl"
        >
          Cancel
        </button>

        <button
          onClick={async () => {
            await fetch(`/api/notes/${user.id}/${deleteNoteId}`, {
              method: "DELETE",
            });

            setDeleteNoteId(null);
            fetchNotes();

            toast.success("Note deleted", {
              description: "Your note has been removed",
            });
          }}
          className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700"
        >
          Delete
        </button>

      </div>
    </div>
  </div>
  )}

  {mounted && previewNote && createPortal(
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[200]">

    <div className="relative w-[90vw] h-[90vh] bg-white rounded-xl shadow-2xl flex flex-col overflow-auto">

      {/* HEADER */}
      <div className="flex justify-between items-center p-4 border-b">
        <h3 className="font-semibold">
          {previewNote.description || "File Preview"}
        </h3>

        <button
          onClick={() => SetPreviewNote(null)}
          className="bg-black/90 hover:bg-black/70 rounded-full text-white hover:text-white/80 p-3 transition"
        >
          <X size={14} />
        </button>
      </div>

      {/* CONTENT */}
      <div className="flex-1 flex items-center justify-center bg-gray-100">

        { previewNote.fileUrl.match(/\.(jpeg|jpg|png|gif|bmp|webp)$/i) ? (
          <img
            src={previewNote.fileUrl}
            className="max-h-full max-w-full object-contain"
          />
        ) : 
         previewNote.fileUrl.match(/\.(txt|csv)$/i) ? (
          <pre className="max-h-full overflow-auto p-4">
            {fileContent}
          </pre>
        ) :  previewNote.fileUrl.includes("raw") ? (
          <>
            <div className="w-full h-full overflow-auto flex flex-col items-center">
              <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
              <Viewer
                fileUrl={`/api/pdf?url=${encodeURIComponent(previewNote.fileUrl)}`} 
                defaultScale={1.0}
                theme="light"
                plugins={[]}
              />
              </Worker>
            </div> 
          </>
        ) 
        : 
        (
          <p>No preview available</p>
        ) 
        }

      </div>

      {/* FOOTER */}
      <div className="p-4 border-t flex justify-end">
        <a
          href={previewNote.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center bg-cyan-600 hover:bg-cyan-800 text-white hover:text-white/80 px-4 py-2 rounded-xl"
        >
          Download / Open in New Tab <span> <Download size={20} className="ml-2" /> </span>
        </a>
      </div>

    </div>
  </div> , 
  document.body
)}

  </main>
);

}