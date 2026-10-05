"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/nav/Header";
import { WantedCard } from "@/components/stats/WantedCard";
import { siteConfig } from "@/content/site";
import { ArrowLeft, Send, CheckCircle2, Github, Linkedin, Code2, Mail } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    // Simulate serverless response
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  };

  return (
    <div className="relative min-h-screen bg-canvas text-ink-primary">
      <Header />

      <main className="max-w-6xl mx-auto px-6 md:px-16 lg:px-20 pt-32 pb-24">
        {/* Navigation Back */}
        <div className="mb-10">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 font-funnel text-xs text-ink-muted hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-accent" />
            <span>back to home</span>
          </Link>
        </div>

        {/* Page Title */}
        <div className="space-y-2 mb-14">
          <h1 className="font-funnel text-4xl sm:text-5xl md:text-6xl text-white tracking-tight lowercase">
            get in touch
          </h1>
          <p className="font-funnel text-sm sm:text-base text-ink-muted max-w-xl font-light">
            Open for Summer 2027 quantitative trading placements, software engineering roles, and technical discussions.
          </p>
        </div>

        {/* 2-Column Layout: Direct Links & Form on Left, Wanted Card on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Form & Social Links */}
          <div className="lg:col-span-7 space-y-12">
            {/* Direct Channel Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {siteConfig.socials.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target={social.name === "Email" ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  className="p-5 rounded-xl border border-white/[0.08] bg-[#161618] hover:border-accent/40 transition-all duration-300 group flex items-start justify-between"
                >
                  <div>
                    <span className="font-mono text-[10px] text-ink-muted uppercase block mb-1">
                      {social.label}
                    </span>
                    <h3 className="font-serif text-xl text-white group-hover:text-accent transition-colors">
                      {social.name}
                    </h3>
                    <span className="font-mono text-xs text-ink-secondary mt-1 block">
                      {social.username}
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-white/[0.04] text-ink-muted group-hover:text-accent group-hover:bg-accent/10 transition-colors">
                    {social.name === "GitHub" && <Github className="w-4 h-4" />}
                    {social.name === "LinkedIn" && <Linkedin className="w-4 h-4" />}
                    {social.name === "LeetCode" && <Code2 className="w-4 h-4" />}
                    {social.name === "Email" && <Mail className="w-4 h-4" />}
                  </div>
                </a>
              ))}
            </div>

            {/* Interactive Contact Form */}
            <div className="p-8 rounded-2xl border border-white/[0.08] bg-[#161618] relative overflow-hidden">
              <h3 className="font-serif text-2xl text-white mb-2">Send a Direct Message</h3>
              <p className="font-sans text-xs text-ink-muted mb-6">
                Fill out the form below or email directly at{" "}
                <a href="mailto:dhairya@dhairyabhatt.me" className="text-white hover:text-accent underline">
                  dhairya@dhairyabhatt.me
                </a>
              </p>

              {isSubmitted ? (
                <div className="p-8 rounded-xl bg-white/[0.03] border border-emerald-500/30 text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                  {/* Better Call Saul Easter Egg */}
                  <h4 className="font-serif text-2xl text-white">&ldquo;S&apos;all good, man!&rdquo;</h4>
                  <p className="font-sans text-sm text-ink-muted max-w-sm mx-auto">
                    Your message has been captured. I will get back to you promptly.
                  </p>
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({ name: "", email: "", subject: "", message: "" });
                    }}
                    className="font-mono text-xs text-accent underline pt-2 block mx-auto"
                  >
                    SEND ANOTHER MESSAGE
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-mono text-[10px] text-ink-muted uppercase block mb-1">
                        YOUR NAME *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Jane Doe"
                        className="w-full px-4 py-2.5 rounded-lg bg-black/40 border border-white/10 text-white font-sans text-sm placeholder:text-ink-muted/40 focus:border-accent focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="font-mono text-[10px] text-ink-muted uppercase block mb-1">
                        YOUR EMAIL *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="jane@company.com"
                        className="w-full px-4 py-2.5 rounded-lg bg-black/40 border border-white/10 text-white font-sans text-sm placeholder:text-ink-muted/40 focus:border-accent focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-mono text-[10px] text-ink-muted uppercase block mb-1">
                      SUBJECT
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="Summer 2027 Placement / Collaboration"
                      className="w-full px-4 py-2.5 rounded-lg bg-black/40 border border-white/10 text-white font-sans text-sm placeholder:text-ink-muted/40 focus:border-accent focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="font-mono text-[10px] text-ink-muted uppercase block mb-1">
                      MESSAGE *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Hi Dhairya, I came across your portfolio..."
                      className="w-full px-4 py-2.5 rounded-lg bg-black/40 border border-white/10 text-white font-sans text-sm placeholder:text-ink-muted/40 focus:border-accent focus:outline-none transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-8 py-3 rounded-full bg-white text-black font-mono text-xs uppercase tracking-wider font-semibold hover:bg-accent hover:text-white transition-all duration-300 shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{isSubmitting ? "TRANSMITTING..." : "TRANSMIT MESSAGE"}</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Right Column: One Piece "WANTED" Poster */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full sticky top-36">
              <WantedCard />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
