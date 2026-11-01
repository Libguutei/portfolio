// Portfolio-ийн бүх контент энд байна — өөрийн мэдээллээр солиорой.

export interface Profile {
  firstName: string;
  lastName: string;
  role: string;
  location: string;
  timeZone: string;
  email: string;
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
  link?: string;
}

export interface Stat {
  value: number;
  suffix: string;
  label: string;
}

export interface Service {
  title: string;
  description: string;
  points: string[];
  color: string;
  ink: string;
}

export interface Experience {
  period: string;
  role: string;
  company: string;
  description: string;
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
  firstName: "Nasan",
  lastName: "Tuguldur",
  role: "Creative Developer",
  location: "Ulaanbaatar, Mongolia",
  timeZone: "Asia/Ulaanbaatar",
  email: "hello@example.com",
  intro: "I build fast, playful and carefully animated web experiences — from the first sketch to production.",
  about:
    "I'm a developer who sits right between design and engineering. I care about motion, typography and the tiny details that make an interface feel alive — and I write the TypeScript that keeps it all fast, typed and maintainable.",
};

export const navLinks: NavLink[] = [
  { label: "Home", target: "#home" },
  { label: "About", target: "#about" },
  { label: "Work", target: "#work" },
  { label: "Services", target: "#services" },
  { label: "Journey", target: "#journey" },
  { label: "Contact", target: "#contact" },
];

export const skills: string[] = [
  "TypeScript",
  "React",
  "Next.js",
  "GSAP",
  "Node.js",
  "Bun",
  "Tailwind CSS",
  "Prisma",
  "PostgreSQL",
  "Three.js",
  "Figma",
  "Docker",
];

export const projects: Project[] = [
  {
    id: "01",
    title: "Liquor Store",
    category: "E-commerce",
    year: "2026",
    description: "Full-stack shop with an admin dashboard, Prisma models and a smooth checkout flow.",
    tags: ["Next.js", "Prisma", "Tailwind"],
    palette: ["#ff5b2e", "#ffb347", "#2a0a00"],
  },
  {
    id: "02",
    title: "Food Express",
    category: "Delivery platform",
    year: "2025",
    description: "Real-time food delivery backend & client with order tracking and role-based access.",
    tags: ["Node.js", "TypeScript", "PostgreSQL"],
    palette: ["#d4ff3a", "#2ee59d", "#06140c"],
  },
  {
    id: "03",
    title: "Book Server",
    category: "API / Thesis",
    year: "2025",
    description: "Library management REST API built as a diploma project, documented and fully tested.",
    tags: ["Express", "REST", "Docker"],
    palette: ["#6b5bff", "#c1b8ff", "#0c0730"],
  },
  {
    id: "04",
    title: "DOM Playground",
    category: "Experiments",
    year: "2024",
    description: "A set of motion and DOM experiments that became the foundation of this very site.",
    tags: ["Bun", "GSAP", "Canvas"],
    palette: ["#ff3d8b", "#ffd1e3", "#2a0016"],
  },
];

export const stats: Stat[] = [
  { value: 4, suffix: "+", label: "Years writing code" },
  { value: 32, suffix: "", label: "Projects shipped" },
  { value: 12, suffix: "k", label: "Commits pushed" },
  { value: 100, suffix: "%", label: "Typed with TypeScript" },
];

export const services: Service[] = [
  {
    title: "Web Development",
    description: "Production-ready websites and apps with clean, typed, tested code.",
    points: ["React / Next.js", "API design", "Performance"],
    color: "#d4ff3a",
    ink: "#0b0b0c",
  },
  {
    title: "Motion & Interaction",
    description: "Scroll stories, micro-interactions and transitions that feel natural.",
    points: ["GSAP / ScrollTrigger", "Page transitions", "Creative coding"],
    color: "#6b5bff",
    ink: "#f1ede4",
  },
  {
    title: "UI Engineering",
    description: "Design systems and component libraries that scale with your product.",
    points: ["Design systems", "Accessibility", "Tailwind / shadcn"],
    color: "#ff5b2e",
    ink: "#0b0b0c",
  },
  {
    title: "Backend & Data",
    description: "Reliable APIs, databases and deployment pipelines behind the pixels.",
    points: ["Node / Bun", "Prisma / SQL", "Docker"],
    color: "#f1ede4",
    ink: "#0b0b0c",
  },
];

export const experience: Experience[] = [
  {
    period: "2025 — Now",
    role: "Creative Developer",
    company: "Freelance",
    description: "Designing and building animated marketing sites and full-stack products for clients.",
  },
  {
    period: "2024 — 2025",
    role: "Full-stack Developer",
    company: "Studio Project",
    description: "Shipped e-commerce and delivery platforms with Next.js, Prisma and PostgreSQL.",
  },
  {
    period: "2022 — 2024",
    role: "Frontend Developer",
    company: "University & side projects",
    description: "Learned the craft: TypeScript, React, networking, infrastructure and lots of experiments.",
  },
];

export const socials: Social[] = [
  { label: "GitHub", href: "https://github.com/nasantuguldur01" },
  { label: "LinkedIn", href: "https://www.linkedin.com/" },
  { label: "Instagram", href: "https://www.instagram.com/" },
  { label: "Dribbble", href: "https://dribbble.com/" },
];
