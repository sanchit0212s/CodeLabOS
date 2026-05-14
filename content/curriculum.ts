import type { PhaseRef } from "@/lib/types";

/**
 * The complete CodeLabOS curriculum.
 *
 * 10 phases, 264 lessons.
 *
 * Lesson numbers are GLOBAL (1..264) so the user can say "I'm on lesson 47"
 * without translating phase/module/lesson coordinates in their head.
 *
 * The `authored` flag indicates whether MDX content has been written for the
 * lesson yet. Lessons without authored content render a "Coming Soon" placeholder
 * in the lesson player.
 */
export const curriculum: PhaseRef[] = [
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: "0",
    title: "How Computers & Code Actually Work",
    tagline: "Foundation layer. Before a single line of code.",
    gate: "Open any project folder and name the role of 15+ files without help.",
    accent: "phase",
    modules: [
      {
        id: "0-1",
        title: "The Machine",
        summary: "What a computer actually does, in plain English.",
        lessons: [
          { n: 1, slug: "what-a-computer-does", title: "What a computer actually does", authored: true },
          { n: 2, slug: "operating-systems", title: "What an operating system is and why it exists", authored: true },
          { n: 3, slug: "the-filesystem", title: "The filesystem — what files and folders actually are", authored: true },
          { n: 4, slug: "how-programs-run", title: "How programs run — from file to execution", authored: true },
          { n: 5, slug: "processes-memory-crashes", title: "Processes, memory, and why programs crash", authored: true },
        ],
      },
      {
        id: "0-2",
        title: "The Terminal",
        summary: "Why developers live in the terminal, and how to operate one.",
        lessons: [
          { n: 6, slug: "what-the-terminal-is", title: "What the terminal is and why developers live in it", authored: true },
          { n: 7, slug: "navigating-via-terminal", title: "Navigating the filesystem via terminal", authored: true },
          { n: 8, slug: "reading-writing-files", title: "Reading and writing files from the terminal", authored: true },
          { n: 9, slug: "environment-variables", title: "What environment variables are and why they exist", authored: true },
          { n: 10, slug: "the-path", title: "What a PATH is and why it matters", authored: true },
          { n: 11, slug: "permissions", title: "Permissions (chmod, chown) — what they mean", authored: true },
          { n: 12, slug: "piping-and-redirection", title: "Piping and redirection — chaining commands", authored: true },
        ],
      },
      {
        id: "0-3",
        title: "How the Internet Works",
        summary: "The seven things that actually happen when you type a URL.",
        lessons: [
          { n: 13, slug: "url-to-page", title: "What happens when you open a browser and type a URL", authored: true },
          { n: 14, slug: "ip-dns-domains", title: "IP addresses, DNS, and domain names explained", authored: true },
          { n: 15, slug: "http-https", title: "HTTP and HTTPS — requests and responses", authored: true },
          { n: 16, slug: "what-an-api-is", title: "What an API is — the most important mental model", authored: true },
          { n: 17, slug: "status-codes", title: "Status codes (200, 404, 500) and what they mean", authored: true },
          { n: 18, slug: "server-vs-client", title: "What a server is vs. what a client is", authored: true },
          { n: 19, slug: "localhost", title: "What localhost is and why developers use it", authored: true },
        ],
      },
      {
        id: "0-4",
        title: "Project Anatomy",
        summary: "Reading any project folder. Your biggest pain point, solved.",
        lessons: [
          { n: 20, slug: "what-a-project-is", title: "What a software project actually is", authored: true },
          { n: 21, slug: "common-files", title: "The most common files in any project", authored: true },
          { n: 22, slug: "what-dependencies-are", title: "What dependencies are and why projects have hundreds", authored: true },
          { n: 23, slug: "what-a-build-is", title: "What a build process is — from source to running software", authored: true },
          { n: 24, slug: "dev-staging-production", title: "Dev vs. staging vs. production environments", authored: true },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  {
    id: "1",
    title: "Git & Version Control",
    tagline: "The developer's most essential tool.",
    gate: "Read a PR diff and explain what changed, why, and whether the commit history is clean.",
    accent: "info",
    modules: [
      {
        id: "1-1",
        title: "Git Core",
        summary: "What Git is, why it exists, how it actually stores history.",
        lessons: [
          { n: 25, slug: "what-is-version-control", title: "What version control is and why it exists", authored: true },
          { n: 26, slug: "what-git-is", title: "What Git is — repositories, commits, history", authored: true },
          { n: 27, slug: "first-repo", title: "git init, git add, git commit — your first repo", authored: true },
          { n: 28, slug: "reading-git-log", title: "Reading git log and understanding commit history", authored: true },
          { n: 29, slug: "what-branches-are", title: "What branches are and why developers use them", authored: true },
          { n: 30, slug: "branching-workflow", title: "git branch, git checkout, git merge", authored: true },
          { n: 31, slug: "merge-conflicts", title: "Merge conflicts and how to resolve them", authored: true },
          { n: 32, slug: "gitignore", title: ".gitignore — what to never commit and why", authored: true },
        ],
      },
      {
        id: "1-2",
        title: "GitHub",
        summary: "Where teams (and you and your AI agents) collaborate on code.",
        lessons: [
          { n: 33, slug: "github-vs-git", title: "What GitHub is vs. what Git is" },
          { n: 34, slug: "push-pull-clone", title: "git push, git pull, git clone" },
          { n: 35, slug: "what-a-pr-is", title: "What a Pull Request is and how code review works" },
          { n: 36, slug: "reading-a-pr", title: "Reading a real PR — what to look for as an orchestrator" },
          { n: 37, slug: "github-actions-concept", title: "GitHub Actions — what CI/CD is at a conceptual level" },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  {
    id: "2",
    title: "Python",
    tagline: "Language 1 — reads like English, powers AI.",
    gate: "Read any Python script and predict its behavior. Spot the 5 most common Python mistakes.",
    accent: "ok",
    modules: [
      {
        id: "2-1",
        title: "Python Fundamentals",
        summary: "Variables, control flow, data structures, errors, files.",
        lessons: [
          { n: 38, slug: "why-python", title: "Why Python, where it's used, what files look like" },
          { n: 39, slug: "variables-types", title: "Variables and data types" },
          { n: 40, slug: "operators", title: "Operators and expressions" },
          { n: 41, slug: "if-else", title: "If/else logic — decision making" },
          { n: 42, slug: "loops", title: "Loops — for and while" },
          { n: 43, slug: "functions", title: "Functions — reusable blocks of logic" },
          { n: 44, slug: "lists", title: "Lists and how to work with them" },
          { n: 45, slug: "dictionaries", title: "Dictionaries — key/value pairs" },
          { n: 46, slug: "tuples-sets", title: "Tuples and sets" },
          { n: 47, slug: "strings", title: "String manipulation — the 20 things you do constantly" },
          { n: 48, slug: "reading-writing-files-py", title: "Reading and writing files in Python" },
          { n: 49, slug: "errors-try-except", title: "Error handling — try/except" },
          { n: 50, slug: "modules-imports", title: "Importing modules — using other people's code" },
        ],
      },
      {
        id: "2-2",
        title: "Python Intermediate",
        summary: "OOP, comprehensions, decorators, environments, dependencies.",
        lessons: [
          { n: 51, slug: "classes-objects", title: "Classes and objects — OOP explained visually" },
          { n: 52, slug: "first-class", title: "Writing your first class" },
          { n: 53, slug: "inheritance", title: "Inheritance and why it exists" },
          { n: 54, slug: "list-comprehensions", title: "List comprehensions" },
          { n: 55, slug: "lambda", title: "Lambda functions" },
          { n: 56, slug: "decorators", title: "Decorators — what they are and where you see them" },
          { n: 57, slug: "venv", title: "Virtual environments (venv)" },
          { n: 58, slug: "pip-requirements", title: "pip and requirements.txt" },
        ],
      },
      {
        id: "2-3",
        title: "Python for Real Work",
        summary: "JSON, HTTP, env files, CLIs, scheduling, logging.",
        lessons: [
          { n: 59, slug: "json-in-python", title: "Working with JSON in Python" },
          { n: 60, slug: "requests-library", title: "Making HTTP requests" },
          { n: 61, slug: "dotenv", title: "Reading .env files and environment config" },
          { n: 62, slug: "basic-cli", title: "Writing a basic CLI script in Python" },
          { n: 63, slug: "scheduled-scripts", title: "Scheduled scripts — running code on a timer" },
          { n: 64, slug: "logging", title: "Logging — making your code tell you what it's doing" },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  {
    id: "3",
    title: "JavaScript & TypeScript",
    tagline: "Language 2 — the web's native language.",
    gate: "Read a modern JS/TS file and explain every line, including async flow and TS errors.",
    accent: "warn",
    modules: [
      {
        id: "3-1",
        title: "JavaScript Fundamentals",
        summary: "The JS you'll see in every modern frontend.",
        lessons: [
          { n: 65, slug: "what-is-javascript", title: "What JavaScript is, where it runs" },
          { n: 66, slug: "var-let-const", title: "Variables (var, let, const)" },
          { n: 67, slug: "js-data-types", title: "Data types in JS — null vs undefined, coercion" },
          { n: 68, slug: "js-functions", title: "Functions — declarations, expressions, arrows" },
          { n: 69, slug: "arrays-methods", title: "Arrays — map, filter, reduce, find" },
          { n: 70, slug: "js-objects", title: "Objects — the backbone of JS" },
          { n: 71, slug: "destructuring", title: "Destructuring — the shorthand you see everywhere" },
          { n: 72, slug: "template-literals", title: "Template literals" },
          { n: 73, slug: "spread-rest", title: "Spread and rest operators" },
          { n: 74, slug: "if-ternary-switch", title: "If/else, ternary, switch" },
        ],
      },
      {
        id: "3-2",
        title: "JavaScript Async",
        summary: "The hardest part of JS, demystified.",
        lessons: [
          { n: 75, slug: "what-async-is", title: "What asynchronous code is and why it exists" },
          { n: 76, slug: "callbacks", title: "Callbacks — the original async pattern" },
          { n: 77, slug: "promises", title: "Promises — .then() and .catch()" },
          { n: 78, slug: "async-await", title: "async/await — the modern way" },
          { n: 79, slug: "fetch", title: "fetch() and your first API call" },
          { n: 80, slug: "async-errors", title: "Error handling in async code" },
        ],
      },
      {
        id: "3-3",
        title: "TypeScript",
        summary: "JS with rules. The default for new projects.",
        lessons: [
          { n: 81, slug: "what-typescript-is", title: "What TypeScript is and why it exists" },
          { n: 82, slug: "type-annotations", title: "Type annotations" },
          { n: 83, slug: "interfaces-types", title: "Interfaces and types" },
          { n: 84, slug: "generics", title: "Generics — explained simply" },
          { n: 85, slug: "reading-ts-errors", title: "Reading TypeScript error messages" },
          { n: 86, slug: "tsconfig", title: "tsconfig.json — what it does" },
        ],
      },
      {
        id: "3-4",
        title: "Node.js",
        summary: "JavaScript on the server.",
        lessons: [
          { n: 87, slug: "what-node-is", title: "What Node.js is" },
          { n: 88, slug: "npm-package-json", title: "npm, node_modules, package.json explained fully" },
          { n: 89, slug: "package-json-deep", title: "package.json deep dive — scripts, deps, versions" },
          { n: 90, slug: "package-lock", title: "What package-lock.json is" },
          { n: 91, slug: "commonjs-vs-esm", title: "CommonJS vs ES Modules" },
          { n: 92, slug: "node-http-server", title: "A basic HTTP server in Node" },
          { n: 93, slug: "event-loop", title: "The event loop" },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  {
    id: "4",
    title: "Databases",
    tagline: "Where all data lives.",
    gate: "Read a Prisma schema or SQL migration and spot bad design.",
    accent: "info",
    modules: [
      {
        id: "4-1",
        title: "Database Fundamentals",
        summary: "Tables, rows, columns, keys, indexes.",
        lessons: [
          { n: 94, slug: "what-a-database-is", title: "What a database is" },
          { n: 95, slug: "sql-vs-nosql", title: "Relational vs. non-relational" },
          { n: 96, slug: "tables-rows-schemas", title: "Tables, rows, columns, schemas" },
          { n: 97, slug: "primary-foreign-keys", title: "Primary keys, foreign keys, relationships" },
          { n: 98, slug: "indexes", title: "What an index is" },
        ],
      },
      {
        id: "4-2",
        title: "SQL",
        summary: "Language 3 — the language every database speaks.",
        lessons: [
          { n: 99, slug: "what-is-sql", title: "What SQL is" },
          { n: 100, slug: "select", title: "SELECT — reading data" },
          { n: 101, slug: "where-orderby-limit", title: "WHERE, ORDER BY, LIMIT" },
          { n: 102, slug: "insert-update-delete", title: "INSERT, UPDATE, DELETE" },
          { n: 103, slug: "joins", title: "JOINs — the hardest SQL concept" },
          { n: 104, slug: "aggregations", title: "Aggregations — COUNT, SUM, AVG, GROUP BY" },
          { n: 105, slug: "subqueries", title: "Subqueries" },
          { n: 106, slug: "transactions", title: "Transactions" },
          { n: 107, slug: "postgres", title: "PostgreSQL — why it's the default for SaaS" },
        ],
      },
      {
        id: "4-3",
        title: "NoSQL Databases",
        summary: "MongoDB, Redis, and the caching layer.",
        lessons: [
          { n: 108, slug: "mongodb", title: "What MongoDB is — documents instead of tables" },
          { n: 109, slug: "mongo-vs-postgres", title: "When to use MongoDB vs. PostgreSQL" },
          { n: 110, slug: "redis", title: "What Redis is — in-memory storage" },
          { n: 111, slug: "caching-patterns", title: "What a cache is and the caching patterns" },
        ],
      },
      {
        id: "4-4",
        title: "ORMs",
        summary: "Talking to databases without writing raw SQL.",
        lessons: [
          { n: 112, slug: "what-is-an-orm", title: "What an ORM is" },
          { n: 113, slug: "prisma", title: "Prisma — schema files, migrations, queries" },
          { n: 114, slug: "reading-prisma-schema", title: "Reading a Prisma schema file" },
          { n: 115, slug: "migrations", title: "Database migrations" },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  {
    id: "5",
    title: "Backend & APIs",
    tagline: "The server side, end to end.",
    gate: "Audit any REST endpoint for validation, auth, error handling, and security holes.",
    accent: "ok",
    modules: [
      {
        id: "5-1",
        title: "Backend Fundamentals",
        summary: "What a backend does, in detail.",
        lessons: [
          { n: 116, slug: "what-a-backend-does", title: "What a backend does — the full picture" },
          { n: 117, slug: "what-a-framework-is", title: "What a framework is" },
          { n: 118, slug: "request-response-cycle", title: "Request/response cycle in detail" },
          { n: 119, slug: "middleware", title: "What middleware is" },
          { n: 120, slug: "routing", title: "What routing is" },
        ],
      },
      {
        id: "5-2",
        title: "REST APIs",
        summary: "The architectural style behind 90% of APIs.",
        lessons: [
          { n: 121, slug: "what-rest-is", title: "What REST is" },
          { n: 122, slug: "http-verbs", title: "HTTP verbs in depth" },
          { n: 123, slug: "designing-endpoints", title: "Designing clean API endpoints" },
          { n: 124, slug: "request-validation", title: "Request validation — never trust incoming data" },
          { n: 125, slug: "api-versioning", title: "API versioning — why /api/v1/ exists" },
        ],
      },
      {
        id: "5-3",
        title: "Express.js",
        summary: "Node backend framework still in heavy use.",
        lessons: [
          { n: 126, slug: "what-express-is", title: "What Express is" },
          { n: 127, slug: "express-setup", title: "Setting up an Express server" },
          { n: 128, slug: "route-handlers", title: "Writing route handlers" },
          { n: 129, slug: "express-middleware", title: "Middleware in Express" },
          { n: 130, slug: "error-middleware", title: "Error handling middleware" },
          { n: 131, slug: "express-db", title: "Connecting Express to a database" },
        ],
      },
      {
        id: "5-4",
        title: "FastAPI",
        summary: "The modern Python standard.",
        lessons: [
          { n: 132, slug: "what-fastapi-is", title: "What FastAPI is" },
          { n: 133, slug: "path-query-params", title: "Path parameters and query parameters" },
          { n: 134, slug: "pydantic", title: "Pydantic models — automatic validation" },
          { n: 135, slug: "fastapi-di", title: "Dependency injection in FastAPI" },
          { n: 136, slug: "swagger", title: "Auto-generated API docs (Swagger UI)" },
        ],
      },
      {
        id: "5-5",
        title: "Authentication & Security",
        summary: "Sessions, tokens, hashing, OAuth, CORS, rate limits, secrets.",
        lessons: [
          { n: 137, slug: "authn-vs-authz", title: "Authentication vs. authorization" },
          { n: 138, slug: "sessions-vs-tokens", title: "Sessions vs. tokens" },
          { n: 139, slug: "jwt", title: "What JWTs are" },
          { n: 140, slug: "oauth", title: "OAuth 2.0 — how Sign in with Google works" },
          { n: 141, slug: "password-hashing", title: "Password hashing (bcrypt)" },
          { n: 142, slug: "api-keys", title: "API keys" },
          { n: 143, slug: "cors", title: "CORS — what it is and why it breaks your app" },
          { n: 144, slug: "rate-limiting", title: "Rate limiting" },
          { n: 145, slug: "secrets", title: "Environment secrets — never hardcoding credentials" },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  {
    id: "6",
    title: "Frontend",
    tagline: "What users actually see and touch.",
    gate: "Read a React/Next.js component tree and predict re-renders, data flow, and state issues.",
    accent: "phase",
    modules: [
      {
        id: "6-1",
        title: "HTML",
        summary: "Language 4 — the skeleton of every webpage.",
        lessons: [
          { n: 146, slug: "what-html-is", title: "What HTML is" },
          { n: 147, slug: "html-document-structure", title: "Document structure — html, head, body" },
          { n: 148, slug: "html-tags", title: "The 20 most important HTML tags" },
          { n: 149, slug: "semantic-html", title: "Semantic HTML — why div soup is bad" },
          { n: 150, slug: "forms", title: "Forms — inputs, labels, submission" },
          { n: 151, slug: "the-dom", title: "What the DOM is" },
        ],
      },
      {
        id: "6-2",
        title: "CSS",
        summary: "Language 5 — how a page actually looks.",
        lessons: [
          { n: 152, slug: "what-css-is", title: "What CSS is and how it attaches to HTML" },
          { n: 153, slug: "selectors", title: "Selectors, properties, values" },
          { n: 154, slug: "box-model", title: "The box model" },
          { n: 155, slug: "flexbox", title: "Flexbox" },
          { n: 156, slug: "grid", title: "CSS Grid" },
          { n: 157, slug: "responsive", title: "Responsive design and media queries" },
          { n: 158, slug: "css-variables", title: "CSS variables" },
          { n: 159, slug: "tailwind", title: "What Tailwind CSS is and why most projects use it" },
        ],
      },
      {
        id: "6-3",
        title: "React",
        summary: "The dominant frontend framework.",
        lessons: [
          { n: 160, slug: "what-react-is", title: "What React is and the problem it solves" },
          { n: 161, slug: "components", title: "Components — the building block" },
          { n: 162, slug: "jsx", title: "JSX — HTML inside JavaScript" },
          { n: 163, slug: "props", title: "Props — passing data into components" },
          { n: 164, slug: "state-usestate", title: "State — useState" },
          { n: 165, slug: "useeffect", title: "useEffect" },
          { n: 166, slug: "events", title: "Event handling in React" },
          { n: 167, slug: "lists-keys", title: "Lists and keys" },
          { n: 168, slug: "conditional-rendering", title: "Conditional rendering" },
          { n: 169, slug: "composition", title: "Component composition" },
          { n: 170, slug: "hooks", title: "What hooks are — the full picture" },
          { n: 171, slug: "usecontext", title: "useContext — sharing state without prop drilling" },
          { n: 172, slug: "react-router", title: "React Router" },
          { n: 173, slug: "fetching-in-react", title: "Fetching data in React" },
        ],
      },
      {
        id: "6-4",
        title: "Next.js",
        summary: "The full-stack React framework.",
        lessons: [
          { n: 174, slug: "what-nextjs-is", title: "What Next.js is" },
          { n: 175, slug: "pages-vs-app", title: "Pages vs. App Router" },
          { n: 176, slug: "ssr-csr-ssg", title: "SSR vs. CSR vs. SSG" },
          { n: 177, slug: "api-routes", title: "API routes — backend inside your frontend" },
          { n: 178, slug: "next-config", title: "next.config.js — what it controls" },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  {
    id: "7",
    title: "Infrastructure & DevOps",
    tagline: "How software gets to production and stays alive.",
    gate: "Read a Dockerfile, docker-compose, and GitHub Actions workflow end-to-end without help.",
    accent: "warn",
    modules: [
      {
        id: "7-1",
        title: "Linux & Shell Scripting",
        summary: "Language 6 — bash and the world of servers.",
        lessons: [
          { n: 179, slug: "why-linux", title: "Why servers run Linux" },
          { n: 180, slug: "shell-scripting", title: "Shell scripting basics" },
          { n: 181, slug: "bash-control-flow", title: "Variables, conditionals, loops in bash" },
          { n: 182, slug: "automation-scripts", title: "Writing useful automation scripts" },
          { n: 183, slug: "cron", title: "Cron jobs" },
          { n: 184, slug: "process-mgmt", title: "Process management" },
          { n: 185, slug: "ssh", title: "SSH — connecting to remote servers" },
        ],
      },
      {
        id: "7-2",
        title: "Docker",
        summary: "Language 7 — containerization.",
        lessons: [
          { n: 186, slug: "what-docker-is", title: "What Docker is and the problem it solves" },
          { n: 187, slug: "containers-vs-vms", title: "Containers vs. virtual machines" },
          { n: 188, slug: "dockerfile", title: "The Dockerfile, line by line" },
          { n: 189, slug: "images-vs-containers", title: "Docker images vs. containers" },
          { n: 190, slug: "docker-commands", title: "docker build, run, ps, logs" },
          { n: 191, slug: "docker-compose", title: "Docker Compose" },
          { n: 192, slug: "docker-compose-yml", title: "docker-compose.yml — reading the file" },
          { n: 193, slug: "volumes", title: "Volumes — persisting data" },
          { n: 194, slug: "container-networking", title: "Networking between containers" },
        ],
      },
      {
        id: "7-3",
        title: "Cloud Platforms",
        summary: "AWS, GCP, Azure — the big three.",
        lessons: [
          { n: 195, slug: "iaas-paas-saas", title: "Cloud computing — IaaS vs. PaaS vs. SaaS" },
          { n: 196, slug: "aws-gcp-azure", title: "The big three" },
          { n: 197, slug: "aws-essentials", title: "EC2, S3, RDS, Lambda, CloudFront" },
          { n: 198, slug: "serverless", title: "What serverless is" },
          { n: 199, slug: "object-storage", title: "Object storage — S3" },
          { n: 200, slug: "cdn", title: "CDNs — why your app needs one" },
          { n: 201, slug: "vpc", title: "What a VPC is" },
        ],
      },
      {
        id: "7-4",
        title: "YAML & Configuration",
        summary: "Language 8 — the config language of infrastructure.",
        lessons: [
          { n: 202, slug: "what-yaml-is", title: "What YAML is" },
          { n: 203, slug: "yaml-syntax", title: "YAML syntax — indentation, lists, maps, anchors" },
          { n: 204, slug: "where-yaml-appears", title: "Where YAML appears" },
          { n: 205, slug: "reading-complex-yaml", title: "Reading a complex YAML file without getting lost" },
        ],
      },
      {
        id: "7-5",
        title: "CI/CD Pipelines",
        summary: "Automating the path from code to production.",
        lessons: [
          { n: 206, slug: "what-cicd-is", title: "What CI/CD is" },
          { n: 207, slug: "github-actions-deep", title: "GitHub Actions deep dive" },
          { n: 208, slug: "reading-workflows", title: "Reading a .github/workflows/ file" },
          { n: 209, slug: "automated-testing", title: "Automated testing in a pipeline" },
          { n: 210, slug: "deployment-strategies", title: "Deployment strategies — rolling, blue-green, canary" },
        ],
      },
      {
        id: "7-6",
        title: "Kubernetes",
        summary: "Container orchestration.",
        lessons: [
          { n: 211, slug: "what-k8s-is", title: "What Kubernetes is" },
          { n: 212, slug: "k8s-objects", title: "Pods, deployments, services" },
          { n: 213, slug: "kubectl", title: "kubectl — the commands you need" },
          { n: 214, slug: "k8s-manifest", title: "Reading a Kubernetes manifest" },
          { n: 215, slug: "helm", title: "Helm charts" },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  {
    id: "8",
    title: "Data, AI Integration & Advanced Patterns",
    tagline: "The patterns that show up in every AI-powered SaaS.",
    gate: "Read an AI agent codebase and explain the tool/memory/orchestration loop architecture.",
    accent: "phase",
    modules: [
      {
        id: "8-1",
        title: "Working with Data",
        summary: "ETL, formats, warehouses, schema design.",
        lessons: [
          { n: 216, slug: "etl", title: "What an ETL pipeline is" },
          { n: 217, slug: "data-formats", title: "CSV, JSON, Parquet" },
          { n: 218, slug: "warehouse-vs-transactional", title: "Data warehouse vs. transactional DB" },
          { n: 219, slug: "schema-design", title: "Basic data modeling" },
        ],
      },
      {
        id: "8-2",
        title: "AI & LLM Integration",
        summary: "The patterns behind every AI feature.",
        lessons: [
          { n: 220, slug: "llm-apis", title: "How LLM APIs work" },
          { n: 221, slug: "prompt-engineering-as-code", title: "Prompt engineering as code" },
          { n: 222, slug: "streaming", title: "Streaming responses" },
          { n: 223, slug: "embeddings", title: "What embeddings are" },
          { n: 224, slug: "vector-databases", title: "Vector databases — Pinecone, pgvector" },
          { n: 225, slug: "rag", title: "RAG — Retrieval Augmented Generation" },
          { n: 226, slug: "agent-architecture", title: "AI agent architecture — tools, memory, loops" },
          { n: 227, slug: "reading-agent-codebase", title: "Reading an AI agent codebase" },
        ],
      },
      {
        id: "8-3",
        title: "Advanced Architecture Patterns",
        summary: "Monoliths, queues, websockets, webhooks, jobs, proxies.",
        lessons: [
          { n: 228, slug: "monolith-vs-microservices", title: "Monolith vs. microservices" },
          { n: 229, slug: "message-queues", title: "Message queues — Redis Queue, RabbitMQ, SQS" },
          { n: 230, slug: "websockets", title: "WebSockets — real-time communication" },
          { n: 231, slug: "webhooks", title: "Webhooks — event-driven integration" },
          { n: 232, slug: "background-jobs", title: "Background jobs and workers" },
          { n: 233, slug: "reverse-proxy", title: "Reverse proxies — Nginx, Caddy" },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  {
    id: "9",
    title: "Security, Observability & Performance",
    tagline: "Production-readiness, the unsexy must-haves.",
    gate: "Run an OWASP Top 10 audit on any web app and read logs/metrics to diagnose an incident.",
    accent: "err",
    modules: [
      {
        id: "9-1",
        title: "Security",
        summary: "OWASP Top 10 and how attacks actually work.",
        lessons: [
          { n: 234, slug: "owasp-top-10", title: "The OWASP Top 10" },
          { n: 235, slug: "sql-injection", title: "SQL injection — what it is and how to prevent it" },
          { n: 236, slug: "xss-csrf", title: "XSS and CSRF — frontend attack vectors" },
          { n: 237, slug: "secrets-mgmt", title: "Secrets management — vaults, never in code" },
          { n: 238, slug: "https-tls", title: "HTTPS, TLS, certificates" },
        ],
      },
      {
        id: "9-2",
        title: "Observability",
        summary: "How you know what's happening in production.",
        lessons: [
          { n: 239, slug: "logging-monitoring-alerting", title: "Logging vs. monitoring vs. alerting" },
          { n: 240, slug: "structured-logging", title: "Structured logging" },
          { n: 241, slug: "metrics", title: "Application metrics — latency, error rate, throughput" },
          { n: 242, slug: "distributed-tracing", title: "Distributed tracing" },
          { n: 243, slug: "observability-tools", title: "Datadog, Grafana, Sentry, PagerDuty" },
        ],
      },
      {
        id: "9-3",
        title: "Performance",
        summary: "Latency, throughput, caching, load testing.",
        lessons: [
          { n: 244, slug: "latency-vs-throughput", title: "Latency vs. throughput" },
          { n: 245, slug: "query-optimization", title: "Query optimization — indexes, EXPLAIN, N+1" },
          { n: 246, slug: "caching-strategies", title: "Caching strategies" },
          { n: 247, slug: "load-testing", title: "Load testing" },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  {
    id: "10",
    title: "The Orchestrator Layer",
    tagline: "Putting it all together. The whole point.",
    gate: "Take an AI-generated PR and produce a senior-engineer-quality review in under 30 minutes.",
    accent: "ok",
    modules: [
      {
        id: "10-1",
        title: "Reading Any Codebase",
        summary: "Walking into unfamiliar code with a method.",
        lessons: [
          { n: 248, slug: "approaching-a-codebase", title: "How to approach an unfamiliar project — the 10-step method" },
          { n: 249, slug: "reading-backend", title: "Reading a backend codebase" },
          { n: 250, slug: "reading-frontend", title: "Reading a frontend codebase" },
          { n: 251, slug: "reading-infra", title: "Reading infrastructure code" },
          { n: 252, slug: "reviewing-ai-code", title: "What to look for in AI-generated code" },
        ],
      },
      {
        id: "10-2",
        title: "Technical Decision Making",
        summary: "Choosing stacks, build-vs-buy, debt, estimates.",
        lessons: [
          { n: 253, slug: "choosing-a-stack", title: "How to choose a tech stack" },
          { n: 254, slug: "build-vs-buy", title: "Build vs. buy" },
          { n: 255, slug: "technical-debt", title: "Technical debt" },
          { n: 256, slug: "estimating", title: "Estimating complexity" },
        ],
      },
      {
        id: "10-3",
        title: "Directing AI Agents",
        summary: "The orchestrator's craft.",
        lessons: [
          { n: 257, slug: "writing-prompts", title: "Writing precise technical prompts" },
          { n: 258, slug: "technical-briefs", title: "How to write a brief an agent can execute" },
          { n: 259, slug: "reviewing-ai-output", title: "The expert's review checklist" },
          { n: 260, slug: "common-ai-mistakes", title: "Catching common AI agent mistakes" },
          { n: 261, slug: "pushing-back", title: "When to push back on an agent's choice" },
        ],
      },
      {
        id: "10-4",
        title: "Capstone",
        summary: "Auditing a real project end to end.",
        lessons: [
          { n: 262, slug: "saas-walkthrough", title: "Full SaaS codebase walkthrough" },
          { n: 263, slug: "audit-exercise", title: "Finding real issues in an AI-generated project" },
          { n: 264, slug: "review-framework", title: "Building your personal technical review framework" },
        ],
      },
    ],
  },
];

/**
 * Flattened list of every lesson with its phase/module coordinates.
 * Used by the lesson player to find prev/next and resolve URLs.
 */
export interface FlatLesson {
  n: number;
  slug: string;
  title: string;
  phaseId: string;
  phaseTitle: string;
  moduleId: string;
  moduleTitle: string;
  authored: boolean;
}

export const allLessons: FlatLesson[] = curriculum.flatMap((phase) =>
  phase.modules.flatMap((module) =>
    module.lessons.map((lesson) => ({
      n: lesson.n,
      slug: lesson.slug,
      title: lesson.title,
      phaseId: phase.id,
      phaseTitle: phase.title,
      moduleId: module.id,
      moduleTitle: module.title,
      authored: !!lesson.authored,
    })),
  ),
);

export const TOTAL_LESSONS = allLessons.length;

export function findLesson(phaseId: string, moduleId: string, slug: string) {
  return allLessons.find(
    (l) => l.phaseId === phaseId && l.moduleId === moduleId && l.slug === slug,
  );
}

export function findLessonByN(n: number) {
  return allLessons.find((l) => l.n === n);
}

export function findPhase(phaseId: string) {
  return curriculum.find((p) => p.id === phaseId);
}

export function findModule(phaseId: string, moduleId: string) {
  return findPhase(phaseId)?.modules.find((m) => m.id === moduleId);
}

export function getNextLesson(n: number) {
  return allLessons.find((l) => l.n === n + 1);
}

export function getPrevLesson(n: number) {
  return allLessons.find((l) => l.n === n - 1);
}
