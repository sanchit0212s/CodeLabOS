# CodeLabOS — The Curriculum

This is the curriculum blueprint, separate from the platform that delivers it.
The platform (Next.js app in the repo root) is one possible expression of the
curriculum. The curriculum is the *thing*. The platform is the *vehicle*.

If everything in the `app/` and `content/` folders evaporated tomorrow, this
directory is what you'd hand to a competent technical writer or another AI
agent and they could rebuild the platform faithfully — or, more importantly,
they could deliver the same outcome through a completely different surface
(a book, a video course, a bootcamp syllabus, a series of 1:1 coaching
sessions). The curriculum is medium-agnostic.

## How this is organized

```
curriculum/
├── README.md                        ← you are here
├── 00-philosophy.md                 ← design principles, references, how depth is decided
├── 01-phase-0-foundations.md
├── 02-phase-1-git.md
├── 03-phase-2-python.md
├── 04-phase-3-javascript-typescript.md
├── 05-phase-4-databases.md
├── 06-phase-5-backend.md
├── 07-phase-6-frontend.md
├── 08-phase-7-infrastructure.md
├── 09-phase-8-ai-and-patterns.md
├── 10-phase-9-quality-and-production.md
└── 11-phase-10-orchestration.md
```

Each per-phase document follows the same shape:

1. **Phase summary** — essence, gate (what you can do at the end), prerequisites, references.
2. **Module breakdown** — each module's role and how it relates to neighbors.
3. **Lesson catalog** — for every lesson:
   - Title and one-line essence
   - Depth tag (`light` / `standard` / `deep` / `very-deep`)
   - Estimated time
   - Subtopics (the actual content tree)
   - Branches — "here are multiple ways to do this, here's when to use each"
   - Anti-patterns specific to this lesson
   - Practice sketches — what hands-on work belongs here
   - References — books, courses, docs, blog posts that informed the topic
   - Prerequisite lessons and forward links
   - "Going further" — rabbit holes worth knowing about

4. **Cross-phase threads** — testing, debugging, performance, security,
   AI-integration. These don't live in one phase — they recur. Each phase
   document notes how it touches each thread.

## Status

| Phase | Doc | Granularity | Authoring status (platform) |
|-------|-----|-------------|-----------------------------|
| 0 | [01-phase-0-foundations.md](./01-phase-0-foundations.md) | drafted | 24/24 lessons shipped (old shape) |
| 1 | [02-phase-1-git.md](./02-phase-1-git.md) | drafted | 13/13 lessons shipped (old shape) |
| 2 | [03-phase-2-python.md](./03-phase-2-python.md) | drafted | 3/27 lessons shipped (new shape) |
| 3 | [04-phase-3-javascript-typescript.md](./04-phase-3-javascript-typescript.md) | drafted | not yet |
| 4 | [05-phase-4-databases.md](./05-phase-4-databases.md) | drafted | not yet |
| 5 | [06-phase-5-backend.md](./06-phase-5-backend.md) | drafted | not yet |
| 6 | [07-phase-6-frontend.md](./07-phase-6-frontend.md) | drafted | not yet |
| 7 | [08-phase-7-infrastructure.md](./08-phase-7-infrastructure.md) | drafted | not yet |
| 8 | [09-phase-8-ai-and-patterns.md](./09-phase-8-ai-and-patterns.md) | drafted | not yet |
| 9 | [10-phase-9-quality-and-production.md](./10-phase-9-quality-and-production.md) | drafted | not yet |
| 10 | [11-phase-10-orchestration.md](./11-phase-10-orchestration.md) | drafted | not yet |

The "old shape" notation means those lessons exist in the platform but in the
shallow form — five-layer template, ~1500 words, 5 questions. Once the curriculum
is fully drafted, those lessons will be rewritten against the blueprint.

## How to read

Read `00-philosophy.md` first. The rest of the documents will make more sense
with the design principles in mind.

Then read whichever phase you're about to study (or whichever phase you're
asking me to author). Don't read all ten cold — they're meant as reference
docs, not narrative.
