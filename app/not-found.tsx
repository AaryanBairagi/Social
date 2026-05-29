"use client";
import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-white pb-10 pt-4">
        <div className="w-full max-w-md mx-auto p-6 flex flex-col items-center">
            <div className="w-60 h-60 mb-4 relative">
            <Image
              src="/page-not-found.jpg"
              alt="Page Not Found Illustration"
              layout="fill"
              objectFit="contain"
              priority
            />
            </div>
            <h1 className="text-3xl font-bold text-cyan-700 mb-2 text-center drop-shadow">
                Oops! Page Not Found
            </h1>
            <p className="text-gray-500 mb-6 text-center">
                The page you're looking for doesn't exist or may have been moved.<br/>
                Don't worry, let's bring you back to safety!
            </p>
            <Link
              href="/dashboard"
              className="bg-cyan-500 hover:bg-cyan-600 hover:shadow-[0_0_10px_#22d3ee] text-white font-semibold rounded-full px-6 py-2 transition shadow"
            >
              Go to Home
            </Link>
        </div>
    </div>
  );
}
