import { LayerSection } from "@/components/lesson/LayerSection";
import { ConceptCard } from "@/components/interactive/ConceptCard";
import { FileTree } from "@/components/interactive/FileTree";
import { AntiPattern } from "@/components/interactive/AntiPattern";
import { WhereYoullSeeThis } from "@/components/interactive/WhereYoullSeeThis";
import { MasteryCheck } from "@/components/interactive/MasteryCheck";

export default function Lesson20() {
  return (
    <>
      <LayerSection layer="why">
        <p>
          You said this is your biggest pain point. Every AI-built project
          generates dozens of files you can't navigate. This lesson and the
          four that follow give you a complete map. By the end of the module,
          you can open <em>any</em> repo and know what each file is for.
        </p>
      </LayerSection>

      <LayerSection layer="model">
        <ConceptCard
          front={<>What IS a software project, structurally?</>}
          back={
            <p className="text-center text-lg">
              A folder of files in <strong>four categories</strong>:<br />
              <strong>source code · config · dependencies · build artifacts</strong>.
              Plus docs, secrets, and CI. Once you can sort every file into
              one of those buckets, no project is mysterious anymore.
            </p>
          }
        />

        <div className="my-6">
          <FileTree
            caption="A typical Next.js + Postgres + Docker SaaS project. Each file color-coded by category. We'll go file-by-file in lesson 21."
            root={{
              name: "my-saas/", kind: "dir", children: [
                { name: "README.md", kind: "doc", role: "front page — what this is, how to run it" },
                { name: ".gitignore", kind: "config", role: "what Git should never commit" },
                { name: ".env.example", kind: "config", role: "documents required env vars (no real values)" },
                { name: ".env", kind: "secret", role: "your local secrets — NEVER committed" },
                { name: "package.json", kind: "config", role: "Node manifest — name, scripts, dependencies" },
                { name: "package-lock.json", kind: "config", role: "exact versions, auto-generated" },
                { name: "node_modules/", kind: "ignore", role: "installed dependencies — gitignored, recreated by npm install" },
                { name: "tsconfig.json", kind: "config", role: "TypeScript compiler settings" },
                { name: "tailwind.config.ts", kind: "config", role: "Tailwind theme + scan paths" },
                { name: "next.config.mjs", kind: "config", role: "Next.js build/runtime settings" },
                { name: "Dockerfile", kind: "config", role: "recipe to build a container image" },
                { name: "docker-compose.yml", kind: "config", role: "multi-service local dev (app + DB)" },
                { name: ".github/", kind: "dir", role: "GitHub config", children: [
                  { name: "workflows/", kind: "dir", children: [
                    { name: "ci.yml", kind: "config", role: "tests run on every PR" },
                  ]},
                ]},
                { name: "prisma/", kind: "dir", role: "database schema + migrations", children: [
                  { name: "schema.prisma", kind: "config", role: "every table, field, relationship" },
                  { name: "migrations/", kind: "dir", role: "timestamped SQL migrations" },
                ]},
                { name: "app/", kind: "dir", role: "Next.js source — pages, layouts, API routes", children: [
                  { name: "layout.tsx", kind: "code" },
                  { name: "page.tsx", kind: "code" },
                  { name: "api/", kind: "dir", children: [{ name: "users/route.ts", kind: "code" }] },
                ]},
                { name: "components/", kind: "dir", role: "reusable React components", children: [] },
                { name: "lib/", kind: "dir", role: "shared utilities, DB clients, helpers", children: [] },
                { name: "public/", kind: "dir", role: "static files served as-is", children: [] },
                { name: ".next/", kind: "ignore", role: "build output — gitignored" },
              ],
            }}
          />
        </div>
      </LayerSection>

      <LayerSection layer="concept">
        <h2>The four categories</h2>

        <h3>1. Source code</h3>
        <p>
          The files YOU (or your AI agent) write. <code>.tsx</code>, <code>.ts</code>,
          <code> .py</code>, <code>.go</code>, <code>.css</code> — anything that
          contains the application's logic. These live in folders like{" "}
          <code>app/</code>, <code>src/</code>, <code>components/</code>,{" "}
          <code>lib/</code>.
        </p>

        <h3>2. Configuration</h3>
        <p>
          Files that tell tools how to behave. <code>package.json</code>{" "}
          (npm), <code>tsconfig.json</code> (TypeScript), <code>tailwind.config.ts</code>{" "}
          (Tailwind), <code>next.config.mjs</code> (Next.js),{" "}
          <code>Dockerfile</code> (Docker), <code>.github/workflows/*.yml</code>{" "}
          (CI). Usually 5-15 of these in a real project.
        </p>

        <h3>3. Dependencies</h3>
        <p>
          External libraries your project uses. <code>node_modules/</code>{" "}
          for JS, <code>venv/</code> for Python. Always gitignored. Always
          recreatable from a manifest (<code>package.json</code>, <code>requirements.txt</code>).
          Bigger than your source code, usually by 100x.
        </p>

        <h3>4. Build artifacts</h3>
        <p>
          Files produced when you run a build step. <code>.next/</code> (Next.js
          build output), <code>dist/</code>, <code>build/</code>,{" "}
          <code>__pycache__/</code>. Always gitignored. Always regenerable.
        </p>

        <h2>The two more you'll see in every real project</h2>
        <ul>
          <li>
            <strong>Documentation</strong> — <code>README.md</code>,{" "}
            <code>CONTRIBUTING.md</code>, <code>docs/</code>. Human-readable
            explanation of what this is.
          </li>
          <li>
            <strong>Secrets / environment</strong> — <code>.env</code>{" "}
            (gitignored) for local secrets, <code>.env.example</code>{" "}
            (committed) listing what variables exist.
          </li>
        </ul>

        <h2>The 10-step method for any new project</h2>
        <ol>
          <li>Read <code>README.md</code> first. Always.</li>
          <li>Look at <code>package.json</code> (or equivalent). What scripts? What deps?</li>
          <li>Look at <code>.env.example</code>. What environment variables exist?</li>
          <li>Look at top-level config files. What's enforced (TypeScript strict? linter? formatter?)</li>
          <li>Look at <code>.github/workflows/</code>. What runs on every change?</li>
          <li>Look at the <code>app/</code> or <code>src/</code> folder structure.</li>
          <li>Find the entry point (often <code>index.ts</code>, <code>app/page.tsx</code>, <code>main.py</code>).</li>
          <li>Look at the database schema if one exists (<code>prisma/schema.prisma</code>, migrations).</li>
          <li>Look at the Dockerfile or deploy config. How is this shipped?</li>
          <li>Find one or two test files. They show the intended use of the code.</li>
        </ol>
        <p>
          This 10-step pass takes about 15 minutes and gives you 80% of the
          project's shape. You will run it on every AI-generated repo you ever
          inherit.
        </p>
      </LayerSection>

      <LayerSection layer="context">
        <WhereYoullSeeThis
          items={[
            { context: "Open any GitHub repo. The root has all the files above. This pattern is universal." },
            { context: "Your AI agent says 'I've initialized the project' — that's all these config files appearing at once." },
            { context: "When `git clone` is followed by `npm install` then `cp .env.example .env` then `npm run dev` — those are steps 2, 3, and the dev run from this lesson's 10-step method." },
            { file: "monorepo/apps/* + packages/*", context: "Big projects are sometimes monorepos — same categories, but each app/package has its own set." },
          ]}
        />

        <AntiPattern
          bad={{
            title: "AI agent puts everything in the root folder",
            body: (
              <>
                100 random <code>.ts</code> files at the project root, no{" "}
                <code>src/</code> or <code>components/</code>. Navigating
                becomes guessing. Refactoring is painful.
              </>
            ),
          }}
          good={{
            title: "Folder structure follows responsibility",
            body: (
              <>
                Source under <code>app/</code> or <code>src/</code>. Reusable
                pieces under <code>components/</code>. Utilities under{" "}
                <code>lib/</code>. Tests under <code>__tests__/</code> or
                next to source. Config files at the root.
              </>
            ),
          }}
          why={
            <>
              A flat project is hard to read for humans AND for future AI
              agents. Structure is documentation. Push back on any agent
              that doesn't impose any.
            </>
          }
        />
      </LayerSection>

      <LayerSection layer="gate">
        <MasteryCheck
          lessonN={20}
          questions={[
            {
              kind: "multi",
              prompt: "Which of these belong in a `.gitignore` for a Node project?",
              options: [
                "node_modules/",
                ".env",
                "package.json",
                ".next/",
                "tsconfig.json",
                ".DS_Store",
              ],
              answer: [0, 1, 3, 5],
              explanation:
                "node_modules (deps), .env (secrets), .next (build output), .DS_Store (OS file) — all ignored. package.json and tsconfig are config, always committed.",
            },
            {
              kind: "mcq",
              prompt: "What category does `package.json` fall into?",
              options: ["Source code", "Configuration", "Dependencies", "Build artifact"],
              answer: 1,
              explanation:
                "It's the Node project's config / manifest. Lists dependencies but isn't itself a dependency.",
            },
            {
              kind: "mcq",
              prompt: "What's the role of `.env.example`?",
              options: [
                "An empty file.",
                "A committed file listing which env vars the project needs (no real values) — so new developers know what to fill in.",
                "A backup of the real .env.",
                "Documentation for Node.",
              ],
              answer: 1,
              explanation:
                ".env.example is committed. .env is not. Together they document the contract without leaking secrets.",
            },
            {
              kind: "fill",
              prompt:
                "Which file should you read FIRST when opening any new project?",
              answers: ["README.md", "README", "readme", "readme.md"],
              explanation: "Always start with the README. It's the front page.",
            },
            {
              kind: "mcq",
              prompt:
                "You open a new AI-generated repo. Apart from README, what are the most useful next two files to look at?",
              options: [
                "node_modules and .next",
                "package.json (to see scripts and deps) and .env.example (to know what env vars are needed)",
                "every .tsx file in order",
                "package-lock.json",
              ],
              answer: 1,
              explanation:
                "Scripts in package.json show how to run it. .env.example shows what config it needs. These two answer most onboarding questions.",
            },
          ]}
        />
      </LayerSection>
    </>
  );
}
