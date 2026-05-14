import { LayerSection } from "@/components/lesson/LayerSection";
import { ConceptCard } from "@/components/interactive/ConceptCard";
import { AnnotatedCode } from "@/components/interactive/AnnotatedCode";
import { TerminalSim } from "@/components/interactive/TerminalSim";
import { AntiPattern } from "@/components/interactive/AntiPattern";
import { WhereYoullSeeThis } from "@/components/interactive/WhereYoullSeeThis";
import { MasteryCheck } from "@/components/interactive/MasteryCheck";

export default function Lesson31() {
  return (
    <>
      <LayerSection layer="why">
        <p>
          Merge conflicts panic beginners. They shouldn't. A conflict is just
          Git saying "two branches both changed this line — pick one." Knowing
          how to read the conflict markers and what to do takes 10 minutes to
          learn and saves you a career of fear.
        </p>
      </LayerSection>

      <LayerSection layer="model">
        <ConceptCard
          front={<>What is a merge conflict?</>}
          back={
            <p className="text-center text-lg">
              When two branches changed the <strong>same lines</strong> of the
              same file, Git can't decide whose version wins. It pauses the
              merge, marks the conflicting region in the file with markers,
              and asks a human to choose.
            </p>
          }
        />
      </LayerSection>

      <LayerSection layer="concept">
        <h2>What you actually see</h2>
        <p>
          You run <code>git merge feat/login</code>. Git stops and prints:
        </p>
        <pre>{`Auto-merging app/page.tsx
CONFLICT (content): Merge conflict in app/page.tsx
Automatic merge failed; fix conflicts and then commit the result.`}</pre>
        <p>
          Open <code>app/page.tsx</code> and you find a region wrapped in
          conflict markers:
        </p>

        <AnnotatedCode
          filename="app/page.tsx — with conflict markers"
          lines={[
            { code: "<<<<<<< HEAD",                       note: "everything below this line is what's on YOUR side (main)" },
            { code: '  <h1>Welcome to my app</h1>',       note: "main's version" },
            { code: "=======",                            note: "the divider" },
            { code: '  <h1>Hello and welcome!</h1>',      note: "the OTHER branch's version (feat/login)" },
            { code: ">>>>>>> feat/login",                 note: "end of the conflict region" },
          ]}
        />

        <h2>Your three options</h2>
        <ol>
          <li>
            <strong>Keep yours.</strong> Delete the OTHER side and the markers.
          </li>
          <li>
            <strong>Keep theirs.</strong> Delete YOUR side and the markers.
          </li>
          <li>
            <strong>Combine.</strong> Write something new that incorporates
            both. (Often the right answer.)
          </li>
        </ol>

        <p>
          When you're done, the file should NOT contain any of the{" "}
          <code>{"<<<<<<<"}</code>, <code>=======</code>, or{" "}
          <code>{">>>>>>>"}</code> markers.
        </p>

        <h2>Completing the merge</h2>
        <TerminalSim
          title="resolving and committing"
          lines={[
            { kind: "cmd", text: "git status", annotate: "see what's conflicted" },
            { kind: "out", text: "You have unmerged paths." },
            { kind: "out", text: "Unmerged paths:" },
            { kind: "out", text: "        both modified:   app/page.tsx" },

            { kind: "note", text: "...edit app/page.tsx, remove conflict markers..." },

            { kind: "cmd", text: "git add app/page.tsx", annotate: "tell Git you've resolved it" },
            { kind: "cmd", text: "git commit", annotate: "finalize the merge — opens editor with default message" },
            { kind: "out", text: "[main e4f5g6h] Merge branch 'feat/login'" },
          ]}
        />

        <h2>If you panic and want out</h2>
        <p>
          <code>git merge --abort</code> rolls everything back to before you
          started the merge. Like nothing happened. Use this if you've made
          a mess and want a fresh start.
        </p>

        <h2>Why conflicts happen</h2>
        <p>
          You and the agent both edited <code>line 42</code> of the same
          file. Git doesn't know whether yours or theirs is "right." It's
          asking you to decide. <strong>Most conflicts are small and
          obvious</strong> — different formatting changes, different small
          edits to neighboring code. Big conflicts almost always come from
          long-lived branches (lesson 30's anti-pattern).
        </p>

        <h2>Conflicts in package-lock.json</h2>
        <p>
          A special case: <code>package-lock.json</code> conflicts can be
          enormous and incomprehensible. The fix is rarely to merge by hand —
          you delete the file and run <code>npm install</code> to regenerate
          it, then commit. (Same trick for yarn.lock, pnpm-lock.yaml.)
        </p>

        <h2>VS Code makes this easier</h2>
        <p>
          Open a conflicted file in VS Code and you'll see "Accept Current
          Change", "Accept Incoming Change", "Accept Both", or "Compare
          Changes" buttons inline. Much friendlier than editing the markers
          by hand. Most modern editors have this.
        </p>
      </LayerSection>

      <LayerSection layer="context">
        <WhereYoullSeeThis
          items={[
            { context: "Conflicts often appear when you rebase or merge a long-lived branch into main, or pull recent main into your feature branch." },
            { file: "<<<<<<< HEAD ... ======= ... >>>>>>> branch", context: "The classic conflict markers. If you see these in production code, someone forgot to clean up." },
            { context: "An agent says 'I'm resolving conflicts' — they're picking which side of each region to keep (or combining)." },
            { file: "git merge --abort", context: "Emergency exit. Restores everything to pre-merge state." },
            { context: "When you `git pull` and get conflicts — same thing as merge conflicts. Pull = fetch + merge." },
          ]}
        />

        <AntiPattern
          bad={{
            title: "Committing conflict markers into the codebase",
            body: (
              <>
                The agent resolves conflicts but accidentally leaves a stray{" "}
                <code>{"<<<<<<<"}</code> or <code>=======</code> in a file.
                The build fails (or worse, doesn't fail but produces garbage
                output).
              </>
            ),
          }}
          good={{
            title: "Search for leftover markers before committing",
            body: (
              <>
                After resolving:{" "}
                <code>grep -nR "{"<<<<<<<"}\\|=======\\|{">>>>>>>"}" .</code>{" "}
                should return nothing. Many editors highlight these markers
                in red so you can't miss them.
              </>
            ),
          }}
          why={
            <>
              Conflict markers are not valid code in any language. Forgetting
              one ships a broken file. It's the single most preventable
              merge mistake.
            </>
          }
        />
      </LayerSection>

      <LayerSection layer="gate">
        <MasteryCheck
          lessonN={31}
          questions={[
            {
              kind: "mcq",
              prompt: "What causes a merge conflict?",
              options: [
                "Different branches.",
                "Two branches changed the same lines of the same file, so Git can't decide whose version wins.",
                "A bug in Git.",
                "Running out of memory.",
              ],
              answer: 1,
              explanation:
                "Same lines, two changes. Git pauses and asks a human to choose.",
            },
            {
              kind: "multi",
              prompt:
                "Which of these are the three conflict markers Git inserts into a file?",
              options: [
                "<<<<<<<",
                "// CONFLICT",
                "=======",
                ">>>>>>>",
                "[MERGE]",
              ],
              answer: [0, 2, 3],
              explanation:
                "`<<<<<<<` opens, `=======` divides, `>>>>>>>` closes. Memorize the shape.",
            },
            {
              kind: "fill",
              prompt:
                "After you edit the file to resolve a conflict, what's the next Git command (before commit)?",
              answers: ["git add", "add"],
              explanation:
                "`git add` tells Git 'I've resolved this.' Then commit finalizes the merge.",
            },
            {
              kind: "mcq",
              prompt:
                "You're mid-merge, things are a mess, you want to bail. What command undoes everything and gets you back to pre-merge?",
              options: [
                "git reset --hard",
                "git merge --abort",
                "git commit --amend",
                "git checkout main",
              ],
              answer: 1,
              explanation:
                "`git merge --abort` is purpose-built for this. The other commands have side effects.",
            },
            {
              kind: "mcq",
              prompt:
                "You're merging and get a 4000-line conflict in `package-lock.json`. What's the right move?",
              options: [
                "Edit each line by hand.",
                "Delete the lockfile and re-run `npm install`, then commit the regenerated file. Don't merge lockfiles by hand.",
                "Skip the merge.",
                "Use a different package manager.",
              ],
              answer: 1,
              explanation:
                "Lockfiles are auto-generated. Regenerate; don't merge.",
            },
          ]}
        />
      </LayerSection>
    </>
  );
}
