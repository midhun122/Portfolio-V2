// Single source of truth for portfolio content.
// Add a project / post / milestone here — no component edits needed.

export type VisualKind = "aether" | "qr" | "pass" | "event";

export interface Project {
  id: string;
  index: string;
  name: string;
  tagline: string;
  description: string;
  year: string;
  status: string;
  stack: string[];
  github: string;
  live: string | null;
  visual: VisualKind;
}

export interface Post {
  index: string;
  title: string;
  note: string;
  topic: string;
  url: string;
}

export interface Role {
  org: string;
  role: string;
  text: string;
  // Concise takeaway derived strictly from `text` — no new claims.
  takeaway: string;
  period: string;
}

export const roles: Role[] = [
  {
    org: "Edunet Foundation",
    role: "AI Intern",
    text: "AICTE / IBM SkillsBuild program (remote) — instructor-led training in AI/ML concepts and model fundamentals, applied through practical assignments and a mentor-guided AI project.",
    takeaway: "AI/ML fundamentals with a mentor-guided project.",
    period: "Jul – Aug 2026",
  },
  {
    org: "Google",
    role: "Campus Ambassador",
    text: "Selected to represent Google Gemini on campus through the ambassador program, supporting student outreach and awareness of AI tools.",
    takeaway: "Student outreach and awareness of AI tools on campus.",
    period: "Apr – Jul 2026",
  },
];

export interface Milestone {
  phase: string;
  title: string;
  text: string;
  state: "done" | "now" | "next";
}

export interface CapGroup {
  group: string;
  intent: string;
  items: string[];
}

export const projects: Project[] = [
  {
    id: "aether",
    index: "01",
    name: "Aether",
    tagline: "Weather, interpreted — not just reported.",
    description:
      "A weather app that reads between the lines: live conditions from OpenWeatherMap paired with Gemini-generated summaries — what to wear, whether to carry an umbrella, whether it's a good morning for a run. API keys stay hidden behind a Cloudflare Worker proxy.",
    year: "2026",
    status: "Active build",
    stack: ["JavaScript", "Gemini AI", "Cloudflare Workers", "OpenWeatherMap"],
    github: "https://github.com/midhun122/Aether-Weather-app",
    live: "https://midhun122.github.io/Aether-Weather-app/",
    visual: "aether",
  },
  {
    id: "inoqr",
    index: "02",
    name: "INOQR",
    tagline: "QR codes without the clutter.",
    description:
      "A QR generation platform in active development — landing page, static QR generation, customization with live preview, auth, and a personal QR dashboard. Frontend built with React and Vite.",
    year: "2026",
    status: "In development",
    stack: ["React", "Vite", "TypeScript"],
    github: "https://github.com/midhun122/inoqr-frontend",
    live: null,
    visual: "qr",
  },
  {
    id: "mediqr",
    index: "03",
    name: "MediQR Health",
    tagline: "A health passport that fits in a QR code.",
    description:
      "An experimental digital health identity with an AI prescription reader: scan or upload a prescription and Gemini extracts medicines, dosages, and schedules into a daily plan. Patient and pharmacy views included.",
    year: "2026",
    status: "Experiment",
    stack: ["React", "Tailwind", "Gemini AI", "QR tooling"],
    github: "https://github.com/midhun122/MediQR-health",
    live: null,
    visual: "pass",
  },
  {
    id: "techfest",
    index: "04",
    name: "TechFest Site",
    tagline: "An event page built for phones first.",
    description:
      "A responsive event website with a performance-tuned fixed header and a scalable component structure. An ongoing exercise in mobile-first layout, polish, and load performance.",
    year: "2026",
    status: "Work in progress",
    stack: ["React", "TypeScript", "Tailwind"],
    github: "https://github.com/midhun122/event-website-react",
    live: null,
    visual: "event",
  },
];

export const posts: Post[] = [
  {
    index: "01",
    title:
      "The CUDA Monopoly: Why AI Developers Still Struggle to Ditch NVIDIA in 2026",
    note: "The moat isn't the silicon — it's eighteen years of software around it.",
    topic: "AI / Systems",
    url: "https://blog.inovuslabs.org/the-cuda-monopoly-why-ai-developers-still-struggle-to-ditch-nvidia-in-2026/",
  },
  {
    index: "02",
    title: "The 2006 C++ Hack That Tricked Graphics Cards Into Powering AI",
    note: "Part one of a two-part history of the software bet that built modern AI.",
    topic: "AI / History",
    url: "https://blog.inovuslabs.org/the-2006-c-hack-that-tricked-graphics-cards-into-powering-ai/",
  },
  {
    index: "03",
    title: "My First Blog: How Arduino Got Me Hooked on Tech",
    note: "Where the browser ends and the breadboard begins.",
    topic: "Hardware",
    url: "https://blog.inovuslabs.org/my-first-blog-how-arduino-got-me-hooked-on-tech/",
  },
];

export const journey: Milestone[] = [
  {
    phase: "Foundations",
    title: "The core trio",
    text: "HTML, CSS, JavaScript — layouts from scratch, DOM fundamentals, responsive habits.",
    state: "done",
  },
  {
    phase: "Now",
    title: "React, TypeScript & real projects",
    text: "Component architecture, QR tooling, event sites — plus technical writing with Inovus Labs.",
    state: "now",
  },
  {
    phase: "Expanding",
    title: "Backend, AI & cloud",
    text: "Node and APIs, Gemini integrations behind Cloudflare Workers, MCP experiments.",
    state: "now",
  },
  {
    phase: "Next",
    title: "Systems & hardware",
    text: "CUDA notes, embedded experiments with Arduino — the backlog keeps growing.",
    state: "next",
  },
];

export const capabilities: CapGroup[] = [
  {
    group: "Frontend",
    intent: "Interfaces people enjoy using — responsive, fast, accessible.",
    items: ["React", "JavaScript", "TypeScript", "HTML", "CSS", "Tailwind"],
  },
  {
    group: "Backend / Web",
    intent: "APIs and serverless glue that stay out of the way.",
    items: ["Node", "APIs", "Cloudflare Workers", "Python"],
  },
  {
    group: "Cloud / Tools",
    intent: "Shipping habits — versioned, deployed, repeatable.",
    items: ["Git", "GitHub", "Vite", "Vercel", "GitHub Pages", "VS Code", "Figma"],
  },
  {
    group: "Exploring",
    intent: "The frontier queue — models, protocols, silicon.",
    items: ["AI / LLMs", "MCP", "Next.js", "CUDA", "Embedded / Arduino"],
  },
];

export const marqueeItems: string[] = [
  "React",
  "TypeScript",
  "JavaScript",
  "Tailwind",
  "Node",
  "Gemini AI",
  "Cloudflare",
  "MCP",
  "Arduino",
  "Git & GitHub",
];

export const links = {
  github: "https://github.com/midhun122",
  linkedin: "https://www.linkedin.com/in/midhunsujithnair/",
  blog: "https://blog.inovuslabs.org/author/midhun/",
  email: "midhunsujith42@gmail.com",
  formspree: "https://formspree.io/f/mjgaepkk",
  // Static asset: place the file at public/Midhun_Sujith_Nair_Resume.pdf
  // (it ships to dist/ on build; update by replacing that file).
  resume: "./Midhun_Sujith_Nair_Resume.pdf",
  resumeFilename: "Midhun_Sujith_Nair_Resume.pdf",
};
