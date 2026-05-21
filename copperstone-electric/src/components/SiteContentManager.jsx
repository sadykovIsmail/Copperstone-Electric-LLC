import React, { useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Eye, Plus, RotateCcw, Save, Trash2 } from "lucide-react";
import {
  ABOUT_CONTENT,
  BENEFITS,
  BUSINESS_INFO,
  CONTACT_CONTENT,
  CONTACT_METHODS,
  HERO_CONTENT,
  NAV_LINKS,
  PROJECTS_NOTE,
  SERVICE_OPTIONS,
  SERVICES,
  SOCIAL_LINKS,
  TESTIMONIALS,
} from "../content/siteContent";
import { readPublishedSiteContent, savePublishedSiteContent } from "../lib/siteContentApi";
import { clearStoredSiteContent, readStoredSiteContent, readStoredSiteContentWithFallback, saveStoredSiteContent } from "../lib/siteContentStorage";
import { createDefaultSiteContent } from "../lib/siteContentData";

const C = "#C87533";
const DARK = "#070605";
const GRAY = "#5F564D";
const BORDER = "#E2D1B6";
const COMPACT_BREAKPOINT = 1100;

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function useViewportWidth() {
  const [width, setWidth] = useState(() => (typeof window === "undefined" ? 1440 : window.innerWidth));

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return width;
}

function updateSection(setDraft, section, key, value) {
  setDraft((current) => {
    const nextDraft = {
      ...current,
      [section]: {
        ...current[section],
        [key]: value,
      },
    };
    saveStoredSiteContent(nextDraft);
    return nextDraft;
  });
}

function updateListItem(setDraft, section, index, updater) {
  setDraft((current) => {
    const nextList = [...current[section]];
    nextList[index] = updater(nextList[index]);
    const nextDraft = { ...current, [section]: nextList };
    saveStoredSiteContent(nextDraft);
    return nextDraft;
  });
}

function addListItem(setDraft, section, item) {
  setDraft((current) => {
    const nextDraft = {
      ...current,
      [section]: [...current[section], item],
    };
    saveStoredSiteContent(nextDraft);
    return nextDraft;
  });
}

function removeListItem(setDraft, section, index) {
  setDraft((current) => {
    const nextDraft = {
      ...current,
      [section]: current[section].filter((_, listIndex) => listIndex !== index),
    };
    saveStoredSiteContent(nextDraft);
    return nextDraft;
  });
}

function SectionCard({ title, subtitle, isOpen, onToggle, children, onResetSection, onAdd }) {
  return (
    <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 14, overflow: "hidden" }}>
      <button
        type="button"
        onClick={onToggle}
        style={{
          width: "100%",
          padding: "16px 18px",
          border: "none",
          background: "#fff",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          textAlign: "left",
        }}
      >
        <div>
          <div style={{ color: C, fontSize: 12, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase" }}>{title}</div>
          <div style={{ color: GRAY, fontSize: 13, marginTop: 4 }}>{subtitle}</div>
        </div>
        {isOpen ? <ChevronUp size={18} color={C} /> : <ChevronDown size={18} color={C} />}
      </button>
      {isOpen && (
        <div style={{ borderTop: `1px solid ${BORDER}`, padding: 18 }}>
          {children}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 16 }}>
            {onAdd}
            {onResetSection}
          </div>
        </div>
      )}
    </div>
  );
}

