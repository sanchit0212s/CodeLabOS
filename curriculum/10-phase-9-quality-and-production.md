# Phase 9 — Security, Observability, Performance, Reliability

**Essence:** the non-functional concerns that turn a working SaaS into a
trustworthy SaaS. Most of this has been seeded throughout earlier phases;
Phase 9 consolidates, deepens, and gives the student a "production
audit" toolkit.

**Gate:** given a SaaS codebase + infra, produce a senior-engineer-quality
audit covering: OWASP Top 10 (web + API + LLM); observability (logs,
metrics, traces, alerts); performance (latency budgets, slow queries,
bundle size, frontend Core Web Vitals); reliability (SLOs, redundancy,
backup/DR, runbooks); identify the top 10 risks ranked by likelihood ×
impact.

**Restructuring note:** original scaffold had 14 lessons across 3
modules. Expanded here to ~30 lessons across 5 modules. The major gaps
in the original: real threat modeling, OWASP API Security Top 10
separate from web Top 10, OWASP LLM Top 10, real observability strategy,
incident response in depth.

**Primary references**
- *OWASP Top 10* (web 2021); *OWASP API Security Top 10* (2023);
  *OWASP Top 10 for LLM Applications* (2025).
- *Web Application Hacker's Handbook*, 2nd ed. (Stuttard & Pinto) —
  thorough on web attacks.
- *Real-World Cryptography* (David Wong).
- *Tangled Web* (Michal Zalewski) — browser security model.
- *Threat Modeling: Designing for Security* (Adam Shostack).
- Google's Site Reliability Engineering books (covered Phase 7) — most
  of Phase 9's reliability lessons echo SRE.
- *Observability Engineering* (Charity Majors, Liz Fong-Jones, George
  Miranda).
- *Database Reliability Engineering* (Campbell & Majors).
- *Systems Performance*, 2nd ed. (Brendan Gregg).
- *Designing Data-Intensive Applications* (Kleppmann) ch. 5, 8, 9, 11.
- The Pragmatic Engineer's articles on real production incidents.
- HackerOne / Bugcrowd public disclosures — to read real vulnerabilities.

---

## Module 9.1 — Security audit

### L1 · The web threat model · DEEP · ~70 min
Subtopics: the threat actors (mass exploitation, targeted, insider);
attack surface analysis; trust boundaries; DREAD / STRIDE for classifying
threats; the "every input is hostile until proven otherwise" stance.

