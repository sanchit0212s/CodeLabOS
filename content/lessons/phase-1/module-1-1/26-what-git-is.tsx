import { LayerSection } from "@/components/lesson/LayerSection";
import { ConceptCard } from "@/components/interactive/ConceptCard";
import { Diagram, DBox, DArrow } from "@/components/interactive/Diagram";
import { TerminalSim } from "@/components/interactive/TerminalSim";
import { AntiPattern } from "@/components/interactive/AntiPattern";
import { WhereYoullSeeThis } from "@/components/interactive/WhereYoullSeeThis";
import { MasteryCheck } from "@/components/interactive/MasteryCheck";

export default function Lesson26() {
  return (
    <>
      <LayerSection layer="why">
        <p>
          Git's commands look cryptic if you don't have the underlying model.
          Once you do, almost every command is "obvious." This lesson gives
          you that model — the three areas, the commit graph, and the HEAD
          pointer. From here, every other Git lesson is just naming the moves.
        </p>
      </LayerSection>

      <LayerSection layer="model">
        <ConceptCard
          front={<>What is Git, structurally?</>}
          back={
            <p className="text-center text-lg">
              Git stores your project as a <strong>graph of commits</strong>.
              Each commit is a complete snapshot of every file, linked to its
              parent. Git's job is to <strong>move files between three
              areas</strong> — your working folder, the staging area, and
              the repository — and to navigate the graph.
            </p>
          }
        />

        <Diagram caption="The three areas. Files travel left to right as you save your work into history.">
          <div className="flex items-center gap-3 flex-wrap justify-center">
            <DBox label="Working Directory" tone="muted" sub="files you edit" />
            <DArrow direction="right" label="git add" />
            <DBox label="Staging Area" tone="warn" sub="changes queued for commit" />
            <DArrow direction="right" label="git commit" />
            <DBox label="Repository" tone="accent" sub=".git/ — permanent history" />
          </div>
        </Diagram>
      </LayerSection>

      <LayerSection layer="concept">
        <h2>The three areas in detail</h2>

        <h3>1. The working directory</h3>
        <p>
          Your project folder. Just files on disk. You edit them normally with
          your editor. Git is watching but not yet doing anything.
        </p>

        <h3>2. The staging area (a.k.a. "the index")</h3>
        <p>
          A waiting room for changes you want to include in the next commit.
          You <code>git add</code> files (or specific lines) into staging.
          This is what makes Git different from "save every change
          automatically" — you curate what each commit contains.
        </p>

        <h3>3. The repository</h3>
        <p>
          The <code>.git/</code> folder. It stores every commit ever made,
          plus the graph that connects them. This is the permanent history.
          A commit, once made, is essentially unlosable.
        </p>

        <h2>What a commit actually is</h2>
        <p>
          A commit is a record with five things:
        </p>
        <ul>
          <li>A snapshot of every file in the project at that moment.</li>
          <li>A unique ID — a 40-character SHA-1 hash like <code>a3f9c2e…</code> (we usually use just the first 7).</li>
          <li>A pointer to its parent commit (the one before it).</li>
          <li>An author and timestamp.</li>
          <li>A message explaining why this change was made.</li>
        </ul>

        <h2>The graph</h2>
        <p>
          Each commit points back to its parent, forming a chain. When you
          branch (lesson 29), the chain forks. The result is a graph — a tree
          of every state your project has ever been in.
        </p>

        <h2>HEAD — the "you are here" pointer</h2>
        <p>
          <code>HEAD</code> is Git's way of saying "this is the commit I'm
          currently on." When you make a new commit, it becomes the new HEAD.
          When you switch branches, HEAD moves. Almost every Git command is
          relative to HEAD in some way.
        </p>

        <h2>git status — your most-typed command</h2>
        <p>
          <code>git status</code> answers three questions at once: what
          branch am I on, what's changed since the last commit, and what's
          currently staged. You will type it 50 times a day.
        </p>

        <TerminalSim
          title="reading git status"
          lines={[
            { kind: "cmd", text: "git status" },
            { kind: "out", text: "On branch main", annotate: "current branch" },
            { kind: "out", text: "Changes to be committed:" },
            { kind: "out", text: "  (use \"git restore --staged <file>...\" to unstage)" },
            { kind: "out", text: "        modified:   app/page.tsx", annotate: "staged → in next commit" },
            { kind: "out", text: "" },
            { kind: "out", text: "Changes not staged for commit:" },
            { kind: "out", text: "        modified:   README.md", annotate: "edited but not staged" },
            { kind: "out", text: "" },
            { kind: "out", text: "Untracked files:" },
            { kind: "out", text: "        notes.txt", annotate: "Git has never seen this" },
          ]}
        />
      </LayerSection>

      <LayerSection layer="context">
        <WhereYoullSeeThis
          items={[
            { file: ".git/", context: "Auto-created hidden folder holding the entire history. Never edit by hand." },
            { file: "git status", context: "The first command developers run after touching anything. Should become reflex." },
            { context: "An agent says 'I'll stage these changes' — it's running git add to move files into the staging area." },
            { file: "a3f9c2e", context: "A short commit hash — the first 7 characters of a SHA. Used to refer to specific commits." },
            { context: "When PR descriptions say 'reverts a3f9c2e' — they're pointing at a specific commit by its hash." },
          ]}
        />

        <AntiPattern
          bad={{
            title: "Skipping the staging area with `git commit -a` for every commit",
            body: (
              <>
                <code>-a</code> auto-stages every modified file. Easy, but you
                lose curation — debug prints, unrelated changes, and the
                actual feature all land in one commit. Reviewers can't tell
                them apart.
              </>
            ),
          }}
          good={{
            title: "Stage deliberately. Commit small, focused changes.",
            body: (
              <>
                <code>git add app/page.tsx</code>, then{" "}
                <code>git commit -m "..."</code>. Or even{" "}
                <code>git add -p</code> to stage hunks within a file. Each
                commit should mean one thing.
              </>
            ),
          }}
          why={
            <>
              The staging area exists specifically so commits can be
              intentional. Skipping it turns Git history into one giant
              "stuff" pile and makes future code review and revert
              dramatically harder.
            </>
          }
        />
      </LayerSection>

      <LayerSection layer="gate">
        <MasteryCheck
          lessonN={26}
          questions={[
            {
              kind: "multi",
              prompt: "Which of these are Git's three areas, in order?",
              options: [
                "Working Directory",
                "Staging Area",
                "Cloud Server",
                "Repository",
                "Browser Cache",
              ],
              answer: [0, 1, 3],
              explanation:
                "Working → Staging → Repository. The other two are unrelated.",
            },
            {
              kind: "mcq",
              prompt: "What does `git add` do?",
              options: [
                "Saves the file permanently.",
                "Moves changes from the working directory into the staging area, where they wait to be committed.",
                "Uploads to GitHub.",
                "Adds a new file to your computer.",
              ],
              answer: 1,
              explanation:
                "git add = stage. The actual save happens at git commit.",
            },
            {
              kind: "fill",
              prompt:
                "What does Git call the 'you are here' pointer that always points to the commit you're currently on?",
              answers: ["HEAD", "head"],
              explanation:
                "HEAD. Moves when you commit, switch branches, or check out a different commit.",
            },
            {
              kind: "multi",
              prompt:
                "Which of these are recorded in every commit?",
              options: [
                "A snapshot of every file at that moment",
                "An author and timestamp",
                "A pointer to the parent commit",
                "A message explaining why",
                "A list of every API call you ever made",
              ],
              answer: [0, 1, 2, 3],
              explanation:
                "Snapshot + parent pointer + author + timestamp + message. Five things, every time.",
            },
            {
              kind: "mcq",
              prompt:
                "Your AI agent uses `git commit -a` for everything, including debug prints and unrelated changes mixed in. What's the orchestrator's response?",
              options: [
                "Approve — fewer commands.",
                "Reject — insist on `git add` for specific files (or hunks) before commit. Each commit should mean one thing so reviewers and reverts work.",
                "Switch to a different VCS.",
                "Add more debug logs.",
              ],
              answer: 1,
              explanation:
                "Curated commits are the whole reason the staging area exists. Don't skip it.",
            },
          ]}
        />
      </LayerSection>
    </>
  );
}
