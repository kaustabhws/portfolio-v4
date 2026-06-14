/* ============================================================
   PORTFOLIO CONTENT  —  placeholder data, edit freely.
   ============================================================ */

export const profile = {
  name: "Alex Rivera",
  firstName: "ALEX",
  lastName: "RIVERA",
  role: "Creative Developer",
  tagline: "I build immersive 3D web experiences",
  location: "Lisbon, PT — Remote worldwide",
  email: "hello@alexrivera.dev",
  available: true,
  blurb:
    "Creative developer and 3D web engineer crafting interfaces that feel alive. I blend rigorous frontend engineering with motion, depth, and a love for typography to ship work that surprises and performs.",
  socials: [
    { label: "GitHub", href: "https://github.com" },
    { label: "X / Twitter", href: "https://x.com" },
    { label: "LinkedIn", href: "https://linkedin.com" },
    { label: "Dribbble", href: "https://dribbble.com" },
  ],
};

export const stats = [
  { value: "6+", label: "Years building" },
  { value: "40+", label: "Projects shipped" },
  { value: "20+", label: "Happy clients" },
  { value: "12", label: "Awards & honors" },
];

export type SkillGroup = {
  title: string;
  accent: "cyan" | "magenta" | "yellow";
  items: { name: string; level: number }[];
};

export const skills: SkillGroup[] = [
  {
    title: "Frontend",
    accent: "cyan",
    items: [
      { name: "React / Next.js", level: 96 },
      { name: "TypeScript", level: 92 },
      { name: "Tailwind CSS", level: 95 },
      { name: "Framer Motion", level: 90 },
    ],
  },
  {
    title: "3D / Creative",
    accent: "magenta",
    items: [
      { name: "Three.js / R3F", level: 91 },
      { name: "GLSL Shaders", level: 78 },
      { name: "Blender", level: 70 },
      { name: "WebGL", level: 82 },
    ],
  },
  {
    title: "Engineering",
    accent: "yellow",
    items: [
      { name: "Node.js", level: 85 },
      { name: "Performance", level: 88 },
      { name: "Testing", level: 80 },
      { name: "CI / CD", level: 76 },
    ],
  },
];

export const marqueeSkills = [
  "React",
  "Three.js",
  "Next.js",
  "TypeScript",
  "WebGL",
  "GLSL",
  "Framer Motion",
  "Node.js",
  "Tailwind",
  "Blender",
  "GSAP",
  "Figma",
];

export type Project = {
  title: string;
  category: string;
  year: string;
  description: string;
  tags: string[];
  /** Cover image URL, or "" to render a gradient placeholder. */
  image: string;
  accent: "cyan" | "magenta" | "yellow";
  href: string;
  github?: string;
  liveUrl?: string;
  adminUrl?: string;
  /** Optional throwaway demo creds for the live site. */
  demoEmail?: string;
  demoPassword?: string;
  featured?: boolean;
  /** Slug of a linked blog write-up, if one exists. Card deep-links here. */
  postSlug?: string;
};

export const projects: Project[] = [
  {
    title: "Nebula Commerce",
    category: "3D E-commerce",
    year: "2025",
    description:
      "An immersive product configurator with real-time 3D rendering, letting shoppers customize and rotate products in their browser.",
    tags: ["React Three Fiber", "Next.js", "Stripe"],
    image:
      "https://images.unsplash.com/photo-1489875347897-49f64b51c1f8?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzh8MHwxfHNlYXJjaHwxfHxjb2RpbmclMjBwcm9qZWN0JTIwc2NyZWVuJTIwZGFya3xlbnwwfHx8fDE3ODExODMzMDl8MA&ixlib=rb-4.1.0&q=85&w=1200",
    accent: "cyan",
    href: "#",
    featured: true,
  },
  {
    title: "Aurora Dashboard",
    category: "Data Viz",
    year: "2024",
    description:
      "A glassmorphic analytics suite with animated, interactive charts and a buttery 120fps interface.",
    tags: ["TypeScript", "D3", "WebGL"],
    image:
      "https://images.pexels.com/photos/29579755/pexels-photo-29579755.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    accent: "magenta",
    href: "#",
  },
  {
    title: "Form & Motion",
    category: "Brand Site",
    year: "2024",
    description:
      "Award-winning agency site driven by scroll-linked WebGL transitions and bold editorial typography.",
    tags: ["Three.js", "GLSL", "GSAP"],
    image:
      "https://images.unsplash.com/photo-1622547748225-3fc4abd2cca0?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGNvbG9yZnVsJTIwM2QlMjBzaGFwZXN8ZW58MHx8fHwxNzgxMTgzMzA5fDA&ixlib=rb-4.1.0&q=85&w=1200",
    accent: "yellow",
    href: "#",
  },
  {
    title: "Synth Playground",
    category: "Web Audio",
    year: "2023",
    description:
      "A browser-based synthesizer pairing reactive 3D visuals with the Web Audio API for live performance.",
    tags: ["Web Audio", "R3F", "Canvas"],
    image:
      "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
    accent: "cyan",
    href: "#",
  },
];

export type Service = {
  title: string;
  description: string;
  deliverables: string[];
  accent: "cyan" | "magenta" | "yellow";
  index: string;
};

export const services: Service[] = [
  {
    index: "01",
    title: "Frontend Engineering",
    description:
      "Production-grade React & Next.js apps — accessible, fast, and maintainable, built to scale with your team.",
    deliverables: ["Design systems", "Next.js apps", "Performance audits"],
    accent: "cyan",
  },
  {
    index: "02",
    title: "3D & WebGL",
    description:
      "Interactive 3D experiences with Three.js and React Three Fiber — configurators, hero scenes, and shaders.",
    deliverables: ["R3F scenes", "Custom shaders", "Product configurators"],
    accent: "magenta",
  },
  {
    index: "03",
    title: "Motion & UI/UX",
    description:
      "Micro-interactions, scroll-driven storytelling, and bold interfaces that make brands unforgettable.",
    deliverables: ["Motion design", "Prototyping", "Design direction"],
    accent: "yellow",
  },
];

export type Education = {
  period: string;
  title: string;
  org: string;
  description: string;
  accent: "cyan" | "magenta" | "yellow";
};

export const education: Education[] = [
  {
    period: "2024",
    title: "Awwwards Honoree",
    org: "Site of the Day × 3",
    description:
      "Recognized three times for excellence in interactive 3D web design and creative development.",
    accent: "yellow",
  },
  {
    period: "2021 — Present",
    title: "Senior Creative Developer",
    org: "Independent / Freelance",
    description:
      "Partnering with studios and brands worldwide to ship immersive, high-performance digital products.",
    accent: "cyan",
  },
  {
    period: "2019 — 2021",
    title: "Frontend Engineer",
    org: "Studio Pixelflow",
    description:
      "Led the frontend for award-winning campaigns, building reusable motion systems and WebGL pipelines.",
    accent: "magenta",
  },
  {
    period: "2015 — 2019",
    title: "BSc Computer Science",
    org: "University of Technology",
    description:
      "Specialized in computer graphics and human–computer interaction. Graduated with honors.",
    accent: "cyan",
  },
];

export const aboutImage =
  "https://images.unsplash.com/photo-1623479322729-28b25c16b011?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxOTB8MHwxfHNlYXJjaHwxfHxkZXZlbG9wZXIlMjBwb3J0cmFpdCUyMGRhcmt8ZW58MHx8fHwxNzgxMTgzMzA5fDA&ixlib=rb-4.1.0&q=85&w=900";
