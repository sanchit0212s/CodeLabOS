import { LayerSection } from "@/components/lesson/LayerSection";
import { ConceptCard } from "@/components/interactive/ConceptCard";
import { TerminalSim } from "@/components/interactive/TerminalSim";
import { AntiPattern } from "@/components/interactive/AntiPattern";
import { WhereYoullSeeThis } from "@/components/interactive/WhereYoullSeeThis";
import { MasteryCheck } from "@/components/interactive/MasteryCheck";

export default function Lesson19() {
  return (
    <>
      <LayerSection layer="why">
        <p>
          You will run a thousand local dev servers in your life. Every one
          will tell you "running on localhost:3000". If you don't know what
          localhost is or what a port is, you'll be guessing at how to open
          the dang thing.
        </p>
      </LayerSection>

      <LayerSection layer="model">
        <ConceptCard
          front={<>What is localhost?</>}
          back={
            <p className="text-center text-lg">
              <code>localhost</code> is the special name your computer uses to
              talk to itself over the network. It's always{" "}
              <strong>127.0.0.1</strong>. When you run a server on localhost
              and visit it in your browser, nothing leaves your machine — the
              network is the inside of your laptop.
            </p>
          }
        />
      </LayerSection>

      <LayerSection layer="concept">
        <h2>The loopback address</h2>
        <p>
          Your computer reserves the IP address <code>127.0.0.1</code> for
          itself. Traffic to that address never leaves the machine — it loops
          back through the network stack to whatever program is listening.
          That address has a friendly name: <code>localhost</code>. They're
          interchangeable.
        </p>

        <h2>Ports</h2>
        <p>
          An IP address gets you to a machine. A <strong>port</strong> gets
          you to a specific program on that machine. Servers "listen" on a
          port; clients "connect to" that port.
        </p>
        <ul>
          <li>HTTP defaults to port <strong>80</strong>.</li>
          <li>HTTPS defaults to port <strong>443</strong>.</li>
          <li>Dev servers usually pick a high-numbered port like 3000, 5173, 8080 — they don't need superuser permissions to bind to those.</li>
        </ul>

        <p>
          <code>localhost:3000</code> = "my own machine, port 3000."
        </p>

        <TerminalSim
          title="running a local server"
          lines={[
            { kind: "cmd", text: "npm run dev", annotate: "start the dev server" },
            { kind: "out", text: "▲ Next.js 14.2.16" },
            { kind: "out", text: "- Local:        http://localhost:3000" },
            { kind: "out", text: "✓ Ready in 1.2s" },
            { kind: "note", text: "now you open localhost:3000 in your browser" },
          ]}
        />

        <h2>The error you'll definitely see: 'port already in use'</h2>
        <p>
          Try to start a second server on port 3000 and you get:
        </p>
        <pre>{`Error: listen EADDRINUSE: address already in use :::3000`}</pre>
        <p>
          Two programs can't both listen on the same port. Either kill the
          old process or use a different port (most dev servers offer to
          auto-pick one).
        </p>

        <h2>Why your localhost works but production doesn't</h2>
        <ul>
          <li>
            Localhost is HTTP by default — production is HTTPS. Tools that
            require HTTPS (camera, geolocation, service workers) won't run on
            plain localhost.
          </li>
          <li>
            CORS rules between <code>localhost</code> and your production
            domain are different.
          </li>
          <li>
            Cookies set with <code>Secure</code> won't work on http://localhost.
          </li>
        </ul>

        <h2>0.0.0.0 — the look-alike</h2>
        <p>
          You'll see servers bind to <code>0.0.0.0</code>. That means
          "listen on every network interface" — useful for Docker or testing
          from your phone on the same Wi-Fi. <code>127.0.0.1</code> means
          "only accept connections from this machine itself." Be intentional:
          binding 0.0.0.0 on a public server exposes you to the internet.
        </p>
      </LayerSection>

      <LayerSection layer="context">
        <WhereYoullSeeThis
          items={[
            { file: "http://localhost:3000", context: "Default Next.js dev URL." },
            { file: "http://localhost:5173", context: "Default Vite dev URL." },
            { file: "http://localhost:5432", context: "Default Postgres port." },
            { context: "An agent says 'kill what's on port 3000 first' — there's an orphan dev server lingering. `lsof -i :3000` then `kill <pid>`." },
            { context: "Mobile testing on the same Wi-Fi: bind to 0.0.0.0 and visit your laptop's LAN IP from the phone." },
          ]}
        />

        <AntiPattern
          bad={{
            title: "Hardcoding `http://localhost:3000` in production code",
            body: (
              <>
                The agent writes <code>fetch('http://localhost:3000/api/...')</code>{" "}
                in a Next.js component. In production, every user's browser
                tries to call the user's OWN localhost. Nothing works.
              </>
            ),
          }}
          good={{
            title: "Read the base URL from env, or use relative paths",
            body: (
              <>
                <code>fetch('/api/...')</code> — relative path uses the same
                host. Or <code>fetch(process.env.NEXT_PUBLIC_API_URL + '/...')</code>{" "}
                — the value differs in dev and prod via env vars.
              </>
            ),
          }}
          why={
            <>
              localhost in source code is a promise about the world the code
              runs in. It almost never survives deploy.
            </>
          }
        />
      </LayerSection>

      <LayerSection layer="gate">
        <MasteryCheck
          lessonN={19}
          questions={[
            {
              kind: "fill",
              prompt: "What IP address does `localhost` always resolve to?",
              answers: ["127.0.0.1"],
              explanation:
                "The loopback address. Traffic to it never leaves your machine.",
            },
            {
              kind: "mcq",
              prompt: "What's a port, in HTTP terms?",
              options: [
                "A USB connector.",
                "A number identifying which program on a machine should receive a connection.",
                "A way to encrypt traffic.",
                "Another name for an IP address.",
              ],
              answer: 1,
              explanation:
                "IP = which machine. Port = which program on it.",
            },
            {
              kind: "mcq",
              prompt:
                "You try to run `npm run dev` and get `EADDRINUSE: address already in use :::3000`. What does this mean?",
              options: [
                "Your computer is broken.",
                "Another process is already listening on port 3000. Kill it (or use a different port).",
                "Networking is down.",
                "Bash is misconfigured.",
              ],
              answer: 1,
              explanation:
                "Two programs can't share a port. Find and kill the old process.",
            },
            {
              kind: "multi",
              prompt: "Which of these are typical default dev-server ports?",
              options: ["3000", "443", "5173", "5432", "80"],
              answer: [0, 2, 3],
              explanation:
                "3000 (Next.js), 5173 (Vite), 5432 (Postgres). 80 and 443 require root because they're below 1024.",
            },
            {
              kind: "mcq",
              prompt:
                "Your AI agent writes `fetch('http://localhost:3000/api/users')` inside a React component. It works for them, fails after deploy. Why?",
              options: [
                "The deploy is broken.",
                "Every user's browser is now trying to call THEIR OWN localhost, where no server is running. Use a relative path or env var.",
                "Port 3000 is blocked in production.",
                "Need to add CORS.",
              ],
              answer: 1,
              explanation:
                "localhost is per-machine. Hardcoding it ships a per-machine assumption everywhere.",
            },
          ]}
        />
      </LayerSection>
    </>
  );
}
