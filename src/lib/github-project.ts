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
}

interface GithubCommitSummary {
  sha: string;
  commit: { message: string; author?: { date?: string } };
}

interface GithubCommitDetail {
  files?: Array<{ filename: string; status: string; additions: number; deletions: number; patch?: string }>;
}

const SOURCE_EXTENSIONS = new Set([
  "c", "cc", "cpp", "css", "go", "h", "hpp", "html", "java", "js", "jsx", "kt", "m", "mdx", "php", "py", "rb", "rs", "scss", "sh", "sql", "swift", "ts", "tsx", "vue",
]);
const EXCLUDED_PARTS = [".git/", "node_modules/", "dist/", "build/", "target/", "vendor/", "coverage/", "generated/", "fixtures/", "__snapshots__/"];
const EXCLUDED_NAMES = new Set(["package-lock.json", "pnpm-lock.yaml", "yarn.lock", "Cargo.lock", "go.sum"]);
const MAX_FILES = 40;
const MAX_FILE_BYTES = 700_000;

function repoFromUrl(href: string) {
  const match = href.match(/^https?:\/\/github\.com\/([^/]+)\/([^/#?]+)/);
  return match ? { owner: match[1], name: match[2].replace(/\.git$/, "") } : null;
}

function isUsefulSource(path: string, size = 0) {
  const lower = path.toLowerCase();
  if (size > MAX_FILE_BYTES || EXCLUDED_NAMES.has(path.split("/").pop() ?? "")) return false;
  if (EXCLUDED_PARTS.some((part) => lower.includes(part))) return false;
  const file = path.split("/").pop() ?? "";
  if (file.startsWith(".") || file.includes(".min.")) return false;
  const extension = file.includes(".") ? file.slice(file.lastIndexOf(".") + 1).toLowerCase() : "";
  return SOURCE_EXTENSIONS.has(extension) && !lower.includes("/test") && !lower.includes("spec.");
}

function countUsefulLines(source: string) {
  return source.split(/\r?\n/).filter((line) => {
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
  const files = tree.tree.filter((entry) => entry.type === "blob" && isUsefulSource(entry.path, entry.size)).slice(0, MAX_FILES);
  const counts = await Promise.all(
    files.map(async (file) => {
      try {
        const response = await fetch(`https://raw.githubusercontent.com/${repo.owner}/${repo.name}/${metadata.default_branch}/${file.path}`);
        return response.ok ? countUsefulLines(await response.text()) : 0;
      } catch {
        return 0;
      }
    }),
  );

  return {
    description: metadata.description,
    readmeExcerpt: readme,
    latestCommit: diff.latestCommit,
    diffFiles: diff.diffFiles,
    stars: metadata.stargazers_count,
    forks: metadata.forks_count,
    updatedAt: metadata.pushed_at,
    languages,
    usefulLines: counts.reduce((total, count) => total + count, 0),
    filesCounted: files.length,
  };
}
