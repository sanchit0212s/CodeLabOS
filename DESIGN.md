# CodeLabOS — Product & Architecture Design

> The Learning Operating System for becoming a technical orchestrator.
> Not a course. Not a tutorial list. A mission-control environment you live inside.

---

## 1. Product Thesis

You are not learning to code. You are learning to **direct, audit, and steer
AI agents that code for you**. Every feature of CodeLabOS is judged against
one question:

> "Does this make me more dangerous in a code review of an AI-generated PR?"

If the answer is no, it doesn't ship.

### What this means in practice

- **Concepts are taught in the context of files you will actually see.** Every
  lesson on `package.json` shows a real `package.json`. Every lesson on Docker
  shows a real `Dockerfile`. Theory without a file artifact is banned.
- **Mastery is verified, not assumed.** Every lesson ends with a mastery gate.
  You don't progress until you pass.
- **The curriculum is linear, not à la carte.** No "choose your path." There is
  one path. Every dependency is taught before the thing that depends on it.
- **The platform itself is a teaching artifact.** CodeLabOS is built in
  Next.js + TypeScript + Tailwind + Postgres patterns. You will eventually
  read its source code as a capstone exercise.

---

## 2. The Five-Layer Learning Model

Every lesson is structured in five layers. You move through them in order.

```
   ┌──────────────────────────────────────────────────────────┐
   │  LAYER 1 — WHY THIS MATTERS                              │
   │  90 seconds. Where this concept shows up when an AI      │
   │  agent builds something. What breaks if you don't        │
   │  know it.                                                │
   └──────────────────────────────────────────────────────────┘
                              │
                              ▼
   ┌──────────────────────────────────────────────────────────┐
   │  LAYER 2 — MENTAL MODEL                                  │
   │  The picture in your head. One diagram, one metaphor.    │
   │  Designed to survive 6 months without practice.          │
   └──────────────────────────────────────────────────────────┘
                              │
                              ▼
   ┌──────────────────────────────────────────────────────────┐
   │  LAYER 3 — THE CONCEPT (TAUGHT EXPLICITLY)               │
   │  Plain-language explanation. Definitions named. No       │
   │  "you'll figure this out later." Every term hyperlinks   │
   │  to the glossary.                                        │
   └──────────────────────────────────────────────────────────┘
                              │
                              ▼
   ┌──────────────────────────────────────────────────────────┐
   │  LAYER 4 — IN CONTEXT                                    │
   │  A real file or real project pattern. Annotated. "Here   │
   │  is where this will appear when an AI agent builds your  │
   │  SaaS."                                                  │
   └──────────────────────────────────────────────────────────┘
                              │
                              ▼
   ┌──────────────────────────────────────────────────────────┐
   │  LAYER 5 — MASTERY GATE                                  │
   │  3–7 checks: recall, recognition, application, and       │
   │  anti-pattern spotting. Must pass 90% to unlock next.    │
   └──────────────────────────────────────────────────────────┘
```

The five layers are visible in the UI as tabs you can return to. Once you
complete a lesson, the Mental Model layer becomes a permanent flashcard in
your **Review Queue** (spaced repetition).

---

## 3. The Mission Control Surface

CodeLabOS is laid out like a flight deck, not a website.

```
┌─────────────────────────────────────────────────────────────────────────┐
│  CODELABOS                          [Phase 0 → 1 → 2 → … → 10]          │
│  mission control                                                        │
├──────────────┬──────────────────────────────────┬───────────────────────┤
│  CURRENT     │  TODAY'S BRIEFING                │  REVIEW QUEUE         │
│  POSITION    │                                  │                       │
│              │  Lesson 13                       │  • Lesson 2: OS       │
│  Phase 0     │  What happens when you open a    │    (due now)          │
│  Module 0.3  │  browser and type a URL          │  • Lesson 7: ls/cd    │
│  Lesson 13/264│                                 │    (due tomorrow)     │
│              │  [ ▶ BEGIN ]      ~12 min        │  • Lesson 11: chmod   │
│  Mastery 96% │                                  │    (due in 3 days)    │
│              │                                  │                       │
├──────────────┼──────────────────────────────────┼───────────────────────┤
│  TOOLS                                          │  PHASE PROGRESS       │
│                                                 │                       │
│  ▸ File Anatomy Inspector                       │  Phase 0  ████████░░  │
│    Paste any project folder → annotated map     │  Phase 1  ░░░░░░░░░░  │
│  ▸ Glossary  (412 terms)                        │  Phase 2  ░░░░░░░░░░  │
│  ▸ Curriculum Map  (264 lessons)                │  …                    │
│  ▸ Anti-Pattern Bestiary                        │                       │
└─────────────────────────────────────────────────────────────────────────┘
```

