import { useState, useEffect, useRef } from "react";
import emailjs from "@emailjs/browser";
import { Phone, Mail, MapPin, Menu, X, Star, ArrowRight, CheckCircle } from "lucide-react";
import { HashRouter, Routes, Route } from "react-router-dom";
import Admin from "./pages/Admin.jsx";
import {
  ABOUT_CONTENT,
  BENEFITS,
  BUSINESS_INFO,
  CONTACT_CONTENT,
  CONTACT_METHODS,
  HERO_CONTENT,
  NAV_LINKS,
  PROJECTS,
  PROJECTS_NOTE,
  SERVICE_OPTIONS,
  SERVICES,
  SOCIAL_LINKS,
  TESTIMONIALS,
} from "./content/siteContent";
import { PUBLISH_EVENT, readPublishedSiteContent, savePublishedSiteContent } from "./lib/siteContentApi";
import { readStoredSiteContentWithFallback } from "./lib/siteContentStorage";
import { createDefaultSiteContent } from "./lib/siteContentData";
import { fetchFeaturedProjects } from "./lib/projects";

// Correct image path for both dev and GitHub Pages deployment
const BASE   = import.meta.env.BASE_URL;  // "/" locally - "/Copperstone-Electric-LLC/" on GitHub Pages

const C      = "#C87533";
const DARK   = "#070605";
const BG     = "#D8C39B";
const GRAY   = "#5F564D";
const BORDER = "#C9B48A";

const inp = {
  width: "100%", background: "#fff", border: `1px solid ${BORDER}`,
  borderRadius: 6, padding: "11px 16px", color: DARK,
  fontSize: 15, outline: "none", boxSizing: "border-box",
};

// â”€â”€ Fade-in on scroll â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function FadeIn({ children, delay = 0, direction = "up", style = {} }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  const moves = { up: "translateY(38px)", left: "translateX(-38px)", right: "translateX(38px)" };
  return (
    <div ref={ref} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? "none" : (moves[direction] ?? "none"),
      transition: `opacity 0.75s ease ${delay}ms, transform 0.75s ease ${delay}ms`,
      ...style,
    }}>
      {children}
    </div>
  );
}


// â”€â”€ Wipe-from-left reveal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// The outer div is observed (no clip-path so IntersectionObserver works).
// The inner div holds the clip-path so it doesn't interfere with detection.
function WipeLeft({ children, style = {} }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={style}>
      <div style={{
        clipPath: vis ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)",
        transition: "clip-path 2.2s cubic-bezier(0.77,0,0.175,1)",
        width: "100%",
        height: "100%",
      }}>{children}</div>
    </div>
  );
}

