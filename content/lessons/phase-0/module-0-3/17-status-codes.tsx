import { LayerSection } from "@/components/lesson/LayerSection";
import { ConceptCard } from "@/components/interactive/ConceptCard";
import { AntiPattern } from "@/components/interactive/AntiPattern";
import { WhereYoullSeeThis } from "@/components/interactive/WhereYoullSeeThis";
import { MasteryCheck } from "@/components/interactive/MasteryCheck";

export default function Lesson17() {
  return (
    <>
      <LayerSection layer="why">
        <p>
          Status codes are how every HTTP server tells you what just happened.
          Knowing them on sight is like knowing how to read a thermometer. An
          agent that returns the wrong code makes debugging twice as hard for
          everyone downstream. An orchestrator who can spot a 200 returning an
          error body has prevented an incident.
        </p>
      </LayerSection>

      <LayerSection layer="model">
        <ConceptCard
          front={<>How does the first digit of a status code tell you everything?</>}
          back={
            <p className="text-center text-lg">
              The first digit categorizes the response:<br />
              <strong>2xx ok · 3xx go elsewhere · 4xx you screwed up · 5xx I screwed up</strong>
            </p>
          }
        />
      </LayerSection>

      <LayerSection layer="concept">
        <h2>The five classes</h2>
        <table>
          <thead><tr><th>Class</th><th>Meaning</th><th>Common examples</th></tr></thead>
          <tbody>
            <tr><td>1xx</td><td>Informational</td><td>You'll rarely see these.</td></tr>
            <tr><td>2xx</td><td><strong>Success</strong></td><td>200 OK, 201 Created, 204 No Content</td></tr>
            <tr><td>3xx</td><td><strong>Redirect</strong></td><td>301 Permanent, 302 Temporary, 304 Not Modified</td></tr>
            <tr><td>4xx</td><td><strong>Client error</strong></td><td>400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 409 Conflict, 422 Unprocessable, 429 Too Many Requests</td></tr>
            <tr><td>5xx</td><td><strong>Server error</strong></td><td>500 Internal Server Error, 502 Bad Gateway, 503 Service Unavailable, 504 Gateway Timeout</td></tr>
          </tbody>
        </table>

        <h2>The 12 codes worth memorizing</h2>
        <ul>
          <li><strong>200 OK</strong> — generic success.</li>
          <li><strong>201 Created</strong> — POST succeeded, new resource exists.</li>
          <li><strong>204 No Content</strong> — success, nothing to return (DELETE often).</li>
          <li><strong>301 Moved Permanently</strong> — and search engines update their index.</li>
          <li><strong>302 Found</strong> — temporary redirect.</li>
          <li><strong>400 Bad Request</strong> — your request was malformed.</li>
          <li><strong>401 Unauthorized</strong> — you didn't authenticate (despite the name).</li>
          <li><strong>403 Forbidden</strong> — you're authenticated, but not allowed.</li>
          <li><strong>404 Not Found</strong> — the resource doesn't exist.</li>
          <li><strong>409 Conflict</strong> — your request conflicts with current state (e.g. duplicate signup).</li>
          <li><strong>429 Too Many Requests</strong> — rate limit hit.</li>
          <li><strong>500 Internal Server Error</strong> — the server crashed handling your request.</li>
        </ul>

        <h2>The most confusing pair: 401 vs 403</h2>
        <ul>
          <li>
            <strong>401</strong> — "I don't know who you are." You forgot to
            send a token, or it's expired/invalid.
          </li>
          <li>
            <strong>403</strong> — "I know who you are, but you're not allowed
            to do this." Token is fine, you just don't have permission.
          </li>
        </ul>

        <h2>5xx is your fault. 4xx is the caller's fault.</h2>
        <p>
          If your AI agent returns 500 to mean "user typed an invalid email,"
          monitoring tools will flood your phone with alerts. Validation errors
          are 400 (or 422). 500 is reserved for "the server malfunctioned."
        </p>
      </LayerSection>

      <LayerSection layer="context">
        <WhereYoullSeeThis
          items={[
            { context: "Browser DevTools Network panel shows the status of every request. Red dots = 4xx or 5xx." },
            { context: "Monitoring systems alert when 5xx rate spikes. Knowing this stops you from setting 4xx alerts too sensitive." },
            { file: "if (response.status === 401) redirectToLogin()", context: "Common frontend pattern — react to a 401 by sending the user to sign in." },
            { context: "An agent says 'we got a 429' — you've hit the rate limit. Back off and retry with delay." },
            { context: "A 504 from a load balancer = backend didn't respond in time. The proxy gave up. Look at your backend logs." },
          ]}
        />

        <AntiPattern
          bad={{
            title: "Returning 200 OK with `{ error: 'not found' }` in the body",
            body: (
              <>
                The agent returns 200 even on errors, embedding error details
                in the body. Now every monitoring tool, retry, and cache
                treats failures as successes.
              </>
            ),
          }}
          good={{
            title: "Match the status code to the actual outcome",
            body: (
              <>
                Not found? <code>404</code>. Bad input? <code>400</code> or{" "}
                <code>422</code>. Crash? <code>500</code>. The status code
                is part of the API contract — it tells the rest of the world
                what really happened.
              </>
            ),
          }}
          why={
            <>
              CDN caches, retry libraries, error trackers, browser dev tools,
              load balancers — all of them act on the status code. Lying with
              200 breaks every one of them at once.
            </>
          }
        />
      </LayerSection>

      <LayerSection layer="gate">
        <MasteryCheck
          lessonN={17}
          questions={[
            {
              kind: "mcq",
              prompt: "What's the difference between 401 and 403?",
              options: [
                "They're the same.",
                "401 = not authenticated (no/bad token). 403 = authenticated but not allowed.",
                "401 is for GET, 403 is for POST.",
                "401 is success, 403 is failure.",
              ],
              answer: 1,
              explanation:
                "401: 'who are you?' 403: 'I know who you are, but no.' Despite the name 401 = unauthorized, it's actually about authentication.",
            },
            {
              kind: "mcq",
              prompt: "A user sends a malformed JSON body to your API. What status do you return?",
              options: ["200", "302", "400", "500"],
              answer: 2,
              explanation:
                "400 Bad Request — the client's fault. 422 Unprocessable is also common for validation errors.",
            },
            {
              kind: "fill",
              prompt: "Which 3-digit status code means 'rate limit exceeded'?",
              answers: ["429"],
              explanation: "429 Too Many Requests. Back off and retry.",
            },
            {
              kind: "multi",
              prompt:
                "Which status codes indicate the SERVER is at fault?",
              options: ["404", "500", "503", "504", "400"],
              answer: [1, 2, 3],
              explanation:
                "5xx = server error. 4xx are client errors (including 404, even though 'not found' often feels like the server's problem).",
            },
            {
              kind: "mcq",
              prompt:
                "Your AI agent returns `200 OK` with `{error: 'not found'}` for missing resources. What's the orchestrator's response?",
              options: [
                "Approve — JSON has the error info.",
                "Reject. The status code is part of the contract. Use 404. Otherwise caches, retry libs, monitoring, and DevTools will all be lied to.",
                "Use 401 instead.",
                "Add more headers.",
              ],
              answer: 1,
              explanation:
                "Status codes drive behavior across the whole stack. Get them right.",
            },
          ]}
        />
      </LayerSection>
    </>
  );
}
