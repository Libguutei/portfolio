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
  role: "Junior хөгжүүлэгч",
  age: 20,
  experience: "1 жил",
  location: "Улаанбаатар, Монгол",
  timeZone: "Asia/Ulaanbaatar",
  email: "hello@example.com",
  github: "Libguutei",
  intro:
    "20 настай junior хөгжүүлэгч, ажиллаад нэг жил болж байна. Доош гүйлгээд миний хийсэн төслүүдийн хажуугаар нисээрэй.",
  about:
    "React, Next.js, TypeScript ашиглан full-stack апп хийдэг. Сүүлийн үед тэдгээртэй холбогддог төхөөрөмж ч бүтээж байна.",
};

/** Аяллын дараалал — DOM дахь section-уудын id-тай таарна */
export const stops: Stop[] = [
  { id: "about", place: "Үүлсийн дээр", km: 10 },
  { id: "orbit", place: "Дэлхийн ойрын тойрог зам", km: 400 },
  { id: "moon", place: "Сар", km: 384_400 },
  { id: "mars", place: "Ангараг", km: 225_000_000 },
  { id: "belt", place: "Астероидын бүс", km: 350_000_000 },
  { id: "rocks", place: "Бүсийн гүнд", km: 420_000_000 },
  { id: "europa", place: "Европа", km: 628_000_000 },
  { id: "saturn", place: "Санчир", km: 1_270_000_000 },
  { id: "deep", place: "Гүн огторгуй", km: 4_500_000_000 },
  { id: "signal", place: "Нар", km: 149_600_000 },
];

export const stack: StackGroup[] = [
  {
    title: "Frontend",
    note: "Өдөр бүр ашигладаг зүйлс.",
    items: ["React", "Next.js", "TypeScript", "JavaScript", "Tailwind CSS", "shadcn/ui", "Zustand", "GSAP"],
  },
  {
    title: "Backend",
    note: "GitHub дээрх төслүүдийн минь серверийн тал.",
    items: ["Next.js API routes", "Node.js", "Bun", "Cloudflare Workers", "Hono", "JWT auth", "Resend", "UploadThing"],
  },
  {
    title: "Өгөгдлийн сан",
    note: "Харилцаат болон баримтат өгөгдөл.",
    items: ["PostgreSQL", "Prisma", "MongoDB", "Mongoose", "Cloudflare D1", "Drizzle", "IndexedDB"],
  },
  {
    title: "Hardware ба AI",
    note: "Код бодит ертөнцтэй уулзах цэг.",
    items: ["ESP32", "Arduino", "HX711 load cell", "Bluetooth LE", "Capacitor", "Gemini API", "Claude API"],
  },
];

export const experience: Experience[] = [
  {
    period: "2025-2026 он",
    role: "Junior хөгжүүлэгч",
    company: "Бие даасан төслүүд",
    description: "From DOM basics to React, Next.js, Prisma, PostgreSQL and MongoDB, shipping a new project almost every month.",
  },
  {
    period: "2026 оны 7-8 сар",
    role: "Тоглоом хөгжүүлэгч",
    company: "Malchin",
    description: "Combat mechanics, seeded terrain and elder dialogue for a Mongolian herder survival game on HTML canvas.",
  },
  {
    period: "2026 оны 9 сар",
    role: "Full-stack хөгжүүлэгч",
    company: "Pinecone интерн хөтөлбөр, Vesta",
    description: "2D try-on studio, AI wardrobe uploads and swipe-to-style for an AI fashion platform in an Nx monorepo. 86 commits.",
  },
  {
    period: "2026 оны 10 сар",
    role: "Full-stack хөгжүүлэгч",
    company: "PineQuest S5 episode 1, SafePath",
    description: "Top contributor with 143 commits on a child-safety app: live location, safe zones, offline routing and an AI buddy.",
  },
  {
    period: "2026 оны 10-11 сар",
    role: "Hardware болон full-stack хөгжүүлэгч",
    company: "PineQuest S5 episode 2, Дусал",
    description: "Sip detection on an ESP32 coaster, the Bluetooth link and the app's animated UI. 120 commits in a team of five.",
  },
];

