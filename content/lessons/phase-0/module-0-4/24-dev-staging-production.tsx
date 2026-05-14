import { LayerSection } from "@/components/lesson/LayerSection";
import { ConceptCard } from "@/components/interactive/ConceptCard";
import { Diagram, DBox, DArrow } from "@/components/interactive/Diagram";
import { AntiPattern } from "@/components/interactive/AntiPattern";
import { WhereYoullSeeThis } from "@/components/interactive/WhereYoullSeeThis";
import { MasteryCheck } from "@/components/interactive/MasteryCheck";

export default function Lesson24() {
  return (
    <>
      <LayerSection layer="why">
        <p>
          Final lesson of Phase 0. Every serious app runs in multiple
          environments. When an AI agent says "this works in dev but not in
          production," you need to know exactly what's different. The answer is
          always the same five things — and once you know them, you can
          diagnose 90% of "works on my machine" bugs.
        </p>
      </LayerSection>

      <LayerSection layer="model">
        <ConceptCard
          front={<>What's the difference between dev, staging, and production?</>}
          back={
            <p className="text-center text-lg">
              <strong>Dev</strong> — your laptop, fast feedback, cheap mistakes.<br />
              <strong>Staging</strong> — a copy of production for final
              testing. Real-ish data.<br />
              <strong>Production</strong> — what users actually use. Mistakes
              cost money.
            </p>
          }
        />

        <Diagram caption="The three environments. Code flows left to right. Risk and consequence both grow with it.">
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <DBox label="Dev" tone="info" sub="your laptop" />
            <DArrow direction="right" />
            <DBox label="Staging" tone="warn" sub="prod-like, not user-facing" />
            <DArrow direction="right" />
            <DBox label="Production" tone="err" sub="real users, real money" />
          </div>
        </Diagram>
      </LayerSection>

      <LayerSection layer="concept">
        <h2>The five things that differ between environments</h2>

        <h3>1. The configuration (env vars)</h3>
        <p>
          Different database URLs. Different API keys (test mode in dev,
          live in prod). Different feature flags. The code is identical; the
          values change.
        </p>

        <h3>2. The data</h3>
        <p>
          Dev has a few fake users you typed in. Staging has a recent (maybe
          anonymized) copy of prod data. Production has real user data with
          real privacy obligations.
        </p>

        <h3>3. The scale</h3>
        <p>
          Dev: 1 request at a time, no load. Production: thousands of
          requests per second. Bugs that don't show up in dev appear
          immediately under load.
        </p>

        <h3>4. The infrastructure</h3>
        <p>
          Dev: SQLite on your laptop, all running in one process. Production:
          Postgres on a managed service, app on several servers, Redis cache,
          load balancer, CDN. The architecture is genuinely different.
        </p>

        <h3>5. The error tolerance</h3>
        <p>
          Dev crashes are fine — you reload. Production crashes are pager
          duty, public Twitter, potential refunds.
        </p>

        <h2>How environments are configured</h2>
        <p>The typical pattern:</p>
        <ul>
          <li>
            Code reads behavior from <code>process.env.NODE_ENV</code>{" "}
            (usually <code>development</code>, <code>staging</code>, or{" "}
            <code>production</code>).
          </li>
          <li>
            Connection strings, keys, and toggles come from env vars.
          </li>
          <li>
            <code>.env</code> (local), platform settings (deployed) provide
            the values.
          </li>
          <li>
            Some behaviors switch based on the environment: detailed errors
            in dev, generic in prod; verbose logs in dev, structured/sampled
            in prod.
          </li>
        </ul>

        <h2>The promotion model</h2>
        <ol>
          <li>Code is written and tested locally (dev).</li>
          <li>PR opened. CI runs tests and lint. Reviewer (you, the orchestrator) approves.</li>
          <li>Merged to <code>main</code>. Deployed to staging automatically.</li>
          <li>QA on staging (manual or automated end-to-end tests).</li>
          <li>Promoted to production via a button click or merge to a <code>release</code> branch.</li>
        </ol>
        <p>
          Some teams skip staging and go dev → production with feature flags
          to gate risky changes. Either way, the same five differences apply.
        </p>

        <h2>"Production parity"</h2>
        <p>
          The closer your dev/staging look like production, the fewer
          surprises. This is why Docker is so popular: same image runs
          everywhere. Same Node version. Same Postgres version. Different env
          vars only.
        </p>
      </LayerSection>

      <LayerSection layer="context">
        <WhereYoullSeeThis
          items={[
            { file: "NODE_ENV=production", context: "The single most influential env var. Frameworks behave differently based on its value." },
            { file: ".env.local, .env.staging, .env.production", context: "Per-environment env files. Loaded based on NODE_ENV." },
            { file: "if (process.env.NODE_ENV !== 'production') console.log(...)", context: "Common pattern — verbose logs only in dev." },
            { context: "Vercel preview deployments are essentially per-PR staging environments." },
            { context: "An agent says 'works locally but not on Vercel' — it's one of the five differences. Almost always an env var or version mismatch." },
          ]}
        />

        <AntiPattern
          bad={{
            title: "Testing only on the agent's laptop before deploying to production",
            body: (
              <>
                The agent says "it works on my machine, ship it." Skips
                staging. Production breaks because the agent's local Postgres
                is v17 and production runs v15.
              </>
            ),
          }}
          good={{
            title: "Use staging (or a preview deployment) for every change",
            body: (
              <>
                Code must run on a production-like environment before reaching
                users. Vercel previews are free. Docker can replicate prod
                locally. There's no excuse to skip this step.
              </>
            ),
          }}
          why={
            <>
              "Works on my machine" is funny until it costs you customers. A
              staging environment, or at minimum a preview deploy, surfaces
              the five differences cheaply.
            </>
          }
        />
      </LayerSection>

      <LayerSection layer="gate">
        <MasteryCheck
          lessonN={24}
          questions={[
            {
              kind: "multi",
              prompt: "Which of these typically DIFFER between dev and production?",
              options: [
                "Database connection string",
                "API keys",
                "Whether HTTPS is enforced",
                "The application code itself",
                "Logging verbosity",
                "Scale (number of concurrent users)",
              ],
              answer: [0, 1, 2, 4, 5],
              explanation:
                "Everything except the code (ideally). Same code, different config = same behavior, different scale and trust.",
            },
            {
              kind: "mcq",
              prompt: "What is staging, in one sentence?",
              options: [
                "A backup of production.",
                "An environment that mimics production, used for final testing before code reaches real users.",
                "Where developers work locally.",
                "A type of database.",
              ],
              answer: 1,
              explanation:
                "Staging = prod-shaped sandbox. Catches production-only bugs before they hit users.",
            },
            {
              kind: "fill",
              prompt:
                "What env var convention do most frameworks use to know which environment they're in?",
              answers: ["NODE_ENV", "node_env"],
              explanation:
                "NODE_ENV. Values: development, production, test. Frameworks switch behavior on it.",
            },
            {
              kind: "mcq",
              prompt:
                "Your AI agent says 'works on my machine, ship to prod.' What's the orchestrator's response?",
              options: [
                "Approve.",
                "Reject — at minimum push to a preview deployment first. 'Works on my machine' is not evidence about how it'll behave in production.",
                "Ship and revert if needed.",
                "Test in production.",
              ],
              answer: 1,
              explanation:
                "Production-like testing is non-negotiable. Vercel previews, Docker, staging — pick a method.",
            },
            {
              kind: "mcq",
              prompt:
                "Why is using Docker for both dev and production valuable?",
              options: [
                "Docker is required by law.",
                "It pins versions of the runtime, OS, and system libs, so the same image runs everywhere. This kills most 'works on my machine' bugs.",
                "Docker is faster than running locally.",
                "Docker doesn't need env vars.",
              ],
              answer: 1,
              explanation:
                "Production parity. Same image, same behavior. Only env vars change.",
            },
          ]}
        />

        <div className="mt-8 panel rounded-sm panel-bracketed p-6">
          <div className="marker mb-2">phase 0 capstone</div>
          <h3 className="text-lg font-semibold text-ink mb-3">
            You have completed Phase 0.
          </h3>
          <p className="text-ink-dim leading-relaxed">
            You can now open a project folder and name the role of every common
            file. You can read terminal commands. You can read an HTTP exchange
            and a status code. You understand the difference between client
            and server, dev and production. The vocabulary an AI agent uses
            should no longer feel foreign.
          </p>
          <p className="text-ink-dim leading-relaxed mt-3">
            Next: <strong>Phase 1 — Git &amp; Version Control.</strong> The
            developer's most essential tool. After that, your first real
            language: Python.
          </p>
        </div>
      </LayerSection>
    </>
  );
}
