


"use client";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LayoutGrid,Headset,LogIn,InfoIcon,Users2,BookOpenCheck,CalendarDays,ArrowRight, SquareChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

const World = dynamic(() => import("@/components/ui/globe").then((mod) => mod.World), {
  ssr: false,
});


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
          <div className="flex justify-between h-30 items-center">
            <div className="flex items-center gap-4 justify-start">
              <Image
                src="/SocialLogo.png"
                alt="Social Logo"
                width={40}
                height={40}
                className="drop-shadow-md"
              />
              <span className="text-2xl font-bold text-black/90 tracking-wide drop-shadow-lg">Social</span>
            </div>
            <div className="flex items-center space-x-6 text-cyan-600">
          
              <Link href="/features" passHref>
                <button className="group relative flex items-center gap-2 px-4 py-2 rounded-xl border border-cyan-300 hover:border-cyan-500 hover:shadow-[0_0_12px_#22d3ee] focus:outline-none focus:ring-2 focus:ring-cyan-400 transition bg-white group-hover:drop-shadow-lg">
                  <LayoutGrid className="w-5 h-5 transition-all group-hover:text-cyan-400 group-hover:scale-110" />
                  Features
                </button>
              </Link>
              <Link href="/contact-us" passHref>
                <button className="group relative flex items-center gap-2 px-4 py-2 rounded-xl border border-cyan-300 hover:border-cyan-500 hover:shadow-[0_0_12px_#22d3ee] focus:outline-none focus:ring-2 focus:ring-cyan-400 transition bg-white group-hover:drop-shadow-lg">
                  <Headset className="w-5 h-5 transition-all group-hover:text-cyan-400 group-hover:scale-110" />
                  Contact Us
                </button>
              </Link>
              <Link href="/whats-next" passHref>
                <button className="group relative mr-5 flex items-center gap-2 px-4 py-2 rounded-xl border border-cyan-300 hover:border-cyan-500 hover:shadow-[0_0_12px_#22d3ee] focus:outline-none focus:ring-2 focus:ring-cyan-400 transition bg-white group-hover:drop-shadow-lg">
                  <SquareChevronRight className="w-5 h-5 transition-all group-hover:text-cyan-400 group-hover:scale-110" />
                  What's Next?
                </button>
              </Link>
              <Button onClick={handleLogin} className="group flex items-center gap-2 px-6 py-2 rounded-xl bg-cyan-500 text-white shadow-md hover:bg-cyan-600 hover:shadow-[0_0_15px_#22d3ee] focus:outline-none focus:ring-4 focus:ring-cyan-400 transition transform">
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
            <span className="text-transparent bg-clip-text bg-gradient-to-r bg-cyan-500 drop-shadow-lg">
              Within Campus.
            </span>
          </h1>
          <p className="text-xl text-gray-700 mb-8 drop-shadow-sm">
            Social is your college networking platform to connect with peers, seniors, and professors.
            Collaborate on projects, find study groups, and unlock campus opportunities. Discover new learning avenues, participate in campus events, and grow your skills
            with the support of a vibrant student community.
          </p>
          <div className="flex items-center gap-4 justify-center">
              <Button onClick={handleGetStarted} className="group px-5 py-5.5 text-lg bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl shadow-lg transition-all hover:shadow-[0_0_15px_#22d3ee] flex items-center gap-2 drop-shadow-lg">
                Get Started
                <ArrowRight className="transition-all group-hover:translate hover:scale-105 group-hover:text-cyan-200" />
              </Button>
              <Link href="/learn-more" passHref>
                <button className="group relative flex items-center gap-2 px-4 py-2.5 rounded-xl border border-cyan-300 hover:border-cyan-500 hover:shadow-[0_0_12px_#22d3ee] focus:outline-none focus:ring-2 focus:ring-cyan-400 transition bg-black text-white group-hover:drop-shadow-lg">
                  <InfoIcon className="w-5 h-5 transition-all group-hover:text-cyan-400 group-hover:scale-105" />
                  Learn More
                </button>
              </Link>
          </div>
        </div>

        <section className="flex justify-center mb-10 w-full">
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
              
