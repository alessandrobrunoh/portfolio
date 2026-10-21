---
name: land
description: >-
  Use only when the user explicitly requests that changes in the portfolio repository be landed. Do not invoke for review, preparation, passing checks, or installing this skill.
disable-model-invocation: true
metadata:
  delta-action: land
---

# Land changes in the portfolio repository

Use this workflow only for an explicit request to land changes in this repository. That request authorizes completing the merge; do not ask again whether to merge. Stop only for a genuine blocker, unresolved scope, or a requirement that cannot be satisfied. Never bypass a failing check or repository rule.

## Preflight

1. Confirm the repository root and that a configured source remote points to `github.com/alessandrobrunoh/portfolio`. Do not use a `local` remote that points back to the user's checkout. Confirm the default branch is still `main`; use the actual source remote name in commands rather than assuming it is `origin`.
2. Confirm GitHub CLI authentication is available without printing credentials. If GitHub access is unavailable, stop and ask the user to configure it; never request or write a token into the repository.
3. Read the current project instructions, contribution guidance, pull-request templates, and relevant repository settings. The checked-in project currently has no contribution guide, PR template, contributor-agreement, changelog, or signing-off requirement. The `main` branch currently has no branch protection or repository rulesets and no required reviews or signed commits. Re-check at execution time; follow any requirements that have since been added, and do not bypass them.
4. Review `git status --short --branch`, the staged and unstaged diffs, and recent commits. Identify the exact changes covered by the request. Preserve unrelated work; do not stage it. If requested and unrelated edits are mixed in a way that cannot be safely separated non-interactively, stop and ask the user.
5. When changing `src/lib/site.en.ts`, keep `GITHUB.md` aligned as its source comment requires (`GITHUB.md#L1-L3`). Keep any corresponding Italian content in `src/lib/site.it.ts` consistent.

## Prepare the change

1. Fetch the latest `main` from the verified source remote. Do not update or commit directly on `main`.
2. If the requested changes are uncommitted on `main`, create a new descriptive topic branch from the current base, preserving the worktree. If the current branch is already a topic branch, use it only when its changes match the request. If local `main` contains commits absent from the remote that are not part of the requested change, do not carry them into the PR; isolate the request safely or stop and ask. Never reuse or overwrite an unrelated branch; choose a unique branch name or stop if the branch state is ambiguous.
3. If the local base is behind the remote, commit only the requested changes on the topic branch, then rebase onto the fetched `main`. Resolve conflicts automatically only when the intended result is clear and preserves unrelated work. If intent is ambiguous, stop and ask. Do not use an interactive rebase.
4. Stage only the requested changes, inspect the staged diff, and run `git diff --cached --check`. Use a concise commit subject consistent with the repository's conventional `type(scope): summary` style. Do not amend or rewrite existing commits.
5. Run the project's CI commands locally using Node.js 22, matching the workflow: `npm ci`, `npm run typecheck`, and `npm run build` (`.github/workflows/ci.yml#L14-L25`; scripts are defined in `package.json#L5-L11`). If Node.js 22 is unavailable, do not install or change system tooling; report the local limitation and rely on the required remote CI checks. Stop on any local check failure.

## Open and verify the pull request

1. Push the topic branch to the verified source remote. Open a non-draft pull request to `main` with `gh pr create --base main --head <branch> --title <title> --body <body>`. Prefer a concise `type(scope): summary` title, matching recent PR history. Summarize the changes and checks accurately; do not invent issue references or claim tests that did not run.
2. Before merging, re-check the current `main` protection and repository rulesets. Honor any configured review, conversation-resolution, or status-check requirements. Do not use administrator bypass or force-push.
3. Wait for all checks on the pull request's current head commit. The repository's `CI` workflow runs for pull requests and performs typecheck and build (`.github/workflows/ci.yml#L3-L7`, `.github/workflows/ci.yml#L19-L25`). Even though the checked-in branch currently has no formally required checks, require the PR's `build` check and all repository-required checks to pass. Use `gh pr checks <number> --watch`, then confirm the check results correspond to the current PR head SHA. Pending, failed, cancelled, skipped, missing, or unverifiable expected checks are not success; stop rather than merge.
4. Confirm any required review is approved and unresolved review conversations are handled. No review is required by the current repository settings, but follow any requirements found during this run.

## Merge and verify publication

1. Merge with a GitHub merge commit, matching the repository's recent PR history and enabled merge methods: `gh pr merge <number> --merge --match-head-commit <verified-head-sha>`. If merge commits are no longer enabled, stop and ask rather than silently switching strategies. Do not delete the remote branch automatically; the repository currently leaves branches after merge.
2. Verify the PR is merged into `main`, fetch the source remote's `main`, and confirm the merge commit is contained in it. If the merge did not complete or the destination cannot be verified, report that the changes have not been confirmed as landed.
3. After merge, verify the `CI` run for the resulting `main` commit succeeds. GitHub Pages is currently configured to publish from `main` at the repository root; verify the Pages deployment for the merged revision completes successfully. If either post-merge run fails, report that the changes landed but publication or post-merge verification failed; do not attempt an automatic rollback.
4. Leave the remote topic branch intact. Return the local worktree to `main` and fast-forward it only if the worktree is clean and doing so will not disturb unrelated work; otherwise preserve the current branch and worktree state.
