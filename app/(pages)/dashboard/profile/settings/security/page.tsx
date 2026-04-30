"use client";
import { UserProfile } from "@clerk/nextjs";

export default function CustomUserProfileCard() {
  return (
    <div
      className="
        flex
        justify-center
        items-center
        min-h-[80vh]
        w-full
        bg-transparent
      "
      // Make the parent fill and center everything inside
    >
      <div
        className="
          w-full
          max-w-4xl
          bg-white/90
          rounded-3xl
          shadow-xl
          border
          p-0
          overflow-hidden
          my-14
          transition-shadow
          duration-300
          ease-in-out
          hover:shadow-[0_0_20px_3px_rgba(6,182,212,0.8),0_8px_32px_0_rgba(6,182,212,0.28)]
        "
        style={{
          WebkitBackdropFilter: "blur(20px)",
          backdropFilter: "blur(20px)",
        }}
      >
        <UserProfile
          appearance={{
            baseTheme: "shadcn",
            variables: {
              colorPrimary: "#06b6d4",
              colorPrimaryText: "#0e172a",
              colorBackground: "#ffffffcc",
              colorInputBackground: "#e0f7fa",
              colorAlphaShade: "#e0f2fe",
              borderRadius: "1.5rem",
              fontSize: "1.07rem",
            },
            elements: {
              card: "bg-white/90 shadow-xl border rounded-3xl p-0",
              headerTitle: "font-bold text-cyan-700 text-xl",
              profileSectionContent: "bg-transparent",
              profileSectionPrimaryButton:
                "bg-cyan-500 hover:bg-cyan-700 transition text-white font-semibold shadow rounded-xl",
              profileSectionDangerButton: "bg-red-500 hover:bg-red-600 text-white",
              fileDropAreaBox: "border-cyan-200",
            },
          }}
        />
      </div>
    </div>
  );
}
