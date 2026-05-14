import { LayerSection } from "@/components/lesson/LayerSection";
import { ConceptCard } from "@/components/interactive/ConceptCard";
import { RequestResponse } from "@/components/interactive/RequestResponse";
import { AntiPattern } from "@/components/interactive/AntiPattern";
import { WhereYoullSeeThis } from "@/components/interactive/WhereYoullSeeThis";
import { MasteryCheck } from "@/components/interactive/MasteryCheck";

export default function Lesson15() {
  return (
    <>
      <LayerSection layer="why">
        <p>
          HTTP is the language every web app speaks. Your AI agent will build
          backend APIs that speak HTTP, frontends that consume HTTP, and
          infrastructure that routes HTTP. If you can read an HTTP exchange,
          you can debug 80% of "the app is broken" problems.
        </p>
      </LayerSection>

      <LayerSection layer="model">
        <ConceptCard
          front={<>What is HTTP, in plain English?</>}
          back={
            <p className="text-center text-lg">
              HTTP is a <strong>text-based question-and-answer protocol</strong>:
              a client sends a request, the server sends a response, the
              conversation ends. HTTPS is the same thing inside an encrypted
              tunnel.
            </p>
          }
        />
      </LayerSection>

      <LayerSection layer="concept">
        <h2>Anatomy of an HTTP request</h2>
        <p>An HTTP request is just text. It has three parts:</p>
        <ol>
          <li>
            <strong>Start line</strong> — the verb, the path, and the version.
            (<code>GET /users/42 HTTP/1.1</code>)
          </li>
          <li>
            <strong>Headers</strong> — key:value pairs with metadata. Who you
            are, what you accept, what cookies you have, etc.
          </li>
          <li>
            <strong>Body</strong> — optional. The payload (e.g. JSON for a
            POST).
          </li>
        </ol>

        <p>Responses have the same shape, except the start line is the status code instead of a verb.</p>

        <RequestResponse
          method="GET"
          url="/users/42"
          reqHeaders={{
            Host: "api.example.com",
            Accept: "application/json",
            Authorization: "Bearer abc123",
          }}
          status={200}
          statusText="OK"
          resHeaders={{ "Content-Type": "application/json" }}
          resBody={`{
  "id": 42,
  "name": "Ada Lovelace"
}`}
        />

        <h2>The verbs (HTTP methods)</h2>
        <ul>
          <li><strong>GET</strong> — read. Should never modify anything.</li>
          <li><strong>POST</strong> — create something new.</li>
          <li><strong>PUT</strong> — replace something entirely.</li>
          <li><strong>PATCH</strong> — update part of something.</li>
          <li><strong>DELETE</strong> — remove.</li>
        </ul>

        <h2>The most useful headers</h2>
        <ul>
          <li><code>Content-Type</code> — what the body is (<code>application/json</code>, <code>text/html</code>).</li>
          <li><code>Authorization</code> — credentials, like a JWT.</li>
          <li><code>Cookie</code> — small bits of state the browser remembers.</li>
          <li><code>Accept</code> — what response formats the client can handle.</li>
          <li><code>User-Agent</code> — identifies the browser or client app.</li>
        </ul>

        <h2>HTTP is stateless</h2>
        <p>
          Every request stands alone. The server doesn't remember your last
          request unless you tell it (with a cookie, a token, or a session
          ID). This is why authentication has to be re-sent on every request.
        </p>

        <h2>HTTPS — the encrypted version</h2>
        <p>
          HTTPS is just HTTP wrapped in TLS encryption. Once the TLS handshake
          (from lesson 13) is done, all the bytes — including your password —
          are unreadable to anyone in the middle. This is why login forms must
          be on HTTPS. <strong>In 2026, almost no production traffic is
          plain HTTP.</strong>
        </p>
      </LayerSection>

      <LayerSection layer="context">
        <WhereYoullSeeThis
          items={[
            { context: "Browser DevTools → Network → click any request: you see the exact verb, headers, body, status, and response headers." },
            { file: "fetch('/api/users')", context: "JavaScript code that sends an HTTP GET. The default verb is GET if you don't specify." },
            { file: "curl -X POST -d '{}' https://...", context: "curl is the standard CLI for sending HTTP requests. -X sets the verb, -d sends a body." },
            { context: "An agent says 'we'll PATCH this user' — they mean an HTTP PATCH verb to update part of the user record." },
            { context: "When you see 'Mixed content blocked' — your HTTPS page tried to load something over HTTP, the browser refused." },
          ]}
        />

        <AntiPattern
          bad={{
            title: "Using GET for an action that changes data",
            body: (
              <>
                The agent makes <code>GET /api/delete-user/42</code>. Now any
                browser preloading links, link previewer, or accidentally
                shared URL can delete users.
              </>
            ),
          }}
          good={{
            title: "GET reads. POST/PUT/PATCH/DELETE write.",
            body: (
              <>
                Delete via <code>DELETE /api/users/42</code>. Browsers,
                caches, and crawlers know GETs are safe — they preload them
                freely. Writes must be a non-GET verb.
              </>
            ),
          }}
          why={
            <>
              The verbs aren't decoration — they communicate intent to every
              layer: the browser, the cache, the CDN, the security scanner.
              Using GET for writes is the kind of thing that becomes a
              dramatic incident when someone shares the wrong link.
            </>
          }
        />
      </LayerSection>

      <LayerSection layer="gate">
        <MasteryCheck
          lessonN={15}
          questions={[
            {
              kind: "mcq",
              prompt: "Which HTTP verb is used to READ a resource without modifying anything?",
              options: ["POST", "GET", "DELETE", "PATCH"],
              answer: 1,
              explanation: "GET = read. Never mutate state in a GET handler.",
            },
            {
              kind: "multi",
              prompt:
                "Which of these are part of an HTTP request?",
              options: ["Start line (verb + path)", "Headers", "A 12-digit token", "Body (optional)", "Color preference"],
              answer: [0, 1, 3],
              explanation: "Three parts: start line, headers, body. The other two are fiction.",
            },
            {
              kind: "fill",
              prompt:
                "What's the standard header used to pass an authentication credential like a JWT?",
              answers: ["Authorization", "authorization"],
              explanation:
                "Authorization: Bearer <token>. Required for any API that requires auth.",
            },
            {
              kind: "mcq",
              prompt: "What does it mean that HTTP is 'stateless'?",
              options: [
                "It cannot be used in apps with state.",
                "Each request stands alone — the server doesn't remember previous requests unless the client explicitly resends identifiers (cookies, tokens).",
                "It runs in stateless servers only.",
                "It doesn't work with cookies.",
              ],
              answer: 1,
              explanation:
                "Statelessness is why every authenticated request re-sends the token.",
            },
            {
              kind: "mcq",
              prompt:
                "Your AI agent implements user deletion as `GET /delete/123`. What's the pushback?",
              options: [
                "Sounds great.",
                "GETs should be safe (no side effects). Use DELETE /users/123 so caches, crawlers, and previewers don't accidentally trigger deletions.",
                "Use PUT instead.",
                "Add more headers.",
              ],
              answer: 1,
              explanation:
                "Verbs communicate intent across the whole stack. Never modify on a GET.",
            },
          ]}
        />
      </LayerSection>
    </>
  );
}
