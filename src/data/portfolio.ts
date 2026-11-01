// Portfolio-ийн бүх контент энд байна — өөрийн мэдээллээр солиорой.
import malchinShot from "@/assets/projects/malchin.jpg";
import safepathShot from "@/assets/projects/safepath.jpg";
import soulsShot from "@/assets/projects/soulslike.jpg";
import dusalShot from "@/assets/projects/dusal.jpg";

/** Төслийн жинхэнэ screenshot ба түүнийг ямар төхөөрөмжийн хүрээнд харуулах */
export interface Shot {
  src: string;
  device: "browser" | "phone";
  url: string;
}

/** Аяллын нэг зогсоол: section бүр дэлхийгээс хэдэн км зайд байгаа вэ */
export interface Stop {
  id: string;
  place: string;
  km: number;
}

export type PlanetKind = "earth" | "moon" | "mars" | "vesta" | "europa" | "saturn";

export interface Profile {
  name: string;
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

export interface StackGroup {
  title: string;
  note: string;
  items: string[];
}

export interface Mission {
  title: string;
  event: string;
  tagline: string;
  description: string;
  /** Миний хийсэн хэсэг — нэг мөрөөр */
  part: string;
  role: string[];
  stack: string[];
  facts: { value: string; label: string }[];
  links: { label: string; href: string }[];
  accent: string;
  shot?: Shot;
}

export interface SmallProject {
  title: string;
  description: string;
  tags: string[];
  link: string;
  image?: string;
}

export interface Experience {
  period: string;
  role: string;
  company: string;
  description: string;
}

export interface HardwareProject extends Mission {
  pipeline: { name: string; detail: string }[];
  shot: Shot;
}

export interface Social {
  label: string;
  href: string;
}

export const profile: Profile = {
  name: "Bilguuntogs",
  role: "Junior developer",
  age: 20,
  experience: "1 year",
  location: "Ulaanbaatar, Mongolia",
  timeZone: "Asia/Ulaanbaatar",
  email: "hello@example.com",
  github: "Libguutei",
  intro:
    "Junior developer, 20, one year in. Scroll to lift off and fly past the projects I've launched.",
  about:
    "I build full-stack apps with React, Next.js and TypeScript, and lately the hardware they talk to.",
};

/** Аяллын дараалал — DOM дахь section-уудын id-тай таарна */
export const stops: Stop[] = [
  { id: "launch", place: "Ulaanbaatar", km: 0 },
  { id: "about", place: "Above the clouds", km: 10 },
  { id: "orbit", place: "Low Earth orbit", km: 400 },
  { id: "moon", place: "The Moon", km: 384_400 },
  { id: "mars", place: "Mars", km: 225_000_000 },
  { id: "belt", place: "Asteroid belt", km: 350_000_000 },
  { id: "rocks", place: "Deeper in the belt", km: 420_000_000 },
  { id: "europa", place: "Europa", km: 628_000_000 },
  { id: "saturn", place: "Saturn", km: 1_270_000_000 },
  { id: "deep", place: "Deep field", km: 4_500_000_000 },
  { id: "signal", place: "The Sun", km: 149_600_000 },
];

export const stack: StackGroup[] = [
  {
    title: "Frontend",
    note: "What I reach for every day.",
    items: ["React", "Next.js", "TypeScript", "JavaScript", "Tailwind CSS", "shadcn/ui", "Zustand", "GSAP"],
  },
  {
    title: "Backend",
    note: "The server side of my GitHub projects.",
    items: ["Next.js API routes", "Node.js", "Bun", "Cloudflare Workers", "Hono", "JWT auth", "Resend", "UploadThing"],
  },
  {
    title: "Database",
    note: "Relational and document data.",
    items: ["PostgreSQL", "Prisma", "MongoDB", "Mongoose", "Cloudflare D1", "Drizzle", "IndexedDB"],
  },
  {
    title: "Hardware and AI",
    note: "Where code meets the physical world.",
    items: ["ESP32", "Arduino", "HX711 load cell", "Bluetooth LE", "Capacitor", "Gemini API", "Claude API"],
  },
];

export const experience: Experience[] = [
  {
    period: "2025 to 2026",
    role: "Junior developer",
    company: "Self-driven projects",
    description: "From DOM basics to React, Next.js, Prisma, PostgreSQL and MongoDB, shipping a new project almost every month.",
  },
  {
    period: "Jul to Aug 2026",
    role: "Game developer",
    company: "Malchin",
    description: "Combat mechanics, seeded terrain and elder dialogue for a Mongolian herder survival game on HTML canvas.",
  },
  {
    period: "Sep 2026",
    role: "Full-stack developer",
    company: "Pinecone intern program, Vesta",
    description: "2D try-on studio, AI wardrobe uploads and swipe-to-style for an AI fashion platform in an Nx monorepo. 86 commits.",
  },
  {
    period: "Oct 2026",
    role: "Full-stack developer",
    company: "PineQuest S5 episode 1, SafePath",
    description: "Top contributor with 143 commits on a child-safety app: live location, safe zones, offline routing and an AI buddy.",
  },
  {
    period: "Oct to Nov 2026",
    role: "Hardware and full-stack developer",
    company: "PineQuest S5 episode 2, Дусал",
    description: "Sip detection on an ESP32 coaster, the Bluetooth link and the app's animated UI. 120 commits in a team of five.",
  },
];

export const malchin: Mission = {
  title: "Malchin",
  event: "Team game, summer 2026",
  tagline: "Нүүдэлчин: survive the steppe.",
  description:
    "A Mongolian herder survival game in the browser: raise livestock, survive the seasons, bring your family home.",
  part: "Combat mechanics, seeded terrain and the elder's dialogue.",
  role: [
    "Combat mechanics wired into the player and livestock modules",
    "Seeded procedural terrain",
    "Elder dialogue system, HUD and story text",
  ],
  stack: ["Next.js", "React", "HTML canvas", "TypeScript"],
  facts: [
    { value: "18", label: "story goals" },
    { value: "153", label: "culture quiz questions" },
    { value: "5", label: "kinds of livestock" },
  ],
  links: [
    { label: "Play Malchin", href: "https://malchin-zeta.vercel.app" },
    { label: "Source code", href: "https://github.com/btsolmon/Malchin" },
  ],
  accent: "#ff8a5c",
  shot: { src: malchinShot, device: "browser", url: "malchin-zeta.vercel.app" },
};

export const vesta: Mission = {
  title: "Vesta",
  event: "Pinecone intern program, September 2026",
  tagline: "See it on before you buy it.",
  description:
    "An AI fashion platform with 3D outfit models, an AI wardrobe and virtual try-on. Named, like this stop, after the brightest asteroid in the belt.",
  part: "The 2D try-on studio, AI wardrobe uploads and swipe-to-style.",
  role: [
    "2D outfit viewer and try-on studio with a clothing carousel",
    "AI wardrobe with category-aware uploads, garment recognition and background removal",
    "Swipe browsing with try-on and AI outfit rating",
    "Body-photo validation and an AI stylist chat",
  ],
  stack: ["Next.js 16", "React Three Fiber", "Gemini", "Cloudflare Workers", "D1 and Drizzle", "Nx"],
  facts: [
    { value: "86", label: "commits" },
    { value: "2D and 3D", label: "outfit viewers" },
  ],
  links: [{ label: "Private repository", href: "https://github.com/pinecone-studio" }],
  accent: "#d9c2a3",
};

export const safepath: Mission = {
  title: "SafePath",
  event: "PineQuest S5, episode 1",
  tagline: "Get kids home safely.",
  description:
    "A child-safety app: live location, safe zones drawn as rings on the map, and routing that still works offline.",
  part: "Parent alerts, safe zones, offline routing and a kids' AI buddy.",
  role: [
    "Parent alerts for low battery, lost connection and surroundings photos",
    "Safe zones: tap a point, set a radius, the name fills itself in",
    "Offline routing home with saved routes and a compass-aligned map",
    "A build-your-own AI buddy for kids that writes proper Mongolian",
  ],
  stack: ["Next.js 16", "Capacitor", "Leaflet", "Gemini Vision", "ElevenLabs", "PWA"],
  facts: [
    { value: "143", label: "commits, most on the team" },
    { value: "6", label: "milestones shipped" },
  ],
  links: [
    { label: "Open the app", href: "https://safepath-indol.vercel.app/" },
    { label: "Source code", href: "https://github.com/pinecone-studio/pinequest-s5-episode-1-team-2" },
  ],
  accent: "#e8c98f",
  shot: { src: safepathShot, device: "phone", url: "safepath-indol.vercel.app" },
};

export const dusal: HardwareProject = {
  title: "Дусал",
  event: "PineQuest S5, episode 2",
  tagline: "A coaster that counts every sip.",
  description:
    "Put any cup on the coaster and it counts every sip, then tells your phone over Bluetooth. Europa hides an ocean under its ice; this hides a load cell under a cup.",
  part: "Sip detection on the ESP32, the Bluetooth link and the app's animated UI.",
  role: [
    "Sip detection that counts from 5 ml, senses 2 g and measures in about 1.7 s",
    "Stable readings: averages four samples once the cup settles",
    "Standby screen that wakes on weight change and sleeps after 10 s",
    "One shared Bluetooth connection across app tabs, no location permission",
    "Water-wave tab transitions, swipe navigation and native notifications",
    "Daily goals stored in Cloudflare D1 and adjusted for the weather",
  ],
  stack: ["ESP32", "HX711", "Bluetooth LE", "Capacitor", "Cloudflare Workers", "D1"],
  facts: [
    { value: "120", label: "commits" },
    { value: "5 ml", label: "smallest sip it counts" },
    { value: "1.7 s", label: "per measurement" },
  ],
  links: [
    { label: "Open the app", href: "https://dusal.bbek3201.workers.dev" },
    { label: "Source code", href: "https://github.com/pinecone-studio/pinequest-s5-episode-2-team-3" },
  ],
  accent: "#8fd3ff",
  pipeline: [
    { name: "Load cell", detail: "5 kg strain gauge" },
    { name: "HX711", detail: "24-bit ADC" },
    { name: "ESP32", detail: "WROOM-32 with OLED" },
    { name: "Bluetooth LE", detail: "no Wi-Fi" },
    { name: "Android app", detail: "Capacitor" },
    { name: "Cloud", detail: "Workers and D1" },
  ],
  shot: { src: dusalShot, device: "phone", url: "dusal.bbek3201.workers.dev" },
};

const gh = (repo: string) => `https://github.com/Libguutei/${repo}`;

/** Астероидын бүсэд Vesta-гийн хажуугаар эргэлдэх жижиг төслүүд */
export const smallProjects: SmallProject[] = [
  {
    title: "Liquor Shop",
    description: "Store with auth, admin dashboard, image uploads and order emails.",
    tags: ["Next.js", "Prisma", "PostgreSQL", "JWT"],
    link: gh("liqour-shop"),
  },
  {
    title: "Food Delivery",
    description: "Ordering app with API routes, user roles and file storage.",
    tags: ["Next.js", "Prisma", "Vercel Blob"],
    link: gh("food-delivery-app"),
  },
  {
    title: "AI Image Generator",
    description: "Generates and reads images through several AI providers.",
    tags: ["Next.js", "Gemini", "Hugging Face"],
    link: gh("AI-image-generator"),
  },
  {
    title: "Mongol Souls",
    description: "A soulslike action game prototype that runs in the browser.",
    tags: ["Phaser", "Vite"],
    link: "https://soulslike-sigma.vercel.app",
    image: soulsShot,
  },
  {
    title: "MovieWeb",
    description: "Movie discovery with carousels, search and dark mode.",
    tags: ["Next.js", "shadcn/ui"],
    link: gh("MovieWeb-app"),
  },
  {
    title: "Todo API",
    description: "CRUD REST API on Next.js route handlers and MongoDB.",
    tags: ["Next.js", "Mongoose"],
    link: gh("next-todo-api"),
  },
];

export const socials: Social[] = [
  { label: "GitHub", href: "https://github.com/Libguutei" },
  { label: "LinkedIn", href: "https://www.linkedin.com/" },
  { label: "Instagram", href: "https://www.instagram.com/" },
];
