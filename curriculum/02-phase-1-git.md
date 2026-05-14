# Phase 1 — Git & GitHub

**Essence:** Git is not just "save my work" — it's a structured history of
every change, an undo machine of nearly unlimited depth, and the substrate
of collaboration with humans and agents. GitHub adds the social layer:
PRs, reviews, CI, releases. After Phase 1 you read commit history fluently,
resolve conflicts without panic, run code review at senior level, and
configure branch protection that turns "AI agent merged something broken"
into "AI agent's PR was blocked by failing CI."

**Gate:** read a PR diff and explain what changed, why, whether the commit
history is clean, whether tests cover the change, and whether the merge
strategy fits. Set up branch protection on a fresh repo from memory.
Resolve a 3-way merge conflict by hand without consulting docs. Use
`git reflog` and `git bisect` to recover from a self-inflicted mistake.

**Prerequisites:** Phase 0 (specifically the terminal module).

**Primary references**
- *Pro Git* (Chacon & Straub) — free online at git-scm.com/book. The
  definitive Git book; ch. 1-3 + 7 (internals) is the spine.
- *Git Internals* (PDF, also by Chacon) — short, deeper than Pro Git ch. 10.
- Atlassian's Git tutorials — excellent visual explanations of merge vs rebase.
- *Building Git* (James Coglan) — for the readers who really want to know.
  Implements Git from scratch in Ruby. Optional but exquisite.
- GitHub Docs — for the GitHub-specific surface (Actions, branch protection,
  PRs, CODEOWNERS, secrets, environments).
- Trunk-Based Development (paulhammant.com/) — the modern shared-branch
  argument; useful counterweight to Git Flow.
- Drew DeVault's "Git is a directed acyclic graph and a content-addressable
  filesystem" essay — mind-flipping clarity.
- "How to write a Git commit message" (Tim Pope, chris.beams.io) — the
  canonical 7-rule essay.

**Cross-phase threads touched here**
- **Testing:** preview only — "tests run on every PR, and the merge button
  goes red if they fail." Deep coverage in Phase 9.
- **Debugging:** `git bisect` is a debugging tool. `git log -S` (pickaxe)
  is a debugging tool. `git blame` is a debugging tool. Phase 1 makes
  Git itself part of the debugger's toolkit.
- **Security:** secrets-in-history (L32 deep). Signed commits (L26 or
  separate). GitHub Secrets vs vars (L37). Branch protection as a security
  control (L35).
- **AI-integration:** AI agents that operate on Git (Cursor, Claude Code,
  Aider) — the orchestrator's interface with them is mostly commits + PRs.

---

## Module 1.1 — Git Core

Goal: command-line Git fluency. The student can do the full
init→commit→branch→merge→push cycle from memory, and recover from common
mistakes. Internal model (commit graph, refs, HEAD) is in place.

### L25 · What version control is · STANDARD · ~30 min
Subtopics: the four jobs (snapshot, undo, parallel work, audit trail);
centralized vs distributed VCS; SVN vs Mercurial vs Perforce vs Git as
historical context; why distributed won (the network-partition argument,
the GitHub effect); what "no VCS" looks like (project-final-v3.zip and the
horror); the cost of starting (~zero), the cost of NOT having it (incidents).

References: Pro Git ch. 1; *Software Tools* (Kernighan & Plauger, 1976) on
the diff utility's origin.

### L26 · What Git is — internals at the useful level · DEEP · ~90 min
Subtopics (~28):
1. The mental model: Git is a DAG of commits, plus refs that point into it.
2. The three trees: working directory, staging area (index), repository.
3. The four object types: blob, tree, commit, tag.
4. Content addressing — SHA-1 (now transitioning to SHA-256) of contents.
5. Why this means "the same content has the same hash, always."
6. The commit object: parent(s), tree, author, committer, message.
7. The tree object: a directory listing of blobs and other trees.
8. Trees and blobs are deduplicated across commits.
9. Refs: branches are just files in `.git/refs/heads/` containing a hash.
10. HEAD as a symbolic ref (usually) — pointing at a branch, which points at a commit.
11. Detached HEAD — what it really is.
12. The reflog: every move HEAD has made.
13. Objects live in `.git/objects/` — packfile compaction.
14. Inspect tools: `git cat-file -p <hash>`, `git ls-tree`, `git rev-parse`.
15. `git status` — what each section means.
16. The three areas in commands: working tree changes → `git add` → staged
    changes → `git commit` → repository.
