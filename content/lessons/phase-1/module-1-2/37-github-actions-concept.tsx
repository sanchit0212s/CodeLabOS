import { LayerSection } from "@/components/lesson/LayerSection";
import { ConceptCard } from "@/components/interactive/ConceptCard";
import { AnnotatedCode } from "@/components/interactive/AnnotatedCode";
import { Diagram, DBox, DArrow } from "@/components/interactive/Diagram";
import { AntiPattern } from "@/components/interactive/AntiPattern";
import { WhereYoullSeeThis } from "@/components/interactive/WhereYoullSeeThis";
import { MasteryCheck } from "@/components/interactive/MasteryCheck";

export default function Lesson37() {
  return (
    <>
      <LayerSection layer="why">
        <p>
          Every serious repo has automation that runs on every push and PR.
          Tests, linters, type checks, build verification, sometimes
          deploys. That's CI/CD, and on GitHub it lives inside{" "}
          <code>.github/workflows/</code>. This lesson gives you the
          conceptual model. Phase 7 goes deep on writing workflows; here
          you only need to be able to read one and answer "what runs when?"
        </p>
      </LayerSection>

      <LayerSection layer="model">
        <ConceptCard
          front={<>What is CI/CD, in one sentence?</>}
          back={
            <p className="text-center text-lg">
              <strong>CI</strong> (Continuous Integration) =
              auto-run tests + checks on every change.{" "}
              <strong>CD</strong> (Continuous Delivery/Deployment) =
              auto-ship changes through to staging or production. Together
              they're the conveyor belt from "I pushed a commit" to "it's
              live."
            </p>
          }
        />

        <Diagram caption="The conveyor belt. Every push triggers a workflow. Each step can pass or fail. The PR shows green checks when everything passes.">
          <div className="flex items-center gap-3 flex-wrap justify-center">
            <DBox label="git push" tone="accent" />
            <DArrow direction="right" />
            <DBox label="install deps" tone="info" sub="step 1" />
            <DArrow direction="right" />
            <DBox label="lint" tone="info" sub="step 2" />
            <DArrow direction="right" />
            <DBox label="type-check" tone="info" sub="step 3" />
            <DArrow direction="right" />
            <DBox label="test" tone="info" sub="step 4" />
            <DArrow direction="right" />
            <DBox label="✓ merge gate" tone="accent" />
          </div>
        </Diagram>
      </LayerSection>

      <LayerSection layer="concept">
        <h2>Where it lives</h2>
        <p>
          GitHub Actions workflows are YAML files inside the special folder{" "}
          <code>.github/workflows/</code> at the root of your repo. Each
          file describes one workflow. Common names:{" "}
          <code>ci.yml</code>, <code>test.yml</code>, <code>deploy.yml</code>.
        </p>

        <h2>A workflow's four pieces</h2>
        <AnnotatedCode
          filename=".github/workflows/ci.yml"
          lines={[
            { code: "name: CI",                                            note: "human-readable name" },
            { code: "",                                                    note: "" },
            { code: "on:",                                                 note: "1. TRIGGERS — when does this run?" },
            { code: "  push:",                                             note: "" },
            { code: "    branches: [main]",                                note: "on any push to main" },
            { code: "  pull_request:",                                     note: "" },
            { code: "    branches: [main]",                                note: "and every PR targeting main" },
            { code: "",                                                    note: "" },
            { code: "jobs:",                                               note: "2. JOBS — parallelizable units" },
            { code: "  test:",                                             note: "job name" },
            { code: "    runs-on: ubuntu-latest",                          note: "3. RUNNER — what machine" },
            { code: "    steps:",                                          note: "4. STEPS — what to do, in order" },
            { code: "      - uses: actions/checkout@v4",                   note: "clone the repo" },
            { code: "      - uses: actions/setup-node@v4",                 note: "install Node.js" },
            { code: "        with:",                                       note: "" },
            { code: "          node-version: '22'",                        note: "version 22" },
            { code: "      - run: npm ci",                                 note: "install deps" },
            { code: "      - run: npm run lint",                           note: "lint" },
            { code: "      - run: npm run type-check",                     note: "type-check" },
            { code: "      - run: npm test",                               note: "run tests" },
            { code: "      - run: npm run build",                          note: "verify it builds" },
          ]}
        />

        <h2>The four pieces, named</h2>
        <ol>
          <li>
            <strong>Trigger</strong> (<code>on:</code>) — when does this
            workflow run? On push? On PR? On schedule? Manual?
          </li>
          <li>
            <strong>Jobs</strong> — independent units that run in parallel
            on separate machines. One workflow can have many jobs.
          </li>
          <li>
            <strong>Runner</strong> (<code>runs-on:</code>) — what kind of
            machine. <code>ubuntu-latest</code> is the default;{" "}
            <code>macos-latest</code> and <code>windows-latest</code> exist
            too.
          </li>
          <li>
            <strong>Steps</strong> — sequential commands inside a job. Each
            step is either a <code>uses:</code> (a reusable action from the
            marketplace) or a <code>run:</code> (a raw shell command).
          </li>
        </ol>

        <h2>What a step looks like in the UI</h2>
        <p>
          When the workflow runs, GitHub's Actions tab shows each step with
          a green check (✓) or red X (✕). Clicking opens the live (or
          replayed) output — exactly what you'd see in your terminal,
          searchable.
        </p>

        <h2>The most common workflows you'll see</h2>
        <ul>
          <li>
            <strong>CI</strong> — install, lint, type-check, test, build.
            Runs on every push and PR.
          </li>
          <li>
            <strong>Deploy</strong> — on merge to main, ship to
            staging/production.
          </li>
          <li>
            <strong>Release</strong> — when a tag like <code>v1.2.0</code>{" "}
            is pushed, publish a release / npm package / Docker image.
          </li>
          <li>
            <strong>Scheduled</strong> — cron-style, e.g. nightly dependency
            audit, weekly backup.
          </li>
        </ul>

        <h2>Secrets in workflows</h2>
        <p>
          Workflows often need API keys (to deploy, to publish, to
          authenticate). NEVER hardcode them. Instead, store them in
          GitHub's repository <strong>Secrets</strong> settings and
          reference them as <code>{"${{ secrets.MY_KEY }}"}</code>. GitHub
          masks the value in logs.
        </p>

        <h2>The orchestrator's questions about a workflow</h2>
        <ol>
          <li>What triggers this — every PR, only main, on schedule?</li>
          <li>Which jobs are blocking (PR can't merge if they fail)?</li>
          <li>Which steps install secrets — is the access scope minimal?</li>
          <li>How long does the full run take? (Affects developer feedback loop.)</li>
          <li>If a deploy step exists — what does it deploy to, and how is it gated?</li>
        </ol>
      </LayerSection>

      <LayerSection layer="context">
        <WhereYoullSeeThis
          items={[
            { file: ".github/workflows/ci.yml", context: "Every modern repo has one. Reading it tells you what 'quality' means in this project." },
            { context: "Vercel and Netlify use their own pipelines (not GitHub Actions) for build + deploy, but the concept is identical." },
            { file: "actions/checkout@v4", context: "The most-used action — clones your repo onto the runner. Step 1 of nearly every workflow." },
            { file: "${{ secrets.OPENAI_API_KEY }}", context: "Referencing a repo secret. Values are masked in logs. Set them in Settings → Secrets and variables." },
            { context: "An agent says 'CI is red' — the workflow failed on some step. The Actions tab shows exactly which step and why." },
          ]}
        />

        <AntiPattern
          bad={{
            title: "A workflow with deploy steps that has no manual approval",
            body: (
              <>
                The agent sets up an Actions workflow that auto-deploys to
                production on every merge to main. Five minutes later, a
                buggy merge ships to all users with no human gate.
              </>
            ),
          }}
          good={{
            title: "Gate production deploys with an environment + manual approval",
            body: (
              <>
                GitHub Environments let you require a manual approver
                before a deploy job runs. Use this for production. Auto-deploy
                to staging is fine; auto-deploy to production is asking
                for it.
              </>
            ),
          }}
          why={
            <>
              CI/CD is about velocity, but velocity without a brake is
              dangerous. Manual gates on production are cheap insurance.
              For solo work this can be relaxed; for anything with real
              users, gate prod deploys.
            </>
          }
        />
      </LayerSection>

      <LayerSection layer="gate">
        <MasteryCheck
          lessonN={37}
          questions={[
            {
              kind: "mcq",
              prompt: "What does CI stand for, and what does it do?",
              options: [
                "Code Inspector — checks for bugs manually.",
                "Continuous Integration — automatically runs tests and checks on every change so problems surface immediately, not days later.",
                "Compile + Install — sets up your machine.",
                "Cloud Infrastructure — manages servers.",
              ],
              answer: 1,
              explanation:
                "CI = auto-tests on every change. CD adds auto-deploy on top.",
            },
            {
              kind: "fill",
              prompt:
                "Where do GitHub Actions workflows live in a repository (folder path)?",
              answers: [".github/workflows", ".github/workflows/"],
              explanation:
                ".github/workflows/. YAML files inside. GitHub auto-discovers them.",
            },
            {
              kind: "multi",
              prompt:
                "Which of these are typical triggers for a workflow?",
              options: [
                "push (when a commit is pushed)",
                "pull_request (when a PR is opened or updated)",
                "schedule (cron-style)",
                "workflow_dispatch (manual)",
                "user_birthday",
              ],
              answer: [0, 1, 2, 3],
              explanation:
                "Push, PR, schedule, and manual are the standard triggers. Birthdays are not.",
            },
            {
              kind: "mcq",
              prompt:
                "Your AI agent's workflow references `process.env.STRIPE_KEY` directly in a step. What's the orchestrator's response?",
              options: [
                "Approve.",
                "Reject. The key should be stored in repo Secrets and referenced as `${{ secrets.STRIPE_KEY }}` so it's masked in logs, not pasted into YAML.",
                "Encrypt the YAML.",
                "Use a longer key.",
              ],
              answer: 1,
              explanation:
                "Secrets in YAML = leaked secrets. Use repo Secrets, always.",
            },
            {
              kind: "mcq",
              prompt:
                "Your agent sets up a workflow that auto-deploys to PRODUCTION on every merge to main. What's the orchestrator's pushback?",
              options: [
                "Sounds great.",
                "Add a manual approval gate (GitHub Environments → required reviewers) before the production deploy job runs. Auto-deploy to staging is fine; production needs a brake.",
                "Switch to manual deploys for everything.",
                "Remove CI.",
              ],
              answer: 1,
              explanation:
                "Velocity to staging = good. Velocity to production = brakes required.",
            },
          ]}
        />

        <div className="mt-8 panel rounded-sm panel-bracketed p-6">
          <div className="marker mb-2">phase 1 capstone</div>
          <h3 className="text-lg font-semibold text-ink mb-3">
            Phase 1 complete — you can run a PR.
          </h3>
          <p className="text-ink-dim leading-relaxed">
            You understand what version control is, how Git stores history,
            how to start a repo, read history, branch, merge, resolve
            conflicts, and keep secrets out. You understand the difference
            between Git and GitHub, how to push and pull, what a PR really
            is, the seven questions to ask when reading one, and how CI/CD
            attaches to the whole flow.
          </p>
          <p className="text-ink-dim leading-relaxed mt-3">
            Reading any PR an AI agent opens for you, you can now apply a
            senior-engineer mental model. From here, the next phases give
            you the languages and systems that put more <em>content</em>{" "}
            inside those PRs to evaluate.
          </p>
          <p className="text-ink-dim leading-relaxed mt-3">
            <strong>Next: Phase 2 — Python.</strong> Your first real
            language. Reads like English, powers AI, teaches programming
            logic cleanly.
          </p>
        </div>
      </LayerSection>
    </>
  );
}
