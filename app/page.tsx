// pages/index.tsx
"use client"
import React, { useState } from 'react';

const Navbar: React.FC = () => (
  <nav style={{ background: '#0D3B66', padding: '1rem 2rem', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <div style={{ fontWeight: '700', fontSize: '1.5rem' }}>ModNect</div>
    <ul style={{ listStyle: 'none', display: 'flex', gap: '1.5rem', margin: 0 }}>
      <li><a href="#" style={{ color: 'white', textDecoration: 'none' }}>About Us</a></li>
    </ul>
  </nav>
);

const Sidebar: React.FC<{ selected: string; setSelected: (page: string) => void }> = ({ selected, setSelected }) => (
  <aside style={{ background: '#1CA9C9', width: '220px', minHeight: 'calc(100vh - 60px)', padding: '2rem', color: 'white' }}>
    <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {['Dashboard', 'Posts', 'Connections', 'Events', 'Profile'].map((item) => (
        <li 
          key={item} 
          onClick={() => setSelected(item)} 
          style={{ 
            cursor: 'pointer', 
            fontWeight: selected === item ? '700' : '400', 
            borderLeft: selected === item ? '4px solid white' : 'none', 
            paddingLeft: '0.5rem',
            userSelect: 'none'
          }}
        >
          {item}
        </li>
      ))}
    </ul>
  </aside>
);

const Home: React.FC = () => {
  const [selectedPage, setSelectedPage] = useState('Dashboard');

  return (
    <>
      <Navbar />
      <div style={{ display: 'flex' }}>
        <Sidebar selected={selectedPage} setSelected={setSelectedPage} />
        <main style={{ flexGrow: 1, padding: '3rem', background: 'linear-gradient(135deg, #0D3B66, #1CA9C9)', color: 'white', minHeight: 'calc(100vh - 60px)' }}>
          <h1>{selectedPage}</h1>
          {selectedPage === 'Dashboard' && (
            <>
              <p>Welcome to ModNect - Connecting Modern College of Engineering Alumni & Students</p>
              <button style={{
                background: '#fff',
                color: '#0D3B66',
                padding: '1rem 2rem',
                border: 'none',
                borderRadius: '40px',
                fontWeight: '700',
                fontSize: '1.1rem',
                cursor: 'pointer',
                marginTop: '1.5rem',
              }}>Join Now</button>
              <section style={{ display: 'flex', justifyContent: 'center', gap: '3rem', marginTop: '4rem', color: '#fff', textAlign: 'center' }}>
                <div style={{ maxWidth: '300px' }}>
                  <h3>Mentorship</h3>
                  <p>Connect with experienced alumni for guidance.</p>
                </div>
                <div style={{ maxWidth: '300px' }}>
                  <h3>Resource Sharing</h3>
                  <p>Access study materials and collaborate easily.</p>
                </div>
                <div style={{ maxWidth: '300px' }}>
                  <h3>Events</h3>
                  <p>Stay updated on alumni meetups and webinars.</p>
                </div>
              </section>
            </>
          )}
          {/* Add placeholders for other pages if desired */}
          {(selectedPage !== 'Dashboard') && <p>Content for {selectedPage} page is under development.</p>}
        </main>
      </div>
      <footer style={{ background: 'rgba(255 255 255 / 0.1)', color: 'white', textAlign: 'center', padding: '2rem' }}>
        &copy; 2025 Progressive Education Societys Modern College of Engineering
      </footer>
    </>
  );
};

export default Home;







// import Image from "next/image";

// export default function Home() {
//   return (
//     <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
//       <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
//         <Image
//           className="dark:invert"
//           src="/next.svg"
//           alt="Next.js logo"
//           width={180}
//           height={38}
//           priority
//         />
//         <ol className="font-mono list-inside list-decimal text-sm/6 text-center sm:text-left">
//           <li className="mb-2 tracking-[-.01em]">
//             Get started by editing{" "}
//             <code className="bg-black/[.05] dark:bg-white/[.06] font-mono font-semibold px-1 py-0.5 rounded">
//               app/page.tsx
//             </code>
//             .
//           </li>
//           <li className="tracking-[-.01em]">
//             Save and see your changes instantly.
//           </li>
//         </ol>

//         <div className="flex gap-4 items-center flex-col sm:flex-row">
//           <a
//             className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
//             href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <Image
//               className="dark:invert"
//               src="/vercel.svg"
//               alt="Vercel logomark"
//               width={20}
//               height={20}
//             />
//             Deploy now
//           </a>
//           <a
//             className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
//             href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             Read our docs
//           </a>
//         </div>
//       </main>
//       <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
//         <a
//           className="flex items-center gap-2 hover:underline hover:underline-offset-4"
//           href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <Image
//             aria-hidden
//             src="/file.svg"
//             alt="File icon"
//             width={16}
//             height={16}
//           />
//           Learn
//         </a>
//         <a
//           className="flex items-center gap-2 hover:underline hover:underline-offset-4"
//           href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <Image
//             aria-hidden
//             src="/window.svg"
//             alt="Window icon"
//             width={16}
//             height={16}
//           />
//           Examples
//         </a>
//         <a
//           className="flex items-center gap-2 hover:underline hover:underline-offset-4"
//           href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <Image
//             aria-hidden
//             src="/globe.svg"
//             alt="Globe icon"
//             width={16}
//             height={16}
//           />
//           Go to nextjs.org →
//         </a>
//       </footer>
//     </div>
//   );
// }