17. `git diff` (working ↔ staged) vs `git diff --staged` (staged ↔ HEAD)
    vs `git diff HEAD` (working ↔ HEAD).
18. Why "lightweight branches" — they're just labels in files.
19. Why merges produce a new commit with multiple parents (or are
    fast-forward, no new commit).
20. Commit hashes — long vs short (7-12 chars typical); short hash
    collisions in big repos.
21. Tags vs branches: tags are immutable labels, usually for releases.
22. Annotated tags (`-a`) vs lightweight tags.
23. The .git folder layout: HEAD, refs/, objects/, hooks/, config, info/.
24. Hooks — `pre-commit`, `pre-push`, `commit-msg` — local scripts that
    run on Git events.
25. `git config` levels: --global, --local, --system; `core.editor`,
    `user.name`, `user.email`, `init.defaultBranch`, `pull.rebase`.
26. Signing commits with GPG/SSH/Sigstore — getting the green "Verified" badge.
27. The packfile and what `git gc` does.
28. Why `git status` is occasionally slow (large working trees + filesystem hooks).

Branches: SHA-1 vs SHA-256 (Git is transitioning); LFS (Large File Storage)
for binary assets; submodules (most teams now avoid them — use packages or
monorepos instead).

Anti-patterns: editing `.git/` by hand; committing as "wrong author" because
config was never set; ignoring the reflog (it would have saved them).

Practice sketch: dump a commit's tree and blobs by hash; find the same blob
in two commits.

References: Pro Git ch. 10 (Internals) — essential; "Building Git" by James
Coglan ch. 2-5; "Git from the Bottom Up" by John Wiegley.

Forward links: L32 (.gitignore at the object level), L36 (PR review — knowing
how diffs are stored makes review crisper).

Going further: write a tiny Git clone in Python (just the object model); read
the Git source code's `Documentation/technical/` folder.

### L27 · First repo · STANDARD · ~40 min
Subtopics: `git init`; `git config --global user.name/.email`; the
`.gitignore` MUST come before the first commit (or you commit node_modules
forever); `git add` (file, directory, `.`, `-p` for interactive hunks);
`git commit -m`, with `-m -m` for body, without `-m` opens the editor;
amending with `--amend` (and when not to: pushed commits); the first commit
is special (no parent); empty commits (`--allow-empty` — useful as deploy
triggers); committing on behalf of someone else (`--author`).

Commit message hygiene: the 7 rules (Tim Pope) — subject line 50 chars,
imperative mood, no period, blank line, body wraps at 72, why-not-what,
references issues/PRs; Conventional Commits format (feat: / fix: / chore:
/ docs: / refactor: / test: / perf: / build: / ci: / style: / revert:);
when CC pays off (automated changelogs); when it's noise (small teams who
don't ship libraries).

Anti-patterns: `git add . && git commit -m "wip"` 50 times; committing
secrets in commit 1; amending pushed commits without coordinating.

References: chris.beams.io/posts/git-commit; conventionalcommits.org;
Pro Git ch. 2.

### L28 · Reading git log · DEEP · ~60 min
Subtopics: default `git log` output; `--oneline`, `--graph`, `--all`,
`--decorate`, `--abbrev-commit`; the killer combo
`git log --oneline --graph --decorate --all`; setting that as an alias
(`git lg`); filters: `--since`, `--until`, `--author`, `--grep` (in commit
message), `-S "string"` (pickaxe — searches diffs); paths: `git log -- path`;
`git log -p` to see diffs; `git log --stat` for line counts; `git show <hash>`
to dig into one commit; `git blame <file>` with `-L 10,30`, `-w` (ignore
whitespace), `-C` (detect copies), `--ignore-revs-file`; `git diff` between
arbitrary commits; the `..` and `...` selectors (`A..B`, `A...B`); branch
comparison (`git log main..HEAD`); reflog (`git reflog`) — every HEAD move
in the last 90 days; recovering "lost" commits via reflog hash;
`git bisect start / good / bad / run` for binary-searching to a regression;
the "blame for the agent's mistake" workflow.

Anti-patterns: only looking at HEAD; skipping the reflog when "I lost my
work"; blaming without `-w`/`-C` flags (misattributes copy-paste).

Practice sketch: bisect to find which commit broke a test in a real repo;
use pickaxe to find when a particular line was introduced; use blame with
`-w` and notice the difference.

References: Pro Git ch. 7 (Customizing Git, log formats); `git help log`
(long but the source of truth); Atlassian's "How to use git bisect."

