export interface BestiaryEntry {
  name: string;
  phase: string;
  symptom: string;
  whyBad: string;
  fix: string;
  example?: string;
}

/**
 * The Anti-Pattern Bestiary. The bad behaviors an orchestrator
 * needs to recognize and push back on.
 *
 * Grows as lessons are authored.
 */
export const bestiary: BestiaryEntry[] = [
  {
    name: "Secrets in the repo",
    phase: "Security",
    symptom: "An API key, database password, or token appears literally in a source file.",
    whyBad: "Anyone with read access to the repo can use them. If the repo is ever public — even briefly — the secret is permanently leaked and must be rotated. Many breaches start here.",
    fix: "Move every secret to a .env file (which is in .gitignore), or a secret manager. Reference them via process.env in code.",
    example: 'const apiKey = "sk-proj-AbCdEf123456..."  // ← in the source',
  },
  {
    name: ".env file committed",
    phase: "Security",
    symptom: ".env shows up in the Git history.",
    whyBad: "Same as 'secrets in the repo'. The whole point of .env is that it's local-only.",
    fix: "Add .env to .gitignore BEFORE adding any keys. Use .env.example (no real values) to document required keys.",
  },
  {
    name: "node_modules committed",
    phase: "Project hygiene",
    symptom: "node_modules/ folder is in the repo, often making it gigabytes.",
    whyBad: "These files are reproducible from package.json. Committing them bloats the repo, causes endless merge conflicts, and confuses anyone reading the diff.",
    fix: "Add node_modules/ to .gitignore. Run npm install to recreate it.",
  },
  {
    name: "Missing input validation",
    phase: "Backend",
    symptom: "An API endpoint reads req.body and uses fields directly without checking they exist or have the right type.",
    whyBad: "The next request could be missing fields, have wrong types, or contain attacks. Crashes, data corruption, or security holes follow.",
    fix: "Validate every incoming request with a schema (Zod, Pydantic, Joi). Reject malformed input with a 400 before touching the database.",
  },
  {
    name: "Plain-text passwords",
    phase: "Security",
    symptom: "User passwords are stored as-is in the database, or hashed with SHA-256/MD5.",
    whyBad: "If the database leaks, every user account is compromised. Fast hashes (SHA, MD5) are crackable in minutes.",
    fix: "Use bcrypt, argon2, or scrypt. Never roll your own.",
  },
  {
    name: "Hardcoded URLs and ports",
    phase: "Backend",
    symptom: "Code says fetch('http://localhost:3000/api/...').",
    whyBad: "Works in dev, breaks in production. Different environments need different URLs.",
    fix: "Read the base URL from an environment variable.",
  },
  {
    name: "N+1 queries",
    phase: "Database",
    symptom: "The page loads 100 items, then makes 100 separate database queries to load related data — one for each item.",
    whyBad: "Linear blowup. A page that takes 50ms with 10 items takes 5 seconds with 1000.",
    fix: "Use a single query with a JOIN, or eager-load with the ORM (Prisma `include`, etc).",
  },
  {
    name: "Missing indexes",
    phase: "Database",
    symptom: "Queries that filter or sort on a column without an index. Performance is fine in dev, terrible in prod.",
    whyBad: "Every query becomes a full table scan. At scale, the database melts.",
    fix: "Add an index on every column you filter, join, or sort on regularly. EXPLAIN your slow queries.",
  },
  {
    name: "Catch-all error swallowing",
    phase: "Code quality",
    symptom: "try/catch around big blocks of code, with an empty catch or `catch(e) { console.log(e) }`.",
    whyBad: "Errors get hidden. You silently lose data, miss bugs, and blow up in mysterious ways downstream.",
    fix: "Catch errors narrowly. Log structured info. Re-throw or handle each kind explicitly.",
  },
  {
    name: "Mutating shared state",
    phase: "Frontend",
    symptom: "An AI agent's React component mutates an array prop with .push() or .splice() instead of returning a new array.",
    whyBad: "React doesn't re-render. Other components see stale data. Hours of debugging the wrong thing.",
    fix: "Always return new arrays/objects. Use spread, .map, .filter — never mutate.",
  },
  {
    name: "Missing CORS handling",
    phase: "Backend",
    symptom: "Your frontend can't call your backend from the browser. Console shows 'Access-Control-Allow-Origin' error.",
    whyBad: "Looks like a frontend bug but is a backend config issue.",
    fix: "Configure CORS on the backend to allow your frontend's origin. Not '*' in production.",
  },
  {
    name: "Untyped `any` everywhere",
    phase: "TypeScript",
    symptom: ": any annotations or implicit any to silence the compiler.",
    whyBad: "TypeScript's whole value proposition disappears. Bugs that the compiler would have caught now crash at runtime.",
    fix: "Type things properly. If you don't know the type, use `unknown` and narrow it.",
  },
  {
    name: "Deployment without rollback",
    phase: "DevOps",
    symptom: "The deploy pipeline pushes to production with no way to roll back if it breaks.",
    whyBad: "First production bug = panic. Hot-fixes under pressure = more bugs.",
    fix: "Use blue-green or canary deploys. Keep the previous version one click away.",
  },
  {
    name: "Mixing build artifacts into source",
    phase: "Project hygiene",
    symptom: "Compiled files (dist/, .next/, build/) appear in commits alongside source.",
    whyBad: "Bloats the repo, causes merge conflicts on regenerated bytes, hides real changes.",
    fix: "Add build folders to .gitignore. Source is the truth; builds are derived.",
  },
  {
    name: "No request timeouts",
    phase: "Backend",
    symptom: "Calls to external services have no timeout. When the other side is slow, your service waits forever.",
    whyBad: "One slow dependency exhausts your server's resources and brings everyone down.",
    fix: "Set explicit timeouts on every outbound HTTP call. Fail fast.",
  },
];
