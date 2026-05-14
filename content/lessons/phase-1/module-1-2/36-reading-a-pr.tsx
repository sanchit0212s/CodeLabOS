import { LayerSection } from "@/components/lesson/LayerSection";
import { ConceptCard } from "@/components/interactive/ConceptCard";
import { AntiPattern } from "@/components/interactive/AntiPattern";
import { WhereYoullSeeThis } from "@/components/interactive/WhereYoullSeeThis";
import { MasteryCheck } from "@/components/interactive/MasteryCheck";

export default function Lesson36() {
  return (
    <>
      <LayerSection layer="why">
        <p>
          This is the lesson where the orchestrator role becomes concrete.
          Every AI-generated change passes through your review. The seven
          questions below are the checklist a senior engineer runs through
          every time they open a PR. Internalize them and you graduate
          from "rubber-stamping" to "directing."
        </p>
      </LayerSection>

      <LayerSection layer="model">
        <ConceptCard
          front={<>What's the senior engineer's mental model when reading a PR?</>}
          back={
            <p className="text-center text-lg">
              Run <strong>seven questions</strong> against every PR, in this
              order: scope · risk · correctness · testing · readability ·
              security · operability. The first four block merge; the last
              three guide comments.
            </p>
          }
        />
      </LayerSection>

      <LayerSection layer="concept">
        <h2>The seven questions</h2>

        <h3>1. Scope — is this PR doing one thing?</h3>
        <p>
          A clean PR has one job: "add login form," "fix N+1 query in
          dashboard," "upgrade Next.js to 14.2." If the diff has unrelated
          changes mixed in (refactors, dependency bumps, typos), they
          should be separate PRs. <em>"Do one thing well"</em> applies to
          PRs even more than to code.
        </p>
        <p>
          <strong>What to look for:</strong> Does the title describe one
          thing? Is every file in the diff explainable by that one thing?
        </p>

        <h3>2. Risk — what's the blast radius if this breaks?</h3>
        <p>
          A change to a marketing page is low-risk. A change to the auth
          system, the billing pipeline, or database migrations is
          high-risk. High-risk PRs deserve more eyes, more tests, and
          slower merges (or feature flags).
        </p>
        <p>
          <strong>What to look for:</strong> Touches{" "}
          <code>auth/</code>, <code>billing/</code>, <code>migrations/</code>,{" "}
          <code>middleware</code>, or anything with "production" in its
          name → slow down and read carefully.
        </p>

        <h3>3. Correctness — does the code do what the description claims?</h3>
        <p>
          The biggest AI agent mistake category. The agent writes confident
          code that looks right but doesn't actually solve the problem.
          Read the code with the description in hand and ask "if I ran
          this, would it do exactly the thing claimed?"
        </p>
        <p>
          <strong>What to look for:</strong> Off-by-one errors, wrong field
          names, missing edge cases ("what if the array is empty?"),
          missing await/async, wrong HTTP verb.
        </p>

        <h3>4. Testing — is the change covered?</h3>
        <p>
          Did the agent add a test? Does the test actually test the
          behavior, or just call the function and check it doesn't throw?
          Were existing tests updated to reflect the new behavior?
        </p>
        <p>
          <strong>What to look for:</strong> New code without new tests is
          a yellow flag. Tests that just check "the function returned
          something" without checking what is a red flag.
        </p>

        <h3>5. Readability — will I understand this in six months?</h3>
        <p>
          Variable names, function size, comments at the WHY level (not
          the WHAT level), file organization. Code is read 10× more often
          than it's written.
        </p>
        <p>
          <strong>What to look for:</strong> Cryptic names (<code>x</code>,{" "}
          <code>doStuff</code>), 200-line functions, comments that just
          restate the code, magic numbers without names.
        </p>

        <h3>6. Security — does this open any holes?</h3>
        <p>
          The Anti-Pattern Bestiary lives here. Hardcoded secrets, missing
          input validation, SQL via string concatenation, missing auth
          checks on new endpoints, secrets logged to console.
        </p>
        <p>
          <strong>What to look for:</strong> Anything that touches user
          input, auth, or external services. Always assume the input is
          adversarial.
        </p>

        <h3>7. Operability — how will we know if this breaks in production?</h3>
        <p>
          Are there logs? Are errors surfaced to a monitoring system or
          silently swallowed? Will a metric show the change worked?
          Without observability, you'll find out about bugs from
          customers.
        </p>
        <p>
          <strong>What to look for:</strong> New code paths with no
          logging, broad try/catches with empty handlers, new external
          calls without timeouts.
        </p>

        <h2>The flow when you open a PR</h2>
        <ol>
          <li>Read the title and description. Form your expectation.</li>
          <li>Look at the file tree. Does the surface area match the description?</li>
          <li>Walk the diff, file by file, asking the seven questions.</li>
          <li>Leave inline comments where you have questions or concerns.</li>
          <li>Submit a review: approve, request changes, or comment.</li>
          <li>If approved + CI green + protection satisfied → merge.</li>
        </ol>

        <h2>Approve vs. request changes vs. comment</h2>
        <ul>
          <li>
            <strong>Approve</strong> — I'm satisfied. Safe to merge.
          </li>
          <li>
            <strong>Request changes</strong> — There are blocking issues.
            Don't merge until they're addressed. (Many repos require this
            to be cleared before merge.)
          </li>
          <li>
            <strong>Comment</strong> — Non-blocking feedback or
            discussion. Neither approves nor blocks.
          </li>
        </ul>

        <h2>The "LGTM" anti-pattern</h2>
        <p>
          "LGTM" (looks good to me) without context is the death of code
          review. It signals "I clicked approve but I didn't really
          engage." Either you read the PR — in which case your comments
          will show it — or you didn't. Don't be the bottleneck of
          plausible-looking rubber-stamps.
        </p>
      </LayerSection>

      <LayerSection layer="context">
        <WhereYoullSeeThis
          items={[
            { context: "Every PR you approve is YOUR signature on the change. Your job is to apply the seven questions before clicking the button." },
            { file: "PR description with 'How to test' section", context: "Good PRs tell you exactly how to verify. If the description doesn't, ask for one." },
            { context: "An agent asks 'is this ready to merge?' — your answer should walk through which of the seven questions are satisfied." },
            { file: "REVIEW_CHECKLIST.md in the repo", context: "Some teams check in a written checklist that mirrors the seven questions. Standardizes review." },
            { context: "When CI is green but you still find issues — CI catches the easy stuff. The hard stuff is what reviewers exist for." },
          ]}
        />

        <AntiPattern
          bad={{
            title: "Approving a PR by skimming the title",
            body: (
              <>
                The agent opens "fix login bug." You click approve without
                opening the diff. The PR also disables CSRF protection
                "while I was in there." You just shipped a vulnerability.
              </>
            ),
          }}
          good={{
            title: "Walk the diff, file by file, with the seven questions",
            body: (
              <>
                Open every changed file in the PR. For each one ask: is
                this part of the stated scope? Does it look correct? Are
                there security implications? Could it break in production
                silently? If anything is unclear, comment and ask.
              </>
            ),
          }}
          why={
            <>
              The whole point of the orchestrator role is to be the second
              brain on every change. Skipping the diff is skipping the
              role. AI agents make confident-looking mistakes; the diff is
              where they're caught.
            </>
          }
        />
      </LayerSection>

      <LayerSection layer="gate">
        <MasteryCheck
          lessonN={36}
          questions={[
            {
              kind: "multi",
              prompt:
                "Which of these are part of the senior-engineer PR review checklist?",
              options: [
                "Scope — is this PR doing one thing?",
                "Risk — what's the blast radius if it breaks?",
                "Correctness — does it do what the description claims?",
                "Beauty — does the code look pretty?",
                "Testing — is the change covered by tests?",
                "Security — does it open any holes?",
              ],
              answer: [0, 1, 2, 4, 5],
              explanation:
                "Scope, risk, correctness, testing, readability, security, operability. 'Beauty' is not the criterion.",
            },
            {
              kind: "mcq",
              prompt:
                "A PR titled 'add OAuth login' also contains 30 unrelated changes — typos, dependency bumps, a refactor. What's the right reviewer move?",
              options: [
                "Approve, those are nice cleanups.",
                "Request changes — ask for the unrelated bits to be split into separate PRs. Scope creep makes review unreliable.",
                "Merge it.",
                "Close the PR.",
              ],
              answer: 1,
              explanation:
                "Scope is the first question. One PR, one thing. Split.",
            },
            {
              kind: "mcq",
              prompt:
                "The PR touches `app/api/billing/charge.ts`. What's the orchestrator's instinct?",
              options: [
                "Skim and approve.",
                "Slow down. Billing = high blast radius. Read more carefully, demand tests, consider a feature flag, get a second reviewer if available.",
                "Skip this PR.",
                "Comment 'LGTM'.",
              ],
              answer: 1,
              explanation:
                "Risk dictates rigor. Billing, auth, migrations always get the slow read.",
            },
            {
              kind: "fill",
              prompt:
                "The 4-letter shorthand 'LGTM' (looks good to me) becomes an anti-pattern when used as a stand-in for what?",
              answers: ["a real review", "review", "reading the diff"],
              explanation:
                "LGTM without comments = nobody actually read the PR. Lethal to quality.",
            },
            {
              kind: "mcq",
              prompt:
                "The PR adds a new API endpoint but has no tests. CI is green (because the new code didn't break anything). What's the response?",
              options: [
                "Approve — CI is green.",
                "Request changes — new behavior needs new tests. CI being green only means existing tests still pass, not that the new code works.",
                "Ignore tests.",
                "Approve and add tests later.",
              ],
              answer: 1,
              explanation:
                "Untested new code is technical debt the moment it lands. Push back NOW.",
            },
          ]}
        />
      </LayerSection>
    </>
  );
}