// â”€â”€ App â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function Home() {
  const [menuOpen, setMenuOpen]   = useState(false);
  const [scrolled, setScrolled]   = useState(false);
  const [projects, setProjects]   = useState(PROJECTS);
  const previewDraftMode = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("previewDraft") === "1";
  const [siteDraft, setSiteDraft]  = useState(() => createDefaultSiteContent());
  const [formData, setFormData]   = useState({ name: "", email: "", phone: "", service: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors]       = useState({});
  const [sending, setSending]     = useState(false);

  const heroContent = siteDraft.hero;
  const aboutContent = siteDraft.about;
  const contactContent = siteDraft.contact;
  const navLinks = siteDraft.navLinks;
  const socialLinks = siteDraft.socialLinks;
  const businessInfo = siteDraft.businessInfo;
  const benefits = siteDraft.benefits;
  const services = siteDraft.services;
  const projectsNote = siteDraft.projectsNote;
  const testimonials = siteDraft.testimonials;
  const contactMethods = siteDraft.contactMethods;
  const serviceOptions = siteDraft.serviceOptions;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    let ignore = false;

    const loadProjects = async () => {
      try {
        const remoteProjects = await fetchFeaturedProjects();
        if (!ignore && remoteProjects.length > 0) {
          setProjects(remoteProjects);
        }
      } catch (error) {
        console.error("Failed to load projects from Supabase.", error);
      }
    };

    loadProjects();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    let ignore = false;

    const loadSiteContent = async () => {
      if (previewDraftMode) {
        setSiteDraft(readStoredSiteContentWithFallback(createDefaultSiteContent()));
        return;
      }

      const publishedContent = await readPublishedSiteContent();
      if (!ignore) {
        setSiteDraft(publishedContent);
      }
    };

    loadSiteContent();

    return () => {
      ignore = true;
    };
  }, [previewDraftMode]);

  useEffect(() => {
    const syncPreviewDraft = () => setSiteDraft(readStoredSiteContentWithFallback(createDefaultSiteContent()));
    const syncPublishedContent = async () => {
      const publishedContent = await readPublishedSiteContent();
      setSiteDraft(publishedContent);
    };

    if (previewDraftMode) {
      window.addEventListener("storage", syncPreviewDraft);
      window.addEventListener("copperstone-site-content-change", syncPreviewDraft);
    } else {
      window.addEventListener(PUBLISH_EVENT, syncPublishedContent);
    }

    return () => {
      window.removeEventListener("storage", syncPreviewDraft);
      window.removeEventListener("copperstone-site-content-change", syncPreviewDraft);
      window.removeEventListener(PUBLISH_EVENT, syncPublishedContent);
    };
  }, [previewDraftMode]);

  const formatPhone = (val) => {
    const d = val.replace(/\D/g, "").slice(0, 10);
    if (d.length <= 3) return d.length ? `(${d}` : "";
    if (d.length <= 6) return `(${d.slice(0,3)}) ${d.slice(3)}`;
    return `(${d.slice(0,3)}) ${d.slice(3,6)}-${d.slice(6)}`;
  };

  const handleSubmit = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Name is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = "Enter a valid email address";
    if (!formData.service) errs.service = "Please select a service";
    if (formData.message.trim().length < 20) errs.message = "Please describe your project (at least 20 characters)";
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setSending(true);
    emailjs.send(
      "service_w8bxjr8",
      "template_bm294tt",
      {
        from_name:    formData.name,
        from_email:   formData.email,
        phone:        formData.phone || "-",
        service:      formData.service,
        message:      formData.message,
        to_email:     businessInfo.email,
      },
      "P8MyjbzxmohKKCxDe"
    ).then(() => {
      setSending(false);
      setSubmitted(true);
    }).catch(() => {
      setSending(false);
      setErrors({ submit: "Failed to send. Please try again or call us directly." });
    });
  };

  return (
    <div style={{ fontFamily: "'Libre Baskerville', 'Times New Roman', serif", background: BG, color: DARK, minHeight: "100vh" }}>

      {/* â”€â”€ NAV â”€â”€ */}
      <nav style={{
        position: "fixed", top: 0, width: "100%", zIndex: 50,
        background: scrolled ? "rgba(255,255,255,0.97)" : "transparent",
        borderBottom: scrolled ? `1px solid ${BORDER}` : "none",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        transition: "all 0.3s",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>
          <a href="#" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <img src={`${BASE}favicon.svg`} alt="" width="34" height="34" />
            <div style={{ lineHeight: 1.15 }}>
              <div style={{ color: scrolled ? DARK : "#fff", fontWeight: 800, fontSize: 14, letterSpacing: 1.5, transition: "color 0.3s" }}>{businessInfo.brandPrimary}</div>
              <div style={{ color: C, fontSize: 12, letterSpacing: 3, fontWeight: 700 }}>{businessInfo.brandSecondary}</div>
            </div>
          </a>
          <div style={{ display: "flex", alignItems: "center", gap: 36 }} className="desktop-nav">
            {navLinks.map(l => (
              <a key={l} href={`#${l.toLowerCase()}`}
                style={{ color: scrolled ? GRAY : "rgba(255,255,255,0.85)", fontSize: 16, fontWeight: 500, textDecoration: "none", transition: "color 0.3s" }}
                onMouseEnter={e => e.target.style.color = scrolled ? DARK : "#fff"}
                onMouseLeave={e => e.target.style.color = scrolled ? GRAY : "rgba(255,255,255,0.85)"}>{l}</a>
            ))}
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer"
                style={{ width: 30, height: 30, borderRadius: "50%", background: "#1877F2", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", textDecoration: "none", transition: "background 0.2s, transform 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.background = "#0f63d8"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#1877F2"; e.currentTarget.style.transform = "none"; }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer"
                style={{ width: 30, height: 30, borderRadius: "50%", background: "#E1306C", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", textDecoration: "none", transition: "background 0.2s, transform 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.background = "#c81e59"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#E1306C"; e.currentTarget.style.transform = "none"; }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
            </div>
            <a href="#contact" style={{ background: C, color: "#fff", padding: "9px 22px", borderRadius: 6, fontSize: 14, fontWeight: 700, textDecoration: "none" }}>Get a Quote</a>
          </div>
          <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: "none", border: "none", color: scrolled ? DARK : "#fff", cursor: "pointer" }} className="mobile-menu-btn">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        {menuOpen && (
          <div style={{ background: "#fff", borderTop: `1px solid ${BORDER}`, padding: "16px 32px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
            {navLinks.map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setMenuOpen(false)}
                style={{ color: DARK, fontSize: 17, fontWeight: 500, textDecoration: "none" }}>{l}</a>
            ))}
            <a href="#contact" onClick={() => setMenuOpen(false)}
              style={{ background: C, color: "#fff", padding: "12px 0", borderRadius: 6, fontSize: 16, fontWeight: 700, textDecoration: "none", textAlign: "center", marginTop: 6 }}>Get a Quote</a>
          </div>
        )}
      </nav>

      {/* HERO - /tools.jpg (1920x1080) slow Ken Burns zoom on load */}
      <section style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", overflow: "hidden" }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `url(${BASE}tools.jpg)`,
          backgroundSize: "cover", backgroundPosition: "center",
          animation: "kenBurns 9s cubic-bezier(0.4,0,0.2,1) forwards",
        }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(15,10,6,0.90) 40%, rgba(15,10,6,0.45) 100%)" }} />
        <div style={{ position: "relative", maxWidth: 1100, margin: "0 auto", padding: "110px 32px 80px", width: "100%" }}>
          <FadeIn delay={100}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
              <div style={{ width: 40, height: 1, background: C }} />
              <span style={{ color: C, fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase" }}>{heroContent.eyebrow}</span>
            </div>
          </FadeIn>
          <FadeIn delay={220}>
            <h1 style={{ fontSize: "clamp(2.6rem,6vw,4.8rem)", fontWeight: 900, lineHeight: 1.05, color: "#fff", margin: "0 0 32px", maxWidth: 620 }}>
              {heroContent.titleLineOne}<br />
              <span style={{ color: C }}>{heroContent.titleAccent}</span>
            </h1>
          </FadeIn>
          <FadeIn delay={280}>
            <p style={{ color: "rgba(255,255,255,0.84)", fontSize: 15, lineHeight: 1.8, maxWidth: 680, margin: "0 0 28px", fontWeight: 600 }}>
              {heroContent.body}
            </p>
          </FadeIn>
          <FadeIn delay={320}>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a href="#contact" style={{ background: C, color: "#fff", padding: "16px 28px", borderRadius: 6, fontWeight: 800, fontSize: 15, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 9, boxShadow: `0 4px 20px ${C}55` }}>
                {heroContent.primaryCta} <ArrowRight size={14} />
              </a>
              <a href={businessInfo.phoneHref} style={{ border: "1px solid rgba(255,255,255,0.25)", color: "#fff", padding: "14px 22px", borderRadius: 6, fontWeight: 600, fontSize: 14, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}>
                <Phone size={13} /> {heroContent.secondaryCta}
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* â”€â”€ BENEFITS â”€â”€ */}
      <section style={{ background: BG, borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, padding: "64px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 40 }} className="benefits-grid">
          {benefits.map(({ title, desc }, i) => (
            <FadeIn key={title} delay={i * 100}>
              <div style={{ width: 40, height: 2, background: C, marginBottom: 20 }} />
              <h3 style={{ color: DARK, fontWeight: 800, fontSize: 17, marginBottom: 10 }}>{title}</h3>
              <p style={{ color: GRAY, fontSize: 16, lineHeight: 1.75, margin: 0 }}>{desc}</p>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* â”€â”€ SERVICES â€” badge icon cards like screenshot â”€â”€ */}
      <section id="services" style={{ background: BG, padding: "96px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ width: 36, height: 1, background: C }} />
                <span style={{ color: C, fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase" }}>What We Do</span>
                <div style={{ width: 36, height: 1, background: C }} />
              </div>
              <h2 style={{ fontSize: "clamp(1.8rem,3.5vw,2.8rem)", fontWeight: 900, marginBottom: 0 }}>Our Specialized Services</h2>
            </div>
          </FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }} className="services-grid">
            {services.map((s, i) => (
              <FadeIn key={s.title} delay={i * 130}>
                <ServiceCard {...s} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* â”€â”€ PROJECTS â”€â”€ */}
      <section id="projects" style={{ background: DARK, padding: "96px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 48 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                  <div style={{ width: 36, height: 1, background: C }} />
                  <span style={{ color: C, fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase" }}>Our Work</span>
                </div>
                <h2 style={{ fontSize: "clamp(1.8rem,3.5vw,2.4rem)", fontWeight: 900, color: "#fff", margin: 0 }}>Recent Projects</h2>
                <p style={{ color: "rgba(255,255,255,0.84)", fontSize: 14, marginTop: 10, marginBottom: 0, fontWeight: 600 }}>
                  Selected commercial projects across Texas. More available upon request.
                </p>
              </div>
              <a href="#contact" style={{ display: "inline-flex", alignItems: "center", gap: 7, color: C, fontSize: 14, fontWeight: 700, textDecoration: "none", letterSpacing: 0.3 }}>
                Start Your Project <ArrowRight size={13} />
              </a>
            </div>
          </FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }} className="services-grid">
            {projects.map((p, i) => (
              <FadeIn key={p.slug} delay={i * 80}>
                <div style={{ borderRadius: 10, overflow: "hidden", background: "#1a1510", border: "1px solid rgba(255,255,255,0.07)", aspectRatio: "4/3", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: 24, position: "relative" }}>
                  <div
                    style={{ position: "absolute", inset: 0, backgroundImage: `url(${p.imagePath?.startsWith('http') ? p.imagePath : BASE + p.imagePath})`, backgroundSize: "cover", backgroundPosition: "center" }}
                    aria-hidden="true"
                  />
                  <div style={{ position: "absolute", inset: 0, background: "rgba(10,8,6,0.55)" }} />
                  <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${C}20 0%, transparent 62%)` }} />
                  <div style={{ position: "relative" }}>
                    <p style={{ color: C, fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", margin: "0 0 6px" }}>
                      {p.projectType} - {p.location}
                    </p>
                    <h3 style={{ color: "#fff", fontWeight: 700, fontSize: 15, margin: 0 }}>{p.title}</h3>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
          <FadeIn delay={200}>
            <p style={{ color: "#4b4540", fontSize: 14, textAlign: "center", marginTop: 32 }}>
              {projectsNote}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ABOUT - /hero.jpg (electrician portrait, 900x1100) */}
      <section id="about" style={{ background: BG, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.15fr 1fr", minHeight: 620 }} className="photo-split">
          {/* Photo - full-bleed wipe from left */}
          <div style={{ position: "relative", minHeight: 620 }}>
            <WipeLeft style={{ position: "absolute", inset: 0 }}>
              <img src={`${BASE}hero.jpg`} alt="Commercial electrical installation"
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", display: "block" }} />
            </WipeLeft>
          </div>
          {/* Text */}
          <FadeIn direction="right" style={{ padding: "80px 64px", display: "flex", flexDirection: "column", justifyContent: "center" }} className="about-text">
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
              <div style={{ width: 36, height: 1, background: C }} />
              <span style={{ color: C, fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase" }}>{aboutContent.eyebrow}</span>
            </div>
            <h2 style={{ fontSize: "clamp(1.8rem,3vw,2.6rem)", fontWeight: 900, color: DARK, lineHeight: 1.15, marginBottom: 24 }}>
              {aboutContent.titleLineOne}<br />
              <span style={{ color: C }}>{aboutContent.titleAccent}</span>
            </h2>
            <p style={{ color: GRAY, fontSize: 15, lineHeight: 1.85, marginBottom: 36 }}>
              {aboutContent.body}
            </p>
            <p style={{ color: DARK, fontSize: 14, lineHeight: 1.7, fontWeight: 700, marginBottom: 24 }}>
              {aboutContent.emphasis}
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 36 }}>
              {aboutContent.bullets.map(b => (
                <div key={b} style={{ display: "flex", alignItems: "center", gap: 8, color: GRAY, fontSize: 15 }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", background: C, flexShrink: 0 }} />
                  {b}
                </div>
              ))}
            </div>
            <a href="#contact" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: C, color: "#fff", padding: "13px 26px", borderRadius: 6, fontWeight: 700, fontSize: 14, textDecoration: "none", alignSelf: "flex-start" }}>
              {aboutContent.cta} <ArrowRight size={14} />
            </a>
          </FadeIn>
        </div>
      </section>

      {/* TESTIMONIALS - feature.jpg as dark photo background */}
      <section id="testimonials" style={{ position: "relative", padding: "96px 32px", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${BASE}feature.jpg)`, backgroundSize: "cover", backgroundPosition: "center" }} />
        <div style={{ position: "absolute", inset: 0, background: "rgba(15,10,6,0.82)" }} />
        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ width: 36, height: 1, background: C }} />
                <span style={{ color: C, fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase" }}>Client Testimonials</span>
                <div style={{ width: 36, height: 1, background: C }} />
              </div>
              <h2 style={{ fontSize: "clamp(1.8rem,3.5vw,2.4rem)", fontWeight: 900, marginBottom: 12, color: "#fff" }}>Trusted by Contractors & Property Managers</h2>
              <div style={{ display: "flex", justifyContent: "center", gap: 3, marginTop: 8 }}>
                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill={C} color={C} />)}
              </div>
              <p style={{ color: "rgba(255,255,255,0.78)", fontSize: 14, marginTop: 8, fontWeight: 600 }}>5.0 - 80+ Google Reviews</p>
            </div>
          </FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }} className="services-grid">
            {testimonials.map((t, i) => (
              <FadeIn key={t.name} delay={i * 130}>
                <TestimonialCard {...t} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* â”€â”€ CONTACT â”€â”€ */}
      <section id="contact" style={{ background: BG, padding: "96px 32px", borderTop: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: 72, alignItems: "start" }} className="split-grid">
            <FadeIn direction="left">
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                <div style={{ width: 36, height: 1, background: C }} />
                <span style={{ color: C, fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase" }}>{contactContent.eyebrow}</span>
              </div>
              <h2 style={{ fontSize: "clamp(1.8rem,3vw,2.6rem)", fontWeight: 900, color: DARK, lineHeight: 1.15, marginBottom: 12 }}>
                {contactContent.titleLineOne}<br />
                <span style={{ color: C }}>{contactContent.titleAccent}</span>
              </h2>
              <p style={{ color: GRAY, fontSize: 14, lineHeight: 1.8, marginBottom: 28, fontWeight: 500 }}>
                {contactContent.body}
              </p>
              {/* Primary phone CTA */}
              <a href={BUSINESS_INFO.phoneHref} style={{ display: "flex", alignItems: "center", gap: 14, background: C, borderRadius: 8, padding: "18px 22px", textDecoration: "none", marginBottom: 28 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Phone size={18} color="#fff" />
                </div>
                <div>
                  <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", margin: "0 0 2px" }}>{businessInfo.availabilityLabel}</p>
                  <p style={{ color: "#fff", fontWeight: 800, fontSize: 20, margin: 0 }}>{businessInfo.phoneDisplay}</p>
                </div>
              </a>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {contactMethods.map(({ icon: Icon, value, sub }) => (
                  <div key={value} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: C + "22", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Icon size={15} color={C} />
                    </div>
                    <div>
                      <p style={{ color: DARK, fontWeight: 600, fontSize: 14, margin: "0 0 2px" }}>{value}</p>
                      <p style={{ color: GRAY, fontSize: 13, margin: 0 }}>{sub}</p>
                    </div>
                  </div>
                ))}
              </div>
              {/* Social links */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 28, paddingTop: 24, borderTop: `1px solid ${BORDER}` }}>
                <span style={{ color: GRAY, fontSize: 13, fontWeight: 600 }}>Follow us:</span>
                <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer"
                  style={{ width: 36, height: 36, borderRadius: "50%", background: C + "15", border: `1px solid ${C}40`, display: "flex", alignItems: "center", justifyContent: "center", color: C, textDecoration: "none", transition: "background 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.background = C + "30"} onMouseLeave={e => e.currentTarget.style.background = C + "15"}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                </a>
                <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer"
                  style={{ width: 36, height: 36, borderRadius: "50%", background: C + "15", border: `1px solid ${C}40`, display: "flex", alignItems: "center", justifyContent: "center", color: C, textDecoration: "none", transition: "background 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.background = C + "30"} onMouseLeave={e => e.currentTarget.style.background = C + "15"}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                </a>
              </div>
            </FadeIn>

            <FadeIn direction="right">
              <div style={{ background: "#fff", borderRadius: 12, padding: "40px 36px", border: `1px solid ${BORDER}` }}>
                {submitted ? (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 14, padding: "48px 0" }}>
                    <CheckCircle size={48} color={C} />
                    <h3 style={{ color: DARK, fontWeight: 800, fontSize: 20, margin: 0 }}>{contactContent.successTitle}</h3>
                    <p style={{ color: GRAY, margin: 0 }}>{contactContent.successBody}</p>
                    <button onClick={() => setSubmitted(false)} style={{ background: "none", border: "none", color: C, cursor: "pointer", fontSize: 14, textDecoration: "underline", marginTop: 4, fontWeight: 700 }}>{contactContent.resendLabel}</button>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                    <h3 style={{ color: DARK, fontWeight: 800, fontSize: 18, margin: "0 0 4px" }}>{contactContent.formTitle}</h3>
                    {/* Name */}
                    <div>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 800, color: GRAY, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6 }}>Full Name</label>
                      <input type="text" placeholder="Your Name" maxLength={50} value={formData.name}
                        onChange={e => { setFormData({ ...formData, name: e.target.value }); setErrors(p => ({ ...p, name: "" })); }}
                        style={{ ...inp, borderColor: errors.name ? "#e05a5a" : BORDER }} />
                      {errors.name && <p style={{ color: "#e05a5a", fontSize: 12, margin: "4px 0 0" }}>{errors.name}</p>}
                    </div>
                    {/* Email */}
                    <div>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 800, color: GRAY, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6 }}>Email</label>
                      <input type="email" placeholder="you@company.com" value={formData.email}
                        onChange={e => { setFormData({ ...formData, email: e.target.value }); setErrors(p => ({ ...p, email: "" })); }}
                        style={{ ...inp, borderColor: errors.email ? "#e05a5a" : BORDER }} />
                      {errors.email && <p style={{ color: "#e05a5a", fontSize: 12, margin: "4px 0 0" }}>{errors.email}</p>}
                    </div>
                    {/* Phone */}
                    <div>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 800, color: GRAY, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6 }}>Phone</label>
                      <input type="tel" placeholder="(713) 555-0000" value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: formatPhone(e.target.value) })}
                        style={inp} />
                    </div>
                    {/* Service */}
                    <div>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 800, color: GRAY, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6 }}>Service Needed</label>
                      <select value={formData.service}
                        onChange={e => { setFormData({ ...formData, service: e.target.value }); setErrors(p => ({ ...p, service: "" })); }}
                        style={{ ...inp, borderColor: errors.service ? "#e05a5a" : BORDER }}>
                        <option value="">Select a service...</option>
                        {serviceOptions.map(option => (<option key={option}>{option}</option>))}
                      </select>
                      {errors.service && <p style={{ color: "#e05a5a", fontSize: 12, margin: "4px 0 0" }}>{errors.service}</p>}
                    </div>
                    {/* Project Details */}
                    <div>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 800, color: GRAY, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6 }}>Project Details</label>
                      <textarea rows={6} placeholder="Describe your project - scope, timeline, location. (min. 20 characters)"
                        value={formData.message}
                        onChange={e => { setFormData({ ...formData, message: e.target.value }); setErrors(p => ({ ...p, message: "" })); }}
                        style={{ ...inp, resize: "vertical", fontFamily: "inherit", borderColor: errors.message ? "#e05a5a" : BORDER }} />
                      {errors.message && <p style={{ color: "#e05a5a", fontSize: 12, margin: "4px 0 0" }}>{errors.message}</p>}
                    </div>
                    {errors.submit && <p style={{ color: "#e05a5a", fontSize: 13, margin: "0 0 4px" }}>{errors.submit}</p>}
                    <button onClick={handleSubmit} disabled={sending}
                      style={{ background: sending ? GRAY : C, color: "#fff", border: "none", borderRadius: 6, padding: "15px 0", fontWeight: 800, fontSize: 15, cursor: sending ? "not-allowed" : "pointer", boxShadow: sending ? "none" : `0 4px 18px ${C}50`, letterSpacing: 0.3, transition: "background 0.2s" }}>
                      {sending ? contactContent.sendingLabel : contactContent.submitLabel}
                    </button>
                  </div>
                )}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* â”€â”€ FOOTER â”€â”€ */}
      <footer style={{ background: "#0e0b08", borderTop: "1px solid rgba(255,255,255,0.05)", padding: "40px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          {/* Top row: logo left - nav center - social right */}
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 24, marginBottom: 32 }}>
            {/* Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <img src={`${BASE}favicon.svg`} alt="" width="30" height="30" />
              <div>
                <div style={{ color: "#fff", fontWeight: 800, fontSize: 14, letterSpacing: 1.5 }}>{businessInfo.brandPrimary}</div>
                <div style={{ color: C, fontSize: 12, letterSpacing: 3, fontWeight: 700 }}>{businessInfo.brandSecondary}</div>
              </div>
            </div>
            {/* Nav */}
            <div style={{ display: "flex", gap: 28, flexWrap: "wrap" }}>
              {navLinks.map(l => (
                <a key={l} href={`#${l.toLowerCase()}`}
                  style={{ color: "#6b6560", fontSize: 16, textDecoration: "none", transition: "color 0.2s", fontWeight: 600 }}
                  onMouseEnter={e => e.target.style.color = "#fff"} onMouseLeave={e => e.target.style.color = "#6b6560"}>{l}</a>
              ))}
            </div>
            {/* Social */}
            <div style={{ display: "flex", gap: 10 }}>
              <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer"
                style={{ width: 34, height: 34, borderRadius: "50%", background: "#1877F2", border: "1px solid #1877F2", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", textDecoration: "none", transition: "background 0.2s, transform 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.background = "#0f63d8"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#1877F2"; e.currentTarget.style.transform = "none"; }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer"
                style={{ width: 34, height: 34, borderRadius: "50%", background: "#E1306C", border: "1px solid #E1306C", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", textDecoration: "none", transition: "background 0.2s, transform 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.background = "#c81e59"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#E1306C"; e.currentTarget.style.transform = "none"; }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
            </div>
          </div>
          {/* Divider + bottom row */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 20, display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
            <p style={{ color: "#2f2a25", fontSize: 14, margin: 0, fontWeight: 600 }}>{businessInfo.copyright}</p>
            <p style={{ color: "#2f2a25", fontSize: 14, margin: 0, fontWeight: 600 }}>{businessInfo.footerTagline}</p>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes kenBurns {
          from { transform: scale(1.08); }
          to   { transform: scale(1.0); }
        }
        @media (max-width: 768px) {
          .desktop-nav   { display: none !important; }
.split-grid    { grid-template-columns: 1fr !important; }
          .services-grid { grid-template-columns: 1fr !important; }
          .benefits-grid { grid-template-columns: repeat(2,1fr) !important; }
          .photo-split   { grid-template-columns: 1fr !important; }
          .about-text    { padding: 48px 32px !important; }
        }
        @media (max-width: 480px) {
          .benefits-grid { grid-template-columns: 1fr !important; }
        }
        @media (min-width: 769px) { .mobile-menu-btn { display: none !important; } }
      `}</style>
    </div>
  );
}

// â”€â”€ Service card with dark badge icon (matches screenshot style) â”€â”€
function ServiceCard({ icon: Icon, title, desc, items }) {
  return (
    <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 12, padding: "32px 28px", height: "100%", boxSizing: "border-box", display: "flex", flexDirection: "column" }}>
      {/* Dark square badge with copper icon */}
      <div style={{ width: 52, height: 52, background: DARK, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24, flexShrink: 0 }}>
        <Icon size={22} color={C} />
      </div>
      <h3 style={{ color: DARK, fontWeight: 800, fontSize: 18, lineHeight: 1.2, marginBottom: 12 }}>{title}</h3>
      <p style={{ color: GRAY, fontSize: 14, lineHeight: 1.75, marginBottom: 24, flex: 1 }}>{desc}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 28 }}>
        {items.map(item => (
          <div key={item} style={{ display: "flex", alignItems: "center", gap: 8, color: DARK, fontSize: 14 }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: C, flexShrink: 0 }} />
            {item}
          </div>
        ))}
      </div>
      <a href="#contact" style={{ display: "inline-flex", alignItems: "center", gap: 6, background: DARK, color: "#fff", padding: "9px 18px", borderRadius: 6, fontSize: 13, fontWeight: 700, textDecoration: "none", alignSelf: "flex-start" }}>
        Learn More <ArrowRight size={12} />
      </a>
    </div>
  );
}

// â”€â”€ Testimonial card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function TestimonialCard({ name, role, quote }) {
  return (
    <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 12, padding: "32px 28px" }}>
      <div style={{ display: "flex", gap: 3, marginBottom: 20 }}>
        {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={C} color={C} />)}
      </div>
      <p style={{ color: DARK, fontSize: 14, lineHeight: 1.8, marginBottom: 24, fontStyle: "italic" }}>"{quote}"</p>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: "50%", background: C, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <span style={{ color: "#fff", fontWeight: 800, fontSize: 14 }}>{name[0]}</span>
        </div>
        <div>
          <p style={{ color: DARK, fontWeight: 700, fontSize: 14, margin: 0 }}>{name}</p>
          <p style={{ color: GRAY, fontSize: 13, margin: 0 }}>{role}</p>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </HashRouter>
  );
}
