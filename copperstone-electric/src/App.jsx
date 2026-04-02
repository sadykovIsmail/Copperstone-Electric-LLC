import { useState, useEffect, useRef } from "react";
import {
  Zap, Phone, Mail, MapPin, Menu, X, Star,
  ArrowRight, CheckCircle, Building2, Home, Shield,
} from "lucide-react";

// Correct image path for both dev and GitHub Pages deployment
const BASE   = import.meta.env.BASE_URL;  // "/" locally · "/Copperstone-Electric-LLC/" on GitHub Pages

const C      = "#C87533";
const DARK   = "#1A1814";
const BG     = "#F5F0E8";
const GRAY   = "#7A7268";
const BORDER = "#D4CEC5";

const inp = {
  width: "100%", background: "#fff", border: `1px solid ${BORDER}`,
  borderRadius: 6, padding: "11px 16px", color: DARK,
  fontSize: 14, outline: "none", boxSizing: "border-box",
};

// ── Fade-in on scroll ─────────────────────────────────────────────
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

// ── Slow image reveal on scroll ───────────────────────────────────
// Single-div approach — no height inheritance issues
function RevealImage({ src, position = "center", style = {} }) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } },
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{
      backgroundImage: `url(${src})`,
      backgroundSize: "cover",
      backgroundPosition: position,
      transform: vis ? "scale(1)" : "scale(1.06)",
      opacity: vis ? 1 : 0,
      transition: "transform 1.4s cubic-bezier(0.4,0,0.2,1), opacity 1s ease",
      ...style,
    }} />
  );
}

