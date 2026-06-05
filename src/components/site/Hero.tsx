import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { CodeWindow } from "./CodeWindow";
import { useRef, useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

const TAGLINES = ["Build Smarter.", "Scale Faster.", "Automate More.", "Ship Sooner."];

/* ─── Typewriter ──────────────────────────────────────────────────────────── */
function Typewriter() {
  const [idx, setIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = TAGLINES[idx];
    let timeout: ReturnType<typeof setTimeout>;
    if (!deleting && displayed.length < word.length) {
      timeout = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 65);
    } else if (!deleting && displayed.length === word.length) {
      timeout = setTimeout(() => setDeleting(true), 1600);
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 38);
    } else {
      setDeleting(false);
      setIdx((p) => (p + 1) % TAGLINES.length);
    }
    return () => clearTimeout(timeout);
  }, [displayed, deleting, idx]);

  return (
    <span className="text-[var(--cyan-soft)]/90">
      {displayed}
      <span className="animate-cursor-blink inline-block w-0.5 h-[0.85em] bg-[#67e8f9] ml-0.5 align-middle" />
    </span>
  );
}

/* ─── Floating cosmic micro-stars around the headline ────────────────────── */
const STAR_DATA = [
  { x: "4%", y: "18%", d: 0.0, s: 1.5, c: "#67e8f9" },
  { x: "12%", y: "72%", d: 0.9, s: 1.0, c: "#ffffff" },
  { x: "22%", y: "8%", d: 1.7, s: 2.0, c: "#c084fc" },
  { x: "33%", y: "88%", d: 0.4, s: 1.0, c: "#ffffff" },
  { x: "45%", y: "4%", d: 2.2, s: 1.5, c: "#67e8f9" },
  { x: "58%", y: "92%", d: 0.7, s: 1.0, c: "#c084fc" },
  { x: "68%", y: "12%", d: 1.3, s: 2.0, c: "#ffffff" },
  { x: "78%", y: "58%", d: 0.2, s: 1.0, c: "#67e8f9" },
  { x: "88%", y: "26%", d: 1.9, s: 1.5, c: "#ffffff" },
  { x: "96%", y: "75%", d: 0.6, s: 1.0, c: "#c084fc" },
  { x: "50%", y: "48%", d: 3.1, s: 1.5, c: "#67e8f9" },
  { x: "7%", y: "45%", d: 2.5, s: 1.0, c: "#ffffff" },
];

