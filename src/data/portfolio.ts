// Portfolio-ийн бүх контент энд байна — өөрийн мэдээллээр солиорой.

export interface Profile {
  name: string;
  /** Hero дээр хоёр мөрөнд хувааж харуулах нэр */
  heroLines: [string, string];
  role: string;
  age: number;
  experience: string;
  location: string;
  timeZone: string;
  email: string;
  github: string;
  intro: string;
  about: string;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  year: string;
  description: string;
  tags: string[];
  /** Картын генератив арт-д хэрэглэх 3 өнгө */
  palette: [string, string, string];
  link: string;
}

export interface StackGroup {
  title: string;
  description: string;
  items: string[];
  color: string;
  ink: string;
}

export interface Experience {
  period: string;
  role: string;
  company: string;
  description: string;
}

export interface HardwarePart {
  name: string;
  detail: string;
}

export interface HardwareProject {
  event: string;
  title: string;
  tagline: string;
  description: string;
  pipeline: HardwarePart[];
  contributions: string[];
  stats: { value: string; label: string }[];
  repo: string;
  site: string;
}

export interface Social {
  label: string;
  href: string;
}

export interface NavLink {
  label: string;
  target: string;
}

export const profile: Profile = {
  name: "Bilguuntogs",
  heroLines: ["Bilguun", "togs"],
  role: "Junior Developer",
  age: 20,
  experience: "1 year",
  location: "Ulaanbaatar, Mongolia",
  timeZone: "Asia/Ulaanbaatar",
  email: "hello@example.com",
  github: "Libguutei",
  intro:
    "20-year-old junior developer with a year of hands-on experience — building with React, Next.js and TypeScript, from web apps all the way down to hardware.",
  about:
    "I'm a 20-year-old junior developer from Ulaanbaatar with one year of hands-on experience. I build full-stack apps with React, Next.js and TypeScript, connect them to real databases — and most recently took my code down to the metal with an ESP32 smart water coaster at PineQuest.",
};

export const navLinks: NavLink[] = [
  { label: "Home", target: "#home" },
  { label: "About", target: "#about" },
  { label: "Stack", target: "#stack" },
  { label: "Projects", target: "#featured" },
  { label: "PineQuest", target: "#pinequest" },
  { label: "Work", target: "#work" },
  { label: "GitHub", target: "#github" },
  { label: "Contact", target: "#contact" },
];

export const skills: string[] = [
  "React",
  "Next.js",
  "TypeScript",
  "JavaScript",
  "Tailwind CSS",
  "shadcn/ui",
  "Prisma",
  "PostgreSQL",
  "MongoDB",
  "Cloudflare D1",
  "ESP32",
  "Bluetooth LE",
];

export const stack: StackGroup[] = [
  {
    title: "Frontend",
    description: "My daily stack — typed, component-driven interfaces that feel fast.",
    items: ["React", "Next.js", "TypeScript", "JavaScript", "Tailwind CSS", "shadcn/ui", "Zustand", "GSAP"],
    color: "#d4ff3a",
    ink: "#0b0b0c",
  },
  {
    title: "Backend",
    description: "APIs and server logic behind my GitHub projects.",
    items: ["Next.js API Routes", "Node.js", "Bun", "Cloudflare Workers", "JWT auth", "Resend", "UploadThing", "Vercel Blob"],
    color: "#6b5bff",
    ink: "#f1ede4",
  },
  {
    title: "Database",
    description: "Relational and document data, modelled and migrated properly.",
    items: ["PostgreSQL", "Prisma ORM", "MongoDB", "Mongoose", "Cloudflare D1", "SQL migrations", "IndexedDB"],
    color: "#ff5b2e",
    ink: "#0b0b0c",
  },
  {
    title: "Hardware & AI",
    description: "Where code meets the physical world — and a bit of AI on top.",
    items: ["ESP32", "Arduino", "HX711 load cell", "Bluetooth LE", "Capacitor (Android/iOS)", "Gemini API", "Claude API"],
    color: "#f1ede4",
    ink: "#0b0b0c",
  },
];

const gh = (repo: string) => `https://github.com/Libguutei/${repo}`;

