export interface GithubProjectStats {
  description: string | null;
  readmeExcerpt: string | null;
  latestCommit: { sha: string; message: string; date: string } | null;
  diffFiles: Array<{ filename: string; status: string; additions: number; deletions: number; patch: string | null }>;
  stars: number;
  forks: number;
  updatedAt: string;
  languages: Array<{ name: string; bytes: number; percent: number }>;
  usefulLines: number;
  filesCounted: number;
}

interface GithubRepository {
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  pushed_at: string;
  default_branch: string;
}

interface GithubTreeEntry {
  path: string;
  type: string;
  size?: number;
  url: string;
}

interface GithubTree {
  tree: GithubTreeEntry[];
  truncated?: boolean;
}

interface GithubCommitSummary {
  sha: string;
  commit: { message: string; author?: { date?: string } };
}

interface GithubCommitDetail {
  files?: Array<{ filename: string; status: string; additions: number; deletions: number; patch?: string }>;
}

/** Strictly human-authored programming & stylesheet extensions (excludes .ron/.json/.yaml data tables & game assets). */
const SOURCE_EXTENSIONS = new Set([
  "astro",
  "c",
  "cc",
  "cpp",
  "cs",
  "css",
  "dart",
  "gd",
  "glsl",
  "go",
  "graphql",
  "h",
  "hpp",
  "html",
  "java",
  "js",
  "jsx",
  "kt",
  "kts",
  "lua",
  "m",
  "mjs",
  "cjs",
  "php",
  "prisma",
  "proto",
  "py",
  "rb",
  "rs",
  "scala",
  "scss",
  "sh",
  "sql",
  "svelte",
  "swift",
  "toml",
  "ts",
  "tsx",
  "vue",
  "wgsl",
  "wit",
  "zig",
]);

const EXCLUDED_SEGMENTS = new Set([
  ".git",
  ".github",
  "node_modules",
  "dist",
  "build",
  "out",
  "target",
  "pkg",
  "wasm",
  "vendor",
  "third_party",
  "external",
  "deps",
  "coverage",
  "generated",
  "gen",
  "fixtures",
  "testdata",
  "snapshots",
  "__snapshots__",
  ".angular",
  ".nx",
  ".next",
  ".svelte-kit",
  "assets",
  "public",
  "static",
  "resources",
  "data",
  "datasets",
  "seeds",
  "dumps",
  "docs",
]);

const EXCLUDED_NAMES = new Set([
  "package-lock.json",
  "pnpm-lock.yaml",
  "yarn.lock",
  "cargo.lock",
  "go.sum",
  "bun.lockb",
  "composer.lock",
  "poetry.lock",
  "uv.lock",
]);

const EXACT_READ_LIMIT = 140;
const MAX_SOURCE_FILE_BYTES = 180_000;

/** Session-level cache so re-opening a project page is instantaneous and avoids GitHub rate limits. */
const STATS_CACHE = new Map<string, GithubProjectStats>();

