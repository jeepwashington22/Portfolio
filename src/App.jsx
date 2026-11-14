import { Fragment, useEffect, useMemo, useRef, useState } from "react"
import {
  BookOpen,
  BriefcaseBusiness,
  Contact,
  FolderKanban,
  Home,
  LayoutDashboard,
  MessageSquare,
  PanelsTopLeft,
  Phone,
  Search,
  User,
  Code2,          
  LayoutTemplate, 
  Sparkles,       
  WalletCards,    
  Server,
  FileText,
  GraduationCap,
  Linkedin,
  Menu,
  Sparkles as StarSparkle,
  X,
} from "lucide-react"
import { motion, AnimatePresence, useInView, useScroll, useSpring, useTransform } from "framer-motion"
import {
  SiCss,
  SiDocker,
  SiDotnet,
  SiExpress,
  SiFlutter,
  SiFirebase,
  SiGit,
  SiGithub,
  SiGmail,
  SiGoogle,
  SiHtml5,
  SiInstagram,
  SiJavascript,
  SiMongodb,
  SiNextdotjs,
  SiNodedotjs,
  SiOpenai,
  SiPhp,
  SiPython,
  SiReact,
  SiRaspberrypi,
  SiSanity,
  SiTailwindcss,
  SiTypescript,
  SiFacebook,
  SiFigma,
  SiLaravel,
  SiSupabase,
  SiVercel,
  SiVite,
  SiWordpress,
} from "react-icons/si"

import DitherVeil from "./components/DitherVeil"

import ComicPreloader from "./components/ComicPreloader"
import "./App.css"
import preloaderImage1 from "./assets/image1_porfolio.jpg"
import preloaderImage2 from "./assets/image2_porfolio.jpg"
import preloaderImage3 from "./assets/image3_porfolio.jpg"
import preloaderImage4 from "./assets/image4_porfolio.jpg"
import profilePic from "./assets/profilepicc.png"

const projectMediaMap = import.meta.glob(
  "./assets/projectImages/*.{jpg,jpeg,png,webp,mp4}",
  { eager: true, import: "default" },
)

const projectMedia = Object.entries(projectMediaMap)
  .map(([path, src]) => ({
    path,
    src,
    isVideo: path.toLowerCase().endsWith(".mp4"),
  }))
  .sort((a, b) => a.path.localeCompare(b.path))
  const servicesData = [
  {
    id: "frontend",
    label: "Frontend Web",
    icon: LayoutTemplate,
    title: "Frontend Development",
    description: "Turning ideas into scalable, user-friendly web apps with modern interfaces.",
    skills: ["Responsive Web Design", "Single Page Apps (SPA)", "Interactive UIs", "Landing Pages"],
    tools: [
      { icon: SiReact, color: "#61DAFB", name: "React" },
      { icon: SiNextdotjs, color: "#ffffff", name: "Next.js" },
      { icon: SiTypescript, color: "#3178C6", name: "TypeScript" },
      { icon: SiTailwindcss, color: "#06B6D4", name: "Tailwind CSS" },
    ]
  },
  {
    id: "fullstack",
    label: "Full-Stack",
    icon: Server,
    title: "Full-Stack & Backend",
    description: "End-to-end development, shipping real client projects including CMS and e-commerce platforms.",
    skills: ["E-Commerce Platforms", "Custom CMS", "RESTful APIs", "Database Management"],
    tools: [
      { icon: SiNodedotjs, color: "#339933", name: "Node.js" },
      { icon: SiFirebase, color: "#FFCA28", name: "Firebase" },
      { icon: SiMongodb, color: "#47A248", name: "MongoDB" },
    ]
  },
  {
    id: "ai",
    label: "AI Agents",
    icon: Sparkles,
    title: "AI & LLM Integration",
    description: "Building intelligent, context-aware web experiences that solve real problems.",
    skills: ["LLM Integration", "AI Agents", "Automated Workflows", "Prompt Engineering"],
    tools: [
      { icon: SiOpenai, color: "#412991", name: "OpenAI" },
      { icon: SiGoogle, color: "#4285F4", name: "Gemini API" },
      { icon: Code2, color: "#eab308", name: "API Integration" }
    ]
  }
]

const resumeProjects = [
  {
    id: "ark-industries",
    name: "Ark Industries",
    role: "Fullstack Developer",
    link: "https://arkindustriesinc.com/login",
    bullets: [
      "Developed a geofencing and geotagging attendance system with location-based time-in/time-out validation.",
      "Implemented an employee scheduling module for managing work shifts.",
      "Built an automated Daily Time Record (DTR) system that calculates attendance and working hours based on time-in/time-out logic.",
      "Maintained and enhanced full-stack web application features for performance and reliability.",
    ],
  },
  {
    id: "infini-stock",
    name: "Infini-Stock",
    role: "Fullstack Developer",
    link: "https://infini-stock.vercel.app/login",
    bullets: [
      "Developed a QR code-based asset tracking system that assigns unique identifiers to monitor and CPU inventory for efficient asset management.",
      "Designed and implemented the mobile application interface and core inventory management logic.",
      "Built role-based access control (RBAC) to manage permissions for adding, editing, and deleting inventory records.",
      "Enhanced inventory organization and tracking through secure, streamlined asset management workflows.",
    ],
  },
  {
    id: "fallguard",
    name: "FallGuard",
    role: "Fullstack Developer",
    link: null,
    bullets: [
      "Developed an IoT-based fall detection system integrating a Raspberry Pi, camera module, and mobile application for real-time elderly monitoring.",
      "Implemented a machine learning-powered detection system to identify potential falls and automatically notify caregivers or family members during emergencies.",
      "Built full-stack features for real-time alerts, device integration, and emergency response to improve elderly safety and reduce response time.",
    ],
  },
]

const resumeEducation = {
  school: "University of Caloocan City",
  degree: "Bachelor of Science in Information Technology",
  period: "June 2023 - Present",
  coursework: [
    "Database Management",
    "Software Engineering",
    "Artificial Intelligence",
    "Programming",
    "Data Structures and Algorithms",
    "Internet of Things",
    "Web Development",
  ],
}

const resumeSkillGroups = [
  {
    label: "Language",
    items: ["React", "TypeScript", "Laravel", "PHP", "Python", "Flutter", "Kotlin", "Java", "JavaScript", "HTML", "CSS"],
  },
  {
    label: "Developer Tools",
    items: ["VS Code", "Figma", "Lovable", "Gemini", "Supabase", "Firebase"],
  },
  {
    label: "Technologies & Frameworks",
    items: ["Windows", "GitHub", "WordPress", "Excel", "Docs"],
  },
]

// Everything below the hero (logo strip, services orbit, about menu, sidebar + tab pages, dock).
// Set to true to bring it all back; nothing was deleted.
const SHOW_REST_OF_PAGE = false

