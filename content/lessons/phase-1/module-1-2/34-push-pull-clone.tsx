import { LayerSection } from "@/components/lesson/LayerSection";
import { ConceptCard } from "@/components/interactive/ConceptCard";
import { TerminalSim } from "@/components/interactive/TerminalSim";
import { Diagram, DBox, DArrow } from "@/components/interactive/Diagram";
import { AntiPattern } from "@/components/interactive/AntiPattern";
import { WhereYoullSeeThis } from "@/components/interactive/WhereYoullSeeThis";
import { MasteryCheck } from "@/components/interactive/MasteryCheck";

export default function Lesson34() {
  return (
    <>
      <LayerSection layer="why">
        <p>
          Three commands move code between your laptop and the remote.{" "}
          <code>clone</code> to get a copy, <code>push</code> to send your
          work up, <code>pull</code> to receive others' work. Master these
          three and you can collaborate with anyone (including your AI agent
          running in a sandbox) on any project, ever.
        </p>
      </LayerSection>

      <LayerSection layer="model">
        <ConceptCard
          front={<>What do clone, push, and pull do?</>}
          back={
            <p className="text-center text-lg">
              <code>clone</code> — download a remote repo, in full, to your
              laptop.<br />
              <code>push</code> — send your local commits up to the remote.<br />
              <code>pull</code> — fetch new commits from the remote and merge
              them in.
            </p>
          }
        />

        <Diagram caption="Three operations connecting two copies of the same repository.">
          <div className="flex items-center gap-6 flex-wrap justify-center">
            <DBox label="Your laptop" tone="accent" sub="local clone" />
            <div className="flex flex-col items-center gap-2">
              <DArrow direction="right" label="push" />
              <DArrow direction="left" label="pull" />
            </div>
            <DBox label="GitHub" tone="info" sub="origin" />
          </div>
          <div className="mt-4 font-mono text-[12px] text-ink-mute text-center">
            (clone = the very first time, when you have nothing locally yet)
          </div>
        </Diagram>
      </LayerSection>

      <LayerSection layer="concept">
        <h2>git clone — your first copy</h2>
        <TerminalSim
          title="cloning a repo"
          lines={[
            { kind: "cmd", text: "git clone git@github.com:you/my-app.git" },
            { kind: "out", text: "Cloning into 'my-app'..." },
            { kind: "out", text: "remote: Enumerating objects: 1247, done." },
            { kind: "out", text: "Receiving objects: 100% (1247/1247), 4.2 MiB" },
            { kind: "out", text: "Resolving deltas: 100% (612/612), done." },
            { kind: "cmd", text: "cd my-app" },
            { kind: "cmd", text: "git remote -v", annotate: "see the remote" },
            { kind: "out", text: "origin  git@github.com:you/my-app.git (fetch)" },
            { kind: "out", text: "origin  git@github.com:you/my-app.git (push)" },
          ]}
        />
        <p>
          <code>clone</code> does three things in one step: downloads the
          full history into a new folder, sets up <code>origin</code> as the
          remote, and checks out the default branch.
        </p>

        <h2>git push — sending your work up</h2>
        <pre>{`$ git push origin main
Enumerating objects: 5, done.
Counting objects: 100% (5/5), done.
Delta compression using up to 10 threads
Compressing objects: 100% (3/3), done.
Writing objects: 100% (3/3), 312 bytes | 312.00 KiB/s, done.
Total 3 (delta 2), reused 0 (delta 0)
To github.com:you/my-app.git
   a1b2c3d..e4f5g6h  main -> main`}</pre>
        <p>
          The first time you push a new branch, use{" "}
          <code>git push -u origin &lt;branch&gt;</code>. The <code>-u</code>{" "}
          (set upstream) lets you just type <code>git push</code> next time.
        </p>

        <h2>git pull — receiving others' work</h2>
        <p>
          <code>git pull</code> is actually two operations bolted together:
        </p>
        <ol>
          <li><code>git fetch</code> — download new commits from the remote, into Git's records, but don't change your working tree.</li>
          <li><code>git merge</code> — fold those new commits into your current branch.</li>
        </ol>
        <p>
          So <code>git pull</code> can produce merge conflicts (lesson 31)
          if both sides changed the same lines.
        </p>

        <h2>git fetch — pull without merging</h2>
        <p>
          Sometimes you want to <em>see</em> what's new before merging it
          in. <code>git fetch</code> downloads everything but leaves your
          working tree alone. Then <code>git log origin/main</code> shows
          you what would have been merged. Useful when reviewing changes
          you don't fully trust yet.
        </p>

        <h2>How push usually fails</h2>
        <ul>
          <li>
            <strong>Non-fast-forward</strong> — remote moved. Do{" "}
            <code>git pull</code> (or <code>git pull --rebase</code>) first.
          </li>
          <li>
            <strong>Permission denied (publickey)</strong> — your SSH key
            isn't registered with GitHub for this repo.
          </li>
          <li>
            <strong>Protected branch</strong> — main may be configured to
            require a PR, blocking direct pushes.
          </li>
          <li>
            <strong>Large file rejected</strong> — GitHub rejects files
            over 100MB. Use Git LFS or remove the file.
          </li>
        </ul>

        <h2>Two protocols: SSH vs HTTPS</h2>
        <ul>
          <li>
            <strong>SSH</strong> URLs (<code>git@github.com:...</code>) —
            authenticate with an SSH key. One-time setup, then no passwords
            ever. Most developers' preference.
          </li>
          <li>
            <strong>HTTPS</strong> URLs (<code>https://github.com/...</code>)
            — authenticate with a personal access token (PAT). Easier for
            corporate networks that block SSH; less convenient long-term.
          </li>
        </ul>
      </LayerSection>

      <LayerSection layer="context">
        <WhereYoullSeeThis
          items={[
            { file: "git clone <url>", context: "How every new contributor starts. Day 1 on any project." },
            { file: "git push -u origin <branch>", context: "First push of a new branch. Sets up tracking so future `git push` works without args." },
            { context: "An agent says 'pulling latest main' — `git pull origin main`. Catching up before starting new work." },
            { file: "git fetch && git log origin/main..HEAD", context: "Reviewing what your branch has that main doesn't (without merging anything)." },
            { context: "When `git push` works for 6 months then suddenly fails: usually a rotated SSH key or expired PAT." },
          ]}
        />

        <AntiPattern
          bad={{
            title: "Force-pushing to main",
            body: (
              <>
                The agent's merge produced a mess, so they run{" "}
                <code>git push --force origin main</code>. This rewrites
                main's history on the remote, breaking everyone else who
                had pulled the old version. Some commits may be permanently
                lost.
              </>
            ),
          }}
          good={{
            title: "Never force-push to shared branches. On your own branch, use --force-with-lease.",
            body: (
              <>
                On main and other shared branches: never <code>--force</code>.
                On your own feature branch (e.g. after a rebase):{" "}
                <code>git push --force-with-lease</code> — refuses to overwrite
                someone else's commits you didn't see.
              </>
            ),
          }}
          why={
            <>
              Force-push rewrites history server-side. Anyone who pulled the
              previous version is now in a broken state. On main, this is a
              borderline-firing-offense in serious teams. On your own
              branches, <code>--force-with-lease</code> is the safety belt.
            </>
          }
        />
      </LayerSection>

      <LayerSection layer="gate">
        <MasteryCheck
          lessonN={34}
          questions={[
            {
              kind: "mcq",
              prompt:
                "You want a local copy of a GitHub repo you've never touched before. Which command?",
              options: [
                "git pull",
                "git clone <url>",
                "git fetch",
                "git push",
              ],
              answer: 1,
              explanation:
                "clone downloads the full repo + history + sets up origin. First-touch only.",
            },
            {
              kind: "mcq",
              prompt: "What does `git pull` actually do, under the hood?",
              options: [
                "Just downloads files.",
                "git fetch (download new commits) + git merge (fold them into your branch). It can cause conflicts.",
                "Resets your branch.",
                "Pushes your commits.",
              ],
              answer: 1,
              explanation:
                "pull = fetch + merge. Knowing this is why pulls can produce conflicts.",
            },
            {
              kind: "fill",
              prompt:
                "First push of a new branch uses `git push ___ origin <branch>` so that future plain `git push` works.",
              answers: ["-u", "--set-upstream"],
              placeholder: "flag",
              explanation:
                "`-u` (set-upstream) wires your local branch to track origin/<branch>.",
            },
            {
              kind: "multi",
              prompt:
                "Common reasons `git push` fails:",
              options: [
                "Remote has commits you don't (non-fast-forward).",
                "Your SSH key isn't registered with GitHub.",
                "The branch is protected (requires PR).",
                "A file is larger than 100MB.",
                "You used the wrong shell.",
              ],
              answer: [0, 1, 2, 3],
              explanation:
                "Those four are the common failures. Wrong shell isn't a thing.",
            },
            {
              kind: "mcq",
              prompt:
                "Your AI agent runs `git push --force origin main` to 'clean things up.' What's the orchestrator response?",
              options: [
                "Approve.",
                "Reject hard. Force-push to main rewrites shared history, breaks every other clone, can lose commits. On YOUR OWN branches, use `--force-with-lease` only.",
                "Reboot the laptop.",
                "Use `--force-with-glee` instead.",
              ],
              answer: 1,
              explanation:
                "Force on main = career-shortening move. `--force-with-lease` only on personal branches.",
            },
          ]}
        />
      </LayerSection>
    </>
  );
}
