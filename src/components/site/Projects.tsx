import { useEffect, useRef, useState, useCallback } from "react";
import { ArrowUpRight, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { EmblaCarouselType } from "embla-carousel";
import p1 from "@/assets/project-extension.jpg";
import p2 from "@/assets/project-silambam.jpg";
import p3 from "@/assets/project-n8n.jpg";
import p4 from "@/assets/project-erp.jpg";
import p5 from "@/assets/project-school.jpg";

type Project = {
  img: string;
  tag: string;
  title: string;
  desc: string;
  tech: string[];
  link?: string;
  year: string;
  color: string; // accent tint
};

const projects: Project[] = [
  {
    img: p1, tag: "Chrome Extension · AI", year: "2025",
    title: "AI-Powered Product Extraction Extension",
    desc: "Smart browser extension that automates product data extraction using AI-powered attribute matching and schema-based processing.",
    tech: ["Chrome APIs", "JavaScript", "JSON", "Excel"],
    color: "rgba(56,189,248,0.12)",
  },
  {
    img: p2, tag: "Mobile App", year: "2025",
    title: "Vagai Silambam Management App",
    desc: "Modern mobile application for managing student attendance, records and training workflows for martial arts institutions.",
    tech: ["React Native", "Realtime", "Dashboard"],
    color: "rgba(248,250,252,0.06)",
  },
  {
    img: p3, tag: "AI Automation · n8n", year: "2025",
    title: "AI-Powered N8N Automation System",
    desc: "Automated ERP document processing using n8n, OCR and AI classification — invoices, POs, RFQs and quotations.",
    tech: ["n8n", "MongoDB", "OCR", "AI"],
    color: "rgba(56,189,248,0.12)",
  },
  {
    img: p4, tag: "ERPNext", year: "2024",
    title: "ERPNext Textile & Manufacturing Solution",
    desc: "Customized ERPNext implementation for purchase, sales, inventory, invoicing, payments and production workflows.",
    tech: ["ERPNext", "Custom Modules", "API"],
    color: "rgba(248,250,252,0.06)",
  },
  {
    img: p5, tag: "ERPNext · Education", year: "2024",
    title: "ERPNext School Management System",
    desc: "Customized ERPNext platform for admissions, fees, attendance, timetables, exams and staff management.",
    tech: ["ERPNext", "Workflows", "Reports"],
    color: "rgba(248,250,252,0.06)",
  },
];

/** Fires once when the element enters viewport — zero JS scroll overhead */
function useOnce(threshold = 0.08) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.dataset.visible = "true";
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.dataset.visible = "true"; obs.disconnect(); } },
      { threshold, rootMargin: "0px 0px -60px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return ref;
}

