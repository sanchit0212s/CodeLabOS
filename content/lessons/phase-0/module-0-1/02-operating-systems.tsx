import { LayerSection } from "@/components/lesson/LayerSection";
import { Diagram, DBox, DArrow } from "@/components/interactive/Diagram";
import { ConceptCard } from "@/components/interactive/ConceptCard";
import { AntiPattern } from "@/components/interactive/AntiPattern";
import { WhereYoullSeeThis } from "@/components/interactive/WhereYoullSeeThis";
import { MasteryCheck } from "@/components/interactive/MasteryCheck";

export default function Lesson02() {
  return (
    <>
      <LayerSection layer="why">
        <p>
          Every AI agent you direct will be deploying its code to a server. That
          server runs on an operating system — almost always Linux. Decisions
          like "should this be a daemon?", "what's the right user to run as?",
          "why does the agent want to install a system package?" all live in the
          OS layer. If you don't understand what an OS is and what it does, you
          will rubber-stamp every infrastructure decision.
        </p>
      </LayerSection>

      <LayerSection layer="model">
        <ConceptCard
          front={<>What is an operating system?</>}
          back={
            <p className="text-center text-lg">
              An OS is the <strong>traffic controller and translator</strong>{" "}
              between your programs and the bare hardware. It hands out time on
              the CPU, doles out RAM, and arbitrates who gets to touch the disk,
              the network, and the screen.
            </p>
          }
        />

        <Diagram caption="The stack. Your code is at the top. The OS sits underneath, abstracting every detail of the hardware below it.">
          <div className="space-y-2 w-full max-w-md">
            <DBox tone="accent" label="Your application code" sub="React app, Python script, AI agent" />
            <div className="flex justify-center"><DArrow direction="down" /></div>
            <DBox tone="info" label="The runtime" sub="Node.js, Python, JVM…" />
            <div className="flex justify-center"><DArrow direction="down" /></div>
            <DBox tone="phase" label="The Operating System (OS)" sub="Linux, macOS, Windows" />
            <div className="flex justify-center"><DArrow direction="down" /></div>
            <DBox tone="muted" label="The hardware" sub="CPU, RAM, disk, NIC" />
          </div>
        </Diagram>
      </LayerSection>

      <LayerSection layer="concept">
        <h2>The five jobs of an operating system</h2>
        <p>
          Every OS does the same five things, no matter what brand it is. Once
          you can name them, you can ask sharper questions about anything an
          AI agent does on a server.
        </p>

        <h3>1. Run multiple programs at once</h3>
        <p>
          Your laptop has one CPU (well, a handful of cores), but right now
          you're running a browser, a chat app, a music player, and a hundred
          background processes. The OS rapidly switches between them — giving
          each a few microseconds of CPU before moving to the next. This is
          called <strong>scheduling</strong>.
        </p>

        <h3>2. Hand out memory</h3>
        <p>
          Every program asks the OS for RAM. The OS keeps a ledger of who has
          what, and prevents one program from reading another's memory (that
          would be a security disaster). When a program is greedy and asks for
          more than is available, the OS kills it — the famous "OOM Kill" (Out
          Of Memory).
        </p>

        <h3>3. Mediate access to the filesystem</h3>
        <p>
          Programs can't write to your disk directly. They ask the OS:
          "please open file X for me" — and the OS decides if they're allowed
          (permissions) before letting them touch the data.
        </p>

        <h3>4. Mediate access to the network</h3>
        <p>
          Same story for the internet. Programs ask the OS to open a connection
          to a server. The OS handles the low-level details and hands back a
          simple read/write channel.
        </p>

        <h3>5. Manage users and permissions</h3>
        <p>
          Modern operating systems are multi-user. The OS knows who you are
          (your <strong>user account</strong>), what groups you're in, and
          enforces the rules: "this file is only readable by user{" "}
          <code>postgres</code>".
        </p>

        <h2>The three you'll meet</h2>
        <ul>
          <li>
            <strong>Linux</strong> — open-source, runs nearly every server on the
            internet. You will deploy here.
          </li>
          <li>
            <strong>macOS</strong> — what most developers use to <em>write</em>{" "}
            code. Built on a Unix base, so commands transfer well to Linux.
          </li>
          <li>
            <strong>Windows</strong> — common on user laptops, less common as a
            web server. Most modern Windows dev uses WSL (a Linux inside Windows).
          </li>
        </ul>

        <h2>The kernel</h2>
        <p>
          When people say "Linux" they often mean the <strong>kernel</strong> —
          the central program that actually does the five jobs above. Everything
          else (the terminal, the file explorer, the package manager) is just
          another program running on top of the kernel.
        </p>
      </LayerSection>

      <LayerSection layer="context">
        <WhereYoullSeeThis
          items={[
            { file: "FROM ubuntu:22.04", context: "First line of a Dockerfile. Picks the Linux distribution your container will run on." },
            { context: "An agent says 'we'll run this as a systemd service' — systemd is the Linux subsystem that manages long-running programs." },
            { context: "OOM Killed in the logs — the OS killed your program because it asked for more RAM than was available." },
            { file: "sudo apt install postgresql", context: "Telling the OS to install a system package. 'sudo' = run as the superuser." },
            { context: "'Permission denied' errors — the OS is enforcing rule #5. Either the user doesn't have access or the file is locked down." },
          ]}
        />

        <AntiPattern
          bad={{
            title: "Running everything as root",
            body: (
              <>
                The agent's deploy script runs every command with{" "}
                <code>sudo</code>, including the application itself. Easy, works
                first try.
              </>
            ),
          }}
          good={{
            title: "Create an unprivileged user for the app",
            body: (
              <>
                Run the application as a dedicated user with only the permissions
                it actually needs. If the app is ever compromised, the attacker
                can't trash the whole machine.
              </>
            ),
          }}
          why={
            <>
              The OS's permission system is your primary defense. If the
              application user can't write outside its own folder, a bug that
              tries to delete <code>/etc</code> just fails harmlessly.
            </>
          }
        />
      </LayerSection>

      <LayerSection layer="gate">
        <MasteryCheck
          lessonN={2}
          questions={[
            {
              kind: "mcq",
              prompt:
                "When a program tries to read a file, what actually happens?",
              options: [
                "The program reads the disk directly.",
                "The program asks the OS, which checks permissions and either reads the file or denies the request.",
                "The disk pushes the file into the program automatically.",
                "The CPU reads the disk and hands the data to the program.",
              ],
              answer: 1,
              explanation:
                "Programs never touch hardware directly in a modern OS. They go through the OS, which mediates every access.",
            },
            {
              kind: "mcq",
              prompt: "What does the OS scheduler do?",
              options: [
                "Schedules tasks to run at 9 AM every day.",
                "Decides which program gets to use the CPU next, microsecond by microsecond.",
                "Schedules disk backups.",
                "Schedules software updates.",
              ],
              answer: 1,
              explanation:
                "Scheduling = giving each running program tiny slices of CPU time so they appear to run simultaneously.",
            },
            {
              kind: "multi",
              prompt:
                "Which of these are jobs the operating system does?",
              options: [
                "Decides which program gets CPU time.",
                "Compiles your TypeScript code.",
                "Hands out RAM to programs and enforces who can read what.",
                "Mediates access to the filesystem and network.",
              ],
              answer: [0, 2, 3],
              explanation:
                "Compiling is a tool you (or your build system) runs — not an OS job. The other three are core OS responsibilities.",
            },
            {
              kind: "fill",
              prompt:
                "The central program inside an operating system that does the actual scheduling, memory management, and hardware mediation is called the _______.",
              answers: ["kernel"],
              explanation:
                "When people say 'the Linux kernel' they mean this central program. Everything else is a regular program running on top of it.",
            },
            {
              kind: "mcq",
              prompt:
                "Your AI agent's deploy script runs the application as the root user. Why is this an anti-pattern?",
              options: [
                "Root is slower than other users.",
                "Root processes can't write to disk.",
                "If the app is compromised, the attacker has unrestricted access to the entire server.",
                "Root is only allowed on Windows.",
              ],
              answer: 2,
              explanation:
                "Principle of least privilege. An app should only have the permissions it actually needs — never root unless absolutely necessary.",
            },
          ]}
        />
      </LayerSection>
    </>
  );
}
