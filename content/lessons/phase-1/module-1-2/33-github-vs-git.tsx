import { LayerSection } from "@/components/lesson/LayerSection";
import { ConceptCard } from "@/components/interactive/ConceptCard";
import { Diagram, DBox, DArrow } from "@/components/interactive/Diagram";
import { AntiPattern } from "@/components/interactive/AntiPattern";
import { WhereYoullSeeThis } from "@/components/interactive/WhereYoullSeeThis";
import { MasteryCheck } from "@/components/interactive/MasteryCheck";

export default function Lesson33() {
  return (
    <>
      <LayerSection layer="why">
        <p>
          Beginners use "Git" and "GitHub" as synonyms. They are not. Git is
          the version control system; GitHub is one company's hosted product
          built on top of it. Knowing the difference matters because every
          time something breaks, the question is "is this a Git problem, a
          GitHub problem, or a permissions problem?" — and the fix lives in
          a different place for each.
        </p>
      </LayerSection>

      <LayerSection layer="model">
        <ConceptCard
          front={<>Git vs. GitHub, in one sentence?</>}
          back={
            <p className="text-center text-lg">
              <strong>Git</strong> is a command-line program for version
              control, running on your laptop. <strong>GitHub</strong> is a
              cloud product that hosts Git repositories and adds collaboration
              features (pull requests, issues, CI, code review).
            </p>
          }
        />

        <Diagram caption="Git is the engine. GitHub is one place to park your repo. GitLab and Bitbucket are competitors that do the same job.">
          <div className="space-y-3 w-full max-w-md">
            <DBox label="Git" tone="accent" sub="open-source CLI, runs locally" />
            <div className="flex justify-center"><DArrow direction="down" label="pushes to" /></div>
            <div className="grid grid-cols-3 gap-3">
              <DBox label="GitHub" tone="info" sub="Microsoft" />
              <DBox label="GitLab" tone="muted" sub="GitLab Inc." />
              <DBox label="Bitbucket" tone="muted" sub="Atlassian" />
            </div>
          </div>
        </Diagram>
      </LayerSection>

      <LayerSection layer="concept">
        <h2>What Git is, exactly</h2>
        <ul>
          <li>A command-line program (created by Linus Torvalds, 2005).</li>
          <li>Free, open-source, installed on your machine.</li>
          <li>Stores your project's full history in the <code>.git/</code> folder.</li>
          <li>Has zero idea about "the internet." It's purely local.</li>
        </ul>
        <p>
          You can use Git on a project that never leaves your laptop. No
          GitHub account required. No internet required.
        </p>

        <h2>What GitHub is, exactly</h2>
        <ul>
          <li>A web service that hosts Git repositories online.</li>
          <li>Owned by Microsoft since 2018.</li>
          <li>Adds features Git doesn't have on its own:
            <ul>
              <li>A web UI to browse code and history.</li>
              <li><strong>Pull requests</strong> (proposing changes).</li>
              <li><strong>Issues</strong> (bug/feature tracker).</li>
              <li><strong>Actions</strong> (CI/CD pipelines).</li>
              <li>Permissions, teams, code owners, branch rules.</li>
              <li>Releases, packages, wikis, discussions.</li>
            </ul>
          </li>
        </ul>

        <h2>How they connect</h2>
        <p>
          Git has a concept of a <strong>remote</strong> — another copy of
          your repository, somewhere else. Usually one. The convention is to
          name it <code>origin</code>. GitHub gives you the URL for the
          remote; Git pushes commits to it and pulls commits from it.
        </p>

        <pre>{`# adding a remote (you usually do this once)
$ git remote add origin git@github.com:you/my-app.git

# pushing your commits up
$ git push -u origin main

# pulling new commits down
$ git pull`}</pre>

        <h2>The competitors</h2>
        <p>
          GitHub is dominant but not the only option. <strong>GitLab</strong>{" "}
          (open-core, popular at large companies and EU) and{" "}
          <strong>Bitbucket</strong> (Atlassian, common with Jira users) do
          the same job. <strong>Self-hosted</strong> options like Gitea exist
          for organizations that need to run their own. <em>Git</em> works
          identically against all of them.
        </p>

        <h2>Why this distinction matters when an agent breaks something</h2>
        <ul>
          <li>
            "permission denied (publickey)" → your Git can't auth with
            GitHub. SSH key problem.
          </li>
          <li>
            "rejected — non-fast-forward" → Git problem. Your local branch
            and the remote diverged.
          </li>
          <li>
            "PR is blocked because checks are failing" → GitHub problem,
            specifically GitHub Actions.
          </li>
          <li>
            "404 on the repo URL" → GitHub problem, either repo is private
            or doesn't exist.
          </li>
        </ul>
        <p>
          The error tells you which layer is unhappy. Diagnose accordingly.
        </p>
      </LayerSection>

      <LayerSection layer="context">
        <WhereYoullSeeThis
          items={[
            { file: "git@github.com:you/repo.git", context: "An SSH GitHub URL. `git@github.com` is the host. Pushing/cloning over SSH requires an SSH key registered with GitHub." },
            { file: "https://github.com/you/repo.git", context: "An HTTPS GitHub URL. Same repo, different protocol. Requires a personal access token (PAT) for pushes." },
            { context: "An agent says 'I pushed to origin' — origin is the conventional name for the GitHub-hosted copy of your repo." },
            { context: "GitHub's web 'Edit this file' button → makes a commit on the server. You'd then `git pull` to get it on your laptop." },
            { context: "When you create a brand-new repo on GitHub, the empty page shows you the exact `git remote add` + `git push -u origin main` commands. Copy them." },
          ]}
        />

        <AntiPattern
          bad={{
            title: "Treating GitHub's UI as the source of truth and bypassing Git",
            body: (
              <>
                The agent makes edits in GitHub's web editor, then on their
                laptop runs <code>git commit</code> without pulling first.
                Now local and remote have diverged. The next push is
                rejected.
              </>
            ),
          }}
          good={{
            title: "Pull before you push. Always.",
            body: (
              <>
                <code>git pull</code> first. If anything changed on the
                remote, integrate it. Then make your local commits. Then
                push. This single habit prevents most "rejected non-fast
                forward" pain.
              </>
            ),
          }}
          why={
            <>
              GitHub's UI and your laptop are two clients of the same Git
              history. They diverge if both make commits independently. The
              cure is symmetry — always sync down before you sync up.
            </>
          }
        />
      </LayerSection>

      <LayerSection layer="gate">
        <MasteryCheck
          lessonN={33}
          questions={[
            {
              kind: "mcq",
              prompt: "Which statement is correct?",
              options: [
                "Git and GitHub are the same thing.",
                "Git is a local command-line version control program; GitHub is a web service that hosts Git repos and adds collaboration features.",
                "Git is owned by Microsoft.",
                "GitHub replaces Git.",
              ],
              answer: 1,
              explanation:
                "Git = the program. GitHub = one place to park Git repos online + extras.",
            },
            {
              kind: "multi",
              prompt:
                "Which of these are features GitHub adds that Git itself doesn't have?",
              options: [
                "Pull requests",
                "Issues",
                "CI/CD pipelines (Actions)",
                "Commit history",
                "Web UI to browse code",
                "Branching",
              ],
              answer: [0, 1, 2, 4],
              explanation:
                "Commit history and branching are core Git features. The other four are GitHub additions.",
            },
            {
              kind: "fill",
              prompt:
                "What's the conventional name for the remote that points at your GitHub repo?",
              answers: ["origin"],
              explanation:
                "origin. (You can rename it, but every tutorial assumes this name.)",
            },
            {
              kind: "mcq",
              prompt:
                "Your push fails with 'rejected — non-fast-forward'. Which layer is unhappy?",
              options: [
                "GitHub's billing.",
                "Git itself — your local branch and the remote branch have diverged. You need to pull (and possibly merge/rebase) first.",
                "Your operating system.",
                "TypeScript.",
              ],
              answer: 1,
              explanation:
                "Non-fast-forward = the remote has commits you don't. Sync first, push second.",
            },
            {
              kind: "mcq",
              prompt:
                "Your AI agent uses GitHub's web editor to commit, then on their laptop makes a new commit and tries to push — gets rejected. What's the root cause?",
              options: [
                "GitHub is down.",
                "Two paths made commits to the same branch without syncing. The fix is `git pull` to integrate the web edit, then push.",
                "The agent's SSH key is wrong.",
                "main is protected.",
              ],
              answer: 1,
              explanation:
                "Pull before push. The cardinal rule when more than one path can write to the same branch.",
            },
          ]}
        />
      </LayerSection>
    </>
  );
}
