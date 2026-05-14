import { LayerSection } from "@/components/lesson/LayerSection";
import { ConceptCard } from "@/components/interactive/ConceptCard";
import { Diagram, DBox, DArrow } from "@/components/interactive/Diagram";
import { AntiPattern } from "@/components/interactive/AntiPattern";
import { WhereYoullSeeThis } from "@/components/interactive/WhereYoullSeeThis";
import { MasteryCheck } from "@/components/interactive/MasteryCheck";

export default function Lesson25() {
  return (
    <>
      <LayerSection layer="why">
        <p>
          Every project an AI agent builds for you will live inside a version
          control system. Every change it makes, every "I undid that" you ever
          ask for, every collaboration with another developer, every deploy —
          all of it routes through version control. Without a clear mental
          model, you'll fear destroying your own work whenever the agent
          suggests anything that touches Git.
        </p>
      </LayerSection>

      <LayerSection layer="model">
        <ConceptCard
          front={<>What is version control, in one sentence?</>}
          back={
            <p className="text-center text-lg">
              Version control is a <strong>time machine for your code</strong>:
              it records every change as a numbered snapshot so you can answer
              "what changed?", "when?", "by whom?", and "can we go back?"
              with confidence — and it lets many people work on the same code
              without overwriting each other.
            </p>
          }
        />

        <Diagram caption="Without version control, all you have is the current state. With it, every state in the project's history is one command away.">
          <div className="space-y-2 w-full max-w-md">
            <div className="marker">without version control</div>
            <DBox label="my-project/" tone="muted" sub="just the current version" />
            <div className="marker mt-4">with version control</div>
            <div className="flex items-center gap-2 flex-wrap">
              <DBox label="v1" tone="muted" sub="initial" />
              <DArrow direction="right" />
              <DBox label="v2" tone="muted" sub="added login" />
              <DArrow direction="right" />
              <DBox label="v3" tone="muted" sub="fixed login bug" />
              <DArrow direction="right" />
              <DBox label="v4" tone="accent" sub="HEAD" />
            </div>
          </div>
        </Diagram>
      </LayerSection>

      <LayerSection layer="concept">
        <h2>The four jobs version control does</h2>

        <h3>1. Records every change as a snapshot</h3>
        <p>
          Each time you decide "this is a meaningful state," you save a{" "}
          <strong>commit</strong> — a complete snapshot of every file in the
          project at that moment. Commits are stamped with who made them,
          when, and a message explaining why. The history is a chronologically
          ordered chain of these snapshots.
        </p>

        <h3>2. Lets you go back</h3>
        <p>
          Every snapshot is reachable. If an agent breaks something on Tuesday,
          you can compare against Monday's snapshot and see exactly which
          lines changed. You can revert one specific change without losing
          everything else.
        </p>

        <h3>3. Lets many people work in parallel</h3>
        <p>
          Two developers (or you + an AI agent) can each work on different
          features at the same time. Version control merges their changes
          intelligently. If both edited the same line, it flags a{" "}
          <strong>conflict</strong> for a human to resolve (lesson 31).
        </p>

        <h3>4. Tells you who did what and why</h3>
        <p>
          Every commit has an author and a message. Six months from now, when
          you wonder "why is this line of code here?", the commit message tells
          you. This is gold during incidents.
        </p>

        <h2>The two flavors</h2>
        <ul>
          <li>
            <strong>Centralized</strong> (older — SVN, Perforce): one central
            server holds the history. You "check out" files from it.
          </li>
          <li>
            <strong>Distributed</strong> (modern — Git, Mercurial): every clone
            has the full history. You can work offline, branch fearlessly,
            sync when ready. <strong>Git is by far the dominant choice
            today.</strong>
          </li>
        </ul>
        <p>
          In 2026 you can assume "version control" means Git unless told
          otherwise.
        </p>

        <h2>What "no version control" actually looks like</h2>
        <p>
          You've seen it: <code>project-final.zip</code>,{" "}
          <code>project-final-FINAL.zip</code>,{" "}
          <code>project-final-FINAL-v2-use-this-one.zip</code>. That's the
          poor person's version control — a manual, error-prone shadow of
          what Git does properly with one command.
        </p>
      </LayerSection>

      <LayerSection layer="context">
        <WhereYoullSeeThis
          items={[
            { context: "Every AI agent assumes it's working inside a Git repo. The very first move on a new project is usually `git init`." },
            { file: "git log", context: "Reading the project's history. The most-used Git command after status." },
            { file: ".git/", context: "The hidden folder Git creates in every repo to store the entire history. Don't touch it directly." },
            { context: "An agent says 'I'll commit that change' — it's marking the current state as a permanent snapshot in the history." },
            { context: "Production incidents often start with 'when did this break?' — `git log --since=...` answers it." },
          ]}
        />

        <AntiPattern
          bad={{
            title: "Sending zip files around instead of using version control",
            body: (
              <>
                The agent says "I'll just email you the latest folder." You
                lose every benefit of Git: no history, no diffs, no merges,
                no parallel work. The next change collides with whatever
                you've done locally.
              </>
            ),
          }}
          good={{
            title: "Always work inside a Git repo, even for tiny experiments",
            body: (
              <>
                <code>git init</code> takes one second. From the first line of
                code on, every change is recoverable. Throwaway scripts
                become studyable; lost work becomes findable.
              </>
            ),
          }}
          why={
            <>
              The cost of starting a Git repo is essentially zero. The cost
              of NOT having one shows up the first time you need to know
              what changed yesterday. Make Git the default for every
              project.
            </>
          }
        />
      </LayerSection>

      <LayerSection layer="gate">
        <MasteryCheck
          lessonN={25}
          questions={[
            {
              kind: "mcq",
              prompt: "What is version control, in one sentence?",
              options: [
                "A way to compress files.",
                "A system that records every change to a set of files as a sequence of snapshots, lets you go back, and lets many people work in parallel without overwriting each other.",
                "A type of cloud storage.",
                "A coding language.",
              ],
              answer: 1,
              explanation:
                "Snapshots + history + parallel work + answer 'who/when/why'. Those are the four jobs.",
            },
            {
              kind: "multi",
              prompt:
                "Which of these problems does version control solve?",
              options: [
                "Recovering an accidentally deleted file from last week.",
                "Two developers working on the same project at the same time.",
                "Knowing who wrote a line of code and why.",
                "Compiling TypeScript to JavaScript.",
                "Reverting a change that broke production.",
              ],
              answer: [0, 1, 2, 4],
              explanation:
                "Compiling is unrelated. Everything else is exactly what Git is built for.",
            },
            {
              kind: "fill",
              prompt:
                "In 2026, the dominant version control system — the one your AI agents assume by default — is named what?",
              answers: ["Git", "git"],
              explanation:
                "Git. Created by Linus Torvalds in 2005 for the Linux kernel; now the universal default.",
            },
            {
              kind: "mcq",
              prompt:
                "What's the difference between centralized and distributed version control?",
              options: [
                "Centralized is faster.",
                "Centralized has one server holding the history; distributed gives every clone the full history. Git is distributed.",
                "Distributed only works in the cloud.",
                "They're the same.",
              ],
              answer: 1,
              explanation:
                "Distributed = every clone is a full backup. You can work offline, branch fearlessly, sync later.",
            },
            {
              kind: "mcq",
              prompt:
                "Your AI agent emails you `project-final-v3.zip` and says 'here are the latest changes.' What's the orchestrator's response?",
              options: [
                "Approve — easy way to share files.",
                "Reject. Insist on working inside a Git repo. Otherwise there's no history, no diff, no merge, and the next change overwrites this one.",
                "Rename the zip to be smaller.",
                "Save it to Dropbox.",
              ],
              answer: 1,
              explanation:
                "Zips are version control's anti-pattern. Git everything from line one.",
            },
          ]}
        />
      </LayerSection>
    </>
  );
}
