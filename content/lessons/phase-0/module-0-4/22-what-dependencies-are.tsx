import { LayerSection } from "@/components/lesson/LayerSection";
import { ConceptCard } from "@/components/interactive/ConceptCard";
import { AnnotatedCode } from "@/components/interactive/AnnotatedCode";
import { Diagram, DBox, DArrow } from "@/components/interactive/Diagram";
import { AntiPattern } from "@/components/interactive/AntiPattern";
import { WhereYoullSeeThis } from "@/components/interactive/WhereYoullSeeThis";
import { MasteryCheck } from "@/components/interactive/MasteryCheck";

export default function Lesson22() {
  return (
    <>
      <LayerSection layer="why">
        <p>
          Open <code>node_modules/</code> in any project and you'll find
          hundreds of folders for libraries you never asked for. This is
          terrifying until you understand the math: each library brings its
          own dependencies, and they bring theirs, and so on. Understanding
          how this works is required to spot security risks, license issues,
          and pointless bloat.
        </p>
      </LayerSection>

      <LayerSection layer="model">
        <ConceptCard
          front={<>Why does my project have 800 things in node_modules when I only installed 5 libraries?</>}
          back={
            <p className="text-center text-lg">
              Because each library depends on other libraries. <strong>That's a
              transitive dependency.</strong> You install <code>next</code>,
              which depends on <code>react</code>, which depends on … and so
              on. The 800 number is the closure.
            </p>
          }
        />

        <Diagram caption="A dependency tree. You ask for one library. It quietly drags in its whole network.">
          <div className="space-y-2">
            <DBox label="next" tone="accent" />
            <div className="ml-8 space-y-2 border-l-2 border-edge pl-4">
              <DBox label="react" tone="info" />
              <DBox label="react-dom" tone="info" />
              <DBox label="postcss" tone="info" />
              <div className="ml-8 space-y-2 border-l-2 border-edge pl-4">
                <DBox label="nanoid" tone="muted" />
                <DBox label="source-map-js" tone="muted" />
                <DBox label="…and 18 more" tone="muted" />
              </div>
              <DBox label="…and ~30 more" tone="muted" />
            </div>
          </div>
        </Diagram>
      </LayerSection>

      <LayerSection layer="concept">
        <h2>Direct vs. transitive</h2>
        <ul>
          <li>
            <strong>Direct dependencies</strong> — the libraries listed in
            your <code>package.json</code>. You chose them.
          </li>
          <li>
            <strong>Transitive dependencies</strong> — everything those
            libraries depend on, recursively. You didn't choose them; you
            inherited them.
          </li>
        </ul>

        <h2>Reading package.json's dependencies</h2>
        <AnnotatedCode
          filename="package.json (excerpt)"
          lines={[
            { code: `"dependencies": {`,                  note: "needed at runtime in production" },
            { code: `  "next": "14.2.16",`,               note: "exact version" },
            { code: `  "react": "^18.3.1",`,              note: "^ = compatible: any 18.x.x version" },
            { code: `  "zod": "~3.22.4"`,                 note: "~ = patch: any 3.22.x version" },
            { code: `},`,                                 note: "" },
            { code: `"devDependencies": {`,               note: "only for development — not in production" },
            { code: `  "typescript": "5.6.3",`,           note: "compiler, used in build only" },
            { code: `  "@types/node": "22.9.0",`,         note: "TS types only" },
            { code: `  "eslint": "8.57.1"`,               note: "linter" },
            { code: `}`,                                  note: "" },
          ]}
        />

        <h2>The version range syntax (semver)</h2>
        <p>
          Most versions are <strong>semver</strong>: <code>MAJOR.MINOR.PATCH</code>.
        </p>
        <ul>
          <li>
            <code>^1.2.3</code> — allow <strong>compatible</strong> updates:
            anything {">"}=1.2.3 and {"<"}2.0.0. Most common.
          </li>
          <li>
            <code>~1.2.3</code> — allow <strong>patch</strong> only: anything {">"}
            =1.2.3 and {"<"}1.3.0. Safer.
          </li>
          <li>
            <code>1.2.3</code> — exact. Strictest.
          </li>
        </ul>

        <h2>The lockfile is what actually matters</h2>
        <p>
          The range in <code>package.json</code> says what's <em>allowed</em>.
          The lockfile (<code>package-lock.json</code>) says what's{" "}
          <em>actually installed</em>. The lockfile pins exact versions so
          everyone gets the same install.
        </p>

        <h2>How updates work</h2>
        <ul>
          <li>
            <code>npm install</code> — install per the lockfile.
          </li>
          <li>
            <code>npm install &lt;pkg&gt;</code> — add a new dep, update the
            lockfile.
          </li>
          <li>
            <code>npm update</code> — bump deps within the allowed range,
            update the lockfile.
          </li>
          <li>
            <code>npm outdated</code> — see what's behind.
          </li>
          <li>
            <code>npm audit</code> — see security advisories for installed deps.
          </li>
        </ul>

        <h2>The supply-chain reality</h2>
        <p>
          Every transitive dependency is code running in your build (and
          sometimes at runtime). Compromised npm packages are a real attack
          vector. Your AI agent should not add a new dependency just because
          one task could be done with it — every dep is a long-term liability.
        </p>
      </LayerSection>

      <LayerSection layer="context">
        <WhereYoullSeeThis
          items={[
            { file: "npm install", context: "Reads package.json + lockfile, populates node_modules. Run after every clone and after any dep change." },
            { file: "npm ls --depth=0", context: "List your DIRECT deps. Useful when node_modules feels overwhelming." },
            { file: "npm audit", context: "Reports known vulnerabilities. You'll see this in CI output." },
            { context: "An agent says 'I'll add lodash for one function' — push back. If only one function is needed, write it inline. Avoid pulling in the whole library." },
            { file: "Renovate or Dependabot PRs", context: "Bots that open PRs bumping outdated deps. The orchestrator's job is approving these thoughtfully." },
          ]}
        />

        <AntiPattern
          bad={{
            title: "Adding a 1MB dependency for a 5-line task",
            body: (
              <>
                The agent installs <code>moment</code> (250kb+) to format a
                single date string. Or adds <code>lodash</code> to use{" "}
                <code>_.isEmpty()</code>.
              </>
            ),
          }}
          good={{
            title: "Use built-ins or tiny focused libraries",
            body: (
              <>
                <code>Intl.DateTimeFormat</code> for dates.{" "}
                <code>Object.keys(x).length === 0</code> for isEmpty. A
                tiny helper if needed. Every dep is permanent maintenance
                weight.
              </>
            ),
          }}
          why={
            <>
              The orchestrator's superpower is saying "do we actually need
              this?" Once added, deps are very hard to remove. They become
              your supply-chain attack surface.
            </>
          }
        />
      </LayerSection>

      <LayerSection layer="gate">
        <MasteryCheck
          lessonN={22}
          questions={[
            {
              kind: "mcq",
              prompt: "What's the difference between `dependencies` and `devDependencies` in package.json?",
              options: [
                "There is none.",
                "dependencies are needed at runtime; devDependencies are only needed during development/build (linter, compiler, types).",
                "devDependencies are slower.",
                "dependencies are free; devDependencies cost money.",
              ],
              answer: 1,
              explanation:
                "Production installs skip devDependencies. Smaller, cleaner production image.",
            },
            {
              kind: "mcq",
              prompt: "What does the `^` in `\"react\": \"^18.3.1\"` mean?",
              options: [
                "Exact version 18.3.1 only.",
                "Any version >= 18.3.1 and < 19.0.0 (compatible updates within major version 18).",
                "Latest version regardless of major.",
                "Beta versions.",
              ],
              answer: 1,
              explanation:
                "Caret = compatible. ~ is stricter (patch only). No prefix = exact.",
            },
            {
              kind: "fill",
              prompt:
                "If your package.json allows a range but you want EVERYONE to install the exact same versions, which auto-generated file enforces this?",
              answers: ["package-lock.json", "package-lock", "lockfile"],
              explanation: "The lockfile pins exact versions. Always commit it.",
            },
            {
              kind: "mcq",
              prompt:
                "You inspect node_modules and see hundreds of folders, but your package.json only lists 6 deps. Why?",
              options: [
                "Something's wrong.",
                "Transitive deps — your 6 direct deps each have their own deps, which have their own deps, etc. This is normal.",
                "There's a virus.",
                "node_modules is shared between projects.",
              ],
              answer: 1,
              explanation:
                "Direct + transitive. 6 chosen libraries can easily bring 200+ along.",
            },
            {
              kind: "mcq",
              prompt:
                "Your AI agent adds `moment` (250kb) to format one date string. What's the orchestrator's response?",
              options: [
                "Approve — moment is popular.",
                "Reject — use the built-in Intl.DateTimeFormat or a 2KB lib like date-fns. Every dep is a long-term liability.",
                "Add 5 more date libraries to be safe.",
                "Switch to Python.",
              ],
              answer: 1,
              explanation:
                "Avoid adding heavy deps for trivial tasks. Built-ins or tiny focused libs are nearly always better.",
            },
          ]}
        />
      </LayerSection>
    </>
  );
}
