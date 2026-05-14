import { LayerSection } from "@/components/lesson/LayerSection";
import { ConceptCard } from "@/components/interactive/ConceptCard";
import { TerminalSim } from "@/components/interactive/TerminalSim";
import { AntiPattern } from "@/components/interactive/AntiPattern";
import { WhereYoullSeeThis } from "@/components/interactive/WhereYoullSeeThis";
import { MasteryCheck } from "@/components/interactive/MasteryCheck";

export default function Lesson06() {
  return (
    <>
      <LayerSection layer="why">
        <p>
          Your AI agent will give you commands to run. So will Stack Overflow,
          every README, and every onboarding doc. The terminal is where
          professional developers spend most of their time. The faster you
          stop fearing it, the faster you can verify what an agent actually
          did and reverse decisions you didn't like.
        </p>
      </LayerSection>

      <LayerSection layer="model">
        <ConceptCard
          front={<>What is the terminal?</>}
          back={
            <p className="text-center text-lg">
              A <strong>terminal</strong> is a text window. Inside it runs a{" "}
              <strong>shell</strong> — a program that reads what you type, runs
              it as a command, and prints the result. The terminal is just the
              window; the shell is the brain.
            </p>
          }
        />

        <div className="my-6">
          <TerminalSim
            title="the basic terminal loop"
            lines={[
              { kind: "cmd", text: "whoami", annotate: "type a command + enter" },
              { kind: "out", text: "you" },
              { kind: "cmd", text: "pwd", annotate: "print working directory" },
              { kind: "out", text: "/home/you" },
              { kind: "cmd", text: "echo 'I run computers now'" },
              { kind: "out", text: "I run computers now" },
              { kind: "note", text: "shell reads → executes → prints → repeat" },
            ]}
          />
        </div>
      </LayerSection>

      <LayerSection layer="concept">
        <h2>Two words, often confused</h2>
        <ul>
          <li>
            <strong>Terminal</strong> — the application window. On macOS:
            Terminal.app, iTerm2. On Windows: Windows Terminal, PowerShell.
            On Linux: GNOME Terminal, Konsole. It just displays text.
          </li>
          <li>
            <strong>Shell</strong> — the program running inside the terminal
            that actually does the work. <code>bash</code>, <code>zsh</code>,{" "}
            <code>fish</code>, <code>powershell</code>. macOS defaults to{" "}
            <code>zsh</code>; most Linux servers default to <code>bash</code>.
          </li>
        </ul>

        <h2>The REPL pattern</h2>
        <p>
          The shell runs a <strong>REPL</strong> — Read, Eval, Print, Loop. You
          type something, it reads it, evaluates it, prints the result, loops.
          The same pattern shows up in Python's interactive interpreter, Node's{" "}
          <code>node</code> command, even SQL clients.
        </p>

        <h2>The prompt</h2>
        <p>
          That blinking line where you type — <code>you@laptop ~ $</code> — is
          the <strong>prompt</strong>. It usually tells you: who you are,
          what machine you're on, what folder you're in. Useful for orientation
          when you've SSH'd into 3 servers and forgotten which one you're on.
        </p>

        <h2>Why developers prefer the terminal</h2>
        <ul>
          <li>
            <strong>Composable</strong> — you can chain commands together with
            pipes (lesson 12).
          </li>
          <li>
            <strong>Scriptable</strong> — anything you can type, you can save
            as a script and replay forever.
          </li>
          <li>
            <strong>Remote-friendly</strong> — works the same over SSH on a
            server 10,000 km away as it does on your laptop.
          </li>
          <li>
            <strong>Honest</strong> — there's no hidden state, no "did I click
            the right button?" — what you see is what happened.
          </li>
        </ul>

        <h2>The two most useful shortcuts on day 1</h2>
        <ul>
          <li>
            <strong>↑ arrow</strong> — recall the previous command. Saves
            typing.
          </li>
          <li>
            <strong>Ctrl-C</strong> — stop whatever's running.{" "}
            <strong>Ctrl-D</strong> — close the shell.{" "}
            <strong>Ctrl-L</strong> — clear the screen.
          </li>
        </ul>
      </LayerSection>

      <LayerSection layer="context">
        <WhereYoullSeeThis
          items={[
            { file: "$ npm install", context: "The leading `$` is convention — it represents the shell prompt. You type what comes after." },
            { file: "#!/bin/bash", context: "First line of a shell script — tells the OS which shell should run this file." },
            { file: "~/.zshrc, ~/.bashrc", context: "Your shell's startup file. Aliases, environment variables, prompt customization." },
            { context: "An agent says 'open a terminal and run' — they mean the text window with the shell prompt." },
            { context: "When an agent gives you a long pipeline of commands joined with `|` — that's terminal composition in action." },
          ]}
        />

        <AntiPattern
          bad={{
            title: "Copy-pasting commands from the internet without reading them",
            body: (
              <>
                The agent (or Stack Overflow) gives you a line starting with{" "}
                <code>curl ... | sudo bash</code>. You paste it. You just
                executed someone else's script as root on your machine.
              </>
            ),
          }}
          good={{
            title: "Read every command before running. If unsure, ask.",
            body: (
              <>
                Especially when <code>sudo</code> is involved. Especially when
                a command is piped to <code>bash</code> or{" "}
                <code>sh</code> directly. That pattern downloads code and runs
                it with no review.
              </>
            ),
          }}
          why={
            <>
              The terminal is power, and power is dangerous when you don't know
              what you're invoking. As an orchestrator, your superpower is
              healthy skepticism of commands you didn't write.
            </>
          }
        />
      </LayerSection>

      <LayerSection layer="gate">
        <MasteryCheck
          lessonN={6}
          questions={[
            {
              kind: "mcq",
              prompt: "What's the difference between a terminal and a shell?",
              options: [
                "They're the same thing.",
                "The terminal is the application window; the shell is the program inside that runs commands.",
                "The terminal is for Linux; the shell is for macOS.",
                "Shells are slower than terminals.",
              ],
              answer: 1,
              explanation:
                "Terminal = window. Shell = brain inside. Bash, zsh, fish are shells.",
            },
            {
              kind: "fill",
              prompt:
                "The cycle of read → evaluate → print → loop that the shell runs is called by what four-letter acronym?",
              answers: ["REPL", "repl"],
              explanation:
                "REPL. Same pattern appears in Python, Node, SQL clients — anywhere you 'type a thing and see a result'.",
            },
            {
              kind: "multi",
              prompt: "Which of these are shells?",
              options: ["bash", "Terminal.app", "zsh", "fish", "iTerm2"],
              answer: [0, 2, 3],
              explanation:
                "bash/zsh/fish are shells. Terminal.app and iTerm2 are terminals (windows) — different category.",
            },
            {
              kind: "mcq",
              prompt:
                "Your AI agent gives you `curl https://random-site.com/install.sh | sudo bash`. What's the right reaction?",
              options: [
                "Paste and run it.",
                "Run it without sudo to be safe.",
                "Refuse — download the script first, READ it, then decide whether to run it.",
                "Email the script to yourself.",
              ],
              answer: 2,
              explanation:
                "`pipe | sudo bash` runs arbitrary downloaded code as root. Always read the script first.",
            },
            {
              kind: "mcq",
              prompt:
                "You're running a process in the terminal and it's stuck. Which key combination stops it?",
              options: ["Ctrl-Z", "Ctrl-C", "Ctrl-D", "Ctrl-S"],
              answer: 1,
              explanation:
                "Ctrl-C sends an 'interrupt' signal — the standard way to stop. (Ctrl-Z pauses; Ctrl-D closes the shell; Ctrl-S freezes the screen.)",
            },
          ]}
        />
      </LayerSection>
    </>
  );
}