data={[
  // ===== NORTH AMERICA =====
  { order: 1, startLat: 40.7128, startLng: -74.0060, endLat: 34.0522, endLng: -118.2437, arcAlt: 0.3, color: "#22d3ee" }, // NYC → LA
  { order: 2, startLat: 37.7749, startLng: -122.4194, endLat: 47.6062, endLng: -122.3321, arcAlt: 0.2, color: "#38bdf8" }, // SF → Seattle
  { order: 3, startLat: 41.8781, startLng: -87.6298, endLat: 29.7604, endLng: -95.3698, arcAlt: 0.2, color: "#0ea5e9" }, // Chicago → Houston

  // ===== SOUTH AMERICA =====
  { order: 4, startLat: -23.5505, startLng: -46.6333, endLat: -22.9068, endLng: -43.1729, arcAlt: 0.2, color: "#22d3ee" }, // São Paulo → Rio
  { order: 5, startLat: -34.6037, startLng: -58.3816, endLat: -33.4489, endLng: -70.6693, arcAlt: 0.25, color: "#38bdf8" }, // Buenos Aires → Santiago

  // ===== EUROPE =====
  { order: 6, startLat: 51.5072, startLng: -0.1276, endLat: 48.8566, endLng: 2.3522, arcAlt: 0.2, color: "#0ea5e9" }, // London → Paris
  { order: 7, startLat: 48.8566, startLng: 2.3522, endLat: 41.9028, endLng: 12.4964, arcAlt: 0.2, color: "#22d3ee" }, // Paris → Rome
  { order: 8, startLat: 52.5200, startLng: 13.4050, endLat: 55.7558, endLng: 37.6173, arcAlt: 0.3, color: "#38bdf8" }, // Berlin → Moscow

  // ===== AFRICA =====
  { order: 9, startLat: 30.0444, startLng: 31.2357, endLat: -1.2921, endLng: 36.8219, arcAlt: 0.35, color: "#0ea5e9" }, // Cairo → Nairobi
  { order: 10, startLat: -26.2041, startLng: 28.0473, endLat: -33.9249, endLng: 18.4241, arcAlt: 0.3, color: "#22d3ee" }, // Johannesburg → Cape Town

  // ===== MIDDLE EAST =====
  { order: 11, startLat: 25.276987, startLng: 55.296249, endLat: 24.7136, endLng: 46.6753, arcAlt: 0.2, color: "#38bdf8" }, // Dubai → Riyadh
  { order: 12, startLat: 32.0853, startLng: 34.7818, endLat: 41.0082, endLng: 28.9784, arcAlt: 0.25, color: "#0ea5e9" }, // Tel Aviv → Istanbul

  // ===== INDIA (BALANCED, NOT OVERLOADED) =====
  { order: 13, startLat: 28.6139, startLng: 77.2090, endLat: 19.0760, endLng: 72.8777, arcAlt: 0.2, color: "#22d3ee" }, // Delhi → Mumbai
  { order: 14, startLat: 12.9716, startLng: 77.5946, endLat: 17.3850, endLng: 78.4867, arcAlt: 0.15, color: "#38bdf8" }, // Bangalore → Hyderabad
  { order: 15, startLat: 22.5726, startLng: 88.3639, endLat: 13.0827, endLng: 80.2707, arcAlt: 0.25, color: "#0ea5e9" }, // Kolkata → Chennai

  // ===== ASIA =====
  { order: 16, startLat: 35.6762, startLng: 139.6503, endLat: 37.5665, endLng: 126.9780, arcAlt: 0.2, color: "#22d3ee" }, // Tokyo → Seoul
  { order: 17, startLat: 31.2304, startLng: 121.4737, endLat: 22.3193, endLng: 114.1694, arcAlt: 0.2, color: "#38bdf8" }, // Shanghai → Hong Kong
  { order: 18, startLat: 13.7563, startLng: 100.5018, endLat: 1.3521, endLng: 103.8198, arcAlt: 0.2, color: "#0ea5e9" }, // Bangkok → Singapore

  // ===== AUSTRALIA =====
  { order: 19, startLat: -33.8688, startLng: 151.2093, endLat: -37.8136, endLng: 144.9631, arcAlt: 0.2, color: "#22d3ee" }, // Sydney → Melbourne
  { order: 20, startLat: -27.4698, startLng: 153.0251, endLat: -31.9505, endLng: 115.8605, arcAlt: 0.3, color: "#38bdf8" }, // Brisbane → Perth

  // ===== INTERCONTINENTAL (BALANCE MAGIC) =====
  { order: 21, startLat: 40.7128, startLng: -74.0060, endLat: 51.5072, endLng: -0.1276, arcAlt: 0.4, color: "#0ea5e9" }, // NYC → London
  { order: 22, startLat: 34.0522, startLng: -118.2437, endLat: 35.6762, endLng: 139.6503, arcAlt: 0.5, color: "#22d3ee" }, // LA → Tokyo
  { order: 23, startLat: 48.8566, startLng: 2.3522, endLat: 25.276987, endLng: 55.296249, arcAlt: 0.4, color: "#38bdf8" }, // Paris → Dubai
  { order: 24, startLat: 19.0760, startLng: 72.8777, endLat: 1.3521, endLng: 103.8198, arcAlt: 0.35, color: "#0ea5e9" }, // Mumbai → Singapore
  { order: 25, startLat: 37.7749, startLng: -122.4194, endLat: 22.3193, endLng: 114.1694, arcAlt: 0.45, color: "#22d3ee" }, // SF → HK

  // ===== EXTRA GLOBAL LINKS =====
  { order: 26, startLat: 52.5200, startLng: 13.4050, endLat: 41.9028, endLng: 12.4964, arcAlt: 0.2, color: "#38bdf8" },
  { order: 27, startLat: 55.7558, startLng: 37.6173, endLat: 35.6762, endLng: 139.6503, arcAlt: 0.4, color: "#0ea5e9" },
  { order: 28, startLat: 30.0444, startLng: 31.2357, endLat: 25.276987, endLng: 55.296249, arcAlt: 0.25, color: "#22d3ee" },
  { order: 29, startLat: -1.2921, startLng: 36.8219, endLat: 13.7563, endLng: 100.5018, arcAlt: 0.4, color: "#38bdf8" },
  { order: 30, startLat: -26.2041, startLng: 28.0473, endLat: 25.276987, endLng: 55.296249, arcAlt: 0.45, color: "#0ea5e9" },

  // ===== FINAL FILL (GLOBAL BALANCE) =====
  { order: 31, startLat: 47.6062, startLng: -122.3321, endLat: 37.7749, endLng: -122.4194, arcAlt: 0.15, color: "#22d3ee" },
  { order: 32, startLat: -22.9068, startLng: -43.1729, endLat: 40.7128, endLng: -74.0060, arcAlt: 0.5, color: "#38bdf8" },
  { order: 33, startLat: 41.0082, startLng: 28.9784, endLat: 48.8566, endLng: 2.3522, arcAlt: 0.3, color: "#0ea5e9" },
  { order: 34, startLat: 24.7136, startLng: 46.6753, endLat: 28.6139, endLng: 77.2090, arcAlt: 0.25, color: "#22d3ee" },
  { order: 35, startLat: 22.5726, startLng: 88.3639, endLat: 31.2304, endLng: 121.4737, arcAlt: 0.35, color: "#38bdf8" },

  { order: 36, startLat: 37.5665, startLng: 126.9780, endLat: 1.3521, endLng: 103.8198, arcAlt: 0.25, color: "#0ea5e9" },
  { order: 37, startLat: -37.8136, startLng: 144.9631, endLat: 13.7563, endLng: 100.5018, arcAlt: 0.45, color: "#22d3ee" },
  { order: 38, startLat: -31.9505, startLng: 115.8605, endLat: 25.276987, endLng: 55.296249, arcAlt: 0.5, color: "#38bdf8" },
  { order: 39, startLat: 34.0522, startLng: -118.2437, endLat: 41.9028, endLng: 12.4964, arcAlt: 0.5, color: "#0ea5e9" },
  { order: 40, startLat: 51.5072, startLng: -0.1276, endLat: 37.7749, endLng: -122.4194, arcAlt: 0.5, color: "#22d3ee" },

  { order: 41, startLat: 35.6762, startLng: 139.6503, endLat: -33.8688, endLng: 151.2093, arcAlt: 0.3, color: "#38bdf8" },
  { order: 42, startLat: 31.2304, startLng: 121.4737, endLat: 37.7749, endLng: -122.4194, arcAlt: 0.5, color: "#0ea5e9" },
  { order: 43, startLat: 13.0827, startLng: 80.2707, endLat: 25.276987, endLng: 55.296249, arcAlt: 0.3, color: "#22d3ee" },
  { order: 44, startLat: 19.0760, startLng: 72.8777, endLat: 51.5072, endLng: -0.1276, arcAlt: 0.4, color: "#38bdf8" },
  { order: 45, startLat: 28.6139, startLng: 77.2090, endLat: 35.6762, endLng: 139.6503, arcAlt: 0.45, color: "#0ea5e9" },

  { order: 46, startLat: 48.8566, startLng: 2.3522, endLat: -23.5505, endLng: -46.6333, arcAlt: 0.5, color: "#22d3ee" },
  { order: 47, startLat: -22.9068, startLng: -43.1729, endLat: 25.276987, endLng: 55.296249, arcAlt: 0.5, color: "#38bdf8" },
  { order: 48, startLat: -33.9249, startLng: 18.4241, endLat: 51.5072, endLng: -0.1276, arcAlt: 0.5, color: "#0ea5e9" },
  { order: 49, startLat: -1.2921, startLng: 36.8219, endLat: 37.7749, endLng: -122.4194, arcAlt: 0.5, color: "#22d3ee" },
  { order: 50, startLat: 1.3521, startLng: 103.8198, endLat: 40.7128, endLng: -74.0060, arcAlt: 0.5, color: "#38bdf8" },
]}
     
              
            />
          </div>
        </section> 
      </main>
      
      <hr className="border-black/20 w-full my-4" />

      <footer className="w-full text-center py-6 mb-4 text-gray-500 text-sm drop-shadow-sm">
        &copy; {new Date().getFullYear()} Social. All Rights Reserved.
        <br />
        <span className="text-gray-600">
          Made with ❤️ by <span className="font-medium text-cyan-700">Aaryan Bairagi</span>
        </span>
      </footer>


    </div>
  );
}