### L29 · What branches are · STANDARD · ~30 min
Subtopics: a branch is a file containing a hash; creating a branch is
copying a hash; switching branches moves HEAD; deleting a branch removes a
label, not the commits (still reachable by reflog or other refs); local
vs remote branches (`main` vs `origin/main`); upstream tracking;
"orphan" commits (no branch points to them) — eventually GC'd.

Branches: branching strategy decisions deferred to L30.

### L30 · Branching workflow · DEEP · ~75 min
Subtopics: `git branch -a` (all), `--list`, `--merged`, `--no-merged`;
creating: `git switch -c <name>` (modern), `git checkout -b <name>`
(classic); switching: `git switch`, `git checkout`; deleting:
`-d` (safe), `-D` (force); renaming: `git branch -m old new`; remote
branches: pushing a new branch (`-u`), tracking branches, pruning stale
remote refs (`git fetch --prune`); fast-forward vs three-way merge;
`git merge --no-ff` (preserve branch history) vs `--ff-only` (require
linear); rebase vs merge — the philosophy debate; `git rebase main` (replay
your commits on main); interactive rebase (`git rebase -i HEAD~5`) — pick,
reword, edit, squash, fixup, drop, exec; squashing for clean history before
PR; rebasing pushed commits is dangerous (rewrites history shared by
others); the "golden rule of rebase" — never rebase published branches that
others might have pulled.

Branching strategies as a real decision:
- **GitHub Flow** — one main, short-lived feature branches, deploy from main.
  Best for SaaS with CD.
