import { LayerSection } from "@/components/lesson/LayerSection";
import { ConceptCard } from "@/components/interactive/ConceptCard";
import { TerminalSim } from "@/components/interactive/TerminalSim";
import { AntiPattern } from "@/components/interactive/AntiPattern";
import { WhereYoullSeeThis } from "@/components/interactive/WhereYoullSeeThis";
import { MasteryCheck } from "@/components/interactive/MasteryCheck";

export default function Lesson07() {
  return (
    <>
      <LayerSection layer="why">
        <p>
          You will spend half of every terminal session navigating folders.
          The seven commands in this lesson are the muscle memory of every
          developer alive — including your AI agent. Once these are reflexes
          you'll never feel lost in a project again.
        </p>
      </LayerSection>

      <LayerSection layer="model">
        <ConceptCard
          front={<>What does "navigating the filesystem in a terminal" mean?</>}
          back={
            <p className="text-center text-lg">
              The shell always has a <strong>current working directory</strong>{" "}
              — the folder it's "in." All commands run relative to that
              folder. Navigating = moving the shell from one folder to another.
            </p>
          }
        />
      </LayerSection>

      <LayerSection layer="concept">
        <h2>The seven commands</h2>

        <TerminalSim
          title="navigation, in seven commands"
          lines={[
            { kind: "cmd", text: "pwd", annotate: "where am I?" },
            { kind: "out", text: "/home/you" },

            { kind: "cmd", text: "ls", annotate: "what's here?" },
            { kind: "out", text: "Desktop  Documents  Downloads  projects" },

            { kind: "cmd", text: "ls -la", annotate: "show hidden + details" },
            { kind: "out", text: "drwxr-xr-x   8 you you  4096 May 14 09:22 ." },
            { kind: "out", text: "drwxr-xr-x   3 root root 4096 May  1 12:00 .." },
            { kind: "out", text: "-rw-r--r--   1 you you   220 May 14 09:22 .bashrc" },
            { kind: "out", text: "drwxr-xr-x   4 you you  4096 May 14 09:22 projects" },

            { kind: "cmd", text: "cd projects", annotate: "move into the projects folder" },
            { kind: "cmd", text: "pwd" },
            { kind: "out", text: "/home/you/projects" },

            { kind: "cmd", text: "mkdir my-app", annotate: "create a folder" },
            { kind: "cmd", text: "cd my-app" },

            { kind: "cmd", text: "touch README.md", annotate: "create an empty file" },
            { kind: "cmd", text: "ls" },
            { kind: "out", text: "README.md" },

            { kind: "cmd", text: "cp README.md README.backup.md", annotate: "copy file" },
            { kind: "cmd", text: "mv README.backup.md docs.md",   annotate: "rename / move" },
            { kind: "cmd", text: "rm docs.md",                    annotate: "delete (careful — no undo)" },

            { kind: "cmd", text: "cd ..", annotate: "go up one folder" },
            { kind: "cmd", text: "cd ~",  annotate: "go home" },
          ]}
        />

        <h2>Read this table once. Refer back forever.</h2>
        <table>
          <thead>
            <tr><th>Command</th><th>Stands for</th><th>What it does</th></tr>
          </thead>
          <tbody>
            <tr><td><code>pwd</code></td><td>print working directory</td><td>Show the current folder.</td></tr>
            <tr><td><code>ls</code></td><td>list</td><td>List files in the current (or given) folder.</td></tr>
            <tr><td><code>cd</code></td><td>change directory</td><td>Move into a folder.</td></tr>
            <tr><td><code>mkdir</code></td><td>make directory</td><td>Create a new folder.</td></tr>
            <tr><td><code>touch</code></td><td>—</td><td>Create an empty file (or update its modified time).</td></tr>
            <tr><td><code>cp</code></td><td>copy</td><td>Copy a file.</td></tr>
            <tr><td><code>mv</code></td><td>move</td><td>Move OR rename a file (same operation).</td></tr>
            <tr><td><code>rm</code></td><td>remove</td><td>Delete a file. <strong>No trash. No undo.</strong></td></tr>
          </tbody>
        </table>

        <h2>The three flags you'll use immediately</h2>
        <ul>
          <li><code>ls -a</code> — show hidden files (dotfiles).</li>
          <li><code>ls -l</code> — long format (size, owner, dates).</li>
          <li><code>ls -la</code> — both. Most common.</li>
        </ul>

        <h2>Tab completion is your best friend</h2>
        <p>
          Start typing a filename and press <strong>Tab</strong>. The shell
          completes it. If multiple matches, press Tab twice to see all
          options. This is how professionals type — never spell out long
          filenames.
        </p>
      </LayerSection>

      <LayerSection layer="context">
        <WhereYoullSeeThis
          items={[
            { file: "cd /var/log && tail -n 100 nginx/error.log", context: "Classic debugging incantation — go to log folder, show last 100 lines." },
            { file: "ls -lah node_modules | head", context: "Pipeline (lesson 12) — list, show top results, scope to one folder." },
            { context: "Every README's 'getting started' starts with `cd into the folder, then run npm install`." },
            { context: "Your AI agent will say 'now run `cd backend && npm run dev`' — same pattern: navigate, then act." },
          ]}
        />

        <AntiPattern
          bad={{
            title: "rm -rf with a variable that might be empty",
            body: (
              <>
                The agent writes <code>rm -rf $TMP_DIR/*</code> in a script. If{" "}
                <code>$TMP_DIR</code> is empty, this becomes <code>rm -rf /*</code> —
                which tries to delete the entire filesystem.
              </>
            ),
          }}
          good={{
            title: "Validate before destroying",
            body: (
              <>
                Check the variable is set and non-empty first. Or use{" "}
                <code>set -u</code> in bash to error on unset variables. Or
                prefer specific paths to wildcards.
              </>
            ),
          }}
          why={
            <>
              <code>rm -rf</code> deletes recursively and forcefully — no
              prompts, no trash. One bad variable and your project (or
              server) is gone. This is the most famous footgun in the Unix
              world.
            </>
          }
        />
      </LayerSection>

      <LayerSection layer="gate">
        <MasteryCheck
          lessonN={7}
          questions={[
            {
              kind: "fill",
              prompt: "Which two-letter command prints your current working directory?",
              answers: ["pwd"],
              explanation: "Print Working Directory.",
            },
            {
              kind: "mcq",
              prompt: "Which command would you use to RENAME a file?",
              options: ["rn", "cp", "mv", "rename"],
              answer: 2,
              explanation:
                "`mv` does both moving and renaming. Renaming is just a move to a new name in the same folder.",
            },
            {
              kind: "multi",
              prompt:
                "Which of these reveal hidden files in the current folder?",
              options: ["ls", "ls -a", "ls -la", "ls --hidden"],
              answer: [1, 2],
              explanation:
                "The `-a` flag shows all entries, including dotfiles. `ls --hidden` is not a real flag.",
            },
            {
              kind: "mcq",
              prompt:
                "You're at `/home/you/projects/app/src/components/` and you type `cd ../../..` — where are you now?",
              options: [
                "/home/you/projects/app/src",
                "/home/you/projects/app",
                "/home/you/projects",
                "/home/you",
              ],
              answer: 2,
              explanation:
                "Each `..` goes up one. Three of them = three levels up.",
            },
            {
              kind: "mcq",
              prompt:
                "An AI agent writes `rm -rf $BUILD_DIR/` in a deploy script and `$BUILD_DIR` ends up unset. What happens?",
              options: [
                "Nothing — bash refuses to run.",
                "The script becomes `rm -rf /` which attempts to recursively delete the entire filesystem.",
                "Bash auto-fills the variable.",
                "The deploy succeeds.",
              ],
              answer: 1,
              explanation:
                "This is the most famous Unix footgun. Always validate variables. `set -u` makes bash error on unset vars.",
            },
          ]}
        />
      </LayerSection>
    </>
  );
}
