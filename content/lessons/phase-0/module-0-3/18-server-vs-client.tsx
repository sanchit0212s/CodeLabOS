import { LayerSection } from "@/components/lesson/LayerSection";
import { ConceptCard } from "@/components/interactive/ConceptCard";
import { Diagram, DBox, DArrow } from "@/components/interactive/Diagram";
import { AntiPattern } from "@/components/interactive/AntiPattern";
import { WhereYoullSeeThis } from "@/components/interactive/WhereYoullSeeThis";
import { MasteryCheck } from "@/components/interactive/MasteryCheck";

export default function Lesson18() {
  return (
    <>
      <LayerSection layer="why">
        <p>
          Many AI agent bugs come from confusion about "where this code runs."
          Code in the browser can be read and tampered with by the user. Code
          on the server cannot. If you don't have this line clear in your
          head, you'll approve security mistakes that put secrets in the
          wrong place.
        </p>
      </LayerSection>

      <LayerSection layer="model">
        <ConceptCard
          front={<>What's the difference between a server and a client?</>}
          back={
            <p className="text-center text-lg">
              The <strong>client</strong> initiates the request — usually a
              browser or a mobile app, running on someone else's device. The
              <strong> server</strong> waits for and answers requests —
              running on a machine you control. <em>Same code, different
              trust level.</em>
            </p>
          }
        />

        <Diagram caption="Same protocol, different worlds. Anything visible to the client is visible to everyone. Anything kept on the server can stay secret.">
          <div className="flex items-center gap-6 flex-wrap justify-center">
            <div className="flex flex-col items-center gap-2">
              <DBox label="Client" tone="info" sub="browser / mobile app" />
              <span className="text-[10px] font-mono text-ink-mute uppercase tracking-widest">untrusted environment</span>
            </div>
            <DArrow direction="right" label="HTTP" />
            <div className="flex flex-col items-center gap-2">
              <DBox label="Server" tone="accent" sub="your machine in the cloud" />
              <span className="text-[10px] font-mono text-ink-mute uppercase tracking-widest">your turf</span>
            </div>
          </div>
        </Diagram>
      </LayerSection>

      <LayerSection layer="concept">
        <h2>Why the distinction matters</h2>

        <h3>The client runs on the user's device</h3>
        <ul>
          <li>The user can open DevTools and read every line of JS.</li>
          <li>They can modify it before running it.</li>
          <li>They can replay requests, intercept responses, lie about anything.</li>
          <li>Anything sent to the client is, for security purposes, <strong>public</strong>.</li>
        </ul>

        <h3>The server runs on your infrastructure</h3>
        <ul>
          <li>You control the code and the environment.</li>
          <li>Secrets in the server's environment never reach a user's device.</li>
          <li>The database is reachable only by your servers (ideally).</li>
          <li>Validation done here is the only validation that counts.</li>
        </ul>

        <h2>The cardinal rule</h2>
        <p>
          <strong>Never trust the client. Always validate on the server.</strong>
        </p>
        <p>
          A user can edit the price hidden in your checkout form to be $1.
          If your server takes that price at face value, you've been robbed.
          The client can do nice things like form validation for UX — but the
          authoritative check has to be on the server.
        </p>

        <h2>"Same code, two homes" — the modern wrinkle</h2>
        <p>
          Modern frameworks like Next.js run the same JavaScript both on the
          server (during initial page render) and the client (for interactivity).
          This is powerful but a frequent source of bugs and security holes,
          because the boundary becomes less obvious. We'll dig in during
          Phase 6.
        </p>

        <h2>Client-side vs server-side in plain examples</h2>
        <table>
          <thead><tr><th>Where it runs</th><th>Example</th></tr></thead>
          <tbody>
            <tr><td>Client</td><td>The React component rendering the page in your browser.</td></tr>
            <tr><td>Client</td><td>The JavaScript that handles a button click.</td></tr>
            <tr><td>Server</td><td>The Express/FastAPI route that processes a POST to /api/orders.</td></tr>
            <tr><td>Server</td><td>The code that talks to your database.</td></tr>
            <tr><td>Both</td><td>A React component used both for SSR and in-browser rendering.</td></tr>
          </tbody>
        </table>
      </LayerSection>

      <LayerSection layer="context">
        <WhereYoullSeeThis
          items={[
            { context: "'use client' or 'use server' in Next.js — explicit markers for which side a component runs on." },
            { file: "process.env.NEXT_PUBLIC_*", context: "Next.js convention: env vars prefixed with NEXT_PUBLIC_ are exposed to the browser. EVERYTHING ELSE stays server-only." },
            { context: "An agent puts an API key in code without NEXT_PUBLIC_ prefix — only the server can read it. Move it there." },
            { context: "Validation errors only on the frontend = no security. A determined user can bypass any frontend check." },
            { file: "if (currentUser.role === 'admin')", context: "If this check is in client code, the user can fake it. If on the server, it's enforced." },
          ]}
        />

        <AntiPattern
          bad={{
            title: "Doing authorization checks on the client only",
            body: (
              <>
                The agent hides the admin button in the UI when the user isn't
                an admin. But the admin API endpoint doesn't check. Anyone can
                call it.
              </>
            ),
          }}
          good={{
            title: "UI checks are for UX. Server checks are for security.",
            body: (
              <>
                Hide the button (nicer experience) AND verify on the server
                that the caller has admin role before doing the action.
                Defense in depth.
              </>
            ),
          }}
          why={
            <>
              UI is the suggestion. The server is the enforcer. An attacker
              skips your UI entirely and calls the API directly. Whatever
              checks aren't there are checks that don't exist.
            </>
          }
        />
      </LayerSection>

      <LayerSection layer="gate">
        <MasteryCheck
          lessonN={18}
          questions={[
            {
              kind: "mcq",
              prompt: "Which statement is true?",
              options: [
                "Code that runs on the client can be inspected and modified by the user.",
                "Server code can be read by anyone who visits the website.",
                "Frontend code is more trusted than backend code.",
                "Servers and clients always run on different operating systems.",
              ],
              answer: 0,
              explanation:
                "The user owns the client. Anything sent there can be read and tampered with.",
            },
            {
              kind: "multi",
              prompt:
                "Which of these should ONLY exist on the server, never in client code?",
              options: [
                "Database password",
                "Stripe secret key",
                "JWT signing secret",
                "Public app name (e.g. 'CodeLabOS')",
                "OpenAI API key",
              ],
              answer: [0, 1, 2, 4],
              explanation:
                "Anything granting access or revealing internals stays server-side. Public values are fine in the client.",
            },
            {
              kind: "mcq",
              prompt:
                "Your AI agent hides the 'delete user' button in the UI for non-admins. The API endpoint that deletes users has no role check. What's wrong?",
              options: [
                "Nothing — non-admins can't see the button.",
                "Anyone can call the API directly (curl, Postman) and delete users. UI checks are not security.",
                "The button should be smaller.",
                "Add a confirmation dialog.",
              ],
              answer: 1,
              explanation:
                "Server must enforce. UI is for UX, not security. This is one of the most common AI-generated bugs.",
            },
            {
              kind: "fill",
              prompt:
                "Complete the cardinal rule: 'Never ______ the client. Always validate on the server.'",
              answers: ["trust"],
              explanation:
                "Trust nothing from the client. Validate on the server.",
            },
            {
              kind: "mcq",
              prompt:
                "What does the Next.js convention `NEXT_PUBLIC_*` mean for env vars?",
              options: [
                "They're encrypted.",
                "They're injected into the browser bundle — readable by every user. Everything WITHOUT this prefix stays server-only.",
                "They're slower.",
                "They're cached longer.",
              ],
              answer: 1,
              explanation:
                "The prefix is explicit consent: 'I know this will be public.' Default secrets to server-only.",
            },
          ]}
        />
      </LayerSection>
    </>
  );
}
