import { LayerSection } from "@/components/lesson/LayerSection";
import { ConceptCard } from "@/components/interactive/ConceptCard";
import { AntiPattern } from "@/components/interactive/AntiPattern";
import { WhereYoullSeeThis } from "@/components/interactive/WhereYoullSeeThis";
import { MasteryCheck } from "@/components/interactive/MasteryCheck";

export default function Lesson21() {
  return (
    <>
      <LayerSection layer="why">
        <p>
          This is the lesson that solves your stated pain point. By the end of
          it, you'll be able to name the role of every common project file on
          sight. From here, you can also use the <strong>File Anatomy
          Inspector</strong> (tools menu) to look up anything not yet
          memorized.
        </p>
      </LayerSection>

      <LayerSection layer="model">
        <ConceptCard
          front={<>How do you remember what every file in a project is for?</>}
          back={
            <p className="text-center text-lg">
              For each file, ask <strong>four questions</strong>:<br />
              Who made it? Is it data, config, or generated? Should I read it?
              Should I edit it?
            </p>
          }
        />
      </LayerSection>

      <LayerSection layer="concept">
        <h2>The taxonomy</h2>
        <p>
          Every file in a Node/Next.js project falls into one of these buckets:
        </p>

        <h3>📘 Manifests &amp; lockfiles</h3>
        <ul>
          <li><code>package.json</code> — the project manifest. Read often. Edit deliberately.</li>
          <li><code>package-lock.json</code> / <code>yarn.lock</code> / <code>pnpm-lock.yaml</code> — locks exact versions. Auto-generated. Never edit by hand. Always commit.</li>
        </ul>

        <h3>⚙️ Tool configs</h3>
        <ul>
          <li><code>tsconfig.json</code> — TypeScript compiler.</li>
          <li><code>next.config.mjs</code> — Next.js framework.</li>
          <li><code>tailwind.config.ts</code> — Tailwind theme + content paths.</li>
          <li><code>postcss.config.mjs</code> — PostCSS pipeline.</li>
          <li><code>eslint.config.mjs</code> / <code>.eslintrc</code> — linting rules.</li>
          <li><code>.prettierrc</code> — formatting rules.</li>
          <li><code>vitest.config.ts</code> / <code>jest.config.js</code> — test runners.</li>
        </ul>

        <h3>📝 Documentation</h3>
        <ul>
          <li><code>README.md</code> — the front page.</li>
          <li><code>CONTRIBUTING.md</code> — how to contribute.</li>
          <li><code>LICENSE</code> — legal license. Critical for open source.</li>
          <li><code>CHANGELOG.md</code> — release notes.</li>
        </ul>

        <h3>🔐 Secrets &amp; environment</h3>
        <ul>
          <li><code>.env</code> — your local secrets. Never committed.</li>
          <li><code>.env.local</code> — same; a Next.js convention.</li>
          <li><code>.env.example</code> — committed, no real values, lists required keys.</li>
        </ul>

        <h3>🛠 Build &amp; deploy</h3>
        <ul>
          <li><code>Dockerfile</code> — recipe for a container image.</li>
          <li><code>docker-compose.yml</code> — multi-service local stack.</li>
          <li><code>.github/workflows/*.yml</code> — CI/CD pipelines.</li>
          <li><code>vercel.json</code>, <code>netlify.toml</code>, <code>fly.toml</code> — host-specific configs.</li>
        </ul>

        <h3>🚫 Things that should be in .gitignore</h3>
        <ul>
          <li><code>node_modules/</code> — installed deps. Recreated by <code>npm install</code>.</li>
          <li><code>.next/</code>, <code>dist/</code>, <code>build/</code> — build output.</li>
          <li><code>.env</code> and friends — secrets.</li>
          <li><code>.DS_Store</code> (macOS), <code>Thumbs.db</code> (Windows) — OS files.</li>
          <li><code>.vscode/</code>, <code>.idea/</code> — editor configs (usually).</li>
          <li><code>coverage/</code> — test coverage reports.</li>
        </ul>

        <h3>📂 Source code layout (conventions, not laws)</h3>
        <ul>
          <li><code>app/</code> — Next.js App Router pages, layouts, API routes.</li>
          <li><code>src/</code> — general source root (older Next.js, Vite, generic).</li>
          <li><code>components/</code> — reusable React components.</li>
          <li><code>lib/</code> or <code>utils/</code> — shared helpers, clients, types.</li>
          <li><code>hooks/</code> — custom React hooks.</li>
          <li><code>styles/</code> — CSS files.</li>
          <li><code>public/</code> — static assets served as-is.</li>
          <li><code>tests/</code> or <code>__tests__/</code> — automated tests.</li>
        </ul>

        <h2>Use the File Anatomy Inspector</h2>
        <p>
          The Inspector (Tools → File Anatomy) knows ~200 common files and
          tells you for each: role, who created it, whether to read/edit, and
          what to ask your AI agent. Paste any project tree into it.
        </p>
      </LayerSection>

      <LayerSection layer="context">
        <WhereYoullSeeThis
          items={[
            { context: "Every Next.js repo on GitHub starts with most of these files in the same places. The pattern is industry-standard." },
            { file: ".vscode/settings.json", context: "Per-project editor settings. Sometimes committed (when shared), often gitignored (per-developer)." },
            { file: "yarn.lock vs package-lock.json", context: "Different package managers, same purpose — pin exact versions. A project should have ONE, not both." },
            { context: "An agent says 'add this file at the root' — it's almost certainly a config file. New configs at the root, new code in app/ or src/." },
          ]}
        />

        <AntiPattern
          bad={{
            title: "Committing the lockfile inconsistently",
            body: (
              <>
                The agent has <code>package-lock.json</code> in some commits
                but not others. Different machines install different
                versions. "Works on my machine" returns with a vengeance.
              </>
            ),
          }}
          good={{
            title: "Always commit the lockfile",
            body: (
              <>
                <code>package-lock.json</code> is the source of truth for
                versions. Without it, `npm install` picks the latest matching
                range, which drifts over time and across machines.
              </>
            ),
          }}
          why={
            <>
              The whole point of a lockfile is reproducibility. Without one,
              every install is a roll of the dice. Production should use the
              same versions you tested in dev — the lockfile is how.
            </>
          }
        />
      </LayerSection>

      <LayerSection layer="gate">
        <MasteryCheck
          lessonN={21}
          questions={[
            {
              kind: "mcq",
              prompt: "What's `package-lock.json` for?",
              options: [
                "Locks the file so it can't be edited.",
                "Records the exact versions of every dependency (and transitive dep) that was installed. Ensures reproducible installs across machines.",
                "Is a backup of package.json.",
                "Is encrypted.",
              ],
              answer: 1,
              explanation:
                "Always commit it. Never edit by hand. Same versions everywhere = no 'works on my machine'.",
            },
            {
              kind: "multi",
              prompt: "Which files should ALWAYS be gitignored?",
              options: [
                "node_modules/",
                ".env",
                "package-lock.json",
                ".next/",
                "Dockerfile",
              ],
              answer: [0, 1, 3],
              explanation:
                "Deps (recreatable), secrets (security), build output (recreatable). package-lock and Dockerfile are committed.",
            },
            {
              kind: "mcq",
              prompt: "What goes in `.env.example`?",
              options: [
                "Your real production secrets.",
                "An empty file as a placeholder.",
                "The list of env var NAMES the project needs (with example or placeholder values, never real ones), so new developers know what to fill in.",
                "A backup of your local .env.",
              ],
              answer: 2,
              explanation:
                "Documentation of the env contract. Commit it. Real values go in .env (gitignored).",
            },
            {
              kind: "fill",
              prompt:
                "What's the folder where Next.js builds compile to? (You'll see it in .gitignore.)",
              answers: [".next", ".next/"],
              explanation: ".next/ is the build output. Always gitignored.",
            },
            {
              kind: "mcq",
              prompt:
                "Your AI agent has BOTH `yarn.lock` and `package-lock.json` in the repo. What's the issue?",
              options: [
                "Two backups is good.",
                "The project should pick ONE package manager. Having both means different developers get different installs depending on which command they run.",
                "Lockfiles auto-merge.",
                "It's fine.",
              ],
              answer: 1,
              explanation:
                "Pick one: npm + package-lock, OR yarn + yarn.lock, OR pnpm + pnpm-lock.yaml. Delete the others.",
            },
          ]}
        />
      </LayerSection>
    </>
  );
}
