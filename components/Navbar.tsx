"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

// Animated Next.js Link — client-side nav with framer-motion transitions.
const MotionLink = motion.create(Link);

// Section links are root-absolute (e.g. "/#work") so they resolve from any
// route — including /blog — and not just the homepage.
const links = [
  { label: "About", href: "/#about" },
  { label: "Skills", href: "/#skills" },
  { label: "Work", href: "/#work" },
  { label: "Education", href: "/#path" },
  { label: "Writing", href: "/blog" },
  { label: "Services", href: "/#services" },
  { label: "Contact", href: "/#contact" },
];

export default function Navbar({
  firstName,
  location,
}: {
  firstName: string;
  location: string;
}) {
  // Use the first segment of the CMS location (e.g. "Lisbon, PT — Remote" → "Lisbon")
  const city = location.split(/[,—|]/)[0].trim();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on any click/tap outside the menu or toggle —
  // works globally regardless of scroll position or section.
  useEffect(() => {
    if (!open) return;
    const handlePointer = (e: PointerEvent) => {
      const target = e.target as Node;
      if (menuRef.current?.contains(target) || toggleRef.current?.contains(target))
        return;
      setOpen(false);
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", handlePointer);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("pointerdown", handlePointer);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        scrolled ? "bg-black/20 backdrop-blur-sm" : "bg-transparent"
      }`}
    >
      <nav className="relative z-50 mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3"
          data-testid="nav-logo"
        >
          <span className="grid h-9 w-9 place-items-center rounded-full bg-white font-display text-base font-extrabold text-black">
            {firstName.charAt(0)}
          </span>
          <span className="hidden flex-col leading-none sm:flex">
            <span className="font-display text-base font-extrabold tracking-tight">
              {firstName}
              <span className="text-cyan">.</span>
            </span>
            <span className="label mt-1 !text-[0.58rem] !tracking-[0.22em]">
              Dev · {city}
            </span>
          </span>
        </Link>

        {/* Center capsule — desktop */}
        <div className="glass absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 rounded-full px-2 py-1.5 md:flex">
          {links.slice(0, 6).map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-white/10 hover:text-white"
              data-testid={`nav-link-${l.label.toLowerCase()}`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Right pill — desktop CTA */}
        <Link
          href="/#contact"
          className="hidden items-center rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-zinc-200 md:inline-flex"
          data-testid="nav-contact-cta"
        >
          Let&apos;s talk
        </Link>

        {/* Mobile toggle */}
        <button
          ref={toggleRef}
          className="glass flex h-11 w-11 items-center justify-center rounded-full md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
          aria-expanded={open}
          data-testid="nav-mobile-toggle"
        >
          <div className="space-y-1.5">
            <motion.span
              animate={open ? { rotate: 45, y: 3 } : { rotate: 0, y: 0 }}
              className="block h-px w-5 bg-white"
            />
            <motion.span
              animate={open ? { rotate: -45, y: -3 } : { rotate: 0, y: 0 }}
              className="block h-px w-5 bg-white"
            />
          </div>
        </button>
      </nav>

      {/* Mobile menu — glassmorphism, smooth appear */}
      <AnimatePresence>
        {open && (
          <motion.div
            ref={menuRef}
            key="menu"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ type: "spring", damping: 22, stiffness: 220 }}
            className="relative z-50 px-4 pb-4 md:hidden"
          >
            <div className="glass-panel overflow-hidden rounded-3xl p-3">
              {links.map((l, i) => (
                <MotionLink
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.06 + i * 0.05 }}
                  className="block rounded-2xl px-5 py-4 font-display text-lg font-bold text-zinc-200 transition-colors hover:bg-white/10 hover:text-white"
                  data-testid={`nav-mobile-link-${l.label.toLowerCase()}`}
                >
                  {l.label}
                </MotionLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