export const malchin: Mission = {
  title: "Malchin",
  event: "Багийн тоглоом, 2026 оны зун",
  tagline: "Нүүдэлчин: тал нутагт амьд үлд.",
  description:
    "Browser дээр тоглодог монгол малчны амьд үлдэх тоглоом: малаа өсгөж, улирлыг даван туулж, гэр бүлтэйгээ эргэн нийлнэ.",
  part: "Тулааны механик, seed-ээр үүсдэг газар нутаг, өвгөний харилцан яриа.",
  role: [
    "Combat mechanics wired into the player and livestock modules",
    "Seeded procedural terrain",
    "Elder dialogue system, HUD and story text",
  ],
  stack: ["Next.js", "React", "HTML canvas", "TypeScript"],
  facts: [
    { value: "18", label: "түүхийн зорилт" },
    { value: "153", label: "соёлын асуулт" },
    { value: "5", label: "хошуу мал" },
  ],
  links: [
    { label: "Malchin тоглох", href: "https://malchin-zeta.vercel.app" },
    { label: "Эх код", href: "https://github.com/btsolmon/Malchin" },
  ],
  accent: "#ff8a5c",
  shot: { src: malchinShot, device: "browser", url: "malchin-zeta.vercel.app" },
};

export const vesta: Mission = {
  title: "Vesta",
  event: "Pinecone интерн хөтөлбөр, 2026 оны 9 сар",
  tagline: "Худалдаж авахаасаа өмнө өмсөж үз.",
  description:
    "3D хувцасны модел, AI хувцасны шүүгээ, виртуалаар өмсөж үзэх боломжтой AI загварын платформ. Энэ зогсоол шиг, бүсийн хамгийн тод астероидын нэрээр нэрлэгдсэн.",
  part: "2D өмсөж үзэх студи, AI шүүгээнд зураг оруулах, swipe хийж хувцас сонгох хэсэг.",
  role: [
    "2D outfit viewer and try-on studio with a clothing carousel",
    "AI wardrobe with category-aware uploads, garment recognition and background removal",
    "Swipe browsing with try-on and AI outfit rating",
    "Body-photo validation and an AI stylist chat",
  ],
  stack: ["Next.js 16", "React Three Fiber", "Gemini", "Cloudflare Workers", "D1 and Drizzle", "Nx"],
  facts: [
    { value: "86", label: "commit" },
    { value: "2D ба 3D", label: "хувцас харах горим" },
  ],
  links: [{ label: "Хаалттай repository", href: "https://github.com/pinecone-studio" }],
  accent: "#d9c2a3",
};

export const safepath: Mission = {
  title: "SafePath",
  event: "PineQuest S5, episode 1",
  tagline: "Хүүхдүүдийг гэрт нь аюулгүй хүргэе.",
  description:
    "Хүүхдийн аюулгүй байдлын апп: шууд байршил, газрын зураг дээр цагираг хэлбэрээр зурсан аюулгүй бүс, интернэтгүй ч ажилладаг чиглүүлэгч.",
  part: "Эцэг эхийн мэдэгдэл, аюулгүй бүс, офлайн чиглүүлэгч, хүүхдийн AI найз.",
  role: [
    "Parent alerts for low battery, lost connection and surroundings photos",
    "Safe zones: tap a point, set a radius, the name fills itself in",
    "Offline routing home with saved routes and a compass-aligned map",
    "A build-your-own AI buddy for kids that writes proper Mongolian",
  ],
  stack: ["Next.js 16", "Capacitor", "Leaflet", "Gemini Vision", "ElevenLabs", "PWA"],
  facts: [
    { value: "143", label: "commit, багтаа хамгийн олон" },
    { value: "6", label: "гүйцээсэн үе шат" },
  ],
  links: [
    { label: "Апп нээх", href: "https://safepath-indol.vercel.app/" },
    { label: "Эх код", href: "https://github.com/pinecone-studio/pinequest-s5-episode-1-team-2" },
  ],
  accent: "#e8c98f",
  shot: { src: safepathShot, device: "phone", url: "safepath-indol.vercel.app" },
};

