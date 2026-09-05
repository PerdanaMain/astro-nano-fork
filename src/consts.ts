import settings from "@content/settings/site.json";
import type { HomeMetadata, Metadata, Site, Socials } from "@types";

export const SITE: Site = settings.SITE;
export const HOME: HomeMetadata = settings.HOME;
export const BLOG: Metadata = settings.BLOG;
export const WORK: Metadata = settings.WORK;
export const PROJECTS: Metadata = settings.PROJECTS;
export const SOCIALS: Socials = settings.SOCIALS;