- **Git Flow** — main + develop + release/* + hotfix/*. Best for
  release-cycle products (shipped software).
- **Trunk-Based Development** — short-lived branches OR direct commits to
  main with feature flags. Used by Google, Meta. Pairs with strong CI.
- **Release branches** — for products supporting multiple versions
  simultaneously.

Stashing: `git stash`, `git stash pop`, `git stash list`,
`git stash show -p`, named stashes; when to use stash vs commit-and-amend;
the "I started on the wrong branch" workflow.

Cherry-picking: `git cherry-pick <hash>` — copies one commit to current
branch. Useful for hotfixes back to release branches.

Anti-patterns: branches living for months; force-pushing to main; rebasing
shared branches; merging without a PR.

References: Pro Git ch. 3 (Branching) and ch. 7 (Rebasing); paulhammant.com
on Trunk-Based; nvie.com on Git Flow (the original 2010 essay — read it,
then read why most teams have moved on).

### L31 · Merge conflicts · DEEP · ~70 min
Subtopics: what triggers a conflict (both sides changed the same lines, or
one deleted what the other modified, or both renamed differently); reading
conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`); the difference between
"yours" (`--ours`) and "theirs" (`--theirs`) — and how these are SWAPPED
during rebase vs merge (gotcha); resolution strategies: keep mine, keep
theirs, combine, rewrite from scratch; `git checkout --ours/--theirs <file>`
for big files; the 3-way merge tool view (yours / theirs / base — base is
the common ancestor); using a mergetool (vscode merge editor, meld, kdiff3);
finishing the merge (`git add`, `git commit` with the default merge message
or your own); aborting (`git merge --abort` or `git rebase --abort`);
preventing conflicts: short-lived branches, frequent integration with main,
small PRs; conflict in lockfiles: delete and regenerate; semantic merges
(formatters and reorderings causing false conflicts — use `git config
merge.conflictStyle diff3` to see common ancestor, helps disambiguate).

Anti-patterns: committing files containing conflict markers; resolving a
conflict by deleting one side without reading; long-running branches that
accumulate massive conflicts.

References: Pro Git ch. 3.2; Atlassian merge conflict guide; `git mergetool`
documentation.

### L32 · .gitignore (and the secret-in-history disaster) · DEEP · ~50 min
Subtopics: glob syntax (`*`, `?`, `[abc]`, `**`, `!` to un-ignore, trailing
`/` for directories); per-directory `.gitignore` and override layering;
the four categories of "always ignore" (deps, build output, secrets,
local-only); .gitignore_global (your machine, all repos); `git rm --cached
<path>` to stop tracking a file already committed; the secret-in-history
disaster: rewriting history with `git filter-repo` (modern) or BFG
Repo-Cleaner; **GitHub secret-scanning** auto-rotation for some providers
(AWS, Stripe — they auto-revoke if leaked); **the principle: rotate
first, scrub history second**; preventing future leaks: pre-commit hooks
(detect-secrets, gitleaks); the difference between .gitignore and
.gitattributes; .git-blame-ignore-revs for "this commit was a formatter
sweep, please ignore for blame."

References: gitignore.io for templates; git-scm.com/docs/gitignore;
github.com/newren/git-filter-repo; GitHub's secret-scanning docs;
gitleaks README.

---

## Module 1.2 — GitHub

Goal: the GitHub platform's collaboration surface is second nature.
The student configures protection, runs reviews properly, sets up CI, and
treats AI-agent PRs the same as any human's.

### L33 · GitHub vs Git · STANDARD · ~30 min
Subtopics: Git is a CLI tool; GitHub is one hosted product on top of it;
GitLab and Bitbucket and Gitea as competitors with similar surfaces;
self-hosted options (Gitea, Forgejo); the GitHub-specific features (PR,
Actions, Issues, Discussions, Projects, Wiki, Pages, Releases, Packages);
the gh CLI as a shortcut for many web actions; reading github.com URLs
(/owner/repo/tree/branch, /blob/, /pull/N, /actions, /issues).

### L34 · push, pull, clone, fetch · DEEP · ~60 min
Subtopics: `git clone` and what it sets up; remotes (`git remote -v`, `-a`,
`remove`, `rename`); `origin` as convention; multiple remotes (origin +
upstream for forks); push: pushing a new branch (`-u` first time),
fast-forward push, force push (`--force`, `--force-with-lease`); pull as
fetch + merge (or fetch + rebase with `--rebase` or
`pull.rebase = true`); fetch — what it does (downloads, doesn't update
working tree); inspecting remote state without merging (`git log origin/main`);
prune (`git fetch --prune`) to drop deleted-upstream refs; `git push --tags`;
HTTPS auth (PAT — personal access token), SSH auth (key pairs); GitHub
fine-grained PATs; SSH key setup (`ssh-keygen -t ed25519`, `ssh-add`);
known_hosts; testing with `ssh -T git@github.com`; the "non-fast-forward
reject" error and what causes it; force-pushing to your own branch
(acceptable with `--force-with-lease`); force-pushing to shared (NO).

Anti-patterns: `git push --force` to main; HTTPS auth with password
(deprecated — use PAT or SSH).

References: Pro Git ch. 4 (Server) and ch. 2.5 (Remotes); GitHub docs on
SSH.

### L35 · What a Pull Request is · DEEP · ~75 min
Subtopics: PR as a "request to merge branch A into branch B"; the parts
(title, description, diff, conversation, reviews, checks, merge button);
the PR template (`.github/pull_request_template.md`); description hygiene
("what changed", "why", "how to test", screenshots/loom for UI);
linking issues (#123, "Closes #123"); reviewers (assign, request, suggest);
review states (Approve, Request changes, Comment); inline comments,
suggested changes (the GitHub `suggestion` block — agent can apply with
one click); resolved threads; the three merge strategies as a deliberate
choice:

- **Merge commit** — preserves the branch's commit history with a merge
  commit on top. Pros: full history. Cons: noisy graph.
- **Squash and merge** — collapses all branch commits into one on main.
  Pros: clean main history, one revert undoes the whole feature. Cons:
  loses commit-by-commit story.
- **Rebase and merge** — replays each commit onto main as if they were
  written there directly. Pros: clean linear history + individual commits.
  Cons: rewriting hashes.

Default recommendation: **squash for product teams, rebase for libraries**.

Branch protection rules (the orchestrator's leverage):
- Require pull request before merging.
- Require approvals (N reviewers).
- Dismiss stale approvals on new commits.
- Require review from Code Owners.
- Require status checks to pass (specific check names).
- Require branches to be up to date.
- Require linear history.
- Require signed commits.
- Restrict who can push.
- Allow force pushes (almost always: no) / Allow deletions (almost always: no).

CODEOWNERS file: path-based required reviewers.

Draft PRs for work-in-progress.

Merge queues (advanced) — for high-throughput teams. Auto-rebases and tests
each PR in queue order.

Anti-patterns: merging your own PR with no review; missing PR description;
PRs over 500 lines; PRs combining unrelated changes (scope creep).

References: GitHub docs on Pull Requests, branch protection, CODEOWNERS,
merge queues; "Best practices for code review" (Google's eng-practices guide).

### L36 · Reading a real PR (the seven-question review) · VERY-DEEP · ~120 min
Subtopics:

The seven questions:
1. **Scope** — does this PR do one thing?
2. **Risk** — what's the blast radius if it breaks? (auth, billing,
   migrations, infra → slow down)
3. **Correctness** — does the code do what the description claims?
4. **Testing** — is the change covered, and do tests actually exercise it?
5. **Readability** — will I understand this in 6 months?
6. **Security** — does it open holes? (input validation, secrets, authz)
7. **Operability** — how will we know if it breaks in production?
   (logs, metrics, alerts, error handling)

For each question, the lesson should include:
- Concrete cues (what to grep for in the diff)
- Example AI-generated PRs showing the failure mode
- A "what to comment" sample

How to give review feedback:
- Distinguish blocking from nits (use `nit:` prefix for nits).
- Suggest, don't dictate (`What about doing X because Y?`).
- "Praise in public, critique in private" — but reasoned public critique is fine.
- Be specific about WHY, not just WHAT.
- Use suggestion blocks for tiny changes.

Reading the diff effectively:
- Files-changed tab → file tree on the left for big PRs.
- "Show whitespace" toggle.
- "Hide whitespace changes" for formatter sweeps.
- File-by-file marking ("Viewed") for long PRs.
- "Load diff" for huge files.
- `?w=1` URL param trick.

Reviewing AI-generated PRs specifically:
- Confident-sounding code that doesn't do what claimed — most common bug.
- Tests that pass but don't actually test the behavior.
- Mocks that mock the thing being tested (false positives).
- New dependencies added without justification.
- Style inconsistency with the surrounding code.
- Silent error swallowing.
- Hardcoded values that should be configurable.
- Made-up API references (hallucinated method names — pin LLM versions
  with high quality and ground them in real docs to reduce this).

Anti-patterns: rubber-stamp LGTM; "looks good, didn't read the diff";
approving on title alone; nit-picking style while missing a security flaw
(read for the important stuff first).

References: Google's eng-practices/review (the canonical "How to do a code
review" guide — read all of it); Microsoft's Code Review Guidance; the
"Best practices for code review" search aggregators.

### L37 · GitHub Actions / CI/CD · VERY-DEEP · ~150 min
Subtopics (~35):
1. What CI is (auto-tests on every change) vs CD (auto-deploy).
2. The workflow file: `.github/workflows/*.yml`.
3. `name`, `on` (triggers), `jobs`, `runs-on`, `steps`.
4. Trigger types: `push`, `pull_request`, `schedule` (cron), `workflow_dispatch`
   (manual), `workflow_call` (reusable), `release`, `issue_comment`,
   `repository_dispatch`.
5. Path filters (`paths`, `paths-ignore`) and branch filters.
6. Matrix builds — run the same job over multiple OS/Node versions/etc.
7. Reusable actions (the marketplace) vs raw shell `run:` commands.
8. Most-used actions: `actions/checkout`, `actions/setup-node`,
   `actions/setup-python`, `actions/cache`, `actions/upload-artifact`,
   `actions/download-artifact`.
9. Workflow secrets vs repo secrets vs environment secrets.
10. Environments (Production, Staging) with required reviewers and protection.
11. Manual approval gates for deploys.
12. Concurrency groups — cancel-in-progress for PR re-runs.
13. Outputs between jobs.
14. Conditions (`if:`) and contexts (`github.*`, `env.*`, `vars.*`,
    `secrets.*`, `steps.<id>.outputs.*`, `needs.<job>.outputs.*`).
15. Reading a failing workflow run: which step, which line, search inside log.
16. Re-running specific jobs (only failed, or all).
17. Self-hosted runners — when, why, security considerations.
18. Workflow permissions (least privilege for the GITHUB_TOKEN).
19. The GITHUB_TOKEN itself — scope, default permissions, what it can
    write back.
20. OIDC federation — using short-lived cloud credentials instead of
    long-lived static secrets (huge security win).
21. Caching dependencies for speed.
22. Build artifacts and how to pass them between jobs.
23. Setup-* actions: language version pinning via .nvmrc / .tool-versions.
24. Common patterns: lint → typecheck → test → build → deploy.
25. Parallelizing tests via matrix or third-party (Knapsack, Cypress
    Dashboard).
26. Integration tests that need a database — service containers.
27. End-to-end tests (Playwright) in CI.
28. Code coverage reporting (Codecov, Coveralls).
29. Auto-merge after CI passes.
30. Dependabot updates and auto-merge.
31. Reusable workflows for monorepo or org-wide consistency.
32. Composite actions — packaging steps as one.
33. The build matrix for cross-platform libraries.
34. Cost considerations (minutes, large runners, self-hosted).
35. Beyond GitHub Actions: CircleCI, GitLab CI, Buildkite, Jenkins (legacy).

Branches:
- GitHub Actions vs Vercel/Netlify built-in CI — when each makes sense.
- OIDC vs long-lived secrets — the modern best practice strongly favors
  OIDC for cloud auth.

Anti-patterns: secrets in YAML; running tests only on main; deploying to
prod with no manual gate; flaky tests retried 5x; massive monolithic
workflows that take 40 minutes (split into parallel jobs).

References: GitHub Actions docs (workflows, contexts, expressions); GitHub
Skills (free practical track); Stephen Grider's "Building DevOps Pipelines"
(if a paid course makes sense); the actual `.github/workflows/` of popular
open-source projects (read FastAPI's, Next.js's).

Forward links: Phase 7.5 (CI/CD pipelines deeper), Phase 9 (release
strategies, blue-green/canary).

---

## Module 1.3 (NEW) — Branching strategies, releases, and team workflows

This module didn't exist in the original 264-lesson scaffold. It deserves
to. The Git mechanics in 1.1 are necessary but not sufficient — knowing
*how teams use Git* is what makes you an effective orchestrator on real
projects.

### L37a · Branching strategies in production · DEEP · ~75 min
Subtopics: GitHub Flow deep; Trunk-Based Development deep (Google's model);
Git Flow deep (for products with release windows); when each fits;
combining strategies (TBD + feature flags is now industry default for
fast SaaS); branch naming conventions; the role of `main` as "always
deployable"; the difference between "deploy" and "release" (feature flags).

### L37b · Versioning and releases · STANDARD · ~50 min
Subtopics: SemVer in depth (MAJOR.MINOR.PATCH, the rules); pre-release
tags (-alpha, -beta, -rc); build metadata (+sha); when to bump major
(breaking change to public API); Calver as an alternative (YYYY.MM.PATCH);
git tags for releases; GitHub Releases (UI on top of tags); release notes
generation; semantic-release / Changesets / release-please for automated
versioning + changelog; the relationship between conventional commits
and automated versioning; ChangeLog hygiene.

References: semver.org; Keep a Changelog (keepachangelog.com); googleapis/
release-please; semantic-release docs.

### L37c · Working with multiple repos (sub-modules, monorepos, packages) · STANDARD · ~50 min
Subtopics: when to monorepo vs polyrepo; tools: pnpm workspaces, npm
workspaces, yarn workspaces, Turborepo, Nx, Bazel, Pants, Buck2; lockfile
hoisting; selective builds (only-changed); shared tooling (one tsconfig,
one eslint); Git submodules (avoid for new work); Git LFS for big binary
files; subtrees (rarely).

### L37d · Working alongside AI agents in Git · DEEP · ~60 min
Subtopics: the AI-agent commit pattern (frequent, small, descriptive);
attribution (when commits are "co-authored"); the `Co-authored-by:` trailer
for shared credit; branch naming for agent work (e.g., `claude/...`,
`cursor/...`); when to require human review on agent PRs (always);
keeping main protected so agents can't bypass; pre-commit hooks the agent
must pass (lint, type-check, secret-scan) — Husky / lefthook / pre-commit
(Python); structured commit messages for agent-generated changes; reading
diff stats to spot "agent over-corrected and rewrote 80 files" early.

Anti-patterns: letting an agent push to main; turning off pre-commit hooks
to make the agent's commits land; not setting Code Owners.

References: GitHub's own docs on automated PR workflows; the "AI in code
review" emerging best practices.

---

## Phase 1 cross-thread coverage

- **Testing:** preview — "tests run on PRs, failing tests block merge."
- **Debugging:** `git bisect`, `git blame`, `git log -S` (pickaxe), reflog
  as recovery. Phase 1 makes Git part of your debugger.
- **Performance:** none here directly.
- **Security:** secrets-in-history (L32); branch protection as control
  (L35); GitHub OIDC (L37); signed commits (L26).
- **AI-integration:** L37d explicit; throughout (PRs are how you work
  with agents).

---

## What Phase 1 doesn't cover (deliberately deferred)

- Writing CI logic for any specific language stack — Phase 7.5 expands.
- Deployment beyond "trigger a deploy on merge" — Phase 7.
- Security beyond Git/GitHub — Phase 9.
- Release engineering at scale (multi-region, canary, rollbacks) — Phase 7
  and 9.
