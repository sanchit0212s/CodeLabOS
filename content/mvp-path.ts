/**
 * The Minimum Viable Path — the sharpest possible route to becoming
 * an "expert in the loop" who can direct AI coding agents, review their
 * output at senior-engineer level, and take over coding when the agent
 * gets it wrong.
 *
 * This is a CURATED SUBSET of the full 264-lesson scaffold (which will
 * expand to ~460 lessons per the granular blueprint). Everything not on
 * the MVP path is still available via the full Curriculum Map and via
 * Freeplay mode — but the MVP is the recommended order of operations
 * for the narrowest goal: orchestrator competence, fast.
 *
 * Selection criteria for inclusion:
 *  1. Required for reading any AI-generated project folder.
 *  2. Required for reading any PR an agent opens.
 *  3. Required for catching the standard AI-agent mistakes.
 *  4. Required for taking over coding when the agent is wrong.
 *  5. Required for production-readiness audits.
 *
 * Everything else is reference material accessible via the full map
 * and Freeplay mode.
 */

export interface MvpTier {
  id: string;
  title: string;
  subtitle: string;
  /** ~time at a sustainable pace (1 lesson/day = ~4-5 weeks per tier) */
  estimatedWeeks: string;
  /** What you can do after completing this tier */
  outcome: string;
  /** Lesson numbers from the curriculum manifest */
  lessons: number[];
}

