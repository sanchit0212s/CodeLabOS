import { LayerSection } from "@/components/lesson/LayerSection";
import { ConceptCard } from "@/components/interactive/ConceptCard";
import { TerminalSim } from "@/components/interactive/TerminalSim";
import { Diagram, DBox, DArrow } from "@/components/interactive/Diagram";
import { AntiPattern } from "@/components/interactive/AntiPattern";
import { WhereYoullSeeThis } from "@/components/interactive/WhereYoullSeeThis";
import { MasteryCheck } from "@/components/interactive/MasteryCheck";

export default function Lesson30() {
  return (
    <>
      <LayerSection layer="why">
        <p>
          This is the workflow every working developer (and every AI agent
          building for you) repeats hundreds of times a year. Five commands.
          Once you have them as reflexes, branching feels like a natural
          part of "thinking about code" rather than a separate ritual.
        </p>
      </LayerSection>

      <LayerSection layer="model">
        <ConceptCard
          front={<>What's the standard branching workflow, end to end?</>}
          back={
            <p className="text-center text-lg">
              <strong>Branch → commit → merge → delete</strong>.<br />
              Start a branch, do work, fold it back into main, then throw the
              branch away. Repeat forever.
            </p>
          }
        />

        <Diagram caption="The standard cycle. Create a branch, work on it, merge it into main, delete it.">
          <div className="font-mono text-[13px] text-ink-dim leading-[1.8]">
            <pre>{`             D───E        D───E
            /      ⇒        \\
A───B───C            A───B───C───F (merge)
  main                       main`}</pre>
          </div>
        </Diagram>
      </LayerSection>

      <LayerSection layer="concept">
        <h2>The five commands</h2>

        <TerminalSim
          title="full branch lifecycle"
          lines={[
            { kind: "cmd", text: "git branch", annotate: "list local branches" },
            { kind: "out", text: "* main" },

            { kind: "cmd", text: "git checkout -b feat/login", annotate: "create + switch in one move" },
            { kind: "out", text: "Switched to a new branch 'feat/login'" },

            { kind: "cmd", text: "git status" },
            { kind: "out", text: "On branch feat/login" },

            { kind: "note", text: "...edit some files, commit them..." },

            { kind: "cmd", text: "git add app/login.tsx" },
            { kind: "cmd", text: "git commit -m \"add login form\"" },

            { kind: "cmd", text: "git checkout main", annotate: "switch back" },
            { kind: "out", text: "Switched to branch 'main'" },

            { kind: "cmd", text: "git merge feat/login", annotate: "fold the work in" },
            { kind: "out", text: "Updating a1b2c3d..e4f5g6h" },
            { kind: "out", text: "Fast-forward" },
            { kind: "out", text: " app/login.tsx | 42 ++++++++++++++++++++++++++++++++++++++++++" },

            { kind: "cmd", text: "git branch -d feat/login", annotate: "delete the now-merged branch" },
            { kind: "out", text: "Deleted branch feat/login (was e4f5g6h)." },
          ]}
        />

        <h2>The five commands in one sentence each</h2>
        <table>
          <thead><tr><th>Command</th><th>What it does</th></tr></thead>
          <tbody>
            <tr><td><code>git branch</code></td><td>List branches.</td></tr>
            <tr><td><code>git branch &lt;name&gt;</code></td><td>Create a branch (doesn't switch to it).</td></tr>
            <tr><td><code>git checkout &lt;name&gt;</code></td><td>Switch to an existing branch.</td></tr>
            <tr><td><code>git checkout -b &lt;name&gt;</code></td><td>Create AND switch in one move. Most common.</td></tr>
            <tr><td><code>git switch &lt;name&gt;</code></td><td>Modern alternative to checkout for switching only. (`git switch -c` to create.)</td></tr>
            <tr><td><code>git merge &lt;name&gt;</code></td><td>Merge branch &lt;name&gt; into the current branch.</td></tr>
            <tr><td><code>git branch -d &lt;name&gt;</code></td><td>Delete a merged branch. (`-D` forces — careful.)</td></tr>
          </tbody>
        </table>

        <h2>Two ways merges happen</h2>
        <h3>Fast-forward merge</h3>
        <p>
          If <code>main</code> hasn't moved since you branched off it, Git
          simply slides the main label forward to where your branch ended up.
          No new merge commit needed — the history stays linear.
        </p>

        <h3>Three-way merge</h3>
        <p>
          If <code>main</code> moved while you were working, Git creates a
          new "merge commit" with two parents — the tip of main and the tip
          of your branch. The graph forks and rejoins. This is normal and
          fine.
        </p>

        <h2>git switch — the newer, friendlier sibling</h2>
        <p>
          <code>git checkout</code> does too many things (switch branches,
          restore files, detach HEAD). Modern Git split its duties:{" "}
          <code>git switch</code> for branches, <code>git restore</code> for
          files. Equivalent, just clearer. Both still work.
        </p>

        <h2>Rebase vs. merge — a 30-second primer</h2>
        <p>
          <code>git rebase main</code> on your feature branch "replays" your
          commits on top of main, producing a linear history that looks like
          you wrote main's recent commits first, then yours. Cleaner graph,
          slightly more advanced. Most teams use merge for shared branches,
          rebase for tidying up local work before pushing.
        </p>
      </LayerSection>

      <LayerSection layer="context">
        <WhereYoullSeeThis
          items={[
            { file: "git checkout -b fix/login-bug", context: "Start of every bugfix. New branch from current HEAD." },
            { context: "GitHub's 'Merge pull request' button = `git merge feat/login` running on GitHub's servers." },
            { context: "An agent says 'I'll rebase onto main first' — it's catching up its branch to recent main commits before requesting a merge." },
            { file: "git branch --merged", context: "List branches that have already been merged. Safe to delete." },
            { context: "When a PR shows 'this branch is 4 commits behind main' — the branch hasn't been rebased or merged-from-main recently." },
          ]}
        />

        <AntiPattern
          bad={{
            title: "Long-lived feature branches",
            body: (
              <>
                The agent starts <code>feat/big-refactor</code>, then
                disappears for three weeks while main keeps moving. The
                eventual merge has 200 conflicts that nobody remembers the
                context for.
              </>
            ),
          }}
          good={{
            title: "Small branches, merged daily",
            body: (
              <>
                Aim for branches that live hours-to-days. If a feature is
                bigger, break it into smaller pieces and merge each as it
                lands. Feature flags (lesson 24) let you ship in-progress
                code safely.
              </>
            ),
          }}
          why={
            <>
              The cost of merging grows exponentially with branch age.
              Short branches keep conflicts tiny and reviews easy. Long
              branches turn into multi-day merge marathons that nobody
              wants to do.
            </>
          }
        />
      </LayerSection>

      <LayerSection layer="gate">
        <MasteryCheck
          lessonN={30}
          questions={[
            {
              kind: "mcq",
              prompt:
                "What does `git checkout -b feat/login` do?",
              options: [
                "Lists branches.",
                "Creates a new branch named `feat/login` AND switches to it in one command.",
                "Deletes the feat/login branch.",
                "Pushes to GitHub.",
              ],
              answer: 1,
              explanation:
                "`-b` = create. Most common branch-starting command.",
            },
            {
              kind: "mcq",
              prompt:
                "You're on main, and your `feat/login` branch is one commit ahead. You run `git merge feat/login`. What kind of merge is this?",
              options: [
                "Three-way merge.",
                "Fast-forward — main has no new commits since the branch split, so Git just slides the main label forward.",
                "Rebase.",
                "Squash.",
              ],
              answer: 1,
              explanation:
                "Fast-forward = no merge commit needed. Linear history. (Three-way only if main also moved.)",
            },
            {
              kind: "fill",
              prompt:
                "Modern Git split `git checkout`'s duties into two commands. The new one for switching BRANCHES is `git ___`.",
              answers: ["switch"],
              explanation:
                "`git switch` for branches, `git restore` for files. Both clearer than the old checkout.",
            },
            {
              kind: "multi",
              prompt:
                "Which of these are reasonable reasons to delete a branch?",
              options: [
                "It's been merged into main.",
                "The feature was abandoned.",
                "You renamed the branch.",
                "Branches automatically expire.",
              ],
              answer: [0, 1, 2],
              explanation:
                "Delete after merge (cleanup) or when the feature is abandoned. Branches don't expire on their own.",
            },
            {
              kind: "mcq",
              prompt:
                "Your AI agent has been working on `feat/big-refactor` for three weeks while main kept moving. Merging is going to be ugly. What was the avoidable mistake?",
              options: [
                "Using a branch at all.",
                "The branch lived too long. Either break the work into smaller, daily merges, OR rebase the branch onto main frequently so it stays close to current.",
                "Using Git instead of SVN.",
                "Pushing too often.",
              ],
              answer: 1,
              explanation:
                "Long branches = exponentially harder merges. Push back when an agent's branch starts drifting from main.",
            },
          ]}
        />
      </LayerSection>
    </>
  );
}
