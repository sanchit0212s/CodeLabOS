import { LayerSection } from "@/components/lesson/LayerSection";
import { ConceptCard } from "@/components/interactive/ConceptCard";
import { AntiPattern } from "@/components/interactive/AntiPattern";
import { WhereYoullSeeThis } from "@/components/interactive/WhereYoullSeeThis";
import { MasteryCheck } from "@/components/interactive/MasteryCheck";
import { TerminalSim } from "@/components/interactive/TerminalSim";

export default function Lesson05() {
  return (
    <>
      <LayerSection layer="why">
        <p>
          When your AI-built app dies, it dies as a <em>process</em>. The
          word "process" appears in every error message, every server log,
          every operations dashboard. If you don't know what a process is and
          what causes them to crash, you're translating a foreign language to
          yourself on the fly during every incident.
        </p>
      </LayerSection>

      <LayerSection layer="model">
        <ConceptCard
          front={<>What is a process?</>}
          back={
            <p className="text-center text-lg">
              A <strong>process</strong> is a running instance of a program. It
              has a unique ID, its own slice of RAM, and the OS treats it as a
              standalone citizen. The program file on disk is the recipe; a
              process is the actual meal being eaten.
            </p>
          }
        />

        <div className="my-6">
          <TerminalSim
            title="processes — see them in action"
            lines={[
              { kind: "cmd", text: "ps aux" },
              { kind: "out", text: "USER       PID  %CPU  %MEM  COMMAND" },
              { kind: "out", text: "root         1   0.0   0.1  /sbin/init" },
              { kind: "out", text: "you       4127   2.1   3.4  node server.js   ← your Node app" },
              { kind: "out", text: "postgres  4128   0.1  12.0  postgres: writer" },
              { kind: "out", text: "you       4521   0.5   0.8  redis-server *:6379" },
              { kind: "out", text: "..." },
              { kind: "note", text: "every running program is a process with a PID" },
            ]}
          />
        </div>
      </LayerSection>

      <LayerSection layer="concept">
        <h2>The three things every process has</h2>
        <ol>
          <li>
            <strong>A PID (Process ID)</strong> — a number the OS uses to refer
            to it. Like a license plate.
          </li>
          <li>
            <strong>An owner</strong> — which user account it runs as. This
            decides what it's allowed to do.
          </li>
          <li>
            <strong>Its own memory</strong> — a private region of RAM. One
            process cannot read another's memory (unless explicitly shared).
            This is the OS enforcing isolation.
          </li>
        </ol>

        <h2>How processes start and stop</h2>
        <p>
          When you run <code>node server.js</code>, the OS creates a new
          process. It assigns a PID, allocates memory, and starts executing.
          The process keeps running until one of three things happens:
        </p>
        <ul>
          <li>
            <strong>It exits normally</strong> — finishes its work or is told
            to stop (Ctrl-C in the terminal sends a "stop" signal).
          </li>
          <li>
            <strong>It crashes</strong> — encounters an unhandled error.
          </li>
          <li>
            <strong>The OS kills it</strong> — usually because it ran out of
            memory (the OOM Killer).
          </li>
        </ul>

        <h2>The three classic crashes</h2>

        <h3>1. Unhandled exception</h3>
        <p>
          Your code threw an error nobody caught. The interpreter prints a
          stack trace and exits. In Node, you'll see{" "}
          <code>UnhandledPromiseRejection</code>. In Python,{" "}
          <code>Traceback (most recent call last):</code>.
        </p>

        <h3>2. Out of memory (OOM)</h3>
        <p>
          The process asked for more RAM than was available. The OS kills it.
          In Linux logs, you'll see <code>Killed</code> or{" "}
          <code>Out of memory: Killed process</code>. This often points to a{" "}
          <strong>memory leak</strong> — the program kept allocating memory
          and never freed it.
        </p>

        <h3>3. Segfault (segmentation fault)</h3>
        <p>
          The process tried to read or write memory it doesn't own. The OS
          stops it. Common in C/C++. Rare in modern interpreted languages,
          but you'll see it from native extensions or buggy compiled deps.
        </p>

        <h2>The "process supervisor" concept</h2>
        <p>
          In production, you almost never run a process directly. Instead, a{" "}
          <strong>supervisor</strong> (systemd, PM2, Docker, Kubernetes) starts
          it and watches it. If it crashes, the supervisor restarts it. This
          is why your AI agent will mention <code>systemd</code> or "restart
          policy" — they're describing what happens when the process dies.
        </p>
      </LayerSection>

      <LayerSection layer="context">
        <WhereYoullSeeThis
          items={[
            { file: "kill -9 4127", context: "Telling the OS to forcibly kill process with PID 4127. The 'nuclear option' command." },
            { file: "process.exit(1)", context: "Node.js code that ends the process with a non-zero status (signaling error)." },
            { file: "restart: always", context: "A docker-compose directive that tells Docker to restart the container if the process crashes." },
            { context: "An agent says 'we have a memory leak' — the process's RAM usage grows over time until OOM-killed." },
            { context: "Logs show 'Killed' with no other context — the OOM killer struck. Time to either reduce memory or scale up." },
          ]}
        />

        <AntiPattern
          bad={{
            title: "Running the production app with `node server.js` in a screen session",
            body: (
              <>
                The agent SSHs into the server and starts the app manually.
                When it crashes (and it will), nothing restarts it. Service is
                down until someone notices.
              </>
            ),
          }}
          good={{
            title: "Run under a supervisor with auto-restart",
            body: (
              <>
                Use systemd, Docker with{" "}
                <code>restart: unless-stopped</code>, or a platform like
                Vercel/Fly that handles this automatically. When the process
                dies, it comes back in seconds.
              </>
            ),
          }}
          why={
            <>
              Every long-running process WILL crash eventually. The only
              question is whether your system notices and restarts it, or your
              users notice and email you.
            </>
          }
        />
      </LayerSection>

      <LayerSection layer="gate">
        <MasteryCheck
          lessonN={5}
          questions={[
            {
              kind: "mcq",
              prompt: "What is the difference between a program and a process?",
              options: [
                "There is no difference.",
                "A program is the file on disk; a process is a running instance of that program.",
                "A program is for desktops; a process is for servers.",
                "A program is written in code; a process is written in machine language.",
              ],
              answer: 1,
              explanation:
                "File on disk = program. The thing actually running = process. One program can have many processes running at once.",
            },
            {
              kind: "fill",
              prompt:
                "Each running process has a unique number the OS uses to refer to it. What's the three-letter abbreviation for that number?",
              answers: ["PID", "pid"],
              explanation:
                "Process ID. Shows up in `ps`, in logs, and in every Linux tool.",
            },
            {
              kind: "multi",
              prompt:
                "Which of these are common reasons a process gets killed by the OS?",
              options: [
                "It ran out of memory (OOM kill).",
                "It tried to access memory it doesn't own (segfault).",
                "It used too much CPU.",
                "Another process sent it a kill signal (e.g. `kill -9`).",
              ],
              answer: [0, 1, 3],
              explanation:
                "OOM, segfaults, and explicit kills end processes. High CPU on its own does NOT cause a kill — the OS just gives it less CPU.",
            },
            {
              kind: "mcq",
              prompt:
                "Your AI-built app's memory usage grows from 200MB at startup to 4GB after a day, then it crashes. What is this most likely?",
              options: [
                "Normal behavior.",
                "A memory leak — the code keeps allocating memory and never freeing it.",
                "A network issue.",
                "An OS bug.",
              ],
              answer: 1,
              explanation:
                "Slow, monotonic memory growth = leak. The OS will OOM-kill the process when it runs out.",
            },
            {
              kind: "mcq",
              prompt:
                "Your agent suggests running the production app with `node server.js` in an SSH session. What's the orchestrator's response?",
              options: [
                "'Sounds good — easy to deploy.'",
                "'No — when the process crashes there's nothing to restart it. We need a supervisor (systemd, Docker, or a platform that auto-restarts).'",
                "'Use Python instead.'",
                "'Add more RAM.'",
              ],
              answer: 1,
              explanation:
                "Production processes need supervision. Without it, the first crash is the start of downtime.",
            },
          ]}
        />
      </LayerSection>
    </>
  );
}
