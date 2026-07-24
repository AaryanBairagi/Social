"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function SignUpPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          username,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Registration failed");
        setLoading(false);
        return;
      }

      await refreshUser();

      router.replace("/dashboard");
      router.refresh();
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#e0f2fe] p-8">

      <div
        className="
          relative
          w-[1150px]
          h-[1000px]
          rounded-3xl
          shadow-2xl
          overflow-hidden
          flex
          items-center
          justify-center
          transition-shadow
          duration-300
          hover:drop-shadow-[0_0_24px_#22d3ee]"
      >

        <Image
          src="/SignUpImage.jpg"
          alt="Sign Up"
          fill
          priority
          className="object-cover"
        />

        <div className="absolute top-0 left-0 w-full h-[130px] bg-gradient-to-b from-white/85 via-white/70 to-transparent z-10 pointer-events-none" />

        <div className="absolute w-full left-0 top-0 flex flex-col items-center pt-10 z-20">

          <div className="px-5 py-2 rounded-2xl bg-white/80 backdrop-blur-3xl">

            <h1 className="text-3xl md:text-4xl font-extrabold bg-cyan-500 text-transparent bg-clip-text text-center">
              Sign Up for Social
            </h1>

            <p className="text-gray-700 text-base md:text-lg font-medium text-center max-w-lg mt-1">
              Welcome! Join your campus network,
              <span className="text-cyan-600 font-semibold"> connect </span>
              and unlock
              <span className="text-cyan-600 font-semibold">
                {" "}exclusive student features
              </span>.
            </p>

          </div>

        </div>

        <div
          className="absolute"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            width: "38%",
            zIndex: 15,
          }}
        >

          <div className="bg-white/20 rounded-2xl shadow-lg backdrop-blur-sm min-h-[650px]">

            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl p-8 shadow-xl"
            >

              <div className="mt-2 grid grid-cols-2 gap-3 mb-4">

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>

                  <input
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-3 focus:ring-2 focus:ring-cyan-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>

                  <input
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-3 focus:ring-2 focus:ring-cyan-500 outline-none"
                  />
                </div>

              </div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>

              <input
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full mb-4 rounded-lg border border-gray-300 bg-gray-100 px-4 py-3 focus:ring-2 focus:ring-cyan-500 outline-none"
              />

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>

              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mb-4 rounded-lg border border-gray-300 bg-gray-100 px-4 py-3 focus:ring-2 focus:ring-cyan-500 outline-none"
              />

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>

              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mb-4 rounded-lg border border-gray-300 bg-gray-100 px-4 py-3 focus:ring-2 focus:ring-cyan-500 outline-none"
              />

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>

              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-3 focus:ring-2 focus:ring-cyan-500 outline-none"
              />

              {error && (
                <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-6 w-full rounded-lg bg-cyan-600 hover:bg-cyan-700  py-3 font-semibold text-white shadow-md transition-all disabled:opacity-70"
              >
                {loading ? "Creating Account..." : "Continue"}
              </button>

              <div className="mt-8 border-t pt-6 text-center">

                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link
                    href="/sign-in"
                    className="font-semibold text-cyan-600 hover:text-cyan-700"
                  >
                    Sign In
                  </Link>
                </p>

                <div className="mt-8 border-t pt-5">

                  <p className="text-sm text-gray-500">
                    Secured by{" "}
                    <span className="font-semibold text-cyan-600">
                      Social
                    </span>
                  </p>

                </div>

              </div>

            </form>

          </div>

        </div>

      </div>

    </div>
  );
}