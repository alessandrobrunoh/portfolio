#!/usr/bin/env node
/**
 * Pulls real public GitHub activity and writes src/lib/github-stats.ts.
 *
 * Everything the Pulse section shows comes from this file, so the charts are a
 * snapshot of real data rather than something hand-tuned. Run it whenever you
 * want the numbers refreshed:
 *
 *   npm run sync:github
 *
 * Auth: GITHUB_TOKEN if set, otherwise the token from the `gh` CLI. Only public
 * aggregates are written out — private repositories contribute to the counts
 * (that is how GitHub reports them) but no private name ever reaches the file.
 */
import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const LOGIN = process.env.GITHUB_LOGIN ?? "alessandrobrunoh";
const FIRST_YEAR = 2024;
const OUT = resolve(dirname(fileURLToPath(import.meta.url)), "../src/lib/github-stats.ts");

/** Languages the Pulse line chart plots. Everything else folds into "other". */
const TRACKED = ["Rust", "TypeScript", "Java"];

function token() {
  if (process.env.GITHUB_TOKEN) return process.env.GITHUB_TOKEN;
  try {
    return execFileSync("gh", ["auth", "token"], { encoding: "utf8" }).trim();
  } catch {
    console.error("No credentials: set GITHUB_TOKEN or run `gh auth login`.");
    process.exit(1);
  }
}

const AUTH = token();

async function graphql(query, variables) {
  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: { Authorization: `bearer ${AUTH}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });
  if (!response.ok) throw new Error(`GraphQL ${response.status}: ${await response.text()}`);
  const payload = await response.json();
  if (payload.errors) throw new Error(JSON.stringify(payload.errors));
  return payload.data;
}

async function rest(path) {
  const response = await fetch(`https://api.github.com${path}`, {
    headers: { Authorization: `bearer ${AUTH}`, Accept: "application/vnd.github+json" },
  });
  if (!response.ok) throw new Error(`REST ${path} → ${response.status}`);
  return response.json();
}

/** Inclusive list of calendar quarters from FIRST_YEAR Q1 up to the one `now` falls in. */
function quartersUpTo(now) {
  const list = [];
  for (let year = FIRST_YEAR; year <= now.getUTCFullYear(); year++) {
    for (let q = 1; q <= 4; q++) {
      const startMonth = (q - 1) * 3;
      const start = new Date(Date.UTC(year, startMonth, 1));
      if (start > now) break;
      const end = new Date(Date.UTC(year, startMonth + 3, 1) - 1);
      list.push({
        label: `Q${q} ’${String(year).slice(2)}`,
        from: start.toISOString(),
        to: (end > now ? now : end).toISOString(),
      });
    }
  }
  return list;
}

const CONTRIBUTIONS_QUERY = `
  query($login: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $login) {
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar { totalContributions }
        commitContributionsByRepository(maxRepositories: 100) {
          repository { primaryLanguage { name } }
          contributions { totalCount }
        }
      }
    }
  }
`;

/**
 * One quarter of real activity. `contributions` is GitHub's own calendar total;
 * the language split is commits weighted by each repository's primary language,
 * expressed as a percentage of that quarter's attributed commits.
 */
async function quarter({ label, from, to }) {
  const data = await graphql(CONTRIBUTIONS_QUERY, { login: LOGIN, from, to });
  const collection = data.user.contributionsCollection;

  const byLanguage = new Map();
  let attributed = 0;
  for (const entry of collection.commitContributionsByRepository) {
    const name = entry.repository.primaryLanguage?.name;
    const count = entry.contributions.totalCount;
    if (!name) continue;
    byLanguage.set(name, (byLanguage.get(name) ?? 0) + count);
    attributed += count;
  }

  const share = (name) => (attributed === 0 ? 0 : Math.round(((byLanguage.get(name) ?? 0) / attributed) * 100));
  const row = { q: label, contributions: collection.contributionCalendar.totalContributions };
  for (const name of TRACKED) row[name.toLowerCase()] = share(name);
  // Everything outside TRACKED — Vue, Python, C, SCSS and friends. Keeping it as
  // its own series is what makes the early quarters readable instead of three
  // flat lines at zero.
  row.other = attributed === 0 ? 0 : Math.max(0, 100 - TRACKED.reduce((sum, name) => sum + row[name.toLowerCase()], 0));
  return row;
}

async function repositories() {
  const all = [];
  for (let page = 1; page <= 5; page++) {
    const batch = await rest(`/users/${LOGIN}/repos?per_page=100&page=${page}&type=owner`);
    all.push(...batch);
    if (batch.length < 100) break;
  }
  return all.filter((repo) => !repo.fork && !repo.archived);
}

async function main() {
  const now = new Date();
  const quarters = quartersUpTo(now);

  const series = [];
  for (const spec of quarters) {
    series.push(await quarter(spec));
    process.stderr.write(`  ${spec.label} ✓\n`);
  }

  const yearAgo = new Date(now);
  yearAgo.setUTCFullYear(yearAgo.getUTCFullYear() - 1);
  const lastYear = await graphql(CONTRIBUTIONS_QUERY, { login: LOGIN, from: yearAgo.toISOString(), to: now.toISOString() });

  const repos = await repositories();
  const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
  const stars = Object.fromEntries(repos.filter((repo) => repo.stargazers_count > 0).map((repo) => [repo.name, repo.stargazers_count]));

  const generatedAt = now.toISOString().slice(0, 10);
  const file = `// GENERATED by scripts/sync-github.mjs — do not edit by hand.
// Every number here is pulled from the GitHub API. Refresh with \`npm run sync:github\`.

export interface GithubQuarter {
  /** Calendar quarter, e.g. \`Q1 ’26\`. */
  q: string;
  /** GitHub's own contribution-calendar total for the quarter. */
  contributions: number;
  /** Share of the quarter's attributed commits, by repository primary language. */
  rust: number;
  typescript: number;
  java: number;
  /** Everything outside the three tracked languages. */
  other: number;
}

export const GITHUB_STATS = {
  login: ${JSON.stringify(LOGIN)},
  generatedAt: ${JSON.stringify(generatedAt)},
  /** Public + private contributions over the trailing 12 months, as GitHub counts them. */
  lastYearContributions: ${lastYear.user.contributionsCollection.contributionCalendar.totalContributions},
  publicRepos: ${repos.length},
  totalStars: ${totalStars},
  /** Stars per public repository, for the ones that have any. */
  stars: ${JSON.stringify(stars, null, 2).replace(/\n/g, "\n  ")} as Record<string, number>,
  series: ${JSON.stringify(series, null, 2).replace(/\n/g, "\n  ")} satisfies GithubQuarter[],
  now: ${JSON.stringify(series[series.length - 1].q)},
} as const;
`;

  writeFileSync(OUT, file);
  console.log(`Wrote ${OUT}`);
  console.log(`  ${series.length} quarters · ${repos.length} public repos · ${totalStars} stars`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