function buildMenuImage(title, subtitle, accent, highlight) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="900" height="900" viewBox="0 0 900 900" fill="none">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#020617" />
          <stop offset="100%" stop-color="#0f172a" />
        </linearGradient>
        <radialGradient id="glow" cx="0.5" cy="0.45" r="0.55">
          <stop offset="0%" stop-color="${accent}" stop-opacity="0.95" />
          <stop offset="60%" stop-color="${accent}" stop-opacity="0.18" />
          <stop offset="100%" stop-color="${accent}" stop-opacity="0" />
        </radialGradient>
      </defs>
      <rect width="900" height="900" rx="80" fill="url(#bg)" />
      <circle cx="450" cy="400" r="255" fill="url(#glow)" />
      <circle cx="650" cy="170" r="70" fill="${highlight}" fill-opacity="0.16" />
      <circle cx="250" cy="680" r="110" fill="${highlight}" fill-opacity="0.08" />
      <path d="M150 620C250 520 330 500 450 520C580 542 660 492 770 362" stroke="${highlight}" stroke-opacity="0.32" stroke-width="4" stroke-linecap="round" stroke-dasharray="8 18" />
      <text x="70" y="220" fill="#f8fafc" font-size="82" font-family="Arial, Helvetica, sans-serif" font-weight="700">${title}</text>
      <text x="70" y="285" fill="#cbd5e1" font-size="34" font-family="Arial, Helvetica, sans-serif">${subtitle}</text>
      <text x="70" y="770" fill="#94a3b8" font-size="28" font-family="Arial, Helvetica, sans-serif">Jeffrey C. Bonina</text>
    </svg>
  `

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

const serviceMenuItems = [
  {
    image: profilePic,
    link: "mailto:jeffreybonina05@gmail.com",
    title: "Introduction",
    description: "Jeffrey C. Bonina, 3rd-year BSIT student at the University of Caloocan City.",
  },
  {
    image: buildMenuImage("My Role", "Full-stack developer and technical researcher.", "#a78bfa", "#c4b5fd"),
    link: "https://www.linkedin.com/in/jeffbonina/",
    title: "My Role",
    description: "Full-stack developer and technical researcher.",
  },
  {
    image: buildMenuImage("Tech Stack", "React, Flutter, Node.js, PHP, Python, Firebase, and Supabase.", "#38bdf8", "#67e8f9"),
    link: "#services",
    title: "Tech Stack",
    description: "React, Flutter, Node.js, PHP, Python, Firebase, and Supabase.",
  },
  {
    image: buildMenuImage("Specialties", "Mobile, web, IoT, and serverless systems.", "#f59e0b", "#fbbf24"),
    link: "#services",
    title: "Specialties",
    description: "Mobile and web applications, IoT integration (Raspberry Pi, ESP32), and serverless backend architectures.",
  },
  {
    image: buildMenuImage("Focus Areas", "Security-first product thinking.", "#22d3ee", "#67e8f9"),
    link: "#services",
    title: "Focus Areas",
    description: "Developing safety and security systems, and implementing strong data privacy and cybersecurity measures.",
  },
]


// Fallback backgrounds for projects that have no image / video
const PROJECT_GRADIENTS = [
  "linear-gradient(135deg, #3b0764 0%, #0f172a 100%)",
  "linear-gradient(135deg, #7c2d12 0%, #1c1917 100%)",
  "linear-gradient(135deg, #064e3b 0%, #0f172a 100%)",
  "linear-gradient(135deg, #1e3a8a 0%, #020617 100%)",
  "linear-gradient(135deg, #831843 0%, #1e1b4b 100%)",
  "linear-gradient(135deg, #713f12 0%, #0c0a09 100%)",
]

function GallerySection({
  title = "PORTFOLIO",
  labelLeft = "JEFFREY",
  labelRight = "BONINA",
  side = "PORTFOLIO GALLERY",
  image,
}) {
  return (
    <section className="gallery-section">
      <h2 className="gallery-title">{title}</h2>

      <div className="gallery-labels">
        <span>{labelLeft}</span>
        <span>{labelRight}</span>
      </div>

      <div className="gallery-frame">
        <div className="gallery-panel gallery-panel--top">
          {image ? <img src={image} alt="" /> : null}
        </div>
        <div className="gallery-panel gallery-panel--bottom">
          <span className="gallery-panel__mark">&lt;/&gt;</span>
        </div>
        <span className="gallery-side">{side}</span>
      </div>
    </section>
  )
}

function AboutNameSection({ first = "JEFFREY", last = "BONINA", image }) {
  // replays every time the section scrolls into view
  const view = { once: false, amount: 0.45 }
  const ease = [0.16, 1, 0.3, 1]

  return (
    <motion.section className="aboutname" initial="hidden" whileInView="show" viewport={view}>
      <motion.h2
        className="aboutname__first"
        variants={{ hidden: { opacity: 0, y: 90 }, show: { opacity: 1, y: 0 } }}
        transition={{ duration: 1.1, ease, delay: 0.1 }}
      >
        {first}
      </motion.h2>

      <div className="aboutname__reflection" aria-hidden="true">
        <motion.span
          className="aboutname__shadow"
          variants={{ hidden: { opacity: 0, x: -120 }, show: { opacity: 1, x: 0 } }}
          transition={{ duration: 1.3, ease, delay: 0.4 }}
        >
          {last}
        </motion.span>
      </div>

      {image ? (
        <motion.img
          src={image}
          alt={`${first} ${last}`}
          className="aboutname__photo"
          style={{ x: "-50%" }}
          variants={{ hidden: { opacity: 0, y: 140, scale: 0.9 }, show: { opacity: 1, y: 0, scale: 1 } }}
          transition={{ duration: 1.2, ease, delay: 0.25 }}
        />
      ) : null}
    </motion.section>
  )
}

// Time from the section becoming visible to the automatic horizontal slide.
// The name pop-in takes ~1.7s, so 3700ms leaves it fully shown for about 2 seconds.
// The scene is 700vh tall: the first 2/3 of the scroll runs the About -> Tech Stack -> curtain animation
// (its timings are written for the old 500vh scene, so they are stretched by this factor),
// the last 1/3 slides the project wheel up over the white "Project Showcase" intro.
const SCENE_STRETCH = 1.5
const ABOUT_SLIDE_DELAY_MS = 800
// slide (1.1s) + About Me pop-in (~2s) after the slide starts
const ABOUT_DONE_DELAY_MS = 1600
// The About text is split into two separate descriptions: top-right and bottom-left
const ABOUT_QUOTES = {
  topRight: {
    label: "WHO I AM",
    text:
      "I'm a CS student who fell in love with building things people actually use. I specialize in frontend-focused full-stack development — turning ideas into scalable, user-friendly web apps using React, TypeScript, Node.js, and Tailwind CSS.",
  },
  bottomLeft: {
    label: "WHAT I BUILD",
    text:
      "I've shipped real client projects including a completed content management system (CMS) and an e-commerce platform. I also build and implement AI agents powered by LLMs, integrating OpenAI and Gemini APIs to create intelligent, context-aware web experiences that solve real problems.",
  },
}
const ABOUT_MARQUEE = ["FRONTEND", "FULL-STACK", "AI AGENTS", "REACT", "TYPESCRIPT", "LLM", "UI / UX"]

// Poster-style About Me: centered glowing red circle, light serif + heavy red sans title, gliding text
const ABOUT_ME_STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@800;900&family=Playfair+Display:ital,wght@0,400;0,500;1,400&display=swap');

.abm{position:relative;flex:0 0 50%;width:100%;height:100%;min-width:0;overflow:hidden;color:#f6eeee;
  background:radial-gradient(110% 90% at 50% 44%,#2b0407 0%,#140103 50%,#070001 100%);
  font-family:'Montserrat',system-ui,sans-serif}
.abm::after{content:"";position:absolute;inset:0;pointer-events:none;z-index:4;
  background:radial-gradient(90% 90% at 50% 50%,transparent 55%,rgba(0,0,0,.55) 100%)}

/* centered circle */
.abm__circleWrap{position:absolute;left:50%;top:44%;width:min(66vh,44vw);aspect-ratio:1;transform:translate(-50%,-50%);z-index:1}
.abm__circle{width:100%;height:100%;border-radius:50%;position:relative;
  background:radial-gradient(circle at 50% 64%,#ff6a45 0%,#ff2312 34%,#d90a00 66%,#8d0000 100%);
  box-shadow:0 0 140px 24px rgba(255,26,0,.32),inset 0 -40px 110px rgba(110,0,0,.55);
  animation:abm-float 9s ease-in-out infinite}
.abm__circle::after{content:"";position:absolute;inset:0;border-radius:50%;
  background:radial-gradient(circle at 50% 70%,rgba(255,190,140,.38),transparent 46%);mix-blend-mode:screen}
@keyframes abm-float{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-1.6vh) scale(1.018)}}

/* centered title under the circle */
.abm__headline{position:absolute;left:50%;bottom:4vh;transform:translateX(-50%);z-index:3;margin:0;text-align:center;line-height:.95;white-space:nowrap}
.abm__serif{display:block;font-family:'Playfair Display',Georgia,serif;font-weight:400;
  font-size:clamp(1.5rem,3.6vw,3.8rem);letter-spacing:-.01em;color:#fff}
.abm__big{display:block;font-weight:900;font-size:clamp(2.6rem,7vw,7.6rem);letter-spacing:-.035em;color:#ff1f12;
  text-shadow:0 0 38px rgba(255,31,18,.45),0 6px 30px rgba(120,0,0,.6);margin-top:.02em}

/* name, top-left */
.abm__id{position:absolute;left:clamp(1.2rem,4vw,4.5rem);top:6vh;z-index:3}
.abm__eyebrow{display:flex;align-items:center;gap:.9rem;font-size:.68rem;font-weight:800;letter-spacing:.34em;color:#ff4a36;margin:0 0 .8rem}
.abm__eyebrow::before{content:"";width:2.6rem;height:2px;background:linear-gradient(90deg,#ff1f12,transparent)}
.abm__name{font-family:'Playfair Display',Georgia,serif;font-weight:500;font-style:italic;
  font-size:clamp(1.3rem,2.4vw,2.4rem);margin:0;color:#fff;line-height:1.05}

/* the two separate descriptions */
.abm__quote{position:absolute;z-index:3;width:clamp(15rem,27vw,26rem)}
.abm__quote--tr{right:clamp(1.2rem,4vw,4.5rem);top:6vh}
.abm__quote--bl{left:clamp(1.2rem,4vw,4.5rem);bottom:9vh}
.abm__mark{display:block;font-family:'Playfair Display',Georgia,serif;font-size:clamp(3rem,5vw,5rem);line-height:.7;color:#ff1f12;
  text-shadow:0 0 24px rgba(255,31,18,.5);margin-bottom:.35rem;height:.5em}
.abm__label{margin:0 0 .7rem;font-size:.62rem;font-weight:800;letter-spacing:.3em;color:#ff4a36}
.abm__text{margin:0;font-size:clamp(.74rem,.45vw + .48rem,.98rem);line-height:1.7;color:rgba(246,238,238,.84);font-weight:500}
.abm__quote--tr{padding-left:1.1rem;border-left:2px solid rgba(255,70,50,.5)}
.abm__quote--bl{padding-left:1.1rem;border-left:2px solid rgba(255,70,50,.5)}
.abm__mask{display:inline-block;overflow:hidden;vertical-align:top;padding-bottom:.12em;margin-bottom:-.12em}
.abm__word{display:inline-block;will-change:transform}

/* endlessly gliding ticker */
.abm__marquee{position:absolute;left:0;right:0;top:44%;z-index:0;overflow:hidden;white-space:nowrap;pointer-events:none;transform:translateY(-50%);
  -webkit-mask-image:linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent);mask-image:linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent)}
.abm__marqueeTrack{display:inline-flex;animation:abm-marquee 36s linear infinite}
.abm__marqueeTrack span{font-weight:900;font-size:clamp(3rem,9vw,9rem);letter-spacing:.04em;padding-right:2.4rem;
  color:transparent;-webkit-text-stroke:1px rgba(255,70,50,.16)}
@keyframes abm-marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}

@media (max-width:900px){
  .abm{display:flex;flex-direction:column;align-items:stretch;padding:3vh 1.3rem 2vh;gap:1.1rem;overflow-y:auto}
  .abm__circleWrap,.abm__headline,.abm__id,.abm__quote{position:relative;left:auto;right:auto;top:auto;bottom:auto;transform:none}
  .abm__circleWrap{width:min(34vh,62vw);margin:0 auto;flex:0 0 auto}
  .abm__headline{order:2;white-space:normal}
  .abm__id{order:3}
  .abm__quote{width:auto;order:4}
  .abm__quote--bl{order:5}
  .abm__marquee{display:none}
}
@media (prefers-reduced-motion:reduce){.abm__circle,.abm__marqueeTrack{animation:none}}
`

// text that rises word by word out of a mask
function GlideWords({ text, active, start = 0 }) {
  const ease = [0.16, 1, 0.3, 1]
  return (
    <p className="abm__text">
      {text.split(" ").map((word, i) => (
        <Fragment key={`${word}-${i}`}>
          <span className="abm__mask">
            <motion.span
              className="abm__word"
              initial={{ y: "120%", opacity: 0 }}
              animate={active ? { y: "0%", opacity: 1 } : { y: "120%", opacity: 0 }}
              transition={{ duration: 0.95, ease, delay: active ? start + i * 0.026 : 0 }}
            >
              {word}
            </motion.span>
          </span>{" "}
        </Fragment>
      ))}
    </p>
  )
}

function AboutMeSection({ active }) {
  const ease = [0.16, 1, 0.3, 1]
  // everything glides in with a soft blur-to-sharp, and replays whenever the page is shown again
  const glide = (from, delay, duration = 1.25) => ({
    initial: { opacity: 0, filter: "blur(12px)", ...from },
    animate: active
      ? { opacity: 1, filter: "blur(0px)", x: 0, y: 0, scale: 1 }
      : { opacity: 0, filter: "blur(12px)", ...from },
    transition: { duration, ease, delay: active ? delay : 0 },
  })

  return (
    <section className="abm">
      <style>{ABOUT_ME_STYLES}</style>

      {/* ticker behind the circle */}
      <motion.div className="abm__marquee" aria-hidden="true" {...glide({ y: 0 }, 1.2, 1.4)}>
        <div className="abm__marqueeTrack">
          {[...ABOUT_MARQUEE, ...ABOUT_MARQUEE, ...ABOUT_MARQUEE, ...ABOUT_MARQUEE].map((item, i) => (
            <span key={`${item}-${i}`}>{item} ✦</span>
          ))}
        </div>
      </motion.div>

      {/* the circle, centered on the page */}
      <div className="abm__circleWrap" aria-hidden="true">
        <motion.div style={{ width: "100%", height: "100%" }} {...glide({ scale: 0.55 }, 0.05, 1.8)}>
          <div className="abm__circle" />
        </motion.div>
      </div>

      {/* top-left: who */}
      <div className="abm__id">
        <motion.p className="abm__eyebrow" {...glide({ x: -60 }, 0.7, 1)}>
          PORTFOLIO · 2026
        </motion.p>
        <motion.h3 className="abm__name" {...glide({ y: 30 }, 0.8)}>
          Jeffrey C. Bonina
        </motion.h3>
      </div>

      {/* top-right description */}
      <div className="abm__quote abm__quote--tr">
        <motion.div {...glide({ x: 80 }, 0.9)}>
          <span className="abm__mark" aria-hidden="true">“</span>
          <p className="abm__label">{ABOUT_QUOTES.topRight.label}</p>
        </motion.div>
        <GlideWords text={ABOUT_QUOTES.topRight.text} active={active} start={1.1} />
      </div>

      {/* bottom-left description */}
      <div className="abm__quote abm__quote--bl">
        <motion.div {...glide({ x: -80 }, 1.3)}>
          <span className="abm__mark" aria-hidden="true">“</span>
          <p className="abm__label">{ABOUT_QUOTES.bottomLeft.label}</p>
        </motion.div>
        <GlideWords text={ABOUT_QUOTES.bottomLeft.text} active={active} start={1.6} />
      </div>

      {/* centered title */}
      <h2 className="abm__headline">
        <motion.span className="abm__serif" {...glide({ x: -140 }, 0.35)}>
          Get to know
        </motion.span>
        <motion.span className="abm__big" {...glide({ x: 160 }, 0.5)}>
          ABOUT ME
        </motion.span>
      </h2>
    </section>
  )
}

