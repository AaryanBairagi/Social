"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { ArrowLeft, Edit, Trash } from "lucide-react";

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
  const [newFolderName, setNewFolderName] = useState("");
  const [openFolder, setOpenFolder] = useState<string | null>(null);

  const [editNote , SetEditNote] = useState<Note | null>(null);
  const [editDescription , SetEditDescription] = useState("");
  const [editFolder , SetEditFolder] = useState("");

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



//   return (
//     <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
//       <h1 className="text-3xl font-extrabold text-cyan-700 mb-8 text-center drop-shadow">
//         Your Notes
//       </h1>

//       <div className="mb-6 flex gap-2">
//         <input
//           value={newFolderName}
//           onChange={e => setNewFolderName(e.target.value)}
//           placeholder="New folder name"
//           className="border px-2 py-1 rounded"
//         />
//         <button
//           onClick={handleCreateFolder}
//           className="bg-cyan-600 text-white px-4 py-1 rounded"
//         >
//           Create Folder
//         </button>
//       </div>

//       {Object.entries(notesByFolder).map(([folder, notes]) => (
//         <section key={folder} className="mb-10">
//           <h2 className="text-xl font-bold text-cyan-600 mb-4">{folder}</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {notes.map(note => (
//               <div
//                 key={note._id}
//                 className="bg-white rounded-xl shadow-lg border border-cyan-200 p-6 flex flex-col hover:shadow-[0_0_15px_rgba(22,210,255,0.5)] transition cursor-pointer"
//                 onClick={() => window.open(note.fileUrl, "_blank")}
//                 tabIndex={0}
//                 role="button"
//                 aria-label={`Open note file ${note.description || ""}`}
//               >
//                 {note.fileUrl.match(/\.(jpeg|jpg|png|gif|bmp|webp)$/i) ? (
//                   <img
//                     src={note.fileUrl}
//                     alt={note.description || "Note image"}
//                     className="rounded-lg mb-4 object-contain max-h-48 w-full"
//                     loading="lazy"
//                   />
//                 ) : (
//                   <div className="flex items-center justify-center bg-cyan-100 rounded-lg mb-4 text-cyan-600 font-semibold h-48">
//                     <p className="select-text break-words">{note.description || "File"}</p>
//                   </div>
//                 )}
//                 <p className="text-gray-800 font-semibold truncate">{note.description || "No description"}</p>
//                 <time className="mt-auto text-xs text-gray-500">
//                   {new Date(note.createdAt).toLocaleString()}
//                 </time>
//               </div>
//             ))}
//           </div>
//         </section>
//       ))}
//     </main>
//   );
// }

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
              onClick={() => window.open(note.fileUrl, "_blank")}
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
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
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

  </main>
);

}