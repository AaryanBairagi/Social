import { SignIn } from "@clerk/nextjs";
import Image from "next/image";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#e0f2fe] via-[#fff] to-[#a5f3fc] p-8">
      {/* IMAGE CARD WITH HEADING OVERLAID */}
        <div
        className="
            relative w-[1150px] h-[1000px] rounded-3xl shadow-2xl
            overflow-hidden flex items-center justify-center
            transition-shadow duration-300
            hover:drop-shadow-[0_0_24px_#22d3ee]">
        {/* Illustration fills card */}
        <Image
            src="/SignUpImage.jpg" // change image here for Sign In
            alt="Sign in illustration"
            layout="fill"
            objectFit="cover"
            priority />
        {/* Top Gradient so text pops */}
        <div className="absolute top-0 left-0 w-full h-[130px] bg-gradient-to-b from-white/85 via-white/70 to-transparent z-10 pointer-events-none" />
        {/* Text block: now "on" the image, always readable */}
        <div className="absolute w-full left-0 top-0 flex flex-col items-center px-0 pt-10 pb-2 z-20">
            <div className="px-5 py-2 rounded-2xl bg-white/80 backdrop-blur-3xl">
                <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-cyan-500 to-cyan-700 text-transparent text-center bg-clip-text">
                    Welcome Back to Social
                </h1>
                <p className="text-gray-700 text-base md:text-lg font-medium text-center max-w-lg mx-auto mt-1">
                    Sign in to continue <span className="text-cyan-600 font-semibold">connecting</span> with peers, accessing campus opportunities, and enjoying <span className="text-cyan-600 font-semibold">exclusive student features</span>.
                </p>

            </div>
        </div>
        {/* FORM overlayed over the phone (adjust width/top as needed) */}
        <div
            className="absolute "
            style={{
                top: "50%", // centers vertically
                left: "50%", // centers horizontally
                transform: "translate(-50%,-50%)",
                width: "38%", // fills phone's screen horizontally (adjust for your art)
                zIndex: 15,
        }}>
            <div className="bg-white/20 rounded-2xl shadow-lg p-1 flex justify-center backdrop-blur-sm min-h-[400px] max-h-[500px]">
            <SignIn
                appearance={{
                    elements: {
                    card: "bg-transparent border-0 shadow-none",
                    headerTitle: "hidden",
                    headerSubtitle: "hidden",
                    dividerLine: "bg-gray-300",
                    dividerText: "text-gray-500 text-sm",
                    socialButtonsBlockButton:
                    "bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300 rounded-lg",
                    socialButtonsProviderIcon: "filter brightness-0",
                    formFieldLabel: "text-gray-700 font-medium",
                    formFieldInput:
                    "bg-gray-100 border border-gray-300 text-gray-900 placeholder-gray-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-lg",
                    formFieldInputShowPasswordButton:
                    "text-gray-700 hover:text-cyan-600",
                    formButtonPrimary:
                    "bg-gradient-to-r from-cyan-500 to-cyan-700 hover:scale-105 transition-transform text-white font-semibold rounded-lg py-2 shadow-md",
                    footerActionText: "text-gray-700 text-sm",
                    footerActionLink:
                    "text-cyan-600 hover:text-cyan-800 transition-colors",
                },
                }}
                path="/sign-in"
                routing="path" />
            </div>
        </div>
        </div>
    </div>
  );
}
