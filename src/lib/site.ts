import { signal } from "@angular/core";
import { EN } from "./site.en";
import { IT } from "./site.it";
import type {
  Company,
  Contribution,
  Education,
  FutureProject,
  BlogPost,
  Profile,
  Project,
  Principle,
  Pulse,
  Role,
  Stack,
  TocItem,
  Tool,
  UiStrings,
} from "./site.types";

export type { Contribution, FutureProject, BlogPost, Project } from "./site.types";
export type Lang = "en" | "it";

const STORAGE_KEY = "site-lang";

function initialLang(): Lang {
  try {
    return localStorage.getItem(STORAGE_KEY) === "it" ? "it" : "en";
  } catch {
    return "en";
  }
}

/** Current UI language. Components can read this signal directly (e.g. to
 * highlight the active toggle) — reading it anywhere in a template is also
 * what guarantees a change-detection pass runs after setLanguage() mutates
 * the data below, since every component here uses the Default (non-OnPush)
 * strategy and gets re-checked on any scheduled tick. */
export const lang = signal<Lang>(initialLang());

// Mutable, language-aware data. Every component captures a stable reference
// to these objects/arrays (e.g. `protected readonly profile = PROFILE`).
// setLanguage() mutates their contents in place rather than swapping which
// object is exported, so every existing reference — and every template —
// picks up the new copy automatically.
export const PROFILE: Profile = { ...EN.PROFILE };
export const TOC: TocItem[] = [...EN.TOC];
export const COMPANY: Company = { ...EN.COMPANY };
export const ROLES: Role[] = [...EN.ROLES];
export const EDUCATION: Education = { ...EN.EDUCATION };
export const CONTRIBUTIONS: Contribution[] = [...EN.CONTRIBUTIONS];
export const PROJECTS: Project[] = [...EN.PROJECTS];
export const STACK: Stack = { groups: [...EN.STACK.groups] };
export const FUTURE_PROJECTS: FutureProject[] = [...EN.FUTURE_PROJECTS];
export const BLOG: BlogPost[] = [...EN.BLOG];
export const PULSE: Pulse = { ...EN.PULSE };
export const TOOLS: Tool[] = [...EN.TOOLS];
export const PRINCIPLES: Principle[] = [...EN.PRINCIPLES];
export const UI: UiStrings = { ...EN.UI, sectionTitles: { ...EN.UI.sectionTitles } };

export function setLanguage(next: Lang) {
  const data = next === "it" ? IT : EN;
  Object.assign(PROFILE, data.PROFILE);
  TOC.length = 0;
  TOC.push(...data.TOC);
  Object.assign(COMPANY, data.COMPANY);
  ROLES.length = 0;
  ROLES.push(...data.ROLES);
  Object.assign(EDUCATION, data.EDUCATION);
  CONTRIBUTIONS.length = 0;
  CONTRIBUTIONS.push(...data.CONTRIBUTIONS);
  PROJECTS.length = 0;
  PROJECTS.push(...data.PROJECTS);
  STACK.groups = [...data.STACK.groups];
  FUTURE_PROJECTS.length = 0;
  FUTURE_PROJECTS.push(...data.FUTURE_PROJECTS);
  BLOG.length = 0;
  BLOG.push(...data.BLOG);
  Object.assign(PULSE, data.PULSE);
  TOOLS.length = 0;
  TOOLS.push(...data.TOOLS);
  PRINCIPLES.length = 0;
  PRINCIPLES.push(...data.PRINCIPLES);
  Object.assign(UI, data.UI, { sectionTitles: { ...data.UI.sectionTitles } });

  lang.set(next);
  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // localStorage unavailable (private mode, SSR, etc.) — language just won't persist.
  }
}

if (lang() === "it") setLanguage("it");
