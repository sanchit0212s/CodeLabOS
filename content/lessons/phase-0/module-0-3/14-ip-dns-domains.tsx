import { LayerSection } from "@/components/lesson/LayerSection";
import { ConceptCard } from "@/components/interactive/ConceptCard";
import { TerminalSim } from "@/components/interactive/TerminalSim";
import { AntiPattern } from "@/components/interactive/AntiPattern";
import { WhereYoullSeeThis } from "@/components/interactive/WhereYoullSeeThis";
import { MasteryCheck } from "@/components/interactive/MasteryCheck";

export default function Lesson14() {
  return (
    <>
      <LayerSection layer="why">
        <p>
          DNS is the most common silent failure in deployed apps. "Why isn't
          my domain working?" is a DNS question 99 times out of 100. Once you
          understand the records and the propagation delay, you'll never again
          assume a domain change is instant.
        </p>
      </LayerSection>

      <LayerSection layer="model">
        <ConceptCard
          front={<>What is DNS?</>}
          back={
            <p className="text-center text-lg">
              <strong>DNS is the internet's phonebook.</strong> It maps human
              names (<code>example.com</code>) to numerical addresses
              (<code>93.184.216.34</code>). Computers route packets by
              IP — humans remember names. DNS is the translation layer.
            </p>
          }
        />
      </LayerSection>

      <LayerSection layer="concept">
        <h2>IP addresses</h2>
        <p>
          Every device on the internet has an IP address. Two formats:
        </p>
        <ul>
          <li>
            <strong>IPv4</strong> — four numbers 0-255, like{" "}
            <code>93.184.216.34</code>. We're running out of these.
          </li>
          <li>
            <strong>IPv6</strong> — eight groups of hex, like{" "}
            <code>2606:2800:220:1:248:1893:25c8:1946</code>. Practically
            infinite.
          </li>
        </ul>

        <h2>The lookup process</h2>
        <p>
          When you type <code>example.com</code>, the resolver checks several
          places in order:
        </p>
        <ol>
          <li>Local DNS cache (browser, then OS).</li>
          <li>Your configured DNS server (often your ISP's, or a public one like 1.1.1.1).</li>
          <li>That server queries higher up the chain until it finds an authoritative answer.</li>
        </ol>

        <TerminalSim
          title="see DNS in action"
          lines={[
            { kind: "cmd", text: "dig example.com +short", annotate: "look up A record" },
            { kind: "out", text: "93.184.216.34" },

            { kind: "cmd", text: "nslookup example.com" },
            { kind: "out", text: "Server: 1.1.1.1" },
            { kind: "out", text: "Address: 93.184.216.34" },

            { kind: "cmd", text: "dig example.com MX +short", annotate: "look up mail server" },
            { kind: "out", text: "0 ." },
          ]}
        />

        <h2>Record types</h2>
        <table>
          <thead><tr><th>Record</th><th>What it does</th></tr></thead>
          <tbody>
            <tr><td><code>A</code></td><td>Maps a name to an IPv4 address.</td></tr>
            <tr><td><code>AAAA</code></td><td>Same, but for IPv6.</td></tr>
            <tr><td><code>CNAME</code></td><td>An alias — "this name is actually another name." Common for subdomains pointing to a host.</td></tr>
            <tr><td><code>MX</code></td><td>Mail server for this domain.</td></tr>
            <tr><td><code>TXT</code></td><td>Free text. Used for verification (Google, SPF, DKIM).</td></tr>
            <tr><td><code>NS</code></td><td>Which DNS servers are authoritative for this domain.</td></tr>
          </tbody>
        </table>

        <h2>TTL — why changes aren't instant</h2>
        <p>
          Every DNS record has a <strong>TTL</strong> (time-to-live, in
          seconds) telling resolvers how long they may cache the answer.
          When you change a record, the old answer keeps getting served until
          caches expire. This is "DNS propagation" — usually minutes, sometimes
          hours. Plan changes accordingly.
        </p>

        <h2>How a custom domain works (the typical case)</h2>
        <p>
          You buy <code>myapp.com</code> from a registrar (Namecheap, Google
          Domains). You set DNS records:
        </p>
        <ul>
          <li>
            <code>A</code> record for the root → your server's IP, or
          </li>
          <li>
            <code>CNAME</code> for <code>www</code> → your hosting provider's
            hostname (e.g. <code>cname.vercel-dns.com</code>).
          </li>
        </ul>
        <p>
          Your hosting provider then answers requests for that hostname.
        </p>
      </LayerSection>

      <LayerSection layer="context">
        <WhereYoullSeeThis
          items={[
            { context: "Vercel/Netlify show 'pending DNS' — they're waiting for your CNAME record to propagate." },
            { file: "1.1.1.1 or 8.8.8.8", context: "Public DNS resolvers. Cloudflare and Google. Used worldwide." },
            { context: "An agent says 'add a TXT record to verify domain ownership' — Google, GitHub, etc do this for security." },
            { file: "/etc/hosts", context: "A local file that overrides DNS for testing. Map names to IPs without involving the internet." },
            { context: "When 'localhost' resolves to 127.0.0.1, your OS read /etc/hosts before doing a DNS query." },
          ]}
        />

        <AntiPattern
          bad={{
            title: "Hardcoding an IP address in app config",
            body: (
              <>
                The agent writes <code>const DB_HOST = "10.0.5.41";</code> in
                config. When that database is moved to a new IP, the app
                breaks until the code is changed.
              </>
            ),
          }}
          good={{
            title: "Use a hostname; let DNS handle the indirection",
            body: (
              <>
                <code>DB_HOST = "db.internal.myapp.com";</code> When the IP
                changes, update the DNS record — no code change, no deploy.
              </>
            ),
          }}
          why={
            <>
              DNS is a layer of indirection. The whole point is that the human
              name stays constant while the IP can change. Hardcoding IPs
              throws away that benefit.
            </>
          }
        />
      </LayerSection>

      <LayerSection layer="gate">
        <MasteryCheck
          lessonN={14}
          questions={[
            {
              kind: "mcq",
              prompt: "What is DNS, in one sentence?",
              options: [
                "A protocol for sending email.",
                "A system that maps domain names to IP addresses.",
                "An encryption layer.",
                "A web framework.",
              ],
              answer: 1,
              explanation: "DNS = Domain Name System. Translates human names to network addresses.",
            },
            {
              kind: "mcq",
              prompt:
                "Which DNS record type maps a name to an IPv4 address?",
              options: ["A", "MX", "CNAME", "TXT"],
              answer: 0,
              explanation: "A record. AAAA is the IPv6 cousin.",
            },
            {
              kind: "mcq",
              prompt:
                "You updated a DNS record but the change hasn't taken effect everywhere. Why?",
              options: [
                "Your DNS provider is broken.",
                "DNS records have a TTL — resolvers cache old values until the TTL expires. This is called DNS propagation.",
                "DNS only updates at midnight.",
                "You need to reboot your server.",
              ],
              answer: 1,
              explanation: "TTL = caching duration. Lower TTL before planned changes to shorten the wait.",
            },
            {
              kind: "fill",
              prompt:
                "Which record type is an alias — 'this name is actually another name'?",
              answers: ["CNAME", "cname"],
              explanation:
                "CNAME. Common when pointing a custom domain to a managed host like Vercel.",
            },
            {
              kind: "mcq",
              prompt:
                "Your AI agent hardcodes a database server's IP `10.0.5.41` directly into the app. The DB later moves to a new IP. What broke?",
              options: [
                "Nothing — IPs are forever.",
                "The app, because it has no way to find the new IP. DNS would have hidden the change behind a stable hostname.",
                "The DNS server.",
                "The OS.",
              ],
              answer: 1,
              explanation:
                "Always use hostnames in config. DNS exists specifically so IPs can change without code changes.",
            },
          ]}
        />
      </LayerSection>
    </>
  );
}
