import { useState, useEffect } from "react";
import {
  Zap, Shield, Phone, Mail, MapPin, Menu, X, Star,
  Home, Building2, CircuitBoard, Car, ChevronRight,
  Clock, Award, CheckCircle,
  HardHat, Wrench, ArrowRight, Lightbulb, Settings, AlertTriangle
} from "lucide-react";

const COPPER = "#C87533";
const CHARCOAL = "#1E2329";
const SLATE = "#3A4552";

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", service: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = ["Services", "Projects", "About", "Contact"];

  const commercialServices = [
    { icon: Building2, title: "New Construction Wiring", desc: "Full electrical rough-in and finish work for commercial builds — coordinated with your GC and completed on schedule." },
    { icon: CircuitBoard, title: "Panel & Service Upgrades", desc: "Commercial-grade panel replacements and service upgrades to support growing facility demands." },
    { icon: Lightbulb, title: "Lighting Systems", desc: "Interior and exterior commercial lighting design and installation, including LED retrofits for maximum efficiency." },
    { icon: Settings, title: "Tenant Build-Outs", desc: "Electrical fit-out for retail, office, and mixed-use spaces — permits, rough-in, and finish work handled end to end." },
    { icon: AlertTriangle, title: "Emergency Power & Generators", desc: "Transfer switch installation, generator hookups, and emergency power systems for critical commercial facilities." },
    { icon: Wrench, title: "Preventive Maintenance", desc: "Scheduled inspections and maintenance programs to keep commercial facilities running without unplanned downtime." },
  ];

  const residentialServices = [
    { icon: Home, title: "Full Home Rewiring", desc: "Complete rewiring for older homes or major renovations — done to current NEC standards with minimal disruption." },
    { icon: CircuitBoard, title: "Panel Replacements (200A+)", desc: "Service upgrades and panel replacements for homes that need real capacity, not a temporary fix." },
    { icon: Car, title: "EV Charger Installation", desc: "Level 1 and Level 2 EV charger installation, properly permitted and wired for long-term reliability." },
    { icon: Shield, title: "Whole-Home Surge Protection", desc: "Whole-panel surge protection to safeguard appliances, HVAC systems, and electronics from voltage events." },
  ];

  const projects = [
    { title: "Commercial Tenant Build-Out", tag: "Commercial", desc: "Full electrical scope for a 6,000 sq ft office fit-out — panels, lighting, data drops, and inspection sign-off delivered on schedule.", bg: "#2a1500" },
    { title: "Industrial Facility Lighting", tag: "Commercial", desc: "LED lighting retrofit across a 90,000 sq ft distribution facility — 38% energy reduction, zero production downtime.", bg: "#0e1a2a" },
    { title: "EV Fleet Charging Station", tag: "EV Infrastructure", desc: "Multi-port Level 2 commercial EV charging installation for a municipal vehicle fleet — permitted, inspected, and commissioned.", bg: "#0d1a14" },
    { title: "Luxury Home Rewire", tag: "Large Residential", desc: "Complete rewire of a 5,200 sq ft custom home with smart-home integration and whole-home surge protection.", bg: "#1a1020" },
    { title: "200A Service Upgrade", tag: "Large Residential", desc: "Panel replacement and service upgrade for a 1970s home — updated to current code with new grounding and surge protection.", bg: "#1a0e0a" },
    { title: "Retail Strip Build-Out", tag: "Commercial", desc: "Electrical installation for a 4-unit retail strip center — coordinated with GC across all phases from rough-in to final.", bg: "#0a1520" },
  ];

  const whyUs = [
    { icon: CheckCircle, title: "Licensed & Code-Compliant", desc: "Every project completed to Texas electrical code and NEC standards. No shortcuts. No callbacks." },
    { icon: Building2, title: "Commercial Experience", desc: "We understand job site coordination, trade sequencing, and what it takes to keep a project on schedule." },
    { icon: Award, title: "Clean, Professional Execution", desc: "Our work is organized, documented, and built to a standard that holds up to inspection — every time." },
    { icon: Phone, title: "Straight Communication", desc: "Clear timelines, honest assessments, and direct answers. No runaround, no surprises on the back end." },
  ];

  const handleSubmit = () => {
    if (!formData.name || !formData.email || !formData.service) return;
    setSubmitted(true);
  };

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", background: "#0a0e14", color: "#fff", minHeight: "100vh" }}>

      {/* NAV */}
      <nav style={{
        position: "fixed", top: 0, width: "100%", zIndex: 50,
        background: scrolled ? "rgba(10,14,20,0.96)" : "transparent",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
        backdropFilter: scrolled ? "blur(14px)" : "none",
        transition: "all 0.3s"
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          <a href="#" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: COPPER, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Zap size={18} color="#fff" />
            </div>
            <div style={{ lineHeight: 1.2 }}>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: 13, letterSpacing: 1 }}>COPPERSTONE</div>
              <div style={{ color: COPPER, fontSize: 10, letterSpacing: 3, fontWeight: 600 }}>ELECTRIC LLC</div>
            </div>
          </a>
          <div style={{ display: "flex", alignItems: "center", gap: 32 }} className="desktop-nav">
            {navLinks.map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} style={{ color: "#aaa", fontSize: 14, fontWeight: 500, textDecoration: "none" }}
                onMouseEnter={e => e.target.style.color = "#fff"} onMouseLeave={e => e.target.style.color = "#aaa"}>{l}</a>
            ))}
            <a href="#contact" style={{ background: COPPER, color: "#fff", padding: "8px 18px", borderRadius: 8, fontSize: 13, fontWeight: 700, textDecoration: "none" }}>Request Quote</a>
          </div>
          <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: "none", border: "none", color: "#ccc", cursor: "pointer" }} className="mobile-menu-btn">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        {menuOpen && (
          <div style={{ background: "#0a0e14", borderTop: "1px solid rgba(255,255,255,0.08)", padding: "12px 24px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
            {navLinks.map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setMenuOpen(false)} style={{ color: "#ccc", fontSize: 14, fontWeight: 500, textDecoration: "none" }}>{l}</a>
            ))}
            <a href="#contact" onClick={() => setMenuOpen(false)} style={{ background: COPPER, color: "#fff", padding: "10px 0", borderRadius: 8, fontSize: 13, fontWeight: 700, textDecoration: "none", textAlign: "center", marginTop: 8 }}>Request Quote</a>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", background: `linear-gradient(135deg, ${CHARCOAL} 0%, #0d1117 55%, #080c10 100%)`, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "25%", right: "-5%", width: 650, height: 650, borderRadius: "50%", background: COPPER, filter: "blur(130px)", opacity: 0.07, pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.05) 1px,transparent 1px)", backgroundSize: "44px 44px", opacity: 0.4, pointerEvents: "none" }} />
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "96px 24px 64px", position: "relative", width: "100%" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 999, border: `1px solid ${COPPER}55`, background: COPPER + "15", color: COPPER, fontSize: 11, fontWeight: 700, letterSpacing: 0.5, marginBottom: 28 }}>
            <Shield size={11} /> Licensed Electrical Contractor · TECL · Texas
          </div>
          <h1 style={{ fontSize: "clamp(2.4rem,5.5vw,4rem)", fontWeight: 900, lineHeight: 1.08, margin: "0 0 12px", maxWidth: 720 }}>
            Commercial Electrical<br />
            <span style={{ color: COPPER }}>Work Done Right.</span>
          </h1>
          <p style={{ fontSize: 15, fontWeight: 700, color: COPPER, letterSpacing: 1.5, textTransform: "uppercase", margin: "0 0 24px" }}>
            Built for Performance. Wired for Reliability.
          </p>
          <p style={{ color: "#9ca3af", fontSize: 17, maxWidth: 560, margin: "0 0 16px", lineHeight: 1.75 }}>
            Copperstone Electric LLC is a Texas-based licensed electrical contractor specializing in commercial projects and large-scale residential work.
          </p>
          <p style={{ color: "#6b7280", fontSize: 15, maxWidth: 520, margin: "0 0 40px", lineHeight: 1.7 }}>
            We deliver code-compliant, professionally executed electrical solutions for businesses, developers, and contractors who need reliable results. No small jobs — just serious work, done right.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginBottom: 44 }}>
            <a href="#contact" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: COPPER, color: "#fff", padding: "13px 26px", borderRadius: 10, fontWeight: 700, fontSize: 14, textDecoration: "none", boxShadow: `0 8px 28px ${COPPER}40` }}>
              Request a Quote <ArrowRight size={15} />
            </a>
            <a href="tel:+17135550199" style={{ display: "inline-flex", alignItems: "center", gap: 8, border: "1px solid rgba(255,255,255,0.15)", color: "#fff", padding: "13px 26px", borderRadius: 10, fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
              <Phone size={15} color={COPPER} /> 24/7 Emergency Line
            </a>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 22 }}>
            {[{ icon: Shield, label: "Licensed & Insured" }, { icon: Award, label: "TECL Certified" }, { icon: CheckCircle, label: "NEC Code Compliant" }, { icon: Clock, label: "24/7 Emergency" }].map(({ icon: Icon, label }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 7, color: "#9ca3af", fontSize: 13 }}>
                <Icon size={14} color={COPPER} /> {label}
              </div>
            ))}
          </div>
        </div>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 80, background: "linear-gradient(to top, #0a0e14, transparent)" }} />
      </section>

      {/* SERVICES */}
      <section id="services" style={{ padding: "88px 24px", background: "#0a0e14" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          {/* Commercial */}
          <div style={{ marginBottom: 72 }}>
            <div style={{ marginBottom: 48 }}>
              <p style={{ color: COPPER, fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", marginBottom: 12 }}>Primary Focus</p>
              <h2 style={{ fontSize: "clamp(1.8rem,3vw,2.5rem)", fontWeight: 900, marginBottom: 12 }}>Commercial Electrical</h2>
              <p style={{ color: "#6b7280", maxWidth: 560, lineHeight: 1.7 }}>
                We handle the full scope of commercial electrical work — from ground-up installations to system upgrades and ongoing maintenance for occupied facilities. We work with GCs, property managers, developers, and business owners.
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 18 }}>
              {commercialServices.map(s => <ServiceCard key={s.title} {...s} copper={COPPER} />)}
            </div>
          </div>

          {/* Divider */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", marginBottom: 72 }} />

          {/* Residential */}
          <div>
            <div style={{ marginBottom: 48 }}>
              <p style={{ color: COPPER, fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", marginBottom: 12 }}>Large-Scale Residential</p>
              <h2 style={{ fontSize: "clamp(1.8rem,3vw,2.5rem)", fontWeight: 900, marginBottom: 12 }}>High-Value Home Projects</h2>
              <p style={{ color: "#6b7280", maxWidth: 580, lineHeight: 1.7 }}>
                We take on residential projects that require real technical expertise — panel replacements, full rewires, and major system upgrades.
                <span style={{ color: "#4b5563" }}> We do not handle minor repairs or single-outlet service calls.</span>
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 18 }}>
              {residentialServices.map(s => <ServiceCard key={s.title} {...s} copper={COPPER} />)}
            </div>
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section style={{ padding: "88px 24px", background: CHARCOAL }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 48, alignItems: "center" }}>
            <div>
              <p style={{ color: COPPER, fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", marginBottom: 14 }}>Why Clients Choose Us</p>
              <h2 style={{ fontSize: "clamp(1.8rem,3vw,2.6rem)", fontWeight: 900, lineHeight: 1.15, marginBottom: 20 }}>
                We're Not the Right Fit for Every Job.<br />
                <span style={{ color: COPPER }}>That's the Point.</span>
              </h2>
              <p style={{ color: "#9ca3af", lineHeight: 1.8, marginBottom: 12 }}>
                Copperstone Electric focuses on commercial clients, contractors, and property managers who need electrical done correctly — on schedule, to code, and built to last.
              </p>
              <p style={{ color: "#6b7280", lineHeight: 1.8 }}>
                Most of our clients come back. That's the standard we hold ourselves to.
              </p>
              <div style={{ marginTop: 32 }}>
                <a href="#contact" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: COPPER, color: "#fff", padding: "12px 22px", borderRadius: 10, fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
                  Talk About Your Project <ArrowRight size={14} />
                </a>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {whyUs.map(({ icon: Icon, title, desc }) => (
                <div key={title} style={{ display: "flex", gap: 16, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "20px 22px" }}>
                  <div style={{ width: 42, height: 42, borderRadius: 10, background: COPPER + "20", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon size={19} color={COPPER} />
                  </div>
                  <div>
                    <p style={{ color: "#fff", fontWeight: 800, fontSize: 15, margin: "0 0 5px" }}>{title}</p>
                    <p style={{ color: "#9ca3af", fontSize: 13, lineHeight: 1.65, margin: 0 }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" style={{ padding: "88px 24px", background: "#0a0e14" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <p style={{ color: COPPER, fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", marginBottom: 12 }}>Our Work</p>
            <h2 style={{ fontSize: "clamp(1.8rem,3vw,2.5rem)", fontWeight: 900, marginBottom: 12 }}>Featured Projects</h2>
            <p style={{ color: "#6b7280", maxWidth: 480, margin: "0 auto", lineHeight: 1.7 }}>Commercial builds, facility upgrades, and large-scale residential work across Texas.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 18 }}>
            {projects.map(p => <ProjectCard key={p.title} {...p} copper={COPPER} />)}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" style={{ padding: "88px 24px", background: CHARCOAL }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 56, alignItems: "center" }}>
          <div style={{ position: "relative" }}>
            <div style={{ borderRadius: 20, overflow: "hidden", maxWidth: 380, background: `linear-gradient(160deg, ${SLATE}, #0d1117)`, aspectRatio: "4/5", display: "flex", alignItems: "flex-end", justifyContent: "center", position: "relative" }}>
              <HardHat size={120} color="#ffffff10" style={{ position: "absolute", top: "40%", left: "50%", transform: "translate(-50%,-50%)" }} />
              <div style={{ padding: "0 28px 44px", textAlign: "center", position: "relative", zIndex: 1 }}>
                <div style={{ width: 104, height: 104, borderRadius: "50%", border: `4px solid ${COPPER}`, background: SLATE, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                  <span style={{ fontSize: 34, fontWeight: 900, color: COPPER }}>CE</span>
                </div>
                <p style={{ color: "#fff", fontWeight: 800, fontSize: 18, margin: "0 0 4px" }}>Copperstone Electric</p>
                <p style={{ color: "#9ca3af", fontSize: 13 }}>Licensed Electrical Contractor · Texas</p>
              </div>
            </div>
            <div style={{ position: "absolute", bottom: -12, right: 0, background: COPPER, borderRadius: 14, padding: "14px 22px", boxShadow: `0 8px 24px ${COPPER}50` }}>
              <div style={{ color: "#fff", fontWeight: 900, fontSize: 30, lineHeight: 1 }}>TECL</div>
              <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 11, fontWeight: 600, marginTop: 2 }}>Licensed · Insured</div>
            </div>
          </div>

          <div>
            <p style={{ color: COPPER, fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", marginBottom: 14 }}>About Us</p>
            <h2 style={{ fontSize: "clamp(1.8rem,3vw,2.5rem)", fontWeight: 900, marginBottom: 24, lineHeight: 1.2 }}>
              Commercially Focused.<br />
              <span style={{ color: COPPER }}>Professionally Executed.</span>
            </h2>
            <p style={{ color: "#d1d5db", lineHeight: 1.85, marginBottom: 18, fontSize: 15 }}>
              Copperstone Electric LLC is a licensed electrical contractor based in Texas, focused on commercial electrical projects and large-scale residential work.
            </p>
            <p style={{ color: "#9ca3af", lineHeight: 1.85, marginBottom: 18, fontSize: 15 }}>
              We work with businesses, property managers, developers, and general contractors who need electrical done correctly — on schedule, to code, and built to last.
            </p>
            <p style={{ color: "#9ca3af", lineHeight: 1.85, marginBottom: 32, fontSize: 15 }}>
              Our work speaks for itself. From full system installations to complex upgrades, we deliver consistent results on projects that demand professional execution.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {["TECL Licensed", "Commercial Electrical", "NEC Code Compliant", "Texas-Based", "Insured"].map(b => (
                <span key={b} style={{ fontSize: 11, padding: "5px 13px", borderRadius: 999, border: `1px solid ${COPPER}50`, color: COPPER, background: COPPER + "10", fontWeight: 700 }}>{b}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" style={{ padding: "88px 24px", background: "#0a0e14" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <p style={{ color: COPPER, fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", marginBottom: 12 }}>Get In Touch</p>
            <h2 style={{ fontSize: "clamp(1.8rem,3vw,2.5rem)", fontWeight: 900, marginBottom: 12 }}>Have a Project? Let's Talk.</h2>
            <p style={{ color: "#6b7280", maxWidth: 480, margin: "0 auto", lineHeight: 1.7 }}>We work with commercial clients, contractors, and property managers across Texas. Contact us for a professional assessment.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 32 }}>
            {/* Form */}
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: 32 }}>
              {submitted ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: 16, padding: "40px 0" }}>
                  <CheckCircle size={52} color={COPPER} />
                  <h3 style={{ color: "#fff", fontWeight: 800, fontSize: 20, margin: 0 }}>Message Received.</h3>
                  <p style={{ color: "#9ca3af", margin: 0 }}>We'll be in touch within 2 business hours.</p>
                  <button onClick={() => setSubmitted(false)} style={{ background: "none", border: "none", color: COPPER, cursor: "pointer", fontSize: 13, textDecoration: "underline", marginTop: 4 }}>Send another</button>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {[
                    { id: "name", label: "Full Name", type: "text", placeholder: "Your Name" },
                    { id: "email", label: "Email Address", type: "email", placeholder: "you@company.com" },
                    { id: "phone", label: "Phone Number", type: "tel", placeholder: "(713) 555-0000" },
                  ].map(f => (
                    <div key={f.id}>
                      <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6 }}>{f.label}</label>
                      <input type={f.type} placeholder={f.placeholder} value={formData[f.id]}
                        onChange={e => setFormData({ ...formData, [f.id]: e.target.value })}
                        style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "11px 16px", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
                    </div>
                  ))}
                  <div>
                    <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6 }}>Service Needed</label>
                    <select value={formData.service} onChange={e => setFormData({ ...formData, service: e.target.value })}
                      style={{ width: "100%", background: "#111318", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "11px 16px", color: "#ccc", fontSize: 14, outline: "none" }}>
                      <option value="">Select a service…</option>
                      <option>Commercial New Construction</option>
                      <option>Panel / Service Upgrade</option>
                      <option>Tenant Build-Out</option>
                      <option>Lighting System</option>
                      <option>Generator / Emergency Power</option>
                      <option>Preventive Maintenance</option>
                      <option>Full Home Rewire</option>
                      <option>EV Charger Installation</option>
                      <option>Other / Not Listed</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6 }}>Project Details</label>
                    <textarea rows={4} placeholder="Describe your project — scope, timeline, and location if possible."
                      value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })}
                      style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "11px 16px", color: "#fff", fontSize: 14, outline: "none", resize: "vertical", boxSizing: "border-box", fontFamily: "inherit" }} />
                  </div>
                  <button onClick={handleSubmit} style={{ background: COPPER, color: "#fff", border: "none", borderRadius: 10, padding: "13px 0", fontWeight: 700, fontSize: 15, cursor: "pointer", marginTop: 4, boxShadow: `0 6px 20px ${COPPER}40` }}>
                    Submit Request
                  </button>
                </div>
              )}
            </div>

            {/* Info */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { icon: Phone, label: "Phone", value: "(713) 555-0199", sub: "Available 24/7 for emergencies" },
                { icon: Mail, label: "Email", value: "info@copperstoneelectric.com", sub: "We respond within 2 business hours" },
                { icon: MapPin, label: "Service Area", value: "Greater Houston & Texas", sub: "Commercial projects statewide" },
                { icon: Clock, label: "Business Hours", value: "Mon – Fri: 7am – 6pm", sub: "24/7 emergency service available" },
              ].map(({ icon: Icon, label, value, sub }) => (
                <div key={label} style={{ display: "flex", alignItems: "flex-start", gap: 16, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "18px 22px" }}>
                  <div style={{ width: 42, height: 42, borderRadius: 10, background: COPPER + "20", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon size={18} color={COPPER} />
                  </div>
                  <div>
                    <p style={{ color: "#6b7280", fontSize: 10, textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 700, margin: "0 0 2px" }}>{label}</p>
                    <p style={{ color: "#fff", fontWeight: 700, margin: "0 0 3px", fontSize: 15 }}>{value}</p>
                    <p style={{ color: "#9ca3af", fontSize: 13, margin: 0 }}>{sub}</p>
                  </div>
                </div>
              ))}
              <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "16px 22px" }}>
                <div style={{ display: "flex", gap: 3 }}>
                  {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={COPPER} color={COPPER} />)}
                </div>
                <p style={{ color: "#d1d5db", fontSize: 13, fontWeight: 600, margin: 0 }}>5.0 · 80+ Google Reviews</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#060a0f", borderTop: "1px solid rgba(255,255,255,0.05)", padding: "52px 24px 28px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 36, marginBottom: 40 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div style={{ width: 34, height: 34, borderRadius: 8, background: COPPER, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Zap size={16} color="#fff" />
                </div>
                <div style={{ lineHeight: 1.2 }}>
                  <div style={{ color: "#fff", fontWeight: 800, fontSize: 12, letterSpacing: 1 }}>COPPERSTONE</div>
                  <div style={{ color: COPPER, fontSize: 9, letterSpacing: 3, fontWeight: 600 }}>ELECTRIC LLC</div>
                </div>
              </div>
              <p style={{ color: "#4b5563", fontSize: 13, fontStyle: "italic", lineHeight: 1.7, marginBottom: 14 }}>
                "Licensed. Reliable. Commercial-Grade."
              </p>
              <p style={{ color: "#374151", fontSize: 12, margin: 0 }}>TX Electrical Contractor</p>
              <p style={{ color: "#9ca3af", fontSize: 12, margin: "3px 0 0" }}>License: <span style={{ color: "#9ca3af" }}>TECL #XXXXXXX</span></p>
            </div>
            <div>
              <p style={{ color: COPPER, fontSize: 10, fontWeight: 700, letterSpacing: 2.5, textTransform: "uppercase", marginBottom: 18 }}>Services</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {["Commercial Wiring", "Panel Upgrades", "Tenant Build-Outs", "Lighting Systems", "Full Home Rewiring", "EV Charger Install"].map(l => (
                  <a key={l} href="#services" style={{ color: "#6b7280", fontSize: 13, textDecoration: "none" }}
                    onMouseEnter={e => e.target.style.color = "#fff"} onMouseLeave={e => e.target.style.color = "#6b7280"}>{l}</a>
                ))}
              </div>
            </div>
            <div>
              <p style={{ color: COPPER, fontSize: 10, fontWeight: 700, letterSpacing: 2.5, textTransform: "uppercase", marginBottom: 18 }}>Company</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {["About Us", "Our Projects", "Request Quote", "Emergency Service"].map(l => (
                  <a key={l} href="#" style={{ color: "#6b7280", fontSize: 13, textDecoration: "none" }}
                    onMouseEnter={e => e.target.style.color = "#fff"} onMouseLeave={e => e.target.style.color = "#6b7280"}>{l}</a>
                ))}
              </div>
            </div>
            <div>
              <p style={{ color: COPPER, fontSize: 10, fontWeight: 700, letterSpacing: 2.5, textTransform: "uppercase", marginBottom: 18 }}>Follow Us</p>
              <div style={{ display: "flex", gap: 10, marginBottom: 22 }}>
                {[
                  <svg key="fb" viewBox="0 0 24 24" width={15} height={15} fill="#6b7280"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>,
                  <svg key="ig" viewBox="0 0 24 24" width={15} height={15} fill="none" stroke="#6b7280" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="#6b7280" stroke="none"/></svg>,
                  <svg key="li" viewBox="0 0 24 24" width={15} height={15} fill="#6b7280"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4V9h4v2a6 6 0 0 1 2-2z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>,
                ].map((icon, i) => (
                  <a key={i} href="#" style={{ width: 38, height: 38, borderRadius: 10, border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {icon}
                  </a>
                ))}
              </div>
              <a href="#contact" style={{ display: "inline-flex", alignItems: "center", gap: 7, background: COPPER + "20", border: `1px solid ${COPPER}40`, color: COPPER, padding: "9px 16px", borderRadius: 8, fontSize: 12, fontWeight: 700, textDecoration: "none" }}>
                Request a Quote <ArrowRight size={12} />
              </a>
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 22, display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 8 }}>
            <p style={{ color: "#374151", fontSize: 12, margin: 0 }}>© 2025 Copperstone Electric LLC. All rights reserved.</p>
            <p style={{ color: "#374151", fontSize: 12, margin: 0 }}>Texas-Based · Licensed · Built on Performance</p>
          </div>
        </div>
      </footer>

      <style>{`
        @media (max-width: 768px) { .desktop-nav { display: none !important; } }
        @media (min-width: 769px) { .mobile-menu-btn { display: none !important; } }
      `}</style>
    </div>
  );
}

