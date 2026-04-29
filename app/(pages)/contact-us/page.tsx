"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mail, PhoneCall, MapPin, Send, ArrowLeft , LifeBuoy } from "lucide-react";
import Link from "next/link";
import SectionHeader from "@/global/SectionHeader";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<null | boolean>(null);
  const [error, setError] = useState<string | null>(null);

  const inputClassNames =
    "w-full rounded border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-shadow p-3";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSuccess(true);
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        const data = await res.json();
        setError(data.error || "Failed to send message, please try again later.");
      }
    } catch {
      setError("Network error, please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
    <header className="p-6 flex items-center gap-3">
      <Link
        href="/"
        className="flex items-center gap-2 mt-5 underline text-cyan-500 hover:text-cyan-800 transition"
      >
        <ArrowLeft className="w-5 h-5" /> Back
      </Link>
    </header>
    <div className="max-w-5xl mx-auto my-20 p-8 rounded-3xl hover:shadow-[0_0_20px_3px_rgba(6,182,212,0.8),0_8px_32px_0_rgba(6,182,212,0.28)] transition-shadow duration-300 ease-in-out border-1 hover:border-cyan-300 bg-cyan-100/30  border-cyan-100">
      {/* <h1 className="text-4xl font-extrabold text-cyan-700 mb-4">Contact Us</h1> */}
      <SectionHeader title={"Contact Us"} icon={<LifeBuoy/>} />
      <p className="mb-8 text-gray-700 max-w-xl">
        Need assistance? <br/> Our dedicated support team <br/> (email: <a className="text-cyan-600 hover:underline" href="mailto:aaryan_bairagi_it@mcoe.edu.in">aaryan_bairagi_it@mcoe.edu.in</a>) is here to help you with any questions or issues related to Social. Fill out the form below or reach out directly using the contact information.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact Info */}
        <div className="space-y-8">
          <div className="flex items-start gap-4">
            <MapPin className="w-6 h-6 text-cyan-500 mt-1" />
            <div>
              <h3 className="text-lg font-semibold mb-1">Our Location</h3>
              <p className="text-gray-600">1186/A, Off J.M. Road, Shivajinagar, Pune, Maharashtra Pin- 411005.</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <PhoneCall className="w-6 h-6 text-cyan-500" />
            <a href="tel:+1234567890" className="text-cyan-600 hover:underline">
              +91 7588223224
            </a>
          </div>
          <div className="flex items-center gap-4">
            <Mail className="w-6 h-6 text-cyan-500" />
            <a href="mailto:aaryan_bairagi_it@mcoe.edu.in" className="text-cyan-600 hover:underline">
              aaryan_bairagi_it@moderncoe.edu.in
            </a>
          </div>
        </div>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block mb-2 font-semibold text-gray-700">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Your full name"
              value={formData.name}
              onChange={handleChange}
              className={inputClassNames}
              required
              disabled={submitting}
            />
          </div>

          <div>
            <label htmlFor="email" className="block mb-2 font-semibold text-gray-700">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              className={inputClassNames}
              required
              disabled={submitting}
            />
          </div>

          <div>
            <label htmlFor="subject" className="block mb-2 font-semibold text-gray-700">
              Subject <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              placeholder="Brief summary"
              value={formData.subject}
              onChange={handleChange}
              className={inputClassNames}
              required
              disabled={submitting}
            />
          </div>

          <div>
            <label htmlFor="message" className="block mb-2 font-semibold text-gray-700">
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              placeholder="Write your message here..."
              value={formData.message}
              onChange={handleChange}
              rows={5}
              className={inputClassNames + " resize-y"}
              required
              disabled={submitting}
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && <p className="text-sm text-green-600">Message sent successfully! We'll get back to you soon.</p>}
          
          <div className="flex justify-end">
          <Button
            type="submit"
            disabled={submitting}
            className="bg-cyan-600 hover:bg-cyan-700 px-5 py-2 rounded-lg text-lg font-semibold shadow hover:shadow-cyan-200 transition flex justify-center items-center gap-2"
          >
            {submitting ? (
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
            ) : null}
            Send
            <span><Send className="w-5 h-5"/></span>
          </Button>
          </div>
        </form>
      </div>
    </div>
    </>
  );
}
