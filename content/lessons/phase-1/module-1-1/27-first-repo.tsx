import { LayerSection } from "@/components/lesson/LayerSection";
import { ConceptCard } from "@/components/interactive/ConceptCard";
import { TerminalSim } from "@/components/interactive/TerminalSim";
import { AntiPattern } from "@/components/interactive/AntiPattern";
import { WhereYoullSeeThis } from "@/components/interactive/WhereYoullSeeThis";
import { MasteryCheck } from "@/components/interactive/MasteryCheck";

export default function Lesson27() {
  return (
    <>
      <LayerSection layer="why">
        <p>
          Three commands — <code>init</code>, <code>add</code>,{" "}
          <code>commit</code> — give you 90% of day-one Git. Every project
          you ever touch starts with this sequence. Knowing them by reflex
          stops Git from feeling magical and lets you focus on what each
          commit actually means.
        </p>
      </LayerSection>

      <LayerSection layer="model">
        <ConceptCard
          front={<>How do you start using Git on a new project, in three commands?</>}
          back={
            <p className="text-center text-lg">
              <code>git init</code> — turn this folder into a Git repo.<br />
              <code>git add &lt;files&gt;</code> — stage what should go in the next commit.<br />
              <code>git commit -m "..."</code> — record the snapshot with a message.
            </p>
          }
        />
      </LayerSection>

      <LayerSection layer="concept">
        <h2>The full first-repo flow</h2>

        <TerminalSim
          title="from zero to first commit"
          lines={[
            { kind: "cmd", text: "mkdir my-app && cd my-app", annotate: "make a folder" },
            { kind: "cmd", text: "git init", annotate: "create the .git folder" },
            { kind: "out", text: "Initialized empty Git repository in /Users/you/my-app/.git/" },

            { kind: "cmd", text: "echo '# my-app' > README.md", annotate: "make a file" },

            { kind: "cmd", text: "git status" },
            { kind: "out", text: "On branch main" },
            { kind: "out", text: "No commits yet" },
            { kind: "out", text: "Untracked files: README.md", annotate: "Git sees it but isn't tracking yet" },

            { kind: "cmd", text: "git add README.md", annotate: "stage it" },

            { kind: "cmd", text: "git status" },
            { kind: "out", text: "Changes to be committed:" },
            { kind: "out", text: "        new file:   README.md" },

            { kind: "cmd", text: "git commit -m \"first commit: add README\"", annotate: "save it forever" },
            { kind: "out", text: "[main (root-commit) a1b2c3d] first commit: add README" },
            { kind: "out", text: " 1 file changed, 1 insertion(+)" },
            { kind: "out", text: " create mode 100644 README.md" },
          ]}
        />

        <h2>What each command does</h2>

        <h3>git init</h3>
        <p>
          Creates the <code>.git/</code> folder. From this moment on, Git is
          watching this directory. <strong>Idempotent</strong> — running it on
          an existing repo is harmless.
        </p>

        <h3>git add &lt;path&gt;</h3>
        <ul>
          <li><code>git add README.md</code> — stage one file.</li>
          <li><code>git add app/</code> — stage everything in a folder.</li>
          <li><code>git add .</code> — stage everything that's changed (use with care).</li>
          <li><code>git add -p</code> — stage individual chunks interactively.</li>
        </ul>

        <h3>git commit -m "message"</h3>
        <p>
          Records the staged snapshot, with the message. Without{" "}
          <code>-m</code> it opens your default editor for a longer message.
        </p>

        <h2>Writing good commit messages</h2>
        <p>
          The convention most teams use: first line is a short summary in
          present tense, max ~50 chars, no period.
        </p>
        <ul>
          <li>✓ "add login form validation"</li>
          <li>✓ "fix N+1 query in dashboard"</li>
          <li>✗ "fixed stuff" — useless six months from now.</li>
          <li>✗ "WIP" — leaves zero information about what changed.</li>
        </ul>
        <p>
          Some teams use <strong>conventional commits</strong>:{" "}
          <code>feat: ...</code>, <code>fix: ...</code>,{" "}
          <code>chore: ...</code>. The prefix lets tools auto-generate
          changelogs.
        </p>

        <h2>The first thing to do after git init</h2>
        <p>
          Add a <code>.gitignore</code>. Otherwise the next{" "}
          <code>git add .</code> will sweep in <code>node_modules/</code>,{" "}
          <code>.env</code>, and other things that should never be committed.
          (Lesson 32.)
        </p>

        <h2>Configuring your identity</h2>
        <p>
          Git wants to know who you are so it can stamp commits with your
          name and email. One-time setup per machine:
        </p>
        <pre>git config --global user.name "Your Name"
git config --global user.email "you@example.com"</pre>
      </LayerSection>

      <LayerSection layer="context">
        <WhereYoullSeeThis
          items={[
            { file: "create-next-app", context: "Sets up a Next.js project AND runs `git init` for you. Every modern scaffolder does." },
            { context: "An agent says 'I made the initial commit' — it ran add + commit on the freshly scaffolded files." },
            { file: "a1b2c3d", context: "A short commit hash (first 7 chars). Used everywhere — PR descriptions, revert commands, blame output." },
            { context: "When you run `git log` and see ten commits, each is exactly what a chain of init → add → commit produced." },
          ]}
        />

        <AntiPattern
          bad={{
            title: "`git add .` followed by `git commit -m \"updates\"` for everything",
            body: (
              <>
                The agent sweeps every change into one big commit with a
                useless message. Three weeks later, when something breaks,
                nobody can tell which of the 47 changes in "updates" caused
                it.
              </>
            ),
          }}
          good={{
            title: "Stage related changes together. Write a message that explains WHY.",
            body: (
              <>
                One commit per logical change. Message in the form{" "}
                "add login form validation" or "fix double-charge bug on
                cart". Future-you will be able to read the history like a
                story.
              </>
            ),
          }}
          why={
            <>
              Commits aren't just for saving — they're documentation. A clean
              history makes <code>git blame</code>, <code>git revert</code>,
              and code review enormously easier. AI agents tend to dump
              everything into one commit; push back hard on this.
            </>
          }
        />
      </LayerSection>

      <LayerSection layer="gate">
        <MasteryCheck
          lessonN={27}
          questions={[
            {
              kind: "mcq",
              prompt: "What does `git init` do?",
              options: [
                "Uploads your code to GitHub.",
                "Creates a `.git` folder inside the current directory, turning it into a Git repository.",
                "Clones a remote repository.",
                "Deletes all your files.",
              ],
              answer: 1,
              explanation: "init = create the .git folder. Local only. Idempotent.",
            },
            {
              kind: "fill",
              prompt:
                "Complete the three-command sequence to make your first commit: git init, then `git ___ <files>`, then `git commit -m \"...\"`.",
              answers: ["add"],
              explanation:
                "git add stages files into the waiting room. Then commit records them.",
            },
            {
              kind: "multi",
              prompt:
                "Which of these are reasonable commit messages?",
              options: [
                "\"add login form validation\"",
                "\"WIP\"",
                "\"fix N+1 query in user dashboard\"",
                "\"stuff\"",
                "\"feat: support OAuth sign-in\"",
              ],
              answer: [0, 2, 4],
              explanation:
                "Short, present-tense, describes WHY. WIP and 'stuff' tell future-you nothing.",
            },
            {
              kind: "mcq",
              prompt:
                "Right after `git init` on a fresh project, what's the very next thing you should add (before any other code)?",
              options: [
                "A package.json.",
                "A .gitignore — so the next `git add .` doesn't sweep in node_modules, .env, build output.",
                "A LICENSE.",
                "A docker-compose.yml.",
              ],
              answer: 1,
              explanation:
                ".gitignore first, then everything else. Otherwise secrets and bloat land in commit 1 and live in history forever.",
            },
            {
              kind: "mcq",
              prompt:
                "Your AI agent keeps committing with `-m \"updates\"`. What's the orchestrator's pushback?",
              options: [
                "Accept it — commit messages don't matter.",
                "Reject. Insist on messages that describe WHAT changed and WHY. Three weeks from now, `git log` should read like a story, not noise.",
                "Add more commits.",
                "Switch to SVN.",
              ],
              answer: 1,
              explanation:
                "Commit messages are documentation. Useless ones cost you every future incident.",
            },
          ]}
        />
      </LayerSection>
    </>
  );
}