// Light theme for My Role (matches the Tech Stack page). Scoped to .myrole and written to beat App.css.
const MYROLE_LIGHT_STYLES = `
.myrole{color:#14161c;background-color:#F4F6F8!important;
  background-image:radial-gradient(ellipse 60% 60% at 10% 90%,rgba(247,181,0,.10),transparent 70%)!important}
.myrole__grid{background-image:linear-gradient(rgba(20,22,28,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(20,22,28,.07) 1px,transparent 1px)!important;
  background-size:56px 56px!important;opacity:1!important;filter:none!important;
  -webkit-mask-image:radial-gradient(70% 70% at 50% 50%,#000 30%,transparent 100%);mask-image:radial-gradient(70% 70% at 50% 50%,#000 30%,transparent 100%)}
.myrole__orb{background:radial-gradient(circle,rgba(139,92,246,.22),transparent 68%)!important;filter:blur(36px)!important;mix-blend-mode:normal!important;opacity:1!important}
.myrole__eyebrow{color:#7c3aed!important}
.myrole__title{color:#0b0c10!important;text-shadow:none!important;-webkit-text-fill-color:#0b0c10!important;background:none!important}
.myrole__lead{color:#4b5160!important}
.myrole__card{background:#fff!important;border:1px solid rgba(20,22,28,.09)!important;
  box-shadow:0 18px 40px -22px rgba(20,22,28,.28),0 2px 6px rgba(20,22,28,.05)!important;backdrop-filter:none!important}
.myrole__card h3{color:#0b0c10!important}
.myrole__card p{color:#5a6070!important}
.myrole__number{color:#7c3aed!important;-webkit-text-stroke:0!important;opacity:1!important}
`

const MYROLE_SURFACE = { backgroundColor: "#F4F6F8" } // light surface (same as --surface-white)

