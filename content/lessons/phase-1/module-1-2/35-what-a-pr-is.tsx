import { LayerSection } from "@/components/lesson/LayerSection";
import { ConceptCard } from "@/components/interactive/ConceptCard";
import { Diagram, DBox, DArrow } from "@/components/interactive/Diagram";
import { AntiPattern } from "@/components/interactive/AntiPattern";
import { WhereYoullSeeThis } from "@/components/interactive/WhereYoullSeeThis";
import { MasteryCheck } from "@/components/interactive/MasteryCheck";

export default function Lesson35() {
  return (
    <>
      <LayerSection layer="why">
        <p>
          The Pull Request is the single most important interface in modern
          software development. Every change your AI agent ships passes
          through one. As an orchestrator, your PRIMARY job — the place
          you have the most leverage — is reviewing PRs. This lesson sets
          up what a PR is structurally; the next one teaches you what to
          look for inside one.
        </p>
      </LayerSection>

      <LayerSection layer="model">
        <ConceptCard
          front={<>What is a Pull Request, in one sentence?</>}
          back={
            <p className="text-center text-lg">
              A <strong>proposal to merge one branch into another</strong>,
              with a structured place for discussion, code review,
              automated checks, and a final approve/reject decision. The PR
              itself is GitHub's invention; Git just sees a normal merge
              once you click the button.
            </p>
          }
        />

        <Diagram caption="The PR is a holding pen between 'I made some commits' and 'this is in main.' Review happens inside the pen.">
          <div className="space-y-3 w-full max-w-md">
            <DBox label="feat/login (your branch)" tone="warn" sub="commits pushed to GitHub" />
            <div className="flex justify-center"><DArrow direction="down" label="open PR" /></div>
            <DBox label="Pull Request" tone="accent" sub="review · CI checks · discussion" />
            <div className="flex justify-center"><DArrow direction="down" label="approve + merge" /></div>
            <DBox label="main" tone="info" sub="now contains the change" />
          </div>
        </Diagram>
      </LayerSection>

      <LayerSection layer="concept">
        <h2>The anatomy of a PR</h2>
        <p>Every Pull Request has the same six parts:</p>

        <h3>1. The source and target branches</h3>
        <p>
          <strong>From</strong> a branch like <code>feat/login</code>.{" "}
          <strong>Into</strong> a branch like <code>main</code>. The PR
          shows the diff between them.
        </p>

        <h3>2. A title and description</h3>
        <p>
          Title: short summary. Description: what changed, why, screenshots
          if UI, links to issues, "how to test" instructions. The
          description is documentation that lives forever in PR history.
        </p>

        <h3>3. The diff</h3>
        <p>
          Every change in every file, line-by-line, with red (removed) and
          green (added) lines. This is what reviewers actually read.
        </p>

        <h3>4. Comments and reviews</h3>
        <ul>
          <li>
            <strong>General comments</strong> — on the whole PR.
          </li>
          <li>
            <strong>Inline comments</strong> — attached to a specific line.
          </li>
          <li>
            <strong>Reviews</strong> — a structured submission: "approve",
            "request changes", or "comment". Branch protection rules can
            require a certain number of approvals before merge.
          </li>
        </ul>

        <h3>5. Checks (CI)</h3>
        <p>
          Automated tests, linters, type checks, build verification —
          configured via GitHub Actions (lesson 37). A PR shows the
          green-check / red-X status of each. Repos commonly require all
          checks to pass before merge.
        </p>

        <h3>6. The merge button</h3>
        <p>
          When everything is satisfied, you (or someone with permission)
          clicks the merge button. GitHub runs the merge server-side. The
          commits land in the target branch.
        </p>

        <h2>The three merge strategies</h2>
        <ul>
          <li>
            <strong>Merge commit</strong> — preserves the full branch
            history with a merge commit on top. The "honest" option but
            creates branchy history.
          </li>
          <li>
            <strong>Squash and merge</strong> — collapses ALL branch
            commits into a single commit on the target branch. Clean
            history, but you lose the commit-by-commit story.
          </li>
          <li>
            <strong>Rebase and merge</strong> — replays your commits onto
            main as if they happened linearly. Clean AND preserves
            individual commits.
          </li>
        </ul>
        <p>
          Squash-and-merge is the most popular default for startups —
          one PR = one commit, history is easy to read and revert.
        </p>

        <h2>Branch protection rules</h2>
        <p>
          On <code>main</code>, real teams configure:
        </p>
        <ul>
          <li>Require pull requests before merge (no direct pushes).</li>
          <li>Require at least N approving reviews.</li>
          <li>Require status checks (CI) to pass.</li>
          <li>Require the branch to be up to date with main.</li>
          <li>Restrict who can push (admins only).</li>
        </ul>
        <p>
          As the orchestrator, you set these on Day 1 of any repo. They are
          your single biggest leverage point.
        </p>

        <h2>Draft PRs</h2>
        <p>
          A "Draft" PR signals work-in-progress — review is welcome but
          merge is blocked. Useful for getting early feedback on direction
          before polishing.
        </p>
      </LayerSection>

      <LayerSection layer="context">
        <WhereYoullSeeThis
          items={[
            { context: "Every change your AI agent makes for a real project lives inside a PR before it can reach main. Your approval is the gate." },
            { file: "PR title: 'feat: add OAuth sign-in flow'", context: "Conventional-commits-style title. Some tools auto-generate changelogs from these." },
            { context: "GitHub's 'Files changed' tab on a PR shows the full diff. This is where 90% of your orchestrator work happens." },
            { file: "Required reviewers", context: "Branch protection setting — names you list MUST approve before merge. Use this for sensitive areas (security, billing)." },
            { context: "When you see ✅ + ✅ + ✅ next to a PR — three required checks passed. ⛔ + ✅ + ✅ — one is failing, merge blocked." },
          ]}
        />

        <AntiPattern
          bad={{
            title: "Merging your own PR without review",
            body: (
              <>
                The AI agent opens a PR and immediately clicks merge. There's
                no second pair of eyes. Even sophisticated agents make
                mistakes only humans (or another reviewer) catch.
              </>
            ),
          }}
          good={{
            title: "Branch protection requires review. Always.",
            body: (
              <>
                Configure main to require at least one approving review (and
                the orchestrator IS the reviewer when working with an agent).
                You're forced to read every diff. That's the whole point.
              </>
            ),
          }}
          why={
            <>
              An agent that can self-approve has no quality gate. The cost of
              a review is minutes; the cost of a bad merge to main is hours
              or days. Make the review non-negotiable in branch protection.
            </>
          }
        />
      </LayerSection>

      <LayerSection layer="gate">
        <MasteryCheck
          lessonN={35}
          questions={[
            {
              kind: "mcq",
              prompt: "What is a Pull Request, structurally?",
              options: [
                "A bug report.",
                "A GitHub feature that proposes merging one branch into another, with built-in places for discussion, review, automated checks, and a merge button.",
                "A type of Git commit.",
                "A way to pull code from another repo.",
              ],
              answer: 1,
              explanation:
                "PR = a holding pen for a proposed merge. Review and CI happen inside the pen.",
            },
            {
              kind: "multi",
              prompt:
                "Which of these belong inside a Pull Request?",
              options: [
                "The diff between branches",
                "Inline comments on specific lines",
                "CI check results",
                "An approve/request-changes review",
                "The source code's compiler",
              ],
              answer: [0, 1, 2, 3],
              explanation:
                "Diff, comments, checks, reviews. Compiler is not a PR concept.",
            },
            {
              kind: "fill",
              prompt:
                "Which merge strategy collapses ALL of a branch's commits into a SINGLE commit on the target branch (popular default in startups)?",
              answers: ["squash and merge", "squash", "squash-and-merge"],
              explanation:
                "Squash + merge. One PR = one commit on main. Easy to read and revert.",
            },
            {
              kind: "mcq",
              prompt:
                "What's the orchestrator's biggest leverage point on Day 1 of a new repo?",
              options: [
                "Choosing the framework.",
                "Configuring branch protection rules on main: require PRs, require reviews, require CI to pass, no direct pushes.",
                "Naming the repo.",
                "Buying a custom domain.",
              ],
              answer: 1,
              explanation:
                "Branch protection is the structural quality gate. Set it before the agent writes a line of code.",
            },
            {
              kind: "mcq",
              prompt:
                "Your AI agent opens a PR and immediately merges its own work. What's the orchestrator's fix?",
              options: [
                "Trust the agent.",
                "Configure branch protection to require at least one approving review from someone other than the PR author. The agent now can't self-merge — you become the review gate.",
                "Use a different agent.",
                "Disable Git.",
              ],
              answer: 1,
              explanation:
                "Branch protection makes the review non-negotiable. That's exactly the orchestrator's leverage.",
            },
          ]}
        />
      </LayerSection>
    </>
  );
}
