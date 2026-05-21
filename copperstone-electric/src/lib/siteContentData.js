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

export const SITE_CONTENT_PAGE_ID = "homepage";

export function createDefaultSiteContent() {
  return {
    navLinks: [...NAV_LINKS],
    socialLinks: { ...SOCIAL_LINKS },
    businessInfo: { ...BUSINESS_INFO },
    hero: { ...HERO_CONTENT },
    benefits: [...BENEFITS],
    services: [...SERVICES],
    projectsNote: PROJECTS_NOTE,
    about: { ...ABOUT_CONTENT, bullets: [...ABOUT_CONTENT.bullets] },
    testimonials: [...TESTIMONIALS],
    contactMethods: [...CONTACT_METHODS],
    contact: { ...CONTACT_CONTENT },
    serviceOptions: [...SERVICE_OPTIONS],
  };
}

export function normalizeSiteContent(defaultContent, storedContent) {
  if (!storedContent || typeof storedContent !== "object") return defaultContent;

  const normalizeIconList = (defaultList, storedList) => {
    if (!Array.isArray(storedList)) return defaultList;

    return storedList.map((item, index) => ({
      ...defaultList[index],
      ...item,
      icon: defaultList[index]?.icon,
    }));
  };

  return {
    ...defaultContent,
    ...storedContent,
    socialLinks: {
      ...defaultContent.socialLinks,
      ...(storedContent.socialLinks ?? {}),
    },
    businessInfo: {
      ...defaultContent.businessInfo,
      ...(storedContent.businessInfo ?? {}),
    },
    hero: {
      ...defaultContent.hero,
      ...(storedContent.hero ?? {}),
    },
    benefits: Array.isArray(storedContent.benefits) ? storedContent.benefits : defaultContent.benefits,
    services: normalizeIconList(defaultContent.services, storedContent.services),
    about: {
      ...defaultContent.about,
      ...(storedContent.about ?? {}),
      bullets: Array.isArray(storedContent.about?.bullets) ? storedContent.about.bullets : defaultContent.about.bullets,
    },
    testimonials: Array.isArray(storedContent.testimonials) ? storedContent.testimonials : defaultContent.testimonials,
    contactMethods: normalizeIconList(defaultContent.contactMethods, storedContent.contactMethods),
    contact: {
      ...defaultContent.contact,
      ...(storedContent.contact ?? {}),
    },
    navLinks: Array.isArray(storedContent.navLinks) ? storedContent.navLinks : defaultContent.navLinks,
    serviceOptions: Array.isArray(storedContent.serviceOptions) ? storedContent.serviceOptions : defaultContent.serviceOptions,
    projectsNote: storedContent.projectsNote ?? defaultContent.projectsNote,
  };
}