import { LayerSection } from "@/components/lesson/LayerSection";
import { ConceptCard } from "@/components/interactive/ConceptCard";
import { AnnotatedCode } from "@/components/interactive/AnnotatedCode";
import { AntiPattern } from "@/components/interactive/AntiPattern";
import { WhereYoullSeeThis } from "@/components/interactive/WhereYoullSeeThis";
import { MasteryCheck } from "@/components/interactive/MasteryCheck";

export default function Lesson32() {
  return (
    <>
      <LayerSection layer="why">
        <p>
          The single most common AI-agent security incident is "an
          environment file or build artifact ended up in Git." A correct
          <code> .gitignore</code> prevents that disaster. This is a
          three-minute lesson with a 100x payoff.
        </p>
      </LayerSection>

      <LayerSection layer="model">
        <ConceptCard
          front={<>What is .gitignore?</>}
          back={
            <p className="text-center text-lg">
              A file at the root of a Git repo that lists patterns Git should{" "}
              <strong>never track</strong>. Files matching these patterns are
              invisible to <code>git add</code>, never appear in commits, never
              propagate to other developers.
            </p>
          }
        />
      </LayerSection>

      <LayerSection layer="concept">
        <h2>A realistic .gitignore for a Node project</h2>
        <AnnotatedCode
          filename=".gitignore"
          lines={[
            { code: "# dependencies",                  note: "comments start with #" },
            { code: "node_modules/",                   note: "always — recreatable from package-lock" },
            { code: "",                                note: "" },
            { code: "# build output",                  note: "" },
            { code: ".next/",                          note: "Next.js" },
            { code: "dist/",                           note: "common build folder" },
            { code: "build/",                          note: "common build folder" },
            { code: "*.tsbuildinfo",                   note: "TS incremental build cache" },
            { code: "",                                note: "" },
            { code: "# secrets — CRITICAL",            note: "" },
            { code: ".env",                            note: "primary local secrets" },
            { code: ".env.*.local",                    note: "Next.js per-env locals" },
            { code: "",                                note: "" },
            { code: "# editor",                        note: "" },
            { code: ".vscode/",                        note: "per-developer settings" },
            { code: ".idea/",                          note: "JetBrains" },
            { code: "",                                note: "" },
            { code: "# OS",                            note: "" },
            { code: ".DS_Store",                       note: "macOS" },
            { code: "Thumbs.db",                       note: "Windows" },
            { code: "",                                note: "" },
            { code: "# logs and caches",               note: "" },
            { code: "npm-debug.log*",                  note: "" },
            { code: "coverage/",                       note: "test coverage reports" },
          ]}
        />

        <h2>Pattern syntax — five things to know</h2>
        <ul>
          <li><code>name</code> — matches files named exactly "name" anywhere in the repo.</li>
          <li><code>name/</code> — matches a directory named "name".</li>
          <li><code>*.log</code> — wildcard: any file ending in <code>.log</code>.</li>
          <li><code>build/</code> — entire <code>build</code> directory anywhere.</li>
          <li><code>!important.log</code> — bang means "actually keep this one" — un-ignore.</li>
        </ul>

        <h2>The four categories of things you ALWAYS gitignore</h2>
        <ol>
          <li>
            <strong>Dependencies</strong> — <code>node_modules/</code>,{" "}
            <code>vendor/</code>, <code>.venv/</code>. Recreatable from a
            lockfile.
          </li>
          <li>
            <strong>Build output</strong> — <code>.next/</code>,{" "}
            <code>dist/</code>, <code>build/</code>. Regenerable from source.
          </li>
          <li>
            <strong>Secrets &amp; environment files</strong> —{" "}
            <code>.env</code>, <code>.env.local</code>, anything containing
            keys.
          </li>
          <li>
            <strong>Local-only files</strong> — OS detritus (<code>.DS_Store</code>),
            editor config (<code>.vscode/</code>), logs.
          </li>
        </ol>

        <h2>The hardest gitignore gotcha</h2>
        <p>
          <code>.gitignore</code> only affects <strong>untracked</strong>{" "}
          files. If you've already committed a file, adding it to .gitignore
          does NOT remove it from history. To stop tracking a file already
          in the repo:
        </p>
        <pre>{`git rm --cached .env
git commit -m "stop tracking .env"`}</pre>
        <p>
          The file stays on disk; Git just forgets about it. Add it to
          .gitignore so it doesn't come back.
        </p>

        <h2>The "secret in Git history" disaster</h2>
        <p>
          If a secret was ever committed — even one commit, even years ago —{" "}
          <strong>assume it's compromised and rotate the key</strong>. Removing
          it from <em>future</em> commits doesn't matter; anyone with the repo
          can <code>git log -S "&lt;secret&gt;"</code> and find it in history.
          Specialized tools exist to scrub history, but you must rotate first.
        </p>

        <h2>Use gitignore.io / framework defaults</h2>
        <p>
          The site <code>gitignore.io</code> generates a sensible{" "}
          <code>.gitignore</code> for any combination of frameworks. Every
          scaffolder (create-next-app, Vite, etc.) drops in a reasonable one.
          Start from those — never write from scratch.
        </p>
      </LayerSection>

      <LayerSection layer="context">
        <WhereYoullSeeThis
          items={[
            { file: ".gitignore at the project root", context: "Almost every repo has one. The first file an orchestrator should read." },
            { context: "GitHub's secret scanner emails you 'your AWS key was found in repo X' — too late. Rotate immediately." },
            { file: "git rm --cached <file>", context: "The fix for 'I accidentally committed something and added it to .gitignore but it's still tracked.'" },
            { context: "An agent says 'I'll add this to .gitignore' — make sure the file isn't already committed first." },
            { file: ".gitignore inside subfolders", context: "Subfolder .gitignores override the root for that folder. Common in monorepos." },
          ]}
        />

        <AntiPattern
          bad={{
            title: "Adding `.gitignore` AFTER the first commit",
            body: (
              <>
                The agent runs <code>git init</code>, then{" "}
                <code>git add . &amp;&amp; git commit</code> — sweeping in{" "}
                <code>node_modules/</code> (200MB) and the <code>.env</code>{" "}
                file containing live API keys. Adding .gitignore later doesn't
                un-commit them.
              </>
            ),
          }}
          good={{
            title: "Write .gitignore BEFORE the first commit",
            body: (
              <>
                Step 1: <code>git init</code>. Step 2: create{" "}
                <code>.gitignore</code> with at minimum{" "}
                <code>node_modules/</code> and <code>.env</code>. Step 3:
                everything else. This is the only safe order.
              </>
            ),
          }}
          why={
            <>
              Committed files are permanent. Once a secret is in even one
              commit, you have to rotate the key. Avoid the rotate-and-panic
              dance by writing .gitignore first.
            </>
          }
        />
      </LayerSection>

      <LayerSection layer="gate">
        <MasteryCheck
          lessonN={32}
          questions={[
            {
              kind: "mcq",
              prompt: "What does .gitignore do?",
              options: [
                "Encrypts files.",
                "Lists patterns of files that Git should never track. Matching files don't appear in `git status`, `git add`, or commits.",
                "Compresses the repo.",
                "Renames files.",
              ],
              answer: 1,
              explanation: "Tell Git 'pretend these don't exist.' One file, big impact.",
            },
            {
              kind: "multi",
              prompt:
                "Which of these belong in a Node project's .gitignore?",
              options: [
                "node_modules/",
                ".env",
                "package.json",
                ".next/",
                ".DS_Store",
                "src/",
              ],
              answer: [0, 1, 3, 4],
              explanation:
                "Deps, secrets, build output, OS files. package.json and src are SOURCE — always committed.",
            },
            {
              kind: "mcq",
              prompt:
                "You accidentally committed `.env` last week. You add it to .gitignore now. What's the state of things?",
              options: [
                ".env is gone from the repo.",
                ".env is still in Git history. .gitignore only affects UNTRACKED files. You must `git rm --cached .env`, commit, AND rotate every secret in it (assume leaked).",
                "Git auto-removes it.",
                "It's fine.",
              ],
              answer: 1,
              explanation:
                "Secrets ever committed = compromised. Rotate. Then stop tracking with git rm --cached.",
            },
            {
              kind: "fill",
              prompt:
                "What single character (placed at the start of a .gitignore pattern) means 'actually keep this — un-ignore'?",
              answers: ["!", "exclamation"],
              placeholder: "one character",
              explanation:
                "`!` un-ignores. E.g. ignore *.log but keep important.log.",
            },
            {
              kind: "mcq",
              prompt:
                "Your AI agent initializes a project and immediately runs `git add . && git commit -m \"initial\"` without creating a .gitignore first. What likely just happened?",
              options: [
                "Nothing — clean start.",
                "node_modules/ (hundreds of MB) and possibly .env (with secrets) got committed. Add .gitignore, run `git rm --cached`, rotate any leaked keys.",
                "The commit was rejected.",
                "Git auto-ignored everything dangerous.",
              ],
              answer: 1,
              explanation:
                "The most common AI-agent setup mistake. Always: init → .gitignore → everything else.",
            },
          ]}
        />

        <div className="mt-8 panel rounded-sm panel-bracketed p-6">
          <div className="marker mb-2">module 1.1 capstone</div>
          <h3 className="text-lg font-semibold text-ink mb-3">
            Git Core complete.
          </h3>
          <p className="text-ink-dim leading-relaxed">
            You now understand what version control is, how Git stores
            history (three areas + commit graph), how to start a repo, how to
            read history, what branches actually are, the standard branch
            workflow, how to resolve conflicts, and how to keep secrets and
            junk out of your repo.
          </p>
          <p className="text-ink-dim leading-relaxed mt-3">
            Next module: <strong>1.2 — GitHub</strong>. Pushing, pulling,
            pull requests, code review, and how CI/CD attaches to a repo.
          </p>
        </div>
      </LayerSection>
    </>
  );
}