### L2 · OWASP Top 10 web (2021) · VERY-DEEP · ~150 min
Walkthrough of each, with code-level mitigations:
1. **Broken Access Control** — authorization bugs (the largest category).
   Examples: IDOR (Insecure Direct Object Reference — guessing URLs to
   access others' data); missing tenant_id checks; client-only checks;
   force-browsing to admin URLs. Mitigation: enforce in middleware AND
   at the data layer (row-level security).
2. **Cryptographic Failures** — weak ciphers, no TLS, storing secrets
   in plaintext, MD5/SHA-1 for passwords, custom crypto. Mitigation:
   TLS 1.2+; argon2id/bcrypt for passwords; AES-256-GCM or KMS; never
   roll your own.
3. **Injection** — SQL injection, NoSQL injection, command injection,
   LDAP injection, header injection, log injection. Mitigation:
   parameterized queries (always), input validation, escape outputs.
4. **Insecure Design** — design-level flaws (e.g., predictable IDs,
   no rate limit on auth, missing MFA). Mitigation: threat modeling.
5. **Security Misconfiguration** — default credentials, verbose errors,
   debug mode in prod, open S3 buckets, missing CSP, permissive CORS.
   Mitigation: secure defaults; configuration linting.
6. **Vulnerable and Outdated Components** — old libs with known CVEs.
   Mitigation: Dependabot/Renovate; SBOM; scheduled audit.
7. **Identification and Authentication Failures** — weak passwords,
   session fixation, missing MFA, tokens in URLs, predictable token
   generation. Mitigation: covered in Phase 5 M5.5.
8. **Software and Data Integrity Failures** — unsigned packages,
   auto-updates without verification, insecure deserialization. Mitigation:
   signed packages, pinned versions, careful pickle/yaml use.
9. **Security Logging and Monitoring Failures** — no logs, no alerts,
   no incident response. Mitigation: cover Phase 7 M7.7.
10. **Server-Side Request Forgery (SSRF)** — your server fetches a URL
    user-supplied, attacker uses it to hit internal services. Mitigation:
    allowlist URLs, block private IP ranges (cloud metadata IP
    169.254.169.254!), DNS rebinding protection.

### L3 · OWASP API Security Top 10 (2023) · DEEP · ~70 min
Walkthrough:
1. Broken Object Level Authorization (BOLA / IDOR) — the #1 API issue.
2. Broken Authentication.
3. Broken Object Property Level Authorization (mass-assignment;
   leaking properties).
4. Unrestricted Resource Consumption (no rate limit, no quota).
5. Broken Function Level Authorization (e.g., admin endpoints without
   role check).
6. Unrestricted Access to Sensitive Business Flows (e.g., scriptable
   abuse like ticket scalping).
7. Server-Side Request Forgery (also in web list).
8. Security Misconfiguration.
9. Improper Inventory Management (forgotten v1 endpoints; staging in
   prod).
10. Unsafe Consumption of APIs (trusting third-party API responses
    without validation).

### L4 · OWASP LLM Top 10 · DEEP · ~70 min
1. Prompt Injection (direct and indirect).
2. Insecure Output Handling (XSS via LLM output; LLM generating SQL/
   shell that you exec).
3. Training Data Poisoning.
4. Model Denial of Service.
5. Supply Chain Vulnerabilities (compromised models or libraries).
6. Sensitive Information Disclosure.
7. Insecure Plugin / Tool Design.
8. Excessive Agency (agent has too much power).
9. Overreliance (humans trust LLM output uncritically).
10. Model Theft.

### L5 · Secrets management revisited · DEEP · ~50 min
Covered partially in Phase 0/2/7. Consolidated: secret types (API
keys, DB passwords, TLS keys, signing keys, encryption keys); storage
(vault, KMS, env-injected at runtime); rotation; access audit; the
"secrets-in-Git scanner" CI gate (gitleaks, truffleHog); incident
response when leaked (rotate, audit access logs, see if exploited);
the "if it's logged, redact it" rule.

### L6 · TLS, certificates, and PKI · DEEP · ~60 min
Subtopics: the TLS handshake in detail; certificate chains (leaf, intermediates,
root); certificate transparency logs; HSTS preload; certificate pinning
(rarely needed in browsers); mTLS for service-to-service; Let's Encrypt /
ACME protocol; cert-manager in K8s; the "always trust the OS / browser
trust store" rule.

### L7 · Encrypted-at-rest and column-level encryption · STANDARD · ~50 min
Subtopics: managed DB encryption (EBS, RDS, S3 SSE — provider-managed
or KMS-managed); when application-level encryption matters (PII, PHI,
financial); envelope encryption pattern; key rotation; the "encrypted
backups" requirement; tokenization for very sensitive fields.

### L8 · DDoS, bots, abuse · STANDARD · ~50 min
Subtopics: AWS Shield / Cloudflare DDoS / GCP Cloud Armor; rate limiting
(covered Phase 5 L32); CAPTCHAs (hCaptcha, Cloudflare Turnstile);
WAF rules; behavioral analysis; client fingerprinting; the "abuse
detection is its own discipline at scale."

### L9 · Threat modeling for SaaS · DEEP · ~60 min
Subtopics: STRIDE per component; data flow diagrams; identifying assets
(PII, financial, secrets, IP); trust boundaries; the "data-flow diagram
+ STRIDE per arrow" exercise; risk register; mitigation tracking.

### L10 · Compliance reality · STANDARD · ~50 min
SOC 2 Type I / II (the engineering-impact items: logging, access control,
encryption, change management, vendor management); GDPR essentials
(right to access, right to delete, lawful basis, DPAs); CCPA basics;
HIPAA for health (BAAs, encryption); PCI-DSS if touching cards (mostly
"don't touch cards, use Stripe"); the "Vanta/Drata/Secureframe" path to
SOC 2 ; the "compliance is not security but they overlap heavily" reality.

---

## Module 9.2 — Observability strategy

### L11 · The observability strategy doctrine · DEEP · ~50 min
"Logs answer 'what happened,' metrics answer 'how is the system
performing,' traces answer 'where did this request go.'" The "high-
cardinality observability" school (Honeycomb-style — make traces +
events your primary signal, derive metrics from them). The "three pillars
are dead, use one wide event store" debate.

