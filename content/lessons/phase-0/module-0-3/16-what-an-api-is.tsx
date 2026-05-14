import { LayerSection } from "@/components/lesson/LayerSection";
import { ConceptCard } from "@/components/interactive/ConceptCard";
import { RequestResponse } from "@/components/interactive/RequestResponse";
import { Diagram, DBox, DArrow } from "@/components/interactive/Diagram";
import { AntiPattern } from "@/components/interactive/AntiPattern";
import { WhereYoullSeeThis } from "@/components/interactive/WhereYoullSeeThis";
import { MasteryCheck } from "@/components/interactive/MasteryCheck";

export default function Lesson16() {
  return (
    <>
      <LayerSection layer="why">
        <p>
          Every modern app is APIs talking to APIs talking to APIs. When your
          AI agent says "we'll call the Stripe API," "we'll integrate with
          Slack," "we'll use OpenAI's API" — it's all the same idea: ask
          another service for data or actions. This is the most important
          mental model in modern software.
        </p>
      </LayerSection>

      <LayerSection layer="model">
        <ConceptCard
          front={<>What is an API?</>}
          back={
            <p className="text-center text-lg">
              An <strong>API</strong> (Application Programming Interface) is
              a contract: "send me this kind of request, I'll send you back
              this kind of response." On the web, the request and response
              are almost always HTTP and JSON.
            </p>
          }
        />

        <Diagram caption="The mental model. Your app doesn't have to know how Stripe processes payments. It only has to know how to ASK Stripe to do it.">
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <DBox label="Your app" tone="accent" sub="the caller" />
            <DArrow direction="right" label="HTTP request" />
            <DBox label="Their API" tone="info" sub="the service" />
            <DArrow direction="left" label="JSON response" />
          </div>
        </Diagram>
      </LayerSection>

      <LayerSection layer="concept">
        <h2>The contract</h2>
        <p>An API contract tells you:</p>
        <ul>
          <li>What <strong>endpoints</strong> exist (URLs + verbs).</li>
          <li>What <strong>parameters</strong> they expect.</li>
          <li>What <strong>shape</strong> the response will have.</li>
          <li>What <strong>errors</strong> can happen.</li>
          <li>How to <strong>authenticate</strong> (API key, OAuth, etc).</li>
          <li>What the <strong>rate limits</strong> are.</li>
        </ul>
        <p>
          This contract lives in the API's <em>documentation</em>. Every
          serious API publishes one. Reading API docs is a daily orchestrator
          skill.
        </p>

        <h2>A real-world example — sending an email</h2>
        <RequestResponse
          method="POST"
          url="https://api.resend.com/emails"
          reqHeaders={{
            Authorization: "Bearer re_abc123",
            "Content-Type": "application/json",
          }}
          reqBody={`{
  "from": "you@yourdomain.com",
  "to": "customer@example.com",
  "subject": "Welcome!",
  "html": "<p>Hello</p>"
}`}
          status={200}
          statusText="OK"
          resHeaders={{ "Content-Type": "application/json" }}
          resBody={`{
  "id": "4ef9a417-..."
}`}
        />

        <p>
          That's it. To send an email, your code does HTTP, posts JSON,
          receives JSON. The provider handles deliverability, retries,
          spam filtering — your concern is just the contract.
        </p>

        <h2>Internal vs. external APIs</h2>
        <ul>
          <li>
            <strong>External APIs</strong> — services like Stripe, Twilio,
            OpenAI. You pay them, you use their API.
          </li>
          <li>
            <strong>Internal APIs</strong> — your frontend calling your own
            backend (e.g. <code>/api/users</code> in a Next.js app). Same
            mechanism, but you control both sides.
          </li>
        </ul>

        <h2>Authentication</h2>
        <p>
          APIs almost always require proof of identity. The two common ways:
        </p>
        <ul>
          <li>
            <strong>API key</strong> — a long random string you put in the
            <code>Authorization</code> header. Simple. Used for most service
            APIs.
          </li>
          <li>
            <strong>OAuth</strong> — a multi-step dance where users grant
            your app permission. Used when acting on behalf of a user (e.g.
            "Sign in with Google"). Lesson 140.
          </li>
        </ul>
      </LayerSection>

      <LayerSection layer="context">
        <WhereYoullSeeThis
          items={[
            { context: "Your AI agent uses the OpenAI API to generate text — same pattern: HTTP POST with JSON, get JSON back." },
            { file: "fetch('/api/users', { method: 'POST', body: JSON.stringify({...}) })", context: "Frontend code calling its own backend API." },
            { context: "Stripe sends you a webhook (lesson 231) — Stripe calling YOUR API. Same pattern, reversed." },
            { file: "Authorization: Bearer sk_test_...", context: "Standard API auth header. The 'Bearer' part is convention." },
            { context: "An agent says 'we hit the rate limit' — the external API rejected the request because too many were sent in a window. Standard." },
          ]}
        />

        <AntiPattern
          bad={{
            title: "Calling an external API directly from the browser",
            body: (
              <>
                The agent has the frontend call Stripe directly:{" "}
                <code>fetch('https://api.stripe.com/...', {`{Authorization: 'Bearer sk_live_...'}`})</code>.
                The secret key is now visible to every user's browser.
              </>
            ),
          }}
          good={{
            title: "Call external APIs from your backend",
            body: (
              <>
                Frontend calls your backend → your backend (with the secret
                key in its env vars) calls Stripe → result flows back to the
                frontend. The secret never leaves the server.
              </>
            ),
          }}
          why={
            <>
              Any key the browser can see, attackers can see. Secrets stay on
              the server. The frontend's job is to talk to your backend; the
              backend talks to the world.
            </>
          }
        />
      </LayerSection>

      <LayerSection layer="gate">
        <MasteryCheck
          lessonN={16}
          questions={[
            {
              kind: "mcq",
              prompt: "What is an API, in one sentence?",
              options: [
                "A type of database.",
                "A contract for how two pieces of software exchange data — on the web, usually via HTTP and JSON.",
                "A web browser feature.",
                "A programming language.",
              ],
              answer: 1,
              explanation: "API = contract. Send this request → get this response.",
            },
            {
              kind: "mcq",
              prompt:
                "Your AI agent puts your Stripe SECRET key in the frontend code so it can call Stripe directly. What's the issue?",
              options: [
                "Nothing — it's fast.",
                "Every user's browser can read the secret key. It's effectively published. Move the call to the backend.",
                "Stripe doesn't accept browser calls.",
                "Frontends can't do HTTP.",
              ],
              answer: 1,
              explanation:
                "Secrets stay on the server. Browser-visible = compromised.",
            },
            {
              kind: "multi",
              prompt:
                "Which of the following are typical contents of API documentation?",
              options: [
                "List of endpoints and verbs",
                "Authentication method",
                "Rate limits",
                "Response shapes",
                "Error codes",
              ],
              answer: [0, 1, 2, 3, 4],
              explanation: "All of them. Reading docs is THE skill.",
            },
            {
              kind: "fill",
              prompt:
                "What's the HTTP header used to send a long random string for authentication?",
              answers: ["Authorization", "authorization"],
              explanation: "Authorization: Bearer <key>.",
            },
            {
              kind: "mcq",
              prompt:
                "What's the difference between an external API and an internal API?",
              options: [
                "External APIs use HTTP, internal ones don't.",
                "External APIs belong to other companies (Stripe, OpenAI); internal APIs are your own (your frontend calling your backend). Same mechanism.",
                "Internal APIs are slower.",
                "External APIs don't need authentication.",
              ],
              answer: 1,
              explanation: "Same mechanism, different operator.",
            },
          ]}
        />
      </LayerSection>
    </>
  );
}