export default function SiteContentManager() {
  const viewportWidth = useViewportWidth();
  const isCompact = viewportWidth < COMPACT_BREAKPOINT;
  const [draft, setDraft] = useState(() => readStoredSiteContentWithFallback(createDefaultSiteContent()));
  const [activeSection, setActiveSection] = useState("hero");
  const [showEditor, setShowEditor] = useState(() => !isCompact);
  const [status, setStatus] = useState("Edit a section, preview the live site, then publish when it looks right.");
  const [lastSaved, setLastSaved] = useState("");

  const sectionCount = useMemo(() => Object.keys(createDefaultSiteContent()).length, []);
  const gridCols = (columns) => (isCompact ? "1fr" : columns);
  const previewSectionMap = {
    hero: "hero",
    business: "hero",
    benefits: "benefits",
    services: "services",
    about: "about",
    testimonials: "testimonials",
    contact: "contact",
    lists: "contact",
  };
  const previewSection = previewSectionMap[activeSection] ?? "hero";
  const layoutStyle = isCompact
    ? { display: "grid", gridTemplateColumns: "1fr", gridTemplateAreas: '"preview" "editor"', gap: 22, alignItems: "start" }
    : { display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 22, alignItems: "start" };

  useEffect(() => {
    setShowEditor(!isCompact);
  }, [isCompact]);

  useEffect(() => {
    if (readStoredSiteContent()) return;

    let ignore = false;
    const loadPublished = async () => {
      const publishedContent = await readPublishedSiteContent();
      if (!ignore) {
        setDraft(publishedContent);
      }
    };

    loadPublished();

    return () => {
      ignore = true;
    };
  }, []);

  const handlePublish = () => {
    saveStoredSiteContent(draft);
    savePublishedSiteContent(draft)
      .then(() => {
        setStatus("Draft published to Supabase. The public site will use the saved version.");
        setLastSaved(new Date().toLocaleString());
      })
      .catch((error) => {
        alert(`Failed to publish site copy: ${error.message}`);
        setStatus("Publish failed. The draft is still saved locally.");
      });
  };

  const handleResetAll = () => {
    const defaults = createDefaultSiteContent();
    setDraft(defaults);
    clearStoredSiteContent();
    setStatus("Reset to the default Copperstone site copy.");
    setLastSaved("");
  };

  const fieldStyle = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 8,
    border: `1px solid ${BORDER}`,
    boxSizing: "border-box",
    fontFamily: "inherit",
    fontSize: 14,
    color: DARK,
    background: "#fff",
  };

  const textareaStyle = {
    ...fieldStyle,
    minHeight: 92,
    resize: "vertical",
  };

  const sectionButtonStyle = (sectionName) => ({
    padding: "10px 14px",
    borderRadius: 999,
    border: "1px solid transparent",
    background: activeSection === sectionName ? C : "#fff",
    color: activeSection === sectionName ? "#fff" : DARK,
    cursor: "pointer",
    fontWeight: 800,
  });

  return (
    <div style={layoutStyle}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14, minWidth: 0, gridArea: isCompact ? "editor" : "auto" }}>
        <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 14, padding: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <div>
              <div style={{ color: C, fontSize: 12, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase" }}>Site Content</div>
              <h3 style={{ margin: "4px 0 0", color: DARK }}>Section editor</h3>
            </div>
            <div style={{ color: GRAY, fontSize: 13 }}>{lastSaved ? `Last published: ${lastSaved}` : `${sectionCount} editable sections ready`}</div>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 14 }}>
            <button type="button" onClick={() => setActiveSection("hero")} style={sectionButtonStyle("hero")}>Hero</button>
            <button type="button" onClick={() => setActiveSection("business")} style={sectionButtonStyle("business")}>Business Info</button>
            <button type="button" onClick={() => setActiveSection("benefits")} style={sectionButtonStyle("benefits")}>Benefits</button>
            <button type="button" onClick={() => setActiveSection("services")} style={sectionButtonStyle("services")}>Services</button>
            <button type="button" onClick={() => setActiveSection("about")} style={sectionButtonStyle("about")}>About</button>
            <button type="button" onClick={() => setActiveSection("testimonials")} style={sectionButtonStyle("testimonials")}>Testimonials</button>
            <button type="button" onClick={() => setActiveSection("contact")} style={sectionButtonStyle("contact")}>Contact</button>
          </div>
          {isCompact && (
            <button
              type="button"
              onClick={() => setShowEditor((current) => !current)}
              style={{
                marginTop: 14,
                width: "100%",
                background: showEditor ? "#fff" : C,
                color: showEditor ? DARK : "#fff",
                border: `1px solid ${showEditor ? BORDER : C}`,
                borderRadius: 12,
                padding: "12px 14px",
                fontWeight: 900,
                cursor: "pointer",
              }}
            >
              {showEditor ? "Hide editor" : "Show editor"}
            </button>
          )}
        </div>

        {(!isCompact || showEditor) ? (
          <>
        <SectionCard
          title="Hero"
          subtitle="Edit the homepage top section copy"
          isOpen={activeSection === "hero"}
          onToggle={() => setActiveSection(activeSection === "hero" ? "" : "hero")}
        >
          <div style={{ display: "grid", gap: 12 }}>
            <input value={draft.hero.eyebrow} onChange={(e) => updateSection(setDraft, "hero", "eyebrow", e.target.value)} style={fieldStyle} placeholder="Eyebrow" />
            <div style={{ display: "grid", gridTemplateColumns: gridCols("1fr 1fr"), gap: 12 }}>
              <input value={draft.hero.titleLineOne} onChange={(e) => updateSection(setDraft, "hero", "titleLineOne", e.target.value)} style={fieldStyle} placeholder="Title line one" />
              <input value={draft.hero.titleAccent} onChange={(e) => updateSection(setDraft, "hero", "titleAccent", e.target.value)} style={fieldStyle} placeholder="Title accent" />
            </div>
            <textarea value={draft.hero.body} onChange={(e) => updateSection(setDraft, "hero", "body", e.target.value)} style={textareaStyle} placeholder="Hero body" />
            <div style={{ display: "grid", gridTemplateColumns: gridCols("1fr 1fr"), gap: 12 }}>
              <input value={draft.hero.primaryCta} onChange={(e) => updateSection(setDraft, "hero", "primaryCta", e.target.value)} style={fieldStyle} placeholder="Primary CTA" />
              <input value={draft.hero.secondaryCta} onChange={(e) => updateSection(setDraft, "hero", "secondaryCta", e.target.value)} style={fieldStyle} placeholder="Secondary CTA" />
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title="Business Info"
          subtitle="Phone, email, footer, and brand labels"
          isOpen={activeSection === "business"}
          onToggle={() => setActiveSection(activeSection === "business" ? "" : "business")}
        >
          <div style={{ display: "grid", gap: 12 }}>
            <div style={{ display: "grid", gridTemplateColumns: gridCols("1fr 1fr"), gap: 12 }}>
              <input value={draft.businessInfo.brandPrimary} onChange={(e) => updateSection(setDraft, "businessInfo", "brandPrimary", e.target.value)} style={fieldStyle} placeholder="Brand primary" />
              <input value={draft.businessInfo.brandSecondary} onChange={(e) => updateSection(setDraft, "businessInfo", "brandSecondary", e.target.value)} style={fieldStyle} placeholder="Brand secondary" />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: gridCols("1fr 1fr"), gap: 12 }}>
              <input value={draft.businessInfo.phoneDisplay} onChange={(e) => updateSection(setDraft, "businessInfo", "phoneDisplay", e.target.value)} style={fieldStyle} placeholder="Phone display" />
              <input value={draft.businessInfo.phoneHref} onChange={(e) => updateSection(setDraft, "businessInfo", "phoneHref", e.target.value)} style={fieldStyle} placeholder="Phone href" />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: gridCols("1fr 1fr"), gap: 12 }}>
              <input value={draft.businessInfo.email} onChange={(e) => updateSection(setDraft, "businessInfo", "email", e.target.value)} style={fieldStyle} placeholder="Email" />
              <input value={draft.businessInfo.serviceArea} onChange={(e) => updateSection(setDraft, "businessInfo", "serviceArea", e.target.value)} style={fieldStyle} placeholder="Service area" />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: gridCols("1fr 1fr"), gap: 12 }}>
              <input value={draft.businessInfo.serviceAreaSubtext} onChange={(e) => updateSection(setDraft, "businessInfo", "serviceAreaSubtext", e.target.value)} style={fieldStyle} placeholder="Service area subtext" />
              <input value={draft.businessInfo.responseTime} onChange={(e) => updateSection(setDraft, "businessInfo", "responseTime", e.target.value)} style={fieldStyle} placeholder="Response time" />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: gridCols("1fr 1fr"), gap: 12 }}>
              <input value={draft.businessInfo.availabilityLabel} onChange={(e) => updateSection(setDraft, "businessInfo", "availabilityLabel", e.target.value)} style={fieldStyle} placeholder="Availability label" />
              <input value={draft.businessInfo.footerTagline} onChange={(e) => updateSection(setDraft, "businessInfo", "footerTagline", e.target.value)} style={fieldStyle} placeholder="Footer tagline" />
            </div>
            <textarea value={draft.businessInfo.copyright} onChange={(e) => updateSection(setDraft, "businessInfo", "copyright", e.target.value)} style={textareaStyle} placeholder="Copyright" />
          </div>
        </SectionCard>

        <SectionCard
          title="Benefits"
          subtitle="Add, edit, or remove homepage benefit cards"
          isOpen={activeSection === "benefits"}
          onToggle={() => setActiveSection(activeSection === "benefits" ? "" : "benefits")}
          onAdd={(
            <button type="button" onClick={() => addListItem(setDraft, "benefits", { title: "New benefit", desc: "Describe the benefit here." })} style={{ background: C, color: "#fff", border: "none", borderRadius: 999, padding: "10px 14px", cursor: "pointer", fontWeight: 800, display: "inline-flex", alignItems: "center", gap: 8 }}>
              <Plus size={15} /> Add benefit
            </button>
          )}
          onResetSection={(
            <button type="button" onClick={() => setDraft((current) => { const nextDraft = { ...current, benefits: clone(BENEFITS) }; saveStoredSiteContent(nextDraft); return nextDraft; })} style={{ background: "#fff", color: DARK, border: `1px solid ${BORDER}`, borderRadius: 999, padding: "10px 14px", cursor: "pointer", fontWeight: 800 }}>
              Reset benefits
            </button>
          )}
        >
          <div style={{ display: "grid", gap: 12 }}>
            {draft.benefits.map((benefit, index) => (
              <div key={`${benefit.title}-${index}`} style={{ border: `1px solid ${BORDER}`, borderRadius: 12, padding: 12, background: "#faf7f1" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10, alignItems: "center", marginBottom: 10 }}>
                  <strong style={{ color: DARK }}>Benefit {index + 1}</strong>
                  <button type="button" onClick={() => removeListItem(setDraft, "benefits", index)} style={{ border: "none", background: "transparent", color: C, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, fontWeight: 800 }}>
                    <Trash2 size={15} /> Delete
                  </button>
                </div>
                <div style={{ display: "grid", gap: 10 }}>
                  <input value={benefit.title} onChange={(e) => updateListItem(setDraft, "benefits", index, (item) => ({ ...item, title: e.target.value }))} style={fieldStyle} placeholder="Title" />
                  <textarea value={benefit.desc} onChange={(e) => updateListItem(setDraft, "benefits", index, (item) => ({ ...item, desc: e.target.value }))} style={textareaStyle} placeholder="Description" />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Services"
          subtitle="Update service cards and their bullet items"
          isOpen={activeSection === "services"}
          onToggle={() => setActiveSection(activeSection === "services" ? "" : "services")}
          onAdd={(
            <button type="button" onClick={() => addListItem(setDraft, "services", { title: "New service", tag: "New", desc: "Describe the service.", items: ["Item one", "Item two"] })} style={{ background: C, color: "#fff", border: "none", borderRadius: 999, padding: "10px 14px", cursor: "pointer", fontWeight: 800, display: "inline-flex", alignItems: "center", gap: 8 }}>
              <Plus size={15} /> Add service
            </button>
          )}
          onResetSection={(
            <button type="button" onClick={() => setDraft((current) => { const nextDraft = { ...current, services: clone(SERVICES) }; saveStoredSiteContent(nextDraft); return nextDraft; })} style={{ background: "#fff", color: DARK, border: `1px solid ${BORDER}`, borderRadius: 999, padding: "10px 14px", cursor: "pointer", fontWeight: 800 }}>
              Reset services
            </button>
          )}
        >
          <div style={{ display: "grid", gap: 12 }}>
            {draft.services.map((service, index) => (
              <div key={`${service.title}-${index}`} style={{ border: `1px solid ${BORDER}`, borderRadius: 12, padding: 12, background: "#faf7f1" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10, alignItems: "center", marginBottom: 10 }}>
                  <strong style={{ color: DARK }}>Service {index + 1}</strong>
                  <button type="button" onClick={() => removeListItem(setDraft, "services", index)} style={{ border: "none", background: "transparent", color: C, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, fontWeight: 800 }}>
                    <Trash2 size={15} /> Delete
                  </button>
                </div>
                <div style={{ display: "grid", gap: 10 }}>
                  <div style={{ display: "grid", gridTemplateColumns: gridCols("1fr 0.6fr"), gap: 10 }}>
                    <input value={service.title} onChange={(e) => updateListItem(setDraft, "services", index, (item) => ({ ...item, title: e.target.value }))} style={fieldStyle} placeholder="Title" />
                    <input value={service.tag} onChange={(e) => updateListItem(setDraft, "services", index, (item) => ({ ...item, tag: e.target.value }))} style={fieldStyle} placeholder="Tag" />
                  </div>
                  <textarea value={service.desc} onChange={(e) => updateListItem(setDraft, "services", index, (item) => ({ ...item, desc: e.target.value }))} style={textareaStyle} placeholder="Description" />
                  <textarea
                    value={service.items.join("\n")}
                    onChange={(e) => updateListItem(setDraft, "services", index, (item) => ({ ...item, items: e.target.value.split("\n").map((entry) => entry.trim()).filter(Boolean) }))}
                    style={{ ...textareaStyle, minHeight: 110 }}
                    placeholder="One item per line"
                  />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="About"
          subtitle="Edit the about copy and bullet list"
          isOpen={activeSection === "about"}
          onToggle={() => setActiveSection(activeSection === "about" ? "" : "about")}
          onResetSection={(
            <button type="button" onClick={() => setDraft((current) => { const nextDraft = { ...current, about: { ...ABOUT_CONTENT, bullets: [...ABOUT_CONTENT.bullets] } }; saveStoredSiteContent(nextDraft); return nextDraft; })} style={{ background: "#fff", color: DARK, border: `1px solid ${BORDER}`, borderRadius: 999, padding: "10px 14px", cursor: "pointer", fontWeight: 800 }}>
              Reset about
            </button>
          )}
        >
          <div style={{ display: "grid", gap: 12 }}>
            <input value={draft.about.eyebrow} onChange={(e) => updateSection(setDraft, "about", "eyebrow", e.target.value)} style={fieldStyle} placeholder="Eyebrow" />
            <div style={{ display: "grid", gridTemplateColumns: gridCols("1fr 1fr"), gap: 12 }}>
              <input value={draft.about.titleLineOne} onChange={(e) => updateSection(setDraft, "about", "titleLineOne", e.target.value)} style={fieldStyle} placeholder="Title line one" />
              <input value={draft.about.titleAccent} onChange={(e) => updateSection(setDraft, "about", "titleAccent", e.target.value)} style={fieldStyle} placeholder="Title accent" />
            </div>
            <textarea value={draft.about.body} onChange={(e) => updateSection(setDraft, "about", "body", e.target.value)} style={textareaStyle} placeholder="About body" />
            <textarea value={draft.about.emphasis} onChange={(e) => updateSection(setDraft, "about", "emphasis", e.target.value)} style={textareaStyle} placeholder="Emphasis" />
            <input value={draft.about.cta} onChange={(e) => updateSection(setDraft, "about", "cta", e.target.value)} style={fieldStyle} placeholder="CTA label" />
            <textarea
              value={draft.about.bullets.join("\n")}
              onChange={(e) => setDraft((current) => { const nextDraft = { ...current, about: { ...current.about, bullets: e.target.value.split("\n").map((entry) => entry.trim()).filter(Boolean) } }; saveStoredSiteContent(nextDraft); return nextDraft; })}
              style={{ ...textareaStyle, minHeight: 140 }}
              placeholder="One bullet per line"
            />
          </div>
        </SectionCard>

        <SectionCard
          title="Testimonials"
          subtitle="Add, edit, or remove testimonial cards"
          isOpen={activeSection === "testimonials"}
          onToggle={() => setActiveSection(activeSection === "testimonials" ? "" : "testimonials")}
          onAdd={(
            <button type="button" onClick={() => addListItem(setDraft, "testimonials", { name: "New client", role: "Role", quote: "Add a testimonial quote." })} style={{ background: C, color: "#fff", border: "none", borderRadius: 999, padding: "10px 14px", cursor: "pointer", fontWeight: 800, display: "inline-flex", alignItems: "center", gap: 8 }}>
              <Plus size={15} /> Add testimonial
            </button>
          )}
          onResetSection={(
            <button type="button" onClick={() => setDraft((current) => { const nextDraft = { ...current, testimonials: clone(TESTIMONIALS) }; saveStoredSiteContent(nextDraft); return nextDraft; })} style={{ background: "#fff", color: DARK, border: `1px solid ${BORDER}`, borderRadius: 999, padding: "10px 14px", cursor: "pointer", fontWeight: 800 }}>
              Reset testimonials
            </button>
          )}
        >
          <div style={{ display: "grid", gap: 12 }}>
            {draft.testimonials.map((testimonial, index) => (
              <div key={`${testimonial.name}-${index}`} style={{ border: `1px solid ${BORDER}`, borderRadius: 12, padding: 12, background: "#faf7f1" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10, alignItems: "center", marginBottom: 10 }}>
                  <strong style={{ color: DARK }}>Testimonial {index + 1}</strong>
                  <button type="button" onClick={() => removeListItem(setDraft, "testimonials", index)} style={{ border: "none", background: "transparent", color: C, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, fontWeight: 800 }}>
                    <Trash2 size={15} /> Delete
                  </button>
                </div>
                <div style={{ display: "grid", gap: 10 }}>
                  <div style={{ display: "grid", gridTemplateColumns: gridCols("1fr 1fr"), gap: 10 }}>
                    <input value={testimonial.name} onChange={(e) => updateListItem(setDraft, "testimonials", index, (item) => ({ ...item, name: e.target.value }))} style={fieldStyle} placeholder="Name" />
                    <input value={testimonial.role} onChange={(e) => updateListItem(setDraft, "testimonials", index, (item) => ({ ...item, role: e.target.value }))} style={fieldStyle} placeholder="Role" />
                  </div>
                  <textarea value={testimonial.quote} onChange={(e) => updateListItem(setDraft, "testimonials", index, (item) => ({ ...item, quote: e.target.value }))} style={textareaStyle} placeholder="Quote" />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Contact"
          subtitle="Update the contact section and form labels"
          isOpen={activeSection === "contact"}
          onToggle={() => setActiveSection(activeSection === "contact" ? "" : "contact")}
          onResetSection={(
            <button type="button" onClick={() => setDraft((current) => { const nextDraft = { ...current, contact: { ...CONTACT_CONTENT } }; saveStoredSiteContent(nextDraft); return nextDraft; })} style={{ background: "#fff", color: DARK, border: `1px solid ${BORDER}`, borderRadius: 999, padding: "10px 14px", cursor: "pointer", fontWeight: 800 }}>
              Reset contact
            </button>
          )}
        >
          <div style={{ display: "grid", gap: 12 }}>
            <input value={draft.contact.eyebrow} onChange={(e) => updateSection(setDraft, "contact", "eyebrow", e.target.value)} style={fieldStyle} placeholder="Eyebrow" />
            <div style={{ display: "grid", gridTemplateColumns: gridCols("1fr 1fr"), gap: 12 }}>
              <input value={draft.contact.titleLineOne} onChange={(e) => updateSection(setDraft, "contact", "titleLineOne", e.target.value)} style={fieldStyle} placeholder="Title line one" />
              <input value={draft.contact.titleAccent} onChange={(e) => updateSection(setDraft, "contact", "titleAccent", e.target.value)} style={fieldStyle} placeholder="Title accent" />
            </div>
            <textarea value={draft.contact.body} onChange={(e) => updateSection(setDraft, "contact", "body", e.target.value)} style={textareaStyle} placeholder="Contact body" />
            <div style={{ display: "grid", gridTemplateColumns: gridCols("1fr 1fr"), gap: 12 }}>
              <input value={draft.contact.formTitle} onChange={(e) => updateSection(setDraft, "contact", "formTitle", e.target.value)} style={fieldStyle} placeholder="Form title" />
              <input value={draft.contact.successTitle} onChange={(e) => updateSection(setDraft, "contact", "successTitle", e.target.value)} style={fieldStyle} placeholder="Success title" />
            </div>
            <textarea value={draft.contact.successBody} onChange={(e) => updateSection(setDraft, "contact", "successBody", e.target.value)} style={textareaStyle} placeholder="Success body" />
            <div style={{ display: "grid", gridTemplateColumns: gridCols("1fr 1fr 1fr"), gap: 12 }}>
              <input value={draft.contact.resendLabel} onChange={(e) => updateSection(setDraft, "contact", "resendLabel", e.target.value)} style={fieldStyle} placeholder="Resend label" />
              <input value={draft.contact.submitLabel} onChange={(e) => updateSection(setDraft, "contact", "submitLabel", e.target.value)} style={fieldStyle} placeholder="Submit label" />
              <input value={draft.contact.sendingLabel} onChange={(e) => updateSection(setDraft, "contact", "sendingLabel", e.target.value)} style={fieldStyle} placeholder="Sending label" />
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title="Navigation, social, and service options"
          subtitle="These are text-only lists for the public site"
          isOpen={activeSection === "lists"}
          onToggle={() => setActiveSection(activeSection === "lists" ? "" : "lists")}
          onResetSection={(
            <button type="button" onClick={() => setDraft((current) => { const nextDraft = { ...current, navLinks: [...NAV_LINKS], socialLinks: { ...SOCIAL_LINKS }, serviceOptions: [...SERVICE_OPTIONS] }; saveStoredSiteContent(nextDraft); return nextDraft; })} style={{ background: "#fff", color: DARK, border: `1px solid ${BORDER}`, borderRadius: 999, padding: "10px 14px", cursor: "pointer", fontWeight: 800 }}>
              Reset lists
            </button>
          )}
        >
          <div style={{ display: "grid", gap: 12 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 800, color: GRAY, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1.5 }}>Navigation links, one per line</label>
              <textarea value={draft.navLinks.join("\n")} onChange={(e) => setDraft((current) => { const nextDraft = { ...current, navLinks: e.target.value.split("\n").map((entry) => entry.trim()).filter(Boolean) }; saveStoredSiteContent(nextDraft); return nextDraft; })} style={{ ...textareaStyle, minHeight: 110 }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: gridCols("1fr 1fr"), gap: 12 }}>
              <input value={draft.socialLinks.facebook} onChange={(e) => updateSection(setDraft, "socialLinks", "facebook", e.target.value)} style={fieldStyle} placeholder="Facebook URL" />
              <input value={draft.socialLinks.instagram} onChange={(e) => updateSection(setDraft, "socialLinks", "instagram", e.target.value)} style={fieldStyle} placeholder="Instagram URL" />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 800, color: GRAY, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1.5 }}>Service options, one per line</label>
              <textarea value={draft.serviceOptions.join("\n")} onChange={(e) => setDraft((current) => { const nextDraft = { ...current, serviceOptions: e.target.value.split("\n").map((entry) => entry.trim()).filter(Boolean) }; saveStoredSiteContent(nextDraft); return nextDraft; })} style={{ ...textareaStyle, minHeight: 150 }} />
            </div>
          </div>
        </SectionCard>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <button type="button" onClick={handlePublish} style={{ background: C, color: "white", border: "none", borderRadius: 999, padding: "12px 18px", fontWeight: 800, display: "inline-flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
            <Save size={16} /> Publish changes
          </button>
          <button type="button" onClick={handleResetAll} style={{ background: "white", color: DARK, border: `1px solid ${BORDER}`, borderRadius: 999, padding: "12px 18px", fontWeight: 800, display: "inline-flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
            <RotateCcw size={16} /> Reset all
          </button>
          <div style={{ color: GRAY, fontSize: 13 }}>{status}</div>
        </div>
          </>
        ) : (
          <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 14, padding: 18, color: GRAY, fontSize: 13, lineHeight: 1.6 }}>
            Open the editor to change site copy. The live preview stays visible above this panel on compact screens.
          </div>
        )}
      </div>

      <div style={{ position: isCompact ? "fixed" : "sticky", top: isCompact ? 118 : 18, left: isCompact ? 16 : "auto", right: isCompact ? 16 : "auto", width: isCompact ? "calc(100vw - 32px)" : "auto", zIndex: isCompact ? 20 : 1, display: "flex", flexDirection: "column", gap: 14, minWidth: 0, gridArea: isCompact ? "preview" : "auto" }}>
        <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 14, padding: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, color: C, fontWeight: 900, textTransform: "uppercase", letterSpacing: 1.5, fontSize: 12 }}>
            <Eye size={15} /> Live preview
          </div>
          <iframe
            title="Copperstone homepage preview"
            src={`/?previewDraft=1&previewSection=${previewSection}`}
            style={{ width: "100%", height: isCompact ? 150 : "78vh", minHeight: isCompact ? 150 : 720, border: "1px solid #ddd", borderRadius: 10, background: "#fff" }}
          />
        </div>
        <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 14, padding: 14, color: GRAY, fontSize: 13, lineHeight: 1.7 }}>
          The preview is the real homepage, so it uses the same styles and structure as the public site. Publish changes to see the draft apply.
        </div>
      </div>
    </div>
  );
}