### L12 · Choosing an observability stack · STANDARD · ~50 min
The trade-offs:
- **OSS self-hosted**: Grafana stack (Prometheus + Loki + Tempo + Grafana);
  ELK / OpenSearch; Jaeger.
- **Managed all-in-one**: Datadog, New Relic, Dynatrace, Splunk
  (expensive but powerful).
- **Newer / lighter**: Honeycomb (high-card events), Grafana Cloud,
  Better Stack, Axiom (events at scale).
- **Cloud-native**: CloudWatch + X-Ray (AWS), Cloud Operations (GCP).

The "OpenTelemetry standard, vendor flexibility" position.

### L13 · The data model for observability · STANDARD · ~50 min
Wide events (one row per request with all attributes); the "log structured
events, not lines" practice; "every event has a trace_id" linking everything.

### L14 · Service level objectives (SLOs) in practice · DEEP · ~60 min
Subtopics: defining the SLI (e.g., "% of requests with status 2xx and
latency <500ms over 30 days"); setting the SLO (e.g., 99.9%); the error
budget (8h 40m / 30 days at 99.9%); error-budget-burn-rate alerts
(faster burn = more urgent page); the "freeze releases when budget
exhausted" mechanism. References: Google SRE Workbook ch. 1-4.

### L15 · Runbooks and on-call · STANDARD · ~40 min
Subtopics: every alert has a runbook (or it's not actionable); runbook
template (symptom, suspected cause, immediate mitigation, deeper
investigation, when to escalate); on-call rotations (PagerDuty / Opsgenie);
the handoff ritual; sustainable on-call (no single point of failure).

### L16 · Incident response process · DEEP · ~50 min
Already covered partially in Phase 7. Consolidated into a runbook:
detect → declare → coordinate → mitigate → resolve → review.

### L17 · Postmortems and learning culture · STANDARD · ~40 min
Already covered Phase 7. The "action items have owners and dates" rule;
the postmortem distribution (read by the org, learn from each other).

---

## Module 9.3 — Performance

### L18 · The performance discipline · STANDARD · ~40 min
"Measure first, optimize second" doctrine; the "find the right thing
to optimize" matters more than how; the "premature optimization is the
root of all evil" caveat (Knuth, in context); user-perceived performance
vs system metric.

### L19 · Latency vs throughput · STANDARD · ~30 min
Latency = time for one operation. Throughput = operations per second.
You can trade one for the other (queueing increases throughput while
worsening latency).

### L20 · Profiling techniques · DEEP · ~70 min
Subtopics: CPU profiling (py-spy, cProfile, Linux perf, gprofiler);
flame graphs (Brendan Gregg's invention); memory profiling
(memray, tracemalloc, heaptrack); allocation profiling; the "find the
hot function" loop; sampling vs instrumented profiling; production
continuous profiling (Datadog Profiler, Pyroscope, Polar Signals,
Google Cloud Profiler); the "you didn't profile, you guessed" rule.

### L21 · Database query optimization at depth · DEEP · ~70 min
Covered in Phase 4. Consolidated: pg_stat_statements; EXPLAIN ANALYZE;
the index decision tree; query rewriting; caching at the application
layer; read replicas; partitioning; the slow-query log → top offender →
EXPLAIN → fix cycle.

### L22 · Frontend performance deep · DEEP · ~70 min
Covered in Phase 6 M6.8. Consolidated: LCP / INP / CLS targets; bundle
size budget; lazy-load discipline; image optimization (modern formats,
responsive srcset, lazy loading); critical CSS; font-display: swap;
service worker for repeat visits; predicting INP from JS execution time
on slow devices.

### L23 · Caching strategies at scale · DEEP · ~60 min
Layers: browser → CDN → reverse proxy → application → database. Cache
keys carefully (include all variants — user, locale, version). Cache
invalidation (the famous hard problem). Stale-while-revalidate (browser
+ CDN headers; SWR in React). Single-flight to prevent stampede.
Negative caching (cache the 404). The "cache is a liability if it serves
stale or wrong data" reality.

### L24 · Load testing and capacity planning · STANDARD · ~50 min
Tools: k6, Locust, Artillery, Vegeta. The "test your system, not your
test rig" rule. Realistic test data. Synthetic vs replay. The "go from
1x to 10x load" experiment. Capacity planning from p95 latency under
expected peak load.

### L25 · The big-O intuition (without LeetCode) · STANDARD · ~40 min
Recognize O(1), O(log n), O(n), O(n log n), O(n²), O(2^n). The "nested
loop = O(n²) = bad in a request handler" instinct. Big-O of common
operations on arrays / dicts / sets. The "this looks fine for n=10 but
explodes at n=10000" mental check.

---

## Module 9.4 — Reliability engineering

### L26 · Redundancy and failover · STANDARD · ~50 min
Multi-AZ vs single-AZ. The "no single point of failure" doctrine.
Active-passive vs active-active. Failover testing (and the "you didn't
test your failover" disaster).

### L27 · Backup and disaster recovery in practice · STANDARD · ~50 min
Covered Phase 7. Consolidated: the 3-2-1 rule; cross-region backup;
restoration tested on a schedule; the runbook.

### L28 · The "shipped on Friday" reality · LIGHT · ~30 min
Cultural lesson: deploy frequently to small audiences, not rarely to
everyone; the "Friday deploy" debate has a real answer (CI + canary +
fast rollback = Friday is fine; manual processes + bad rollback = no
Friday deploy).

### L29 · Chaos engineering at SaaS scale · LIGHT · ~30 min
"Inject failure deliberately." When it pays off (you're at scale, have
HA assertions). When it doesn't (you're still figuring out what to
build).

---

## Module 9.5 — The production audit

### L30 · The 50-point audit checklist · VERY-DEEP · ~150 min
A consolidated checklist the orchestrator runs on any SaaS — yours,
the agent's, an acquired company's. Covers:

**Security**
- TLS enforced everywhere?
- Secrets in vault, not in repo?
- HSTS preload?
- CSP set?
- Strict CORS (no `*` with credentials)?
- Rate limits on auth + sensitive endpoints?
- MFA available?
- Password hashing with bcrypt/argon2id?
- SQL parameterized?
- Authz checked on every protected endpoint at server side?
- Tenant isolation in all queries?
- SSRF protections (no fetching arbitrary user URLs server-side)?
- Dependency vulnerability scan in CI?
- Image scanning?
- SAST in CI?

**Observability**
- Structured logs to a central store?
- Request IDs propagated?
- Latency metrics per endpoint (p50/p95/p99)?
- Error rate metrics per endpoint?
- 5xx alerts that page?
- Trace coverage for slow / mysterious paths?
- Error tracker (Sentry) configured?
- Synthetic monitoring on critical paths?

**Performance**
- Slow query log enabled?
- Top 10 slow queries reviewed?
- N+1 patterns audited?
- Caching layers documented?
- Frontend bundle size within budget?
- Core Web Vitals green for top pages?
- Load tested to expected peak?

**Reliability**
- SLO defined and tracked?
- DB backups taken AND restorability tested?
- Multi-AZ for stateful services?
- Runbooks for every paging alert?
- Postmortem culture? (or: how was the last incident handled?)
- Deploys can roll back fast?
- Feature flags for risky changes?

**Code quality**
- Tests cover the critical paths?
- CI gates lint, typecheck, test, build, security scan?
- PR review required, with at least one approver?
- Documentation for onboarding a new developer?
- A "shitlist" of known tech debt items is maintained?

The list is the practical artifact this whole phase produces.

---

## Phase 9 cross-thread coverage

Phase 9 IS the cross-thread phase — it threads back through the others.

## What Phase 9 doesn't cover (deferred)

- The orchestrator's meta-skill of running this on AI agents — Phase 10.
