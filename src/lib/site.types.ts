// Shared shape for both language datasets (site.en.ts / site.it.ts). Free
// text is plain `string` on purpose — translations must be able to hold any
// string, not just the literal English (or Italian) value.

export interface Profile {
  name: string;
  role: string;
  shortRole: string;
  /** One line after the role: what I build, in recruiter terms. */
  headline: string;
  location: string;
  github: string;
  website: string;
  email: string;
  /** X / Twitter handle without the leading @. Omit to hide the link. */
  x?: string;
  avatar: string;
  company: { name: string; href: string };

  bio: string;
  /** What kind of work I am open to — the one line a recruiter looks for. */
  availability: string;
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

/** A measured result. Rendered only when present — never fill with estimates. */
export interface Impact {
  value: string;
  label: string;
}

export interface Role {
  title: string;
  dates: string;
  current: boolean;
  bullets: string[];
  tags: string[];
  impact?: Impact[];
}

export interface Education {
  school: string;
  degree: string;
  native: string;
  dates: string;
  thesis: string;
  /** Path to the thesis PDF in /public. Omit until the file is there. */
  thesisHref?: string;
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
  /** Live deployment, if the project has one. */
  demo?: string;
  /** Real star count, wired from GITHUB_STATS at the data layer. */
  stars?: number;
  lang: string;
  meta: string;
  featured: boolean;
  year: string;
  stack: string[];
  highlights: string[];
  learned: string;
  body: string;
  /** Case-study context: who had the problem and why it mattered. */
  problem?: string;
  impact?: Impact[];
}

/** One line of "How I work": a principle and how it shows up in practice. */
export interface Principle {
  title: string;
  body: string;
}

export interface StackGroup {
  name: string;
  level: string;
  /** The tools I would defend in an interview — kept short on purpose. */
  items: string;
  /** Comma-separated "also worked with", rendered quieter than `items`. */
  also?: string;
}

export interface Stack {
  groups: StackGroup[];
}

export interface FutureProject {
  id: string;
  name: string;
  blurb: string;
  /** Empty while the repository does not exist yet — the card renders unlinked. */
  href: string;
  lang: string;
  meta: string;
  year: string;
  stack: string[];
  highlights: string[];
  learned: string;
  body: string;
  problem?: string;
  impact?: Impact[];
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

export interface PulsePhase {
  era: string;
  title: string;
  body: string;
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
  phases: PulsePhase[];
}

export type MarkName = "openai" | "zed" | "delta" | "gitbutler";

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
    contact: string;
    work: string;
    approach: string;
    writing: string;
  };
  backToBlog: string;
  postNotFound: string;
  close: string;
  toggleTheme: string;
  openMenu: string;
  closeMenu: string;
  contactLede: string;
  emailLabel: string;
  copyEmail: string;
  copiedEmail: string;
  readThesis: string;
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
  PRINCIPLES: Principle[];
  UI: UiStrings;
}
