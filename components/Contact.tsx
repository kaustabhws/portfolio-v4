"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Copy, Check, CircleNotch, Warning } from "@phosphor-icons/react";
import Reveal from "./Reveal";
import SectionLabel from "./SectionLabel";
import type { ProfileData } from "@/lib/data";

type Status = "idle" | "sending" | "sent" | "error";

export default function Contact({ profile }: { profile: ProfileData }) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: fd.get("name"),
      email: fd.get("email"),
      subject: fd.get("subject"),
      message: fd.get("message"),
      company: fd.get("company"), // honeypot
    };

    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Something went wrong.");
      }
      setStatus("sent");
      form.reset();
      setTimeout(() => setStatus("idle"), 6000);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  const sending = status === "sending";

  return (
    <section id="contact" className="relative overflow-hidden px-6 py-28 lg:px-10 lg:py-40">
      <div className="orb left-[-10%] bottom-[0%] h-[34vw] w-[34vw] bg-cyan/25" />
      <div className="orb right-[-8%] top-[10%] h-[30vw] w-[30vw] bg-magenta/25" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <SectionLabel index="06">Contact</SectionLabel>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left — big invite */}
          <Reveal className="lg:col-span-5">
            <div className="flex h-full flex-col justify-between gap-10">
              <h2 className="font-display text-4xl font-extrabold uppercase leading-[0.95] tracking-tighter sm:text-5xl lg:text-6xl">
                Let&apos;s
                <br />
                <span className="text-stroke">build</span>
                <br />
                something.
              </h2>

              <div className="space-y-6">
                <button
                  onClick={copyEmail}
                  className="group flex items-center gap-3 text-left"
                  data-testid="contact-copy-email"
                >
                  <span className="font-display text-xl font-bold transition-colors group-hover:text-cyan lg:text-2xl">
                    {profile.email}
                  </span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-zinc-400 transition-colors group-hover:border-white/50 group-hover:text-white">
                    {copied ? <Check weight="bold" /> : <Copy />}
                  </span>
                </button>

                <div className="flex flex-wrap gap-3">
                  {profile.socials.map((s) => (
                    <Link
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-zinc-300 transition-colors hover:border-white/40 hover:text-white"
                      data-testid={`social-${s.label.toLowerCase().replace(/[^a-z]/g, "")}`}
                    >
                      {s.label}
                      <ArrowUpRight className="opacity-50 transition-opacity group-hover:opacity-100" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          {/* Right — glass form */}
          <Reveal delay={0.1} className="lg:col-span-7">
            <form
              onSubmit={handleSubmit}
              className="glass rounded-3xl p-8 lg:p-10"
              data-testid="contact-form"
            >
              {/* Honeypot — hidden from humans, catches bots */}
              <input
                type="text"
                name="company"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="absolute left-[-9999px] h-0 w-0 opacity-0"
              />

              <div className="grid grid-cols-1 gap-7 sm:grid-cols-2">
                <Field label="Your name" id="name" placeholder="Jane Doe" required />
                <Field
                  label="Email"
                  id="email"
                  type="email"
                  placeholder="jane@studio.com"
                  required
                />
              </div>
              <div className="mt-7">
                <Field label="Subject" id="subject" placeholder="Project enquiry" />
              </div>
              <div className="mt-7">
                <label htmlFor="message" className="label mb-3 block">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  required
                  placeholder="Tell me about your project…"
                  className="w-full resize-none border-b border-white/20 bg-transparent pb-2 text-base text-white outline-none transition-colors placeholder:text-zinc-600 focus:border-cyan"
                  data-testid="contact-message"
                />
              </div>

              <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
                <button
                  type="submit"
                  disabled={sending}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-4 font-semibold text-black transition-colors hover:bg-zinc-200 disabled:opacity-70 sm:w-auto"
                  data-testid="contact-submit-button"
                >
                  {status === "sending" && (
                    <>
                      Sending
                      <CircleNotch weight="bold" className="animate-spin" />
                    </>
                  )}
                  {status === "sent" && (
                    <>
                      Message sent <Check weight="bold" />
                    </>
                  )}
                  {status === "error" && (
                    <>
                      Try again <ArrowUpRight weight="bold" />
                    </>
                  )}
                  {status === "idle" && (
                    <>
                      Send message <ArrowUpRight weight="bold" />
                    </>
                  )}
                </button>

                {/* Status line */}
                <div aria-live="polite" className="min-h-[1.25rem] text-sm">
                  {status === "sent" && (
                    <span className="font-medium text-cyan">
                      Thanks — I&apos;ll be in touch soon.
                    </span>
                  )}
                  {status === "error" && (
                    <span className="inline-flex items-center gap-1.5 text-magenta">
                      <Warning weight="bold" /> {errorMsg}
                    </span>
                  )}
                </div>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  id,
  type = "text",
  placeholder,
  required = false,
}: {
  label: string;
  id: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="label mb-3 block">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full border-b border-white/20 bg-transparent pb-2 text-base text-white outline-none transition-colors placeholder:text-zinc-600 focus:border-cyan"
        data-testid={`contact-${id}`}
      />
    </div>
  );
}
