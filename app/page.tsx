"use client";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LayoutGrid,Headset,LogIn,InfoIcon,Users2,BookOpenCheck,CalendarDays,Mail,ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

const World = dynamic(() => import("@/components/ui/globe").then((mod) => mod.World), {
  ssr: false,
});

const FEATURES = [
  {
    title: "Build Connections",
    desc: "Make meaningful relationships with classmates, seniors, and mentors in your college.",
    icon: Users2,
  },
  {
    title: "Collaborate & Study",
    desc: "Form study groups, share notes, and work together on assignments and projects.",
    icon: BookOpenCheck,
  },
  {
    title: "Campus Opportunities",
    desc: "Discover internships, workshops, and events happening right on your campus.",
    icon: CalendarDays,
  },
];



export default function LandingPage() {
  const router = useRouter();
  const { isLoaded , isSignedIn} = useUser();
  const handleGetStarted = ()=>{
    if(!isLoaded) return;

    if(isSignedIn){
      router.push("/dashboard");
    }else{
      router.push("/sign-up");
    }
  }

  const handleLogin = ()=>{
    if(!isLoaded) return;

    if(isSignedIn){
      router.push("/dashboard");
    }else{
      router.push("/sign-in");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EAF9FF] to-[#CFFAFE] flex flex-col">
      {/* Navigation */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-4 justify-start">
              <Image
                src="/ModNectLogo.png"
                alt="ModNect Logo"
                width={40}
                height={40}
                className="drop-shadow-md"
              />
              <span className="text-2xl font-bold text-black/90 tracking-wide drop-shadow-lg">ModNect</span>
            </div>
            <div className="flex items-center space-x-6 text-cyan-600">
              <Link href="/features" passHref>
                <button className="group relative flex items-center gap-2 px-4 py-2 rounded-xl border border-cyan-300 hover:border-cyan-500 hover:shadow-[0_0_12px_#22d3ee] focus:outline-none focus:ring-2 focus:ring-cyan-400 transition bg-white group-hover:drop-shadow-lg">
                  <LayoutGrid className="w-5 h-5 transition-all group-hover:text-cyan-400 group-hover:scale-110" />
                  Features
                </button>
              </Link>
              <Link href="/contact" passHref>
                <button className="group relative flex items-center gap-2 px-4 py-2 rounded-xl border border-cyan-300 hover:border-cyan-500 hover:shadow-[0_0_12px_#22d3ee] focus:outline-none focus:ring-2 focus:ring-cyan-400 transition bg-white group-hover:drop-shadow-lg">
                  <Headset className="w-5 h-5 transition-all group-hover:text-cyan-400 group-hover:scale-110" />
                  Contact Us
                </button>
              </Link>
              <Button onClick={handleLogin} className="group flex items-center gap-2 px-6 py-2 rounded-xl bg-cyan-500 text-white shadow-md hover:bg-cyan-600 hover:shadow-[0_0_15px_#22d3ee] focus:outline-none focus:ring-4 focus:ring-cyan-400 transition transform hover:scale-105">
                Login
                  <LogIn className="w-5 h-5 transition-all group-hover:text-cyan-200 group-hover:scale-110" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 py-20 flex-grow flex flex-col items-center">
        <div className="text-center max-w-3xl mb-12">
          <h1 className="text-5xl font-extrabold text-gray-900 sm:text-6xl mb-4 leading-tight drop-shadow-lg">
            Connect. Share. Grow.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600 drop-shadow-lg">
              Within Campus.
            </span>
          </h1>
          <p className="text-xl text-gray-700 mb-8 drop-shadow-sm">
            ModNect is your college networking platform to connect with peers, seniors, and professors.
            Collaborate on projects, find study groups, and unlock campus opportunities.   Discover new learning avenues, participate in campus events, and grow your skills
            with the support of a vibrant student community.
          </p>
          <div className="flex items-center gap-4 justify-center">
              <Button onClick={handleGetStarted} className="group px-8 py-5 text-lg bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-xl shadow-lg transition-all hover:scale-105 hover:shadow-[0_0_15px_#22d3ee] flex items-center gap-2 drop-shadow-lg">
                Get Started
                <ArrowRight className="transition-all group-hover:translate scale-105 group-hover:text-cyan-200" />
              </Button>
              <Link href="/learn-more" passHref>
                <button className="group relative flex items-center gap-2 px-4 py-2 rounded-xl border border-cyan-300 hover:border-cyan-500 hover:shadow-[0_0_12px_#22d3ee] focus:outline-none focus:ring-2 focus:ring-cyan-400 transition bg-black text-white hover:scale-105 group-hover:drop-shadow-lg">
                  <InfoIcon className="w-5 h-5 transition-all group-hover:text-cyan-400 group-hover:scale-105" />
                  Learn More
                </button>
              </Link>
          </div>
        </div>

        {/* Globe Section */}
        <section className="flex justify-center mb-24 w-full">
          <div className="w-[600px] h-[600px] drop-shadow-[0_0_35px_rgba(34,211,238,0.95)] rounded-3xl overflow-hidden transition-shadow hover:drop-shadow-[0_0_55px_rgba(34,211,238,0.95)]">
            <World
              globeConfig={{
                globeColor: "#a0d8f7",
                polygonColor: "#0177bb",
                atmosphereColor: "#5eead4",
                showAtmosphere: true,
                emissive: "#219ebc",
                emissiveIntensity: 0.3,
                shininess: 0.7,
                rings: 1,
                maxRings: 3,
              }}
              data={[]}
            />
          </div>
        </section>

        {/* Features Section */}
        <div
          id="features"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 w-full max-w-6xl"
        >
          {FEATURES.map(({ title, desc, icon: Icon }) => (
            <div
              key={title}
              className="bg-white p-8 rounded-xl shadow-md border border-gray-100 cursor-pointer transition-all hover:shadow-xl hover:drop-shadow-[0_0_18px_rgba(34,211,238,0.8)] hover:-translate-y-1 group"
            >
              <Icon className="mb-4 w-10 h-10 text-cyan-400 group-hover:text-cyan-500 transition-all drop-shadow-sm" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2 drop-shadow-sm">{title}</h3>
              <p className="text-gray-700">{desc}</p>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <section
          id="contact"
          className="w-full max-w-6xl mt-20 bg-white rounded-xl p-8 shadow-md text-center transition-shadow hover:shadow-lg hover:drop-shadow-[0_0_15px_rgba(34,211,238,0.7)]"
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-4 drop-shadow-sm">Need Help?</h2>
          <p className="mb-6 text-gray-700 drop-shadow-sm">
            Need assistance? Our dedicated support team is here to help you with any questions or issues related to ModNect. Whether you need guidance on using the platform, troubleshooting, or general inquiries, feel free to reach out and we'll ensure you get the support you need promptly.
          </p>
          <Link href="mailto:aaryanbairagi11@gmail.com" passHref>
            <Button className="group mx-auto px-8 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl shadow-lg transition-transform hover:scale-105 hover:shadow-[0_0_15px_#22d3ee] flex items-center gap-2 drop-shadow-lg">
              Email Support
              <Mail className="transition-all group-hover:translate scale-105 group-hover:text-cyan-200" />
            </Button>
          </Link>
        </section>
      </main>
      
      <hr className="border-black/20 my-4" />

      {/* Bottom Footer */}
      <footer className="w-full text-center py-6 mb-4 text-gray-500 text-sm drop-shadow-sm">
        &copy; {new Date().getFullYear()} ModNect. All Rights Reserved.
      </footer>
    </div>
  );
}



// "use client"
// import Link from "next/link";
// import Image from "next/image";
// import { motion } from "framer-motion";
// import {
//   Facebook,
//   Twitter,
//   Linkedin,
//   Github,
//   User,
//   Zap,
//   Shield,
// } from "lucide-react";
// import dynamic from "next/dynamic";

// const World = dynamic(() => import("@/components/ui/globe").then((mod) => mod.World), {
//   ssr: false,
// });

// export default function LandingPage() {
//   return (
//     <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50 text-gray-900">
//       {/* Navbar */}
//       <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-gray-200">
//         <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
//           <Link href="/" className="flex items-center gap-3">
//             <Image src="/logo.png" alt="ModNect Logo" width={40} height={40} />
//             <span className="text-xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
//               ModNect
//             </span>
//           </Link>

//           <div className="hidden md:flex items-center gap-8 font-medium">
//             <Link href="#features" className="hover:text-cyan-600 transition">
//               Features
//             </Link>
//             <Link href="#contact" className="hover:text-cyan-600 transition">
//               Contact
//             </Link>
//           </div>

//           <div className="flex items-center gap-3">
//             <Link
//               href="/login"
//               className="px-4 py-2 rounded-full border border-cyan-500 text-cyan-600 hover:bg-cyan-50 transition"
//             >
//               Login
//             </Link>
//             <Link
//               href="/signup"
//               className="px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow hover:opacity-90 transition"
//             >
//               Sign Up
//             </Link>
//           </div>
//         </nav>
//       </header>

//       {/* Hero */}
//       <section className="flex flex-col items-center justify-center text-center py-24 px-6">
//         <motion.span
//           initial={{ opacity: 0, y: -10 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="px-4 py-1 mb-6 text-sm rounded-full bg-cyan-100 text-cyan-700 font-medium shadow"
//         >
//           🚀 Your Campus Social Hub
//         </motion.span>

//         <motion.h1
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.2 }}
//           className="text-5xl md:text-6xl font-extrabold tracking-tight"
//         >
//           Connect. Share. Grow.
//         </motion.h1>

//         <p className="mt-6 max-w-2xl text-lg text-gray-600">
//           ModNect makes your campus life more connected with seamless file sharing,
//           media posts, and interactive features designed for students.
//         </p>

//         <div className="mt-8 flex gap-4">
//           <Link
//             href="/signup"
//             className="px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium shadow hover:scale-105 transition"
//           >
//             Get Started
//           </Link>
//           <Link
//             href="#features"
//             className="px-6 py-3 rounded-full border border-cyan-500 text-cyan-600 font-medium hover:bg-cyan-50 transition"
//           >
//             Learn More
//           </Link>
//         </div>
//       </section>

//       {/* Globe */}
//         <section className="flex justify-center mb-24 w-full">
//           <div className="w-[600px] h-[600px] drop-shadow-[0_0_35px_rgba(34,211,238,0.95)] rounded-3xl overflow-hidden transition-shadow hover:drop-shadow-[0_0_55px_rgba(34,211,238,0.95)]">
//             <World
//               globeConfig={{
//                 globeColor: "#a0d8f7",
//                 polygonColor: "#0177bb",
//                 atmosphereColor: "#5eead4",
//                 showAtmosphere: true,
//                 emissive: "#219ebc",
//                 emissiveIntensity: 0.3,
//                 shininess: 0.7,
//                 rings: 1,
//                 maxRings: 3,
//               }}
//               data={[]}
//             />
//           </div>
//         </section>

//       {/* Features */}
//       <section
//         id="features"
//         className="max-w-7xl mx-auto py-24 px-6 grid md:grid-cols-3 gap-10"
//       >
//         {[
//           {
//             title: "Smart Sharing",
//             desc: "Upload and share files instantly with classmates.",
//             icon: User,
//           },
//           {
//             title: "Lightning Fast",
//             desc: "Experience seamless uploads and downloads.",
//             icon: Zap,
//           },
//           {
//             title: "Secure Platform",
//             desc: "Your data stays protected with encryption.",
//             icon: Shield,
//           },
//         ].map(({ title, desc, icon: Icon }, i) => (
//           <motion.div
//             key={i}
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ delay: i * 0.2 }}
//             className="p-8 rounded-xl shadow-md border border-transparent bg-gradient-to-b from-white to-gray-50 hover:border-cyan-300 hover:shadow-xl transition"
//           >
//             <Icon className="w-10 h-10 text-cyan-600 mb-4" />
//             <h3 className="text-xl font-semibold mb-2">{title}</h3>
//             <p className="text-gray-600">{desc}</p>
//           </motion.div>
//         ))}
//       </section>

//       {/* Contact */}
//       <section
//         id="contact"
//         className="bg-gradient-to-r from-cyan-50 to-blue-50 py-20 px-6 text-center"
//       >
//         <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
//         <p className="max-w-xl mx-auto text-gray-600 mb-8">
//           Have questions or need support? We’re here to help you every step of the
//           way.
//         </p>
//         <div className="flex justify-center gap-4">
//           <Link
//             href="mailto:support@modnect.com"
//             className="px-6 py-3 rounded-full bg-cyan-600 text-white shadow hover:opacity-90 transition"
//           >
//             Email Support
//           </Link>
//           <Link
//             href="/faq"
//             className="px-6 py-3 rounded-full border border-cyan-500 text-cyan-600 font-medium hover:bg-cyan-50 transition"
//           >
//             Visit FAQ
//           </Link>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="bg-gray-900 text-gray-300 py-10 px-6">
//         <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
//           <div>
//             <h3 className="text-xl font-bold text-white mb-4">ModNect</h3>
//             <p className="text-gray-400 text-sm">
//               © {new Date().getFullYear()} ModNect. All rights reserved.
//             </p>
//           </div>

//           <div className="flex flex-col gap-2">
//             <Link href="#features" className="hover:text-white">
//               Features
//             </Link>
//             <Link href="#contact" className="hover:text-white">
//               Contact
//             </Link>
//             <Link href="/privacy" className="hover:text-white">
//               Privacy Policy
//             </Link>
//           </div>

//           <div className="flex gap-4">
//             <Link href="#" className="hover:text-white">
//               <Facebook size={20} />
//             </Link>
//             <Link href="#" className="hover:text-white">
//               <Twitter size={20} />
//             </Link>
//             <Link href="#" className="hover:text-white">
//               <Linkedin size={20} />
//             </Link>
//             <Link href="#" className="hover:text-white">
//               <Github size={20} />
//             </Link>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }


