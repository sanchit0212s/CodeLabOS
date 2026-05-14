import { LayerSection } from "@/components/lesson/LayerSection";
import { ConceptCard } from "@/components/interactive/ConceptCard";
import { Diagram, DBox, DArrow } from "@/components/interactive/Diagram";
import { TerminalSim } from "@/components/interactive/TerminalSim";
import { AntiPattern } from "@/components/interactive/AntiPattern";
import { WhereYoullSeeThis } from "@/components/interactive/WhereYoullSeeThis";
import { MasteryCheck } from "@/components/interactive/MasteryCheck";

export default function Lesson23() {
  return (
    <>
      <LayerSection layer="why">
        <p>
          Every modern project has a "build step." Every agent will run one
          before deploy. When the build fails, you need to read the output
          and know what just broke. Understanding what a build IS demystifies
          half the errors you'll ever see.
        </p>
      </LayerSection>

      <LayerSection layer="model">
        <ConceptCard
          front={<>What does `npm run build` actually do?</>}
          back={
            <p className="text-center text-lg">
              It runs a pipeline that transforms your source code into{" "}
              <strong>production-ready files</strong> — compiled, bundled,
              minified, optimized — that a server or browser can run directly.
              Build is "preparing the food," runtime is "eating it."
            </p>
          }
        />

        <Diagram caption="The build pipeline. Each step transforms the code further. The output is what you actually deploy.">
          <div className="flex items-center gap-3 flex-wrap justify-center">
            <DBox label=".tsx, .ts" tone="muted" sub="source" />
            <DArrow direction="right" label="compile" />
            <DBox label=".js" tone="info" sub="plain JS" />
            <DArrow direction="right" label="bundle" />
            <DBox label="few bundle.js files" tone="info" sub="few files" />
            <DArrow direction="right" label="minify" />
            <DBox label="tiny output" tone="accent" sub="ship this" />
          </div>
        </Diagram>
      </LayerSection>

      <LayerSection layer="concept">
        <h2>What "build" usually does, step by step</h2>

        <h3>1. Compile / transpile</h3>
        <p>
          Turn the language you wrote into a language the runtime understands.
          TypeScript → JavaScript. JSX → JavaScript. SCSS → CSS. Some
          languages skip this (Python, plain JS).
        </p>

        <h3>2. Bundle</h3>
        <p>
          Combine your hundreds of source files into a small number of
          optimized files. The browser doesn't want to download 800 separate
          files; it wants a handful. <strong>Bundlers</strong> like webpack,
          esbuild, Vite, Rollup do this.
        </p>

        <h3>3. Tree-shake</h3>
        <p>
          Drop code that's imported but never actually used. If you import
          one function from a 50-function library, only that one ships.
        </p>

        <h3>4. Minify</h3>
        <p>
          Shrink the output by renaming variables (<code>userName</code> →{" "}
          <code>u</code>), removing whitespace, etc. Cuts size by 50-80%.
          Cosmetic only — the code behaves identically.
        </p>

        <h3>5. Optimize assets</h3>
        <p>
          Compress images. Inline tiny CSS. Generate multiple image sizes
          (for responsive). Fingerprint files so caches can be aggressive.
        </p>

        <h2>What you'll see</h2>
        <TerminalSim
          title="next build"
          lines={[
            { kind: "cmd", text: "npm run build" },
            { kind: "out", text: "▲ Next.js 14.2.16" },
            { kind: "out", text: "  - Linting and checking validity of types" },
            { kind: "out", text: "  - Compiling..." },
            { kind: "out", text: "  - Collecting page data" },
            { kind: "out", text: "  - Generating static pages (12/12)" },
            { kind: "out", text: "  - Finalizing page optimization" },
            { kind: "out", text: "" },
            { kind: "out", text: "Route (app)                 Size  First Load JS" },
            { kind: "out", text: "├ ○ /                       2.3 kB     98 kB" },
            { kind: "out", text: "├ ○ /map                    1.8 kB     97 kB" },
            { kind: "out", text: "└ ƒ /learn/[phase]/...      4.5 kB    102 kB" },
          ]}
        />

        <h2>The two big questions about a build</h2>
        <ol>
          <li>
            <strong>How long does it take?</strong> A slow build slows down
            every deploy. If your build is 10 minutes, your feedback loop is
            10 minutes.
          </li>
          <li>
            <strong>How big is the output?</strong> Smaller bundles = faster
            user load. The Next.js build output above shows the size of each
            page. Watch for sudden jumps.
          </li>
        </ol>

        <h2>Build vs runtime</h2>
        <ul>
          <li>
            <strong>Build-time</strong> — happens once before deploy. Cheap
            mistakes (a typo) are caught here.
          </li>
          <li>
            <strong>Runtime</strong> — happens when a user makes a request.
            Bugs here hit users.
          </li>
        </ul>
        <p>
          A core orchestrator skill: push as much work as possible from
          runtime to build time. Faster pages, fewer surprises in production.
        </p>
      </LayerSection>

      <LayerSection layer="context">
        <WhereYoullSeeThis
          items={[
            { file: "npm run build", context: "Triggers the build. Common script in every JS project." },
            { file: ".next/", context: "Where Next.js writes its build output. Don't commit." },
            { file: "Type error: Property 'foo' does not exist on type 'Bar'.", context: "Classic TypeScript build error. Build fails — fix the type before continuing." },
            { context: "An agent says 'rebuild and redeploy' — they mean re-run the build, then ship the new output." },
            { context: "Vercel/Netlify run your build in their cloud on every PR. The build log is your debug source." },
          ]}
        />

        <AntiPattern
          bad={{
            title: "Pushing through with `--no-verify` to skip a failing build/lint",
            body: (
              <>
                The agent gets a TypeScript error during build, then commits
                with <code>--no-verify</code> to skip the pre-commit hook
                "to fix later." It's never fixed. The error compounds.
              </>
            ),
          }}
          good={{
            title: "Fix the build break before moving on",
            body: (
              <>
                Build errors are the cheapest bugs to fix — caught before
                anyone runs your code. Letting them accumulate is borrowing
                against future you.
              </>
            ),
          }}
          why={
            <>
              The build is a free quality check. Skipping it puts errors into
              production. As an orchestrator, your stance: no merge with a
              broken build, ever.
            </>
          }
        />
      </LayerSection>

      <LayerSection layer="gate">
        <MasteryCheck
          lessonN={23}
          questions={[
            {
              kind: "mcq",
              prompt: "What is `npm run build`?",
              options: [
                "Installs dependencies.",
                "Runs a pipeline that transforms your source into optimized files (compiled, bundled, minified) ready to deploy.",
                "Tests the code.",
                "Pushes to GitHub.",
              ],
              answer: 1,
              explanation:
                "Build = prepare for production. Output is what you actually deploy.",
            },
            {
              kind: "multi",
              prompt: "Which of these typically happen during a JavaScript build?",
              options: [
                "TypeScript compiled to JavaScript",
                "Files bundled together",
                "Unused code dropped (tree-shaking)",
                "Minification (rename vars, strip whitespace)",
                "Database migrations",
              ],
              answer: [0, 1, 2, 3],
              explanation:
                "Database migrations are a separate step. Everything else is part of build.",
            },
            {
              kind: "mcq",
              prompt: "Why bundle hundreds of source files into a few output files?",
              options: [
                "It's pretty.",
                "Browsers prefer fewer requests. Bundling reduces the number of files to download.",
                "Servers can't read many files.",
                "JavaScript requires it.",
              ],
              answer: 1,
              explanation:
                "Fewer files = fewer requests = faster page load. (HTTP/2 reduces this somewhat, but bundling is still standard.)",
            },
            {
              kind: "fill",
              prompt:
                "Where does Next.js write its build output (you'll see this in .gitignore)?",
              answers: [".next", ".next/"],
              explanation: "The .next directory.",
            },
            {
              kind: "mcq",
              prompt:
                "Your AI agent gets a TypeScript build error, then commits with `--no-verify` saying 'we'll fix it later.' What's the response?",
              options: [
                "Approve — `--no-verify` saves time.",
                "Reject — fix the error now. Build errors are the cheapest bugs to fix; ignoring them lets errors land in main.",
                "Move to a new branch.",
                "Switch frameworks.",
              ],
              answer: 1,
              explanation:
                "No green build, no merge. The build is a free quality check; honor it.",
            },
          ]}
        />
      </LayerSection>
    </>
  );
}
