import { LayerSection } from "@/components/lesson/LayerSection";
import { ConceptCard } from "@/components/interactive/ConceptCard";
import { Diagram, DBox, DArrow } from "@/components/interactive/Diagram";
import { AntiPattern } from "@/components/interactive/AntiPattern";
import { WhereYoullSeeThis } from "@/components/interactive/WhereYoullSeeThis";
import { MasteryCheck } from "@/components/interactive/MasteryCheck";

export default function Lesson13() {
  return (
    <>
      <LayerSection layer="why">
        <p>
          Every web app your AI agent builds for you will be a participant in
          this dance. When something is slow, broken, or not loading, the cause
          is always at one of the steps below. Knowing the steps is a checklist
          you'll run for the rest of your career.
        </p>
      </LayerSection>

      <LayerSection layer="model">
        <ConceptCard
          front={
            <>You type <code>example.com</code> and press Enter. What happens?</>
          }
          back={
            <p className="text-center text-lg">
              Seven things, in order:<br />
              <strong>parse → DNS → TCP → TLS → request → response → render</strong>
            </p>
          }
        />

        <Diagram caption="The seven steps. Memorize these once and you can debug almost any web problem.">
          <ol className="space-y-2 w-full max-w-md font-mono text-[13px]">
            <li className="flex gap-3"><span className="text-accent w-6">01</span><span><strong>Parse</strong> the URL into pieces (scheme, host, path).</span></li>
            <li className="flex gap-3"><span className="text-accent w-6">02</span><span><strong>DNS</strong>: turn the host into an IP address.</span></li>
            <li className="flex gap-3"><span className="text-accent w-6">03</span><span><strong>TCP</strong>: open a connection to that IP on port 80 or 443.</span></li>
            <li className="flex gap-3"><span className="text-accent w-6">04</span><span><strong>TLS</strong> (if https): establish encryption.</span></li>
            <li className="flex gap-3"><span className="text-accent w-6">05</span><span><strong>Send</strong> an HTTP request.</span></li>
            <li className="flex gap-3"><span className="text-accent w-6">06</span><span><strong>Receive</strong> an HTTP response.</span></li>
            <li className="flex gap-3"><span className="text-accent w-6">07</span><span><strong>Render</strong> the HTML, then fetch CSS / JS / images as needed.</span></li>
          </ol>
        </Diagram>
      </LayerSection>

      <LayerSection layer="concept">
        <h2>Step 1 — Parse the URL</h2>
        <p>A URL is made of pieces:</p>
        <pre>{`https://api.example.com:443/users/42?expand=true#bio
└─┬─┘   └────────┬─────┘ └┬┘ └─┬───┘ └────┬───┘ └┬┘
scheme    host         port path   query    fragment`}</pre>
        <ul>
          <li><strong>scheme</strong>: <code>https</code> vs <code>http</code>.</li>
          <li><strong>host</strong>: the server name.</li>
          <li><strong>port</strong> (often hidden): which door on the server (80 for http, 443 for https).</li>
          <li><strong>path</strong>: what resource you want.</li>
          <li><strong>query</strong>: extra parameters after <code>?</code>.</li>
          <li><strong>fragment</strong>: client-side only; never sent to the server.</li>
        </ul>

        <h2>Step 2 — DNS lookup</h2>
        <p>
          The browser doesn't know what "api.example.com" means at the network
          level. It asks a DNS server: "What IP is this host?" and gets back
          something like <code>93.184.216.34</code>. Cached aggressively.
          (Lesson 14 goes deep.)
        </p>

        <h2>Step 3 — TCP connection</h2>
        <p>
          The OS opens a TCP connection — a reliable, ordered byte stream — to
          that IP on the right port. This takes one network round trip (the
          "three-way handshake"). Fast networks: a few milliseconds. Slow
          networks: 100+ ms.
        </p>

        <h2>Step 4 — TLS handshake (only for https)</h2>
        <p>
          The server proves its identity with a certificate, and the two sides
          agree on encryption keys. This takes a few more round trips. From
          here on, nobody in the middle can read the bytes flying past.
        </p>

        <h2>Step 5 — Send the HTTP request</h2>
        <p>
          The browser sends a request like:
        </p>
        <pre>{`GET /users/42?expand=true HTTP/1.1
Host: api.example.com
Accept: text/html
Cookie: session=abc123`}</pre>

        <h2>Step 6 — Receive the response</h2>
        <p>
          The server sends back a status code, headers, and a body:
        </p>
        <pre>{`HTTP/1.1 200 OK
Content-Type: text/html
Content-Length: 1234

<!doctype html><html>…`}</pre>

        <h2>Step 7 — Render</h2>
        <p>
          The browser parses the HTML, then makes more requests for every
          stylesheet, script, image, and font referenced inside. Each of those
          repeats steps 2-6 (DNS may be cached). This is why a "single page
          load" can be hundreds of requests.
        </p>

        <h2>Why this matters</h2>
        <p>
          When a site is slow, the slowness is at exactly one of these steps.
          Browser DevTools' Network tab visualizes each step's duration. If
          DNS is 1500ms, your domain has a problem. If TLS is 800ms, your
          certificate or CDN is misconfigured. Etc.
        </p>
      </LayerSection>

      <LayerSection layer="context">
        <WhereYoullSeeThis
          items={[
            { context: "Browser DevTools → Network tab shows each step's time on the 'Waterfall'. Knowing the seven steps lets you debug it." },
            { file: "process.env.PORT", context: "The port your Node server listens on — step 3 in this lesson." },
            { context: "An agent says 'we need a CDN' — moves step 7's static assets closer to users so they load faster." },
            { context: "Cert expired errors block step 4 (TLS). Site shows 'Your connection is not private' in red." },
            { context: "An agent's app 'works on localhost but not in production' — the bug is usually in DNS (wrong host), TLS (cert), or CORS (response headers)." },
          ]}
        />

        <AntiPattern
          bad={{
            title: "Treating a slow site as one mystery problem",
            body: (
              <>
                The agent says "the site is slow, I'll add caching." But the
                slowness is in DNS (taking 2 seconds). Caching the HTML
                fixes nothing.
              </>
            ),
          }}
          good={{
            title: "Open DevTools, find which step is slow, fix THAT step",
            body: (
              <>
                Each of the seven steps has its own fixes. DNS slow? Move to
                a faster provider. TLS slow? Enable HTTP/2 or 0-RTT. Server
                slow? That's a backend problem. Targeted fixes only.
              </>
            ),
          }}
          why={
            <>
              "Slow" has seven possible causes. Caching everything is the
              shotgun. The orchestrator's value is forcing the diagnosis
              before the fix.
            </>
          }
        />
      </LayerSection>

      <LayerSection layer="gate">
        <MasteryCheck
          lessonN={13}
          questions={[
            {
              kind: "mcq",
              prompt: "In the URL `https://api.example.com:443/users/42?expand=true`, what is `users/42`?",
              options: ["The host", "The path", "The query", "The fragment"],
              answer: 1,
              explanation:
                "Path = what resource you want, after the host. The query (`?expand=true`) is the extra parameters.",
            },
            {
              kind: "fill",
              prompt:
                "What three-letter system turns a domain like `example.com` into an IP address?",
              answers: ["DNS", "dns"],
              explanation:
                "Domain Name System. Step 2 of the seven steps.",
            },
            {
              kind: "mcq",
              prompt: "What does the TLS handshake do (step 4)?",
              options: [
                "Compresses the response.",
                "Authenticates the server and establishes encryption keys.",
                "Caches the page.",
                "Translates the domain to an IP.",
              ],
              answer: 1,
              explanation:
                "TLS = the 's' in https. Identity + encryption. Happens once per connection.",
            },
            {
              kind: "multi",
              prompt:
                "Your AI agent says 'the site is slow.' Which step would you check FIRST in DevTools to narrow it down?",
              options: [
                "DNS lookup time",
                "TLS handshake time",
                "Time to first byte (the server's processing time)",
                "Resource download time",
              ],
              answer: [0, 1, 2, 3],
              explanation:
                "All of them. The whole point: 'slow' has many causes. DevTools breaks the load into these phases so you can pinpoint which one.",
            },
            {
              kind: "mcq",
              prompt:
                "Why do single page loads often result in hundreds of network requests?",
              options: [
                "Bugs.",
                "Step 7 (render) parses the HTML and makes more requests for every CSS, JS, image, and font referenced inside.",
                "The browser is malware.",
                "Caching.",
              ],
              answer: 1,
              explanation:
                "A web page is a 'recipe' that links to dozens of other files. Each link is another request.",
            },
          ]}
        />
      </LayerSection>
    </>
  );
}
