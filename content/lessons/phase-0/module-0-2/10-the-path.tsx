import { LayerSection } from "@/components/lesson/LayerSection";
import { ConceptCard } from "@/components/interactive/ConceptCard";
import { TerminalSim } from "@/components/interactive/TerminalSim";
import { AntiPattern } from "@/components/interactive/AntiPattern";
import { WhereYoullSeeThis } from "@/components/interactive/WhereYoullSeeThis";
import { MasteryCheck } from "@/components/interactive/MasteryCheck";

export default function Lesson10() {
  return (
    <>
      <LayerSection layer="why">
        <p>
          "command not found" is the world's most-Googled error. Almost every
          single instance is a PATH problem. Once you understand PATH, you'll
          stop fearing this error — and stop blindly running install scripts
          that "fix" it by appending to your shell config.
        </p>
      </LayerSection>

      <LayerSection layer="model">
        <ConceptCard
          front={<>What is the PATH?</>}
          back={
            <p className="text-center text-lg">
              <code>PATH</code> is an environment variable holding a list of
              folders, separated by <code>:</code> on Unix. When you type a
              command name, the shell searches those folders in order for an
              executable with that name. <strong>No match = "command not
              found".</strong>
            </p>
          }
        />
      </LayerSection>

      <LayerSection layer="concept">
        <h2>Watch it happen</h2>
        <TerminalSim
          title="PATH at work"
          lines={[
            { kind: "cmd", text: "echo $PATH", annotate: "the PATH itself" },
            { kind: "out", text: "/usr/local/bin:/usr/bin:/bin:/Users/you/.npm/bin" },

            { kind: "cmd", text: "which git", annotate: "where does the shell find 'git'?" },
            { kind: "out", text: "/usr/bin/git" },

            { kind: "cmd", text: "which python" },
            { kind: "out", text: "/usr/local/bin/python" },

            { kind: "cmd", text: "fakecmd" },
            { kind: "err", text: "bash: fakecmd: command not found" },
            { kind: "note", text: "fakecmd doesn't exist anywhere on PATH" },
          ]}
        />

        <h2>How the search works</h2>
        <p>
          Suppose <code>PATH=/usr/local/bin:/usr/bin:/bin</code> and you type{" "}
          <code>git</code>. The shell:
        </p>
        <ol>
          <li>Looks for <code>/usr/local/bin/git</code>. Not there? Continue.</li>
          <li>Looks for <code>/usr/bin/git</code>. Found! Runs it.</li>
        </ol>
        <p>
          If <code>git</code> existed in both folders, the first match wins.
          Order matters.
        </p>

        <h2>Why this comes up</h2>
        <ul>
          <li>
            You installed a tool but its install folder isn't on PATH. The OS
            can't find it.
          </li>
          <li>
            Two versions of the same tool exist (Python 2 and Python 3, two
            Node versions). The PATH order decides which one runs.
          </li>
          <li>
            You added the tool to PATH in one terminal window but not the
            other (you didn't reload your shell config).
          </li>
        </ul>

        <h2>Adding to PATH</h2>
        <p>
          To permanently add a folder, append a line to your shell's startup
          file (<code>~/.zshrc</code> for zsh, <code>~/.bashrc</code> or
          <code> ~/.bash_profile</code> for bash):
        </p>
        <pre>export PATH="$HOME/.local/bin:$PATH"</pre>
        <p>
          Reload the shell with <code>source ~/.zshrc</code> or just open a new
          terminal.
        </p>

        <h2>The two commands that tell you what's happening</h2>
        <ul>
          <li>
            <code>which command</code> — prints the path to the executable
            that would run. If nothing prints, the command isn't on PATH.
          </li>
          <li>
            <code>echo $PATH</code> — see the current PATH.
          </li>
        </ul>
      </LayerSection>

      <LayerSection layer="context">
        <WhereYoullSeeThis
          items={[
            { context: "An npm install puts a `cli` binary in `./node_modules/.bin/` — npm scripts find it via that folder being temporarily added to PATH." },
            { context: "A new Node install via nvm changes which `node` is found first when you switch versions." },
            { context: "Your AI agent installs a tool and says 'add this to your PATH' — it means: append a line to .zshrc and reload." },
            { file: "/usr/local/bin", context: "Where macOS Homebrew installs binaries (or /opt/homebrew on Apple Silicon)." },
            { context: "On a server, a binary you compiled might live in `/home/you/bin` — needs to be added to PATH or called by full path." },
          ]}
        />

        <AntiPattern
          bad={{
            title: "Adding `.` to PATH 'for convenience'",
            body: (
              <>
                Some scripts suggest <code>export PATH=".:$PATH"</code> so you can
                run programs in the current folder by name. Now if you{" "}
                <code>cd</code> into an untrusted folder and type{" "}
                <code>ls</code>, you might run <em>their</em>{" "}
                <code>ls</code> instead of the real one.
              </>
            ),
          }}
          good={{
            title: "Run local programs with `./program`",
            body: (
              <>
                The leading <code>./</code> tells the shell exactly which file
                to run — no PATH search, no risk of a malicious local file
                shadowing a system command.
              </>
            ),
          }}
          why={
            <>
              Putting `.` on PATH is a classic Unix security mistake. The
              `./prog` syntax is explicit about what you're invoking and only
              costs you two characters.
            </>
          }
        />
      </LayerSection>

      <LayerSection layer="gate">
        <MasteryCheck
          lessonN={10}
          questions={[
            {
              kind: "mcq",
              prompt: "What does the PATH environment variable contain?",
              options: [
                "The current folder.",
                "A colon-separated list of folders the shell searches to find executables when you type a command.",
                "Your home folder.",
                "The location of the Linux kernel.",
              ],
              answer: 1,
              explanation:
                "List of folders. When you type a name, the shell checks each folder in order.",
            },
            {
              kind: "mcq",
              prompt:
                "You install a tool and `which mytool` prints nothing. What happens when you type `mytool`?",
              options: [
                "It runs.",
                "It prints `command not found`.",
                "It runs slowly.",
                "It opens the file in vim.",
              ],
              answer: 1,
              explanation:
                "If `which` finds nothing, the shell can't find it either. Need to add its folder to PATH.",
            },
            {
              kind: "fill",
              prompt:
                "On Unix, what single character separates the folders inside the PATH variable?",
              answers: [":"],
              placeholder: "one character",
              explanation:
                "Colon. Example: `/usr/local/bin:/usr/bin:/bin`. (Windows uses `;` instead.)",
            },
            {
              kind: "mcq",
              prompt:
                "You installed a new version of Python with Homebrew, but `python --version` still shows the old version. What is likely the cause?",
              options: [
                "The new Python is broken.",
                "The old Python's folder appears EARLIER in PATH, so it wins the search.",
                "Homebrew installs are slow.",
                "You need to reboot.",
              ],
              answer: 1,
              explanation:
                "First match wins. You need to reorder PATH so Homebrew's folder comes first, or call the new Python by full path.",
            },
            {
              kind: "mcq",
              prompt:
                "Why is adding `.` (the current folder) to PATH considered a security mistake?",
              options: [
                "It's slower.",
                "If you cd into an untrusted folder, an attacker's local file can shadow a system command (e.g. their `ls` runs when you type `ls`).",
                "It uses more memory.",
                "It breaks bash.",
              ],
              answer: 1,
              explanation:
                "Yes. `./prog` to run local programs is explicit and safe. Adding `.` to PATH is implicit and dangerous.",
            },
          ]}
        />
      </LayerSection>
    </>
  );
}
