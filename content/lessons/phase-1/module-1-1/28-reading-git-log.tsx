import { LayerSection } from "@/components/lesson/LayerSection";
import { ConceptCard } from "@/components/interactive/ConceptCard";
import { TerminalSim } from "@/components/interactive/TerminalSim";
import { AntiPattern } from "@/components/interactive/AntiPattern";
import { WhereYoullSeeThis } from "@/components/interactive/WhereYoullSeeThis";
import { MasteryCheck } from "@/components/interactive/MasteryCheck";

export default function Lesson28() {
  return (
    <>
      <LayerSection layer="why">
        <p>
          When something breaks, "when did this change?" is the first question
          you ask. <code>git log</code> answers it. As an orchestrator you'll
          read more Git history than you write. The four log incantations
          below cover almost every investigation you'll do.
        </p>
      </LayerSection>

      <LayerSection layer="model">
        <ConceptCard
          front={<>What is `git log`?</>}
          back={
            <p className="text-center text-lg">
              A reverse-chronological list of every commit reachable from
              where you are now. Each entry shows the commit hash, author,
              date, and message. With flags, you can filter by file, author,
              time range, or content.
            </p>
          }
        />
      </LayerSection>

      <LayerSection layer="concept">
        <h2>The default — readable but long</h2>

        <TerminalSim
          title="git log"
          lines={[
            { kind: "cmd", text: "git log" },
            { kind: "out", text: "commit a1b2c3d4e5f6... (HEAD -> main)" },
            { kind: "out", text: "Author: Ada Lovelace <ada@example.com>" },
            { kind: "out", text: "Date:   Wed May 14 10:42:00 2026 +0530" },
            { kind: "out", text: "" },
            { kind: "out", text: "    fix N+1 query on user dashboard" },
            { kind: "out", text: "" },
            { kind: "out", text: "commit 9f8e7d6c5b4a..." },
            { kind: "out", text: "Author: Ada Lovelace <ada@example.com>" },
            { kind: "out", text: "Date:   Wed May 14 09:15:00 2026 +0530" },
            { kind: "out", text: "" },
            { kind: "out", text: "    add login form validation" },
            { kind: "note", text: "press q to exit the pager" },
          ]}
        />

        <h2>The four flags worth memorizing</h2>

        <h3>1. --oneline — compact view</h3>
        <pre>{`$ git log --oneline
a1b2c3d (HEAD -> main) fix N+1 query on user dashboard
9f8e7d6 add login form validation
b3c4d5e initial commit`}</pre>

        <h3>2. --graph — show branch structure</h3>
        <pre>{`$ git log --oneline --graph --all
* a1b2c3d (HEAD -> main) fix N+1 query
* 9f8e7d6 add login form validation
| * 7e6d5c4 (feat/oauth) wip: oauth scaffolding
|/
* b3c4d5e initial commit`}</pre>
        <p>
          The asterisks and lines show branches and merges. The most useful
          single command for understanding history.
        </p>

        <h3>3. -- &lt;file&gt; — history of one file</h3>
        <pre>{`$ git log --oneline -- app/page.tsx
a1b2c3d fix N+1 query
8e9f0a1 refactor page layout
b3c4d5e initial commit`}</pre>
        <p>
          Every change that touched <code>app/page.tsx</code>. Pure gold when
          something broke in one file.
        </p>

        <h3>4. -S "string" — find commits that added/removed a string</h3>
        <pre>{`$ git log -S "DELETE_USER" --oneline
a1b2c3d add admin user deletion endpoint`}</pre>
        <p>
          This is the "where did this code come from?" search. Pickaxe in
          Git slang.
        </p>

        <h2>Other useful incantations</h2>
        <ul>
          <li><code>git log --since="2 days ago"</code> — time-bounded.</li>
          <li><code>git log --author="ada"</code> — by author.</li>
          <li><code>git log -p</code> — show the actual diff in each commit.</li>
          <li><code>git log --stat</code> — show files changed and line counts.</li>
        </ul>

        <h2>git show — zoom into one commit</h2>
        <p>
          <code>git show a1b2c3d</code> shows that one commit's metadata AND
          the full diff. The most natural follow-up to a log entry that
          looks interesting.
        </p>

        <h2>git blame — who last touched each line</h2>
        <p>
          <code>git blame app/page.tsx</code> annotates every line with the
          commit that introduced it. The opposite question of git log:
          "starting from this line, when did it appear?"
        </p>
      </LayerSection>

      <LayerSection layer="context">
        <WhereYoullSeeThis
          items={[
            { file: "git log --oneline --graph --all", context: "The default 'show me the shape of history' invocation. Set it as a Git alias once and use forever." },
            { context: "During an incident: `git log --since=\"6 hours ago\" --oneline` shows everything that landed before the breakage." },
            { file: "git blame -L 42,50 app/page.tsx", context: "Show who last touched lines 42-50. Used in code review and bug-hunting." },
            { context: "An agent says 'I'll find the commit that introduced this' — they're running git log -S or git blame." },
            { context: "GitHub's web UI is essentially git log + git show in pretty wrapping. Same operations." },
          ]}
        />

        <AntiPattern
          bad={{
            title: "Skimming the most recent commit and stopping there",
            body: (
              <>
                Something broke. The agent looks only at the last commit
                ("nothing weird here") and concludes the bug is older. But
                the breakage was caused by an interaction between two
                commits, both visible if you read history together.
              </>
            ),
          }}
          good={{
            title: "Read the relevant window of history, with context",
            body: (
              <>
                <code>git log --since="..." --oneline</code> for the time
                window. <code>git log -- &lt;file&gt;</code> for the file in
                question. <code>git show &lt;hash&gt;</code> for any commit
                that looks suspicious. Combine, don't isolate.
              </>
            ),
          }}
          why={
            <>
              Bugs often come from "this change was fine in isolation, but
              didn't account for THAT other change." History is the only
              place that knowledge lives.
            </>
          }
        />
      </LayerSection>

      <LayerSection layer="gate">
        <MasteryCheck
          lessonN={28}
          questions={[
            {
              kind: "mcq",
              prompt: "What does `git log --oneline` do?",
              options: [
                "Shows only one commit.",
                "Shows the commit history with one line per commit — short hash and message only.",
                "Combines all commits into one.",
                "Shows the most recent commit only.",
              ],
              answer: 1,
              explanation: "Compact view. Best for scrolling history quickly.",
            },
            {
              kind: "mcq",
              prompt:
                "How would you see every commit that EVER touched the file `app/api/users/route.ts`?",
              options: [
                "git log",
                "git log -- app/api/users/route.ts",
                "git blame route.ts",
                "git show route.ts",
              ],
              answer: 1,
              explanation:
                "The `--` separates revisions from paths; everything after is a file filter.",
            },
            {
              kind: "fill",
              prompt:
                "Which `git log` flag lets you search for commits that added or removed a specific string (e.g. 'DELETE_USER')?",
              answers: ["-S", "-s"],
              placeholder: "single flag",
              explanation:
                "`git log -S \"DELETE_USER\"`. Called the 'pickaxe.' Best command for 'where did this code come from?'",
            },
            {
              kind: "mcq",
              prompt: "What does `git blame app/page.tsx` show?",
              options: [
                "An angry message.",
                "Every line in the file annotated with the commit (and author) that last modified it.",
                "Errors in the file.",
                "A list of bugs.",
              ],
              answer: 1,
              explanation:
                "Line-by-line attribution. Standard tool when you're staring at code asking 'why is this here?'",
            },
            {
              kind: "mcq",
              prompt:
                "An AI agent introduces a bug and you need to find when a specific function was first added. Best command?",
              options: [
                "git status",
                "git log --oneline (read every commit hoping you spot it)",
                "git log -S \"functionName\" --oneline (pickaxe directly to commits that touched that string)",
                "git diff",
              ],
              answer: 2,
              explanation:
                "The pickaxe is the precise tool for 'find the commit that introduced this code.'",
            },
          ]}
        />
      </LayerSection>
    </>
  );
}
