import { Building2, Home, Mail, MapPin, Shield } from "lucide-react";

export const NAV_LINKS = ["Services", "Projects", "About", "Testimonials", "Contact"];

export const SOCIAL_LINKS = {
  facebook: "https://www.facebook.com/share/1AefHaHG1Y/",
  instagram: "https://www.instagram.com/copperstone.electric?igsh=anc3ZWJvb2pqeDdn&utm_source=qr",
};

export const BUSINESS_INFO = {
  companyName: "Copperstone Electric LLC",
  brandPrimary: "COPPERSTONE",
  brandSecondary: "ELECTRIC LLC",
  phoneDisplay: "(415) 952-0294",
  phoneHref: "tel:+14159520294",
  email: "info@copperstoneelectric.com",
  serviceArea: "Greater Houston & Texas",
  serviceAreaSubtext: "Commercial work statewide",
  responseTime: "2-hour response time",
  availabilityLabel: "Call Now - 24/7",
  footerTagline: "Texas - Licensed & Insured",
  copyright: "(c) 2026 Copperstone Electric LLC. All rights reserved.",
};

export const HERO_CONTENT = {
  eyebrow: "Licensed Electrical Contractor - Texas",
  titleLineOne: "Powering Commercial",
  titleAccent: "Projects Across Texas",
  body: "Texas-licensed. Fully insured. Built for commercial projects from ground-up construction to complex upgrades.",
  primaryCta: "Request a Quote",
  secondaryCta: BUSINESS_INFO.phoneDisplay,
};

export const BENEFITS = [
  { title: "State Licensed & Fully Insured", desc: "Credentialed, covered, and accountable on every project." },
  { title: "Commercial Project Focused", desc: "Built for commercial scopes, coordination, and execution." },
  { title: "On-Time, Code-Compliant Work", desc: "Schedule-driven delivery with NEC-compliant installation." },
  { title: "Pass Inspections the First Time", desc: "Clean documentation and quality standards that hold up." },
];

export const SERVICES = [
  {
    icon: Building2,
    title: "Commercial Electrical",
    tag: "Primary Focus",
    desc: "Full-service commercial electrical contractor. New construction, tenant build-outs, service upgrades, lighting systems, and emergency power solutions.",
    items: ["New Construction Wiring", "Panel & Service Upgrades", "Tenant Build-Outs", "Lighting Systems", "Emergency Power & Generators"],
  },
  {
    icon: Home,
    title: "Large-Scale Residential",
    tag: "High-Value Homes",
    desc: "High-demand residential electrical projects including full rewires, panel replacements, and EV charging infrastructure.",
    items: ["Full Home Rewiring", "Panel Replacements (200A+)", "EV Charger Installation", "Whole-Home Surge Protection"],
  },
  {
    icon: Shield,
    title: "Safety & Maintenance",
    tag: "Ongoing Service",
    desc: "Preventive maintenance, inspections, and troubleshooting to keep your facility safe, compliant, and operating without downtime.",
    items: ["Scheduled Inspections", "Code Compliance Audits", "System Testing", "Emergency Response"],
  },
];

export const PROJECTS = [
  {
    slug: "commercial-panel-upgrade",
    title: "Commercial Panel Upgrade",
    projectType: "Industrial",
    location: "Houston, TX",
    summary: "Service upgrade and distribution work for a commercial facility expansion.",
    imagePath: "tools.jpg",
    imageAlt: "Electrician working on a commercial panel upgrade",
    isFeatured: true,
    sortOrder: 1,
  },
  {
    slug: "tenant-build-out-wiring",
    title: "Tenant Build-Out Wiring",
    projectType: "Retail",
    location: "Dallas, TX",
    summary: "New wiring, lighting, and finish-out support for a retail tenant space.",
    imagePath: "feature.jpg",
    imageAlt: "Retail electrical build-out with finished lighting and wiring",
    isFeatured: true,
    sortOrder: 2,
  },
  {
    slug: "full-facility-rewire",
    title: "Full Facility Rewire",
    projectType: "Commercial",
    location: "Austin, TX",
    summary: "Full-system rewire for an occupied commercial property with phased execution.",
    imagePath: "tools.jpg",
    imageAlt: "Commercial electrical tools staged for a full facility rewire",
    isFeatured: true,
    sortOrder: 3,
  },
];

export const PROJECTS_NOTE = "Add your own project photos any time to replace these placeholders and showcase recent commercial work.";

export const ABOUT_CONTENT = {
  eyebrow: "About Us",
  titleLineOne: "Built for Commercial",
  titleAccent: "Electrical Work.",
  body: "Copperstone Electric LLC is a Texas-licensed electrical contractor focused on commercial projects. We work with general contractors, developers, and property managers who need reliable execution on schedule, on budget, and up to code. If a project requires precision, coordination, and accountability, we deliver.",
  emphasis: "Copperstone Electric LLC delivers professional commercial electrical work across Texas built to code, built to last.",
  bullets: ["TECL Licensed", "NEC Compliant", "Commercial-Focused", "Fully Insured", "Houston-Based", "24/7 Availability"],
  cta: "Start a Project",
};

export const TESTIMONIALS = [
  {
    name: "Marcus T.",
    role: "Property Manager",
    quote: "Copperstone did a full panel upgrade and tenant build-out for our commercial property. Professional crew, on schedule, zero issues at inspection. Will use again.",
  },
  {
    name: "Jennifer R.",
    role: "General Contractor",
    quote: "I've worked with a lot of electrical subs. These guys show up, do clean work, and communicate clearly. That's rare. First call for commercial projects.",
  },
  {
    name: "David K.",
    role: "Homeowner",
    quote: "Had a full rewire done on our 1960s home. The team was organized, respectful of the space, and the work passed inspection first time. Highly recommend.",
  },
];

export const CONTACT_METHODS = [
  { icon: Mail, value: BUSINESS_INFO.email, sub: BUSINESS_INFO.responseTime },
  { icon: MapPin, value: BUSINESS_INFO.serviceArea, sub: BUSINESS_INFO.serviceAreaSubtext },
];

export const CONTACT_CONTENT = {
  eyebrow: "Get in Touch",
  titleLineOne: "Request a Quote",
  titleAccent: "for Your Project.",
  body: "Tell us about your project scope, timeline, and location. We respond quickly with clear next steps.",
  formTitle: "Request a Quote",
  successTitle: "Message Received.",
  successBody: "We'll be in touch within 2 business hours.",
  resendLabel: "Send another",
  submitLabel: "Send My Quote Request ->",
  sendingLabel: "Sending...",
};

export const SERVICE_OPTIONS = [
  "Commercial New Construction",
  "Panel / Service Upgrade",
  "Tenant Build-Out",
  "Lighting System",
  "Generator / Emergency Power",
  "Preventive Maintenance",
  "Full Home Rewire",
  "EV Charger Installation",
  "Other",
];
