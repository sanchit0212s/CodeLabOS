# Phase 10 — The Orchestrator Layer

**Essence:** the meta-skill the whole curriculum points at. Reading any
codebase. Choosing a stack. Writing briefs that AI agents can execute.
Reviewing their output at senior-engineer level. Knowing when to push
back. Phase 10 is short relative to its importance — by the time the
student reaches it, the muscles are built; this phase ties them together
and operationalizes them.

**Gate:** given an AI-generated PR of substantial size (new feature touching
auth, database, UI, infra), produce a senior-engineer-quality review in
under 30 minutes. Given a feature request, write a technical brief an
AI agent can execute reliably. Given an unfamiliar codebase, produce
an architecture summary in under 60 minutes.

**Restructuring note:** the original scaffold had 17 lessons in 4 modules
(248-264). Restructured to ~25 lessons across 5 modules. The major
additions: technical debt management, prompt engineering for code-gen,
"when to use which AI tool" decisions, an actual capstone exercise.

**Primary references**
- Earlier phases — Phase 10 doesn't introduce new technical content as
  much as it operationalizes earlier content.
- *The Pragmatic Programmer* (Hunt, Thomas) — chapters on practical
  thinking and orthogonality.
- *Refactoring* (Fowler) — the "smell catalog" maps to reviewing AI code.
- *Working Effectively with Legacy Code* (Feathers) — for inheriting
  any codebase, including one an agent built.
- *Designing Data-Intensive Applications* — for "what stack and why"
  decisions.
- Joel Spolsky's *Joel on Software* essays — engineering management
  perspective.
- Will Larson's *An Elegant Puzzle* — staff-eng-level thinking.
- *A Philosophy of Software Design* (Ousterhout) — design quality.
- *The Hard Parts of Software Architecture* (Richards & Ford).
- Anthropic's "Building effective agents" essay (anthropic.com/research)
  — for the multi-agent vs single-agent decisions.
- The blog posts behind tools like Cursor, Aider, Claude Code, Devin,
  Lovable — the "AI coding agent" product designs are themselves a
  curriculum.
- The "Code Review Best Practices" from Google, Microsoft.

---

## Module 10.1 — Reading any codebase

