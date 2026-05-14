import { LayerSection } from "@/components/lesson/LayerSection";
import { ConceptCard } from "@/components/interactive/ConceptCard";
import { TerminalSim } from "@/components/interactive/TerminalSim";
import { Diagram, DBox, DArrow } from "@/components/interactive/Diagram";
import { AntiPattern } from "@/components/interactive/AntiPattern";
import { WhereYoullSeeThis } from "@/components/interactive/WhereYoullSeeThis";
import { MasteryCheck } from "@/components/interactive/MasteryCheck";

export default function Lesson12() {
  return (
    <>
      <LayerSection layer="why">
        <p>
          Piping is what makes the terminal feel like superpowers instead of
          typing. Almost every elegant command an agent shares — searching
          logs, filtering processes, counting lines — is built from small tools
          composed with pipes. Once you get this, your shell vocabulary
          quintuples overnight.
        </p>
      </LayerSection>

      <LayerSection layer="model">
        <ConceptCard
          front={<>What does the <code>|</code> symbol do?</>}
          back={
            <p className="text-center text-lg">
              <code>A | B</code> means "send A's output as B's input." Programs
              become Lego bricks. Each one does one tiny job; pipes connect
              them into pipelines.
            </p>
          }
        />

        <Diagram caption="The pipe model. A's stdout becomes B's stdin. Nothing exotic — just connected hoses.">
          <div className="flex items-center gap-3 flex-wrap justify-center">
            <DBox label="cat log" tone="info" sub="reads file" />
            <DArrow direction="right" label="|" />
            <DBox label="grep ERROR" tone="warn" sub="filters lines" />
            <DArrow direction="right" label="|" />
            <DBox label="wc -l" tone="accent" sub="counts" />
          </div>
        </Diagram>
      </LayerSection>

      <LayerSection layer="concept">
        <h2>The three streams every program has</h2>
        <ul>
          <li>
            <strong>stdin</strong> — input. Where the program reads from.
          </li>
          <li>
            <strong>stdout</strong> — normal output. Where regular results go.
          </li>
          <li>
            <strong>stderr</strong> — error output. Where error messages go.
            Separate so you can mute one without losing the other.
          </li>
        </ul>

        <h2>Pipes (|) — connect stdout to stdin</h2>
        <TerminalSim
          title="composing little tools"
          lines={[
            { kind: "cmd", text: "ls", annotate: "what's here?" },
            { kind: "out", text: "app.js  data.json  package.json  README.md" },

            { kind: "cmd", text: "ls | wc -l", annotate: "how many things?" },
            { kind: "out", text: "4" },

            { kind: "cmd", text: "cat server.log | grep ERROR", annotate: "only ERROR lines" },
            { kind: "out", text: "[2026-05-14 09:22] ERROR: connection refused" },

            { kind: "cmd", text: "cat server.log | grep ERROR | wc -l", annotate: "count errors" },
            { kind: "out", text: "3" },

            { kind: "cmd", text: "ps aux | grep node", annotate: "find node processes" },
            { kind: "out", text: "you  4127  2.1  3.4  node server.js" },
          ]}
        />

        <h2>Redirection (&gt;, &gt;&gt;, &lt;) — talk to files</h2>
        <ul>
          <li>
            <code>cmd &gt; file</code> — overwrite <code>file</code> with cmd's output.
          </li>
          <li>
            <code>cmd &gt;&gt; file</code> — append cmd's output to <code>file</code>.
          </li>
          <li>
            <code>cmd &lt; file</code> — feed <code>file</code> into cmd as input.
          </li>
          <li>
            <code>cmd 2&gt; file</code> — redirect errors (stderr) instead of stdout.
          </li>
          <li>
            <code>cmd &amp;&gt; file</code> — redirect BOTH stdout and stderr.
          </li>
        </ul>

        <h2>The five small tools you'll combine constantly</h2>
        <table>
          <thead><tr><th>Tool</th><th>What it does</th></tr></thead>
          <tbody>
            <tr><td><code>grep PATTERN</code></td><td>Print only lines matching the pattern.</td></tr>
            <tr><td><code>wc -l</code></td><td>Count lines.</td></tr>
            <tr><td><code>sort</code></td><td>Sort lines alphabetically (or numerically with <code>-n</code>).</td></tr>
            <tr><td><code>uniq</code></td><td>Remove duplicates (requires sorted input).</td></tr>
            <tr><td><code>head / tail</code></td><td>First / last N lines.</td></tr>
          </tbody>
        </table>

        <h2>Putting it together — the classic pipeline</h2>
        <pre>cat server.log | grep ERROR | sort | uniq -c | sort -rn | head -n 10</pre>
        <p>
          Read out loud: <em>"Take the log, keep ERROR lines, sort them,
          collapse duplicates with counts, sort by count descending, show the
          top 10."</em> A complete log analysis in one line.
        </p>
      </LayerSection>

      <LayerSection layer="context">
        <WhereYoullSeeThis
          items={[
            { file: "docker logs my-app | grep -i exception | tail -n 50", context: "Classic incident command — last 50 exceptions from a container." },
            { file: "npm ls --depth=0 | grep react", context: "Quickly see which top-level deps mention react." },
            { file: "history | grep deploy", context: "Find every time you ran a deploy command in this shell." },
            { context: "An agent suggests `command 2>&1 | tee out.log` — redirect stderr to stdout, save the whole thing to a file AND print to screen. Standard for capturing complex command output." },
          ]}
        />

        <AntiPattern
          bad={{
            title: "Catting a file just to pipe it",
            body: (
              <>
                <code>cat file.txt | grep error</code>. The <code>cat</code> is
                unnecessary. <code>grep</code> can read the file directly.
              </>
            ),
          }}
          good={{
            title: "Let tools read files directly when they can",
            body: (
              <>
                <code>grep error file.txt</code>. One less process, one less
                pipe. Same result.
              </>
            ),
          }}
          why={
            <>
              Called "UUOC" (Useless Use of Cat). Doesn't matter for one-shot
              commands, but as you start writing scripts, knowing what each
              tool can do on its own keeps pipelines clean.
            </>
          }
        />
      </LayerSection>

      <LayerSection layer="gate">
        <MasteryCheck
          lessonN={12}
          questions={[
            {
              kind: "mcq",
              prompt: "What does `A | B` do?",
              options: [
                "Runs A and then B independently.",
                "Sends A's standard output as B's standard input.",
                "Stops A when B finishes.",
                "Runs them in two terminals.",
              ],
              answer: 1,
              explanation:
                "Pipe = connect stdout to stdin. Tiny tools combine into big pipelines.",
            },
            {
              kind: "mcq",
              prompt:
                "Which symbol APPENDS to a file (instead of overwriting it)?",
              options: ["|", ">", ">>", "<"],
              answer: 2,
              explanation:
                "`>` overwrites, `>>` appends. Memorize both.",
            },
            {
              kind: "fill",
              prompt: "What tiny command counts the number of LINES in its input?",
              answers: ["wc -l", "wc-l"],
              placeholder: "two words",
              explanation:
                "`wc` = word count, `-l` = lines flag. Classic pipeline finale.",
            },
            {
              kind: "mcq",
              prompt:
                "Read this pipeline: `tail -n 10000 access.log | grep ' 500 ' | wc -l`. What does it do?",
              options: [
                "Counts every line in the file.",
                "Counts how many of the last 10,000 lines in access.log returned a HTTP 500 error.",
                "Deletes 500-level errors.",
                "Sorts the log.",
              ],
              answer: 1,
              explanation:
                "Last 10k lines → keep ones containing ' 500 ' → count them. Common ops incantation.",
            },
            {
              kind: "multi",
              prompt:
                "Which of these are the THREE standard streams every program has?",
              options: ["stdin", "stdgo", "stdout", "stderr", "stdpipe"],
              answer: [0, 2, 3],
              explanation:
                "stdin (input), stdout (normal output), stderr (errors). The other two are made up.",
            },
          ]}
        />
      </LayerSection>
    </>
  );
}
