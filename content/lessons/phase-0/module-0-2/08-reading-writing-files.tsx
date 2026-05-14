import { LayerSection } from "@/components/lesson/LayerSection";
import { ConceptCard } from "@/components/interactive/ConceptCard";
import { TerminalSim } from "@/components/interactive/TerminalSim";
import { AntiPattern } from "@/components/interactive/AntiPattern";
import { WhereYoullSeeThis } from "@/components/interactive/WhereYoullSeeThis";
import { MasteryCheck } from "@/components/interactive/MasteryCheck";

export default function Lesson08() {
  return (
    <>
      <LayerSection layer="why">
        <p>
          Half of debugging is reading config files, logs, and the output an
          agent says it created. Knowing how to view a file's contents in the
          terminal — without leaving for a code editor — means you can verify
          claims quickly. The four commands below are constantly used.
        </p>
      </LayerSection>

      <LayerSection layer="model">
        <ConceptCard
          front={<>How do you read a file from the terminal?</>}
          back={
            <p className="text-center text-lg">
              For short files: <code>cat</code> dumps the whole thing.<br />
              For long files: <code>less</code> opens a scrollable viewer.<br />
              For just the start: <code>head</code>. For just the end:{" "}
              <code>tail</code>.
            </p>
          }
        />
      </LayerSection>

      <LayerSection layer="concept">
        <h2>The four readers</h2>
        <TerminalSim
          title="reading files"
          lines={[
            { kind: "cmd", text: "cat package.json", annotate: "dump whole file" },
            { kind: "out", text: `{ "name": "my-app", "version": "0.1.0", ... }` },

            { kind: "cmd", text: "head -n 5 server.log", annotate: "first 5 lines" },
            { kind: "cmd", text: "tail -n 20 server.log", annotate: "last 20 lines" },
            { kind: "cmd", text: "tail -f server.log",   annotate: "follow — live updates" },

            { kind: "cmd", text: "less server.log",       annotate: "open in a pager (q to quit)" },
          ]}
        />

        <h2>Writing files quickly</h2>
        <p>
          <code>echo</code> prints text. Combined with <code>{">"}</code>{" "}
          (redirection — lesson 12) it writes to a file:
        </p>
        <TerminalSim
          title="writing files"
          lines={[
            { kind: "cmd", text: `echo "hello, world" > greeting.txt`, annotate: "overwrite file" },
            { kind: "cmd", text: `echo "another line" >> greeting.txt`, annotate: "append to file" },
            { kind: "cmd", text: `cat greeting.txt` },
            { kind: "out", text: "hello, world" },
            { kind: "out", text: "another line" },
          ]}
        />

        <h2>For actual editing: nano or vim</h2>
        <p>
          When you need to edit a file in the terminal (without leaving for VS
          Code), the two universal options are:
        </p>
        <ul>
          <li>
            <strong>nano</strong> — friendly. The bottom of the screen tells
            you how to save (<code>Ctrl-O</code>) and exit (<code>Ctrl-X</code>).
            Use this on day 1.
          </li>
          <li>
            <strong>vim</strong> — power-user, infamous learning curve. You'll
            see it everywhere on remote servers. The one thing to memorize:
            press <code>Esc</code>, type <code>:q!</code>, hit Enter. That
            exits without saving — and gets you out of vim if you opened it
            by accident.
          </li>
        </ul>

        <h2>The "follow logs" trick</h2>
        <p>
          <code>tail -f some.log</code> keeps the file open and prints new lines
          as they're written. This is how every developer watches their server
          logs in real time. Press Ctrl-C when done.
        </p>
      </LayerSection>

      <LayerSection layer="context">
        <WhereYoullSeeThis
          items={[
            { file: "cat .env", context: "Quick check of what env vars are defined locally." },
            { file: "tail -f logs/dev.log", context: "Live-tail the dev log while reproducing a bug." },
            { file: "less node_modules/.package-lock.json", context: "Browse a huge file without loading it all into your editor." },
            { context: "An agent says 'cat the dockerfile and confirm the base image' — they want a quick read, not an open in editor." },
          ]}
        />

        <AntiPattern
          bad={{
            title: "Catting an enormous log file",
            body: (
              <>
                <code>cat /var/log/syslog</code> on a 2GB log dumps everything
                to your terminal, freezes the session for minutes, and you
                can't read a single line in the blur.
              </>
            ),
          }}
          good={{
            title: "Use head/tail/less for large files",
            body: (
              <>
                <code>tail -n 200 /var/log/syslog</code> shows the last 200
                lines. <code>less /var/log/syslog</code> opens a pageable
                viewer. Both are kind to your terminal.
              </>
            ),
          }}
          why={
            <>
              `cat` is for short files. Reading 2GB into the terminal is the
              fastest way to lose 30 seconds and your scroll history.
            </>
          }
        />
      </LayerSection>

      <LayerSection layer="gate">
        <MasteryCheck
          lessonN={8}
          questions={[
            {
              kind: "mcq",
              prompt: "Which command shows the LAST 20 lines of a file?",
              options: ["head -n 20", "tail -n 20", "less -20", "cat -20"],
              answer: 1,
              explanation: "`tail -n N` shows the last N lines. `head -n N` shows the first N.",
            },
            {
              kind: "mcq",
              prompt: "What does `tail -f file.log` do?",
              options: [
                "Shows the file then exits.",
                "Shows the end of the file AND keeps watching, printing new lines as they're written.",
                "Deletes the file.",
                "Opens the file for editing.",
              ],
              answer: 1,
              explanation:
                "The `-f` (follow) flag is how every developer live-tails logs.",
            },
            {
              kind: "fill",
              prompt:
                "What redirection symbol APPENDS output to a file (instead of overwriting)?",
              answers: [">>", ">> "],
              placeholder: "the symbol",
              explanation: "Single `>` overwrites. Double `>>` appends.",
            },
            {
              kind: "mcq",
              prompt:
                "You accidentally opened a file with `vim` over SSH and have no idea how to exit. What do you do?",
              options: [
                "Close the terminal window.",
                "Press Esc, type `:q!` and hit Enter.",
                "Type 'exit'.",
                "Press Ctrl-C.",
              ],
              answer: 1,
              explanation:
                "`:q!` quits vim without saving. The most-Googled question on Stack Overflow.",
            },
            {
              kind: "mcq",
              prompt:
                "You're debugging a slow server. The log file is 4GB. Best first command?",
              options: [
                "cat server.log",
                "less server.log to open a pager, or tail -n 500 to see the most recent activity",
                "Open it in VS Code",
                "Delete the log",
              ],
              answer: 1,
              explanation:
                "`cat` would freeze your terminal. `less` and `tail` are designed for large files.",
            },
          ]}
        />
      </LayerSection>
    </>
  );
}
