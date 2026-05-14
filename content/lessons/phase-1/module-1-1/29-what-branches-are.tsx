import { LayerSection } from "@/components/lesson/LayerSection";
import { ConceptCard } from "@/components/interactive/ConceptCard";
import { Diagram, DBox, DArrow } from "@/components/interactive/Diagram";
import { AntiPattern } from "@/components/interactive/AntiPattern";
import { WhereYoullSeeThis } from "@/components/interactive/WhereYoullSeeThis";
import { MasteryCheck } from "@/components/interactive/MasteryCheck";

export default function Lesson29() {
  return (
    <>
      <LayerSection layer="why">
        <p>
          Branches are how you (and your AI agent) make changes without
          touching the working version. Every PR is a branch. Every "let's
          try this" experiment is a branch. Knowing what a branch actually
          IS (one cheap pointer, not a copy of your code) demystifies the
          whole workflow.
        </p>
      </LayerSection>

      <LayerSection layer="model">
        <ConceptCard
          front={<>What is a Git branch?</>}
          back={
            <p className="text-center text-lg">
              A branch is just a <strong>movable label pointing at a
              commit</strong>. That's it. It's not a copy of your code; it
              doesn't duplicate anything. When you commit on a branch, the
              label moves forward to the new commit.
            </p>
          }
        />

        <Diagram caption="One commit graph, two branches. Each branch is just a sticky note on a particular commit. main and feature both exist at the same time; switching between them moves HEAD.">
          <div className="font-mono text-[13px] text-ink-dim leading-[1.8]">
            <pre>{`        A───B───C   ← main
                 \\
                  D───E   ← feat/login
                          ↑
                       (HEAD)`}</pre>
          </div>
        </Diagram>
      </LayerSection>

      <LayerSection layer="concept">
        <h2>Why branches exist</h2>
        <p>
          You need to experiment, fix bugs, build new features — without
          breaking what's currently working. The traditional answer was
          "copy the project folder into project-v2/ and work there."
          Branches are Git's lightweight version: copying a label is free,
          where copying files is slow and wasteful.
        </p>

        <h2>The two pieces</h2>
        <ul>
          <li>
            <strong>The commit graph</strong> — every snapshot ever made,
            forever.
          </li>
          <li>
            <strong>The branch labels</strong> — small named pointers, each
            pointing at one commit. <code>main</code> usually points at the
            stable tip. <code>feat/login</code> might point at your
            in-progress work.
          </li>
        </ul>

        <h2>HEAD points to a branch</h2>
        <p>
          When you're "on" a branch, <code>HEAD</code> points at that branch
          name. When you commit, the branch moves to the new commit, and
          HEAD follows. Switching branches moves HEAD to point at a
          different label.
        </p>

        <h2>main, master, develop — naming conventions</h2>
        <ul>
          <li>
            <strong>main</strong> — the modern default for the stable tip.
            (Replaced "master" in most projects post-2020.)
          </li>
          <li>
            <strong>feat/&lt;name&gt;</strong>, <strong>fix/&lt;name&gt;</strong>,{" "}
            <strong>chore/&lt;name&gt;</strong> — common conventions for
            feature/bugfix/maintenance branches.
          </li>
          <li>
            <strong>develop</strong>, <strong>release/*</strong> — used by
            some teams running a "Git Flow" model. Less common in modern
            startups.
          </li>
        </ul>

        <h2>Why branches are cheap</h2>
        <p>
          A new branch is one file in <code>.git/refs/heads/</code> with a
          single line: the commit hash it points to. Creating one is
          essentially instant. Deleting one is just removing that file —
          the underlying commits stay (and can still be reached by hash, or
          by other branches).
        </p>

        <h2>The orchestrator's mental model</h2>
        <p>
          When an AI agent says "I'll work on a branch," picture this:
          someone puts a sticky note labeled <code>feat/login</code> on the
          current commit. Then they make commits on that branch. The sticky
          note moves forward; <code>main</code> stays put. Both states
          coexist in the graph. Later you decide whether to merge them.
        </p>
      </LayerSection>

      <LayerSection layer="context">
        <WhereYoullSeeThis
          items={[
            { file: "main", context: "The default branch name on every new GitHub repo. Where production code usually lives." },
            { file: "feat/oauth-login", context: "Branch naming convention. The prefix tells reviewers what kind of change to expect." },
            { context: "Every PR is a request to merge ONE branch into another. Almost always feature → main." },
            { context: "An agent says 'I'll branch off main and work there' — they're moving HEAD to a fresh branch so main stays stable." },
            { file: "git branch -d feat/oauth-login", context: "Delete a branch label after it's been merged. The commits remain reachable through main." },
          ]}
        />

        <AntiPattern
          bad={{
            title: "Committing directly to main for 'small' changes",
            body: (
              <>
                The agent thinks "this is a quick fix, I'll skip the branch
                + PR dance." Now untested code is on main. Production deploy
                triggers. Bug ships before code review.
              </>
            ),
          }}
          good={{
            title: "Every change goes through a branch + PR",
            body: (
              <>
                Cheap because branches are cheap. Predictable because every
                change gets reviewed and CI-tested before merging to main.
                For real solo work you can still skip the PR, but the
                branch should still exist as a safety net.
              </>
            ),
          }}
          why={
            <>
              The whole point of main is that it's safe. The moment you
              commit directly to it, you've turned it into "wherever the
              last person was working." Branches keep main trustworthy.
            </>
          }
        />
      </LayerSection>

      <LayerSection layer="gate">
        <MasteryCheck
          lessonN={29}
          questions={[
            {
              kind: "mcq",
              prompt: "What IS a Git branch, structurally?",
              options: [
                "A complete copy of your project's files.",
                "A movable label that points at a single commit. When you commit on the branch, the label moves forward.",
                "A folder inside .git.",
                "A backup of your project.",
              ],
              answer: 1,
              explanation:
                "Just a pointer. That's why creating and deleting branches is essentially free.",
            },
            {
              kind: "mcq",
              prompt:
                "You're on branch `feat/login`. You make a new commit. What happens?",
              options: [
                "The commit is rejected.",
                "A new commit is created with the current commit as its parent. The `feat/login` label moves to point at the new commit. HEAD follows.",
                "All branches advance.",
                "The commit goes to main.",
              ],
              answer: 1,
              explanation:
                "Commits add to the graph; the current branch label moves to the new tip.",
            },
            {
              kind: "fill",
              prompt:
                "What is the modern default name for the primary branch on a new GitHub repo (replaced 'master' in most projects post-2020)?",
              answers: ["main"],
              explanation: "main. (Some repos still use master; both work the same way.)",
            },
            {
              kind: "multi",
              prompt:
                "Which of these are reasons branches are cheap in Git?",
              options: [
                "They don't duplicate the working directory — they're just a label.",
                "They store only the hash of the commit they point at.",
                "Creating one takes essentially zero time.",
                "Deleting one doesn't lose the underlying commits.",
                "Git compresses them with AI.",
              ],
              answer: [0, 1, 2, 3],
              explanation:
                "Branches are pointers, not copies. That's the whole insight.",
            },
            {
              kind: "mcq",
              prompt:
                "Your AI agent says 'this is a small fix, let me just commit it directly to main.' What's the orchestrator's response?",
              options: [
                "Approve — fewer steps.",
                "Reject. Every change goes through a branch (and ideally a PR). Branches are cheap; keeping main reviewable and trustworthy is the whole point.",
                "Switch to a different VCS.",
                "Add the commit twice.",
              ],
              answer: 1,
              explanation:
                "main = stable, reviewable. Direct commits to it accumulate untested code.",
            },
          ]}
        />
      </LayerSection>
    </>
  );
}
