import { LayerSection } from "@/components/lesson/LayerSection";
import { ConceptCard } from "@/components/interactive/ConceptCard";
import { TerminalSim } from "@/components/interactive/TerminalSim";
import { AnnotatedCode } from "@/components/interactive/AnnotatedCode";
import { AntiPattern } from "@/components/interactive/AntiPattern";
import { WhereYoullSeeThis } from "@/components/interactive/WhereYoullSeeThis";
import { MasteryCheck } from "@/components/interactive/MasteryCheck";

export default function Lesson09() {
  return (
    <>
      <LayerSection layer="why">
        <p>
          Environment variables are how the same code runs in dev, staging, and
          production without modification. They're how API keys stay out of
          source code. They're how every modern SaaS configures itself. If you
          can't name what they are, you'll silently approve agents storing
          secrets in dangerous places.
        </p>
      </LayerSection>

      <LayerSection layer="model">
        <ConceptCard
          front={<>What is an environment variable?</>}
          back={
            <p className="text-center text-lg">
              A <strong>named string</strong> attached to a process by the OS,
              like <code>DATABASE_URL=postgres://...</code>. The program reads
              them at runtime to configure itself without baking values into
              the code.
            </p>
          }
        />
      </LayerSection>

      <LayerSection layer="concept">
        <h2>The basics</h2>
        <TerminalSim
          title="environment variables in the shell"
          lines={[
            { kind: "cmd", text: "echo $HOME", annotate: "read a built-in env var" },
            { kind: "out", text: "/home/you" },
            { kind: "cmd", text: "echo $USER" },
            { kind: "out", text: "you" },

            { kind: "cmd", text: "export GREETING=hello", annotate: "set one" },
            { kind: "cmd", text: "echo $GREETING" },
            { kind: "out", text: "hello" },

            { kind: "cmd", text: "env | head", annotate: "list all env vars" },
            { kind: "out", text: "HOME=/home/you" },
            { kind: "out", text: "USER=you" },
            { kind: "out", text: "PATH=/usr/local/bin:/usr/bin:/bin" },
            { kind: "out", text: "..." },
          ]}
        />

        <h2>How programs read them</h2>
        <p>
          Every language has a way to read env vars. The variable lives in the
          process's environment, set by the OS when the process started:
        </p>
        <AnnotatedCode
          filename="three languages, same idea"
          lines={[
            { code: '// Node.js',                                       note: "JavaScript" },
            { code: 'const dbUrl = process.env.DATABASE_URL;',          note: "process.env is an object" },
            { code: '',                                                 note: "" },
            { code: '# Python',                                         note: "Python" },
            { code: 'import os',                                        note: "" },
            { code: 'db_url = os.environ["DATABASE_URL"]',              note: "os.environ is a dict" },
            { code: '',                                                 note: "" },
            { code: '# Bash',                                           note: "shell" },
            { code: 'echo $DATABASE_URL',                               note: "$ to read" },
          ]}
        />

        <h2>The .env file convention</h2>
        <p>
          Typing <code>export</code> for 20 variables every time you open a
          terminal is miserable. The community solved this with a convention:
          put your local values in a file named <code>.env</code>:
        </p>
        <AnnotatedCode
          filename=".env"
          lines={[
            { code: "DATABASE_URL=postgres://localhost:5432/myapp",    note: "your local DB" },
            { code: "API_KEY=sk-test-123abc",                          note: "a test API key" },
            { code: "PORT=3000",                                       note: "what port to run on" },
          ]}
        />
        <p>
          A library like <code>dotenv</code> reads this file at startup and
          loads each line into the process's environment. Just like that, your
          code works on every machine without changes — different developers
          and servers each have their own <code>.env</code>.
        </p>

        <h2>The single most important rule</h2>
        <p>
          <strong>.env must be in your .gitignore.</strong> Always. Every
          time. It contains secrets. Committing it leaks production passwords
          and API keys to anyone who can see the repository.
        </p>

        <h2>How production sets env vars</h2>
        <p>
          Production never uses a <code>.env</code> file. Instead, the hosting
          platform (Vercel, Fly.io, AWS, Kubernetes) injects variables into
          the process when it starts. Your code uses the same{" "}
          <code>process.env.DATABASE_URL</code> — but the value comes from
          the platform's secrets manager.
        </p>
      </LayerSection>

      <LayerSection layer="context">
        <WhereYoullSeeThis
          items={[
            { file: ".env / .env.local / .env.production", context: "Where local values live. Loaded by the dotenv library." },
            { file: ".env.example", context: "Committed to the repo. Lists every variable name (no values) so new developers know what to fill in." },
            { file: "process.env.NODE_ENV", context: "Node convention. 'development', 'production', or 'test'. Controls behavior like logging." },
            { file: "Vercel Project Settings → Environment Variables", context: "Where production values live in a Vercel-hosted project. Same pattern on every host." },
            { context: "An agent says 'add this to your .env' — they're telling you where the value should live, not what it should be." },
          ]}
        />

        <AntiPattern
          bad={{
            title: "Hardcoding an API key in source",
            body: (
              <>
                <code>const stripeKey = "sk_live_AbCd...";</code>{" "}
                Now the key is in every clone of the repo. Public repo? Key is
                indexed by GitHub's secret scanner within minutes.
              </>
            ),
          }}
          good={{
            title: "Read from process.env, store in .env (local) or platform secret (prod)",
            body: (
              <>
                <code>const stripeKey = process.env.STRIPE_SECRET_KEY;</code>{" "}
                The code is portable. Local devs use .env. Production uses
                platform-injected secrets. Rotation is one update away.
              </>
            ),
          }}
          why={
            <>
              This is the most common security mistake AI agents make. Always
              insist on env vars for anything secret. If you ever see a key,
              token, or password literally in source, push back immediately.
            </>
          }
        />
      </LayerSection>

      <LayerSection layer="gate">
        <MasteryCheck
          lessonN={9}
          questions={[
            {
              kind: "mcq",
              prompt: "What is an environment variable, in one sentence?",
              options: [
                "A variable used inside a single function.",
                "A named string attached to a running process, set by the OS or the user, that programs can read to configure themselves.",
                "A variable that holds the temperature of the CPU.",
                "Another word for a constant.",
              ],
              answer: 1,
              explanation:
                "Env vars live in the process's environment. Code reads them via process.env / os.environ / $VAR.",
            },
            {
              kind: "mcq",
              prompt:
                "Why do projects use a `.env` file instead of typing `export` for every variable?",
              options: [
                "It's faster for the CPU.",
                "It's a convention — local values live in .env, a library auto-loads them at startup. Same code works on every machine.",
                "Env vars don't work without .env.",
                "Bash requires it.",
              ],
              answer: 1,
              explanation:
                ".env is convention, not requirement. Libraries like dotenv read it and populate process.env.",
            },
            {
              kind: "multi",
              prompt: "Which of these should NEVER be hardcoded in source code?",
              options: [
                "Database password",
                "Default port like 3000",
                "Third-party API key",
                "OAuth client secret",
                "Public app name",
              ],
              answer: [0, 2, 3],
              explanation:
                "Secrets (passwords, keys, OAuth secrets) → env vars. Defaults and public values are fine to commit.",
            },
            {
              kind: "fill",
              prompt:
                "Before committing any code with a `.env` file, you must add it to which file so Git ignores it?",
              answers: [".gitignore", "gitignore"],
              explanation:
                "If .env is ever committed, every secret is leaked. Add to .gitignore BEFORE adding any keys.",
            },
            {
              kind: "mcq",
              prompt:
                "Your AI agent commits a file containing `API_KEY=sk_live_abcd1234`. What's the right reaction?",
              options: [
                "Approve — at least it's documented.",
                "Reject the commit. Rotate the key (assume it's compromised). Move the key to .env. Add .env to .gitignore.",
                "Rename the file to be hidden.",
                "Compress the file.",
              ],
              answer: 1,
              explanation:
                "Once a secret is in any commit, it's in Git history forever. Rotate, then prevent the next leak.",
            },
          ]}
        />
      </LayerSection>
    </>
  );
}
