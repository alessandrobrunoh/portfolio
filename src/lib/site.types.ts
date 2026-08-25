// Shared shape for both language datasets (site.en.ts / site.it.ts). Free
// text is plain `string` on purpose — translations must be able to hold any
// string, not just the literal English (or Italian) value.

export interface Profile {
  name: string;
  role: string;
  shortRole: string;
  location: string;
  github: string;
  website: string;
  avatar: string;
  company: { name: string; href: string };

  bio: string;
}

export interface TocItem {
  n: string;
  href: string;
  label: string;
}

export interface Company {
  name: string;
  href: string;
  location: string;
  summary: string;
}

export interface Role {
  title: string;
  dates: string;
  current: boolean;
  bullets: string[];
  tags: string[];
}

export interface Education {
  school: string;
  degree: string;
  native: string;
  dates: string;
  thesis: string;
}

export type ContributionStatus = "Open" | "Merged" | "Published";

export interface Contribution {
  status: ContributionStatus;
  title: string;
  repo: string;
  href: string;
  note: string;
}

export interface Project {
  id: string;
  name: string;
  blurb: string;
  href: string;
  lang: string;
  meta: string;
  featured: boolean;
  year: string;
  stack: string[];
  highlights: string[];
  learned: string;
  body: string;
}

export interface StackGroup {
  name: string;
  level: string;
  items: string;
}

export interface Stack {
  groups: StackGroup[];
}

export interface FutureProject {
  id: string;
  name: string;
  blurb: string;
  href: string;
  lang: string;
  meta: string;
  year: string;
  stack: string[];
  highlights: string[];
  learned: string;
  body: string;
}

export type BlogStatus = "Planned" | "Draft" | "Published";

export interface BlogPost {
  slug: string;
  title: string;
  subtitle: string;
  pitch: string;
  status: BlogStatus;
  body: string[];
}

export interface PulseKpi {
  label: string;
  value?: number;
  display?: string;
  hint: string;
}

export interface PulseSeriesRow {
  q: string;
  rust: number;
  typescript: number;
  java: number;
  commits: number;
  forecast: boolean;
}

export interface PulsePhase {
  era: string;
  title: string;
  body: string;
}

export interface PulseMilestone {
  q: string;
  label: string;
}

export interface PulseHiringPoint {
  label: string;
  detail: string;
}

export interface Pulse {
  lede: string;
  takeaway: string;
  note: string;
  forHiringManagers: { title: string; points: PulseHiringPoint[] };
  kpis: PulseKpi[];
  series: PulseSeriesRow[];
  now: string;
  phases: PulsePhase[];
  milestones: PulseMilestone[];
}

export type MarkName = "grok" | "zed" | "delta" | "gitbutler";

export interface Tool {
  name: string;
  product: string;
  href: string;
  mark: MarkName;
}

/** Static UI chrome — section titles, sidebar labels, button/aria copy —
 * that isn't part of the content data above but still needs a translation. */
export interface UiStrings {
  skipToContent: string;
  tocIndex: string;
  tocNow: string;
  tocBased: string;
  tocLanguage: string;
  tocCurrentWork: string;
  tocLanguages: string;
  tocContact: string;
  sectionTitles: {
    intro: string;
    experience: string;
    projects: string;
    pulse: string;
    openSource: string;
    blog: string;
    stack: string;
    futureProjects: string;
  };
  openLabel: string;
  viewOnGithub: string;
  whatIllLearn: string;
  readDraft: string;
  backToBlog: string;
  postNotFound: string;
  close: string;
  toggleTheme: string;
  openMenu: string;
  closeMenu: string;
  dailyTools: string;
  dailyToolsSub: string;
}

export interface SiteData {
  PROFILE: Profile;
  TOC: TocItem[];
  COMPANY: Company;
  ROLES: Role[];
  EDUCATION: Education;
  CONTRIBUTIONS: Contribution[];
  PROJECTS: Project[];
  STACK: Stack;
  FUTURE_PROJECTS: FutureProject[];
  BLOG: BlogPost[];
  PULSE: Pulse;
  TOOLS: Tool[];
  UI: UiStrings;
}