export const projects: Project[] = [
  {
    id: "01",
    title: "Liquor Shop",
    category: "Full-stack e-commerce",
    year: "2026",
    description: "Online store with auth, admin dashboard, image uploads and transactional emails.",
    tags: ["Next.js", "Prisma", "PostgreSQL", "JWT", "UploadThing", "Resend", "Zustand"],
    palette: ["#ff5b2e", "#ffb347", "#2a0a00"],
    link: gh("liqour-shop"),
  },
  {
    id: "02",
    title: "Food Delivery",
    category: "Full-stack platform",
    year: "2026",
    description: "Food ordering app with REST API routes, user roles, file storage and order flow.",
    tags: ["Next.js", "Prisma", "PostgreSQL", "Vercel Blob", "JWT"],
    palette: ["#d4ff3a", "#2ee59d", "#06140c"],
    link: gh("food-delivery-app"),
  },
  {
    id: "03",
    title: "AI Image Generator",
    category: "AI web app",
    year: "2026",
    description: "Generates and analyzes images by combining several AI providers behind one UI.",
    tags: ["Next.js", "Gemini", "Hugging Face", "Claude API"],
    palette: ["#6b5bff", "#c1b8ff", "#0c0730"],
    link: gh("AI-image-generator"),
  },
  {
    id: "04",
    title: "MovieWeb",
    category: "Frontend",
    year: "2026",
    description: "Movie discovery site with carousels, search, detail pages and dark mode.",
    tags: ["Next.js", "Axios", "shadcn/ui", "Swiper"],
    palette: ["#ff3d8b", "#ffd1e3", "#2a0016"],
    link: gh("MovieWeb-app"),
  },
  {
    id: "05",
    title: "Todo API",
    category: "Backend",
    year: "2026",
    description: "CRUD REST API built on Next.js route handlers with a MongoDB database.",
    tags: ["Next.js API", "MongoDB", "Mongoose"],
    palette: ["#00c2ff", "#a8ecff", "#001a24"],
    link: gh("next-todo-api"),
  },
  {
    id: "06",
    title: "Soulslike",
    category: "Game",
    year: "2026",
    description: "A small action game prototype in the browser, written fully in TypeScript.",
    tags: ["Phaser", "Vite", "TypeScript"],
    palette: ["#ffcc00", "#fff1a8", "#1f1500"],
    link: gh("soulslike"),
  },
];

export const hardware: HardwareProject = {
  event: "PineQuest S5 · Episode 2 · Team 3",
  title: "Дусал",
  tagline: "Smart water coaster",
  description:
    "Put any cup on the coaster — it weighs the water, counts every sip on its own and sends it to the phone over Bluetooth. No Wi-Fi needed.",
  pipeline: [
    { name: "Load cell", detail: "5 kg strain gauge" },
    { name: "HX711", detail: "24-bit ADC" },
    { name: "ESP32", detail: "WROOM-32 + OLED" },
    { name: "Bluetooth LE", detail: "no Wi-Fi" },
    { name: "Android app", detail: "Capacitor" },
    { name: "Cloud", detail: "Workers + D1" },
  ],
  contributions: [
    "Sip detection logic: counts drinks from 5 ml, senses weight from 2 g, measures in ~1.7 s",
    "Stable readings — averages 4 samples after the cup settles, auto-logs drops over 100 ml",
    "Coaster standby screen that wakes on weight change and sleeps after 10 s",
    "One shared Bluetooth connection across app tabs, no location permission needed",
    "Water-wave tab transitions, swipe navigation and native notifications",
    "Daily settings stored in Cloudflare D1 with weather-based goals",
  ],
  stats: [
    { value: "120", label: "commits by me" },
    { value: "5 ml", label: "sip precision" },
    { value: "1.7 s", label: "per measurement" },
  ],
  repo: "https://github.com/pinecone-studio/pinequest-s5-episode-2-team-3",
  site: "https://dusal.bbek3201.workers.dev",
};

export type FeaturedVisual = "vesta" | "safepath" | "malchin";

export interface FeaturedProject {
  id: string;
  event: string;
  title: string;
  tagline: string;
  description: string;
  role: string[];
  stack: string[];
  stats: { value: string; label: string }[];
  links: { label: string; href: string }[];
  /** Панелын өнгө: дэвсгэр, текст, онцлох өнгө */
  theme: { bg: string; fg: string; accent: string };
  visual: FeaturedVisual;
}

