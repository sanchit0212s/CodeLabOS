# CodeLabOS

> The Learning Operating System for becoming a technical orchestrator.

CodeLabOS is a mission-control environment for going from technical zero to
confident technical director of AI coding agents. Not a course. Not a
tutorial list. A structured, interactive, gap-free system designed to be
lived inside for months.

See [`DESIGN.md`](./DESIGN.md) for the full product and architecture design.
See [`CURRICULUM.md`](./CURRICULUM.md) for the complete 264-lesson syllabus.

## Run locally

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

## Repository layout

```
app/             Next.js App Router — pages and layouts
components/      Mission Control widgets + interactive lesson components
content/         The curriculum manifest and lesson MDX files
lib/             Progress tracking, mastery, curriculum helpers, types
public/          Static assets
```

Every config file in this project root is taught somewhere in the
curriculum. By the end of Phase 0 you will be able to `ls` this folder
and name the role of every file from memory.

## Status

- Platform shell: built
- Phase 0 (How Computers & Code Actually Work, 24 lessons): authored
- Phases 1–10: structured in the curriculum manifest, content authoring in
  progress

## Standards

CodeLabOS holds itself to seven non-negotiable standards. They are listed
in `DESIGN.md` §11. The short version: no forward references, every file
shown is real, every concept has a "where you'll see this," every lesson
has an anti-pattern, no hand-waving.