### Surfaces

1. **Mission Control** (`/`) — the home dashboard above.
2. **Lesson Player** (`/learn/[phase]/[module]/[lesson]`) — the five-layer
   lesson view with interactive components.
3. **Curriculum Map** (`/map`) — the full 264-lesson tree, navigable,
   showing mastery state per node.
4. **File Anatomy Inspector** (`/tools/file-anatomy`) — the answer to your
   biggest pain point. Paste a project's file tree (or a single filename) and
   get an annotated explanation of every file, what it does, who created it,
   whether it's safe to ignore, and what to ask the AI agent about it.
5. **Glossary** (`/tools/glossary`) — every term ever defined, searchable.
   Each entry links back to the lesson that introduced it.
6. **Anti-Pattern Bestiary** (`/tools/bestiary`) — a catalog of the bad
   things AI agents tend to do, with examples and how to spot them. Grows
   as you progress.
7. **Review Queue** (`/review`) — spaced-repetition flashcards drawn from
   your Mental Model layer.

---

## 4. Interactive Component Library

These are the components that make lessons feel like a flight simulator
instead of a textbook. They are real React components, reusable across all
264 lessons.

| Component             | Purpose                                                                  |
|-----------------------|--------------------------------------------------------------------------|
| `<FileTree>`          | Annotated, expandable project tree. Hover any file → role explanation.   |
| `<TerminalSim>`       | Fake terminal you can type into. Predefined scenarios with expected I/O. |
| `<Diagram>`           | Mermaid + custom SVG diagrams with click-to-zoom and labeled regions.    |
| `<ConceptCard>`       | The mental-model card. Front: question. Back: answer + diagram.          |
| `<AnnotatedCode>`     | Code block with margin annotations explaining every line.                |
| `<RequestResponse>`   | Visual HTTP request/response pairs with headers/body breakdown.          |
| `<AntiPattern>`       | Side-by-side: "what an AI agent might do" vs. "what you should push for".|
| `<MasteryCheck>`      | The end-of-lesson gate. Mix of MCQ, fill-in, code-spot, file-spot.       |
| `<WhereYoullSeeThis>` | A card that lists 3–5 real-world contexts where the concept appears.     |
| `<GlossaryTerm>`      | Inline term that opens a sidebar definition on click.                    |
| `<PhaseGate>`         | End-of-phase competency check (longer than a lesson gate).               |

---

## 5. File Anatomy Inspector — The Pain-Point Solver

Your biggest stated pain point: "Every project generates dozens of files I
can't read." The Inspector solves this directly and is available from Day 1.

**Input:** paste a file tree (the output of `ls -la` or `tree` or a GitHub
file listing) OR a single filename.

**Output:**

```
package.json
┌────────────────────────────────────────────────────────────────────┐
│ ROLE         Node.js project manifest                              │
│ CREATED BY   npm init or framework scaffolder                      │
│ READ?        YES — always read this first when opening a project   │
│ EDIT?        Sometimes — scripts and dependencies                  │
│ CONTAINS     name, version, scripts, dependencies, devDependencies │
│                                                                    │
│ WHAT TO ASK YOUR AI AGENT                                          │
│ • "Why did you add <package X>? What does it do?"                  │
│ • "Are any of these dependencies unused?"                          │
│ • "Why this version range? (^, ~, exact)"                          │
│                                                                    │
│ TAUGHT IN    Lesson 88: npm and package.json deep dive             │
│ RELATED      package-lock.json, node_modules, .npmrc               │
└────────────────────────────────────────────────────────────────────┘
```