// ── App ───────────────────────────────────────────────────────────
export default function App() {
  const [menuOpen, setMenuOpen]   = useState(false);
  const [scrolled, setScrolled]   = useState(false);
  const [formData, setFormData]   = useState({ name: "", email: "", phone: "", service: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSubmit = () => {
    if (!formData.name || !formData.email || !formData.service) return;
    setSubmitted(true);
  };

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: BG, color: DARK, minHeight: "100vh" }}>

      {/* ── NAV ── */}
      <nav style={{
        position: "fixed", top: 0, width: "100%", zIndex: 50,
        background: scrolled ? "rgba(255,255,255,0.97)" : "transparent",
        borderBottom: scrolled ? `1px solid ${BORDER}` : "none",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        transition: "all 0.3s",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>
          <a href="#" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: C, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Zap size={15} color="#fff" />
            </div>
            <div style={{ lineHeight: 1.15 }}>
              <div style={{ color: scrolled ? DARK : "#fff", fontWeight: 800, fontSize: 12, letterSpacing: 1.5, transition: "color 0.3s" }}>COPPERSTONE</div>
              <div style={{ color: C, fontSize: 9, letterSpacing: 3, fontWeight: 600 }}>ELECTRIC LLC</div>
            </div>
          </a>
          <div style={{ display: "flex", alignItems: "center", gap: 36 }} className="desktop-nav">
            {["Services", "About", "Testimonials", "Contact"].map(l => (
              <a key={l} href={`#${l.toLowerCase()}`}
                style={{ color: scrolled ? GRAY : "rgba(255,255,255,0.85)", fontSize: 13, fontWeight: 500, textDecoration: "none", transition: "color 0.3s" }}
                onMouseEnter={e => e.target.style.color = scrolled ? DARK : "#fff"}
                onMouseLeave={e => e.target.style.color = scrolled ? GRAY : "rgba(255,255,255,0.85)"}>{l}</a>
            ))}
            <a href="#contact" style={{ background: C, color: "#fff", padding: "9px 22px", borderRadius: 6, fontSize: 12, fontWeight: 700, textDecoration: "none" }}>Get a Quote</a>
          </div>
          <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: "none", border: "none", color: scrolled ? DARK : "#fff", cursor: "pointer" }} className="mobile-menu-btn">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        {menuOpen && (
          <div style={{ background: "#fff", borderTop: `1px solid ${BORDER}`, padding: "16px 32px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
            {["Services", "About", "Testimonials", "Contact"].map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setMenuOpen(false)}
                style={{ color: DARK, fontSize: 15, fontWeight: 500, textDecoration: "none" }}>{l}</a>
            ))}
            <a href="#contact" onClick={() => setMenuOpen(false)}
              style={{ background: C, color: "#fff", padding: "12px 0", borderRadius: 6, fontSize: 13, fontWeight: 700, textDecoration: "none", textAlign: "center", marginTop: 6 }}>Get a Quote</a>
          </div>
        )}
      </nav>

      {/* ── HERO — /tools.jpg (1920×1080) slow Ken Burns zoom on load ── */}
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
              <span style={{ color: C, fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase" }}>Licensed Electrical Contractor · Texas</span>
            </div>
          </FadeIn>
          <FadeIn delay={220}>
            <h1 style={{ fontSize: "clamp(2.4rem,5.5vw,4.2rem)", fontWeight: 900, lineHeight: 1.1, color: "#fff", margin: "0 0 16px", maxWidth: 580 }}>
              Commercial Electrical.<br />
              <span style={{ color: C }}>No Small Jobs.</span>
            </h1>
          </FadeIn>
          <FadeIn delay={340}>
            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 15, maxWidth: 400, lineHeight: 1.75, margin: "0 0 32px" }}>
              TECL-licensed Texas contractor. Commercial builds, panel upgrades, and large-scale residential — done to code, on schedule.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 48 }}>
              <a href="tel:+17135550199" style={{ background: C, color: "#fff", padding: "15px 28px", borderRadius: 6, fontWeight: 800, fontSize: 15, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 9, boxShadow: `0 4px 20px ${C}55` }}>
                <Phone size={15} /> Call Now — (713) 555-0199
              </a>
              <a href="#contact" style={{ border: "1px solid rgba(255,255,255,0.25)", color: "#fff", padding: "15px 24px", borderRadius: 6, fontWeight: 600, fontSize: 14, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}>
                Get a Quote <ArrowRight size={13} />
              </a>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
              {["Licensed & Insured", "TECL Certified", "NEC Compliant", "24/7 Emergency"].map(b => (
                <div key={b} style={{ display: "flex", alignItems: "center", gap: 8, color: "rgba(255,255,255,0.55)", fontSize: 12 }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", background: C }} /> {b}
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── BENEFITS ── */}
      <section style={{ background: DARK, padding: "64px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 40 }} className="benefits-grid">
          {[
            { title: "TECL Licensed",         desc: "State-licensed, fully insured, code-compliant. Every job." },
            { title: "Clients Come Back",      desc: "Most of our work is repeat business. That says everything." },
            { title: "On-Site Experience",     desc: "We know job sites, GC coordination, and tight schedules." },
            { title: "First-Time Inspections", desc: "Organized, documented work that passes inspection first time." },
          ].map(({ title, desc }, i) => (
            <FadeIn key={title} delay={i * 100}>
              <div style={{ width: 40, height: 2, background: C, marginBottom: 20 }} />
              <h3 style={{ color: "#fff", fontWeight: 700, fontSize: 15, marginBottom: 10 }}>{title}</h3>
              <p style={{ color: "#7A7060", fontSize: 13, lineHeight: 1.75, margin: 0 }}>{desc}</p>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ── SERVICES — badge icon cards like screenshot ── */}
      <section id="services" style={{ background: BG, padding: "96px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ width: 36, height: 1, background: C }} />
                <span style={{ color: C, fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase" }}>What We Do</span>
                <div style={{ width: 36, height: 1, background: C }} />
              </div>
              <h2 style={{ fontSize: "clamp(1.8rem,3.5vw,2.8rem)", fontWeight: 900, marginBottom: 0 }}>Our Specialized Services</h2>
            </div>
          </FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }} className="services-grid">
            {[
              {
                icon: Building2,
                title: "Commercial Electrical",
                tag: "Primary Focus",
                desc: "Full-scope commercial electrical — new construction, panel upgrades, tenant build-outs, lighting, and emergency power.",
                items: ["New Construction Wiring", "Panel & Service Upgrades", "Tenant Build-Outs", "Lighting Systems", "Emergency Power & Generators"],
              },
              {
                icon: Home,
                title: "Large-Scale Residential",
                tag: "High-Value Homes",
                desc: "Residential work that requires real expertise — full rewires, major panel replacements, and EV charging infrastructure.",
                items: ["Full Home Rewiring", "Panel Replacements (200A+)", "EV Charger Installation", "Whole-Home Surge Protection"],
              },
              {
                icon: Shield,
                title: "Safety & Maintenance",
                tag: "Ongoing Service",
                desc: "Scheduled inspections and maintenance to keep commercial facilities compliant, safe, and running without downtime.",
                items: ["Scheduled Inspections", "Code Compliance Audits", "System Testing", "Emergency Response"],
              },
            ].map((s, i) => (
              <FadeIn key={s.title} delay={i * 130}>
                <ServiceCard {...s} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT — /hero.jpg (electrician portrait, 900×1100) ── */}
      <section id="about" style={{ background: DARK, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: 540 }} className="photo-split">
          {/* Photo — /hero.jpg */}
          <div style={{ position: "relative", minHeight: 540 }}>
            <RevealImage src={`${BASE}hero.jpg`} position="center top" style={{ position: "absolute", inset: 0 }} />
            <div style={{ position: "absolute", inset: 0, background: "rgba(15,10,6,0.2)", pointerEvents: "none" }} />
          </div>
          {/* Text */}
          <FadeIn direction="right" style={{ padding: "80px 64px", display: "flex", flexDirection: "column", justifyContent: "center" }} className="about-text">
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
              <div style={{ width: 36, height: 1, background: C }} />
              <span style={{ color: C, fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase" }}>About Us</span>
            </div>
            <h2 style={{ fontSize: "clamp(1.8rem,3vw,2.6rem)", fontWeight: 900, color: "#fff", lineHeight: 1.15, marginBottom: 24 }}>
              We Only Take<br />
              <span style={{ color: C }}>Jobs We Can Nail.</span>
            </h2>
            <p style={{ color: "#9A9088", fontSize: 15, lineHeight: 1.85, marginBottom: 36 }}>
              Texas-based. TECL licensed. We work with GCs, property managers, and developers who need electrical done right — on schedule, to code, built to last. If it's not the right fit, we'll tell you upfront.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 36 }}>
              {["TECL Licensed", "Fully Insured", "NEC Compliant", "Texas-Based", "Commercial Specialist", "24/7 Emergency"].map(b => (
                <div key={b} style={{ display: "flex", alignItems: "center", gap: 8, color: "#9A9088", fontSize: 13 }}>
                  <div style={{ width: 5, height: 5, borderRadius: "50%", background: C, flexShrink: 0 }} /> {b}
                </div>
              ))}
            </div>
            <a href="#contact" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: C, color: "#fff", padding: "13px 26px", borderRadius: 6, fontWeight: 700, fontSize: 14, textDecoration: "none", alignSelf: "flex-start" }}>
              Start a Project <ArrowRight size={14} />
            </a>
          </FadeIn>
        </div>
      </section>

      {/* ── TESTIMONIALS — feature.jpg as dark photo background ── */}
      <section id="testimonials" style={{ position: "relative", padding: "96px 32px", overflow: "hidden" }}>
        {/* Photo background */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${BASE}feature.jpg)`, backgroundSize: "cover", backgroundPosition: "center" }} />
        {/* Dark overlay */}
        <div style={{ position: "absolute", inset: 0, background: "rgba(15,10,6,0.82)" }} />
        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ width: 36, height: 1, background: C }} />
                <span style={{ color: C, fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase" }}>Client Testimonials</span>
                <div style={{ width: 36, height: 1, background: C }} />
              </div>
              <h2 style={{ fontSize: "clamp(1.8rem,3.5vw,2.4rem)", fontWeight: 900, marginBottom: 12, color: "#fff" }}>What Our Clients Say</h2>
              <div style={{ display: "flex", justifyContent: "center", gap: 3, marginTop: 8 }}>
                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill={C} color={C} />)}
              </div>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, marginTop: 8 }}>5.0 · 80+ Google Reviews</p>
            </div>
          </FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }} className="services-grid">
            {[
              { name: "Marcus T.",   role: "Property Manager", quote: "Copperstone did a full panel upgrade and tenant build-out for our commercial property. Professional crew, on schedule, zero issues at inspection. Will use again." },
              { name: "Jennifer R.", role: "General Contractor", quote: "I've worked with a lot of electrical subs. These guys show up, do clean work, and communicate clearly. That's rare. First call for commercial projects." },
              { name: "David K.",    role: "Homeowner", quote: "Had a full rewire done on our 1960s home. The team was organized, respectful of the space, and the work passed inspection first time. Highly recommend." },
            ].map((t, i) => (
              <FadeIn key={t.name} delay={i * 130}>
                <TestimonialCard {...t} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" style={{ background: DARK, padding: "96px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: 72, alignItems: "start" }} className="split-grid">
            <FadeIn direction="left">
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                <div style={{ width: 36, height: 1, background: C }} />
                <span style={{ color: C, fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase" }}>Get in Touch</span>
              </div>
              <h2 style={{ fontSize: "clamp(1.8rem,3vw,2.6rem)", fontWeight: 900, color: "#fff", lineHeight: 1.15, marginBottom: 12 }}>
                Ready to Start?<br />
                <span style={{ color: C }}>Call or Send a Quote.</span>
              </h2>
              <p style={{ color: "#7A7060", fontSize: 14, lineHeight: 1.8, marginBottom: 28 }}>
                Commercial clients and GCs preferred. We respond fast.
              </p>
              {/* Primary phone CTA */}
              <a href="tel:+17135550199" style={{ display: "flex", alignItems: "center", gap: 14, background: C, borderRadius: 8, padding: "18px 22px", textDecoration: "none", marginBottom: 28 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Phone size={18} color="#fff" />
                </div>
                <div>
                  <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", margin: "0 0 2px" }}>Call Now · 24/7</p>
                  <p style={{ color: "#fff", fontWeight: 800, fontSize: 20, margin: 0 }}>(713) 555-0199</p>
                </div>
              </a>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {[
                  { icon: Mail,   value: "info@copperstoneelectric.com", sub: "2-hour response time" },
                  { icon: MapPin, value: "Greater Houston & Texas",      sub: "Commercial work statewide" },
                ].map(({ icon: Icon, value, sub }) => (
                  <div key={value} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: C + "22", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Icon size={15} color={C} />
                    </div>
                    <div>
                      <p style={{ color: "#fff", fontWeight: 600, fontSize: 14, margin: "0 0 2px" }}>{value}</p>
                      <p style={{ color: "#7A7060", fontSize: 12, margin: 0 }}>{sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </FadeIn>

            <FadeIn direction="right">
              <div style={{ background: "#fff", borderRadius: 12, padding: "40px 36px" }}>
                {submitted ? (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 14, padding: "48px 0" }}>
                    <CheckCircle size={48} color={C} />
                    <h3 style={{ color: DARK, fontWeight: 800, fontSize: 20, margin: 0 }}>Message Received.</h3>
                    <p style={{ color: GRAY, margin: 0 }}>We'll be in touch within 2 business hours.</p>
                    <button onClick={() => setSubmitted(false)} style={{ background: "none", border: "none", color: C, cursor: "pointer", fontSize: 13, textDecoration: "underline", marginTop: 4 }}>Send another</button>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                    <h3 style={{ color: DARK, fontWeight: 800, fontSize: 18, margin: "0 0 4px" }}>Request a Quote</h3>
                    {[
                      { id: "name",  label: "Full Name", type: "text",  placeholder: "Your Name" },
                      { id: "email", label: "Email",     type: "email", placeholder: "you@company.com" },
                      { id: "phone", label: "Phone",     type: "tel",   placeholder: "(713) 555-0000" },
                    ].map(f => (
                      <div key={f.id}>
                        <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: GRAY, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6 }}>{f.label}</label>
                        <input type={f.type} placeholder={f.placeholder} value={formData[f.id]}
                          onChange={e => setFormData({ ...formData, [f.id]: e.target.value })} style={inp} />
                      </div>
                    ))}
                    <div>
                      <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: GRAY, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6 }}>Service Needed</label>
                      <select value={formData.service} onChange={e => setFormData({ ...formData, service: e.target.value })} style={inp}>
                        <option value="">Select a service…</option>
                        <option>Commercial New Construction</option>
                        <option>Panel / Service Upgrade</option>
                        <option>Tenant Build-Out</option>
                        <option>Lighting System</option>
                        <option>Generator / Emergency Power</option>
                        <option>Preventive Maintenance</option>
                        <option>Full Home Rewire</option>
                        <option>EV Charger Installation</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: GRAY, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6 }}>Project Details</label>
                      <textarea rows={4} placeholder="Describe your project — scope, timeline, location."
                        value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })}
                        style={{ ...inp, resize: "vertical", fontFamily: "inherit" }} />
                    </div>
                    <button onClick={handleSubmit}
                      style={{ background: C, color: "#fff", border: "none", borderRadius: 6, padding: "15px 0", fontWeight: 800, fontSize: 15, cursor: "pointer", boxShadow: `0 4px 18px ${C}50`, letterSpacing: 0.3 }}>
                      Send My Quote Request →
                    </button>
                  </div>
                )}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: "#0e0b08", borderTop: "1px solid rgba(255,255,255,0.05)", padding: "48px 32px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px,1fr))", gap: 32, marginBottom: 36 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: C, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Zap size={13} color="#fff" />
                </div>
                <div>
                  <div style={{ color: "#fff", fontWeight: 800, fontSize: 11, letterSpacing: 1.5 }}>COPPERSTONE</div>
                  <div style={{ color: C, fontSize: 9, letterSpacing: 3, fontWeight: 600 }}>ELECTRIC LLC</div>
                </div>
              </div>
              <p style={{ color: "#4b4540", fontSize: 12, lineHeight: 1.7, margin: "0 0 6px" }}>Licensed. Reliable. Commercial-Grade.</p>
              <p style={{ color: "#4b4540", fontSize: 12, margin: 0 }}>TECL #XXXXXXX · Texas</p>
            </div>
            <div>
              <p style={{ color: C, fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 14 }}>Services</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {["Commercial Wiring", "Panel Upgrades", "Tenant Build-Outs", "Full Home Rewiring", "EV Charger Install"].map(l => (
                  <a key={l} href="#services" style={{ color: "#6b6560", fontSize: 13, textDecoration: "none" }}
                    onMouseEnter={e => e.target.style.color = "#fff"} onMouseLeave={e => e.target.style.color = "#6b6560"}>{l}</a>
                ))}
              </div>
            </div>
            <div>
              <p style={{ color: C, fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 14 }}>Company</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {["About Us", "Our Services", "Request Quote", "Emergency Service"].map(l => (
                  <a key={l} href="#" style={{ color: "#6b6560", fontSize: 13, textDecoration: "none" }}
                    onMouseEnter={e => e.target.style.color = "#fff"} onMouseLeave={e => e.target.style.color = "#6b6560"}>{l}</a>
                ))}
              </div>
            </div>
            <div>
              <p style={{ color: C, fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 14 }}>Contact</p>
              <p style={{ color: "#6b6560", fontSize: 13, margin: "0 0 6px" }}>(713) 555-0199</p>
              <p style={{ color: "#6b6560", fontSize: 13, margin: "0 0 6px" }}>info@copperstoneelectric.com</p>
              <p style={{ color: "#6b6560", fontSize: 13, margin: "0 0 16px" }}>Greater Houston & Texas</p>
              <a href="#contact" style={{ display: "inline-flex", alignItems: "center", gap: 6, background: C + "20", border: `1px solid ${C}40`, color: C, padding: "8px 14px", borderRadius: 6, fontSize: 12, fontWeight: 700, textDecoration: "none" }}>
                Get a Quote <ArrowRight size={11} />
              </a>
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 20, display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 8 }}>
            <p style={{ color: "#3a3530", fontSize: 12, margin: 0 }}>© 2025 Copperstone Electric LLC. All rights reserved.</p>
            <p style={{ color: "#3a3530", fontSize: 12, margin: 0 }}>Texas-Based · Licensed · Built on Performance</p>
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

// ── Service card with dark badge icon (matches screenshot style) ──
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
          <div key={item} style={{ display: "flex", alignItems: "center", gap: 8, color: DARK, fontSize: 13 }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: C, flexShrink: 0 }} />
            {item}
          </div>
        ))}
      </div>
      <a href="#contact" style={{ display: "inline-flex", alignItems: "center", gap: 6, background: DARK, color: "#fff", padding: "9px 18px", borderRadius: 6, fontSize: 12, fontWeight: 700, textDecoration: "none", alignSelf: "flex-start" }}>
        Learn More <ArrowRight size={12} />
      </a>
    </div>
  );
}

// ── Testimonial card ──────────────────────────────────────────────
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
          <p style={{ color: GRAY, fontSize: 12, margin: 0 }}>{role}</p>
        </div>
      </div>
    </div>
  );
}
