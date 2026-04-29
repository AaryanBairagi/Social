"use client";
import Image from "next/image";
import Link from "next/link";

export default function ComingSoon() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-white pb-10 pt-4">
      <div className="w-full max-w-md mx-auto p-6 flex flex-col items-center">
        {/* Illustration Section */}
        <div className="w-64 h-64 mb-6 relative">
          <Image
            src="/coming-soon.jpg" // your image file name in /public folder
            alt="Coming Soon Illustration"
            layout="fill"
            objectFit="contain"
            priority
          />
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-extrabold text-cyan-700 mb-2 text-center drop-shadow">
          Coming Soon
        </h1>

        {/* Subtext */}
        <p className="text-gray-600 text-center leading-relaxed mb-6">
          We're crafting something new and exciting!  
          This feature is under development and will be available soon.  
          Thank you for your patience and support.
        </p>

        {/* Back Home Button */}
        <Link
          href="/dashboard"
          className="bg-cyan-500 hover:bg-cyan-600 hover:shadow-[0_0_10px_#22d3ee] 
                     text-white font-semibold rounded-full px-6 py-2 transition-all shadow"
        >
          Back to Home
        </Link>

        {/* Footer Text */}
        <p className="text-xs text-gray-400 mt-6 text-center">
          © {new Date().getFullYear()} Social — All rights reserved.
        </p>
      </div>
    </div>
  );
}