export const dusal: HardwareProject = {
  title: "Дусал",
  event: "PineQuest S5, episode 2",
  tagline: "Балгалт бүрийг тоолдог аяганы суурь.",
  description:
    "Аягаа суурин дээр тавихад л балгалт бүрийг тоолж, утсанд тань Bluetooth-ээр дамжуулна. Европа мөсөн доороо далай нуудаг бол энэ нь аяганы доор load cell нуудаг.",
  part: "ESP32 дээрх балгалт илрүүлэлт, Bluetooth холболт, аппын хөдөлгөөнт UI.",
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
    { value: "120", label: "commit" },
    { value: "5 мл", label: "тоолдог хамгийн бага балгалт" },
    { value: "1.7 с", label: "нэг хэмжилтэд" },
  ],
  links: [
    { label: "Апп нээх", href: "https://dusal.bbek3201.workers.dev" },
    { label: "Эх код", href: "https://github.com/pinecone-studio/pinequest-s5-episode-2-team-3" },
  ],
  accent: "#8fd3ff",
  pipeline: [
    { name: "Load cell", detail: "5 кг strain gauge" },
    { name: "HX711", detail: "24-bit ADC" },
    { name: "ESP32", detail: "OLED дэлгэцтэй WROOM-32" },
    { name: "Bluetooth LE", detail: "Wi-Fi хэрэггүй" },
    { name: "Android апп", detail: "Capacitor" },
    { name: "Cloud", detail: "Workers ба D1" },
  ],
  shot: { src: dusalShot, device: "phone", url: "dusal.bbek3201.workers.dev" },
};

const gh = (repo: string) => `https://github.com/Libguutei/${repo}`;

/** Астероидын бүсэд Vesta-гийн хажуугаар эргэлдэх жижиг төслүүд */
export const smallProjects: SmallProject[] = [
  {
    title: "Liquor Shop",
    description: "Нэвтрэлт, админ самбар, зураг оруулалт, захиалгын имэйлтэй онлайн дэлгүүр.",
    tags: ["Next.js", "Prisma", "PostgreSQL", "JWT"],
    link: gh("liqour-shop"),
  },
  {
    title: "Food Delivery",
    description: "API route, хэрэглэгчийн эрх, файл хадгалалттай хоол захиалгын апп.",
    tags: ["Next.js", "Prisma", "Vercel Blob"],
    link: gh("food-delivery-app"),
  },
  {
    title: "AI Image Generator",
    description: "Хэд хэдэн AI үйлчилгээгээр зураг үүсгэж, уншдаг апп.",
    tags: ["Next.js", "Gemini", "Hugging Face"],
    link: gh("AI-image-generator"),
  },
  {
    title: "Mongol Souls",
    description: "Browser дээр ажилладаг soulslike тулаант тоглоомын прототип.",
    tags: ["Phaser", "Vite"],
    link: "https://soulslike-sigma.vercel.app",
    image: soulsShot,
  },
  {
    title: "MovieWeb",
    description: "Carousel, хайлт, dark mode-той кино хайх сайт.",
    tags: ["Next.js", "shadcn/ui"],
    link: gh("MovieWeb-app"),
  },
  {
    title: "Todo API",
    description: "Next.js route handler ба MongoDB дээрх CRUD REST API.",
    tags: ["Next.js", "Mongoose"],
    link: gh("next-todo-api"),
  },
];

export const socials: Social[] = [
  { label: "GitHub", href: "https://github.com/Libguutei" },
  { label: "LinkedIn", href: "https://www.linkedin.com/" },
  { label: "Instagram", href: "https://www.instagram.com/" },
];