function MyRoleSection({ active }) {
  const ease = [0.16, 1, 0.3, 1]
  const surface = MYROLE_SURFACE
  const reveal = (delay, from) => ({
    initial: { opacity: 0, ...from },
    animate: active ? { opacity: 1, x: 0, y: 0, scale: 1 } : { opacity: 0, ...from },
    transition: { duration: 0.9, ease, delay: active ? delay : 0 },
  })
  const roles = [
    { label: "01", title: "Build the interface", text: "Turn complex ideas into clear, responsive products people enjoy using." },
    { label: "02", title: "Connect the system", text: "Shape the frontend, APIs, data, and automation into one reliable flow." },
    { label: "03", title: "Make it intelligent", text: "Use AI agents and practical LLM integrations to solve real problems." },
  ]

  return (
    <section className="myrole" style={surface}>
      <style>{MYROLE_LIGHT_STYLES}</style>
      <div className="myrole__grid" aria-hidden="true" />
      <div className="myrole__orb myrole__orb--one" aria-hidden="true" />
      <div className="myrole__orb myrole__orb--two" aria-hidden="true" />
      <div className="myrole__layout">
        <motion.div className="myrole__intro" {...reveal(0.1, { y: 48 })}>
          <p className="myrole__eyebrow">THE NEXT CHAPTER</p>
          <h2 className="myrole__title">My Role</h2>
          <p className="myrole__lead">I work across design, code, and intelligence — turning a rough idea into a useful product that can ship.</p>
        </motion.div>
        <div className="myrole__cards">
          {roles.map((role, index) => (
            <motion.article key={role.label} className="myrole__card" {...reveal(0.22 + index * 0.12, { y: 38 })}>
              <span className="myrole__number">{role.label}</span>
              <h3>{role.title}</h3>
              <p>{role.text}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}

// Web tech stack: icons lie like real tiles resting in the four corners (x / y = % of screen, r = tilt in degrees, s = size)
const TECH_ICONS = [
  // bottom-left pile
  { icon: SiReact, color: "#0EA5E9", name: "React", x: 5.5, y: 91, s: 1.15, r: -4 },
  { icon: SiTypescript, color: "#3178C6", name: "TypeScript", x: 12, y: 93, s: 1, r: 7 },
  { icon: SiJavascript, color: "#E6B800", name: "JavaScript", x: 18.5, y: 91.5, s: 1.05, r: -9 },
  { icon: SiTailwindcss, color: "#06B6D4", name: "Tailwind CSS", x: 8.5, y: 79, s: 1.05, r: 11 },
  { icon: SiHtml5, color: "#E34F26", name: "HTML5", x: 15, y: 80.5, s: 0.95, r: -6 },
  { icon: SiExpress, color: "#333333", name: "Express", x: 11.5, y: 67.5, s: 0.9, r: 5 },
  // bottom-right pile
  { icon: SiGithub, color: "#181717", name: "GitHub", x: 94.5, y: 91, s: 1.15, r: 5 },
  { icon: SiGit, color: "#F05032", name: "Git", x: 88, y: 93, s: 0.95, r: -8 },
  { icon: SiFigma, color: "#F24E1E", name: "Figma", x: 81.5, y: 91.5, s: 1.05, r: 10 },
  { icon: SiVercel, color: "#000000", name: "Vercel", x: 91.5, y: 79, s: 0.95, r: -12 },
  { icon: SiWordpress, color: "#21759B", name: "WordPress", x: 85, y: 80.5, s: 1, r: 6 },
  { icon: SiOpenai, color: "#10A37F", name: "OpenAI", x: 88.5, y: 67.5, s: 1, r: -5 },
  // top-left corner
  { icon: SiSupabase, color: "#3ECF8E", name: "Supabase", x: 5.5, y: 9, s: 1.1, r: 6 },
  { icon: SiFirebase, color: "#F59E0B", name: "Firebase", x: 12, y: 7.5, s: 1, r: -7 },
  { icon: SiPhp, color: "#777BB4", name: "PHP", x: 8.5, y: 20, s: 1, r: -10 },
  // top-right corner
  { icon: SiNextdotjs, color: "#111111", name: "Next.js", x: 94.5, y: 9, s: 1.1, r: -6 },
  { icon: SiNodedotjs, color: "#5FA04E", name: "Node.js", x: 88, y: 7.5, s: 1.15, r: 8 },
  { icon: SiCss, color: "#1572B6", name: "CSS3", x: 91.5, y: 20, s: 0.95, r: 11 },
  { icon: SiVite, color: "#8B5CF6", name: "Vite", x: 81.5, y: 9.5, s: 0.95, r: -4 },
  { icon: SiMongodb, color: "#47A248", name: "MongoDB", x: 18.5, y: 9, s: 0.95, r: 9 },
  { icon: SiPython, color: "#3776AB", name: "Python", x: 5.5, y: 31, s: 1, r: -5 },
  { icon: SiLaravel, color: "#FF2D20", name: "Laravel", x: 94.5, y: 31, s: 1, r: 7 },
]

function TechStackSection() {
  const boxRef = useRef(null)
  const [resetKey, setResetKey] = useState(0)

  return (
    <section ref={boxRef} className="techstack">
      <div className="techstack__glow" aria-hidden="true" />

      {/* giant shiny textmark split around the center veil: TECH [veil] STACK */}
      <div className="techstack__bgword" aria-hidden="true">
        <span>TECH</span>
        <span>STACK</span>
      </div>

      {/* DitherVeil in the center: move the cursor over it to reveal the image in colour */}
      <div className="techstack__veil">
        <DitherVeil
          src="https://images.unsplash.com/photo-1737071371043-761e02b1ef95?q=80&w=1400&auto=format&fit=crop"
          fit="cover"
          pattern="floyd"
          pixelSize={2}
          inkColor="#ffffff"
          paperColor="#c98a00"
          revealRadius={220}
          softness={0.6}
          linger={1}
        />
      </div>

      {TECH_ICONS.map((item, i) => {
        const Icon = item.icon

        return (
          <div
            key={`${resetKey}-${item.name}`}
            className="techstack__item"
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
              "--s": item.s,
              "--r": `${item.r}deg`,
            }}
          >
            <motion.div
              className="techstack__tile"
              drag
              dragConstraints={boxRef}
              dragElastic={0.12}
              dragTransition={{ power: 0.25, timeConstant: 220 }}
              whileHover={{ scale: 1.12 }}
              whileDrag={{ scale: 1.25, zIndex: 10 }}
              aria-label={item.name}
            >
              <Icon className="techstack__icon" style={{ color: item.color }} aria-hidden="true" />
              <span className="techstack__name">{item.name}</span>
            </motion.div>
          </div>
        )
      })}

      <p className="techstack__hint">Drag the icons around</p>
      <button type="button" className="techstack__reset" onClick={() => setResetKey((k) => k + 1)}>
        Reset
      </button>
    </section>
  )
}

// Wavy leading edge of a curtain half, as a clip-path polygon (percent of the panel width)
function curtainClip(amp, phase, side) {
  const N = 26
  const pts = []
  for (let i = 0; i <= N; i += 1) {
    const y = i / N
    const w = amp * (Math.sin(y * Math.PI * 5 + phase) + 0.45 * Math.sin(y * Math.PI * 11 - phase * 1.3))
    const x = side === "left" ? 100 + w : w
    pts.push(`${x.toFixed(2)}% ${(y * 100).toFixed(2)}%`)
  }
  return side === "left"
    ? `polygon(0% 0%, ${pts.join(", ")}, 0% 100%)`
    : `polygon(100% 0%, ${pts.join(", ")}, 100% 100%)`
}

// Project Showcase intro: dark red, same surface as the Home section
const SHOWCASE_DARK_STYLES = `
.showcase-intro{background:#0f0204!important}
`

// One pinned (fixed) scene: About stays on screen -> curtain closes over it -> curtain opens on the white Projects section
function PortfolioScrollScene({ image, projects }) {
  const ref = useRef(null)
  const [aboutDone, setAboutDone] = useState(false)
  const [activeProject] = useState(0)
  const current = projects[activeProject] ?? projects[0]

  const doneRef = useRef(false)
  const { scrollY: pageY } = useScroll()

  // Progress is computed from the spacer's live position on every scroll (no cached measurements)
  const clamp01 = (n) => Math.min(1, Math.max(0, n))
  const geom = () => {
    const el = ref.current
    if (!el) return null
    return { top: el.getBoundingClientRect().top + window.scrollY, h: el.offsetHeight, vh: window.innerHeight }
  }
  // entry: the scene slides up over the gallery while the spacer approaches the top of the screen
  const entry = useTransform(pageY, (v) => {
    const g = geom()
    return g ? clamp01((v - (g.top - g.vh)) / g.vh) : 0
  })
  // main: runs while the scene is pinned; stays at 0 until the About intro (name + slide) is done
  const pAll = useTransform(pageY, (v) => {
    const g = geom()
    if (!g || !doneRef.current) return 0
    return clamp01((v - g.top) / (g.h - g.vh))
  })
  // scene progress: About -> My Role tear -> Tech Stack -> curtain -> showcase intro
  const p = useTransform(pAll, (v) => clamp01(v * SCENE_STRETCH))
  const roleT = useTransform(p, [0.02, 0.22], [0, 1])
  // project wheel sliding up over the showcase intro, after a short pause on the intro
  const q = useTransform(pAll, [0.86, 1], [0, 1])

  const stageY = useTransform(entry, (v) => `${(1 - v) * 100}%`)
  const stageVisibility = useTransform(entry, (v) => (v <= 0.001 ? "hidden" : "visible"))

  useEffect(() => {
    doneRef.current = aboutDone
    pageY.set(window.scrollY + 0.001)
    pageY.set(window.scrollY)
  }, [aboutDone, pageY])

  // Hold the page at the pinned About scene until the name -> About Me slide has finished
  useEffect(() => {
    if (aboutDone) return undefined
    const el = ref.current
    if (!el) return undefined

    const pinTop = () => el.getBoundingClientRect().top + window.scrollY
    const atPin = () => window.scrollY >= pinTop() - 2
    const clamp = () => {
      const top = pinTop()
      if (window.scrollY > top) window.scrollTo(0, top)
    }
    const onWheel = (e) => {
      if (e.deltaY > 0 && atPin()) e.preventDefault()
    }
    let touchY = 0
    const onTouchStart = (e) => {
      touchY = e.touches[0].clientY
    }
    const onTouchMove = (e) => {
      if (touchY - e.touches[0].clientY > 0 && atPin()) e.preventDefault()
    }
    const onKey = (e) => {
      if (atPin() && ["ArrowDown", "PageDown", "End", " ", "Spacebar"].includes(e.key)) e.preventDefault()
    }

    clamp()
    window.addEventListener("wheel", onWheel, { passive: false })
    window.addEventListener("touchstart", onTouchStart, { passive: true })
    window.addEventListener("touchmove", onTouchMove, { passive: false })
    window.addEventListener("keydown", onKey)
    window.addEventListener("scroll", clamp, { passive: true })
    return () => {
      window.removeEventListener("wheel", onWheel)
      window.removeEventListener("touchstart", onTouchStart)
      window.removeEventListener("touchmove", onTouchMove)
      window.removeEventListener("keydown", onKey)
      window.removeEventListener("scroll", clamp)
    }
  }, [aboutDone])

  // 1) About tears open to reveal My Role (0.02 -> 0.22)
  // 2) circle mask grows from the top-left corner and reveals Tech Stack (0.28 -> 0.50)
  const circleT = useTransform(p, [0.28, 0.5], [0, 1])
  const techClip = useTransform(circleT, (t) => {
    const r = t * Math.hypot(window.innerWidth, window.innerHeight) * 1.05
    return `circle(${r}px at 0px 0px)`
  })
  const techVisibility = useTransform(circleT, (t) => (t <= 0.001 ? "hidden" : "visible"))
  const ringSize = useTransform(circleT, (t) => `${t * Math.hypot(window.innerWidth, window.innerHeight) * 2.1}px`)
  const ringOpacity = useTransform(circleT, [0, 0.05, 0.9, 1], [0, 1, 1, 0])

  // 3) curtain closes over Tech Stack (0.66 -> 0.80), then opens on Projects (0.84 -> 1)
  const KEYS = [0.66, 0.8, 0.84, 1]
  const leftX = useTransform(p, KEYS, ["-100%", "0%", "0%", "-100%"])
  const rightX = useTransform(p, KEYS, ["100%", "0%", "0%", "100%"])
  const labelOpacity = useTransform(p, [0.74, 0.8, 0.84, 0.9], [0, 1, 1, 0])
  const rodOpacity = useTransform(p, [0.64, 0.7, 0.96, 1], [0, 1, 1, 0])

  // fabric: folds gather while the curtain is open and spread out when it is shut, and drift as it moves
  const pleatNum = useTransform(p, KEYS, [2.4, 7, 7, 2.4])
  const pleat = useTransform(pleatNum, (n) => `${n}vw`)
  const shiftL = useTransform(p, KEYS, ["-6vw", "0vw", "0vw", "-6vw"])
  const shiftR = useTransform(p, KEYS, ["6vw", "0vw", "0vw", "6vw"])

  // wavy edge: ripples hardest while moving, settles to a soft wave when shut
  const amp = useTransform(p, [0, 0.66, 0.72, 0.8, 0.84, 0.9, 1], [0, 0, 5, 1.2, 1.2, 5, 0])
  const clipL = useTransform([amp, p], ([a, v]) => curtainClip(a, v * 60, "left"))
  const clipR = useTransform([amp, p], ([a, v]) => curtainClip(a, v * 60, "right"))

  // projects sit hidden under the closed curtain and are shown only once it is fully shut
  const projectsOpacity = useTransform(p, [0.81, 0.84], [0, 1])
  const projectsVisibility = useTransform(p, (v) => (v < 0.81 ? "hidden" : "visible"))
  const projectsScale = useTransform(p, [0.84, 1], [0.94, 1])
  const markScale = useTransform(q, [0, 1], [1, 1.25])
  const wheelY = useTransform(q, (v) => `${(1 - v) * 100}%`)
  const wheelVisibility = useTransform(q, (v) => (v <= 0.001 ? "hidden" : "visible"))

  // Once the curtain starts opening on the Project Showcase intro, the page takes over by itself:
  // it glides straight on, with no pause, so the projects slide up. No scrolling needed.
  // Scrolling is locked while it runs, and it re-arms when the visitor scrolls back up.
  useEffect(() => {
    const st = { armed: true, busy: false, timer: 0, safety: 0, raf: 0 }
    const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
    const finish = () => {
      st.busy = false
      clearTimeout(st.safety)
    }
    const run = (from, to, dur, done) => {
      const t0 = performance.now()
      const tick = (now) => {
        const t = Math.min(1, (now - t0) / dur)
        window.scrollTo({ top: from + (to - from) * ease(t), behavior: "instant" })
        if (t < 1) {
          st.raf = requestAnimationFrame(tick)
        } else {
          st.raf = 0
          done()
        }
      }
      st.raf = requestAnimationFrame(tick)
    }
    const start = () => {
      const g = geom()
      if (!g) {
        finish()
        return
      }
      const endY = g.top + g.h - g.vh // projects fully slid up
      const from = window.scrollY
      st.safety = window.setTimeout(finish, 9000)
      // one continuous glide, no pause: the intro opens and the projects slide up right away
      if (endY - from < 4) finish()
      else run(from, endY, 3000, finish)
    }
    const onProgress = (v) => {
      if (v < 0.5) {
        if (st.timer || st.raf) {
          clearTimeout(st.timer)
          cancelAnimationFrame(st.raf)
          st.timer = 0
          st.raf = 0
          finish()
        }
        st.armed = true
        return
      }
      // 0.56 = curtain has just closed and begins to open on the intro
      if (v >= 0.56 && st.armed && !st.busy) {
        st.armed = false
        st.busy = true
        start()
      }
    }
    const unsub = pAll.on("change", onProgress)
    const block = (e) => {
      if (st.busy) e.preventDefault()
    }
    const blockKey = (e) => {
      if (st.busy && ["ArrowDown", "ArrowUp", "PageDown", "PageUp", "End", "Home", " ", "Spacebar"].includes(e.key)) e.preventDefault()
    }
    window.addEventListener("wheel", block, { passive: false })
    window.addEventListener("touchmove", block, { passive: false })
    window.addEventListener("keydown", blockKey)
    return () => {
      unsub()
      clearTimeout(st.timer)
      clearTimeout(st.safety)
      cancelAnimationFrame(st.raf)
      window.removeEventListener("wheel", block)
      window.removeEventListener("touchmove", block)
      window.removeEventListener("keydown", blockKey)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pAll])

  return (
    <div ref={ref} className="curtain-wrap">
      <motion.div className="curtain-stage" style={{ y: stageY, visibility: stageVisibility }}>
        <div className="stage-about">
          <AboutSlider image={image} onDoneChange={setAboutDone} tearProgress={roleT} />
        </div>

        {/* Tech Stack: revealed by a circle growing from the top-left corner */}
        <motion.div className="techstack-layer" style={{ clipPath: techClip, visibility: techVisibility }}>
          <TechStackSection />
        </motion.div>
        <motion.div
          className="techstack-edge"
          style={{ width: ringSize, height: ringSize, opacity: ringOpacity }}
          aria-hidden="true"
        />

        <motion.div className="curtain curtain--left" style={{ x: leftX }} aria-hidden="true">
          <motion.div className="curtain__cloth" style={{ clipPath: clipL, "--pleat": pleat, "--shift": shiftL }}>
            <motion.span className="curtain__label curtain__label--left" style={{ opacity: labelOpacity }}>
              SELECTED
            </motion.span>
          </motion.div>
        </motion.div>
        <motion.div className="curtain curtain--right" style={{ x: rightX }} aria-hidden="true">
          <motion.div className="curtain__cloth" style={{ clipPath: clipR, "--pleat": pleat, "--shift": shiftR }}>
            <motion.span className="curtain__label curtain__label--right" style={{ opacity: labelOpacity }}>
              WORK
            </motion.span>
          </motion.div>
        </motion.div>
        <motion.div className="curtain-rod" style={{ opacity: rodOpacity }} aria-hidden="true" />

        {/* 1) white "Project Showcase" intro with a centered textmark */}
        <motion.section className="showcase-intro" style={{ opacity: projectsOpacity, visibility: projectsVisibility, scale: projectsScale }}>
          <style>{SHOWCASE_DARK_STYLES}</style>
          <div aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: -1, overflow: "hidden", pointerEvents: "none", background: "#0f0204" }}>
            <div className="hero-bg" />
            <div className="hero-glow" />
          </div>
          <motion.h2 className="showcase-intro__mark" style={{ scale: markScale }}>
            <span>PROJECT</span>
            <span>SHOWCASE</span>
          </motion.h2>
        </motion.section>

        {/* 2) project wheel: slides up over the intro while scrolling */}
        <motion.section className="projects-white" style={{ y: wheelY, visibility: wheelVisibility }}>
          <div className="projects-white__bgword" aria-hidden="true">PROJECTS</div>

          <header className="projects-white__head">
            <p className="projects-white__eyebrow">Selected Work</p>
            <h2 className="projects-white__title">Projects</h2>
          </header>

          {/* background follows the active project */}
          <div className="projects-white__bg" aria-hidden="true">
            <AnimatePresence initial={false}>
              <motion.div
                key={current.id}
                className="projects-bg__layer"
                style={{ background: PROJECT_GRADIENTS[activeProject % PROJECT_GRADIENTS.length] }}
                initial={{ opacity: 0, scale: 1.08 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              >
                {current.media ? (
                  current.media.isVideo ? (
                    <video src={current.media.src} muted loop autoPlay playsInline />
                  ) : (
                    <img src={current.media.src} alt="" />
                  )
                ) : null}
              </motion.div>
            </AnimatePresence>
            <div className="projects-bg__shade" />
          </div>

          <div className="projects-stage">
            <div className="projects-stage__detail">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                >
                  <span className="projects-detail__meta">
                    {String(activeProject + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")} · {current.year} · {current.status}
                  </span>
                  <h3 className="projects-detail__title">{current.title}</h3>
                  <p className="projects-detail__desc">{current.description}</p>
                  <div className="projects-detail__stack">
                    {current.stack.map((StackIcon, i) => (
                      <span key={`${current.id}-s-${i}`} className="projects-detail__chip">
                        <StackIcon aria-hidden="true" />
                      </span>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.section>
      </motion.div>
    </div>
  )
}


// ---------- Torn paper transition ----------
// Three jagged holes grow from the middle of the About page as you scroll:
//   A = hole in the top paper, B = hole in the white paper core (the fibrous torn rim is the ring A-B),
//   C = soft shadow cast on My Role just inside the rim.
const TEAR_N = 90
const TEAR_REACH = 130 // radius (in % of the screen) that surely covers every corner

function seededRandom(seed) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

const TEAR_SHAPE = (() => {
  const rnd = seededRandom(11)
  return Array.from({ length: TEAR_N }, (_, i) => {
    const a = (i / TEAR_N) * Math.PI * 2
    const lobes = 1 + 0.2 * Math.sin(a * 3 + 1.2) + 0.12 * Math.sin(a * 5 + 0.4)
    const jag = 0.86 + rnd() * 0.3
    const zig = i % 2 === 0 ? 1 : 0.9
    return {
      cos: Math.cos(a),
      sin: Math.sin(a),
      k: lobes * jag * zig,
      delay: rnd(), // some edges rip sooner than others
      rim: 1 + rnd() * 3.2, // thickness of the torn white rim (% of the screen)
    }
  })
})()

const TEAR_OUTER = "0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%"

// Clip-path that keeps everything OUTSIDE the jagged hole. `inset` shrinks the hole's edge by (inset * rim) %.
function tearClip(t, inset = 0) {
  if (t <= 0.0005) return "none"
  const smooth = (v) => v * v * (3 - 2 * v)
  const ax = 0.3 + 0.7 * smooth(Math.min(1, t * 1.15)) // starts as a tall crack, then opens sideways
  const pts = TEAR_SHAPE.map((p) => {
    const u = Math.min(1, Math.max(0, (t - p.delay * 0.35) / 0.65))
    const r = Math.max(0, smooth(u) * TEAR_REACH * p.k - inset * p.rim)
    return `${(50 + p.cos * r * ax).toFixed(2)}% ${(50 + p.sin * r).toFixed(2)}%`
  })
  return `polygon(evenodd, ${TEAR_OUTER}, ${pts.join(", ")}, ${pts[0]}, 0% 0%)`
}

const PAPER_FIBER_TEXTURE =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .45  0 0 0 0 .4  0 0 0 0 .33  0 0 0 .22 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")"

const TEAR_LAYER = { position: "absolute", inset: 0, pointerEvents: "none" }

// Name section -> automatic About slide -> scroll-driven tear -> My Role
function AboutSlider({ image, onDoneChange, tearProgress: rawTear }) {
  // spring-smoothed scroll progress: the paper keeps tearing a moment after the wheel stops, never steps
  const tearProgress = useSpring(rawTear, { stiffness: 80, damping: 26, mass: 0.6, restDelta: 0.0004 })
  const ref = useRef(null)
  const inView = useInView(ref, { amount: 0.6 })
  const [slid, setSlid] = useState(false)
  const [roleActive, setRoleActive] = useState(false)
  const [paperBg, setPaperBg] = useState({ backgroundColor: "#0b0b0d" })

  // The torn paper is the About page itself, so it copies whatever background the About page sits on
  useEffect(() => {
    let el = ref.current
    while (el) {
      const cs = getComputedStyle(el)
      const color = cs.backgroundColor
      const hasColor = color && color !== "rgba(0, 0, 0, 0)" && color !== "transparent"
      if (hasColor || cs.backgroundImage !== "none") {
        setPaperBg({
          backgroundColor: color,
          backgroundImage: cs.backgroundImage,
          backgroundSize: cs.backgroundSize,
          backgroundPosition: cs.backgroundPosition,
        })
        return
      }
      el = el.parentElement
    }
  }, [])

  // hole in the top paper, hole in the white core, and the shadow hole
  const clipPaper = useTransform(tearProgress, (t) => tearClip(t, 0))
  const clipCore = useTransform(tearProgress, (t) => tearClip(t, 1))
  const clipShade = useTransform(tearProgress, (t) => tearClip(t, 2.6))
  const paperVisibility = useTransform(tearProgress, (t) => (t >= 0.999 ? "hidden" : "visible"))
  const roleVisibility = useTransform(tearProgress, (t) => (t <= 0.001 ? "hidden" : "visible"))
  // the paper lifts a touch while it rips
  const paperLift = useTransform(tearProgress, [0, 0.5, 1], [1, 1.012, 1.03])

  useEffect(() => {
    const unsub = tearProgress.on("change", (t) => setRoleActive(t > 0.12))
    return unsub
  }, [tearProgress])

  useEffect(() => {
    if (!inView) {
      setSlid(false)
      return undefined
    }
    const timer = setTimeout(() => setSlid(true), ABOUT_SLIDE_DELAY_MS)
    return () => clearTimeout(timer)
  }, [inView])

  // "done" = the slide to About Me finished and its content popped in
  useEffect(() => {
    if (!slid) {
      onDoneChange?.(false)
      return undefined
    }
    const timer = setTimeout(() => onDoneChange?.(true), ABOUT_DONE_DELAY_MS)
    return () => clearTimeout(timer)
  }, [slid, onDoneChange])

  return (
    <div ref={ref} className="about-slider">
      {/* 1. bottom: My Role, revealed through the hole */}
      <motion.div style={{ ...TEAR_LAYER, zIndex: 1, visibility: roleVisibility, pointerEvents: "auto" }}>
        <MyRoleSection active={roleActive} />
      </motion.div>

      {/* 2. shadow the rim casts onto My Role */}
      <motion.div style={{ ...TEAR_LAYER, zIndex: 2, visibility: roleVisibility, filter: "blur(10px)" }} aria-hidden="true">
        <motion.div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)", clipPath: clipShade }} />
      </motion.div>

      {/* 3. white, fibrous core of the torn paper (only its rim is visible) */}
      <motion.div
        style={{ ...TEAR_LAYER, zIndex: 3, visibility: roleVisibility, filter: "drop-shadow(0 3px 6px rgba(0,0,0,0.35))" }}
        aria-hidden="true"
      >
        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "#f4f0e6",
            backgroundImage: `${PAPER_FIBER_TEXTURE}, linear-gradient(135deg, #fbf8f0, #e9e3d3)`,
            clipPath: clipCore,
          }}
        />
      </motion.div>

      {/* 4. top: the About page, which rips open from the middle */}
      <motion.div
        style={{
          ...TEAR_LAYER,
          zIndex: 4,
          visibility: paperVisibility,
          filter: "drop-shadow(0 8px 18px rgba(0,0,0,0.5))",
        }}
      >
        <motion.div style={{ position: "absolute", inset: 0, overflow: "hidden", ...paperBg, clipPath: clipPaper, scale: paperLift }}>
          <motion.div
            className="about-slider__track"
            animate={{ x: slid ? "-50%" : "0%" }}
            transition={{ duration: 1.1, ease: [0.77, 0, 0.175, 1] }}
          >
            <AboutNameSection image={image} />
            <AboutMeSection active={slid} />
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}

function App() {
  const [activeTab, setActiveTab] = useState("Home")
  const [heroIn, setHeroIn] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [projectQuery, setProjectQuery] = useState("")
  const [projectSort, setProjectSort] = useState("newest")
  const mainScrollRef = useRef(null)
  // Scroll-driven transition: home zooms in -> small circle grows -> gallery section is revealed.
  // The effect runs over the first 200vh of scroll (the spacer below is 300vh tall).
  const { scrollY: pageScrollY } = useScroll()
  const effectLength = () => (typeof window === "undefined" ? 1 : window.innerHeight * 2)
  const heroProgress = useTransform(pageScrollY, (v) => Math.min(1, Math.max(0, v / effectLength())))
  // The hero/gallery layer stays put; the About scene slides over it. Hide it once fully covered.
  const heroLayerVisibility = useTransform(pageScrollY, (v) =>
    typeof window !== "undefined" && v >= window.innerHeight * 2.97 ? "hidden" : "visible",
  )
  const heroZoom = useTransform(heroProgress, [0, 0.6], [1, 1.6])
  const circleScale = useTransform(heroProgress, [0.12, 1], [0, 1])
  const circleOpacity = useTransform(heroProgress, [0.12, 0.16, 0.9, 1], [0, 1, 1, 0])
  const circleClip = useTransform(circleScale, (v) => `circle(${v * 75}vmax at 50% 50%)`)
  const galleryVisibility = useTransform(circleScale, (v) => (v <= 0.001 ? "hidden" : "visible"))
  const [orbitalServiceTab, setOrbitalServiceTab] = useState(null)
  const [activeServiceTab, setActiveServiceTab] = useState("frontend")
  const activeService = servicesData.find((s) => s.id === activeServiceTab)
  const orbitalActiveService = orbitalServiceTab
    ? servicesData.find((s) => s.id === orbitalServiceTab)
    : null

  const theme = {
    shell: "bg-[#080808] text-zinc-100",
    shellOverlay: "bg-[#080808]",
    sidebar: "border-yellow-400/20 bg-zinc-950/30",
    navActive: "bg-yellow-400/12 text-yellow-100",
    navInactive: "text-zinc-300 hover:bg-yellow-400/10 hover:text-yellow-100",
    navIcon: "text-yellow-300",
  }

  const themeClasses = {
    card: "border-zinc-800/80 bg-zinc-950/25",
    text: { primary: "text-zinc-100", secondary: "text-zinc-300", muted: "text-zinc-500" },
    input: "border-zinc-800/80 bg-zinc-950/20 text-zinc-200 placeholder:text-zinc-600 focus:border-zinc-700/80",
    inputIcon: "text-zinc-500",
    border: "border-zinc-800/80",
    divider: "bg-zinc-800/80",
  }

  const techStack = [
    { label: "HTML", icon: SiHtml5, iconClassName: "text-orange-300" },
    { label: "CSS", icon: SiCss, iconClassName: "text-blue-300" },
    { label: "JavaScript", icon: SiJavascript, iconClassName: "text-yellow-300" },
    { label: "TypeScript", icon: SiTypescript, iconClassName: "text-sky-300" },
    { label: "React", icon: SiReact, iconClassName: "text-sky-300" },
    { label: "Next.js", icon: SiNextdotjs, iconClassName: "text-zinc-100" },
    { label: "Tailwind CSS", icon: SiTailwindcss, iconClassName: "text-cyan-300" },
    { label: "Node.js", icon: SiNodedotjs, iconClassName: "text-green-300" },
    { label: "Express", icon: SiExpress, iconClassName: "text-zinc-200" },
    { label: "MongoDB", icon: SiMongodb, iconClassName: "text-emerald-300" },
    { label: "Firebase", icon: SiFirebase, iconClassName: "text-amber-300" },
    { label: "Docker", icon: SiDocker, iconClassName: "text-sky-300" },
    { label: ".NET", icon: SiDotnet, iconClassName: "text-violet-300" },
    { label: "PHP", icon: SiPhp, iconClassName: "text-indigo-300" },
    { label: "Python", icon: SiPython, iconClassName: "text-blue-300" },
    { label: "Flutter", icon: SiFlutter, iconClassName: "text-cyan-300" },
    { label: "Raspberry Pi", icon: SiRaspberrypi, iconClassName: "text-pink-300" },
    { label: "Sanity", icon: SiSanity, iconClassName: "text-red-300" },
    { label: "Git", icon: SiGit, iconClassName: "text-orange-300" },
    { label: "GitHub", icon: SiGithub, iconClassName: "text-zinc-100" },
    { label: "OpenAI", icon: SiOpenai, iconClassName: "text-zinc-100" },
    { label: "Google", icon: SiGoogle, iconClassName: "text-zinc-100" },
    { label: "Gmail", icon: SiGmail, iconClassName: "text-zinc-100" },
    { label: "Instagram", icon: SiInstagram, iconClassName: "text-zinc-100" },
    { label: "Facebook", icon: SiFacebook, iconClassName: "text-zinc-100" },
  ]

  const techStackLoop = techStack.map((item) => ({
    title: item.label,
    node: <item.icon className={`h-8 w-8 ${item.iconClassName ?? "text-zinc-100"}`} aria-hidden="true" />,
  }))

  const solarStars = [
    { left: "12%", top: "18%", size: 2, opacity: 0.75 },
    { left: "22%", top: "10%", size: 1.5, opacity: 0.5 },
    { left: "35%", top: "24%", size: 2.5, opacity: 0.65 },
    { left: "78%", top: "15%", size: 2, opacity: 0.6 },
    { left: "86%", top: "32%", size: 1.5, opacity: 0.5 },
    { left: "72%", top: "78%", size: 2, opacity: 0.55 },
    { left: "18%", top: "74%", size: 1.5, opacity: 0.45 },
    { left: "46%", top: "88%", size: 2.5, opacity: 0.6 },
    { left: "58%", top: "8%", size: 1.5, opacity: 0.45 },
    { left: "90%", top: "68%", size: 2, opacity: 0.7 },
  ]
  const orbitalDust = Array.from({ length: 18 }).map((_, index) => ({
    left: `${(index * 17 + 11) % 100}%`,
    top: `${(index * 29 + 7) % 100}%`,
    size: 1 + (index % 3) * 0.75,
    opacity: 0.2 + (index % 5) * 0.11,
  }))
  // --- ADDED: Services Data ---

  const nav = [
    { label: "Home", icon: Home },
    { label: "About", icon: User },
    { label: "Resume", icon: FileText },
    { label: "Projects", icon: FolderKanban },
    { label: "Tutorials", icon: BookOpen },
    { label: "Dashboard", icon: LayoutDashboard },
    { label: "Chat Room", icon: MessageSquare },
    { label: "Services", icon: BriefcaseBusiness },
    { label: "Contact", icon: Contact },
    { label: "Showcase", icon: PanelsTopLeft },
  ]

  const projects = useMemo(() => {
    const items = Array.from({ length: 6 }).map((_, index) => {
      const media = projectMedia.length
        ? projectMedia[index % projectMedia.length]
        : null

      return {
        id: `project-${index + 1}`,
        title: index === 0 ? "ResQWave" : `Project ${index + 1}`,
        status: "Completed",
        featured: index === 1,
        description:
          "A modern, responsive web app built with a focus on clean UI, performance, and scalable architecture.",
        media,
        stack: [SiReact, SiTypescript, SiTailwindcss, SiNodedotjs, SiMongodb, SiGithub],
        year: 2026 - (index % 3),
      }
    })

    const q = projectQuery.trim().toLowerCase()
    const filtered = q
      ? items.filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q),
        )
      : items

    const sorted = [...filtered].sort((a, b) =>
      projectSort === "oldest" ? a.year - b.year : b.year - a.year,
    )

    return sorted
  }, [projectQuery, projectSort])

  const contacts = [
    {
      label: "Instagram",
      href: "https://instagram.com/beaalyssalugtup",
      icon: SiInstagram,
    },
    {
      label: "Gmail",
      href: "mailto:jeffreybonina05@gmail.com",
      icon: SiGmail,
    },
    {
      label: "Facebook",
      href: "https://facebook.com/your.profile",
      icon: SiFacebook,
    },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/jeffbonina/",
      icon: Linkedin,
    },
    {
      label: "Phone",
      href: "tel:+639763726478",
      icon: Phone,
    },
  ]

  const handleNavClick = (label) => {
    setActiveTab(label)
    setIsSidebarOpen(false)
    mainScrollRef.current?.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <>
      <ComicPreloader
        images={[preloaderImage1, preloaderImage2, preloaderImage3, preloaderImage4]}
        onReveal={() => setHeroIn(true)}
      />
            <div className="relative h-[300vh]">
            <motion.div style={{ visibility: heroLayerVisibility }} className="fixed inset-0 z-10 h-[100svh] w-full overflow-hidden bg-[#0f0204]">
            <motion.div style={{ scale: heroZoom }} className="h-full w-full">
            <section className="hero-shell relative isolate h-[100svh] w-full overflow-hidden border border-rose-300/20 bg-[#0f0204] px-5 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-10">
              <div className="absolute inset-0 overflow-hidden">
                <motion.div
                  className="absolute inset-0"
                  initial={{ scale: 1.6 }}
                  animate={{ scale: heroIn ? 1 : 1.6 }}
                  transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="hero-bg" aria-hidden="true" />
                  <div className="hero-glow" aria-hidden="true" />
                </motion.div>
              </div>
              {/* BACKGROUND TEXTMARK: big </> glyph + sliding cursive lorem text */}
              <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 select-none"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={heroIn ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.7 }}
                transition={{ duration: 1.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="hero-codemark">&lt;/&gt;</span>
                </div>

                <div className="hero-marquee">
                  <div className="hero-marquee__track">
                    {[0, 1].map((copy) => (
                      <span key={copy} className="hero-marquee__text">
                        Lorem ipsum dolor sit amet ✦ consectetur adipiscing elit ✦ sed do eiusmod tempor ✦{" "}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </section>
            </motion.div>

            {/* Next section, revealed through a circle that grows while scrolling */}
            <motion.div style={{ clipPath: circleClip, visibility: galleryVisibility }} className="absolute inset-0 z-20 will-change-[clip-path]">
              <GallerySection image={profilePic} />
            </motion.div>

            {/* Growing ring edge of the circle */}
            <motion.div
              aria-hidden="true"
              style={{ x: "-50%", y: "-50%", scale: circleScale, opacity: circleOpacity }}
              className="pointer-events-none absolute left-1/2 top-1/2 z-30 h-[150vmax] w-[150vmax] rounded-full border-[18px] border-yellow-400/40 will-change-transform"
            />
            </motion.div>
            </div>

            {/* About me: slides in under the gallery once the transition is done */}
            <PortfolioScrollScene image={profilePic} projects={projects} />

            {SHOW_REST_OF_PAGE ? (
            <>
            <section className="relative w-full border-t border-yellow-400/20 bg-[#080808] px-5 py-3 sm:px-8 lg:px-10">
              <div className="mx-auto w-full max-w-[1800px]">
  
                <LogoLoop
                  logos={techStackLoop}
                  speed={140}
                  logoHeight={72}
                  gap={72}
                  hoverSpeed={0}
                  scaleOnHover
                  fadeOut
                  fadeOutColor="#080808"
                  ariaLabel="Tech stack logo loop"
                />
              </div>
            </section>

            <section className="relative w-full overflow-hidden border-t border-yellow-400/20 bg-[#080808] px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(250,204,21,0.10),rgba(8,8,8,0)_34%),radial-gradient(circle_at_top,rgba(250,204,21,0.05),rgba(8,8,8,0)_40%),linear-gradient(180deg,rgba(8,8,8,0.08),rgba(8,8,8,0.55))]" />
                <div className="absolute inset-0 orbital-flow" />
                {orbitalDust.map((dust, index) => (
                  <span
                    key={`${dust.left}-${dust.top}-${index}`}
                    className="absolute block rounded-full bg-yellow-100"
                    style={{
                      left: dust.left,
                      top: dust.top,
                      width: `${dust.size}px`,
                      height: `${dust.size}px`,
                      opacity: dust.opacity,
                      boxShadow: "0 0 12px rgba(250,204,21,0.4)",
                    }}
                  />
                ))}
              </div>

              <div className="relative mx-auto grid w-full max-w-[1800px] gap-12 lg:grid-cols-[minmax(460px,1fr)_minmax(0,1.1fr)] lg:items-center">
                <div className="space-y-5">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-yellow-300">
                      Services
                    </p>
                    <h2 className="mt-2 text-sm font-medium uppercase tracking-[0.28em] text-zinc-400">
                      Solar system selector
                    </h2>
                  </div>

                  <div className="orbital-shell relative mx-auto flex aspect-square w-full max-w-[640px] items-center justify-center overflow-hidden rounded-full border border-yellow-400/10 bg-[radial-gradient(circle_at_center,rgba(250,204,21,0.14),rgba(8,8,8,0)_40%),radial-gradient(circle_at_center,rgba(255,255,255,0.04),rgba(8,8,8,0)_74%)] shadow-[inset_0_0_120px_rgba(250,204,21,0.05)]">
                    <div className="pointer-events-none absolute inset-[1.5%] rounded-full border border-yellow-400/10" />
                    <div className="pointer-events-none absolute inset-[12%] rounded-full border border-yellow-400/10" />
                    <div className="pointer-events-none absolute inset-[24%] rounded-full border border-yellow-400/10" />
                    <div className="pointer-events-none absolute inset-[36%] rounded-full border border-yellow-400/10" />
                    <div className="pointer-events-none absolute inset-[48%] rounded-full border border-yellow-400/10" />
                    <div className="pointer-events-none absolute inset-[60%] rounded-full bg-yellow-300/10 blur-3xl" />

                    <div className="absolute inset-0 orbital-track">
                      <div className="absolute inset-0">
                        {servicesData.map((service, index) => {
                          const Icon = service.icon
                          const isActive = orbitalServiceTab === service.id
                          const angle = (index / servicesData.length) * 360 - 90
                          const radius = 225

                          return (
                            <button
                              key={service.id}
                              type="button"
                              onClick={() => setOrbitalServiceTab(service.id)}
                              className={
                                "orbital-planet group absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border transition-all duration-300 ease-in-out " +
                                (isActive
                                  ? "border-yellow-300/60 bg-yellow-300/15 text-yellow-100 shadow-[0_0_0_1px_rgba(250,204,21,0.26),0_0_30px_rgba(250,204,21,0.18)]"
                                  : "border-zinc-800/80 bg-zinc-950/60 text-zinc-500 hover:border-yellow-400/30 hover:text-yellow-100")
                              }
                              aria-pressed={isActive}
                              style={{
                                "--orbit-angle": `${angle}deg`,
                                "--orbit-radius": `${radius}px`,
                              }}
                            >
                              <span className="orbital-planet__content flex h-10 w-10 items-center justify-center rounded-full border border-inherit bg-inherit">
                                <Icon className="h-5 w-5" aria-hidden="true" />
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    <div className="pointer-events-none absolute inset-0">
                      {solarStars.map((star, index) => (
                        <span
                          key={`${star.left}-${star.top}-${index}`}
                          className="absolute block rounded-full bg-yellow-100"
                          style={{
                            left: star.left,
                            top: star.top,
                            width: `${star.size}px`,
                            height: `${star.size}px`,
                            opacity: star.opacity,
                            boxShadow: "0 0 10px rgba(250,204,21,0.45)",
                          }}
                        />
                      ))}
                    </div>

                    <div className="service-sun relative z-20 flex h-36 w-36 flex-col items-center justify-center rounded-full border border-yellow-300/35 bg-[#080808]/92 text-center shadow-[0_0_0_1px_rgba(250,204,21,0.18),0_0_80px_rgba(250,204,21,0.16)]">
                      <Sparkles className="h-8 w-8 text-yellow-300 drop-shadow-[0_0_14px_rgba(250,204,21,0.5)]" aria-hidden="true" />
                      <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-yellow-300">
                        Available
                      </p>
                        <p className="mt-2 max-w-[8rem] text-[11px] leading-5 text-zinc-400">
                        Rotate the orbit
                      </p>
                    </div>
                  </div>
                </div>

                <div className="relative min-h-[28rem] overflow-hidden">
                  <AnimatePresence mode="wait" initial={false}>
                    {orbitalActiveService ? (
                      <motion.div
                        key={orbitalServiceTab}
                        initial={{ opacity: 0, x: 120 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 120 }}
                        transition={{ duration: 0.65, ease: [0.4, 0, 0.2, 1] }}
                        className="service-panel h-full rounded-[2rem] border border-yellow-400/20 bg-white/[0.02] p-6 backdrop-blur-md shadow-[0_0_0_1px_rgba(250,204,21,0.06),0_28px_70px_rgba(0,0,0,0.35)] sm:p-8 lg:p-10"
                      >
                        <div className="flex h-full flex-col gap-6">
                          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                            <div className="max-w-2xl">
                              <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-yellow-300">
                                {orbitalActiveService.label}
                              </p>
                              <h3 className="mt-3 text-2xl font-black tracking-tight text-white sm:text-3xl">
                                {orbitalActiveService.title}
                              </h3>
                              <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base">
                                {orbitalActiveService.description}
                              </p>
                            </div>

                            <div className="flex items-center gap-3 rounded-full border border-yellow-400/15 bg-yellow-400/8 px-4 py-3 text-sm text-zinc-300">
                              <div className="grid h-10 w-10 place-items-center rounded-full border border-yellow-300/30 bg-yellow-300/10 text-yellow-300">
                                <Sparkles className="h-4 w-4" aria-hidden="true" />
                              </div>
                              <p className="max-w-[18rem] text-sm leading-6 text-zinc-300">
                                Highlighting the specific service you can choose to work on.
                              </p>
                            </div>
                          </div>

                          <div className="mt-auto grid gap-6 md:grid-cols-2">
                            <div>
                              <h4 className="text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500">
                                Core Capabilities
                              </h4>
                              <div className="mt-3 flex flex-wrap gap-2">
                                {orbitalActiveService.skills.map((skill) => (
                                  <span
                                    key={skill}
                                    className="rounded-full border border-yellow-400/15 bg-yellow-400/8 px-3 py-1.5 text-xs font-medium text-zinc-300"
                                  >
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div>
                              <h4 className="text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500">
                                Tech & Tools
                              </h4>
                              <div className="mt-3 flex flex-wrap gap-3">
                                {orbitalActiveService.tools.map((tool) => {
                                  const ToolIcon = tool.icon

                                  return (
                                    <div
                                      key={tool.name}
                                      className="group relative flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-800/80 bg-zinc-950/40 transition-colors hover:border-yellow-400/30"
                                      title={tool.name}
                                      aria-label={tool.name}
                                    >
                                      <ToolIcon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" style={{ color: tool.color }} aria-hidden="true" />
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <div className="grid h-full min-h-[24rem] place-items-center rounded-[2rem] border border-dashed border-yellow-400/20 bg-white/[0.02] p-8 text-center text-zinc-400 backdrop-blur-md">
                        <div className="max-w-md">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-yellow-300">
                            No service selected
                          </p>
                          <p className="mt-4 text-sm leading-7 text-zinc-400 sm:text-base">
                            Rotate the orbit and select a planet to reveal the service details with a smooth ease-in animation.
                          </p>
                        </div>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </section>
            <AboutInfiniteMenu />
      <div className={
        "relative min-h-screen w-full overflow-x-hidden transition-colors duration-500 " + theme.shell
      }
    >
      <div
        className={
          "relative flex h-full w-full min-h-0 overflow-hidden transition-colors duration-500 " +
          theme.shellOverlay
        }
      >
        <button
          type="button"
          onClick={() => setIsSidebarOpen((current) => !current)}
          className="hero-menu-toggle fixed right-4 top-4 z-50 inline-flex h-9 w-9 items-center justify-center rounded-full border border-yellow-300/35 bg-zinc-950/80 text-yellow-300 shadow-lg backdrop-blur-xl transition-transform duration-200 ease-in-out hover:scale-105"
          aria-label={isSidebarOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isSidebarOpen}
          aria-controls="site-sidebar"
        >
          {isSidebarOpen ? <X className="h-4 w-4" aria-hidden="true" /> : <Menu className="h-4 w-4" aria-hidden="true" />}
        </button>

        <AnimatePresence>
          {isSidebarOpen ? (
            <motion.button
              type="button"
              aria-label="Close navigation menu"
              className="fixed inset-0 z-30 cursor-default border-0 bg-black/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              onClick={() => setIsSidebarOpen(false)}
            />
          ) : null}
        </AnimatePresence>

        <aside
          id="site-sidebar"
          className={
            "fixed inset-y-0 left-0 z-40 w-[285px] max-w-[85vw] border-r p-5 shadow-2xl backdrop-blur-xl transition-transform duration-300 ease-in-out " +
            (isSidebarOpen ? "translate-x-0" : "-translate-x-full") +
            " " +
            theme.sidebar
          }
          aria-hidden={!isSidebarOpen}
        >
          <div className="flex items-center justify-between gap-3 pr-14">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 overflow-hidden rounded-full border border-zinc-700 bg-zinc-800">
                <img
                  src={profilePic}
                  alt="Profile"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-semibold text-zinc-100">
                    Jeffrey C. Bonina
                  </p>
                  <span className="inline-flex items-center rounded-md border border-zinc-700/80 bg-zinc-900/50 px-1.5 py-0.5 text-[10px] leading-none text-zinc-200">
                    PH
                  </span>
                </div>
                <p className="truncate text-xs text-zinc-400">@jeffreybonina</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsSidebarOpen(false)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-800/80 bg-zinc-900/60 text-zinc-200 transition-colors hover:bg-zinc-800/80 hover:text-white"
              aria-label="Close navigation menu"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <nav className="mt-5 space-y-1">
            {nav.map((item, index) => {
              const Icon = item.icon
              const isActive = activeTab === item.label
              const revealDelay = isSidebarOpen ? `${140 + index * 70}ms` : "0ms"

              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => handleNavClick(item.label)}
                  className={
                    "sidebar-link flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors " +
                    (isActive ? theme.navActive : theme.navInactive) +
                    (isSidebarOpen ? " sidebar-link--open" : "")
                  }
                  style={{ transitionDelay: revealDelay }}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon className={`h-4 w-4 ${theme.navIcon}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              )
            })}
          </nav>
        </aside>

        <main
          ref={mainScrollRef}
          className="min-h-0 flex-1 overflow-y-auto p-5 pt-20 md:p-7 md:pt-20 [scroll-behavior:smooth]"
        >
          {activeTab === "Home" ? (
            <>
              <header className="mb-5">
                <h1 className={"text-md font-semibold tracking-tight transition-colors duration-500 text-zinc-100"}>
                  <TextType
                    texts={["Hello, I'm Jeffrey C. Bonina.", "Web Developer"]}
                    typingSpeed={75}
                    pauseDuration={1500}
                    showCursor
                    cursorCharacter="_"
                    deletingSpeed={50}
                    variableSpeedEnabled={false}
                    variableSpeedMin={60}
                    variableSpeedMax={120}
                    cursorBlinkDuration={0.5}
                  />
                </h1>
                <p className={"mt-1 font-bold text-lg transition-colors duration-500 " + themeClasses.text.secondary}>
                  Full-Stack Developer | LLM & AI Agent Builder | React · TypeScript · Node.js
                </p>
                <div className={"mt-4 rounded-2xl p-5 backdrop-blur-md transition-colors duration-500 " + themeClasses.card}>
                  <p className={"max-w-11/12 text-sm leading-relaxed text-justify transition-colors duration-500 " + themeClasses.text.muted}>
                   I'm a CS student who fell in love with building things people actually use. I specialize in frontend-focused full-stack development — turning ideas into scalable, user-friendly web apps using React, TypeScript, Node.js, and Tailwind CSS. I've shipped real client projects including a completed content management system (CMS) and an e-commerce platform. I also build and implement AI agents powered by LLMs, integrating OpenAI and Gemini APIs to create intelligent, context-aware web experiences that solve real problems.


                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleNavClick("Resume")}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_15px_rgba(37,99,235,0.35)] transition-colors hover:bg-blue-500"
                >
                  <FileText className="h-4 w-4" aria-hidden="true" />
                  View My Resume
                </button>
              </header>

              {/* --- SKILLS SECTION WITH BIGGER COLORED ICONS --- */}
              <section className="mb-8">
                {/* Divider Header */}
                <div className="mb-5 flex items-center gap-4">
                  <h2 className={"text-sm font-semibold uppercase tracking-widest transition-colors duration-500 " + themeClasses.text.secondary}>
                    My Skills
                  </h2>
                  <div className={"h-px flex-1 transition-colors duration-500 " + themeClasses.divider}></div>
                </div>

                {/* Circular Icons Container */}
                <div className="flex flex-wrap gap-4">
                  {[
                    { Icon: SiHtml5, name: "HTML5", color: "#E34F26" },
                    { Icon: SiCss, name: "CSS3", color: "#1572B6" },
                    { Icon: SiJavascript, name: "JavaScript", color: "#F7DF1E" },
                    { Icon: SiTypescript, name: "TypeScript", color: "#3178C6" },
                    { Icon: SiReact, name: "React", color: "#61DAFB" },
                    { Icon: SiNextdotjs, name: "Next.js", color: "#FFFFFF" },
                    { Icon: SiTailwindcss, name: "Tailwind CSS", color: "#06B6D4" },
                    { Icon: SiNodedotjs, name: "Node.js", color: "#339933" },
                    { Icon: SiExpress, name: "Express", color: "#FFFFFF" },
                    { Icon: SiMongodb, name: "MongoDB", color: "#47A248" },
                    { Icon: SiFirebase, name: "Firebase", color: "#FFCA28" },
                    { Icon: SiDocker, name: "Docker", color: "#2496ED" },
                    { Icon: SiDotnet, name: ".NET", color: "#512BD4" },
                    { Icon: SiPhp, name: "PHP", color: "#777BB4" },
                    { Icon: SiPython, name: "Python", color: "#3776AB" },
                    { Icon: SiFlutter, name: "Flutter", color: "#02569B" },
                    { Icon: SiRaspberrypi, name: "Raspberry Pi", color: "#C51A4A" },
                    { Icon: SiSanity, name: "Sanity", color: "#F03E2F" },
                    { Icon: SiGit, name: "Git", color: "#F05032" },
                    { Icon: SiGithub, name: "GitHub", color: "#FFFFFF" },
                    { Icon: SiOpenai, name: "OpenAI", color: "#412991" },
                    { Icon: SiGoogle, name: "Google", color: "#4285F4" },
                    { Icon: SiGmail, name: "Gmail", color: "#EA4335" },
                    { Icon: SiInstagram, name: "Instagram", color: "#E4405F" },
                    { Icon: SiFacebook, name: "Facebook", color: "#1877F2" },
                  ].map((tech, idx) => (
                    <div
                      key={idx}
                      title={tech.name}
                      className={"group flex h-16 w-16 cursor-pointer items-center justify-center rounded-full shadow-sm transition-all duration-300 hover:scale-110 " + themeClasses.card}>
                      <tech.Icon 
                        // Increased icon to h-8 w-8
                        className="h-8 w-8 transition-transform duration-300 group-hover:scale-110" 
                        style={{ color: tech.color }} 
                      />
                    </div>
                  ))}
                </div>
              </section>

              <MagicBento
                textAutoHide={true}
                enableStars
                enableSpotlight
                enableBorderGlow={true}
                enableTilt={false}
                enableMagnetism={false}
                clickEffect
                spotlightRadius={400}
                particleCount={12}
                glowColor="132, 0, 255"
                disableAnimations={false}
              />
            </>
          
          ) : activeTab === "Projects" ? (
            <>
              <div className="mx-auto w-full max-w-6xl 2xl:max-w-7xl">
                <header className="mb-5">
                  <h1 className={"text-md font-semibold tracking-tight transition-colors duration-500 " + themeClasses.text.primary}>
                    Projects
                  </h1>
                  <p className={"mt-1 text-sm leading-relaxed transition-colors duration-500 " + themeClasses.text.muted}>
                    A showcase of both private and open-source projects I've built or contributed.
                  </p>
                </header>

                <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="relative w-full md:max-w-sm">
                    <Search className={"absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors duration-500 " + themeClasses.inputIcon} />
                    <input
                      value={projectQuery}
                      onChange={(e) => setProjectQuery(e.target.value)}
                      placeholder="Search projects by title..."
                      className={"w-full rounded-xl py-2 pl-10 pr-3 text-sm outline-none backdrop-blur-md transition-colors duration-500 " + themeClasses.input}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={projectSort}
                      onChange={(e) => setProjectSort(e.target.value)}
                      className={"rounded-xl px-3 py-2 text-sm outline-none backdrop-blur-md transition-colors duration-500 " + themeClasses.input}
                      aria-label="Sort"
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                    </select>
                  </div>
                </div>

                <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {projects.map((project) => (
                    <GlareHover
                      key={project.id}  
                      glareOpacity={0.22}
                      glareSize={260}
                      transitionDuration={650}
                      className="rounded-2xl border border-zinc-800/80 bg-zinc-950/25 backdrop-blur-xl"
                    >
                      <article className="flex h-full w-full flex-col overflow-hidden">
                        <div className="relative aspect-[16/9] bg-zinc-950/40">
                          {project.media ? (
                            project.media.isVideo ? (
                              <video
                                className="h-full w-full object-cover opacity-70"
                                src={project.media.src}
                                muted
                                loop
                                playsInline
                                autoPlay
                              />
                            ) : (
                              <img
                                src={project.media.src}
                                alt={project.title}
                                className="h-full w-full object-cover opacity-70"
                                loading="lazy"
                                decoding="async"
                              />
                            )
                          ) : null}

                          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/10 to-black/50" />

                          <div className="absolute left-4 top-4 flex items-center gap-2">
                            <span className="rounded-full border border-white/10 bg-zinc-950/35 px-2.5 py-1 text-[10px] font-semibold text-zinc-200">
                              {project.status}
                            </span>
                            {project.featured ? (
                              <span className="rounded-full border border-blue-500/25 bg-blue-500/10 px-2.5 py-1 text-[10px] font-semibold text-blue-300">
                                Featured
                              </span>
                            ) : null}
                          </div>

                          <div className="absolute inset-0 grid place-items-center">
                            <div className="rounded-xl border border-white/10 bg-zinc-950/40 px-4 py-2.5 text-sm font-semibold text-zinc-100 backdrop-blur-md">
                              View Project +
                            </div>
                          </div>
                        </div>

                        <div className="p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-zinc-100">
                                {project.title}
                              </p>
                              <p className="mt-1 text-xs text-zinc-400">{project.year}</p>
                            </div>
                          </div>

                          <div className="mt-3 text-sm leading-relaxed text-zinc-400">
                            <p className="leading-relaxed">{project.description}</p>
                          </div>

                          <div className="mt-4 flex flex-wrap gap-2">
                            {project.stack.map((StackIcon, i) => (
                              <div
                                key={`${project.id}-stack-${i}`}
                                className="grid h-8 w-8 place-items-center rounded-xl border border-zinc-800/80 bg-zinc-950/15"
                                title="Tech"
                                aria-label="Tech"
                              >
                                <StackIcon className="h-4 w-4 text-zinc-200" aria-hidden="true" />
                              </div>
                            ))}
                          </div>
                        </div>
                      </article>
                    </GlareHover>
                  ))}
                </section>
              </div>
            </>
          ) : activeTab === "About" ? (
            <AboutInfiniteMenu />
          ) : activeTab === "Resume" ? (
            <EducationSkillsProcess />
          ) : activeTab === "Services" ? (
            <>
              {/* --- HEADER & OVERVIEW DESCRIPTION --- */}
              <header className="mb-6">
                <h1 className="text-md font-bold tracking-tight text-zinc-100">
                  {activeTab}
                </h1>
                <p className="mt-1 text-sm text-zinc-400">
                  How I can help bring your ideas to life.
                </p>
                
                {/* Added General Description to fix empty space and add context */}
                <div className="mt-5 rounded-2xl border border-zinc-800/80 bg-zinc-950/20 p-5 backdrop-blur-md">
                  <p className="text-sm leading-relaxed text-zinc-300 text-justify">
                    I offer end-to-end development services tailored to build modern, scalable, and intelligent applications. Whether you need a highly interactive frontend, a robust full-stack architecture, or cutting-edge AI and LLM integrations to automate workflows, I build solutions focused on performance and real-world usability.
                  </p>
                </div>
              </header>

              {/* Sub-Tabs for Services */}
              <div className="flex flex-wrap gap-3 mb-6">
                {servicesData.map((tab) => {
                  const Icon = tab.icon
                  const isActive = activeServiceTab === tab.id
                  
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveServiceTab(tab.id)}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                        isActive 
                          ? "bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]" 
                          : "bg-zinc-900/50 border border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  )
                })}
              </div>

              {/* Interactive Content Area - Expanded for better visual balance */}
              <div className="rounded-2xl border border-zinc-800 bg-[#111113]/80 backdrop-blur-sm p-6 md:p-10 min-h-[340px] relative overflow-hidden flex flex-col">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeServiceTab}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.25 }}
                    className="flex flex-col h-full flex-1"
                  >
                    {/* Top part: Icon, Title, Description */}
                    <div>
                      <div className="flex items-center gap-4 mb-5">
                        <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
                          {activeService && <activeService.icon className="w-6 h-6 text-blue-400" />}
                        </div>
                        <h3 className="text-2xl font-bold tracking-tight text-white">
                          {activeService?.title}
                        </h3>
                      </div>
                      
                      <p className="text-base text-zinc-400 mb-8 max-w-2xl leading-relaxed">
                        {activeService?.description}
                      </p>
                    </div>

                    {/* Bottom part: Split into 2 columns for wider screens to fill space perfectly */}
                    <div className="mt-auto pt-6 border-t border-zinc-800/50 grid gap-8 md:grid-cols-2">
                      
                      {/* Capabilities Column */}
                      <div>
                        <h4 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-4">
                          Core Capabilities
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {activeService?.skills.map((skill, index) => (
                            <div 
                              key={index}
                              className="px-3 py-1.5 rounded-lg border border-zinc-800/80 bg-zinc-900/50 text-xs font-medium text-zinc-300 transition-colors hover:border-zinc-600 cursor-default"
                            >
                              {skill}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Tech & Tools Column */}
                      <div>
                        <h4 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-4">
                          Tech & Tools
                        </h4>
                        <div className="flex flex-wrap gap-3">
                          {activeService?.tools.map((tool, index) => {
                            const ToolIcon = tool.icon
                            return (
                              <div 
                                key={index}
                                className="group relative p-2.5 bg-zinc-900/50 rounded-xl border border-zinc-800 hover:border-zinc-600 transition-colors cursor-pointer"
                              >
                                <ToolIcon 
                                  className="w-5 h-5 text-zinc-400 group-hover:scale-110 transition-transform duration-300" 
                                  style={{ color: tool.color }}
                                />
                                {/* Tooltip */}
                                <div className="absolute -bottom-9 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-zinc-800 text-[10px] font-semibold tracking-wide rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10 shadow-xl">
                                  {tool.name}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                      
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </>
          ) : (
            <>
              <header className="mb-5">
                <h1 className="text-lg font-semibold tracking-tight text-zinc-100">
                  {activeTab}
                </h1>
                <p className="mt-1 text-sm text-zinc-400">Coming soon.</p>
              </header>
            </>
          )}
        </main>
      </div>

      <div className="pointer-events-auto fixed bottom-6 right-6 z-40 flex flex-col gap-3">
        {contacts.map((item) => {
          const Icon = item.icon

          return (
            <a
              key={item.label}
              href={item.href}
              target={item.href?.startsWith("http") ? "_blank" : undefined}
              rel={item.href?.startsWith("http") ? "noreferrer" : undefined}
              aria-label={item.label}
              title={item.label}
              className="grid h-12 w-12 place-items-center transition-transform hover:scale-110"
            >
              <Icon className="h-5 w-5 text-zinc-100" aria-hidden="true" />
            </a>
          )
        })}
      </div>
    </div>
            </>
            ) : null}
    </>
  )
}

export default App