/* ─── GTA Style Polaroid Card ───────────────────────────────────────────── */
function GTAProjectCard({ p, i, total }: { p: Project; i: number; total: number }) {
  const ref = useOnce(0.08) as React.RefObject<HTMLElement>;
  // Alternate rotation for the polaroid effect
  const rotation = i % 2 === 0 ? '-rotate-2' : 'rotate-2';

  return (
    <article
      ref={ref}
      className="project-reveal group relative flex flex-col gap-6 h-full"
      data-visible={undefined}
      style={{ animationDelay: `${i * 0.07}s` }}
    >
      {/* Polaroid Frame */}
      <div 
        className={`relative bg-[#f8fafc] p-3 pb-12 sm:pb-16 rounded-sm shadow-2xl transition-transform duration-500 hover:scale-[1.02] hover:z-20 ${rotation}`}
        style={{ boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1)" }}
      >
        <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-black">
          <img 
            src={p.img} 
            alt={p.title} 
            loading="lazy" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
          
          {/* Tag badge inside image */}
          <div className="absolute top-3 left-3 flex gap-2">
            <span className="bg-black/70 backdrop-blur-md rounded-sm px-2.5 py-1 text-[10px] uppercase tracking-widest text-white/90">
              {p.tag}
            </span>
          </div>
        </div>
        
        {/* Handwriting or label on the polaroid bottom */}
        <div className="absolute bottom-3 sm:bottom-4 left-4 right-4 flex justify-between items-center text-black/80 font-mono text-xs sm:text-sm">
          <span className="truncate pr-4 opacity-70 uppercase font-bold tracking-widest">{p.title.split(' ')[0]} {p.title.split(' ')[1]}</span>
          <span className="opacity-50">{String(i + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
        </div>
      </div>

      {/* Description Card Overlapping */}
      <div className="glass-strong p-6 sm:p-8 rounded-2xl relative z-10 -mt-10 sm:-mt-12 mx-2 sm:mx-6 flex-grow flex flex-col">
        <p className="text-[11px] uppercase tracking-[0.3em] text-cyan-soft mb-2 font-bold">
          {p.year}
        </p>
        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-platinum tracking-tight leading-snug mb-3">
          {p.title}
        </h3>
        <p className="text-sm text-white/60 leading-relaxed mb-6 flex-grow">
          {p.desc}
        </p>
        
        <div className="mt-auto">
          <div className="flex flex-wrap gap-1.5 mb-5">
            {p.tech.map((t) => (
              <span key={t} className="text-[9px] sm:text-[10px] uppercase tracking-widest text-white/50 glass px-2.5 py-1 rounded-full">
                {t}
              </span>
            ))}
          </div>
          
          {p.link ? (
            <a href={p.link} target="_blank" rel="noopener noreferrer" className="group/btn inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-cyan-soft transition-colors w-max">
              View Project <ExternalLink className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
            </a>
          ) : (
            <span className="inline-flex items-center gap-2 text-sm text-white/40 font-medium">
              Private Engagement <ArrowUpRight className="h-4 w-4" />
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

/* ─── Section ─────────────────────────────────────────────────────────── */
export function Projects() {
  const headRef = useOnce(0.1) as React.RefObject<HTMLElement>;
  const [activeCategory, setActiveCategory] = useState("All");
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    dragFree: true, 
    containScroll: "trimSnaps",
    align: "start"
  });
  const [scrollProgress, setScrollProgress] = useState(0);

  const onScroll = useCallback((api: EmblaCarouselType) => {
    const progress = Math.max(0, Math.min(1, api.scrollProgress()));
    setScrollProgress(progress * 100);
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onScroll(emblaApi);
    emblaApi.on("scroll", onScroll);
    emblaApi.on("reInit", onScroll);
  }, [emblaApi, onScroll]);

  // Handle vertical mouse wheel scroll to navigate the carousel horizontally
  useEffect(() => {
    if (!emblaApi) return;
    const rootNode = emblaApi.rootNode();
    if (!rootNode) return;

    let lastScrollTime = 0;
    const handleWheel = (e: WheelEvent) => {
      // Prioritize vertical scrolling adjustments
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        const now = Date.now();
        
        // Cooldown of 400ms to allow slides to transition smoothly
        if (now - lastScrollTime < 400) {
          // Prevent page scroll only if we are actively navigating the carousel
          if ((e.deltaY > 0 && emblaApi.canScrollNext()) || (e.deltaY < 0 && emblaApi.canScrollPrev())) {
            e.preventDefault();
          }
          return;
        }

        if (Math.abs(e.deltaY) > 10) {
          if (e.deltaY > 0) {
            if (emblaApi.canScrollNext()) {
              e.preventDefault();
              emblaApi.scrollNext();
              lastScrollTime = now;
            }
          } else {
            if (emblaApi.canScrollPrev()) {
              e.preventDefault();
              emblaApi.scrollPrev();
              lastScrollTime = now;
            }
          }
        }
      }
    };

    rootNode.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      rootNode.removeEventListener("wheel", handleWheel);
    };
  }, [emblaApi]);

  const filteredProjects = projects.filter((p) => {
    if (activeCategory === "All") return true;
    if (activeCategory === "AI Automation") return p.tag.includes("AI");
    if (activeCategory === "ERPNext") return p.tag.includes("ERPNext");
    if (activeCategory === "Mobile Apps") return p.tag.includes("Mobile App");
    return true;
  });

  return (
    <section id="projects" className="relative py-16 sm:py-28 overflow-hidden">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 relative z-10">

        {/* Header */}
        <header
          ref={headRef}
          className="project-reveal flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-16"
          data-visible={undefined}
        >
          <div className="max-w-2xl">
            <p className="text-[10px] uppercase tracking-[0.35em] text-cyan-soft mb-5 font-bold font-mono">
              Selected Work
            </p>
            <h2 className="text-[clamp(3rem,8vw,6.5rem)] font-anton uppercase text-white tracking-tighter leading-[0.82] mix-blend-screen">
              Everything
              <br />
              <span className="text-[#38bdf8] drop-shadow-[0_0_35px_rgba(56,189,248,0.3)] select-none">In Excess</span>
            </h2>
          </div>
          <p className="text-white/45 max-w-xs text-sm leading-relaxed pb-2 font-light">
            A curated selection of recent engagements — from AI automation to enterprise ERP. Built to perfection.
          </p>
        </header>

        {/* Category Filters Bar */}
        <div className="flex gap-2 pt-2 mb-10 overflow-x-auto pb-2 scrollbar-none -mx-1 px-1">
          {["All", "AI Automation", "ERPNext", "Mobile Apps"].map((cat) => {
            const active = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider transition-all duration-300 cursor-pointer ${active
                  ? "silver-gradient text-[#030712] shadow-[0_0_15px_rgba(103,232,249,0.25)] scale-102"
                  : "bg-white/[0.02] border border-white/5 text-white/55 hover:text-white hover:bg-white/[0.04]"
                  }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      <div className="w-full relative px-5 sm:px-6 md:px-8 z-10">
        <div className="overflow-hidden cursor-grab active:cursor-grabbing -mx-5 sm:-mx-6 md:-mx-8 px-5 sm:px-6 md:px-8 py-8" ref={emblaRef} data-cursor="drag">
          <div className="flex backface-hidden">
            <AnimatePresence mode="wait">
              {filteredProjects.map((p, i) => (
                <motion.div
                  key={p.title}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="flex-[0_0_85vw] sm:flex-[0_0_400px] md:flex-[0_0_450px] min-w-0 mr-6 sm:mr-10 last:mr-0"
                >
                  <GTAProjectCard p={p} i={i} total={filteredProjects.length} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Custom Progress Bar Indicator & Navigation */}
        <div className="max-w-7xl mx-auto mt-6 px-5 sm:px-6 flex items-center justify-between gap-6">
          {/* Scroll progress line */}
          <div className="flex-1 h-[2px] bg-white/10 rounded-full overflow-hidden relative">
            <div 
              className="absolute top-0 left-0 bottom-0 bg-cyan-soft rounded-full transition-all duration-300 ease-out shadow-[0_0_8px_rgba(103,232,249,0.4)]"
              style={{ width: `${scrollProgress}%` }}
            />
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => emblaApi?.scrollPrev()}
              className="w-10 h-10 rounded-full border border-white/10 hover:border-white/30 text-white/50 hover:text-white flex items-center justify-center transition-all hover:bg-white/5 active:scale-95"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={() => emblaApi?.scrollNext()}
              className="w-10 h-10 rounded-full border border-white/10 hover:border-white/30 text-white/50 hover:text-white flex items-center justify-center transition-all hover:bg-white/5 active:scale-95"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
