"use client";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { GraduationCap, Users, Briefcase, MessageCircle, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LearnMore() {
    const router = useRouter();
    const {isLoaded,isSignedIn} = useUser();
    

    const handleGetStartedNow = ()=>{
        if(!isLoaded) return;

        if(!isSignedIn){
            router.push('/sign-up');
        } else{
            router.push('/dashboard');
        }
    }
    return (
    <main className="bg-gradient-to-br from-cyan-50 via-white to-cyan-100 min-h-screen py-16 px-4">
      {/* Hero Section */}
        <section className="max-w-4xl mx-auto text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
                Discover How ModNect <span className="text-cyan-500">Transforms Campus Life</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mx-auto max-w-2xl">
                ModNect empowers you to connect, collaborate, and seize every campus opportunity.
                Whether you’re a student, mentor, or club leader, ModNect becomes your digital gateway to a more social and productive college experience.
            </p>
        </section>

        {/* Feature Highlights */}
        <section className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto mb-20">
            <div className="bg-white rounded-xl shadow-md p-8 border-l-4 border-cyan-400 flex flex-col items-center
            transition-all duration-200 hover:bg-cyan-50 hover:border-cyan-300
            hover:shadow-[0_0_3px_#E0FFFF,0_0_6px_#CCFFFF,0_0_9px_#22D3EE,0_0_12px_#2DD4BF,0_0_15px_#06B6D4,0_0_18px_#14B8A6]">
            <Users className="text-cyan-500 mb-4" size={40} />
            <h2 className="font-bold text-2xl text-gray-900 mb-2">Build Meaningful Connections</h2>
            <p className="text-gray-700">
                Find classmates, seniors, and mentors. Grow your network, join group discussions, and explore shared interests in a safe, verified student ecosystem.
            </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-8 border-l-4 border-cyan-400 flex flex-col items-center
            transition-all duration-200 hover:bg-cyan-50 hover:border-cyan-300
            hover:shadow-[0_0_3px_#E0FFFF,0_0_6px_#CCFFFF,0_0_9px_#22D3EE,0_0_12px_#2DD4BF,0_0_15px_#06B6D4,0_0_18px_#14B8A6]">
            <Briefcase className="text-cyan-500 mb-4" size={40} />
            <h2 className="font-bold text-2xl text-gray-900 mb-2">Unlock Campus Opportunities</h2>
            <p className="text-gray-700">
                Browse curated internships, workshops, and exclusive campus events. ModNect links you with the right resources—on and off campus—for your academic and career growth.
            </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-8 border-l-4 border-cyan-400 flex flex-col items-center
            transition-all duration-200 hover:bg-cyan-50 hover:border-cyan-300
            hover:shadow-[0_0_3px_#E0FFFF,0_0_6px_#CCFFFF,0_0_9px_#22D3EE,0_0_12px_#2DD4BF,0_0_15px_#06B6D4,0_0_18px_#14B8A6]">
            <MessageCircle className="text-cyan-500 mb-4" size={40} />
            <h2 className="font-bold text-2xl text-gray-900 mb-2">Powerful Collaboration Tools</h2>
            <p className="text-gray-700">
                Create study groups, share notes, and work on projects together. Real-time chat and file sharing help you and your friends stay in sync from anywhere.
            </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-8 border-l-4 border-cyan-400 flex flex-col items-center
            transition-all duration-200 hover:bg-cyan-50 hover:border-cyan-300
            hover:shadow-[0_0_3px_#E0FFFF,0_0_6px_#CCFFFF,0_0_9px_#22D3EE,0_0_12px_#2DD4BF,0_0_15px_#06B6D4,0_0_18px_#14B8A6]">
            <GraduationCap className="text-cyan-500 mb-4" size={40} />
            <h2 className="font-bold text-2xl text-gray-900 mb-2">Connect with Alumni & Mentors</h2>
            <p className="text-gray-700">
                Get guidance from seniors and alumni who’ve walked your path—find mentors, get internship referrals, and learn from their academic and industry insights.
            </p>
            </div>
        </section>

      {/* Testimonials & Social Proof */}
        <section className="max-w-4xl mx-auto mb-20">
        <h3 className="text-2xl font-bold mb-6 text-center">Real Voices, Real Impact</h3>
        <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center
                transition-all duration-200 hover:bg-cyan-50 hover:border-cyan-300
                hover:shadow-[0_0_3px_#E0FFFF,0_0_6px_#CCFFFF,0_0_9px_#22D3EE,0_0_12px_#2DD4BF,0_0_15px_#06B6D4,0_0_18px_#14B8A6]">
                <Sparkles size={28} className="text-cyan-500 mb-2" />
                <p className="text-sm text-gray-700 italic mb-2">
                    “I met my project team and landed an internship thanks to ModNect’s networking tools. Every student should try it!”
                </p>
                <span className="font-semibold text-cyan-700">Aayushi K., Class of 2025</span>
            </div>

            <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center
                transition-all duration-200 hover:bg-cyan-50 hover:border-cyan-300
                hover:shadow-[0_0_3px_#E0FFFF,0_0_6px_#CCFFFF,0_0_9px_#22D3EE,0_0_12px_#2DD4BF,0_0_15px_#06B6D4,0_0_18px_#14B8A6]">
                <Sparkles size={28} className="text-cyan-500 mb-2" />
                <p className="text-sm text-gray-700 italic mb-2">
                    “Managing a college club has never been easier. The event sharing and messaging features are a game changer.”
                </p>
                <span className="font-semibold text-cyan-700">Neeraj S., Club President</span>
            </div>
            
            <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center
                transition-all duration-200 hover:bg-cyan-50 hover:border-cyan-300
                hover:shadow-[0_0_3px_#E0FFFF,0_0_6px_#CCFFFF,0_0_9px_#22D3EE,0_0_12px_#2DD4BF,0_0_15px_#06B6D4,0_0_18px_#14B8A6]">
                <Sparkles size={28} className="text-cyan-500 mb-2" />
                <p className="text-sm text-gray-700 italic mb-2">
                    “The best thing about ModNect? It brings everyone together—students, mentors, and alumni—in one trusted space."
                </p>
                <span className="font-semibold text-cyan-700">Prof. Mehta, Mentor</span>
            </div>
            </div>
        </section>

        {/* Call to Action */}
        <section className="max-w-2xl mx-auto text-center mt-12">
            <div className="bg-cyan-50 border border-cyan-200 rounded-xl py-10 px-6 shadow
            transition-all duration-200 hover:shadow-[0_0_3px_#E0FFFF,0_0_6px_#CCFFFF,0_0_9px_#22D3EE,0_0_12px_#2DD4BF,0_0_15px_#06B6D4,0_0_18px_#14B8A6] hover:bg-cyan-50 hover:border-cyan-300">
            <h3 className="text-2xl font-bold mb-4 text-gray-900">
                Ready to Accelerate Your Campus Journey?
            </h3>
            <p className="text-gray-700 mb-6">
                Sign up, explore features, and join a thriving campus community today. Your next connection, collaboration or opportunity starts here.
            </p>
            <Button onClick={handleGetStartedNow} className=" bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-full px-8 py-3 transition shadow-lg">
                Get Started Now
            </Button>
            </div>
        </section>
    </main>
  );
}