The Inspector ships with a starter knowledge base of ~200 common files.
Each lesson that teaches a file type adds an entry. By the end of Phase 7,
the Inspector knows every common file across web, API, mobile, CLI,
infrastructure, and AI projects.

---

## 6. Mastery Model

You said 90–95% mastery. Here's how that's enforced.

### Per-lesson gate
- 5 questions on average, drawn from a pool of 8–12 per lesson.
- Must score 90% on first attempt, OR pass 100% on a retry with different
  questions.
- Failure on second attempt → routed to a **Remediation Lesson**, which
  re-teaches the weakest concept before letting you re-try.

### Per-module gate
- A short integrative challenge: "Given this real file, answer 5 questions
  about it." Or: "Watch this AI agent build this thing — what would you push
  back on?"

### Per-phase gate
- A capstone exercise. For Phase 0, this is a guided tour through a real
  project where you must correctly identify the role of 15 files and answer
  3 free-form questions about the project's structure.

### Spaced review
- Every mental model becomes a flashcard.
- Schedule: 1 day, 3 days, 7 days, 21 days, 60 days.
- The Review Queue appears on the dashboard daily.

### Mastery Score
- A weighted rolling average of (gate scores) × (review accuracy) × (recency).
- Displayed prominently — this is your KPI.

---

## 7. The 10-Phase Roadmap with Competency Gates

| Phase | Title                                | Lessons | Gate (at end of phase, you can…)                                                              |
|-------|--------------------------------------|---------|------------------------------------------------------------------------------------------------|
| 0     | How Computers & Code Actually Work   | 24      | Open any project folder and correctly name the role of 15+ files without help.                |
| 1     | Git & Version Control                | 13      | Read a PR diff and explain what changed, why, and whether the commit history is clean.        |
| 2     | Python                               | 27      | Read any Python script and predict its behavior. Spot the 5 most common Python mistakes.       |
| 3     | JavaScript & TypeScript              | 29      | Read a modern JS/TS file and explain every line, including async flow and TS errors.           |
| 4     | Databases                            | 22      | Read a Prisma schema or SQL migration and spot bad design (missing indexes, no FK, N+1 risk). |
| 5     | Backend & APIs                       | 30      | Audit any REST endpoint for validation, auth, error handling, and security holes.              |
| 6     | Frontend                             | 33      | Read a React/Next.js component tree and predict re-renders, data flow, and state issues.      |
| 7     | Infrastructure & DevOps              | 37      | Read a Dockerfile, docker-compose, and GitHub Actions workflow end-to-end without help.        |
| 8     | Data, AI Integration, Patterns       | 18      | Read an AI agent codebase and explain the tool/memory/orchestration loop architecture.         |
| 9     | Security, Observability, Performance | 14      | Run an OWASP Top 10 audit on any web app and read logs/metrics to diagnose an incident.        |
| 10    | The Orchestrator Layer               | 17      | Take an AI-generated PR and produce a senior-engineer-quality review in under 30 minutes.      |

Total: **264 lessons** across **10 phases**.

Expected pace at 1 lesson/day weekdays: **~13 months**.
Expected pace at 2 lessons/day weekdays: **~7 months**.

---

## 8. Technical Architecture (How CodeLabOS is Built)

Stack choices are intentional — every choice is a stack you will encounter
in the curriculum, so the platform itself becomes a worked example.

- **Framework:** Next.js 15 (App Router, RSC) — taught in Phase 6
- **Language:** TypeScript — taught in Phase 3
- **Styling:** Tailwind CSS — taught in Phase 6
- **Content:** MDX (Markdown + JSX) — every lesson is an MDX file
- **State:** localStorage for progress (v1, single-user). Migrates to a real
  DB + Prisma when you do Phase 4.
- **Diagrams:** Mermaid + custom SVG
- **Deployment:** Vercel-ready (zero-config)