function repoFromUrl(href: string) {
  const match = href.match(/^https?:\/\/github\.com\/([^/]+)\/([^/#?]+)/);
  return match ? { owner: match[1], name: match[2].replace(/\.git$/, "") } : null;
}

function isUsefulSource(path: string, size = 0) {
  const lower = path.toLowerCase();
  const segments = lower.split("/");
  const file = segments[segments.length - 1] ?? "";
  if (size <= 0 || size > MAX_SOURCE_FILE_BYTES || EXCLUDED_NAMES.has(file)) return false;

  // Exclude any path inside build, compilation, asset, or vendor directories
  for (let i = 0; i < segments.length - 1; i++) {
    const seg = segments[i];
    if (EXCLUDED_SEGMENTS.has(seg) || seg.startsWith(".")) return false;
  }

  if (
    file.startsWith(".") ||
    file.includes(".min.") ||
    file.includes(".bundle.") ||
    file.includes(".generated.") ||
    file.endsWith(".pb.rs") ||
    file.endsWith(".pb.go") ||
    file.endsWith(".d.ts") ||
    file.endsWith(".map") ||
    file.endsWith(".lock")
  ) {
    return false;
  }

  const extension = file.includes(".") ? file.slice(file.lastIndexOf(".") + 1) : "";
  return SOURCE_EXTENSIONS.has(extension);
}

function countUsefulLines(source: string) {
  const lines = source.split(/\r?\n/);
  // Skip auto-generated files
  const head = lines.slice(0, 5).join(" ").toLowerCase();
  if (head.includes("auto-generated") || head.includes("do not edit") || head.includes("@generated")) {
    return 0;
  }
  return lines.filter((line) => {
    const trimmed = line.trim();
    return trimmed.length > 0 && !/^(\/\/|#|<!--|\/\*|\*|\*\/)/.test(trimmed);
  }).length;
}

async function readmeExcerpt(owner: string, name: string, branch: string) {
  try {
    const response = await fetch(`https://raw.githubusercontent.com/${owner}/${name}/${branch}/README.md`);
    if (!response.ok) return null;
    const text = await response.text();
    const useful = text
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#") && !line.startsWith("!") && !line.startsWith("[!["))
      .join(" ")
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1")
      .replace(/[`*_]/g, "");
    return useful.slice(0, 520) || null;
  } catch {
    return null;
  }
}

async function latestDiff(owner: string, name: string, branch: string) {
  try {
    const commits = await githubJson<GithubCommitSummary[]>(`https://api.github.com/repos/${owner}/${name}/commits?sha=${branch}&per_page=1`);
    const commit = commits[0];
    if (!commit) return { latestCommit: null, diffFiles: [] };
    const detail = await githubJson<GithubCommitDetail>(`https://api.github.com/repos/${owner}/${name}/commits/${commit.sha}`);
    return {
      latestCommit: { sha: commit.sha.slice(0, 7), message: commit.commit.message.split("\n")[0], date: commit.commit.author?.date ?? "" },
      diffFiles: (detail.files ?? []).slice(0, 6).map((file) => ({
        filename: file.filename,
        status: file.status,
        additions: file.additions,
        deletions: file.deletions,
        patch: file.patch ?? null,
      })),
    };
  } catch {
    return { latestCommit: null, diffFiles: [] };
  }
}

async function githubJson<T>(url: string): Promise<T> {
  const response = await fetch(url, { headers: { Accept: "application/vnd.github+json" } });
  if (!response.ok) throw new Error(`GitHub request failed: ${response.status}`);
  return response.json() as Promise<T>;
}

export async function loadGithubProjectStats(href: string): Promise<GithubProjectStats | null> {
  const repo = repoFromUrl(href);
  if (!repo) return null;
  const cacheKey = `${repo.owner}/${repo.name}`;
  const cached = STATS_CACHE.get(cacheKey);
  if (cached) return cached;

  const base = `https://api.github.com/repos/${repo.owner}/${repo.name}`;
  const metadata = await githubJson<GithubRepository>(base);
  const [languageBytes, tree, readme, diff] = await Promise.all([
    githubJson<Record<string, number>>(`${base}/languages`),
    githubJson<GithubTree>(`${base}/git/trees/${metadata.default_branch}?recursive=1`),
    readmeExcerpt(repo.owner, repo.name, metadata.default_branch),
    latestDiff(repo.owner, repo.name, metadata.default_branch),
  ]);

  const languagesTotal = Object.values(languageBytes).reduce((total, bytes) => total + bytes, 0) || 1;
  const languages = Object.entries(languageBytes)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, bytes]) => ({ name, bytes, percent: Math.round((bytes / languagesTotal) * 100) }));

  // Filter strictly real source files (excluding build/target/dist/vendor/assets/generated/large dumps)
  const allSourceFiles = tree.tree.filter((entry) => entry.type === "blob" && isUsefulSource(entry.path, entry.size));
  const totalFilesCount = allSourceFiles.length;

  // Read up to 140 files directly from raw.githubusercontent.com (CDN, no API rate limit).
  // Sort by median sizes first so we don't bias density toward huge data tables.
  const sortedFiles = [...allSourceFiles].sort((a, b) => (b.size ?? 0) - (a.size ?? 0));
  const filesToRead = sortedFiles.slice(0, EXACT_READ_LIMIT);
  const remainingFiles = sortedFiles.slice(EXACT_READ_LIMIT);

  let exactLines = 0;
  let readBytes = 0;

  await Promise.all(
    filesToRead.map(async (file) => {
      try {
        const response = await fetch(`https://raw.githubusercontent.com/${repo.owner}/${repo.name}/${metadata.default_branch}/${file.path}`);
        if (!response.ok) return;
        const text = await response.text();
        const lines = countUsefulLines(text);
        if (lines > 0) {
          exactLines += lines;
          readBytes += file.size ?? text.length;
        }
      } catch {
        // Ignore single file fetch failure
      }
    }),
  );

  // If the repo has more than 140 source files, estimate the remaining small files using the measured density
  // clamped to a realistic range (1 line per 28–55 bytes of source code)
  const rawDensity = readBytes > 0 ? exactLines / readBytes : 1 / 40;
  const safeDensity = Math.min(Math.max(rawDensity, 1 / 55), 1 / 28);
  const remainingBytes = remainingFiles.reduce((acc, f) => acc + (f.size ?? 0), 0);
  const usefulLines = exactLines + Math.round(remainingBytes * safeDensity);

  const result: GithubProjectStats = {
    description: metadata.description,
    readmeExcerpt: readme,
    latestCommit: diff.latestCommit,
    diffFiles: diff.diffFiles,
    stars: metadata.stargazers_count,
    forks: metadata.forks_count,
    updatedAt: metadata.pushed_at,
    languages,
    usefulLines,
    filesCounted: totalFilesCount,
  };

  STATS_CACHE.set(cacheKey, result);
  return result;
}