### L1 · The 10-step onboarding ritual · DEEP · ~60 min
Subtopics: a systematic approach the student runs on any unfamiliar
repo:
1. Read the README.
2. Read package.json / pyproject.toml — what scripts? what deps?
3. Read .env.example — what config does this need?
4. Look at the directory structure (eye over root).
5. Look at the entry point (app/page.tsx, src/main.py, src/index.ts).
6. Read the CI workflow (.github/workflows/*).
7. Read the Dockerfile / compose.yml.
8. Find and skim the database schema (Prisma / SQLAlchemy / migrations).
9. Find and skim two integration tests — they show intended use.
10. Trace ONE feature end-to-end (e.g., "sign-up flow" — UI form →
    Server Action → DB write → email → response).

Practice exercises: do this on a famous OSS project (Calcom, Inbox-Zero,
the curriculum platform itself).

### L2 · Reading backend code · DEEP · ~60 min
Subtopics: find the routes; find the middleware chain; find the auth;
find the data access layer; find the service-layer (business logic);
find the external integrations; trace the layers. The "router → controller
→ service → repository" layered pattern. Reading async / event-driven
code (queues, webhooks).

### L3 · Reading frontend code · DEEP · ~60 min
Subtopics: find the routes (file-based or React Router); identify
RSC vs Client; find the global state stores; find the data-fetching
pattern (TanStack Query? RSC? SWR?); read the styling approach (Tailwind?
CSS Modules?); trace a user action's state flow.

### L4 · Reading infrastructure / IaC · STANDARD · ~50 min
Subtopics: which provider; what services are provisioned; reading
Terraform / IaC; reading the K8s manifests or platform config (Vercel,
Fly.toml); finding security policies (IAM, security groups); cost
implications (NAT, large instances, log volume).

### L5 · Reading AI-augmented code · DEEP · ~50 min
Specifically: what prompts are used; what tools the agent has; what's
the loop structure; how is cost bounded; how are LLM errors handled;
what's logged. The "the prompts are part of your code" perspective.

---

## Module 10.2 — Technical decision making

### L6 · Choosing a stack · DEEP · ~70 min
Subtopics: the "boring tech wins" doctrine (Dan McKinley); the "team
skill" axis ("the best tech for you is the one your team can run");
the "ecosystem maturity" axis (large community, library availability,
hiring); the "scale fit" axis (matches your projected scale, plus
2-3x headroom); the canonical "modern SaaS default" stack in 2026:
- Frontend: Next.js (App Router) + TypeScript + Tailwind + shadcn/ui.
- Backend: Next.js Route Handlers + Server Actions, OR a separate
  FastAPI service for Python-heavy AI work.
- DB: Postgres (managed: Neon, Supabase, RDS).
- Cache / queue: Redis (managed: Upstash, ElastiCache).
- Object storage: S3 / R2.
- Auth: Auth.js / Clerk / Lucia / BetterAuth / Supabase Auth.
- Deployment: Vercel (frontend) + Fly/Render/AWS (Python services).
- Observability: Sentry + a logging service (Better Stack, Datadog).
- CI: GitHub Actions.

When to deviate (and the cost of deviation).

### L7 · Build vs buy · DEEP · ~50 min
Subtopics: criteria — is it your differentiator? does an excellent
service exist? what's the lock-in risk? what's the migration cost
later? The "build to learn, buy to ship" heuristic. Examples: auth
(buy Clerk or build with Auth.js? — buy if growing fast); search
(build Postgres FTS or buy Algolia / Typesense? — usually build the
basic, buy when it's a UX bottleneck); analytics (build minimal or buy
PostHog / Mixpanel? — usually buy at small scale).

### L8 · Spotting and managing technical debt · DEEP · ~50 min
Subtopics: types of debt (deliberate, accidental, bit-rot); the "debt
register" practice; paying down: 20% time vs scheduled vs done-with-
feature-work; the "you can refactor under green tests, you can't refactor
without them" reality; the "if it isn't broken, don't refactor it"
counterweight; the "refactor while you're already touching it" guideline
(boy-scout rule).

### L9 · Estimating · STANDARD · ~40 min
Subtopics: why estimation is hard; story points vs hours vs t-shirt
sizes; the "estimate by similarity to past work, not by decomposition"
heuristic; the buffer for unknowns; reviewing AI estimates skeptically
(they tend to underestimate integration + edge cases + ops).

### L10 · The make-vs-rewrite decision · STANDARD · ~40 min
Subtopics: the "Things You Should Never Do, Part I" essay (Joel Spolsky);
when rewrites work (small scope, clear gain, modern alternative); when
they fail (large, ambitious, unbounded); the Strangler Fig as the
incremental path; "ship of Theseus" replacing one piece at a time.

### L11 · When to write code vs when to use a service · STANDARD · ~30 min
Subtopics: the "you don't have to build everything yourself" reality;
the "what would Stripe build for billing? — Stripe." reasoning; the
ladder from no-code → low-code → vendor SaaS → managed library → self-
hosted; the "minimize accidental complexity" principle.

---

## Module 10.3 — Directing AI agents

### L12 · The mental model of the AI coding agent · DEEP · ~50 min
Subtopics: what an AI coding agent IS (Claude Code, Cursor, Aider, Devin,
Lovable, v0, etc.) — an LLM with code-editing tools; its strengths
(syntax, common patterns, idiomatic code, scaffolding); its weaknesses
(architecture decisions, subtle edge cases, project-specific conventions
it can't see, recent library changes); the "trust but verify" stance;
when to use which (Cursor / Claude Code for in-IDE editing; v0 /
Bolt / Lovable for UI prototypes; Aider for repo-level changes;
Devin / Replit Agent / Manus for "autonomous, multi-step" tasks).

### L13 · Writing a technical brief · DEEP · ~70 min
Subtopics: the components of a brief an agent can execute reliably:
1. Context — what is the project, what's the relevant codebase area.
2. Goal — what should be true at the end (acceptance criteria).
3. Constraints — what to NOT change, what conventions to follow.
4. Examples — point at existing code to mimic.
5. Tests — how will the work be verified.
6. Out-of-scope — what's deliberately not part of this brief.
7. Open questions — what should the agent ask before assuming.

The "specify like you would for an offshore contractor, not a colleague"
calibration. The "include enough that an agent can do it; not so much
that you wrote it yourself" balance.

### L14 · Prompting AI coding agents (the orchestrator's prompt engineering) · DEEP · ~70 min
Subtopics: include a system-prompt-equivalent set of project rules
(.cursorrules / claude.md / .windsurfrules); link to architecture docs
(or include in context); reference specific files ("modify auth.ts at
the marked TODO"); ask for plans before execution on big tasks ("write
a plan first, get my approval, then execute"); the "show me the diff
before applying" instruction; the "include a test" instruction; the
"don't add new dependencies without asking" instruction; common
prompt structures.

### L15 · Reviewing AI-generated code in depth · DEEP · ~80 min
The seven-question framework from Phase 1 L36, applied specifically to
AI-generated output. Additional cues for AI-code:
- Made-up imports (the library doesn't have that method).
- Suspiciously confident comments.
- Tests that test the implementation rather than the behavior.
- Tests that mock the thing they're testing.
- Massive over-engineering (factory + facade + strategy for what should
  be a function).
- "Helpful" extra changes the brief didn't ask for.
- Missing error handling under "happy path" code.
- Missing edge cases (empty list, single element, very long list, special chars).
- Hardcoded values where config should be.
- Silent error swallowing.
- Print statements left in (or console.log).
- Comments that disagree with the code.

### L16 · Catching the common AI mistakes · DEEP · ~60 min
A catalog of specific mistakes by category:
- **Architecture**: over-engineering, premature abstraction, wrong
  pattern for the scale.
- **Security**: hardcoded secrets; SQL via string concatenation; eval/exec
  on user input; permissive CORS; client-side authz.
- **Performance**: N+1; loading everything into memory; missing indexes;
  fetching in a loop.
- **Reliability**: no timeouts; no retries; no idempotency; silent error
  swallowing; missing observability.
- **Frontend**: state-mutation; missing keys in lists; useEffect for
  derived state; bundle bloat (added a heavy lib for nothing).
- **Style**: inconsistent with surrounding code; comments that are wrong;
  no tests; tests that don't actually test.
- **Library use**: deprecated methods; hallucinated APIs; wrong import paths.

### L17 · When to push back on an AI agent · DEEP · ~50 min
Subtopics: red flags ("I'll just install this large library"); ambiguous
requirements ("I'll make assumptions and proceed" — STOP, ask); breaking
existing patterns ("I refactored the surrounding code while I was here");
removing tests or comments without explanation; scope creep; performance
or security claims without evidence; "trust me, this is the right way."

### L18 · The orchestrator's own toolkit · STANDARD · ~40 min
Subtopics: the IDE + AI pairs (Cursor, Windsurf, Zed, VS Code + Copilot,
JetBrains + AI Assistant, Claude Code, Aider in terminal); the "AI in
your terminal" tools (Claude Code, Aider, OpenInterpreter); v0 / Lovable
/ Bolt for UI scaffolds; PR review tools (CodeRabbit, Greptile);
the meta-skill of "knowing which tool for which task."

---

## Module 10.4 — Capstone projects

### L19 · Capstone 1 — Reading a complete SaaS · VERY-DEEP · ~600 min (multi-day)
Pick an OSS SaaS project (Calcom, Plane, Inbox-Zero, Twenty, Documenso,
the platform built in this curriculum). Apply the 10-step ritual.
Produce a 5-page document describing: architecture diagram, tech stack
choices and rationales (your guess), top 5 risks, top 5 design strengths,
the "if I were tech lead and had a week, what would I change."

### L20 · Capstone 2 — Audit exercise on an AI-generated project · VERY-DEEP · ~480 min
Have an AI agent build a small SaaS feature. Then apply the seven-
question review + the production audit checklist + the catalog of AI
mistakes. Produce a written review.

### L21 · Capstone 3 — Direct an AI to build a SaaS feature from a brief · VERY-DEEP · ~720 min
Write a brief (per L13). Direct an AI agent through implementation.
Review at each step. Iterate. Deliver a working feature that passes
all the lessons' standards.

### L22 · Build your personal technical review framework · DEEP · ~120 min
Subtopics: distill what you've learned into your own checklist; tune
for your industry / stack / risk tolerance; keep it as a living document.
Establish a personal "ask before approving" list. Build a glossary of
your project's conventions that AI agents should follow.

---

## Module 10.5 — The orchestrator's professional posture

### L23 · Communicating with engineers · STANDARD · ~50 min
Subtopics: when to ask "how" vs "why"; the "I read the diff, I have
three concerns" stance; respectful technical disagreement; not pretending
to know what you don't; the "I'd like to learn how this works"
question; productive code review comments.

### L24 · The continued-learning practice · STANDARD · ~30 min
Subtopics: how to stay current (newsletters: Pragmatic Engineer,
ByteByteGo, TLDR Newsletter, Bytes, JavaScript Weekly, Python Weekly;
podcasts: Software Engineering Daily, Lex Fridman ML episodes,
talkpython, syntax.fm); the "read one new RFC / blog post / source file
per week" discipline; the "every PR I review is a learning opportunity"
mindset.

### L25 · The graduation: what "expert orchestrator" means in practice · STANDARD · ~30 min
- You can read any modern web codebase and explain it.
- You can write a brief that an agent can execute.
- You can review the agent's output at senior level.
- You can argue with the agent and win when you should.
- You can make tech-stack decisions with confidence about trade-offs.
- You can audit a SaaS for the standard security / performance /
  reliability concerns.
- You know what you don't know — and can find out.

---

## Phase 10 cross-thread coverage

Phase 10 IS the cross-thread phase — it threads back through every
previous phase. The capstones in M10.4 are the ultimate cross-thread
exercises.

## What Phase 10 doesn't cover

Phase 10 is the end of the curriculum. From here, the student is in the
real world, working on real projects. Continued learning is the practice
(M10.5); the curriculum stops scaffolding it.