export const mvpPath: MvpTier[] = [
  {
    id: "tier-1",
    title: "Tier 1 · Foundations",
    subtitle: "Project anatomy, terminal, networking, Git, code review.",
    estimatedWeeks: "2-3 weeks",
    outcome:
      "You can open any AI-generated repo and explain every file. You can read a Pull Request and apply the seven-question senior-engineer review. You can run git operations from the terminal without fear.",
    lessons: [
      // Phase 0 — All of it. These are non-negotiable foundations.
      1, 2, 3, 4, 5,        // Module 0.1 The Machine
      6, 7, 8, 9, 10, 11, 12, // Module 0.2 The Terminal
      13, 14, 15, 16, 17, 18, 19, // Module 0.3 How the Internet Works
      20, 21, 22, 23, 24,    // Module 0.4 Project Anatomy
      // Phase 1 — All of it. PR review is the #1 orchestrator skill.
      25, 26, 27, 28, 29, 30, 31, 32, // Module 1.1 Git Core
      33, 34, 35, 36, 37,    // Module 1.2 GitHub
    ],
  },
  {
    id: "tier-2",
    title: "Tier 2 · Code reading",
    subtitle: "Enough Python and TypeScript to read what agents produce.",
    estimatedWeeks: "3-4 weeks",
    outcome:
      "You can read any Python file and predict its behavior. You can read any modern TypeScript file (React, Next.js, Node) and explain every line. You can write a small (~100 LOC) script from scratch when an agent is stuck.",
    lessons: [
      // Python — language essentials only. Skip deep OOP/async/packaging.
      38,                    // Why Python
      39, 40,                // Variables, operators
      41,                    // if/else (lesson number from original scaffold)
      42, 43, 44,            // Loops, functions, lists
      45, 46, 47,            // Dicts, tuples/sets, strings
      48,                    // File I/O
      49,                    // Error handling
      50,                    // Modules + imports
      59, 60, 61,            // JSON, HTTP, .env (Module 2.3 — the "real work" subset)
      64,                    // Logging
      // JavaScript — fundamentals + async (essential for reading any frontend).
      65, 66, 67, 68,        // What JS is, variables, types, functions
      69, 70, 71,            // Arrays, objects, destructuring
      75, 76, 77, 78,        // Async — callbacks, promises, async/await
      79,                    // fetch
      // TypeScript — just enough to read errors.
      81, 82, 83,            // What TS is, annotations, interfaces
      85,                    // READING TS errors — critical skill
      86,                    // tsconfig.json — orchestrator audit skill
      // Node fundamentals — package.json reading.
      87, 88, 89, 90,        // What Node is, npm, package.json deep, lockfile
    ],
  },
  {
    id: "tier-3",
    title: "Tier 3 · The stack",
    subtitle: "Databases, backend, frontend, auth — the SaaS skeleton.",
    estimatedWeeks: "4-5 weeks",
    outcome:
      "You can audit any database schema for missing indexes, missing foreign keys, and the N+1 risk. You can read a backend endpoint and verify it has input validation, auth checks, error handling, and rate limits. You can read a React component tree and predict re-renders.",
    lessons: [
      // Databases — the highest-leverage area for SaaS quality.
      94, 95, 96, 97, 98,    // Module 4.1 fundamentals
      99, 100, 101, 102, 103, 104, // SQL essentials
      107,                   // PostgreSQL specifically
      111,                   // Caching pattern (Redis)
      112, 113, 114, 115,    // ORMs + Prisma + migrations
      // Backend — fundamentals + REST + auth (the orchestrator's audit zone).
      116, 117, 118, 119, 120, // Module 5.1 backend fundamentals
      121, 122, 123, 124, 125, // REST design
      132, 133, 134, 135, 136, // FastAPI (the AI-default Python framework)
      137, 138, 139, 140, 141, 142, 143, 144, 145, // ALL of auth — Module 5.5 in full
      // Frontend — enough to read Next.js + spot React bugs.
      146, 147, 148, 149, 150, 151, // HTML essentials
      152, 153, 154, 155, 159, // CSS essentials + Tailwind
      160, 161, 162, 163, 164, 165, // React: what it is, components, JSX, props, useState, useEffect
      167, 168, 173,          // Lists/keys, conditionals, fetching
      174, 175, 176,          // Next.js: what it is, pages vs app, SSR/CSR/SSG
      177, 178,               // API routes, next.config
    ],
  },
  {
    id: "tier-4",
    title: "Tier 4 · Production readiness",
    subtitle: "Docker, deployment, observability, secrets, the audit.",
    estimatedWeeks: "2-3 weeks",
    outcome:
      "You can read a Dockerfile end-to-end. You can read a GitHub Actions workflow. You can audit a production deploy for the standard security and operability issues. You know what to ask when an agent says 'I'll just deploy this to AWS.'",
    lessons: [
      // Infrastructure — selective, the highest-leverage parts.
      186, 187, 188, 189, 190, 191, 192, // Docker fundamentals + compose
      195, 196, 197, 198, 199, 200,      // Cloud platforms overview (IaaS/PaaS/SaaS, AWS basics, S3, CDNs)
      202, 203, 204, 205,                // YAML
      206, 207, 208, 209, 210,           // CI/CD pipelines
      // Security — the orchestrator's audit eye.
      234, 235, 236, 237, 238,           // OWASP Top 10 + secrets + HTTPS
      // Observability — knowing when things break.
      239, 240, 241, 242, 243,           // Logs / metrics / tracing / tools
      // Performance — N+1, caching, query optimization.
      244, 245, 246, 247,                // Latency, query opt, caching, load testing
    ],
  },
  {
    id: "tier-5",
    title: "Tier 5 · AI integration + the orchestrator's craft",
    subtitle: "How AI features work in code; how to direct agents; how to review their output.",
    estimatedWeeks: "2-3 weeks",
    outcome:
      "You can read any AI-powered codebase and audit it. You can write a technical brief an AI agent can execute reliably. You can run a senior-engineer-quality review on AI-generated PRs in under 30 minutes. This is the endgame.",
    lessons: [
      // AI integration patterns — the SaaS subset.
      220, 221, 222, 223, 224, 225, 226, 227, // ALL of Phase 8 Module 8.2 — LLMs, prompts, embeddings, RAG, agents
      // Architecture patterns relevant to AI features.
      230, 231, 232,                          // WebSockets, webhooks, background jobs
      // The orchestrator layer — ALL of Phase 10.
      248, 249, 250, 251, 252,                // Module 10.1 Reading any codebase
      253, 254, 255, 256,                     // Module 10.2 Technical decision making
      257, 258, 259, 260, 261,                // Module 10.3 Directing AI agents
      262, 263, 264,                          // Module 10.4 Capstone
    ],
  },
];

/** Flat list of all lesson numbers in the MVP path, in order. */
export const mvpLessonSet: Set<number> = new Set(
  mvpPath.flatMap((tier) => tier.lessons),
);

/** Total number of lessons on the MVP path. */
export const mvpTotalLessons = mvpLessonSet.size;