function CosmicStars() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {STAR_DATA.map((s, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{ left: s.x, top: s.y, width: s.s, height: s.s, background: s.c }}
          animate={{ opacity: [0, 1, 0.4, 1, 0], scale: [0.5, 1.4, 0.8, 1.6, 0.5] }}
          transition={{ duration: 3 + (i % 3), delay: s.d, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

function CosmicWord({
  word,
  delay,
  cls = "text-platinum",
}: {
  word: string;
  delay: number;
  cls?: string;
}) {
  return (
    <span className="relative inline-block mr-[0.22em] last:mr-0">
      {/* Word — smooth space zoom-in reveal */}
      <motion.span
        initial={{ opacity: 0, y: 15, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}
        className={`inline-block ${cls}`}
      >
        {word}
      </motion.span>
      {/* Landing horizontal glow flash line */}
      <motion.span
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: [0, 1, 0], opacity: [0, 0.85, 0] }}
        transition={{ duration: 0.45, delay: delay + 0.25, ease: "easeOut" }}
        className="absolute -bottom-0.5 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#67e8f9] to-transparent pointer-events-none"
        style={{ originX: "50%" }}
      />
    </span>
  );
}

/* ─── Scan beam (desktop only) ────────────────────────────────────────────── */
function ScanBeam() {
  return (
    <motion.div
      initial={{ y: -4, opacity: 0 }}
      animate={{ y: [0, 140], opacity: [0, 0.7, 0.7, 0] }}
      transition={{ duration: 0.7, delay: 0.05, ease: "linear", times: [0, 0.1, 0.8, 1] }}
      className="absolute inset-x-0 h-px pointer-events-none z-10 hidden sm:block"
      style={{
        background: "linear-gradient(90deg, transparent 0%, rgba(103,232,249,0.8) 20%, rgba(255,255,255,0.9) 50%, rgba(103,232,249,0.8) 80%, transparent 100%)",
        boxShadow: "0 0 12px 2px rgba(103,232,249,0.5)",
        top: 0,
      }}
    />
  );
}

/* ─── Magnetic CTA wrapper (desktop hover effect) ─────────────────────────── */
function MagneticWrapper({ children, strength = 0.3 }: { children: React.ReactNode; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 25 });
  const springY = useSpring(y, { stiffness: 300, damping: 25 });

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ x: springX, y: springY }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Hero Section ────────────────────────────────────────────────────────── */
export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const isMobile = useIsMobile();

  const { scrollYProgress } = useScroll({
    target: isMobile ? undefined : sectionRef,
    offset: ["start start", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", isMobile ? "0%" : "15%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", isMobile ? "0%" : "8%"]);
  const cardY = useTransform(scrollYProgress, [0, 1], ["0%", isMobile ? "0%" : "-5%"]);

  const scrollRotateX = useTransform(scrollYProgress, [0, 1], [0, 22]);
  const scrollRotateY = useTransform(scrollYProgress, [0, 1], [0, -12]);
  const scrollZ = useTransform(scrollYProgress, [0, 1], [0, -180]);
  const scrollScale = useTransform(scrollYProgress, [0, 1], [1, 0.88]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [12, -12]);
  const rotateY = useTransform(mouseX, [-300, 300], [-12, 12]);
  const springRX = useSpring(rotateX, { stiffness: 160, damping: 32 });
  const springRY = useSpring(rotateY, { stiffness: 160, damping: 32 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - (rect.left + rect.width / 2));
    mouseY.set(e.clientY - (rect.top + rect.height / 2));
  };

  // Staggered word timings
  const WORDS = [
    { w: "Still", delay: 0.12 },
    { w: "Managing", delay: 0.28 },
    { w: "Your", delay: 0.44 },
    { w: "Business", delay: 0.60 },
    { w: "Manually?", delay: 0.76 },
  ];

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative h-[100dvh] sm:h-screen overflow-hidden flex flex-col"
    >
      {/* Background */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 -z-10 overflow-hidden">
        <div className="grid-mask absolute inset-0" />
        <div className="absolute top-1/3 left-1/4 h-[300px] w-[300px] sm:h-[600px] sm:w-[600px] rounded-full blur-[120px] bg-[#67e8f9]/[0.05] pointer-events-none" />
        <div className="absolute top-0 right-1/4 h-[200px] w-[200px] sm:h-[400px] sm:w-[400px] rounded-full blur-[100px] bg-[#c084fc]/[0.04] pointer-events-none" />
        <div className="absolute bottom-0 right-0 h-[200px] w-[200px] sm:h-[500px] sm:w-[500px] rounded-full blur-[80px] bg-white/[0.02] pointer-events-none" />
      </motion.div>

      {/* Main content grid */}
      <motion.div
        style={{ y: textY }}
        className="mx-auto max-w-7xl w-full px-4 sm:px-6 grid lg:grid-cols-2 gap-4 sm:gap-10 lg:gap-12 items-center flex-1 pt-16 sm:pt-20 pb-14 sm:pb-16"
      >
        {/* ── Left content ── */}
        <div className="text-left">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full glass px-3.5 py-1.5 text-xs text-white/70 mb-3 sm:mb-6"
          >
            <Sparkles className="h-3.5 w-3.5 text-[var(--cyan-soft)]" />
            Next-gen DodoX Tech studio
            <span className="mx-1.5 text-white/30">·</span>
            2026
          </motion.div>

          {/* ── Cosmic headline block ── */}
          <div className="relative">

            {/* Nebula glow — desktop only (heavy GPU effect) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 1.5 }}
              className="absolute -inset-6 sm:-inset-10 pointer-events-none -z-10 rounded-3xl overflow-hidden hidden sm:block"
              aria-hidden="true"
            >
              <motion.div
                animate={{
                  background: [
                    "radial-gradient(ellipse at 35% 50%, rgba(103,232,249,0.07) 0%, rgba(192,132,252,0.05) 45%, transparent 70%)",
                    "radial-gradient(ellipse at 65% 45%, rgba(192,132,252,0.08) 0%, rgba(103,232,249,0.04) 45%, transparent 70%)",
                    "radial-gradient(ellipse at 35% 50%, rgba(103,232,249,0.07) 0%, rgba(192,132,252,0.05) 45%, transparent 70%)",
                  ],
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0"
              />
              <CosmicStars />
            </motion.div>

            {/* Scan beam — desktop only */}
            <ScanBeam />

            {/* Headline — bigger on mobile */}
            <h1 className="text-[clamp(2.4rem,4vw,3.6rem)] leading-[1.1] font-semibold tracking-tight">
              <span className="block sm:inline">
                {WORDS.slice(0, 3).map(({ w, delay }) => (
                  <CosmicWord key={w} word={w} delay={delay} />
                ))}
              </span>
              <span className="block sm:inline">
                {WORDS.slice(3).map(({ w, delay }) => (
                  <CosmicWord key={w} word={w} delay={delay} />
                ))}
              </span>
            </h1>

            {/* Typewriter — outside h1 so no double br gap on mobile */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.98 }}
              className="mt-0.5 sm:mt-1 text-[clamp(1.5rem,3vw,2.5rem)] font-light italic text-silver-glow leading-tight"
            >
              <Typewriter />
            </motion.div>
          </div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.1 }}
            className="mt-3 sm:mt-6 max-w-xl text-sm sm:text-base text-white/60 leading-relaxed"
          >
            DodoX Tech builds custom digital solutions that automate business operations,
            improve productivity, and accelerate growth — engineered with luxurious precision.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.25 }}
            className="mt-4 sm:mt-8 flex flex-row flex-wrap items-center gap-3"
          >
            <MagneticWrapper>
              <a
                href="#contact"
                className="group inline-flex items-center gap-2 rounded-full silver-gradient text-[#030712] px-5 sm:px-7 py-2.5 sm:py-3.5 text-sm font-medium ambient-halo transition-transform hover:-translate-y-0.5"
              >
                Start Your Project
                <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </MagneticWrapper>
            <MagneticWrapper>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-full glass px-5 sm:px-7 py-2.5 sm:py-3.5 text-sm font-medium text-white hover:bg-white/[0.06] transition"
              >
                Book Free Consultation
              </a>
            </MagneticWrapper>
          </motion.div>

          {/* Tech stack */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.7 }}
            className="mt-4 sm:mt-10 flex flex-wrap justify-start items-center gap-x-4 gap-y-1.5 sm:gap-x-8 text-[9px] sm:text-xs uppercase tracking-[0.2em] text-white/30"
          >
            {["ERPNext", "React", "AI Automation", "Mobile App", "DevOps & Cloud"].map((tech) => (
              <span key={tech} className="cursor-default transition-colors hover:text-white/60">
                {tech}
              </span>
            ))}
          </motion.div>
        </div>

        {/* ── Right: Code window — desktop 3D tilt ── */}
        <motion.div
          style={{ y: cardY, perspective: 1200 }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          className="relative animate-float hidden sm:block"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => { mouseX.set(0); mouseY.set(0); }}
        >
          <motion.div
            style={{
              rotateX: isMobile ? 0 : scrollRotateX,
              rotateY: isMobile ? 0 : scrollRotateY,
              z: isMobile ? 0 : scrollZ,
              scale: isMobile ? 1 : scrollScale,
              transformStyle: "preserve-3d",
            }}
            className="w-full h-full"
          >
            <motion.div
              style={{ rotateX: springRX, rotateY: springRY, transformStyle: "preserve-3d" }}
              className="relative aspect-[4/3] rounded-3xl ambient-halo"
            >
              <div className="absolute inset-0 rounded-3xl overflow-hidden" style={{ transform: "translateZ(0px)", transformStyle: "preserve-3d" }}>
                <CodeWindow />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-[#030712]/40 via-transparent to-transparent" />
              </div>

              {/* Animated circuit lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none hidden md:block overflow-visible" style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }} viewBox="0 0 400 300">
                <path d="M 60 70 L -12 70" stroke="rgba(103,232,249,0.2)" strokeWidth="1" strokeDasharray="4, 4" fill="none" />
                <motion.path d="M 60 70 L -12 70" stroke="var(--cyan-soft)" strokeWidth="1.5" fill="none"
                  initial={{ strokeDasharray: "8, 30", strokeDashoffset: 0 }}
                  animate={{ strokeDashoffset: 38 }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                />
                <path d="M 340 35 L 406 35" stroke="rgba(103,232,249,0.2)" strokeWidth="1" strokeDasharray="4, 4" fill="none" />
                <motion.path d="M 340 35 L 406 35" stroke="var(--cyan-soft)" strokeWidth="1.5" fill="none"
                  initial={{ strokeDasharray: "8, 30", strokeDashoffset: 0 }}
                  animate={{ strokeDashoffset: -38 }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                />
                <path d="M 340 250 L 404 250" stroke="rgba(103,232,249,0.2)" strokeWidth="1" strokeDasharray="4, 4" fill="none" />
                <motion.path d="M 340 250 L 404 250" stroke="var(--cyan-soft)" strokeWidth="1.5" fill="none"
                  initial={{ strokeDasharray: "8, 30", strokeDashoffset: 0 }}
                  animate={{ strokeDashoffset: -38 }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                />
              </svg>

              {/* Floating stat cards */}
              <motion.div style={{ z: 60, transformStyle: "preserve-3d" }}
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ scale: 1.05, z: 90 }}
                className="absolute -left-6 top-16 glass-strong rounded-2xl px-4 py-3 hidden md:block cursor-default shadow-[0_15px_30px_rgba(0,0,0,0.5)] border border-white/10"
              >
                <div className="text-[10px] uppercase tracking-widest text-white/50">Uptime</div>
                <div className="text-xl font-semibold text-platinum">99.99%</div>
              </motion.div>

              <motion.div style={{ z: 80, transformStyle: "preserve-3d" }}
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ scale: 1.05, z: 110 }}
                className="absolute -right-4 bottom-10 glass-strong rounded-2xl px-4 py-3 hidden md:block cursor-default shadow-[0_20px_40px_rgba(0,0,0,0.6)] border border-white/10"
              >
                <div className="text-[10px] uppercase tracking-widest text-white/50">Workflows</div>
                <div className="text-xl font-semibold text-platinum">+15 automated</div>
              </motion.div>

              <motion.div style={{ z: 40, transformStyle: "preserve-3d" }}
                initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.0, duration: 0.6 }}
                whileHover={{ scale: 1.05, z: 70 }}
                className="absolute -right-2 top-6 glass-strong rounded-2xl px-3 py-2 hidden md:block shadow-[0_10px_20px_rgba(0,0,0,0.4)] border border-white/10"
              >
                <div className="text-[10px] uppercase tracking-widest text-white/50">Clients</div>
                <div className="text-base font-semibold text-[var(--cyan-soft)]">10+ ✓</div>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* ── Mobile code window — lightweight, no 3D ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="relative sm:hidden rounded-2xl overflow-hidden ambient-halo"
        >
          <CodeWindow />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-[#030712]/40 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-3 right-3 flex gap-2 justify-between">
            <div className="glass-strong rounded-xl px-2.5 py-1.5">
              <div className="text-[8px] uppercase tracking-widest text-white/40">Uptime</div>
              <div className="text-sm font-semibold text-platinum">99.99%</div>
            </div>
            <div className="glass-strong rounded-xl px-2.5 py-1.5">
              <div className="text-[8px] uppercase tracking-widest text-white/40">Clients</div>
              <div className="text-sm font-semibold text-[var(--cyan-soft)]">10+ ✓</div>
            </div>
            <div className="glass-strong rounded-xl px-2.5 py-1.5">
              <div className="text-[8px] uppercase tracking-widest text-white/40">Workflows</div>
              <div className="text-sm font-semibold text-platinum">+15</div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center pt-1.5"
        >
          <div className="w-0.5 h-2 rounded-full bg-white/40" />
        </motion.div>
        <span className="text-[9px] uppercase tracking-[0.3em] text-white/25">Scroll</span>
      </motion.div>
    </section>
  );
}