### Repository layout (the meta-lesson)

```
codelabos/
├── app/                          # Next.js App Router — taught Phase 6
│   ├── layout.tsx                # root layout, fonts, providers
│   ├── page.tsx                  # Mission Control dashboard
│   ├── learn/[phase]/[module]/[lesson]/page.tsx
│   ├── map/page.tsx
│   ├── review/page.tsx
│   └── tools/{file-anatomy,glossary,bestiary}/page.tsx
├── components/
│   ├── dashboard/                # Mission Control widgets
│   ├── lesson/                   # Lesson layout & layers
│   └── interactive/              # FileTree, TerminalSim, etc.
├── content/
│   ├── curriculum.ts             # The 264-lesson manifest
│   └── lessons/phase-X/module-Y/Z-slug.mdx
├── lib/
│   ├── progress.ts               # mastery + review queue
│   ├── curriculum.ts             # helpers
│   └── types.ts
├── public/
└── (config files — each taught in Phase 0)
    package.json, tsconfig.json, tailwind.config.ts,
    next.config.mjs, postcss.config.mjs, .gitignore, README.md
```

Every config file in the project root is taught somewhere in the curriculum.
You can `cd ~/CodeLabOS` and `ls` and recognize every single file by the
time you finish Phase 0.

---

## 9. What's Built in This First Session

- ✅ Product/architecture design (this document)
- ✅ Next.js + TypeScript + Tailwind app shell, deploy-ready
- ✅ Curriculum manifest with all 264 lessons indexed
- ✅ Mission Control dashboard
- ✅ Lesson player with five-layer renderer
- ✅ Core interactive components: FileTree, TerminalSim, Diagram, ConceptCard,
     AnnotatedCode, MasteryCheck, WhereYoullSeeThis, AntiPattern
- ✅ Curriculum Map, Glossary, File Anatomy Inspector (skeletons)
- ✅ Progress + mastery tracking via localStorage
- ✅ Phase 0 fully authored (Modules 0.1–0.4, 24 lessons) as the reference
     pattern every future phase will follow

## 10. What Comes Next (Phase-by-Phase Build Cadence)

Each phase is its own build cycle. The pattern:

1. **Outline pass.** Confirm lesson order, gate definition, and the
   real-world files we'll annotate.
2. **Content pass.** Write the MDX for every lesson, with diagrams and
   interactive components.
3. **Gate pass.** Author the mastery checks and the phase gate.
4. **Reference pass.** Add every new term to the Glossary and every new
   file type to the File Anatomy Inspector.
5. **Polish pass.** Review for visual consistency, anti-patterns called
   out, no hand-waving.

Suggested order after Phase 0:
- Phase 1 (Git) — short, high-leverage
- Phase 2 (Python) — first real language
- Phase 4 (Databases) — out of curriculum order on purpose; SQL is short
  and unlocks Phase 5's depth
- Phase 3 (JS/TS) — heavy phase
- Phases 5 → 6 → 7 → 8 → 9 → 10

(You can override the order — the platform supports any sequence — but
this minimizes "stuck waiting for prerequisites" pain.)

---

## 11. The Standards (Non-Negotiables)

These are the rules every lesson must obey. They are the answer to your
"no shortcuts, 90-95% mastery" requirement.

1. **No forward references.** A lesson may not use a term not yet defined.
2. **Every file shown is real.** No toy examples that wouldn't appear in a
   production project.
3. **Every concept has a Where You'll See This.** If we can't point to
   where it appears when an AI agent builds something, the concept doesn't
   ship.
4. **Every lesson has an anti-pattern.** What does a bad implementation
   look like? What would an AI agent get wrong here?
5. **No "you'll understand this later."** Either teach it now or don't
   mention it.
6. **The mental model survives 6 months of no practice.** If it requires
   recent context to make sense, it's not a good mental model.
7. **The mastery gate is honest.** A 90% on the gate genuinely means 90%
   mastery. We don't write easy questions to make you feel good.

---

End of design.