function ServiceCard({ icon: Icon, title, desc, copper }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ borderRadius: 16, padding: "24px 24px 22px", border: `1px solid ${hov ? copper + "45" : "rgba(255,255,255,0.06)"}`, background: hov ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.02)", transition: "all 0.3s", cursor: "default" }}>
      <div style={{ width: 46, height: 46, borderRadius: 12, background: copper + "20", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
        <Icon size={21} color={copper} />
      </div>
      <h3 style={{ color: "#fff", fontWeight: 800, fontSize: 15, marginBottom: 9 }}>{title}</h3>
      <p style={{ color: "#9ca3af", fontSize: 13, lineHeight: 1.7, margin: 0 }}>{desc}</p>
      <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 4, color: copper, fontSize: 12, fontWeight: 700, opacity: hov ? 1 : 0, transition: "opacity 0.25s" }}>
        Learn More <ChevronRight size={12} />
      </div>
    </div>
  );
}

function ProjectCard({ title, tag, desc, bg, copper }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ borderRadius: 20, overflow: "hidden", position: "relative", height: 272, cursor: "pointer", border: `1px solid ${hov ? copper + "40" : "rgba(255,255,255,0.06)"}`, transition: "border-color 0.3s" }}>
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(140deg, ${bg} 0%, #080c10 100%)`, transform: hov ? "scale(1.05)" : "scale(1)", transition: "transform 0.5s" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)" }} />
      <div style={{ position: "absolute", top: 18, right: 18, width: 36, height: 36, borderRadius: 10, background: copper + "25", display: "flex", alignItems: "center", justifyContent: "center", opacity: hov ? 0.75 : 0.25, transition: "opacity 0.3s" }}>
        <Zap size={16} color="#fff" />
      </div>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "22px 24px", transform: hov ? "translateY(-4px)" : "translateY(0)", transition: "transform 0.3s" }}>
        <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 999, background: copper + "28", color: copper, display: "inline-block", marginBottom: 10, letterSpacing: 0.5 }}>{tag}</span>
        <h3 style={{ color: "#fff", fontWeight: 800, fontSize: 16, marginBottom: 8 }}>{title}</h3>
        <p style={{ color: "#d1d5db", fontSize: 13, lineHeight: 1.65, margin: 0, opacity: hov ? 1 : 0, transition: "opacity 0.3s" }}>{desc}</p>
        <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 5, color: copper, fontSize: 12, fontWeight: 700, opacity: hov ? 1 : 0, transition: "opacity 0.3s" }}>
          View Details <ArrowRight size={12} />
        </div>
      </div>
    </div>
  );
}