export const featured: FeaturedProject[] = [
  {
    id: "01",
    event: "Pinecone Intern 4AB · Sep 2026",
    title: "Vesta",
    tagline: "See it on. Before you buy it.",
    description:
      "AI fashion platform — 3D outfit models from real photos, an AI wardrobe, 2D virtual try-on and swipe-to-style recommendations.",
    role: [
      "2D outfit viewer & try-on studio with an interactive clothing carousel",
      "AI wardrobe: category-aware uploads, garment recognition, background removal",
      "Swipe browsing with try-on and AI outfit rating actions",
      "Body-photo validation and AI stylist chat services",
    ],
    stack: ["Next.js 16", "React Three Fiber", "Gemini", "Cloudflare Workers", "D1 + Drizzle", "Nx"],
    stats: [
      { value: "86", label: "commits" },
      { value: "2D + 3D", label: "outfit viewer" },
      { value: "AI", label: "stylist & rating" },
    ],
    links: [{ label: "Private repo · Pinecone", href: "https://github.com/pinecone-studio" }],
    theme: { bg: "#f3e9ff", fg: "#1b0b2e", accent: "#8b3dff" },
    visual: "vesta",
  },
  {
    id: "02",
    event: "PineQuest S5 · Episode 1 · Team 2",
    title: "SafePath",
    tagline: "Get kids home safely.",
    description:
      "Child-safety app for parents and kids — live location sharing, safe zones, camera navigation with AI scene recognition and offline routing.",
    role: [
      "Parent dashboard: battery, connection-loss and surroundings-photo alerts",
      "Safe zones: tap a point on the map, set a radius, auto-named",
      "Offline routing home with saved routes, map rotating with the compass",
      "Build-your-own AI buddy for kids that speaks proper Mongolian",
    ],
    stack: ["Next.js 16", "Capacitor Android", "Leaflet", "Gemini Vision", "ElevenLabs TTS", "PWA"],
    stats: [
      { value: "140+", label: "commits · #1" },
      { value: "6", label: "milestones" },
      { value: "0 net", label: "offline routing" },
    ],
    links: [{ label: "View repo", href: "https://github.com/pinecone-studio/pinequest-s5-episode-1-team-2" }],
    theme: { bg: "#e6fff1", fg: "#04261a", accent: "#00a86b" },
    visual: "safepath",
  },
  {
    id: "03",
    event: "Team game · Jul — Aug 2026",
    title: "Malchin",
    tagline: "Нүүдэлчин — survive the steppe.",
    description:
      "A Mongolian herder survival game in the browser: raise five kinds of livestock, survive seasons, fight wolves and spirits, and save your family.",
    role: [
      "Combat mechanics wired into the player and livestock modules",
      "Seeded procedural terrain generation",
      "Elder dialogue system, HUD and story text fixes",
    ],
    stack: ["Next.js", "React", "HTML Canvas", "TypeScript"],
    stats: [
      { value: "18", label: "story goals" },
      { value: "153", label: "culture quiz Qs" },
      { value: "5", label: "livestock types" },
    ],
    links: [{ label: "View repo", href: "https://github.com/btsolmon/Malchin" }],
    theme: { bg: "#1a1030", fg: "#fff4e0", accent: "#ffb347" },
    visual: "malchin",
  },
];

export const experience: Experience[] = [
  {
    period: "2026 — Episode 2",
    role: "Hardware & Full-stack Dev",
    company: "PineQuest S5 · «Дусал»",
    description:
      "Built the ESP32 coaster's sip-detection logic, Bluetooth link and the mobile app's animated UI. 120 commits in a team of five.",
  },
  {
    period: "2026 — Episode 1",
    role: "Full-stack Developer",
    company: "PineQuest S5 · SafePath",
    description:
      "Top contributor (143 commits) on a child-safety app: live location sharing, safe zones with radius, landmarks and parent/child screens.",
  },
  {
    period: "2026 — Sep",
    role: "Full-stack Developer",
    company: "Pinecone Intern · Vesta",
    description:
      "Built the 2D try-on studio, AI wardrobe uploads and swipe-to-style flow of an AI fashion platform in an Nx monorepo. 86 commits.",
  },
  {
    period: "2026 — Jul / Aug",
    role: "Game Developer",
    company: "Malchin — Нүүдэлчин",
    description:
      "Worked on the combat mechanics, seeded terrain and elder dialogue of a Mongolian herder survival game on HTML canvas.",
  },
  {
    period: "2025 — 2026",
    role: "Junior Developer",
    company: "Self-driven projects",
    description:
      "From DOM basics to React, Next.js, Prisma, PostgreSQL and MongoDB — shipping a new project almost every month.",
  },
];

export const socials: Social[] = [
  { label: "GitHub", href: "https://github.com/Libguutei" },
  { label: "LinkedIn", href: "https://www.linkedin.com/" },
  { label: "Instagram", href: "https://www.instagram.com/" },
];
